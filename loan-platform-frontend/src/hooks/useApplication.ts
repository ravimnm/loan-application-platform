import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { applicationApi } from '../api/applicationApi';
import type { Application } from '../types/application';
import { storage } from '../utils/storage';

const getHttpStatus = (err: unknown): number | undefined => {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response?: { status?: number } }).response;
    return response?.status;
  }

  return undefined;
};

const getHttpMessage = (err: unknown): string | null => {
  if (!err || typeof err !== 'object' || !('response' in err)) {
    return null;
  }

  const response = (
    err as {
      response?: {
        data?: unknown;
      };
    }
  ).response;

  const data = response?.data;

  if (typeof data === 'string') {
    return data;
  }

  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof (data as { message?: unknown }).message === 'string'
  ) {
    return (data as { message: string }).message;
  }

  return null;
};

export const useApplication = () => {
  const { isAuthenticated } = useAuth();

  const [application, setApplication] =
    useState<Application | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const creatingRef = useRef(false);

  const loadCurrentApplication =
    useCallback(async (): Promise<Application | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const app =
          await applicationApi.getCurrentApplication();

        setApplication(app);
        storage.setApplicationId(app.id);

        return app;
      } catch (err: unknown) {
        setApplication(null);
        storage.removeApplicationId();

        if (getHttpStatus(err) === 404) {
          setError(null);
          return null;
        }

        setError(
          getHttpMessage(err) ??
          'Failed to load application'
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const app =
          await applicationApi.getCurrentApplication();

        if (!active) return;

        setApplication(app);
        storage.setApplicationId(app.id);
      } catch (err: unknown) {
        if (!active) return;

        setApplication(null);
        storage.removeApplicationId();

        if (getHttpStatus(err) === 404) {
          setError(null);
        } else {
          setError(
            getHttpMessage(err) ??
            'Failed to load application'
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const createApplication =
    async (): Promise<Application | null> => {

      if (creatingRef.current) {
        return application;
      }

      try {
        creatingRef.current = true;

        setIsLoading(true);
        setError(null);

        const created =
          await applicationApi.createApplication();

        storage.setApplicationId(created.id);

        const app =
          await applicationApi.getCurrentApplication();

        setApplication(app);
        storage.setApplicationId(app.id);

        return app;

      } catch (err: unknown) {

        const message =
          getHttpMessage(err);

        setError(
          message ??
          'Unable to start an application. Please try again.'
        );

        return null;

      } finally {
        creatingRef.current = false;
        setIsLoading(false);
      }
    };

  return {
    application,
    isLoading,
    error,
    refetch: loadCurrentApplication,
    createApplication,
  };
};