import { useCallback, useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../../../api/applicationApi';
import { useApplication } from '../../../hooks/useApplication';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Loading } from '../../../components/common/Loading';
import type { Application } from '../../../types/application';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type CameraPhase = 'idle' | 'starting' | 'live' | 'captured';

const getUploadErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return 'Something went wrong while uploading your selfie. Please try again.';
  }

  switch (error.response?.status) {
    case 400:
      return 'The selfie could not be accepted. Please retake it and try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You are not allowed to upload a selfie for this application.';
    case 404:
      return 'The current application could not be found.';
    default:
      return error.response && error.response.status >= 500
        ? 'The selfie service is temporarily unavailable. Please try again later.'
        : 'Something went wrong while uploading your selfie. Please try again.';
  }
};

const getCameraErrorMessage = (error: unknown): string => {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return 'Camera access is required to take your selfie.';
    }
    if (error.name === 'NotFoundError' || error.name === 'OverconstrainedError') {
      return 'Your camera is not available.';
    }
    if (error.name === 'NotReadableError' || error.name === 'AbortError') {
      return "We couldn't access your camera. Please check your browser permissions.";
    }
  }
  return "We couldn't access your camera. Please check your browser permissions.";
};

export const Selfie: React.FC = () => {
  const navigate = useNavigate();
  const { application, isLoading: isApplicationLoading, refetch } = useApplication();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [phase, setPhase] = useState<CameraPhase>('idle');
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setCapturedFile(null);
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const attachStream = useCallback(async () => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;
    if (video.srcObject !== stream) video.srcObject = stream;
    await video.play();
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    clearPreview();
    setPhase('starting');
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setPhase('idle');
      setError('Your camera is not available.');
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
      } catch (firstError) {
        if (
          firstError instanceof DOMException &&
          (firstError.name === 'NotAllowedError' || firstError.name === 'PermissionDeniedError')
        ) {
          throw firstError;
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setPhase('live');
      await attachStream();
    } catch (cameraError) {
      stopCamera();
      setPhase('idle');
      setError(getCameraErrorMessage(cameraError));
    }
  }, [attachStream, clearPreview, stopCamera]);

  useEffect(() => {
    if (phase === 'live' || phase === 'starting') {
      void attachStream();
    }
  }, [attachStream, phase]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, [stopCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || phase !== 'live' || !video.videoWidth || !video.videoHeight) {
      setError('The camera is not ready yet. Please wait a moment and try again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      setError('We could not capture your selfie. Please try again.');
      return;
    }

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        setError('We could not capture your selfie. Please try again.');
        return;
      }

      if (blob.size > MAX_FILE_SIZE) {
        setError('Your selfie must be 5 MB or smaller. Please retake it.');
        return;
      }

      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      stopCamera();
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const nextPreview = URL.createObjectURL(file);
      previewUrlRef.current = nextPreview;
      setCapturedFile(file);
      setPreviewUrl(nextPreview);
      setPhase('captured');
      setError(null);
    }, 'image/jpeg', 0.92);
  };

  const handleRetake = () => {
    void startCamera();
  };

  const handleUseSelfie = async () => {
    if (isSubmitting) return;

    if (!capturedFile) {
      setError('Take a selfie before uploading.');
      return;
    }

    if (!application) {
      setError('No active application was found. Return to the dashboard and try again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      stopCamera();
      const updatedApplication = await applicationApi.uploadSelfie(application.id, capturedFile);
      await refetch();
      setSubmittedApplication(updatedApplication);
    } catch (uploadError) {
      setError(getUploadErrorMessage(uploadError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isApplicationLoading) return <Loading />;

  if (submittedApplication) {
    return (
      <main className="workflow-page">
        <section className="workflow-card workflow-result" aria-live="polite">
          <span className="workflow-eyebrow">Selfie uploaded</span>
          <h1>Your selfie was uploaded</h1>
          <p>Your application has moved to the next backend stage for review.</p>
          <p className="workflow-result-next">Current stage: {submittedApplication.currentStage.replace(/_/g, ' ')}</p>
          <button type="button" className="btn btn-primary workflow-submit" onClick={() => navigate('/dashboard')}>
            Continue to Dashboard
          </button>
        </section>
      </main>
    );
  }

  const cameraStatus =
    phase === 'starting'
      ? 'Opening your camera...'
      : phase === 'live'
        ? 'Camera ready'
        : phase === 'captured'
          ? 'Selfie captured'
          : 'Camera off';

  return (
    <main className="workflow-page">
      <section className="workflow-card">
        <button type="button" className="workflow-back" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </button>

        <header className="workflow-header">
          <span className="workflow-eyebrow">Selfie verification</span>
          <h1>Take a clear selfie to verify your identity.</h1>
          <p>Take a clear selfie using your camera.</p>
        </header>

        <section className="workflow-info" aria-labelledby="selfie-help-heading">
          <h2 id="selfie-help-heading">Before you start</h2>
          <p>Look directly at the camera and keep your face clearly visible. Use good lighting and remove sunglasses or masks.</p>
          <p>Nothing is uploaded until you choose Use This Selfie.</p>
        </section>

        {!application && (
          <ErrorMessage message="No active application was found. Return to the dashboard and try again." />
        )}

        {error && <ErrorMessage message={error} />}

        <div className="selfie-form">
          <div className="selfie-camera" aria-label="Selfie camera">
            {phase === 'captured' && previewUrl ? (
              <img className="selfie-camera-video" src={previewUrl} alt="Captured selfie preview" />
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="selfie-camera-video"
                  autoPlay
                  muted
                  playsInline
                  hidden={phase !== 'live'}
                />
                {phase !== 'live' && (
                  <div className="selfie-camera-placeholder">
                    {phase === 'starting' ? 'Opening your camera...' : 'Camera preview will appear here'}
                  </div>
                )}
              </>
            )}
            <p className="selfie-camera-status">{isSubmitting ? 'Uploading...' : cameraStatus}</p>
            <canvas ref={canvasRef} className="selfie-canvas" aria-hidden="true" />
          </div>

          <div className="selfie-actions">
            {phase !== 'captured' && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => void startCamera()}
                disabled={!application || isSubmitting || phase === 'starting'}
              >
                Open Camera
              </button>
            )}
            {phase === 'live' && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleCapture}
                disabled={isSubmitting}
              >
                Take Selfie
              </button>
            )}
            {phase === 'captured' && (
              <>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleRetake}
                  disabled={isSubmitting}
                >
                  Retake
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => void handleUseSelfie()}
                  disabled={isSubmitting || !capturedFile}
                >
                  {isSubmitting ? 'Uploading...' : 'Use This Selfie'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
