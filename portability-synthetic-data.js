/**
 * Synthetic Test Data for PIVOT Portability Plus Module
 * Industry-agnostic health insurance policy data for demonstration
 */

const SYNTHETIC_POLICIES = [
  {
    id: 'POL_2024_001',
    insurer: 'NivaBupa Health Insurance',
    policyNumber: 'NBHI/2024/001234',
    policyType: 'Individual Health Insurance',
    enrolleeId: 'ENV_001',
    enrolleeName: 'Rajesh Kumar',
    dateOfBirth: '1975-06-15',
    age: 49,
    gender: 'Male',
    relationship: 'Self',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    policyStatus: 'Active',
    sumInsured: 500000,
    currency: 'INR',
    premium: {
      annual: 12500,
      paymentFrequency: 'Annual',
      lastPremiumPaid: '2024-01-05'
    },
    coverage: {
      hospitalization: {
        limit: 500000,
        deductible: 0,
        coPayPercentage: 0
      },
      preHospitalization: {
        days: 30,
        limit: 100000
      },
      postHospitalization: {
        days: 60,
        limit: 100000
      },
      dayCareProcedures: {
        covered: true,
        limit: 100000
      },
      ambulance: {
        covered: true,
        limit: 2500
      }
    },
    exclusions: [
      'Pre-existing diseases (applicable for 12 months)',
      'Cosmetic procedures',
      'Dental treatment (exceeding INR 5000)',
      'Infertility treatment',
      'Weight loss procedures'
    ],
    undisclosedConditions: [
      'Hypertension (controlled)',
      'Type 2 Diabetes (managed with medication)'
    ],
    claimsHistory: [
      {
        claimNumber: 'CLM_2024_001',
        date: '2024-03-10',
        amount: 50000,
        status: 'Settled',
        reason: 'Appendectomy'
      },
      {
        claimNumber: 'CLM_2024_002',
        date: '2024-07-15',
        amount: 75000,
        status: 'Settled',
        reason: 'Knee arthroscopy'
      }
    ],
    extractionDate: '2024-11-15',
    documentQuality: {
      pageCount: 8,
      scannedQuality: 'Good',
      ocrConfidence: 0.94
    }
  },
  {
    id: 'POL_2024_002',
    insurer: 'Tata AIG General Insurance',
    policyNumber: 'TAIG/2024/005678',
    policyType: 'Family Floater Health Insurance',
    enrolleeId: 'ENV_002',
    enrolleeName: 'Priya Sharma',
    dateOfBirth: '1982-09-22',
    age: 42,
    gender: 'Female',
    relationship: 'Primary',
    dependents: [
      {
        name: 'Aditya Sharma',
        dob: '2010-03-15',
        relation: 'Son',
        age: 14
      },
      {
        name: 'Anjali Sharma',
        dob: '2012-07-08',
        relation: 'Daughter',
        age: 12
      }
    ],
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    policyStatus: 'Active',
    sumInsured: 1000000,
    currency: 'INR',
    premium: {
      annual: 24000,
      paymentFrequency: 'Annual',
      lastPremiumPaid: '2024-02-10'
    },
    coverage: {
      hospitalization: {
        limit: 1000000,
        deductible: 5000,
        coPayPercentage: 10
      },
      preHospitalization: {
        days: 30,
        limit: 150000
      },
      postHospitalization: {
        days: 90,
        limit: 150000
      },
      dayCareProcedures: {
        covered: true,
        limit: 200000
      },
      ambulance: {
        covered: true,
        limit: 5000
      },
      wellness: {
        covered: true,
        annualLimit: 20000
      }
    },
    exclusions: [
      'Pre-existing diseases (applicable for 24 months)',
      'Cosmetic and aesthetic procedures',
      'Infertility treatment and contraception',
      'Obesity related procedures',
      'Experimental treatments'
    ],
    undisclosedConditions: [
      'Type 1 Diabetes (since childhood)',
      'Mild asthma (well-controlled)'
    ],
    claimsHistory: [
      {
        claimNumber: 'CLM_2024_003',
        date: '2024-04-20',
        amount: 120000,
        status: 'Settled',
        reason: 'Cesarean delivery'
      }
    ],
    extractionDate: '2024-11-20',
    documentQuality: {
      pageCount: 12,
      scannedQuality: 'Excellent',
      ocrConfidence: 0.97
    }
  },
  {
    id: 'POL_2024_003',
    insurer: 'Max Bupa Health Insurance',
    policyNumber: 'MAXB/2024/009999',
    policyType: 'Senior Citizen Health Insurance',
    enrolleeId: 'ENV_003',
    enrolleeName: 'Ramesh Iyer',
    dateOfBirth: '1945-12-05',
    age: 79,
    gender: 'Male',
    relationship: 'Self',
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    policyStatus: 'Active',
    sumInsured: 300000,
    currency: 'INR',
    premium: {
      annual: 18000,
      paymentFrequency: 'Annual',
      lastPremiumPaid: '2024-06-05'
    },
    coverage: {
      hospitalization: {
        limit: 300000,
        deductible: 10000,
        coPayPercentage: 20
      },
      preHospitalization: {
        days: 15,
        limit: 75000
      },
      postHospitalization: {
        days: 30,
        limit: 75000
      },
      dayCareProcedures: {
        covered: true,
        limit: 75000
      },
      ambulance: {
        covered: true,
        limit: 2500
      },
      alzheimersandDementiacare: {
        covered: true,
        limit: 100000
      }
    },
    exclusions: [
      'Pre-existing diseases (applicable for 36 months)',
      'Treatment for cosmetic purposes',
      'Infertility and fertility treatments',
      'Adventure sports injuries',
      'Nuclear hazard related injuries'
    ],
    undisclosedConditions: [
      'Coronary artery disease',
      'Hypertension (severe)',
      'Chronic kidney disease (Stage 3)',
      'Atrial fibrillation'
    ],
    claimsHistory: [
      {
        claimNumber: 'CLM_2024_004',
        date: '2024-08-10',
        amount: 200000,
        status: 'Settled',
        reason: 'Stent placement for cardiac condition'
      }
    ],
    extractionDate: '2024-11-18',
    documentQuality: {
      pageCount: 10,
      scannedQuality: 'Good',
      ocrConfidence: 0.89
    }
  }
];

