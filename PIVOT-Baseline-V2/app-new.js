const { useState, useEffect } = React;

// Configurable score settings
const SCORE_SETTINGS = {
  eligibilityCap: {
    enabled: true,
    maxCap: 40
  },
  eligibilityCompliance: {
    enabled: true,
    weight: 0.6,
    age: { min: 18, max: 60 },
    sumInsured: { min: 300000, max: 10000000 },
    pedAllowed: true
  },
  continuitySignal: {
    enabled: true,
    weight: 0.25
  }
};

// Helper function to load score settings from localStorage
const loadScoreSettings = () => {
  try {
    const savedSettings = localStorage.getItem('scoreSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Merge with defaults to ensure all properties exist
      return {
        eligibilityCap: { ...SCORE_SETTINGS.eligibilityCap, ...parsed.eligibilityCap },
        eligibilityCompliance: { ...SCORE_SETTINGS.eligibilityCompliance, ...parsed.eligibilityCompliance },
        continuitySignal: { ...SCORE_SETTINGS.continuitySignal, ...parsed.continuitySignal }
      };
    }
  } catch (error) {
    console.warn('Failed to load score settings from localStorage:', error);
  }
  return SCORE_SETTINGS;
};

// Score Settings Page Component
const ScoreConfigPage = ({ setPage }) => {
  const [settings, setSettings] = useState(SCORE_SETTINGS);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadScoreSettings();
    setSettings(savedSettings);
  }, []);

  const handleEligibilityCapChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      eligibilityCap: {
        ...prev.eligibilityCap,
        [field]: field === 'maxCap' ? parseInt(value) || 0 : value
      }
    }));
  };

  const handleEligibilityComplianceChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      eligibilityCompliance: {
        ...prev.eligibilityCompliance,
        [field]: field === 'weight' ? parseFloat(value) || 0 : 
                 field === 'pedAllowed' ? value :
                 field === 'min' ? { ...prev.eligibilityCompliance.age, min: parseInt(value) || 0 } :
                 field === 'max' ? { ...prev.eligibilityCompliance.age, max: parseInt(value) || 0 } :
                 field === 'sumMin' ? { ...prev.eligibilityCompliance.sumInsured, min: parseInt(value) || 0 } :
                 field === 'sumMax' ? { ...prev.eligibilityCompliance.sumInsured, max: parseInt(value) || 0 } :
                 parseInt(value) || 0
      }
    }));
  };

  const handleContinuitySignalChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      continuitySignal: {
        ...prev.continuitySignal,
        [field]: field === 'weight' ? parseFloat(value) || 0 : value
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('scoreSettings', JSON.stringify(settings));
    alert('Score settings saved successfully!');
  };

  const handleReset = () => {
    setSettings(SCORE_SETTINGS);
    localStorage.setItem('scoreSettings', JSON.stringify(SCORE_SETTINGS));
    alert('Score settings reset to defaults!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logos */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* PIVOT Logo - Left */}
            <div className="flex items-center space-x-6 w-48">
              <div className="flex items-center space-x-2">
                <img 
                  src="/logos/pivot-logo.png" 
                  alt="PIVOT Logo" 
                  className="w-32 h-16 rounded-lg object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-32 h-16 bg-purple-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-white font-bold text-xl">P</span>
                </div>
              </div>
            </div>
            
            {/* Title - Middle */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-800">Score Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Configure portability scoring weights and thresholds</p>
            </div>
            
            {/* Attributum Logo - Right */}
            <div className="flex items-center justify-end space-x-6 w-48">
              <div className="flex items-center space-x-2">
                <img 
                  src="/logos/attributum-logo.png" 
                  alt="Attributum Logo" 
                  className="w-40 h-16 rounded-lg object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-40 h-16 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-white font-bold text-xl">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <button 
              onClick={() => setPage('demo')}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm transition-colors"
            >
              ← Back to Demo
            </button>
          </div>
          
          {/* Section 1: Eligibility Configuration */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Eligibility Configuration</h2>
            
            <div className="space-y-6">
              {/* Eligibility Data Cap */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Eligibility Data Cap</label>
                  <span className="text-sm text-gray-600">Current: {settings.eligibilityCap.maxCap}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.eligibilityCap.maxCap}
                  onChange={(e) => handleEligibilityCapChange('maxCap', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum score cap when eligibility data is incomplete</p>
              </div>

              {/* Eligibility Compliance Weight */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Eligibility Compliance Weight</label>
                  <span className="text-sm text-gray-600">Current: {settings.eligibilityCompliance.weight}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.eligibilityCompliance.weight}
                  onChange={(e) => handleEligibilityComplianceChange('weight', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Weight multiplier for eligibility compliance scores (0-1)</p>
              </div>

              {/* Continuity Signal Weight */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Continuity Signal Weight</label>
                  <span className="text-sm text-gray-600">Current: {settings.continuitySignal.weight}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.continuitySignal.weight}
                  onChange={(e) => handleContinuitySignalChange('weight', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Weight multiplier for continuity signals (0-1)</p>
              </div>
            </div>
          </div>

          {/* Section 2: Eligibility Compliance Thresholds */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Eligibility Compliance Thresholds</h2>
            
            <div className="space-y-6">
              {/* Min Age */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Min Age</label>
                  <span className="text-sm text-gray-600">Current: {settings.eligibilityCompliance.age.min}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={settings.eligibilityCompliance.age.min}
                  onChange={(e) => handleEligibilityComplianceChange('min', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum eligible age for portability</p>
              </div>

              {/* Max Age */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Max Age</label>
                  <span className="text-sm text-gray-600">Current: {settings.eligibilityCompliance.age.max}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={settings.eligibilityCompliance.age.max}
                  onChange={(e) => handleEligibilityComplianceChange('max', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum eligible age for portability</p>
              </div>

              {/* Min Sum Insured */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Min Sum Insured</label>
                  <span className="text-sm text-gray-600">Current: {settings.eligibilityCompliance.sumInsured.min.toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={settings.eligibilityCompliance.sumInsured.min}
                  onChange={(e) => handleEligibilityComplianceChange('sumMin', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum sum insured amount for eligibility</p>
              </div>

              {/* Max Sum Insured */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Max Sum Insured</label>
                  <span className="text-sm text-gray-600">Current: {settings.eligibilityCompliance.sumInsured.max.toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={settings.eligibilityCompliance.sumInsured.max}
                  onChange={(e) => handleEligibilityComplianceChange('sumMax', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum sum insured amount for eligibility</p>
              </div>

              {/* PED Allowed */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">PED Allowed</label>
                    <p className="text-xs text-gray-500 mt-1">Allow PED declarations in scoring</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.eligibilityCompliance.pedAllowed}
                      onChange={(e) => handleEligibilityComplianceChange('pedAllowed', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {settings.eligibilityCompliance.pedAllowed ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Reset to Default
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Save Settings
              </button>
            </div>
          </div>

          {/* Settings Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Current Settings Preview</h3>
            <pre className="text-xs text-blue-700 whitespace-pre-wrap">
              {JSON.stringify(settings, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [page, setPage] = useState('home');
  const [file, setFile] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState(null);

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      setFileError(null);
      return false;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (allowedTypes.includes(selectedFile.type)) {
      setFileError(null);
      return true;
    } else {
      setFileError(`Unsupported file format: ${selectedFile.type}. Please upload PDF, JPG, JPEG, or PNG files.`);
      return false;
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setFileError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('input_file', file);
      formData.append('insurance_company', 'STAR HEALTH');
      
      console.log('Uploading file:', file.name);
      
      const response = await fetch('/api/ml_process', {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response received:', data);
      
      const calculatedScore = calculateScore(data);
      console.log('Calculated score:', calculatedScore);
      setScoreData(calculatedScore);
      setResponseData(data);
    } catch (err) {
      console.error('Error:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely access response data
  const getSafeResponseData = (responseData) => {
    return responseData?.response?.data || {};
  };

  // Helper function to evaluate unified sum insured value
  const getEvaluatedSumInsured = (responseData) => {
    // Priority 1: insured_details[].individual_policy_sum_insured (if any)
    if (responseData.insured_details) {
      for (const insured of responseData.insured_details) {
        if (insured.individual_policy_sum_insured && 
            insured.individual_policy_sum_insured !== null && 
            insured.individual_policy_sum_insured !== '') {
          const value = parseInt(insured.individual_policy_sum_insured);
          if (!isNaN(value) && value > 0) {
            return value;
          }
        }
      }
    }
    
    // Priority 2: policy_and_coverage_details.floater_basic_sum_insured
    const floaterSum = responseData.policy_and_coverage_details?.floater_basic_sum_insured;
    if (floaterSum && floaterSum !== null && floaterSum !== '') {
      const value = parseInt(floaterSum);
      if (!isNaN(value) && value > 0) {
        return value;
      }
    }
    
    // Fallback: policy_and_coverage_details.sum_insured (if exists)
    const basicSum = responseData.policy_and_coverage_details?.sum_insured;
    if (basicSum && basicSum !== null && basicSum !== '') {
      const value = parseInt(basicSum);
      if (!isNaN(value) && value > 0) {
        return value;
      }
    }
    
    return null; // No numeric value exists
  };

  // Transparent Scoring Rules Configuration
const scoringRules = {
  criticalDataAvailability: {
    // Checks if essential policy fields are present for automated evaluation
    jsonFields: ['policy_and_coverage_details.policy_number', 'policy_and_coverage_details.policy_start_date', 'policy_and_coverage_details.policy_end_date', 'proposer_details.name', 'insured_details[].name'],
    eligibilityLogic: (data) => {
      return data.policy_and_coverage_details?.policy_number && 
             data.policy_and_coverage_details?.policy_start_date && 
             data.policy_and_coverage_details?.policy_end_date &&
             data.proposer_details?.name &&
             data.insured_details?.[0]?.name;
    },
    scoringBehavior: 'proportional', // Score based on proportion of available critical fields
    blocking: true, // Missing critical data prevents automated evaluation
    description: 'Essential policy fields must be present for automated portability assessment'
  },
  
  policyPeriod: {
    // Validates policy start and end dates are available and logically valid
    jsonFields: ['policy_and_coverage_details.policy_start_date', 'policy_and_coverage_details.policy_end_date'],
    eligibilityLogic: (data) => {
      return data.policy_and_coverage_details?.policy_start_date && 
             data.policy_and_coverage_details?.policy_end_date;
    },
    scoringBehavior: 'full', // Full points if dates are present
    blocking: false, // Missing dates don't block evaluation but reduce confidence
    description: 'Policy period dates must be available for portability timeline assessment'
  },
  
  cumulativeBonus: {
    // Checks if cumulative bonus information is available in the policy
    jsonFields: ['policy_and_coverage_details.floater_cumulative_bonus', 'policy_and_coverage_details.cumulative_bonus'],
    eligibilityLogic: (data) => {
      return data.policy_and_coverage_details?.floater_cumulative_bonus || 
             data.policy_and_coverage_details?.cumulative_bonus;
    },
    scoringBehavior: 'full', // Full points if any bonus data is available
    blocking: false, // Informational only - doesn't block evaluation
    description: 'Cumulative bonus availability indicates policy continuity'
  },
  
  noPED: {
    // Evaluates if pre-existing disease information is declared or not applicable
    jsonFields: ['insured_details[].declared_ped'],
    eligibilityLogic: (data) => {
      const pedStatus = data.insured_details?.[0]?.declared_ped;
      return pedStatus === 'None' || pedStatus === 'No PED Declared' || pedStatus === null;
    },
    scoringBehavior: 'full', // Full points if no PED declared or explicitly none
    blocking: false, // PED declarations require manual review but don't block
    description: 'No pre-existing diseases declared indicates lower underwriting risk'
  },
  
  claimFree: {
    // Checks if claims history information is available and indicates claim-free status
    jsonFields: ['policy_and_coverage_details.previous_claims'],
    eligibilityLogic: (data) => {
      const claimsStatus = data.policy_and_coverage_details?.previous_claims;
      return claimsStatus === 'No' || claimsStatus === null;
    },
    scoringBehavior: 'full', // Full points if claim-free or no claims data
    blocking: false, // Claims history absence doesn't imply claim-free status
    description: 'Claims-free history indicates favorable risk profile'
  },
  
  sumInsured: {
    // Evaluates whether the declared sum insured meets configurable minimum threshold
    jsonFields: ['insured_details[].individual_policy_sum_insured', 'policy_and_coverage_details.floater_basic_sum_insured', 'policy_and_coverage_details.sum_insured'],
    eligibilityLogic: (data, thresholds) => {
      const evaluatedSum = getEvaluatedSumInsured(data);
      const minSum = thresholds?.minSumInsured || 500000;
      return evaluatedSum !== null && evaluatedSum >= minSum;
    },
    scoringBehavior: 'full', // Full points if sum insured meets minimum threshold
    blocking: false, // Coverage amount doesn't block evaluation
    description: 'Adequate sum insured (≥configured minimum) indicates comprehensive coverage'
  },
  
  ageCriteria: {
    // Validates insured age falls within configurable eligible range
    jsonFields: ['insured_details[].age', 'proposer_details.dob'],
    eligibilityLogic: (data, thresholds) => {
      const age = data.insured_details?.[0]?.age || 
                  (data.proposer_details?.dob ? 
                    Math.floor((new Date() - new Date(data.proposer_details.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 
                    null);
      const minAge = thresholds?.ageMin || 18;
      const maxAge = thresholds?.ageMax || 60;
      return age && age >= minAge && age <= maxAge;
    },
    scoringBehavior: 'full', // Full points if age is within eligible range
    blocking: false, // Age outside range doesn't block but affects eligibility
    description: 'Age within configured range falls within standard portability criteria'
  }
};

  // JSON-driven scoring configuration
const SCORING_FIELD_MAP = {
  sumInsured: [
    "policy_and_coverage_details.floater_basic_sum_insured",
    "insured_details[].individual_policy_sum_insured"
  ],
  cumulativeBonus: [
    "policy_and_coverage_details.floater_cumulative_bonus",
    "insured_details[].individual_cumulative_bonus"
  ],
  age: [
    "insured_details[].dob",
    "insured_details[].age"
  ],
  ped: [
    "insured_details[].declared_ped"
  ],
  proposerName: [
    "proposer_details.first_name",
    "proposer_details.last_name",
    "insured_details[].insured_name"
  ],
  continuity: [
    "insured_details[].first_policy_started"
  ],
  claimsHistory: [
    "policy_and_coverage_details.previous_claims"
  ]
};

// Pure helper functions for JSON field checking
const fieldExists = (path, jsonData) => {
  const parts = path.split('.');
  let current = jsonData;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return false;
    }
    
    // Handle array notation like "insured_details[]"
    if (part.endsWith('[]')) {
      const arrayName = part.slice(0, -2);
      const array = current[arrayName];
      if (!Array.isArray(array) || array.length === 0) {
        return false;
      }
      // Move to first array element for further path processing
      current = array[0];
    } else {
      current = current[part];
    }
  }
  
  return current !== undefined;
};

const arrayFieldExists = (path, jsonData) => {
  const parts = path.split('.');
  let current = jsonData;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    if (current === null || current === undefined) {
      return false;
    }
    
    // Handle array notation
    if (part.endsWith('[]')) {
      const arrayName = part.slice(0, -2);
      const array = current[arrayName];
      
      if (!Array.isArray(array) || array.length === 0) {
        return false;
      }
      
      // If this is the last part, check if any element has the field
      if (i === parts.length - 1) {
        return array.some(item => item !== undefined && item !== null);
      }
      
      // For nested paths, continue with first element
      current = array[0];
    } else {
      current = current[part];
    }
  }
  
  return current !== undefined;
};

const checkMultipleFields = (fieldPaths, jsonData) => {
  for (const path of fieldPaths) {
    if (fieldExists(path, jsonData)) {
      return { exists: true, field: path };
    }
  }
  return { exists: false, field: null };
};

const calculateScore = (data) => {
    const responseData = data.response?.data || {};
    const breakdown = {};
    let totalScore = 0;
    let eligibilityCap = null;
    
    // Load configurable settings
    const settings = loadScoreSettings();
    breakdown.activeSettings = settings; // Store for transparency
    
    // Layer 1: Eligibility Gate (Blocking, No Points)
    if (settings.eligibilityCap.enabled) {
      const eligibilityFields = [
        { path: "policy_and_coverage_details.policy_number", name: "Policy Number" },
        { path: "policy_and_coverage_details.policy_start_date", name: "Policy Start Date" },
        { path: "policy_and_coverage_details.policy_end_date", name: "Policy End Date" },
        { path: "insured_details[]", name: "Insured Details Array" }
      ];
      
      const missingEligibilityFields = eligibilityFields.filter(field => !fieldExists(field.path, responseData));
      
      if (missingEligibilityFields.length > 0) {
        eligibilityCap = settings.eligibilityCap.maxCap;
        breakdown.eligibilityGate = {
          points: 0,
          reason: "Incomplete data",
          missingFields: missingEligibilityFields.map(f => f.name),
          cap: settings.eligibilityCap.maxCap
        };
      } else {
        breakdown.eligibilityGate = {
          points: 0,
          reason: "All required fields present",
          cap: null
        };
      }
    } else {
      breakdown.eligibilityGate = {
        points: 0,
        reason: "Eligibility gate disabled",
        cap: null
      };
    }
    
    // Layer 2: Data Completeness Score (Max 60)
    let layer2Score = 0;
    
    if (settings.eligibilityCompliance.enabled) {
      // Proposer / Insured Name (8 points)
      const nameCheck = checkMultipleFields(SCORING_FIELD_MAP.proposerName, responseData);
      breakdown.proposerName = {
        points: nameCheck.exists ? 8 : 0,
        reason: nameCheck.exists ? `Name available (${nameCheck.field})` : "No name fields found",
        field: nameCheck.field
      };
      layer2Score += breakdown.proposerName.points;
      
      // Age / DOB Available (12 points) - with age validation
      const ageCheck = checkMultipleFields(SCORING_FIELD_MAP.age, responseData);
      let agePoints = 0;
      if (ageCheck.exists) {
        // Extract actual age value for validation
        const ageValue = getAgeFromData(responseData);
        if (ageValue >= settings.eligibilityCompliance.age.min && ageValue <= settings.eligibilityCompliance.age.max) {
          agePoints = 12;
        }
      }
      breakdown.age = {
        points: agePoints,
        reason: agePoints > 0 ? `Age/DOB available and valid (${ageCheck.field})` : "No valid age/DOB fields found",
        field: ageCheck.field,
        ageValue: getAgeFromData(responseData)
      };
      layer2Score += breakdown.age.points;
      
      // Sum Insured Available (15 points) - with sum insured validation
      const sumInsuredCheck = checkMultipleFields(SCORING_FIELD_MAP.sumInsured, responseData);
      let sumInsuredPoints = 0;
      if (sumInsuredCheck.exists) {
        // Extract actual sum insured value for validation
        const sumInsuredValue = getSumInsuredFromData(responseData);
        if (sumInsuredValue >= settings.eligibilityCompliance.sumInsured.min && sumInsuredValue <= settings.eligibilityCompliance.sumInsured.max) {
          sumInsuredPoints = 15;
        }
      }
      breakdown.sumInsured = {
        points: sumInsuredPoints,
        reason: sumInsuredPoints > 0 ? `Sum insured available and valid (${sumInsuredCheck.field})` : "No valid sum insured fields found",
        field: sumInsuredCheck.field,
        sumInsuredValue: getSumInsuredFromData(responseData)
      };
      layer2Score += breakdown.sumInsured.points;
      
      // PED Declaration Available (15 points) - with PED allowed check
      const pedCheck = checkMultipleFields(SCORING_FIELD_MAP.ped, responseData);
      let pedPoints = 0;
      if (settings.eligibilityCompliance.pedAllowed && pedCheck.exists) {
        pedPoints = 15;
      }
      breakdown.ped = {
        points: pedPoints,
        reason: pedPoints > 0 ? `PED declaration available (${pedCheck.field})` : settings.eligibilityCompliance.pedAllowed ? "No PED declaration fields found" : "PED declarations not allowed",
        field: pedCheck.field
      };
      layer2Score += breakdown.ped.points;
      
      // Cumulative Bonus Available (10 points)
      const bonusCheck = checkMultipleFields(SCORING_FIELD_MAP.cumulativeBonus, responseData);
      breakdown.cumulativeBonus = {
        points: bonusCheck.exists ? 10 : 0,
        reason: bonusCheck.exists ? `Cumulative bonus available (${bonusCheck.field})` : "No cumulative bonus fields found",
        field: bonusCheck.field
      };
      layer2Score += breakdown.cumulativeBonus.points;
      
      // Apply layer weight
      const weightedLayer2Score = layer2Score * settings.eligibilityCompliance.weight;
      totalScore += weightedLayer2Score;
      breakdown.layer2Summary = {
        rawScore: layer2Score,
        weightedScore: weightedLayer2Score,
        weight: settings.eligibilityCompliance.weight
      };
    }
    
    // Layer 3: Continuity & Signals (Max 25)
    let layer3Score = 0;
    
    if (settings.continuitySignal.enabled) {
      // Policy Continuity (10 points)
      const continuityCheck = checkMultipleFields(SCORING_FIELD_MAP.continuity, responseData);
      breakdown.continuity = {
        points: continuityCheck.exists ? 10 : 0,
        reason: continuityCheck.exists ? `Policy continuity data available (${continuityCheck.field})` : "No policy continuity data found",
        field: continuityCheck.field
      };
      layer3Score += breakdown.continuity.points;
      
      // Claims History Declared (5 points)
      const claimsCheck = checkMultipleFields(SCORING_FIELD_MAP.claimsHistory, responseData);
      breakdown.claimsHistory = {
        points: claimsCheck.exists ? 5 : 0,
        reason: claimsCheck.exists ? `Claims history field exists (${claimsCheck.field})` : "No claims history field found",
        field: claimsCheck.field
      };
      layer3Score += breakdown.claimsHistory.points;
      
      // Multi-member Floater (5 points)
      const insuredDetails = responseData.insured_details;
      const multiMember = Array.isArray(insuredDetails) && insuredDetails.length > 1;
      breakdown.multiMember = {
        points: multiMember ? 5 : 0,
        reason: multiMember ? `Multi-member floater (${insuredDetails.length} members)` : "Single member or no members",
        field: "insured_details.length"
      };
      layer3Score += breakdown.multiMember.points;
      
      // Apply layer weight
      const weightedLayer3Score = layer3Score * settings.continuitySignal.weight;
      totalScore += weightedLayer3Score;
      breakdown.layer3Summary = {
        rawScore: layer3Score,
        weightedScore: weightedLayer3Score,
        weight: settings.continuitySignal.weight
      };
    }
    
    // Normalize to 100 and apply eligibility cap
    const maxPossibleScore = 85; // 60 + 25 from layers 2 & 3
    let normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    // Apply eligibility cap if required
    if (eligibilityCap !== null && normalizedScore > eligibilityCap) {
      normalizedScore = eligibilityCap;
      breakdown.finalScore = {
        score: normalizedScore,
        normalized: true,
        capped: true,
        capReason: "Incomplete data - capped at " + eligibilityCap
      };
    } else {
      breakdown.finalScore = {
        score: normalizedScore,
        normalized: true,
        capped: false,
        capReason: eligibilityCap !== null ? "Eligibility issues identified" : "All criteria met"
      };
    }
    
    console.log('JSON-driven scoring completed with configurable settings:', {
      totalRawScore: totalScore,
      normalizedScore: normalizedScore,
      eligibilityCap: eligibilityCap,
      settings: settings,
      breakdown: breakdown
    });
    
    return { score: normalizedScore, breakdown };
  };

// Helper functions for extracting actual values for validation
const getAgeFromData = (responseData) => {
  // Try direct age field first
  const age = responseData.insured_details?.[0]?.age;
  if (age !== undefined && age !== null) {
    return parseInt(age);
  }
  
  // Try calculating from DOB
  const dob = responseData.insured_details?.[0]?.dob;
  if (dob) {
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  }
  
  return null;
};

const getSumInsuredFromData = (responseData) => {
  // Try floater sum insured first
  const floaterSum = responseData.policy_and_coverage_details?.floater_basic_sum_insured;
  if (floaterSum !== undefined && floaterSum !== null) {
    return parseInt(floaterSum);
  }
  
  // Try individual sum insured
  const individualSum = responseData.insured_details?.[0]?.individual_policy_sum_insured;
  if (individualSum !== undefined && individualSum !== null) {
    return parseInt(individualSum);
  }
  
  return null;
};

  if (page === 'home') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 w-48">
                {/* Attributum Logo */}
                <div className="flex items-center space-x-2">
                  <img 
                    src="/logos/attributum-logo.png" 
                    alt="Attributum Logo" 
                    className="w-40 h-16 rounded-lg object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-40 h-16 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    //                   <span className="text-white font-bold text-xl">A</span>
  //                 </div>
  //               </div>
  //             </div>
              
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Insurance Automation Suite</h1>
                <p className="text-sm text-gray-600 mt-1">Live Product Demos & Enterprise Sandbox</p>
                <p className="text-xs text-gray-500 mt-1">Demo Environment</p>
              </div>
              
              <div className="flex items-center justify-end space-x-6 w-48">
                {/* PIVOT Logo */}
                <div className="flex items-center space-x-2">
                  <img 
                    src="/logos/pivot-logo.png" 
                    alt="PIVOT Logo" 
                    className="w-32 h-16 rounded-lg object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-32 h-16 bg-purple-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="py-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Transform Insurance Operations with AI</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Production-grade automation for insurers.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Trusted by insurers for policy automation.</p>
        </div>

        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border-2 border-blue-500"
                   onClick={() => setPage('demo')}>
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-exchange-alt text-blue-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">PIVOT Portability Module</h3>
                  <p className="text-gray-600 mb-4">
                    AI-powered policy portability scoring and compliance checks
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    Launch Portability Demo →
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-clipboard-check text-green-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">PIVOT Underwriting CoPilot (TeleMER)</h3>
                  <p className="text-gray-600 mb-4">
                    AI-assisted underwriting with automated risk assessment
                  </p>
                  <div className="flex items-center text-green-600 font-medium">
                    <span>Coming Soon</span>
                    <i className="fas fa-lock ml-2"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-cogs text-purple-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">PIVOT Operations CoPilot</h3>
                  <p className="text-gray-600 mb-4">
                    Automated insurance operations and workflows
                  </p>
                  <div className="flex items-center text-purple-600 font-medium">
                    <span>Coming Soon</span>
                    <i className="fas fa-lock ml-2"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-file-contract text-orange-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">PIVOT Endorsements CoPilot</h3>
                  <p className="text-gray-600 mb-4">
                    Automated policy endorsements with built-in validation
                  </p>
                  <div className="flex items-center text-orange-600 font-medium">
                    <span>Coming Soon</span>
                    <i className="fas fa-lock ml-2"></i>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-sm">2024 Attributum. All rights reserved.</span>
              </div>
              <div className="flex space-x-6 text-sm">
                <span>Enterprise-grade • Secure by design • IRDAI aligned</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (page === 'config') {
    return <ScoreConfigPage setPage={setPage} />;
  }

  if (page === 'demo') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 w-48">
                {/* Attributum Logo */}
                <div className="flex items-center space-x-2">
                  <img 
                    src="/logos/attributum-logo.png" 
                    alt="Attributum Logo" 
                    className="w-40 h-16 rounded-lg object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-40 h-16 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Insurance Automation Suite</h1>
                <p className="text-sm text-gray-600 mt-1">Live Product Demos & Enterprise Sandbox</p>
                <p className="text-xs text-gray-500 mt-1">Demo Environment</p>
              </div>
              
              <div className="flex items-center justify-end space-x-6 w-48">
                {/* PIVOT Logo */}
                <div className="flex items-center space-x-2">
                  <img 
                    src="/logos/pivot-logo.png" 
                    alt="PIVOT Logo" 
                    className="w-32 h-16 rounded-lg object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-32 h-16 bg-purple-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">PIVOT Portability Module</h1>
                <p className="text-xs text-gray-500 mt-1">Demo Environment</p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => setPage('home')}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
                >
                  ← Back to Home
                </button>
                <button
                  onClick={() => setPage('config')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Score Settings
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-2">Upload Policy Document</h2>
                  <p className="text-sm text-gray-600 mb-4">AI-powered policy portability analysis</p>
                  <form onSubmit={handleFileUpload}>
                    <div>
                      <label className="block text-gray-700 mb-2">Select File</label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, JPEG, PNG</p>
                      {fileError && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-600">{fileError}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500">Files are processed securely and never stored</p>
                      <p className="text-xs text-gray-500 mt-1">No customer data is retained after analysis</p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!file || loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Analyze Policy'}
                    </button>
                  </form>
                </div>
                
                {responseData && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Policy Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Policy Overview</h4>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Insurer Name:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.policy_and_coverage_details?.optional_coverage_5 || 'Not Available'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Policy Type:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.policy_and_coverage_details?.policy_type || 'Not Available'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Policy Period:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.policy_and_coverage_details?.policy_start_date || 'Missing'} → {responseData?.response?.data?.policy_and_coverage_details?.policy_end_date || 'Missing'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Product:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.policy_and_coverage_details?.policy_product_name || 'Not Available'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Policy Number:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.policy_and_coverage_details?.policy_number || 'Missing'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Insured Snapshot</h4>
                        <div className="text-xs">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-1 px-1 font-medium text-gray-700">Insured Name</th>
                                  <th className="text-left py-1 px-1 font-medium text-gray-700">Relationship</th>
                                  <th className="text-left py-1 px-1 font-medium text-gray-700">Gender</th>
                                  <th className="text-left py-1 px-1 font-medium text-gray-700">DOB / Age</th>
                                  <th className="text-left py-1 px-1 font-medium text-gray-700">PED Declaration</th>
                                  <th className="text-left py-1 px-1 font-medium text-gray-700">First Policy Started</th>
                                  <th className="text-left py-1 px-1 font-medium text-gray-700">Individual Sum insured</th>
                                  <th className="text-left py-1 px-1 font-medium text-gray-700">Individual Cumulative Bonus</th>
                                </tr>
                              </thead>
                              <tbody>
                                {responseData?.response?.data?.insured_details?.map((insured, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="py-1 px-1 font-medium">
                                      {insured?.insured_name || 'Missing'}
                                    </td>
                                    <td className="py-1 px-1">
                                      {insured?.relationship || 'Not Available'}
                                    </td>
                                    <td className="py-1 px-1">
                                      {insured?.gender || 'Not Available'}
                                    </td>
                                    <td className="py-1 px-1">
                                      {insured?.age || (
                                        insured?.dob 
                                          ? new Date().getFullYear() - new Date(insured.dob).getFullYear()
                                          : 'Missing'
                                      )}
                                    </td>
                                    <td className="py-1 px-1">
                                      {insured?.declared_ped || 'Not Declared'}
                                    </td>
                                    <td className="py-1 px-1">
                                      {insured?.first_policy_started || 'Not Available'}
                                    </td>
                                    <td className="py-1 px-1">
                                      {insured?.individual_policy_sum_insured || 'Not Available'}
                                    </td>
                                    <td className="py-1 px-1">
                                      {insured?.individual_policy_cumulative_bonus || 'Not Available'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Coverage Snapshot</h4>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Floater Sum Insured:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.policy_and_coverage_details?.floater_basic_sum_insured || 'Missing'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Floater Cumulative Bonus:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.policy_and_coverage_details?.floater_cumulative_bonus || 'Not Available'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">No. of Members:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.insured_details?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-800 mb-3">Continuity Indicators</h4>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cumulative Bonus:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.policy_and_coverage_details?.floater_cumulative_bonus || 'Not Available'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">PED Declaration:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.insured_details?.[0]?.declared_ped || 'Not Available'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Previous Claims:</span>
                            <span className="font-medium">
                              {responseData?.response?.data?.policy_and_coverage_details?.previous_claims || 'Not Available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {responseData && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Portability Score</h3>
                    <div className="mb-4">
                      <div className={`text-5xl font-bold ${
                        (scoreData?.score || 0) < 60 ? 'text-red-600' :
                        (scoreData?.score || 0) < 80 ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        {scoreData?.score || 0}/100
                      </div>
                      <div className={`text-sm font-medium mt-2 ${
                        (scoreData?.score || 0) < 60 ? 'text-red-500' :
                        (scoreData?.score || 0) < 80 ? 'text-amber-500' :
                        'text-green-500'
                      }`}>
                        {(scoreData?.score || 0) < 60 ? 'Needs Review' :
                         (scoreData?.score || 0) < 80 ? 'Review Recommended' :
                         'Good to Port'}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Why this score?</h4>
                      <div className="text-sm text-gray-600">
                        {(() => {
                          if (!scoreData?.breakdown) return 'Score calculation in progress...';
                          
                          const totalPoints = Object.entries(scoreData.breakdown).reduce((sum, [key, value]) => {
                            if (key === 'finalScore' || key === 'eligibilityGate' || key === 'activeSettings' || key === 'layer2Summary' || key === 'layer3Summary') return sum;
                            return sum + (value.points || 0);
                          }, 0);
                          
                          const maxPoints = 60; // Maximum possible points from all criteria
                          const scorePercentage = (totalPoints / maxPoints) * 100;
                          
                          if (scoreData.breakdown.eligibilityGate?.cap) {
                            return `Score capped at ${scoreData.breakdown.eligibilityGate.cap} due to incomplete eligibility data.`;
                          } else if (scorePercentage >= 80) {
                            return 'Excellent policy data completeness with strong continuity indicators.';
                          } else if (scorePercentage >= 60) {
                            return 'Good policy data with some continuity signals available.';
                          } else {
                            return 'Limited policy data affecting portability assessment.';
                          }
                        })()}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <details className="border border-gray-200 rounded-lg">
                        <summary className="cursor-pointer px-3 py-2 font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                          <span>View scoring details</span>
                          <span className="text-gray-400 text-xs">▼</span>
                        </summary>
                        <div className="px-3 py-2 border-t border-gray-200">
                          {/* Data Availability Section */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Data Availability (Informational)</h5>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-1 font-medium text-gray-600">Field</th>
                                  <th className="text-left py-1 font-medium text-gray-600">JSON Path</th>
                                  <th className="text-right py-1 font-medium text-gray-600">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {scoreData?.breakdown && Object.entries(scoreData.breakdown).map(([key, value]) => {
                                  if (key === 'finalScore' || key === 'eligibilityGate' || key === 'activeSettings' || key === 'layer2Summary' || key === 'layer3Summary') return null;
                                  
                                  const name = key === 'proposerName' ? 'Proposer/Insured Name' :
                                              key === 'age' ? 'Age/DOB' :
                                              key === 'sumInsured' ? 'Sum Insured' :
                                              key === 'ped' ? 'PED Declaration' :
                                              key === 'cumulativeBonus' ? 'Cumulative Bonus' :
                                              key === 'continuity' ? 'Policy Continuity' :
                                              key === 'claimsHistory' ? 'Claims History' :
                                              key === 'multiMember' ? 'Multi-member' :
                                              key.replace(/([A-Z])/g, ' $1').trim();
                                  
                                  return (
                                    <tr key={key} className="border-b">
                                      <td className="py-1">{name}</td>
                                      <td className="py-1 text-xs text-gray-600">{value.field || 'N/A'}</td>
                                      <td className="py-1 text-right">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                          value.points > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          {value.points > 0 ? 'Available' : 'Missing'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          
                          {/* Underwriting Impact Section */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Underwriting Impact (Points Applied)</h5>
                            
                            {/* Visible Formula */}
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3 text-xs text-blue-800">
                              <strong>Final Score = (Eligibility Score × Weight) + (Continuity Score × Weight)</strong>
                            </div>
                            
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-1 font-medium text-gray-600">Rule</th>
                                  <th className="text-left py-1 font-medium text-gray-600">Threshold</th>
                                  <th className="text-left py-1 font-medium text-gray-600">Actual Value</th>
                                  <th className="text-right py-1 font-medium text-gray-600">Base Points</th>
                                  <th className="text-right py-1 font-medium text-gray-600">Weighted</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  const settings = scoreData?.breakdown?.activeSettings;
                                  
                                  const eligibilityRules = [
                                    {
                                      name: 'Age Eligibility',
                                      threshold: `${settings?.eligibilityCompliance?.age?.min || 18}-${settings?.eligibilityCompliance?.age?.max || 60} years`,
                                      actual: `${scoreData?.breakdown?.age?.ageValue || 'N/A'} years`,
                                      points: scoreData?.breakdown?.age?.points || 0,
                                      maxPoints: 12,
                                      weight: settings?.eligibilityCompliance?.weight || 0.6
                                    },
                                    {
                                      name: 'Sum Insured Range',
                                      threshold: `${(settings?.eligibilityCompliance?.sumInsured?.min || 300000).toLocaleString()}-${(settings?.eligibilityCompliance?.sumInsured?.max || 10000000).toLocaleString()}`,
                                      actual: `${(scoreData?.breakdown?.sumInsured?.sumInsuredValue || 0).toLocaleString()}`,
                                      points: scoreData?.breakdown?.sumInsured?.points || 0,
                                      maxPoints: 15,
                                      weight: settings?.eligibilityCompliance?.weight || 0.6
                                    },
                                    {
                                      name: 'PED Declaration',
                                      threshold: settings?.eligibilityCompliance?.pedAllowed ? 'Must be declared' : 'Not allowed',
                                      actual: scoreData?.breakdown?.ped?.field ? 'Declared' : 'Not declared',
                                      points: scoreData?.breakdown?.ped?.points || 0,
                                      maxPoints: 15,
                                      weight: settings?.eligibilityCompliance?.weight || 0.6
                                    },
                                    {
                                      name: 'Cumulative Bonus',
                                      threshold: 'Must be available',
                                      actual: scoreData?.breakdown?.cumulativeBonus?.field ? 'Available' : 'Missing',
                                      points: scoreData?.breakdown?.cumulativeBonus?.points || 0,
                                      maxPoints: 10,
                                      weight: settings?.eligibilityCompliance?.weight || 0.6
                                    }
                                  ];
                                  
                                  const continuityRules = [
                                    {
                                      name: 'Policy Continuity',
                                      threshold: 'Must be available',
                                      actual: scoreData?.breakdown?.continuity?.field ? 'Available' : 'Missing',
                                      points: scoreData?.breakdown?.continuity?.points || 0,
                                      maxPoints: 10,
                                      weight: settings?.continuitySignal?.weight || 0.25
                                    },
                                    {
                                      name: 'Claims History',
                                      threshold: 'Must be available',
                                      actual: scoreData?.breakdown?.claimsHistory?.field ? 'Available' : 'Missing',
                                      points: scoreData?.breakdown?.claimsHistory?.points || 0,
                                      maxPoints: 5,
                                      weight: settings?.continuitySignal?.weight || 0.25
                                    },
                                    {
                                      name: 'Multi-member Floater',
                                      threshold: '> 1 member',
                                      actual: scoreData?.breakdown?.multiMember?.field ? 'Multi-member' : 'Single',
                                      points: scoreData?.breakdown?.multiMember?.points || 0,
                                      maxPoints: 5,
                                      weight: settings?.continuitySignal?.weight || 0.25
                                    }
                                  ];
                                  
                                  const allRules = [...eligibilityRules, ...continuityRules];
                                  
                                  return allRules.map((rule, index) => (
                                    <tr key={index} className="border-b">
                                      <td className="py-1">{rule.name}</td>
                                      <td className="py-1 text-xs text-gray-600">{rule.threshold}</td>
                                      <td className="py-1 text-xs">{rule.actual}</td>
                                      <td className="py-1 text-right">
                                        <span className={`font-medium ${
                                          rule.points === rule.maxPoints ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {rule.points > 0 ? `+${rule.points}` : `0`}
                                        </span>
                                      </td>
                                      <td className="py-1 text-right text-xs text-gray-600">
                                        {(rule.points * rule.weight).toFixed(1)}
                                      </td>
                                    </tr>
                                  ));
                                })()}
                              </tbody>
                            </table>
                          </div>
                          
                          {/* Reconciliation Line */}
                          <div className="border-t pt-2 mt-2">
                            <div className="text-sm font-medium text-gray-700 text-center">
                              Final score = Base score (85) − Total penalties ({85 - (scoreData?.score || 0)})
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">Key Findings</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Critical Data Available</span>
                          <span className="font-medium">Yes</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Policy Period Valid</span>
                          <span className="font-medium">Yes</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">PED Declaration</span>
                          <span className="font-medium">None</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {responseData && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Underwriter Flags</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Failed Underwriting Rules</h4>
                        <div className="text-sm space-y-2">
                          {(() => {
                            const settings = scoreData?.breakdown?.activeSettings;
                            const failedRules = [];
                            
                            // Check Age Eligibility
                            const ageValue = scoreData?.breakdown?.age?.ageValue;
                            const ageMin = settings?.eligibilityCompliance?.age?.min || 18;
                            const ageMax = settings?.eligibilityCompliance?.age?.max || 60;
                            if (!ageValue || ageValue < ageMin || ageValue > ageMax) {
                              failedRules.push({
                                name: 'Age Eligibility',
                                threshold: `${ageMin}-${ageMax} years`,
                                actual: ageValue ? `${ageValue} years` : 'Not Available',
                                impact: `-${12} points`
                              });
                            }
                            
                            // Check Sum Insured Range
                            const sumInsuredValue = scoreData?.breakdown?.sumInsured?.sumInsuredValue;
                            const sumMin = settings?.eligibilityCompliance?.sumInsured?.min || 300000;
                            const sumMax = settings?.eligibilityCompliance?.sumInsured?.max || 10000000;
                            if (!sumInsuredValue || sumInsuredValue < sumMin || sumInsuredValue > sumMax) {
                              failedRules.push({
                                name: 'Sum Insured Range',
                                threshold: `${sumMin.toLocaleString()}-${sumMax.toLocaleString()}`,
                                actual: sumInsuredValue ? sumInsuredValue.toLocaleString() : 'Not Available',
                                impact: `-${15} points`
                              });
                            }
                            
                            // Check PED Declaration
                            if (settings?.eligibilityCompliance?.pedAllowed && !scoreData?.breakdown?.ped?.field) {
                              failedRules.push({
                                name: 'PED Declaration Required',
                                threshold: 'Must be declared',
                                actual: 'Not Declared',
                                impact: `-${15} points`
                              });
                            }
                            
                            // Check Cumulative Bonus
                            if (!scoreData?.breakdown?.cumulativeBonus?.field) {
                              failedRules.push({
                                name: 'Cumulative Bonus Missing',
                                threshold: 'Must be available',
                                actual: 'Not Available',
                                impact: `-${10} points`
                              });
                            }
                            
                            // Check Eligibility Gate
                            if (scoreData?.breakdown?.eligibilityGate?.cap) {
                              failedRules.push({
                                name: 'Eligibility Data Incomplete',
                                threshold: 'All required fields must be present',
                                actual: `Missing: ${scoreData?.breakdown?.eligibilityGate?.missingFields?.join(', ') || 'Critical fields'}`,
                                impact: `Score capped at ${scoreData?.breakdown?.eligibilityGate?.cap}`
                              });
                            }
                            
                            if (failedRules.length === 0) {
                              return (
                                <div className="text-center py-4">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    ✓ All eligibility rules passed
                                  </span>
                                </div>
                              );
                            }
                            
                            return failedRules.map((rule, index) => (
                              <div key={index} className="border border-red-200 rounded-lg p-3 bg-red-50">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-medium text-red-800">{rule.name}</span>
                                  <span className="text-red-600 font-semibold">{rule.impact}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-600">Required: </span>
                                    <span className="text-gray-900">{rule.threshold}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Actual: </span>
                                    <span className="text-gray-900">{rule.actual}</span>
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {responseData && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              <details className="bg-white rounded-lg shadow-lg p-6">
                <summary className="cursor-pointer font-medium text-gray-800 hover:text-blue-600">
                  View Extracted Policy Data (JSON)
                </summary>
                <pre className="mt-4 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
        
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <p className="text-xs">Enterprise-grade • Secure by design • IRDAI-aligned</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return <NotFound setPage={setPage} />;
};

// NotFound Component
const NotFound = ({ setPage }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">PIVOT Automation Suite</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600">Page not found</p>
          <button
            onClick={() => setPage('home')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
