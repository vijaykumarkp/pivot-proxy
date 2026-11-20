/**
 * Step Progress Indicator Component
 */

import React from 'react';

export default function StepIndicator({ steps, currentStep, completedSteps }) {
  return (
    <div style={styles.container}>
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${(completedSteps / steps.length) * 100}%`
          }}
        />
      </div>

      <div style={styles.stepsGrid}>
        {steps.map((step, index) => {
          const isCompleted = index < completedSteps;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} style={styles.stepWrapper}>
              <div
                style={{
                  ...styles.stepCircle,
                  backgroundColor: isCurrent ? '#1a5f7a' : isCompleted ? '#22c55e' : '#e5e7eb',
                  color: isCurrent || isCompleted ? 'white' : '#666'
                }}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <div style={styles.stepLabel}>{step.title}</div>
            </div>
          );
        })}
      </div>

      <div style={styles.stats}>
        <span style={styles.stat}>Progress: {Math.round((completedSteps / steps.length) * 100)}%</span>
        <span style={styles.stat}>Completed: {completedSteps}/{steps.length}</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  progressBar: {
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    marginBottom: '24px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    transition: 'width 0.3s ease'
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  },
  stepWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  stepCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  stepLabel: {
    fontSize: '12px',
    textAlign: 'center',
    color: '#666',
    maxWidth: '100px'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#999',
    paddingTop: '12px',
    borderTop: '1px solid #f0f0f0'
  },
  stat: {
    display: 'flex',
    alignItems: 'center'
  }
};