const SYNTHETIC_APPLICATIONS = [
  {
    id: 'APP_2024_001',
    applicantName: 'Rajesh Kumar',
    applicantId: 'APL_001',
    dateOfBirth: '1975-06-15',
    age: 49,
    gender: 'Male',
    medicalHistory: {
      preExistingConditions: [
        {
          condition: 'Hypertension',
          diagnosedYear: 2015,
          status: 'Controlled',
          medication: 'Amlodipine 5mg daily',
          severity: 'Mild'
        }
      ],
      surgeries: [
        {
          procedure: 'Appendectomy',
          year: 2005,
          status: 'Recovered'
        }
      ],
      allergies: ['Penicillin'],
      familyHistory: {
        diabetes: true,
        hypertension: true,
        cancer: false,
        heartDisease: false
      }
    },
    lifestyle: {
      smoking: 'Never',
      alcohol: 'Occasional',
      exercise: 'Regular (3 times/week)',
      diet: 'Vegetarian'
    },
    applicationDate: '2024-01-01',
    submissionDate: '2024-01-02',
    status: 'Approved',
    approvedDate: '2024-01-15',
    undisclosedInformation: {
      conditions: ['Hypertension (controlled)'],
      surgeries: [],
      medications: ['Amlodipine 5mg daily']
    }
  },
  {
    id: 'APP_2024_002',
    applicantName: 'Priya Sharma',
    applicantId: 'APL_002',
    dateOfBirth: '1982-09-22',
    age: 42,
    gender: 'Female',
    medicalHistory: {
      preExistingConditions: [
        {
          condition: 'Asthma',
          diagnosedYear: 2010,
          status: 'Controlled',
          medication: 'Inhaler as needed',
          severity: 'Mild'
        },
        {
          condition: 'Type 1 Diabetes',
          diagnosedYear: 1990,
          status: 'Well-managed',
          medication: 'Insulin therapy',
          severity: 'Moderate'
        }
      ],
      surgeries: [
        {
          procedure: 'Thyroidectomy (partial)',
          year: 2012,
          status: 'Recovered'
        }
      ],
      allergies: [],
      familyHistory: {
        diabetes: true,
        hypertension: false,
        cancer: false,
        heartDisease: false
      }
    },
    lifestyle: {
      smoking: 'Never',
      alcohol: 'Never',
      exercise: 'Regular (5 times/week)',
      diet: 'Mixed'
    },
    applicationDate: '2024-02-01',
    submissionDate: '2024-02-02',
    status: 'Approved',
    approvedDate: '2024-02-10',
    undisclosedInformation: {
      conditions: ['Type 1 Diabetes (since childhood)', 'Mild asthma (well-controlled)'],
      surgeries: [],
      medications: ['Insulin', 'Inhaler']
    }
  }
];

