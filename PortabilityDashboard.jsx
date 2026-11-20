/**
 * PIVOT Portability Plus - Main Dashboard Component
 * 6-step workflow for health insurance portability decisioning
 */

import React, { useState, useEffect } from 'react';
import StepIndicator from './StepIndicator';
import Step1Upload from './Step1Upload';
import Step2Extract from './Step2Extract';
import Step3AppData from './Step3AppData';
import Step4Anomalies from './Step4Anomalies';
import Step5Fraud from './Step5Fraud';
import Step6Recommendation from './Step6Recommendation';
import ReportViewer from './ReportViewer';

export default function PortabilityDashboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [caseId, setCaseId] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [demoData, setDemoData] = useState(null);

  const steps = [
    { number: 1, title: 'Upload Policy', component: Step1Upload },
    { number: 2, title: 'Extract Data', component: Step2Extract },
    { number: 3, title: 'Application Data', component: Step3AppData },
    { number: 4, title: 'Anomaly Detection', component: Step4Anomalies },
    { number: 5, title: 'Fraud Analysis', component: Step5Fraud },
    { number: 6, title: 'Recommendation', component: Step6Recommendation }
  ];

  // Load demo data on mount
  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    try {
      const response = await fetch('/api/portability/demo-data');
      const result = await response.json();
      if (result.success) {
        setDemoData(result);
      }
    } catch (err) {
      console.error('Error loading demo data:', err);
    }
  };

  const handleCreateNewCase = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/portability/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policyId: 'POL_2024_001',
          applicantId: 'APL_001'
        })
      });

      const result = await response.json();
      if (result.success) {
        setCaseId(result.caseId);
        setCaseData(result.case);
        setCurrentStep(1);
      }
    } catch (err) {
      setError('Failed to create case: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCase = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/portability/case/${id}`);
      const result = await response.json();

      if (result.success) {
        setCaseId(id);
        setCaseData(result.case);
        // Auto-advance to next incomplete step
        const nextIncompleteStep = steps.findIndex(s => !result.case.steps[s.title.toLowerCase().replace(' ', '')].completed) + 1;
        setCurrentStep(nextIncompleteStep > 0 ? nextIncompleteStep : 6);
      }
    } catch (err) {
      setError('Failed to fetch case: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = (stepNumber, data) => {
    // Update local case data
    const updatedCase = { ...caseData };
    const stepKey = steps[stepNumber - 1].title.toLowerCase().replace(' ', '');

    if (updatedCase.steps[stepKey]) {
      updatedCase.steps[stepKey].completed = true;
      updatedCase.steps[stepKey].data = data;
    }

    setCaseData(updatedCase);

    // Move to next step if not on last step
    if (stepNumber < steps.length) {
      setCurrentStep(stepNumber + 1);
    } else {
      setShowReport(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCaseId(null);
    setCaseData(null);
    setCurrentStep(1);
    setError(null);
    setShowReport(false);
  };

  // Render step component
  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>PIVOT Portability Plus</h1>
        <p style={styles.subtitle}>Health Insurance Portability Decisioning Platform</p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {/* Main Content */}
      {!caseId || showReport ? (
        <div style={styles.mainContent}>
          {showReport && caseData ? (
            <>
              <ReportViewer caseId={caseId} caseData={caseData} />
              <div style={styles.buttonGroup}>
                <button style={styles.primaryButton} onClick={handleReset}>
                  New Case
                </button>
              </div>
            </>
          ) : (
            <div style={styles.welcomeSection}>
              <h2 style={styles.sectionTitle}>Get Started</h2>

              {!demoData ? (
                <p style={styles.loadingText}>Loading demo data...</p>
              ) : (
                <>
                  <div style={styles.buttonGroup}>
                    <button
                      style={styles.primaryButton}
                      onClick={handleCreateNewCase}
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create New Case'}
                    </button>
                  </div>

                  <div style={styles.demoDataSection}>
                    <h3 style={styles.demoTitle}>Available Test Data</h3>

                    <div style={styles.dataGrid}>
                      <div style={styles.dataCard}>
                        <h4>Policies Available</h4>
                        <p>{demoData.policies?.length || 0} sample policies</p>
                        {demoData.policies?.map((p, i) => (
                          <p key={i} style={styles.dataItem}>
                            • {p.insurer} ({p.policyNumber})
                          </p>
                        ))}
                      </div>

                      <div style={styles.dataCard}>
                        <h4>Applications Available</h4>
                        <p>{demoData.applications?.length || 0} sample applications</p>
                        {demoData.applications?.map((a, i) => (
                          <p key={i} style={styles.dataItem}>
                            • {a.applicantName} (ID: {a.applicantId})
                          </p>
                        ))}
                      </div>
                    </div>

                    <div style={styles.infoBox}>
                      <p style={styles.infoText}>
                        <strong>Demo Cases:</strong> Enter a case ID below to continue an existing case, or click "Create New Case" to start a new portability analysis.
                      </p>
                      <div style={styles.caseInputGroup}>
                        <input
                          type="text"
                          placeholder="Enter Case ID (e.g., POL_2024_001)"
                          style={styles.caseInput}
                          id="caseIdInput"
                        />
                        <button
                          style={styles.secondaryButton}
                          onClick={() => {
                            const input = document.getElementById('caseIdInput');
                            if (input.value) {
                              handleFetchCase(input.value);
                            }
                          }}
                        >
                          Load Case
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={styles.workflowContainer}>
          {/* Step Indicator */}
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            completedSteps={Object.values(caseData.steps).filter(s => s.completed).length}
          />

          {/* Step Content */}
          <div style={styles.stepContent}>
            <CurrentStepComponent
              caseId={caseId}
              caseData={caseData}
              onStepComplete={(data) => handleStepComplete(currentStep, data)}
              demoData={demoData}
            />
          </div>

          {/* Step Navigation */}
          <div style={styles.stepNavigation}>
            <button
              style={styles.secondaryButton}
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              ← Previous
            </button>

            <span style={styles.stepCounter}>
              Step {currentStep} of {steps.length}
            </span>

            {currentStep < steps.length ? (
              <button
                style={styles.primaryButton}
                onClick={handleNextStep}
                disabled={!caseData?.steps[Object.keys(caseData.steps)[currentStep - 1]]?.completed}
              >
                Next →
              </button>
            ) : (
              <button
                style={styles.successButton}
                onClick={() => setShowReport(true)}
              >
                View Report
              </button>
            )}
          </div>

          {/* Case Info */}
          <div style={styles.caseInfo}>
            <span>Case ID: {caseId}</span>
            <span>Status: {caseData.status}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <p>PIVOT Portability Plus v1.0 | Industry-agnostic Health Insurance Portability Platform</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7fa',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    backgroundColor: '#1a5f7a',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: '700'
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9
  },
  mainContent: {
    flex: 1,
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  workflowContainer: {
    flex: 1,
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column'
  },
  stepContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  stepNavigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px'
  },
  stepCounter: {
    fontSize: '14px',
    color: '#666'
  },
  welcomeSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    fontSize: '24px',
    color: '#1a5f7a',
    marginTop: 0,
    marginBottom: '20px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px'
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#1a5f7a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  successButton: {
    padding: '12px 24px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  demoDataSection: {
    marginTop: '40px',
    paddingTop: '40px',
    borderTop: '1px solid #eee'
  },
  demoTitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '20px'
  },
  dataGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  dataCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    padding: '16px',
    border: '1px solid #e5e7eb'
  },
  dataItem: {
    margin: '6px 0',
    fontSize: '13px',
    color: '#666'
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderLeft: '4px solid #3b82f6',
    padding: '16px',
    borderRadius: '4px'
  },
  infoText: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#333'
  },
  caseInputGroup: {
    display: 'flex',
    gap: '8px'
  },
  caseInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px'
  },
  caseInfo: {
    backgroundColor: 'white',
    padding: '12px 16px',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#666',
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '4px',
    margin: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  errorIcon: {
    fontSize: '18px'
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: '40px 20px'
  },
  footer: {
    backgroundColor: '#f3f4f6',
    borderTop: '1px solid #e5e7eb',
    padding: '20px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#666'
  }
};
