const { useState, useEffect } = React;

// Configurable score settings
const SCORE_SETTINGS = {
  dataAvailability: {
    enabled: true,
    maxPoints: 30
  },
  pedDeclaration: {
    enabled: true,
    points: 15
  },
  policyCurrency: {
    enabled: true,
    points: 15,
    defaultDays: 30
  },
  continuityBonus: {
    enabled: true,
    points: 20
  },
  highSumInsuredRisk: {
    enabled: true,
    points: 20,
    individualLimit: 500000,
    floaterLimit: 1000000
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
        dataAvailability: { ...SCORE_SETTINGS.dataAvailability, ...parsed.dataAvailability },
        pedDeclaration: { ...SCORE_SETTINGS.pedDeclaration, ...parsed.pedDeclaration },
        policyCurrency: { ...SCORE_SETTINGS.policyCurrency, ...parsed.policyCurrency },
        continuityBonus: { ...SCORE_SETTINGS.continuityBonus, ...parsed.continuityBonus },
        highSumInsuredRisk: { ...SCORE_SETTINGS.highSumInsuredRisk, ...parsed.highSumInsuredRisk }
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

  const handleDataAvailabilityChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      dataAvailability: {
        ...prev.dataAvailability,
        [field]: field === 'maxPoints' ? parseInt(value) || 0 : value
      }
    }));
  };

  const handlePedDeclarationChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      pedDeclaration: {
        ...prev.pedDeclaration,
        [field]: field === 'points' ? parseInt(value) || 0 : value
      }
    }));
  };

  const handlePolicyCurrencyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      policyCurrency: {
        ...prev.policyCurrency,
        [field]: field === 'points' || field === 'defaultDays' ? parseInt(value) || 0 : value
      }
    }));
  };

  const handleContinuityBonusChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      continuityBonus: {
        ...prev.continuityBonus,
        [field]: field === 'points' ? parseInt(value) || 0 : value
      }
    }));
  };

  const handleHighSumInsuredRiskChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      highSumInsuredRisk: {
        ...prev.highSumInsuredRisk,
        [field]: field === 'points' || field === 'individualLimit' || field === 'floaterLimit' ? parseInt(value) || 0 : value
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
              <h1 className="text-2xl font-bold text-gray-800 mb-6">PIVOT Portability Score Settings</h1>
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
              ← Back to Portability Demo
            </button>
          </div>
          
          {/* Section 1: Data Availability */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Data Availability</h2>
            
            <div className="space-y-6">
              {/* Max Points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Max Points</label>
                  <span className="text-sm text-gray-600">Current: {settings.dataAvailability.maxPoints}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.dataAvailability.maxPoints}
                  onChange={(e) => handleDataAvailabilityChange('maxPoints', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum points for data availability (proportional across critical fields)</p>
              </div>

              {/* Contributing JSON Fields (Read-only) */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Contributing JSON Fields</h3>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• policy_and_coverage_details.policy_number</li>
                    <li>• policy_and_coverage_details.policy_start_date</li>
                    <li>• policy_and_coverage_details.policy_end_date</li>
                    <li>• insured_details[]</li>
                    <li>• proposer_details.first_name</li>
                    <li>• proposer_details.last_name</li>
                    <li>• insured_details[].age</li>
                    <li>• insured_details[].individual_policy_sum_insured</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2 italic">Points awarded proportionally based on available fields</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: PED Declaration Presence */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">PED Declaration Presence</h2>
            
            <div className="space-y-6">
              {/* Points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <span className="text-sm text-gray-600">Current: {settings.pedDeclaration.points}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.pedDeclaration.points}
                  onChange={(e) => handlePedDeclarationChange('points', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Points awarded by default, set to zero if any insured has declared PED (risk factor)</p>
              </div>
            </div>
          </div>

          {/* Section 3: Policy Currency */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Policy Currency</h2>
            
            <div className="space-y-6">
              {/* Points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <span className="text-sm text-gray-600">Current: {settings.policyCurrency.points}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.policyCurrency.points}
                  onChange={(e) => handlePolicyCurrencyChange('points', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Points awarded if policy is within currency period</p>
              </div>

              {/* Max Days Since Policy End */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Max Days Since Policy End</label>
                  <span className="text-sm text-gray-600">Current: {settings.policyCurrency.defaultDays}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={settings.policyCurrency.defaultDays}
                  onChange={(e) => handlePolicyCurrencyChange('defaultDays', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Days before policy expiry to consider currency (default 30)</p>
              </div>
            </div>
          </div>

          {/* Section 4: Policy Continuity */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Policy Continuity</h2>
            
            <div className="space-y-6">
              {/* Points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <span className="text-sm text-gray-600">Current: {settings.continuityBonus.points}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.continuityBonus.points}
                  onChange={(e) => handleContinuityBonusChange('points', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Points awarded if any insured has first_policy_started</p>
              </div>
            </div>
          </div>

          {/* Section 5: High Sum Insured Risk */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">High Sum Insured Risk</h2>
            
            <div className="space-y-6">
              {/* Points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Points</label>
                  <span className="text-sm text-gray-600">Current: {settings.highSumInsuredRisk.points}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.highSumInsuredRisk.points}
                  onChange={(e) => handleHighSumInsuredRiskChange('points', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Points awarded if sum insured values are within limits</p>
              </div>

              {/* Individual SI Upper Limit */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Individual SI Upper Limit</label>
                  <span className="text-sm text-gray-600">Current: {settings.highSumInsuredRisk.individualLimit.toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={settings.highSumInsuredRisk.individualLimit}
                  onChange={(e) => handleHighSumInsuredRiskChange('individualLimit', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum individual policy sum insured for risk assessment (default ₹5,00,000)</p>
              </div>

              {/* Floater SI Upper Limit */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Floater SI Upper Limit</label>
                  <span className="text-sm text-gray-600">Current: {settings.highSumInsuredRisk.floaterLimit.toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={settings.highSumInsuredRisk.floaterLimit}
                  onChange={(e) => handleHighSumInsuredRiskChange('floaterLimit', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum floater policy sum insured for risk assessment (default ₹10,00,000)</p>
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
    
    // Load configurable settings
    const settings = loadScoreSettings();
    breakdown.activeSettings = settings; // Store for transparency
    
    // 1. Data Availability: max 30 points (proportional across critical fields)
    let dataAvailabilityScore = 0;
    if (settings.dataAvailability.enabled) {
      const criticalFields = [
        { path: "policy_and_coverage_details.policy_number", name: "Policy Number" },
        { path: "policy_and_coverage_details.policy_start_date", name: "Policy Start Date" },
        { path: "policy_and_coverage_details.policy_end_date", name: "Policy End Date" },
        { path: "insured_details[]", name: "Insured Details Array" },
        { path: "proposer_details.first_name", name: "Proposer First Name" },
        { path: "proposer_details.last_name", name: "Proposer Last Name" },
        { path: "insured_details[].age", name: "Insured Age" },
        { path: "insured_details[].individual_policy_sum_insured", name: "Individual Sum Insured" }
      ];
      
      const availableFields = criticalFields.filter(field => fieldExists(field.path, responseData));
      dataAvailabilityScore = Math.round((availableFields.length / criticalFields.length) * settings.dataAvailability.maxPoints);
      
      breakdown.dataAvailability = {
        points: dataAvailabilityScore,
        maxPoints: settings.dataAvailability.maxPoints,
        availableFields: availableFields.map(f => f.name),
        missingFields: criticalFields.filter(f => !availableFields.includes(f)).map(f => f.name)
      };
      totalScore += dataAvailabilityScore;
    }
    
    // 2. PED Declaration Presence: 15 points by default, 0 points if any insured has declared_ped present (risk factor)
    let pedDeclarationScore = 0;
    if (settings.pedDeclaration.enabled) {
      const insuredDetails = responseData.insured_details || [];
      
      const hasPED = insuredDetails.some(insured => {
        const pedValue = insured.declared_ped;
        if (!pedValue || pedValue.trim() === '') {
          return false; // No PED field or empty = no PED
        }
        
        const normalizedPED = pedValue.trim().toLowerCase();
        const noPEDIndicators = ['no ped declared', 'none', 'no ped', 'no peds', 'no pre-existing diseases', 'no pre-existing disease'];
        
        // Check if the value indicates no PED
        const isNoPED = noPEDIndicators.some(indicator => normalizedPED === indicator);
        
        // If it's a "no PED" indicator, return false (no PED), otherwise return true (has PED)
        return !isNoPED;
      });
      
      // Inverted logic: Start with full points, set to zero if PED declared (risk factor)
      pedDeclarationScore = hasPED ? 0 : settings.pedDeclaration.points;
      
      breakdown.pedDeclaration = {
        points: pedDeclarationScore,
        maxPoints: settings.pedDeclaration.points,
        hasPED: hasPED,
        reason: hasPED ? "PED declared by one or more insured (risk factor)" : "No PED declarations (no risk)"
      };
      totalScore += pedDeclarationScore;
    }
    
    // 3. Policy Currency: 15 points if policy_end_date within configurable N days
    let policyCurrencyScore = 0;
    if (settings.policyCurrency.enabled) {
      const policyEndDate = responseData.policy_and_coverage_details?.policy_end_date;
      if (policyEndDate) {
        // Parse DD/MM/YYYY format
        const dateParts = policyEndDate.split('/');
        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-indexed
          const year = parseInt(dateParts[2]);
          const endDate = new Date(year, month, day);
          
          const today = new Date();
          const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysUntilExpiry >= 0 && daysUntilExpiry <= settings.policyCurrency.defaultDays) {
            policyCurrencyScore = settings.policyCurrency.points;
          }
          
          breakdown.policyCurrency = {
            points: policyCurrencyScore,
            maxPoints: settings.policyCurrency.points,
            daysUntilExpiry: daysUntilExpiry,
            threshold: settings.policyCurrency.defaultDays,
            policyEndDate: policyEndDate,
            reason: policyCurrencyScore > 0 
              ? `Policy expires in ${daysUntilExpiry} days (within ${settings.policyCurrency.defaultDays} day threshold)`
              : `Policy expires in ${daysUntilExpiry} days (outside ${settings.policyCurrency.defaultDays} day threshold)`
          };
        } else {
          // Fallback for invalid date format
          breakdown.policyCurrency = {
            points: 0,
            maxPoints: settings.policyCurrency.points,
            daysUntilExpiry: null,
            threshold: settings.policyCurrency.defaultDays,
            policyEndDate: policyEndDate,
            reason: "Invalid date format (expected DD/MM/YYYY)"
          };
        }
      } else {
        breakdown.policyCurrency = {
          points: 0,
          maxPoints: settings.policyCurrency.points,
          daysUntilExpiry: null,
          threshold: settings.policyCurrency.defaultDays,
          policyEndDate: null,
          reason: "Policy end date not available"
        };
      }
      totalScore += policyCurrencyScore;
    }
    
    // 4. Continuity Bonus: 20 points if any insured has first_policy_started
    let continuityBonusScore = 0;
    if (settings.continuityBonus.enabled) {
      const insuredDetails = responseData.insured_details || [];
      const hasContinuity = insuredDetails.some(insured => 
        insured.first_policy_started && insured.first_policy_started.trim() !== ''
      );
      
      continuityBonusScore = hasContinuity ? settings.continuityBonus.points : 0;
      
      breakdown.continuityBonus = {
        points: continuityBonusScore,
        maxPoints: settings.continuityBonus.points,
        hasContinuity: hasContinuity,
        reason: hasContinuity ? "Policy continuity data available" : "No policy continuity data found"
      };
      totalScore += continuityBonusScore;
    }
    
    // 5. High Sum Insured Risk: 20 points if BOTH conditions met
    let highSumInsuredRiskScore = 0;
    if (settings.highSumInsuredRisk.enabled) {
      const insuredDetails = responseData.insured_details || [];
      const floaterSumInsured = responseData.policy_and_coverage_details?.floater_basic_sum_insured;
      
      // Check individual sum insured condition
      const individualSumInsureds = insuredDetails
        .map(insured => parseInt(insured.individual_policy_sum_insured) || 0)
        .filter(si => si > 0);
      
      const individualCondition = individualSumInsureds.length === 0 || 
        Math.max(...individualSumInsureds) <= settings.highSumInsuredRisk.individualLimit;
      
      // Check floater sum insured condition
      const floaterCondition = !floaterSumInsured || 
        parseInt(floaterSumInsured) <= settings.highSumInsuredRisk.floaterLimit;
      
      // Award points only if BOTH conditions are met
      if (individualCondition && floaterCondition) {
        highSumInsuredRiskScore = settings.highSumInsuredRisk.points;
      }
      
      breakdown.highSumInsuredRisk = {
        points: highSumInsuredRiskScore,
        maxPoints: settings.highSumInsuredRisk.points,
        individualCondition: individualCondition,
        floaterCondition: floaterCondition,
        maxIndividualSumInsured: individualSumInsureds.length > 0 ? Math.max(...individualSumInsureds) : 0,
        individualLimit: settings.highSumInsuredRisk.individualLimit,
        floaterSumInsured: floaterSumInsured ? parseInt(floaterSumInsured) : 0,
        floaterLimit: settings.highSumInsuredRisk.floaterLimit,
        reason: highSumInsuredRiskScore > 0 
          ? "Both individual and floater sum insured within risk limits"
          : "Sum insured values exceed risk limits"
      };
      totalScore += highSumInsuredRiskScore;
    }
    
    // Final score calculation (additive-only, no weights or normalization)
    breakdown.finalScore = totalScore;
    breakdown.scoreBreakdown = {
      dataAvailability: dataAvailabilityScore,
      pedDeclaration: pedDeclarationScore,
      policyCurrency: policyCurrencyScore,
      continuityBonus: continuityBonusScore,
      highSumInsuredRisk: highSumInsuredRiskScore,
      total: totalScore
    };
    
    return {
      score: totalScore,
      breakdown: breakdown,
      responseData: responseData
    };
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
                          <span>Scoring breakdown</span>
                          <span className="text-gray-400 text-xs">▼</span>
                        </summary>
                        <div className="px-3 py-2 border-t border-gray-200">
                          {/* Visible Formula */}
                          <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3 text-xs text-blue-800">
                            <strong>Final Score = Data Availability + PED Declaration + Policy Currency + Policy Continuity + High Sum Insured Risk</strong>
                          </div>
                          
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-1 font-medium text-gray-600">Component</th>
                                <th className="text-left py-1 font-medium text-gray-600">Condition</th>
                                <th className="text-left py-1 font-medium text-gray-600">Actual</th>
                                <th className="text-right py-1 font-medium text-gray-600">Points</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const settings = scoreData?.breakdown?.activeSettings;
                                
                                const components = [
                                  {
                                    name: 'Data Availability',
                                    condition: `${scoreData?.breakdown?.dataAvailability?.availableFields?.length || 0}/${scoreData?.breakdown?.dataAvailability?.availableFields?.length + (scoreData?.breakdown?.dataAvailability?.missingFields?.length || 0)} fields`,
                                    actual: scoreData?.breakdown?.dataAvailability?.availableFields?.join(', ') || 'None',
                                    points: scoreData?.breakdown?.dataAvailability?.points || 0,
                                    maxPoints: settings?.dataAvailability?.maxPoints || 30
                                  },
                                  {
                                    name: 'PED Declaration',
                                    condition: 'No PED declarations required',
                                    actual: scoreData?.breakdown?.pedDeclaration?.hasPED ? 'PED declared (risk factor)' : 'No PED (no risk)',
                                    points: scoreData?.breakdown?.pedDeclaration?.points || 0,
                                    maxPoints: settings?.pedDeclaration?.points || 15
                                  },
                                  {
                                    name: 'Policy Currency',
                                    condition: `Expires within ${settings?.policyCurrency?.defaultDays || 30} days`,
                                    actual: scoreData?.breakdown?.policyCurrency?.daysUntilExpiry !== null 
                                      ? `${scoreData?.breakdown?.policyCurrency?.daysUntilExpiry} days` 
                                      : 'No expiry date',
                                    points: scoreData?.breakdown?.policyCurrency?.points || 0,
                                    maxPoints: settings?.policyCurrency?.points || 15
                                  },
                                  {
                                    name: 'Policy Continuity',
                                    condition: 'Any insured has first_policy_started',
                                    actual: scoreData?.breakdown?.continuityBonus?.hasContinuity ? 'Continuity data available' : 'No continuity data',
                                    points: scoreData?.breakdown?.continuityBonus?.points || 0,
                                    maxPoints: settings?.continuityBonus?.points || 20
                                  },
                                  {
                                    name: 'High Sum Insured Risk',
                                    condition: `Individual ≤ ₹${(settings?.highSumInsuredRisk?.individualLimit || 500000).toLocaleString()} AND Floater ≤ ₹${(settings?.highSumInsuredRisk?.floaterLimit || 1000000).toLocaleString()}`,
                                    actual: scoreData?.breakdown?.highSumInsuredRisk?.points > 0 
                                      ? 'Within limits' 
                                      : `Exceeds limits (Individual: ₹${scoreData?.breakdown?.highSumInsuredRisk?.maxIndividualSumInsured?.toLocaleString()}, Floater: ₹${scoreData?.breakdown?.highSumInsuredRisk?.floaterSumInsured?.toLocaleString()})`,
                                    points: scoreData?.breakdown?.highSumInsuredRisk?.points || 0,
                                    maxPoints: settings?.highSumInsuredRisk?.points || 20
                                  }
                                ];
                                
                                return components.map((component, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="py-1">{component.name}</td>
                                    <td className="py-1 text-xs text-gray-600">{component.condition}</td>
                                    <td className="py-1 text-xs">{component.actual}</td>
                                    <td className="py-1 text-right">
                                      <span className={`font-medium ${
                                        component.points === component.maxPoints ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {component.points > 0 ? `+${component.points}` : '0'}
                                      </span>
                                    </td>
                                  </tr>
                                ));
                              })()}
                            </tbody>
                          </table>
                          
                          {/* Reconciliation Line */}
                          <div className="border-t pt-2 mt-2">
                            <div className="text-sm font-medium text-gray-700 text-center">
                              Final Score = {scoreData?.breakdown?.scoreBreakdown?.dataAvailability || 0} + {scoreData?.breakdown?.scoreBreakdown?.pedDeclaration || 0} + {scoreData?.breakdown?.scoreBreakdown?.policyCurrency || 0} + {scoreData?.breakdown?.scoreBreakdown?.continuityBonus || 0} + {scoreData?.breakdown?.scoreBreakdown?.highSumInsuredRisk || 0} = {scoreData?.score || 0}
                            </div>
                          </div>
                        </div>
                      </details>
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
                            
                            // Check Data Availability
                            const missingFields = scoreData?.breakdown?.dataAvailability?.missingFields || [];
                            if (missingFields.length > 0) {
                              failedRules.push({
                                name: 'Data Availability',
                                threshold: 'All critical fields must be present',
                                actual: `Missing: ${missingFields.join(', ')}`,
                                impact: `-${settings?.dataAvailability?.maxPoints - (scoreData?.breakdown?.dataAvailability?.points || 0)} points`
                              });
                            }
                            
                            // Check PED Declaration (now a risk factor - points become zero)
                            if (scoreData?.breakdown?.pedDeclaration?.hasPED) {
                              failedRules.push({
                                name: 'PED Declaration',
                                threshold: 'No PED declarations required',
                                actual: 'PED declared by one or more insured',
                                impact: `-${settings?.pedDeclaration?.points} points (risk factor)`
                              });
                            }
                            
                            // Check Policy Currency
                            const daysUntilExpiry = scoreData?.breakdown?.policyCurrency?.daysUntilExpiry;
                            if (daysUntilExpiry === null || daysUntilExpiry < 0 || daysUntilExpiry > (settings?.policyCurrency?.defaultDays || 30)) {
                              failedRules.push({
                                name: 'Policy Currency',
                                threshold: `Must expire within ${settings?.policyCurrency?.defaultDays || 30} days`,
                                actual: daysUntilExpiry !== null ? `${daysUntilExpiry} days until expiry` : 'No expiry date',
                                impact: `-${settings?.policyCurrency?.points} points`
                              });
                            }
                            
                            // Check Policy Continuity
                            if (!scoreData?.breakdown?.continuityBonus?.hasContinuity) {
                              failedRules.push({
                                name: 'Policy Continuity',
                                threshold: 'Any insured must have first_policy_started',
                                actual: 'No continuity data found',
                                impact: `-${settings?.continuityBonus?.points} points`
                              });
                            }
                            
                            // Check High Sum Insured Risk
                            if (scoreData?.breakdown?.highSumInsuredRisk?.points === 0) {
                              failedRules.push({
                                name: 'High Sum Insured Risk',
                                threshold: `Individual ≤ ₹${(settings?.highSumInsuredRisk?.individualLimit || 500000).toLocaleString()} AND Floater ≤ ₹${(settings?.highSumInsuredRisk?.floaterLimit || 1000000).toLocaleString()}`,
                                actual: `Individual: ₹${scoreData?.breakdown?.highSumInsuredRisk?.maxIndividualSumInsured?.toLocaleString()}, Floater: ₹${scoreData?.breakdown?.highSumInsuredRisk?.floaterSumInsured?.toLocaleString()}`,
                                impact: `-${settings?.highSumInsuredRisk?.points} points`
                              });
                            }
                            
                            if (failedRules.length === 0) {
                              return (
                                <div className="text-center py-4">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    ✓ All scoring criteria passed
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
