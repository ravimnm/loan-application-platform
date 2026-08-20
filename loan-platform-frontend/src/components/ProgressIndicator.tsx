import type { ApplicationStage } from '../types/application';
import '../styles/ProgressIndicator.css';

interface ProgressIndicatorProps {
  currentStage: ApplicationStage;
}

const ALL_STAGES: Array<{ stage: ApplicationStage; label: string; description: string }> = [
  { stage: 'KYC', label: 'KYC', description: 'Know Your Customer' },
  { stage: 'ELIGIBILITY', label: 'Eligibility', description: 'Credit assessment' },
  { stage: 'EMI_SELECTION', label: 'EMI Selection', description: 'Choose loan terms' },
  { stage: 'BANK_ACCOUNT', label: 'Bank Account', description: 'Disbursement details' },
  { stage: 'DECLARATION', label: 'Declaration', description: 'Legal agreement' },
  { stage: 'SELFIE', label: 'Selfie', description: 'Identity verification' },
  { stage: 'ADMIN_REVIEW', label: 'Admin Review', description: 'Application review' },
  { stage: 'DISBURSEMENT', label: 'Disbursement', description: 'Funds transfer' },
  { stage: 'COMPLETED', label: 'Completed', description: 'Workflow completed' }
];

const getStageIndex = (stage: ApplicationStage): number => {
  return ALL_STAGES.findIndex((s) => s.stage === stage);
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStage }) => {
  const currentIndex = getStageIndex(currentStage);
  const completedThroughIndex =
    currentStage === 'COMPLETED'
      ? ALL_STAGES.length - 1
      : currentIndex - 1;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h3 className="progress-title">Application Progress</h3>
        <span className="progress-status">
          Step {currentIndex + 1} of {ALL_STAGES.length}
        </span>
      </div>

      <div className="progress-timeline">
        {ALL_STAGES.map((item, index) => {
          const isCompleted = index <= completedThroughIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={item.stage} className="progress-stage">
              <div
                className={`stage-dot ${
                  isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <div className={`stage-label ${isCurrent ? 'active' : ''}`}>
                <div className="stage-name">{item.label}</div>
                <div className="stage-description">{item.description}</div>
              </div>
              {index < ALL_STAGES.length - 1 && (
                <div
                  className={`stage-connector ${isCompleted || isCurrent ? 'completed' : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="progress-legend">
        <div className="legend-item">
          <div className="legend-dot completed">✓</div>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot current">•</div>
          <span>Current Step</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot upcoming">•</div>
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
};
