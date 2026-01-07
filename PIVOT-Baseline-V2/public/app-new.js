const { useState, useEffect } = React;

// Score Configuration Page Component
const ScoreConfigPage = ({ setPage }) => {
  const [scoreConfig, setScoreConfig] = useState({
    criticalDataAvailability: { enabled: true, points: 40, condition: 'Critical data sections present' },
    policyPeriod: { enabled: true, points: 20, condition: 'Policy end date ahead or within 15 days' },
    cumulativeBonus: { enabled: true, points: 20, condition: 'Floater cumulative bonus > 0' },
    noPED: { enabled: true, points: 20, condition: 'No PED declared' },
    claimFree: { enabled: false, points: 0, condition: 'No claims (not available in JSON)' },
    sumInsured: { enabled: true, points: 10, condition: 'Floater sum insured meets minimum threshold' },
    ageCriteria: { enabled: true, points: 15, condition: 'Age derived from DOB within eligible range' }
  });

  // Load saved configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('portabilityScoreConfig');
    const configVersion = localStorage.getItem('portabilityScoreConfigVersion');
    
    // Force update if version doesn't match or doesn't exist
    if (!configVersion || configVersion !== 'v2') {
      console.log('Configuration version mismatch, forcing update');
      const defaultConfig = {
        criticalDataAvailability: { enabled: true, points: 40, condition: 'Critical data sections present' },
        policyPeriod: { enabled: true, points: 20, condition: 'Policy end date ahead or within 15 days' },
        cumulativeBonus: { enabled: true, points: 20, condition: 'Floater cumulative bonus > 0' },
        noPED: { enabled: true, points: 20, condition: 'No PED declared' },
        claimFree: { enabled: false, points: 0, condition: 'No claims (not available in JSON)' },
        sumInsured: { enabled: true, points: 10, condition: 'Floater sum insured meets minimum threshold' },
        ageCriteria: { enabled: true, points: 15, condition: 'Age derived from DOB within eligible range' }
      };
      setScoreConfig(defaultConfig);
      localStorage.setItem('portabilityScoreConfig', JSON.stringify(defaultConfig));
      localStorage.setItem('portabilityScoreConfigVersion', 'v2');
    } else if (savedConfig) {
      setScoreConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleConfigChange = (criterion, field, value) => {
    setScoreConfig(prev => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Save to localStorage for persistence
    localStorage.setItem('portabilityScoreConfig', JSON.stringify(scoreConfig));
    localStorage.setItem('portabilityScoreConfigVersion', 'v2');
    alert('Score configuration saved successfully!');
  };

  const handleReset = () => {
    const defaultConfig = {
      criticalDataAvailability: { enabled: true, points: 40, condition: 'Critical data sections present' },
      policyPeriod: { enabled: true, points: 20, condition: 'Policy end date ahead or within 15 days' },
      cumulativeBonus: { enabled: true, points: 20, condition: 'Floater cumulative bonus > 0' },
      noPED: { enabled: true, points: 20, condition: 'No PED declared' },
      claimFree: { enabled: false, points: 0, condition: 'No claims (not available in JSON)' },
      sumInsured: { enabled: true, points: 10, condition: 'Floater sum insured meets minimum threshold' },
      ageCriteria: { enabled: true, points: 15, condition: 'Age derived from DOB within eligible range' }
    };
    setScoreConfig(defaultConfig);
    localStorage.setItem('portabilityScoreConfig', JSON.stringify(defaultConfig));
    localStorage.setItem('portabilityScoreConfigVersion', 'v2');
    alert('Score configuration reset to defaults!');
  };

  const totalPoints = Object.values(scoreConfig).reduce((sum, config) => 
    config.enabled ? sum + config.points : sum, 0
  );

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
              <h1 className="text-2xl font-bold text-gray-800">Score Configuration</h1>
              <p className="text-sm text-gray-600 mt-1">Configure portability scoring criteria</p>
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
          
          {/* Configuration Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Scoring Criteria</h2>
              <div className="text-sm text-gray-600">
                Total Points: <span className="font-bold text-blue-600">{totalPoints}</span>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(scoreConfig).map(([key, config]) => (
                <div key={key} className={`border border-gray-200 rounded-lg p-4 ${!config.enabled ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => handleConfigChange(key, 'enabled', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-medium text-gray-800">
                        {key === 'criticalDataAvailability' ? 'Critical Data Availability' :
                         key === 'policyPeriod' ? 'Policy Period' :
                         key === 'cumulativeBonus' ? 'Cumulative Bonus' :
                         key === 'noPED' ? 'PED Declaration Status' :
                         key === 'claimFree' ? 'Claims History Availability' :
                         key === 'sumInsured' ? 'Floater Sum Insured' :
                         key === 'ageCriteria' ? 'Age Criteria' :
                         key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={config.points}
                        onChange={(e) => handleConfigChange(key, 'points', parseInt(e.target.value) || 0)}
                        disabled={!config.enabled}
                        className="w-16 p-2 border border-gray-300 rounded text-center text-sm"
                      />
                      <span className="text-sm text-gray-600">points</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Condition:</span>
                    <input
                      type="text"
                      value={config.condition}
                      onChange={(e) => handleConfigChange(key, 'condition', e.target.value)}
                      disabled={!config.enabled}
                      className="flex-1 p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Reset to Default
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Save Configuration
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">JSON Field Mapping</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Critical Data Availability:</strong> Essential policy fields presence</li>
              <li>• <strong>Policy Period:</strong> policy_and_coverage_details.policy_start_date & policy_end_date</li>
              <li>• <strong>Cumulative Bonus:</strong> policy_and_coverage_details.floater_cumulative_bonus</li>
              <li>• <strong>PED Declaration:</strong> insured_details[].declared_ped</li>
              <li>• <strong>Claims History:</strong> policy_and_coverage_details.previous_claims (disabled - not available)</li>
              <li>• <strong>Floater Sum Insured:</strong> policy_and_coverage_details.floater_basic_sum_insured</li>
              <li>• <strong>Age Criteria:</strong> insured_details[].age or derived from DOB</li>
            </ul>
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

  const calculateScore = (data) => {
    const savedConfig = localStorage.getItem('scoreConfig');
    const config = savedConfig ? JSON.parse(savedConfig) : {
      criticalDataAvailability: { enabled: true, points: 40, weight: 1.0 },
      policyPeriod: { enabled: true, points: 20, weight: 1.0 },
      cumulativeBonus: { enabled: true, points: 20, weight: 1.0 },
      noPED: { enabled: true, points: 20, weight: 1.0 },
      claimFree: { enabled: true, points: 20, weight: 0.5 },
      sumInsured: { enabled: true, points: 10, weight: 0.3 },
      ageCriteria: { enabled: true, points: 15, weight: 0.8 },
      thresholds: {
        ageMin: 18,
        ageMax: 60,
        minSumInsured: 500000
      }
    };

    // Log thresholds when scoring runs
    console.log('Scoring thresholds:', {
      ageMin: config.thresholds.ageMin,
      ageMax: config.thresholds.ageMax,
      minSumInsured: config.thresholds.minSumInsured
    });

    const responseData = data.response?.data || {};
    const breakdown = {};
    let totalScore = 0;
    
    // Critical Data Availability - Rule-based evaluation with proportional scoring
    if (config.criticalDataAvailability.enabled) {
      const rule = scoringRules.criticalDataAvailability;
      const isEligible = rule.eligibilityLogic(responseData);
      
      // Debug: Log field availability
      const criticalFields = [
        { name: 'policy_number', value: responseData.policy_and_coverage_details?.policy_number },
        { name: 'policy_start_date', value: responseData.policy_and_coverage_details?.policy_start_date },
        { name: 'policy_end_date', value: responseData.policy_and_coverage_details?.policy_end_date },
        { name: 'proposer_details.name', value: responseData.proposer_details?.name },
        { name: 'insured_details[].name', value: responseData.insured_details?.[0]?.name }
      ];
      const criticalFieldsStatus = criticalFields.map(field => {
        const status = field.value !== undefined && field.value !== null ? 'available' : 'missing';
        return { field: field.name, status, value: field.value };
      });
      console.log('Critical Data Availability - Field Status:', criticalFieldsStatus);
      
      if (isEligible) {
        // Rule met: Full points awarded
        breakdown.criticalDataAvailability = { 
          points: config.criticalDataAvailability.points * config.criticalDataAvailability.weight, 
          met: true 
        };
        totalScore += breakdown.criticalDataAvailability.points;
        console.log('Critical Data Availability - Full points awarded:', breakdown.criticalDataAvailability.points);
      } else {
        // Calculate proportional score based on available critical fields
        const availableFields = criticalFields.filter(field => field.value !== undefined && field.value !== null);
        const proportion = availableFields.length / criticalFields.length;
        const proportionalPoints = (config.criticalDataAvailability.points * config.criticalDataAvailability.weight) * proportion;
        
        breakdown.criticalDataAvailability = { 
          points: proportionalPoints, 
          met: false // Still marked as not met since not all fields available
        };
        totalScore += breakdown.criticalDataAvailability.points;
        console.log('Critical Data Availability - Proportional points awarded:', proportionalPoints, 'from', availableFields.length, '/', criticalFields.length, 'fields');
      }
    } else {
      breakdown.criticalDataAvailability = { points: 0, met: false };
      console.log('Critical Data Availability - Criterion disabled, zero points');
    }
    
    // Policy Period - Rule-based evaluation
    if (config.policyPeriod.enabled) {
      const rule = scoringRules.policyPeriod;
      const isEligible = rule.eligibilityLogic(responseData);
      
      // Debug: Log field availability
      const startDate = responseData.policy_and_coverage_details?.policy_start_date;
      const endDate = responseData.policy_and_coverage_details?.policy_end_date;
      console.log('Policy Period - Field Status:', { 
        policy_start_date: { available: startDate !== undefined && startDate !== null, value: startDate },
        policy_end_date: { available: endDate !== undefined && endDate !== null, value: endDate }
      });
      
      if (isEligible) {
        // Rule met: Full points awarded
        breakdown.policyPeriod = { 
          points: config.policyPeriod.points * config.policyPeriod.weight, 
          met: true 
        };
        totalScore += breakdown.policyPeriod.points;
        console.log('Policy Period - Full points awarded:', breakdown.policyPeriod.points);
      } else {
        // Rule not met: Zero points
        breakdown.policyPeriod = { points: 0, met: false };
        console.log('Policy Period - Zero points: dates missing or invalid');
      }
    } else {
      breakdown.policyPeriod = { points: 0, met: false };
      console.log('Policy Period - Criterion disabled, zero points');
    }
    
    // Cumulative Bonus - Rule-based evaluation
    if (config.cumulativeBonus.enabled) {
      const rule = scoringRules.cumulativeBonus;
      const isEligible = rule.eligibilityLogic(responseData);
      
      // Debug: Log field availability
      const floaterBonus = responseData.policy_and_coverage_details?.floater_cumulative_bonus;
      const basicBonus = responseData.policy_and_coverage_details?.cumulative_bonus;
      console.log('Cumulative Bonus - Field Status:', { 
        floater_cumulative_bonus: { available: floaterBonus !== undefined && floaterBonus !== null, value: floaterBonus },
        cumulative_bonus: { available: basicBonus !== undefined && basicBonus !== null, value: basicBonus }
      });
      
      if (isEligible) {
        // Rule met: Full points awarded
        breakdown.cumulativeBonus = { 
          points: config.cumulativeBonus.points * config.cumulativeBonus.weight, 
          met: true 
        };
        totalScore += breakdown.cumulativeBonus.points;
        console.log('Cumulative Bonus - Full points awarded:', breakdown.cumulativeBonus.points);
      } else {
        // Rule not met: Zero points
        breakdown.cumulativeBonus = { points: 0, met: false };
        console.log('Cumulative Bonus - Zero points: no bonus data available');
      }
    } else {
      breakdown.cumulativeBonus = { points: 0, met: false };
      console.log('Cumulative Bonus - Criterion disabled, zero points');
    }
    
    // PED Declaration Status - Rule-based evaluation
    if (config.noPED.enabled) {
      const rule = scoringRules.noPED;
      const isEligible = rule.eligibilityLogic(responseData);
      
      // Debug: Log field availability
      const ped = responseData.insured_details?.[0]?.declared_ped;
      console.log('PED Declaration - Field Status:', { 
        'insured_details[0].declared_ped': { available: ped !== undefined && ped !== null, value: ped }
      });
      
      if (isEligible) {
        // Rule met: Full points awarded
        breakdown.noPED = { 
          points: config.noPED.points * config.noPED.weight, 
          met: true 
        };
        totalScore += breakdown.noPED.points;
        console.log('PED Declaration - Full points awarded:', breakdown.noPED.points);
      } else {
        // Rule not met: Zero points
        breakdown.noPED = { points: 0, met: false };
        console.log('PED Declaration - Zero points: PED declared or missing');
      }
    } else {
      breakdown.noPED = { points: 0, met: false };
      console.log('PED Declaration - Criterion disabled, zero points');
    }

    // Claims History Availability - Rule-based evaluation
    if (config.claimFree.enabled) {
      const rule = scoringRules.claimFree;
      const isEligible = rule.eligibilityLogic(responseData);
      
      // Debug: Log field availability
      const claims = responseData.policy_and_coverage_details?.previous_claims;
      console.log('Claims History - Field Status:', { 
        previous_claims: { available: claims !== undefined && claims !== null, value: claims }
      });
      
      if (isEligible) {
        // Rule met: Full points awarded
        breakdown.claimFree = { 
          points: config.claimFree.points * config.claimFree.weight, 
          met: true 
        };
        totalScore += breakdown.claimFree.points;
        console.log('Claims History - Full points awarded:', breakdown.claimFree.points);
      } else {
        // Rule not met: Zero points
        breakdown.claimFree = { points: 0, met: false };
        console.log('Claims History - Zero points: claims present or missing');
      }
    } else {
      breakdown.claimFree = { points: 0, met: false };
      console.log('Claims History - Criterion disabled, zero points');
    }

    // Sum Insured - Rule-based evaluation with unified sum insured
    if (config.sumInsured.enabled) {
      const rule = scoringRules.sumInsured;
      const isEligible = rule.eligibilityLogic(responseData, config.thresholds);
      
      // Debug: Log field availability
      const individualSum = responseData.insured_details?.[0]?.individual_policy_sum_insured;
      const floaterSum = responseData.policy_and_coverage_details?.floater_basic_sum_insured;
      const basicSum = responseData.policy_and_coverage_details?.sum_insured;
      const evaluatedSum = getEvaluatedSumInsured(responseData);
      const minSum = config.thresholds?.minSumInsured || 500000;
      console.log('Sum Insured - Field Status:', { 
        'insured_details[0].individual_policy_sum_insured': { available: individualSum !== undefined && individualSum !== null, value: individualSum },
        'floater_basic_sum_insured': { available: floaterSum !== undefined && floaterSum !== null, value: floaterSum },
        'sum_insured': { available: basicSum !== undefined && basicSum !== null, value: basicSum },
        'evaluated_sum': { value: evaluatedSum },
        'threshold': { min: minSum }
      });
      
      if (isEligible) {
        // Rule met: Full points awarded
        breakdown.sumInsured = { 
          points: config.sumInsured.points * config.sumInsured.weight, 
          met: true 
        };
        totalScore += breakdown.sumInsured.points;
        console.log('Sum Insured - Full points awarded:', breakdown.sumInsured.points);
      } else {
        // Rule not met: Zero points
        breakdown.sumInsured = { points: 0, met: false };
        console.log('Sum Insured - Zero points: below threshold or missing');
      }
    } else {
      breakdown.sumInsured = { points: 0, met: false };
      console.log('Sum Insured - Criterion disabled, zero points');
    }

    // Age Criteria - Rule-based evaluation
    if (config.ageCriteria.enabled) {
      const rule = scoringRules.ageCriteria;
      const isEligible = rule.eligibilityLogic(responseData, config.thresholds);
      
      // Debug: Log field availability
      const age = responseData.insured_details?.[0]?.age;
      const dob = responseData.proposer_details?.dob;
      const calculatedAge = dob ? Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null;
      const minAge = config.thresholds?.ageMin || 18;
      const maxAge = config.thresholds?.ageMax || 60;
      console.log('Age Criteria - Field Status:', { 
        'insured_details[0].age': { available: age !== undefined && age !== null, value: age },
        'proposer_details.dob': { available: dob !== undefined && dob !== null, value: dob },
        'calculated_age': { value: calculatedAge },
        'thresholds': { min: minAge, max: maxAge }
      });
      
      if (isEligible) {
        // Rule met: Full points awarded
        breakdown.ageCriteria = { 
          points: config.ageCriteria.points * config.ageCriteria.weight, 
          met: true 
        };
        totalScore += breakdown.ageCriteria.points;
        console.log('Age Criteria - Full points awarded:', breakdown.ageCriteria.points);
      } else {
        // Rule not met: Zero points
        breakdown.ageCriteria = { points: 0, met: false };
        console.log('Age Criteria - Zero points: outside eligible range or missing');
      }
    } else {
      breakdown.ageCriteria = { points: 0, met: false };
      console.log('Age Criteria - Criterion disabled, zero points');
    }
    
    return { score: Math.min(Math.round(totalScore), 100), breakdown };
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Score configuration coming next</h1>
          <button
            onClick={() => setPage('demo')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back
          </button>
        </div>
      </div>
    );
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
                                      {insured?.individual_sum_insured || 'Not Available'}
                                    </td>
                                    <td className="py-1 px-1">
                                      {insured?.individual_cumulative_bonus || 'Not Available'}
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
                          
                          const missing = [];
                          const unavailable = [];
                          
                          Object.entries(scoreData.breakdown).forEach(([key, value]) => {
                            const name = key === 'criticalDataAvailability' ? 'Critical Data Availability' :
                                        key === 'policyPeriod' ? 'Policy Period' :
                                        key === 'cumulativeBonus' ? 'Cumulative Bonus' :
                                        key === 'noPED' ? 'PED Declaration Status' :
                                        key === 'claimFree' ? 'Claims History Availability' :
                                        key === 'sumInsured' ? 'Sum Insured' :
                                        key === 'ageCriteria' ? 'Age Criteria' :
                                        key.replace(/([A-Z])/g, ' $1').trim();
                            
                            if (value.points === 0) {
                              if (['cumulativeBonus', 'noPED', 'claimFree'].includes(key)) {
                                unavailable.push(name);
                              } else {
                                missing.push(name);
                              }
                            }
                          });
                          
                          let explanation = '';
                          if (missing.length === 0 && unavailable.length === 0) {
                            explanation = 'All criteria met - excellent policy data completeness.';
                          } else {
                            const parts = [];
                            if (missing.length > 0) {
                              if (missing.length === 1) {
                                parts.push(`missing ${missing[0]}`);
                              } else if (missing.length === 2) {
                                parts.push(`missing ${missing[0]} and ${missing[1]}`);
                              } else {
                                parts.push(`missing ${missing.slice(0, -1).join(', ')} and ${missing[missing.length - 1]}`);
                              }
                            }
                            if (unavailable.length > 0) {
                              if (unavailable.length === 1) {
                                parts.push(`unavailable ${unavailable[0]}`);
                              } else if (unavailable.length === 2) {
                                parts.push(`unavailable ${unavailable[0]} and ${unavailable[1]}`);
                              } else {
                                parts.push(`unavailable ${unavailable.slice(0, -1).join(', ')} and ${unavailable[unavailable.length - 1]}`);
                              }
                            }
                            
                            if (parts.length === 1) {
                              explanation = `Score reduced due to ${parts[0]}.`;
                            } else {
                              explanation = `Score reduced due to ${parts[0]} and ${parts[1]}.`;
                            }
                          }
                          
                          return explanation;
                        })()}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 space-y-1">
                        {scoreData?.breakdown && Object.entries(scoreData.breakdown).map(([key, value]) => (
                          <div key={key}>
                            {key === 'criticalDataAvailability' ? 'Critical Data Availability' :
                             key === 'policyPeriod' ? 'Policy Period' :
                             key === 'cumulativeBonus' ? 'Cumulative Bonus' :
                             key === 'noPED' ? 'PED Declaration Status' :
                             key === 'claimFree' ? 'Claims History Availability' :
                             key === 'sumInsured' ? 'Sum Insured' :
                             key === 'ageCriteria' ? 'Age Criteria' :
                             key.replace(/([A-Z])/g, ' $1').trim()}: {value.points || 0} / {value.points || 0}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <details className="border border-gray-200 rounded-lg">
                        <summary className="cursor-pointer px-3 py-2 font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                          <span>How this score was calculated</span>
                          <span className="text-gray-400 text-xs">▼</span>
                        </summary>
                        <div className="px-3 py-2 border-t border-gray-200">
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Critical Data Availability: Checked if essential policy fields are present for automated evaluation</div>
                            <div>Policy Period: Verified that policy start and end dates are available and logically valid</div>
                            <div>Cumulative Bonus: Confirmed if cumulative bonus information is available in the policy</div>
                            <div>PED Declaration Status: Evaluated if pre-existing disease information is declared or not applicable</div>
                            <div>Claims History Availability: Checked if claims history information is available and indicates claim-free status</div>
                            <div>Sum Insured: Evaluated whether the declared sum insured meets minimum threshold requirements</div>
                            <div>Age Criteria: Validated that the insured's age falls within eligible portability ranges</div>
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
                        <h4 className="font-medium text-gray-800 mb-3">Critical for Portability</h4>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Policy Number</span>
                            <span className={`font-medium ${
                              responseData?.response?.data?.policy_and_coverage_details?.policy_number ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {responseData?.response?.data?.policy_and_coverage_details?.policy_number ? 'Available' : 'Missing'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Policy Start Date</span>
                            <span className={`font-medium ${
                              responseData?.response?.data?.policy_and_coverage_details?.policy_start_date ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {responseData?.response?.data?.policy_and_coverage_details?.policy_start_date ? 'Available' : 'Missing'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Policy End Date</span>
                            <span className={`font-medium ${
                              responseData?.response?.data?.policy_and_coverage_details?.policy_end_date ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {responseData?.response?.data?.policy_and_coverage_details?.policy_end_date ? 'Available' : 'Missing'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Insured Age</span>
                            <span className={`font-medium ${
                              responseData?.response?.data?.insured_details?.[0]?.age ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {responseData?.response?.data?.insured_details?.[0]?.age ? 'Available' : 'Missing'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Sum Insured</span>
                            <span className={`font-medium ${
                              (() => {
                                const policyType = responseData?.response?.data?.policy_and_coverage_details?.policy_type;
                                const floaterSum = responseData?.response?.data?.policy_and_coverage_details?.floater_basic_sum_insured;
                                const individualSums = responseData?.response?.data?.insured_details?.map(member => member.individual_policy_sum_insured) || [];
                                const hasIndividualSum = individualSums.some(sum => sum !== null && sum !== undefined && sum !== '');
                                
                                if (policyType === 'FLOATER') {
                                  return floaterSum ? 'text-green-600' : 'text-red-600';
                                } else if (policyType === 'INDIVIDUAL') {
                                  return hasIndividualSum ? 'text-green-600' : 'text-red-600';
                                } else {
                                  // Fallback: check both
                                  return (floaterSum || hasIndividualSum) ? 'text-green-600' : 'text-red-600';
                                }
                              })()
                            }`}>
                              {(() => {
                                const policyType = responseData?.response?.data?.policy_and_coverage_details?.policy_type;
                                const floaterSum = responseData?.response?.data?.policy_and_coverage_details?.floater_basic_sum_insured;
                                const individualSums = responseData?.response?.data?.insured_details?.map(member => member.individual_policy_sum_insured) || [];
                                const hasIndividualSum = individualSums.some(sum => sum !== null && sum !== undefined && sum !== '');
                                
                                if (policyType === 'FLOATER') {
                                  return floaterSum ? 'Available' : 'Missing';
                                } else if (policyType === 'INDIVIDUAL') {
                                  return hasIndividualSum ? 'Available' : 'Missing';
                                } else {
                                  // Fallback: check both
                                  return (floaterSum || hasIndividualSum) ? 'Available' : 'Missing';
                                }
                              })()}
                            </span>
                          </div>
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