const SYNTHETIC_ANOMALIES = [
  {
    caseId: 'POL_2024_001',
    anomalyType: 'Coverage Gap',
    severity: 'Medium',
    description: 'Policy excludes pre-existing diseases for 12 months but applicant has undisclosed hypertension',
    details: {
      policyExclusion: 'Pre-existing diseases (12 months)',
      applicantCondition: 'Hypertension (since 2015)',
      riskScore: 0.65,
      recommendation: 'Require clarification on pre-existing disease declaration'
    }
  },
  {
    caseId: 'POL_2024_002',
    anomalyType: 'Data Mismatch',
    severity: 'High',
    description: 'Type 1 Diabetes disclosed in policy but not mentioned in application',
    details: {
      policyData: 'Type 1 Diabetes (insulin dependent)',
      applicationData: 'No pre-existing conditions listed',
      riskScore: 0.82,
      recommendation: 'Immediate investigation required - possible material misrepresentation'
    }
  },
  {
    caseId: 'POL_2024_003',
    anomalyType: 'Premium Variance',
    severity: 'Medium',
    description: 'Premium significantly lower than industry average for age and risk profile',
    details: {
      applicantAge: 79,
      applicantRiskProfile: 'High (CAD, CKD, Afib)',
      policyPremium: 18000,
      estimatedFairPremium: 28000,
      variance: -35.7,
      riskScore: 0.58,
      recommendation: 'Review underwriting rating'
    }
  }
];

const SYNTHETIC_FRAUD_INDICATORS = [
  {
    caseId: 'POL_2024_001',
    indicatorType: 'Document Quality',
    severity: 'Low',
    description: 'Slightly lower OCR confidence in medical history section',
    confidence: 0.89,
    riskScore: 0.35
  },
  {
    caseId: 'POL_2024_002',
    indicatorType: 'Medical History Inconsistency',
    severity: 'High',
    description: 'Diabetes diagnosis date conflict between documents',
    confidence: 0.92,
    riskScore: 0.78,
    details: {
      policyDocument: 'Type 1 Diabetes (since childhood)',
      medicalRecords: 'Diagnosed 1990',
      applicationForm: 'No mention of diabetes'
    }
  },
  {
    caseId: 'POL_2024_003',
    indicatorType: 'Coverage Mismatch',
    severity: 'Medium',
    description: 'Critical medical conditions not reflected in premium calculation',
    confidence: 0.85,
    riskScore: 0.62
  }
];

export {
  SYNTHETIC_POLICIES,
  SYNTHETIC_APPLICATIONS,
  SYNTHETIC_ANOMALIES,
  SYNTHETIC_FRAUD_INDICATORS
};

export const getPolicyById = (id) => SYNTHETIC_POLICIES.find(p => p.id === id);
export const getApplicationById = (id) => SYNTHETIC_APPLICATIONS.find(a => a.id === id);
export const getAnomaliesByCase = (caseId) => SYNTHETIC_ANOMALIES.filter(a => a.caseId === caseId);
export const getFraudIndicatorsByCase = (caseId) => SYNTHETIC_FRAUD_INDICATORS.filter(f => f.caseId === caseId);
export const getAllPolicies = () => SYNTHETIC_POLICIES;
export const getAllApplications = () => SYNTHETIC_APPLICATIONS;
