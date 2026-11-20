/**
 * PIVOT Portability Plus Backend Routes
 * REST API endpoints for portability workflow
 */

import express from 'express';
import { randomUUID } from 'crypto';
import {
  SYNTHETIC_POLICIES,
  SYNTHETIC_APPLICATIONS,
  getPolicyById,
  getApplicationById,
  getAnomaliesByCase,
  getFraudIndicatorsByCase
} from './portability-synthetic-data.js';
import {
  AnomalyDetectionEngine,
  FraudDetectionEngine,
  DecisionEngine
} from './portability-engines.js';

const router = express.Router();

// In-memory storage (in production, use MongoDB)
const portabilityCases = {};
const portabilityUploads = {};

// Initialize engines
const anomalyEngine = new AnomalyDetectionEngine();
const fraudEngine = new FraudDetectionEngine();
const decisionEngine = new DecisionEngine();

/**
 * POST /api/portability/cases
 * Create a new portability case
 */
router.post('/api/portability-plus/cases', (req, res) => {
  try {
    const caseId = randomUUID();
    const { policyId, applicantId } = req.body;

    const newCase = {
      id: caseId,
      policyId,
      applicantId,
      createdAt: new Date().toISOString(),
      status: 'DRAFT',
      steps: {
        upload: { completed: false, data: null },
        extract: { completed: false, data: null },
        appData: { completed: false, data: null },
        anomalies: { completed: false, data: null },
        fraud: { completed: false, data: null },
        recommendation: { completed: false, data: null }
      }
    };

    portabilityCases[caseId] = newCase;

    res.json({
      success: true,
      caseId,
      case: newCase
    });
  } catch (error) {
    console.error('[PORTABILITY] Error creating case:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/portability/upload
 * Handle policy document upload
 */
router.post('/api/portability/upload', (req, res) => {
  try {
    const { caseId, fileName, fileType, fileSize } = req.body;

    if (!portabilityCases[caseId]) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const uploadId = randomUUID();
    const uploadRecord = {
      id: uploadId,
      caseId,
      fileName,
      fileType,
      fileSize,
      uploadedAt: new Date().toISOString(),
      status: 'Processing'
    };

    portabilityUploads[uploadId] = uploadRecord;
    portabilityCases[caseId].steps.upload.completed = true;
    portabilityCases[caseId].steps.upload.data = uploadRecord;
    portabilityCases[caseId].uploadId = uploadId;

    res.json({
      success: true,
      uploadId,
      upload: uploadRecord
    });
  } catch (error) {
    console.error('[PORTABILITY] Error uploading document:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/portability/extract
 * Extract policy data from document
 */
router.post('/api/portability/extract', (req, res) => {
  try {
    const { caseId, policyId } = req.body;

    if (!portabilityCases[caseId]) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Simulate extraction using synthetic data
    const policy = getPolicyById(policyId) || SYNTHETIC_POLICIES[0];

    const extractedData = {
      policyNumber: policy.policyNumber,
      insurer: policy.insurer,
      enrolleeName: policy.enrolleeName,
      dateOfBirth: policy.dateOfBirth,
      age: policy.age,
      coverage: policy.coverage,
      exclusions: policy.exclusions,
      sumInsured: policy.sumInsured,
      premium: policy.premium,
      status: 'Extracted',
      extractedAt: new Date().toISOString(),
      confidence: policy.documentQuality?.ocrConfidence || 0.94
    };

    portabilityCases[caseId].steps.extract.completed = true;
    portabilityCases[caseId].steps.extract.data = extractedData;
    portabilityCases[caseId].policyData = policy;

    res.json({
      success: true,
      extracted: extractedData,
      message: 'Policy data extracted successfully'
    });
  } catch (error) {
    console.error('[PORTABILITY] Error extracting data:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/portability/compare
 * Compare policy with application data
 */
router.post('/api/portability/compare', (req, res) => {
  try {
    const { caseId, applicationId } = req.body;
    const caseData = portabilityCases[caseId];

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const policy = caseData.policyData || SYNTHETIC_POLICIES[0];
    const application = getApplicationById(applicationId) || SYNTHETIC_APPLICATIONS[0];

    // Run anomaly detection
    const anomalies = anomalyEngine.detect(policy, application);

    caseData.steps.appData.completed = true;
    caseData.steps.appData.data = application;
    caseData.steps.anomalies.completed = true;
    caseData.steps.anomalies.data = anomalies;
    caseData.applicationData = application;
    caseData.anomalies = anomalies;

    res.json({
      success: true,
      comparison: {
        policyName: policy.enrolleeName,
        applicationName: application.applicantName,
        anomaliesFound: anomalies.length,
        anomalies
      }
    });
  } catch (error) {
    console.error('[PORTABILITY] Error comparing data:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/portability/fraud-check
 * Run fraud detection analysis
 */
router.post('/api/portability/fraud-check', (req, res) => {
  try {
    const { caseId } = req.body;
    const caseData = portabilityCases[caseId];

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const policy = caseData.policyData || SYNTHETIC_POLICIES[0];
    const application = caseData.applicationData || SYNTHETIC_APPLICATIONS[0];

    // Run fraud detection
    const fraudIndicators = fraudEngine.detect(policy, application, {
      creationDate: '2024-01-01',
      modificationDate: '2024-11-15',
      pageCount: policy.documentQuality?.pageCount
    });

    caseData.steps.fraud.completed = true;
    caseData.steps.fraud.data = fraudIndicators;
    caseData.fraudIndicators = fraudIndicators;

    res.json({
      success: true,
      fraudAnalysis: {
        indicatorsFound: fraudIndicators.length,
        riskLevel: fraudIndicators.length > 3 ? 'High' : fraudIndicators.length > 1 ? 'Medium' : 'Low',
        indicators: fraudIndicators
      }
    });
  } catch (error) {
    console.error('[PORTABILITY] Error running fraud check:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/portability/decide
 * Generate portability decision and recommendation
 */
router.post('/api/portability/decide', (req, res) => {
  try {
    const { caseId } = req.body;
    const caseData = portabilityCases[caseId];

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const policy = caseData.policyData || SYNTHETIC_POLICIES[0];
    const application = caseData.applicationData || SYNTHETIC_APPLICATIONS[0];
    const anomalies = caseData.anomalies || [];
    const fraudIndicators = caseData.fraudIndicators || [];

    // Generate recommendation
    const recommendation = decisionEngine.generateRecommendation(
      policy,
      application,
      anomalies,
      fraudIndicators
    );

    caseData.steps.recommendation.completed = true;
    caseData.steps.recommendation.data = recommendation;
    caseData.recommendation = recommendation;
    caseData.status = 'COMPLETED';

    res.json({
      success: true,
      recommendation: {
        decision: recommendation.recommendation.decision,
        action: recommendation.recommendation.action,
        priority: recommendation.recommendation.priority,
        overallRiskScore: (recommendation.overallRiskScore * 100).toFixed(0),
        confidence: (recommendation.confidence * 100).toFixed(0),
        categories: recommendation.categories,
        reasoning: recommendation.details.reasoning
      }
    });
  } catch (error) {
    console.error('[PORTABILITY] Error generating decision:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/portability/case/:id
 * Get case details with all analysis results
 */
router.get('/api/portability/case/:id', (req, res) => {
  try {
    const caseData = portabilityCases[req.params.id];

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({
      success: true,
      case: caseData
    });
  } catch (error) {
    console.error('[PORTABILITY] Error fetching case:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/portability/report/:id
 * Generate comprehensive report for case
 */
router.get('/api/portability/report/:id', (req, res) => {
  try {
    const caseData = portabilityCases[req.params.id];

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const report = {
      caseId: caseData.id,
      createdAt: new Date().toISOString(),
      status: caseData.status,
      sections: {
        extraction: caseData.steps.extract.data || null,
        anomalies: caseData.steps.anomalies.data || [],
        fraud: caseData.steps.fraud.data || [],
        recommendation: caseData.steps.recommendation.data || null
      }
    };

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('[PORTABILITY] Error generating report:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/portability/cases
 * List all portability cases
 */
router.get('/api/portability/cases', (req, res) => {
  try {
    const cases = Object.values(portabilityCases).map(c => ({
      id: c.id,
      createdAt: c.createdAt,
      status: c.status,
      progressPercent: calculateProgress(c)
    }));

    res.json({
      success: true,
      cases,
      total: cases.length
    });
  } catch (error) {
    console.error('[PORTABILITY] Error fetching cases:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/portability/case/:id
 * Update case with additional data
 */
router.put('/api/portability/case/:id', (req, res) => {
  try {
    const caseData = portabilityCases[req.params.id];

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const { step, data } = req.body;

    if (step && caseData.steps[step]) {
      caseData.steps[step].data = data;
      caseData.steps[step].completed = true;
    }

    res.json({
      success: true,
      case: caseData
    });
  } catch (error) {
    console.error('[PORTABILITY] Error updating case:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/portability/demo-data
 * Get synthetic demo data for testing UI
 */
router.get('/api/portability/demo-data', (req, res) => {
  try {
    res.json({
      success: true,
      policies: SYNTHETIC_POLICIES,
      applications: SYNTHETIC_APPLICATIONS
    });
  } catch (error) {
    console.error('[PORTABILITY] Error fetching demo data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function
function calculateProgress(caseData) {
  const steps = Object.values(caseData.steps);
  const completedSteps = steps.filter(s => s.completed).length;
  return Math.round((completedSteps / steps.length) * 100);
}

export default router;
