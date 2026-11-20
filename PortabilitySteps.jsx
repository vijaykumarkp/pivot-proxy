/**
 * PIVOT Portability Plus - Step Components
 * Individual components for each step of the workflow
 */

import React, { useState } from 'react';

/**
 * Step 1: Upload Policy Document
 */
export function Step1Upload({ caseId, caseData, onStepComplete, demoData }) {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async () => {
    if (!selectedPolicy) {
      alert('Please select a policy');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/portability/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          fileName: fileName || selectedPolicy.policyNumber,
          fileType: 'PDF',
          fileSize: Math.random() * 1000000 + 500000
        })
      });

      const result = await response.json();
      if (result.success) {
        onStepComplete({ uploadId: result.uploadId, policyId: selectedPolicy.id });
      }
    } catch (err) {
      alert('Error uploading: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Step 1: Upload Policy Document</h2>
      <p>Select a policy document to analyze or use a sample policy from our demo data.</p>

      <div style={styles.section}>
        <h3>Available Policies</h3>
        {demoData?.policies?.map((policy) => (
          <div
            key={policy.id}
            style={{
              ...styles.policyCard,
              backgroundColor: selectedPolicy?.id === policy.id ? '#e0f2fe' : 'white',
              borderColor: selectedPolicy?.id === policy.id ? '#1a5f7a' : '#e5e7eb'
            }}
            onClick={() => setSelectedPolicy(policy)}
          >
            <div style={styles.policyHeader}>
              <strong>{policy.insurer}</strong>
              <input type="radio" checked={selectedPolicy?.id === policy.id} readOnly />
            </div>
            <div style={styles.policyDetails}>
              <p>Policy #: {policy.policyNumber}</p>
              <p>Enrollee: {policy.enrolleeName}</p>
              <p>Coverage: ₹{policy.sumInsured.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>File Name (optional):</label>
        <input
          type="text"
          placeholder={selectedPolicy?.policyNumber}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={styles.input}
        />
      </div>

      <button
        onClick={handleFileUpload}
        disabled={!selectedPolicy || loading}
        style={{
          ...styles.button,
          opacity: selectedPolicy && !loading ? 1 : 0.5,
          cursor: selectedPolicy && !loading ? 'pointer' : 'not-allowed'
        }}
      >
        {loading ? 'Uploading...' : 'Upload & Continue'}
      </button>
    </div>
  );
}

/**
 * Step 2: Extract Policy Data
 */
export function Step2Extract({ caseId, caseData, onStepComplete }) {
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);

  const handleExtract = async () => {
    try {
      setLoading(true);
      const uploadData = caseData?.steps?.upload?.data;
      const policyId = caseData?.steps?.upload?.data?.policyId || 'POL_2024_001';

      const response = await fetch('/api/portability/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          policyId
        })
      });

      const result = await response.json();
      if (result.success) {
        setExtracted(result.extracted);
        onStepComplete(result.extracted);
      }
    } catch (err) {
      alert('Error extracting: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (extracted) {
    return (
      <div>
        <h2>Step 2: Policy Data Extracted</h2>
        <div style={styles.successBox}>
          <p style={{ marginTop: 0 }}>✓ Policy data extracted successfully with {(extracted.confidence * 100).toFixed(1)}% confidence</p>
        </div>
        <div style={styles.extractedData}>
          <div style={styles.dataRow}>
            <span style={styles.label}>Policy Number:</span>
            <span>{extracted.policyNumber}</span>
          </div>
          <div style={styles.dataRow}>
            <span style={styles.label}>Insurer:</span>
            <span>{extracted.insurer}</span>
          </div>
          <div style={styles.dataRow}>
            <span style={styles.label}>Enrollee:</span>
            <span>{extracted.enrolleeName}</span>
          </div>
          <div style={styles.dataRow}>
            <span style={styles.label}>Sum Insured:</span>
            <span>₹{extracted.sumInsured.toLocaleString()}</span>
          </div>
          <div style={styles.dataRow}>
            <span style={styles.label}>Annual Premium:</span>
            <span>₹{extracted.premium?.annual.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Step 2: Extract Policy Data</h2>
      <p>Extract key policy information from the uploaded document.</p>
      <button onClick={handleExtract} disabled={loading} style={styles.button}>
        {loading ? 'Extracting...' : 'Extract Policy Data'}
      </button>
    </div>
  );
}

/**
 * Step 3: Application Data Entry
 */
export function Step3AppData({ caseId, caseData, onStepComplete, demoData }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectApp = async () => {
    if (!selectedApp) {
      alert('Please select an application');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/portability/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          applicationId: selectedApp.id
        })
      });

      const result = await response.json();
      if (result.success) {
        onStepComplete(result.comparison);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Step 3: Application Data</h2>
      <p>Select the applicant's health insurance application to compare with the policy.</p>

      <div style={styles.section}>
        <h3>Available Applications</h3>
        {demoData?.applications?.map((app) => (
          <div
            key={app.id}
            style={{
              ...styles.policyCard,
              backgroundColor: selectedApp?.id === app.id ? '#e0f2fe' : 'white',
              borderColor: selectedApp?.id === app.id ? '#1a5f7a' : '#e5e7eb'
            }}
            onClick={() => setSelectedApp(app)}
          >
            <div style={styles.policyHeader}>
              <strong>{app.applicantName}</strong>
              <input type="radio" checked={selectedApp?.id === app.id} readOnly />
            </div>
            <div style={styles.policyDetails}>
              <p>ID: {app.applicantId}</p>
              <p>Age: {app.age}</p>
              <p>Status: {app.status}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSelectApp}
        disabled={!selectedApp || loading}
        style={{
          ...styles.button,
          opacity: selectedApp && !loading ? 1 : 0.5
        }}
      >
        {loading ? 'Comparing...' : 'Compare & Continue'}
      </button>
    </div>
  );
}

/**
 * Step 4: Anomaly Detection Results
 */
export function Step4Anomalies({ caseId, caseData, onStepComplete }) {
  const [loading, setLoading] = useState(false);
  const [anomalies, setAnomalies] = useState(null);

  const handleDetectAnomalies = async () => {
    try {
      setLoading(true);
      // Anomalies were already detected in Step 3, just fetch the results
      setAnomalies(caseData?.steps?.anomalies?.data || []);
      onStepComplete(caseData?.steps?.anomalies?.data || []);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Step 4: Anomaly Detection</h2>
      <p>Identifies inconsistencies between policy and application documents.</p>

      {anomalies === null ? (
        <button onClick={handleDetectAnomalies} disabled={loading} style={styles.button}>
          {loading ? 'Analyzing...' : 'Run Anomaly Detection'}
        </button>
      ) : anomalies.length > 0 ? (
        <div style={styles.resultsContainer}>
          {anomalies.map((anomaly, idx) => (
            <div key={idx} style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <strong>{anomaly.type}</strong>
                <span style={{
                  ...styles.severityBadge,
                  backgroundColor: {
                    'High': '#fecaca',
                    'Medium': '#fef08a',
                    'Low': '#dcfce7'
                  }[anomaly.severity] || '#e5e7eb'
                }}>
                  {anomaly.severity}
                </span>
              </div>
              <p style={styles.description}>{anomaly.description}</p>
              <div style={styles.riskScore}>Risk Score: {(anomaly.riskScore * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.successBox}>
          <p>✓ No anomalies detected</p>
        </div>
      )}
    </div>
  );
}

/**
 * Step 5: Fraud Detection Results
 */
export function Step5Fraud({ caseId, caseData, onStepComplete }) {
  const [loading, setLoading] = useState(false);
  const [fraudResults, setFraudResults] = useState(null);

  const handleFraudCheck = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portability/fraud-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId })
      });

      const result = await response.json();
      if (result.success) {
        setFraudResults(result.fraudAnalysis);
        onStepComplete(result.fraudAnalysis);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Step 5: Fraud Detection</h2>
      <p>Analyzes documents for signs of tampering and medical misrepresentation.</p>

      {fraudResults === null ? (
        <button onClick={handleFraudCheck} disabled={loading} style={styles.button}>
          {loading ? 'Analyzing...' : 'Run Fraud Detection'}
        </button>
      ) : fraudResults.indicatorsFound > 0 ? (
        <div style={styles.resultsContainer}>
          <div style={{
            ...styles.riskBanner,
            backgroundColor: {
              'High': '#fecaca',
              'Medium': '#fef08a',
              'Low': '#dcfce7'
            }[fraudResults.riskLevel]
          }}>
            <strong>{fraudResults.riskLevel} Risk</strong> - {fraudResults.indicatorsFound} fraud indicators found
          </div>
          {fraudResults.indicators?.map((indicator, idx) => (
            <div key={idx} style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <strong>{indicator.type}</strong>
                <span style={{
                  ...styles.severityBadge,
                  backgroundColor: {
                    'Critical': '#fca5a5',
                    'High': '#fecaca',
                    'Medium': '#fef08a',
                    'Low': '#dcfce7'
                  }[indicator.severity]
                }}>
                  {indicator.severity}
                </span>
              </div>
              <p style={styles.description}>{indicator.description}</p>
              <div style={styles.riskScore}>Risk Score: {(indicator.riskScore * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.successBox}>
          <p>✓ No fraud indicators detected</p>
        </div>
      )}
    </div>
  );
}

/**
 * Step 6: Final Recommendation
 */
export function Step6Recommendation({ caseId, caseData, onStepComplete }) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const handleGenerateRecommendation = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portability/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId })
      });

      const result = await response.json();
      if (result.success) {
        setRecommendation(result.recommendation);
        onStepComplete(result.recommendation);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Step 6: Portability Decision</h2>
      <p>Final recommendation based on comprehensive analysis.</p>

      {recommendation === null ? (
        <button onClick={handleGenerateRecommendation} disabled={loading} style={styles.button}>
          {loading ? 'Generating...' : 'Generate Decision'}
        </button>
      ) : (
        <div style={styles.recommendationContainer}>
          <div style={{
            ...styles.decisionBox,
            backgroundColor: {
              'APPROVE': '#dcfce7',
              'APPROVE_WITH_CONDITIONS': '#dbeafe',
              'CONDITIONAL_APPROVE': '#fef08a',
              'DENY': '#fecaca'
            }[recommendation.decision] || '#e5e7eb'
          }}>
            <h3 style={{ marginTop: 0 }}>{recommendation.decision.replace(/_/g, ' ')}</h3>
            <p><strong>Action:</strong> {recommendation.action}</p>
            <p><strong>Priority:</strong> {recommendation.priority}</p>
            <p><strong>Overall Risk Score:</strong> {recommendation.overallRiskScore}%</p>
            <p><strong>Confidence:</strong> {recommendation.confidence}%</p>
          </div>

          <div style={styles.categoriesGrid}>
            {Object.entries(recommendation.categories || {}).map(([category, data]) => (
              <div key={category} style={styles.categoryBox}>
                <strong>{category.replace(/([A-Z])/g, ' $1').trim()}</strong>
                <div style={styles.categoryData}>
                  <div>Risk: {(data.riskScore * 100).toFixed(0)}%</div>
                  <div>Severity: {data.severity}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.reasoningBox}>
            <h4>Reasoning</h4>
            <p>{recommendation.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Report Viewer Component
 */
export function ReportViewer({ caseId, caseData }) {
  return (
    <div style={styles.reportContainer}>
      <h2>Analysis Complete</h2>
      <div style={styles.reportGrid}>
        <div style={styles.reportSection}>
          <h3>Extraction Results</h3>
          {caseData?.steps?.extract?.data ? (
            <div style={styles.reportData}>
              <p><strong>Policy:</strong> {caseData.steps.extract.data.policyNumber}</p>
              <p><strong>Insurer:</strong> {caseData.steps.extract.data.insurer}</p>
              <p><strong>Confidence:</strong> {(caseData.steps.extract.data.confidence * 100).toFixed(0)}%</p>
            </div>
          ) : (
            <p style={{ color: '#999' }}>No extraction data</p>
          )}
        </div>

        <div style={styles.reportSection}>
          <h3>Anomalies Found</h3>
          <p style={{ fontSize: '24px', margin: '10px 0' }}>
            {caseData?.steps?.anomalies?.data?.length || 0}
          </p>
        </div>

        <div style={styles.reportSection}>
          <h3>Fraud Indicators</h3>
          <p style={{ fontSize: '24px', margin: '10px 0' }}>
            {caseData?.steps?.fraud?.data?.length || 0}
          </p>
        </div>

        <div style={styles.reportSection}>
          <h3>Final Decision</h3>
          {caseData?.steps?.recommendation?.data?.recommendation?.decision && (
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a5f7a' }}>
              {caseData.steps.recommendation.data.recommendation.decision.replace(/_/g, ' ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  section: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#1a5f7a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  policyCard: {
    padding: '12px',
    marginBottom: '8px',
    border: '2px solid #e5e7eb',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  policyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  policyDetails: {
    fontSize: '13px',
    color: '#666'
  },
  successBox: {
    backgroundColor: '#dcfce7',
    border: '1px solid #86efac',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  extractedData: {
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
    padding: '16px'
  },
  dataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb'
  },
  resultsContainer: {
    marginTop: '16px'
  },
  resultCard: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '12px'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  severityBadge: {
    padding: '2px 8px',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: '600'
  },
  description: {
    margin: '8px 0',
    fontSize: '13px',
    color: '#333'
  },
  riskScore: {
    fontSize: '12px',
    color: '#666'
  },
  riskBanner: {
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontWeight: '600'
  },
  recommendationContainer: {
    marginTop: '16px'
  },
  decisionBox: {
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '16px',
    border: '2px solid #999'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    marginBottom: '16px'
  },
  categoryBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '13px'
  },
  categoryData: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#666'
  },
  reasoningBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #3b82f6',
    padding: '12px',
    borderRadius: '4px'
  },
  reportContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px'
  },
  reportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  reportSection: {
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '4px',
    border: '1px solid #e5e7eb'
  },
  reportData: {
    fontSize: '13px',
    color: '#666'
  }
};

// Export Step components as named exports
export const Step1Upload_Component = Step1Upload;
export const Step2Extract_Component = Step2Extract;
export const Step3AppData_Component = Step3AppData;
export const Step4Anomalies_Component = Step4Anomalies;
export const Step5Fraud_Component = Step5Fraud;
export const Step6Recommendation_Component = Step6Recommendation;
export const ReportViewer_Component = ReportViewer;
