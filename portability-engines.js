/**
 * PIVOT Portability Plus - Core Logic Engines
 * Industry-agnostic anomaly detection, fraud detection, and decision engines
 */

const stringSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const getEditDistance = (s1, s2) => {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

/**
 * ANOMALY DETECTION ENGINE
 * Identifies inconsistencies between policy and application documents
 */
class AnomalyDetectionEngine {
  constructor(config = {}) {
    this.config = {
      stringSimilarityThreshold: config.stringSimilarityThreshold || 0.85,
      numericVarianceThreshold: config.numericVarianceThreshold || 0.05, // 5%
      dateToleranceDays: config.dateToleranceDays || 30,
      ...config
    };
  }

  detect(policy, application) {
    const anomalies = [];

    // 1. Data Mismatch Detection
    anomalies.push(...this.detectDataMismatches(policy, application));

    // 2. Coverage Gap Detection
    anomalies.push(...this.detectCoverageGaps(policy, application));

    // 3. Missing Information Detection
    anomalies.push(...this.detectMissingInformation(policy, application));

    // 4. Inconsistent Dates Detection
    anomalies.push(...this.detectInconsistentDates(policy, application));

    // 5. Exclusion Gap Detection
    anomalies.push(...this.detectExclusionGaps(policy, application));

    // 6. Premium Variance Detection
    anomalies.push(...this.detectPremiumVariance(policy, application));

    return anomalies.filter(a => a !== null);
  }

  detectDataMismatches(policy, application) {
    const anomalies = [];
    const threshold = this.config.stringSimilarityThreshold;

    // Check medical conditions
    if (policy.undisclosedConditions && policy.undisclosedConditions.length > 0) {
      const appConditions = application.medicalHistory?.preExistingConditions || [];
      const appConditionNames = appConditions.map(c => c.condition.toLowerCase());

      policy.undisclosedConditions.forEach(condition => {
        const conditionLower = condition.toLowerCase();
        const matched = appConditionNames.some(appCond =>
          stringSimilarity(conditionLower, appCond) >= threshold
        );

        if (!matched) {
          anomalies.push({
            type: 'Data Mismatch',
            severity: 'High',
            description: `Condition "${condition}" disclosed in policy but not in application`,
            riskScore: 0.75,
            details: {
              policyData: condition,
              applicationData: 'Not listed',
              similarity: 0
            }
          });
        }
      });
    }

    return anomalies;
  }

  detectCoverageGaps(policy, application) {
    const anomalies = [];
    const appConditions = application.medicalHistory?.preExistingConditions || [];

    // Check if any undisclosed conditions exceed coverage exclusion period
    if (policy.undisclosedConditions && policy.undisclosedConditions.length > 0) {
      const excludedCondition = policy.undisclosedConditions[0];

      anomalies.push({
        type: 'Coverage Gap',
        severity: 'Medium',
        description: `Policy excludes undisclosed condition "${excludedCondition}" during waiting period`,
        riskScore: 0.6,
        details: {
          condition: excludedCondition,
          waitingPeriod: policy.exclusions?.[0] || 'Unknown'
        }
      });
    }

    return anomalies;
  }

  detectMissingInformation(policy, application) {
    const anomalies = [];

    // Check for critical missing sections
    if (!application.medicalHistory?.surgeries || application.medicalHistory.surgeries.length === 0) {
      anomalies.push({
        type: 'Missing Information',
        severity: 'Medium',
        description: 'No surgical history documented in application',
        riskScore: 0.45,
        details: {
          field: 'Surgical History',
          status: 'Not provided'
        }
      });
    }

    // Check family history
    if (!application.medicalHistory?.familyHistory) {
      anomalies.push({
        type: 'Missing Information',
        severity: 'Low',
        description: 'Family health history not documented',
        riskScore: 0.35,
        details: {
          field: 'Family History',
          status: 'Not provided'
        }
      });
    }

    return anomalies;
  }

  detectInconsistentDates(policy, application) {
    const anomalies = [];
    const tolerance = this.config.dateToleranceDays;

    // Check policy start date vs application approval date
    if (policy.startDate && application.approvedDate) {
      const policyDate = new Date(policy.startDate);
      const appDate = new Date(application.approvedDate);
      const daysDiff = Math.abs((policyDate - appDate) / (1000 * 60 * 60 * 24));

      if (daysDiff > tolerance) {
        anomalies.push({
          type: 'Inconsistent Dates',
          severity: 'Low',
          description: `Large gap between application approval (${application.approvedDate}) and policy start (${policy.startDate})`,
          riskScore: 0.35,
          details: {
            applicationDate: application.approvedDate,
            policyStartDate: policy.startDate,
            daysDifference: Math.round(daysDiff)
          }
        });
      }
    }

    return anomalies;
  }

  detectExclusionGaps(policy, application) {
    const anomalies = [];

    // Check if conditions exist that overlap with policy exclusions
    if (policy.exclusions && policy.exclusions.length > 0) {
      const appConditions = application.medicalHistory?.preExistingConditions || [];

      if (appConditions.length > 0) {
        anomalies.push({
          type: 'Exclusion Gap',
          severity: 'Medium',
          description: 'Applicant has pre-existing conditions that fall under policy exclusions',
          riskScore: 0.55,
          details: {
            exclusions: policy.exclusions.slice(0, 2),
            applicantConditions: appConditions.map(c => c.condition).slice(0, 2)
          }
        });
      }
    }

    return anomalies;
  }

  detectPremiumVariance(policy, application) {
    const anomalies = [];

    // Simple premium variance check based on age and risk profile
    const estimatedPremium = this.calculateEstimatedPremium(application);
    const actualPremium = policy.premium?.annual || 0;

    if (actualPremium > 0) {
      const variance = (actualPremium - estimatedPremium) / estimatedPremium;

      if (Math.abs(variance) > 0.35) { // 35% variance threshold
        anomalies.push({
          type: 'Premium Variance',
          severity: variance < 0 ? 'Medium' : 'Low',
          description: `Premium ${variance < 0 ? 'significantly lower' : 'higher'} than expected for risk profile`,
          riskScore: Math.min(Math.abs(variance), 0.8),
          details: {
            actualPremium,
            estimatedPremium,
            variancePercent: (variance * 100).toFixed(1)
          }
        });
      }
    }

    return anomalies;
  }

  calculateEstimatedPremium(application) {
    // Simple estimation formula based on age and risk
    const age = application.age || 40;
    const basePremium = 8000;
    const ageMultiplier = 1 + (Math.max(0, age - 30) / 100);
    const conditionMultiplier = (application.medicalHistory?.preExistingConditions?.length || 0) * 0.3 + 1;

    return basePremium * ageMultiplier * conditionMultiplier;
  }
}

/**
 * FRAUD DETECTION ENGINE
 * Identifies potential document tampering and medical misrepresentation
 */
class FraudDetectionEngine {
  constructor(config = {}) {
    this.config = {
      documentQualityThreshold: config.documentQualityThreshold || 0.85,
      confidenceThreshold: config.confidenceThreshold || 0.80,
      ...config
    };
  }

  detect(policy, application, documentMetadata = {}) {
    const indicators = [];

    // 1. PDF Metadata Analysis
    indicators.push(...this.analyzePdfMetadata(policy, documentMetadata));

    // 2. OCR Confidence Analysis
    indicators.push(...this.analyzeOcrConfidence(policy, documentMetadata));

    // 3. Medical History Inconsistency
    indicators.push(...this.detectMedicalInconsistency(policy, application));

    // 4. Document Structure Anomalies
    indicators.push(...this.detectDocumentStructureAnomalies(policy, documentMetadata));

    // 5. Font Consistency Analysis
    indicators.push(...this.analyzeFontConsistency(policy, documentMetadata));

    // 6. Information Fabrication Detection
    indicators.push(...this.detectInformationFabrication(policy, application));

    return indicators.filter(i => i !== null);
  }

  analyzePdfMetadata(policy, metadata) {
    const indicators = [];

    if (metadata.creationDate && metadata.modificationDate) {
      const createdDate = new Date(metadata.creationDate);
      const modifiedDate = new Date(metadata.modificationDate);
      const daysDiff = Math.abs((modifiedDate - createdDate) / (1000 * 60 * 60 * 24));

      if (daysDiff > 180) { // Document modified after 6 months
        indicators.push({
          type: 'Document Modification',
          severity: 'High',
          description: 'Document significantly modified after creation',
          confidence: 0.85,
          riskScore: 0.70
        });
      }
    }

    if (metadata.author && metadata.author !== 'Official Insurer Document') {
      indicators.push({
        type: 'Document Origin',
        severity: 'Medium',
        description: 'Document author information suspicious',
        confidence: 0.75,
        riskScore: 0.55
      });
    }

    return indicators;
  }

  analyzeOcrConfidence(policy, metadata) {
    const indicators = [];

    const ocrConfidence = policy.documentQuality?.ocrConfidence || 0.95;

    if (ocrConfidence < 0.85) {
      indicators.push({
        type: 'Document Quality',
        severity: 'Medium',
        description: 'Low OCR confidence suggests potential document tampering or poor quality scan',
        confidence: 0.88,
        riskScore: 0.52
      });
    }

    // Analyze specific sections with lower confidence
    if (policy.documentQuality?.problemSections) {
      policy.documentQuality.problemSections.forEach(section => {
        if (section.confidence < 0.80) {
          indicators.push({
            type: 'Section Quality Issue',
            severity: 'High',
            description: `Critical section "${section.name}" has low OCR confidence`,
            confidence: 0.82,
            riskScore: 0.68
          });
        }
      });
    }

    return indicators;
  }

  detectMedicalInconsistency(policy, application) {
    const indicators = [];

    // Check for contradictions in medical history
    const policyConditions = policy.undisclosedConditions || [];
    const appConditions = application.medicalHistory?.preExistingConditions || [];

    policyConditions.forEach(policyCondition => {
      const appHasCondition = appConditions.some(ac =>
        ac.condition.toLowerCase().includes(policyCondition.toLowerCase().split('(')[0])
      );

      if (!appHasCondition && policyConditions.length > 0) {
        indicators.push({
          type: 'Medical History Inconsistency',
          severity: 'High',
          description: 'Critical medical condition disclosed in policy but not in application',
          confidence: 0.88,
          riskScore: 0.75
        });
      }
    });

    return indicators;
  }

  detectDocumentStructureAnomalies(policy, metadata) {
    const indicators = [];

    // Check for structural inconsistencies
    if (metadata.pageCount && metadata.pageCount < 4) {
      indicators.push({
        type: 'Document Completeness',
        severity: 'Low',
        description: 'Document has fewer pages than typical policy documents',
        confidence: 0.70,
        riskScore: 0.40
      });
    }

    if (metadata.hasBlankPages) {
      indicators.push({
        type: 'Document Integrity',
        severity: 'Medium',
        description: 'Document contains blank or missing pages',
        confidence: 0.80,
        riskScore: 0.55
      });
    }

    return indicators;
  }

  analyzeFontConsistency(policy, metadata) {
    const indicators = [];

    if (metadata.fontInconsistencies && metadata.fontInconsistencies.length > 0) {
      indicators.push({
        type: 'Font Inconsistency',
        severity: 'High',
        description: 'Document contains multiple font changes suggesting potential editing',
        confidence: 0.82,
        riskScore: 0.65
      });
    }

    return indicators;
  }

  detectInformationFabrication(policy, application) {
    const indicators = [];

    // Check for implausible claims
    const appAge = application.age || 0;
    const undisclosedConds = policy.undisclosedConditions || [];

    undisclosedConds.forEach(condition => {
      if (condition.toLowerCase().includes('heart disease') && appAge < 35) {
        indicators.push({
          type: 'Implausible Claim',
          severity: 'Medium',
          description: `Serious condition (${condition}) claimed for young applicant (age ${appAge})`,
          confidence: 0.78,
          riskScore: 0.58
        });
      }
    });

    return indicators;
  }
}

/**
 * DECISION ENGINE
 * Generates portability recommendations based on analysis
 */
class DecisionEngine {
  constructor(config = {}) {
    this.config = {
      anomalyWeighting: config.anomalyWeighting || 0.6,
      fraudWeighting: config.fraudWeighting || 0.8,
      dataQualityWeighting: config.dataQualityWeighting || 0.4,
      ...config
    };
  }

  generateRecommendation(policy, application, anomalies, fraudIndicators) {
    const assessment = {
      overallRiskScore: 0,
      recommendation: null,
      categories: {},
      confidence: 0,
      details: {}
    };

    // Category 1: Underwriting Risk
    assessment.categories.underwritingRisk = this.assessUnderwritingRisk(anomalies);

    // Category 2: Data Integrity
    assessment.categories.dataIntegrity = this.assessDataIntegrity(anomalies, fraudIndicators);

    // Category 3: Medical Completeness
    assessment.categories.medicalCompleteness = this.assessMedicalCompleteness(policy, application);

    // Category 4: Coverage Alignment
    assessment.categories.coverageAlignment = this.assessCoverageAlignment(policy, application, anomalies);

    // Category 5: Document Quality
    assessment.categories.documentQuality = this.assessDocumentQuality(policy);

    // Category 6: Fraud Risk
    assessment.categories.fraudRisk = this.assessFraudRisk(fraudIndicators);

    // Calculate overall risk score
    assessment.overallRiskScore = this.calculateOverallRiskScore(assessment.categories);
    assessment.confidence = this.calculateConfidence(policy, application);

    // Generate recommendation
    assessment.recommendation = this.generateDecision(assessment);
    assessment.details.reasoning = this.generateReasoning(assessment);

    return assessment;
  }

  assessUnderwritingRisk(anomalies) {
    const relevantAnomalies = anomalies.filter(a =>
      ['Data Mismatch', 'Coverage Gap', 'Exclusion Gap'].includes(a.type)
    );

    const avgRisk = relevantAnomalies.length > 0
      ? relevantAnomalies.reduce((sum, a) => sum + a.riskScore, 0) / relevantAnomalies.length
      : 0;

    return {
      riskScore: Math.min(avgRisk, 1),
      issueCount: relevantAnomalies.length,
      severity: avgRisk > 0.7 ? 'High' : avgRisk > 0.4 ? 'Medium' : 'Low'
    };
  }

  assessDataIntegrity(anomalies, fraudIndicators) {
    const mismatchAnomalies = anomalies.filter(a => a.type === 'Data Mismatch');
    const fraudScore = fraudIndicators.length > 0
      ? fraudIndicators.reduce((sum, f) => sum + f.riskScore, 0) / fraudIndicators.length
      : 0;

    return {
      riskScore: (mismatchAnomalies.length > 0 ? 0.5 : 0) + fraudScore * 0.5,
      mismatchCount: mismatchAnomalies.length,
      fraudIndicatorCount: fraudIndicators.length,
      severity: fraudScore > 0.7 ? 'Critical' : mismatchAnomalies.length > 2 ? 'High' : 'Low'
    };
  }

  assessMedicalCompleteness(policy, application) {
    let completenessScore = 0;
    const checks = {
      preExistingConditions: !!application.medicalHistory?.preExistingConditions?.length,
      surgicalHistory: !!application.medicalHistory?.surgeries?.length,
      familyHistory: !!application.medicalHistory?.familyHistory,
      allergies: !!application.medicalHistory?.allergies?.length,
      lifestyle: !!application.lifestyle
    };

    const completedFields = Object.values(checks).filter(v => v).length;
    completenessScore = completedFields / Object.keys(checks).length;

    return {
      riskScore: 1 - completenessScore,
      completenessPercent: (completenessScore * 100).toFixed(0),
      missingFields: Object.keys(checks).filter(k => !checks[k]),
      severity: completenessScore > 0.8 ? 'Low' : completenessScore > 0.5 ? 'Medium' : 'High'
    };
  }

  assessCoverageAlignment(policy, application, anomalies) {
    const coverageGaps = anomalies.filter(a => a.type === 'Coverage Gap');

    return {
      riskScore: Math.min(coverageGaps.length * 0.3, 1),
      gapCount: coverageGaps.length,
      sumInsured: policy.sumInsured,
      severity: coverageGaps.length > 2 ? 'High' : coverageGaps.length > 0 ? 'Medium' : 'Low'
    };
  }

  assessDocumentQuality(policy) {
    const ocrConfidence = policy.documentQuality?.ocrConfidence || 0.9;
    const riskScore = 1 - ocrConfidence;

    return {
      riskScore,
      ocrConfidence,
      pageCount: policy.documentQuality?.pageCount,
      scanQuality: policy.documentQuality?.scannedQuality,
      severity: ocrConfidence < 0.8 ? 'High' : ocrConfidence < 0.9 ? 'Medium' : 'Low'
    };
  }

  assessFraudRisk(fraudIndicators) {
    if (fraudIndicators.length === 0) {
      return {
        riskScore: 0,
        indicatorCount: 0,
        severity: 'Low'
      };
    }

    const avgRisk = fraudIndicators.reduce((sum, f) => sum + f.riskScore, 0) / fraudIndicators.length;

    return {
      riskScore: Math.min(avgRisk, 1),
      indicatorCount: fraudIndicators.length,
      severity: avgRisk > 0.7 ? 'Critical' : avgRisk > 0.4 ? 'High' : 'Medium'
    };
  }

  calculateOverallRiskScore(categories) {
    const weights = {
      underwritingRisk: 0.25,
      dataIntegrity: 0.25,
      medicalCompleteness: 0.15,
      coverageAlignment: 0.15,
      documentQuality: 0.10,
      fraudRisk: 0.10
    };

    let totalScore = 0;
    Object.keys(weights).forEach(category => {
      totalScore += (categories[category].riskScore || 0) * weights[category];
    });

    return Math.min(totalScore, 1);
  }

  calculateConfidence(policy, application) {
    let confidence = 0.9;

    // Reduce confidence if critical data is missing
    if (!application.medicalHistory) confidence -= 0.2;
    if (!policy.documentQuality) confidence -= 0.1;
    if (policy.documentQuality?.ocrConfidence < 0.85) confidence -= 0.15;

    return Math.max(confidence, 0.5);
  }

  generateDecision(assessment) {
    const riskScore = assessment.overallRiskScore;

    if (riskScore > 0.75) {
      return {
        decision: 'DENY',
        action: 'Request Additional Documentation',
        priority: 'Immediate Review Required'
      };
    } else if (riskScore > 0.5) {
      return {
        decision: 'CONDITIONAL_APPROVE',
        action: 'Request Clarifications',
        priority: 'Review by Senior Underwriter'
      };
    } else if (riskScore > 0.25) {
      return {
        decision: 'APPROVE_WITH_CONDITIONS',
        action: 'Issue Policy with Rider',
        priority: 'Standard Processing'
      };
    } else {
      return {
        decision: 'APPROVE',
        action: 'Issue Policy',
        priority: 'Fast Track'
      };
    }
  }

  generateReasoning(assessment) {
    const reasoningPoints = [];

    Object.entries(assessment.categories).forEach(([category, data]) => {
      if (data.severity === 'Critical' || data.severity === 'High') {
        reasoningPoints.push(`${category}: ${data.severity} - Risk score ${(data.riskScore * 100).toFixed(0)}%`);
      }
    });

    return reasoningPoints.length > 0
      ? reasoningPoints.join('; ')
      : 'All assessments within acceptable parameters';
  }
}

export {
  AnomalyDetectionEngine,
  FraudDetectionEngine,
  DecisionEngine
};
