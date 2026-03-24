const dataBlue = { color: '#1e40af' };
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* PIVOT Logo - Left */}
            <div className="flex items-center space-x-6 w-56">
              <div className="flex items-center space-x-2">
                <img
                  src="/logos/pivot-logo.png"
                  alt="PIVOT Logo"
                  className="w-40 h-20 rounded-lg object-contain"
                  style={{maxHeight: '56px', maxWidth: '160px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-40 h-20 bg-purple-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
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
            <div className="flex items-center justify-end space-x-6 w-56">
              <div className="flex items-center space-x-2">
                <img
                  src="/logos/attributum-logo.png"
                  alt="Attributum Logo"
                  className="w-50 h-20 rounded-lg object-contain"
                  style={{maxHeight: '56px', maxWidth: '180px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-50 h-20 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
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

// ============================================================
// TeleMER Configurable Score Settings (mirrors Portability pattern)
// ============================================================
const TELEMER_SCORE_SETTINGS = {
  bmi: {
    enabled: true,
    maxPoints: 25,
    morbidThreshold: 40,
    severeThreshold: 35,
    obeseThreshold: 30,
    overweightThreshold: 25,
    underweightThreshold: 18.5
  },
  medicalDeclarations: {
    enabled: true,
    maxPoints: 30,
    pointsPerCondition: 8,
    surgicalBonus: 4
  },
  age: {
    enabled: true,
    maxPoints: 20,
    tier1Age: 30,
    tier1Points: 5,
    tier2Age: 40,
    tier2Points: 10,
    tier3Age: 50,
    tier3Points: 15,
    tier4Age: 60,
    tier4Points: 20
  },
  medicalCategory: {
    enabled: true,
    maxPoints: 15,
    adversePoints: 15
  },
  nonMedicalFlags: {
    enabled: true,
    maxPoints: 10,
    portabilityPoints: 6,
    otherFlagPoints: 2
  }
};

const loadTeleMERSettings = () => {
  try {
    const saved = localStorage.getItem('telemerScoreSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        bmi: { ...TELEMER_SCORE_SETTINGS.bmi, ...parsed.bmi },
        medicalDeclarations: { ...TELEMER_SCORE_SETTINGS.medicalDeclarations, ...parsed.medicalDeclarations },
        age: { ...TELEMER_SCORE_SETTINGS.age, ...parsed.age },
        medicalCategory: { ...TELEMER_SCORE_SETTINGS.medicalCategory, ...parsed.medicalCategory },
        nonMedicalFlags: { ...TELEMER_SCORE_SETTINGS.nonMedicalFlags, ...parsed.nonMedicalFlags }
      };
    }
  } catch (e) {}
  return TELEMER_SCORE_SETTINGS;
};

// ============================================================
// TeleMER Score Settings Page Component
// ============================================================
const TeleMERConfigPage = ({ setPage }) => {
  const [settings, setSettings] = useState(TELEMER_SCORE_SETTINGS);

  useEffect(() => {
    setSettings(loadTeleMERSettings());
  }, []);

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: field === 'enabled' ? value : (parseInt(value) || 0)
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('telemerScoreSettings', JSON.stringify(settings));
    alert('TeleMER score settings saved successfully!');
  };

  const handleReset = () => {
    setSettings(TELEMER_SCORE_SETTINGS);
    localStorage.setItem('telemerScoreSettings', JSON.stringify(TELEMER_SCORE_SETTINGS));
    alert('TeleMER score settings reset to defaults!');
  };

  const totalMax = (settings.bmi.enabled ? settings.bmi.maxPoints : 0)
    + (settings.medicalDeclarations.enabled ? settings.medicalDeclarations.maxPoints : 0)
    + (settings.age.enabled ? settings.age.maxPoints : 0)
    + (settings.medicalCategory.enabled ? settings.medicalCategory.maxPoints : 0)
    + (settings.nonMedicalFlags.enabled ? settings.nonMedicalFlags.maxPoints : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 w-56">
              <div className="flex items-center space-x-2">
                <img src="/logos/attributum-logo.png" alt="Attributum Logo" className="w-50 h-20 rounded-lg object-contain"
                  style={{maxHeight: '56px', maxWidth: '180px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                <div className="w-50 h-20 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-white font-bold text-xl">A</span>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">PIVOT TeleMER Score Settings</h1>
              <p className="text-sm text-gray-600">Configure underwriting risk scoring weights and thresholds</p>
            </div>
            <div className="flex items-center justify-end space-x-6 w-56">
              <div className="flex items-center space-x-2">
                <img src="/logos/pivot-logo.png" alt="PIVOT Logo" className="w-40 h-20 rounded-lg object-contain"
                  style={{maxHeight: '56px', maxWidth: '160px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                <div className="w-40 h-20 bg-purple-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-white font-bold text-xl">P</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <button onClick={() => setPage('underwriting')}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
              <i className="fas fa-arrow-left mr-1"></i> Back to TeleMER
            </button>
            <div className="text-sm text-gray-500">
              Total possible score: <span className="font-bold text-gray-800">{totalMax}</span> / 100
            </div>
          </div>

          {/* Section 1: BMI Factor */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800"><i className="fas fa-weight mr-2 text-blue-600"></i>BMI Factor</h2>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={settings.bmi.enabled} onChange={(e) => handleChange('bmi', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            </div>
            {settings.bmi.enabled && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Max Points</label>
                    <span className="text-sm text-gray-500">{settings.bmi.maxPoints}</span>
                  </div>
                  <input type="number" min="0" max="100" value={settings.bmi.maxPoints}
                    onChange={(e) => handleChange('bmi', 'maxPoints', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Maximum points for BMI risk factor (default 25)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Morbid Obesity Threshold</label>
                    <input type="number" min="0" step="0.1" value={settings.bmi.morbidThreshold}
                      onChange={(e) => handleChange('bmi', 'morbidThreshold', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mt-1" />
                    <p className="text-xs text-gray-500 mt-1">BMI &ge; this = full points (default 40)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Severe Obesity Threshold</label>
                    <input type="number" min="0" step="0.1" value={settings.bmi.severeThreshold}
                      onChange={(e) => handleChange('bmi', 'severeThreshold', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mt-1" />
                    <p className="text-xs text-gray-500 mt-1">BMI &ge; this = 88% points (default 35)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Obese Threshold</label>
                    <input type="number" min="0" step="0.1" value={settings.bmi.obeseThreshold}
                      onChange={(e) => handleChange('bmi', 'obeseThreshold', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mt-1" />
                    <p className="text-xs text-gray-500 mt-1">BMI &ge; this = 72% points (default 30)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Overweight Threshold</label>
                    <input type="number" min="0" step="0.1" value={settings.bmi.overweightThreshold}
                      onChange={(e) => handleChange('bmi', 'overweightThreshold', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mt-1" />
                    <p className="text-xs text-gray-500 mt-1">BMI &ge; this = 48% points (default 25)</p>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="text-xs text-gray-600 font-medium mb-1">Scoring Logic:</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>BMI &ge; {settings.bmi.morbidThreshold} (Morbidly Obese) = {settings.bmi.maxPoints} pts</li>
                      <li>BMI &ge; {settings.bmi.severeThreshold} (Severely Obese) = {Math.round(settings.bmi.maxPoints * 0.88)} pts</li>
                      <li>BMI &ge; {settings.bmi.obeseThreshold} (Obese) = {Math.round(settings.bmi.maxPoints * 0.72)} pts</li>
                      <li>BMI &ge; {settings.bmi.overweightThreshold} (Overweight) = {Math.round(settings.bmi.maxPoints * 0.48)} pts</li>
                      <li>BMI &lt; {settings.bmi.underweightThreshold} (Underweight) = {Math.round(settings.bmi.maxPoints * 0.40)} pts</li>
                      <li>BMI {settings.bmi.underweightThreshold} - {settings.bmi.overweightThreshold} (Normal) = 0 pts</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Medical Declarations */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800"><i className="fas fa-notes-medical mr-2 text-red-600"></i>Medical Declarations</h2>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={settings.medicalDeclarations.enabled} onChange={(e) => handleChange('medicalDeclarations', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            </div>
            {settings.medicalDeclarations.enabled && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Max Points</label>
                    <span className="text-sm text-gray-500">{settings.medicalDeclarations.maxPoints}</span>
                  </div>
                  <input type="number" min="0" max="100" value={settings.medicalDeclarations.maxPoints}
                    onChange={(e) => handleChange('medicalDeclarations', 'maxPoints', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Maximum points for medical declarations (default 30)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Points per Condition</label>
                    <input type="number" min="0" max="30" value={settings.medicalDeclarations.pointsPerCondition}
                      onChange={(e) => handleChange('medicalDeclarations', 'pointsPerCondition', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Points added per "Yes" medical declaration (default 8)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Surgical Treatment Bonus</label>
                    <input type="number" min="0" max="20" value={settings.medicalDeclarations.surgicalBonus}
                      onChange={(e) => handleChange('medicalDeclarations', 'surgicalBonus', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Extra points per condition treated surgically (default 4)</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-xs text-gray-600 font-medium mb-1">Scoring Logic:</p>
                  <p className="text-xs text-gray-500">Score = min({settings.medicalDeclarations.maxPoints}, conditions x {settings.medicalDeclarations.pointsPerCondition} + surgical_count x {settings.medicalDeclarations.surgicalBonus})</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Age Factor */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800"><i className="fas fa-user-clock mr-2 text-purple-600"></i>Age Factor</h2>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={settings.age.enabled} onChange={(e) => handleChange('age', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            </div>
            {settings.age.enabled && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Max Points</label>
                    <span className="text-sm text-gray-500">{settings.age.maxPoints}</span>
                  </div>
                  <input type="number" min="0" max="100" value={settings.age.maxPoints}
                    onChange={(e) => handleChange('age', 'maxPoints', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Maximum points for age risk factor (default 20)</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-xs text-gray-600 font-medium mb-2">Age Tiers:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Age &gt; {settings.age.tier4Age}</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input type="number" min="0" max="100" value={settings.age.tier4Age}
                          onChange={(e) => handleChange('age', 'tier4Age', e.target.value)}
                          className="w-20 p-1 border border-gray-300 rounded text-xs" />
                        <span className="text-xs text-gray-400">yrs =</span>
                        <input type="number" min="0" max="100" value={settings.age.tier4Points}
                          onChange={(e) => handleChange('age', 'tier4Points', e.target.value)}
                          className="w-16 p-1 border border-gray-300 rounded text-xs" />
                        <span className="text-xs text-gray-400">pts</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Age &gt; {settings.age.tier3Age}</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input type="number" min="0" max="100" value={settings.age.tier3Age}
                          onChange={(e) => handleChange('age', 'tier3Age', e.target.value)}
                          className="w-20 p-1 border border-gray-300 rounded text-xs" />
                        <span className="text-xs text-gray-400">yrs =</span>
                        <input type="number" min="0" max="100" value={settings.age.tier3Points}
                          onChange={(e) => handleChange('age', 'tier3Points', e.target.value)}
                          className="w-16 p-1 border border-gray-300 rounded text-xs" />
                        <span className="text-xs text-gray-400">pts</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Age &gt; {settings.age.tier2Age}</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input type="number" min="0" max="100" value={settings.age.tier2Age}
                          onChange={(e) => handleChange('age', 'tier2Age', e.target.value)}
                          className="w-20 p-1 border border-gray-300 rounded text-xs" />
                        <span className="text-xs text-gray-400">yrs =</span>
                        <input type="number" min="0" max="100" value={settings.age.tier2Points}
                          onChange={(e) => handleChange('age', 'tier2Points', e.target.value)}
                          className="w-16 p-1 border border-gray-300 rounded text-xs" />
                        <span className="text-xs text-gray-400">pts</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Age &gt; {settings.age.tier1Age}</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input type="number" min="0" max="100" value={settings.age.tier1Age}
                          onChange={(e) => handleChange('age', 'tier1Age', e.target.value)}
                          className="w-20 p-1 border border-gray-300 rounded text-xs" />
                        <span className="text-xs text-gray-400">yrs =</span>
                        <input type="number" min="0" max="100" value={settings.age.tier1Points}
                          onChange={(e) => handleChange('age', 'tier1Points', e.target.value)}
                          className="w-16 p-1 border border-gray-300 rounded text-xs" />
                        <span className="text-xs text-gray-400">pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: PIVOT Medical Category */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800"><i className="fas fa-file-medical mr-2 text-amber-600"></i>PIVOT Medical Category</h2>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={settings.medicalCategory.enabled} onChange={(e) => handleChange('medicalCategory', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            </div>
            {settings.medicalCategory.enabled && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Max Points</label>
                    <span className="text-sm text-gray-500">{settings.medicalCategory.maxPoints}</span>
                  </div>
                  <input type="number" min="0" max="100" value={settings.medicalCategory.maxPoints}
                    onChange={(e) => handleChange('medicalCategory', 'maxPoints', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Maximum points for PIVOT medical category (default 15)</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Adverse Category Points</label>
                    <span className="text-sm text-gray-500">{settings.medicalCategory.adversePoints}</span>
                  </div>
                  <input type="number" min="0" max="100" value={settings.medicalCategory.adversePoints}
                    onChange={(e) => handleChange('medicalCategory', 'adversePoints', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Points awarded when PIVOT Medical Declarations Category = "Adverse" (default 15)</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-xs text-gray-500">Based on PIVOT's AI classification of overall medical declaration severity</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Non-Medical / Portability Flags */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800"><i className="fas fa-flag mr-2 text-green-600"></i>Non-Medical / Portability Flags</h2>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={settings.nonMedicalFlags.enabled} onChange={(e) => handleChange('nonMedicalFlags', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            </div>
            {settings.nonMedicalFlags.enabled && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Max Points</label>
                    <span className="text-sm text-gray-500">{settings.nonMedicalFlags.maxPoints}</span>
                  </div>
                  <input type="number" min="0" max="100" value={settings.nonMedicalFlags.maxPoints}
                    onChange={(e) => handleChange('nonMedicalFlags', 'maxPoints', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Maximum points for non-medical flags (default 10)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Portability Case Points</label>
                    <input type="number" min="0" max="20" value={settings.nonMedicalFlags.portabilityPoints}
                      onChange={(e) => handleChange('nonMedicalFlags', 'portabilityPoints', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Points if porting from another insurer (default 6)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Other Flag Points (each)</label>
                    <input type="number" min="0" max="10" value={settings.nonMedicalFlags.otherFlagPoints}
                      onChange={(e) => handleChange('nonMedicalFlags', 'otherFlagPoints', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Points per additional non-medical flag (default 2)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-end space-x-4">
              <button onClick={handleReset}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                Reset to Default
              </button>
              <button onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
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

// ============================================================
// TeleMER Risk Scoring Engine (uses configurable settings)
// Computes a composite risk score (0-100) from TeleMER API data
// ============================================================
const computeTeleMERScore = (responseData) => {
  const data = responseData?.response?.data;
  if (!data) return { total: 0, breakdown: [], level: 'Unknown', color: '#9ca3af', bmi: 0, age: 0 };

  const cfg = loadTeleMERSettings();
  const breakdown = [];
  let total = 0;

  // --- 1. BMI Factor ---
  const bmi = parseFloat(data?.MetaData?.BMI || data?.MetaData?.bmi || 0);
  const bmiCategory = data?.Summary?.PIVOT_BMI_Category || '';
  let bmiPoints = 0;
  let bmiLabel = '';
  if (cfg.bmi.enabled) {
    const max = cfg.bmi.maxPoints;
    if (bmi >= cfg.bmi.morbidThreshold)        { bmiPoints = max; bmiLabel = 'Morbidly Obese'; }
    else if (bmi >= cfg.bmi.severeThreshold)    { bmiPoints = Math.round(max * 0.88); bmiLabel = 'Severely Obese'; }
    else if (bmi >= cfg.bmi.obeseThreshold)     { bmiPoints = Math.round(max * 0.72); bmiLabel = 'Obese'; }
    else if (bmi >= cfg.bmi.overweightThreshold){ bmiPoints = Math.round(max * 0.48); bmiLabel = 'Overweight'; }
    else if (bmi > 0 && bmi < cfg.bmi.underweightThreshold) { bmiPoints = Math.round(max * 0.40); bmiLabel = 'Underweight'; }
    else if (bmi >= cfg.bmi.underweightThreshold) { bmiPoints = 0; bmiLabel = 'Normal'; }
    else if (bmiCategory.toLowerCase() === 'adverse') { bmiPoints = Math.round(max * 0.80); bmiLabel = 'Adverse'; }
    breakdown.push({ factor: 'BMI', points: bmiPoints, max: cfg.bmi.maxPoints, detail: bmi > 0 ? `${bmi} (${bmiLabel})` : (bmiCategory || 'N/A'), icon: 'fa-weight' });
    total += bmiPoints;
  }

  // --- 2. Medical Declarations ---
  const medDecls = data?.YesMedicalDeclarationData || [];
  if (cfg.medicalDeclarations.enabled) {
    const surgicalCount = medDecls.filter(d => (d.Details || '').toLowerCase().includes('surgical')).length;
    const medPoints = Math.min(cfg.medicalDeclarations.maxPoints, medDecls.length * cfg.medicalDeclarations.pointsPerCondition + surgicalCount * cfg.medicalDeclarations.surgicalBonus);
    breakdown.push({ factor: 'Medical Declarations', points: medPoints, max: cfg.medicalDeclarations.maxPoints, detail: `${medDecls.length} condition${medDecls.length !== 1 ? 's' : ''} (${surgicalCount} surgical)`, icon: 'fa-notes-medical' });
    total += medPoints;
  }

  // --- 3. Age Factor ---
  const dobStr = data?.MetaData?.['Date of Birth of member'] || data?.MetaData?.['DOB of Proposer'] || '';
  let age = 0;
  if (dobStr) {
    const parts = dobStr.split(/[-\/]/);
    if (parts.length === 3) {
      let dobDate = null;
      if (parts[2] && parts[2].length === 4) dobDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      else if (parts[0] && parts[0].length === 4) dobDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (dobDate && !isNaN(dobDate.getTime())) {
        age = Math.floor((new Date() - dobDate) / (365.25 * 24 * 60 * 60 * 1000));
      }
    }
  }
  if (cfg.age.enabled) {
    let agePoints = 0;
    if (age > cfg.age.tier4Age) agePoints = cfg.age.tier4Points;
    else if (age > cfg.age.tier3Age) agePoints = cfg.age.tier3Points;
    else if (age > cfg.age.tier2Age) agePoints = cfg.age.tier2Points;
    else if (age > cfg.age.tier1Age) agePoints = cfg.age.tier1Points;
    agePoints = Math.min(agePoints, cfg.age.maxPoints);
    breakdown.push({ factor: 'Age', points: agePoints, max: cfg.age.maxPoints, detail: age > 0 ? `${age} years` : 'Unknown', icon: 'fa-user-clock' });
    total += agePoints;
  }

  // --- 4. Medical Category from PIVOT ---
  const medCategory = data?.Summary?.PIVOT_Medical_Declarations_Category || '';
  if (cfg.medicalCategory.enabled) {
    const catPoints = medCategory.toLowerCase() === 'adverse' ? cfg.medicalCategory.adversePoints : 0;
    breakdown.push({ factor: 'PIVOT Medical Category', points: catPoints, max: cfg.medicalCategory.maxPoints, detail: medCategory || 'N/A', icon: 'fa-file-medical' });
    total += catPoints;
  }

  // --- 5. Non-Medical / Portability Flags ---
  const nonMedDecls = data?.YesNonMedicalDeclarationData || [];
  if (cfg.nonMedicalFlags.enabled) {
    const isPortability = nonMedDecls.some(d => (d.Questions || '').toLowerCase().includes('portability'));
    let nonMedPoints = isPortability ? cfg.nonMedicalFlags.portabilityPoints : 0;
    nonMedPoints += Math.min(cfg.nonMedicalFlags.maxPoints - (isPortability ? cfg.nonMedicalFlags.portabilityPoints : 0), (nonMedDecls.length - (isPortability ? 1 : 0)) * cfg.nonMedicalFlags.otherFlagPoints);
    nonMedPoints = Math.max(0, Math.min(cfg.nonMedicalFlags.maxPoints, nonMedPoints));
    breakdown.push({ factor: 'Non-Medical Flags', points: nonMedPoints, max: cfg.nonMedicalFlags.maxPoints, detail: isPortability ? `Portability case + ${nonMedDecls.length - 1} other` : `${nonMedDecls.length} flag${nonMedDecls.length !== 1 ? 's' : ''}`, icon: 'fa-flag' });
    total += nonMedPoints;
  }

  total = Math.min(100, total);

  let level, color;
  if (total <= 25)      { level = 'Low Risk'; color = '#16a34a'; }
  else if (total <= 50) { level = 'Moderate Risk'; color = '#ca8a04'; }
  else if (total <= 75) { level = 'High Risk'; color = '#ea580c'; }
  else                  { level = 'Very High Risk'; color = '#dc2626'; }

  return { total, breakdown, level, color, bmi, age };
};

// ============================================================
// AI Follow-up Questions Generator
// ============================================================
const generateFollowUpQuestions = (responseData) => {
  const data = responseData?.response?.data;
  if (!data) return [];

  const questions = [];
  const medDecls = data?.YesMedicalDeclarationData || [];
  const nonMedDecls = data?.YesNonMedicalDeclarationData || [];
  const bmi = parseFloat(data?.MetaData?.BMI || 0);

  const dobStr = data?.MetaData?.['Date of Birth of member'] || data?.MetaData?.['DOB of Proposer'] || '';
  let memberAge = 0;
  if (dobStr) {
    const parts = dobStr.split(/[-\/]/);
    if (parts.length === 3) {
      let d = null;
      if (parts[2] && parts[2].length === 4) d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      else if (parts[0] && parts[0].length === 4) d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (d && !isNaN(d.getTime())) memberAge = Math.floor((new Date() - d) / (365.25 * 24 * 60 * 60 * 1000));
    }
  }

  medDecls.forEach((decl) => {
    const q = (decl.Questions || '').toLowerCase();
    const det = (decl.Details || '').toLowerCase();
    const combined = q + ' ' + det;

    if (combined.includes('fracture') || combined.includes('bone') || combined.includes('joint') || combined.includes('arthritis') || combined.includes('knee') || combined.includes('ligament')) {
      questions.push({ category: 'Orthopedic', severity: 'high', icon: 'fa-bone', items: [
        'Is any implant/plate still in place? Any planned removal surgery?',
        'Current mobility status and range of motion?',
        'Any ongoing physiotherapy or rehabilitation?',
        'Any complications post-surgery (infection, non-union, chronic pain)?',
        'Impact on daily activities and occupation?'
      ], context: 'Orthopedic / fracture / joint disorder history detected' });
    }

    if (combined.includes('cataract') || combined.includes('eye') || combined.includes('vision') || combined.includes('retina')) {
      questions.push({ category: 'Ophthalmology', severity: 'medium', icon: 'fa-eye', items: [
        'Current corrected vision status in both eyes?',
        'Type of intraocular lens (IOL) implanted?',
        'Any post-operative complications (glaucoma, retinal detachment)?',
        'Date of last comprehensive eye examination?'
      ], context: 'Eye / cataract surgical history detected' });
    }

    if (combined.includes('hysterectomy') || combined.includes('uterus') || combined.includes('fibroid') || combined.includes('fibroadenoma')) {
      questions.push({ category: 'Gynecological', severity: 'medium', icon: 'fa-hospital', items: [
        'Type of hysterectomy (total / partial / radical)?',
        'Histopathology / biopsy report findings?',
        'Is the member on Hormone Replacement Therapy (HRT)?',
        'Any post-operative complications or ongoing treatment?'
      ], context: 'Gynecological surgical history detected' });
    }

    if (combined.includes('hernia')) {
      questions.push({ category: 'Surgical - Hernia', severity: 'medium', icon: 'fa-procedures', items: [
        'Type of hernia repair (open / laparoscopic / mesh)?',
        'Any recurrence of hernia post-surgery?',
        'Current symptoms - any discomfort or bulging at repair site?'
      ], context: 'Hernia repair history detected' });
    }

    if (combined.includes('heart') || combined.includes('cardiac') || combined.includes('chest pain') || combined.includes('angina')) {
      questions.push({ category: 'Cardiovascular', severity: 'critical', icon: 'fa-heartbeat', items: [
        'Latest ECG, Echo, and Stress Test reports?',
        'Current cardiac medications (blood thinners, beta-blockers, statins)?',
        'Any stent placement or bypass surgery history?',
        'Exercise tolerance and functional capacity (NYHA class)?',
        'Ejection fraction percentage?'
      ], context: 'Cardiovascular / cardiac history detected' });
    }

    if (combined.includes('diabetes') || combined.includes('sugar') || combined.includes('insulin') || combined.includes('hba1c')) {
      questions.push({ category: 'Diabetes / Metabolic', severity: 'high', icon: 'fa-tint', items: [
        'Latest HbA1c level and fasting blood sugar?',
        'Current medications - oral hypoglycemics or insulin?',
        'Any diabetic complications (retinopathy, nephropathy, neuropathy)?',
        'Duration since initial diagnosis and trend of control?'
      ], context: 'Diabetes / metabolic disorder history detected' });
    }

    if (combined.includes('blood pressure') || combined.includes('hypertension')) {
      questions.push({ category: 'Hypertension', severity: 'high', icon: 'fa-heartbeat', items: [
        'Current BP readings and target range?',
        'Anti-hypertensive medications and dosages?',
        'Any end-organ damage assessment (kidney, heart, retina)?',
        'Duration and stability of BP control?'
      ], context: 'Hypertension history detected' });
    }

    if (combined.includes('thyroid')) {
      questions.push({ category: 'Thyroid / Endocrine', severity: 'medium', icon: 'fa-pills', items: [
        'Latest TSH and thyroid function test results?',
        'Current medications and dosage?',
        'Any thyroid nodules or goiter on ultrasound?',
        'Hypothyroid or hyperthyroid - type and duration?'
      ], context: 'Thyroid disorder history detected' });
    }

    if (combined.includes('kidney') || combined.includes('renal') || combined.includes('creatinine')) {
      questions.push({ category: 'Renal', severity: 'high', icon: 'fa-flask', items: [
        'Latest serum creatinine and eGFR values?',
        'Any dialysis history or requirement?',
        'Ultrasound findings of kidneys?',
        'Underlying cause of renal condition?'
      ], context: 'Kidney / renal history detected' });
    }

    if (combined.includes('asthma') || combined.includes('respiratory') || combined.includes('lung') || combined.includes('copd') || combined.includes('breathless')) {
      questions.push({ category: 'Respiratory', severity: 'medium', icon: 'fa-lungs', items: [
        'Frequency and severity of episodes?',
        'Current medications (inhalers, nebulizers, oral)?',
        'Latest pulmonary function test (spirometry) results?',
        'Any hospitalization for acute episodes in last 2 years?'
      ], context: 'Respiratory / pulmonary history detected' });
    }

    if (combined.includes('cancer') || combined.includes('tumor') || combined.includes('malignant') || combined.includes('carcinoma') || combined.includes('lump')) {
      questions.push({ category: 'Oncology', severity: 'critical', icon: 'fa-ribbon', items: [
        'Exact type, stage (TNM), and grade of cancer?',
        'Treatment received (surgery, chemotherapy, radiation, immunotherapy)?',
        'Current remission status and duration since last treatment?',
        'Latest follow-up reports and tumor marker levels?',
        'Any family history of similar cancers?'
      ], context: 'Oncological / malignancy history detected' });
    }

    if (combined.includes('stroke') || combined.includes('paralysis') || combined.includes('cerebral') || combined.includes('brain')) {
      questions.push({ category: 'Neurological', severity: 'critical', icon: 'fa-brain', items: [
        'Type of stroke (ischemic / hemorrhagic) and date?',
        'Current neurological deficits and recovery status?',
        'Medications (anticoagulants, antiplatelets)?',
        'MRI / CT scan findings?',
        'Rehabilitation status and functional independence?'
      ], context: 'Neurological / cerebrovascular history detected' });
    }

    if (combined.includes('liver') || combined.includes('hepatitis') || combined.includes('jaundice') || combined.includes('cirrhosis')) {
      questions.push({ category: 'Hepatic', severity: 'high', icon: 'fa-flask', items: [
        'Latest liver function tests (LFT)?',
        'Hepatitis type and current viral load (if applicable)?',
        'Ultrasound / Fibroscan findings?',
        'Alcohol consumption history?',
        'Any complications (ascites, varices)?'
      ], context: 'Liver / hepatic history detected' });
    }

    if (combined.includes('psychiatric') || combined.includes('depression') || combined.includes('anxiety') || combined.includes('mental')) {
      questions.push({ category: 'Psychiatric', severity: 'medium', icon: 'fa-brain', items: [
        'Specific diagnosis and duration?',
        'Current psychiatric medications and dosages?',
        'Any hospitalizations for psychiatric episodes?',
        'Current functional status and ability to work?'
      ], context: 'Psychiatric / mental health history detected' });
    }
  });

  // BMI-driven questions
  if (bmi >= 35) {
    questions.push({ category: 'Obesity - Comorbidity Screening', severity: 'high', icon: 'fa-weight', items: [
      'Has the member been screened for Type 2 Diabetes (FBS, HbA1c)?',
      'Blood pressure readings - any hypertension diagnosis?',
      'Screening for Obstructive Sleep Apnea (Epworth scale, sleep study)?',
      'Lipid profile and liver function tests?',
      'Any weight management program or bariatric surgery consideration?'
    ], context: `BMI ${bmi} (severe/morbid obesity) - comorbidity screening critical` });
  } else if (bmi >= 30) {
    questions.push({ category: 'Obesity - Metabolic Screening', severity: 'medium', icon: 'fa-weight', items: [
      'Screening for metabolic syndrome?',
      'Blood pressure and lipid profile status?',
      'Any lifestyle modifications or weight management plans?'
    ], context: `BMI ${bmi} (obese) - metabolic screening recommended` });
  }

  // Age-driven questions
  if (memberAge > 55) {
    questions.push({ category: 'Age-Appropriate Screening', severity: 'medium', icon: 'fa-clipboard-list', items: [
      'Date of last comprehensive health checkup / master health check?',
      'Cardiac screening (ECG, Stress Test, 2D Echo) results?',
      'Age-appropriate cancer screening status?',
      'Bone density (DEXA scan) results - especially for females?',
      'Blood sugar, kidney function, and liver function panel?'
    ], context: `Member age ${memberAge} years - comprehensive screening recommended` });
  }

  // Portability-driven questions
  nonMedDecls.forEach(decl => {
    if ((decl.Questions || '').toLowerCase().includes('portability')) {
      questions.push({ category: 'Portability Assessment', severity: 'high', icon: 'fa-exchange-alt', items: [
        'Complete claims history with previous insurer (last 4 years)?',
        'Reason for porting - any claims denied or disputes?',
        'Waiting periods already served with previous insurer?',
        'Any conditions excluded or sub-limited by previous insurer?',
        'Certificate of insurance and no-claim confirmation obtained?'
      ], context: 'Portability case - previous insurer history is critical' });
    }
  });

  return questions;
};

// ============================================================
// TeleMER PDF Export - generates printable summary
// ============================================================
const exportTeleMERPDF = (responseData, score, followUpQuestions) => {
  const data = responseData?.response?.data;
  if (!data) return;
  const meta = data.MetaData || {};
  const summary = data.Summary || {};
  const medDecls = data.YesMedicalDeclarationData || [];

  const severityColor = (sev) => sev === 'critical' ? '#dc2626' : sev === 'high' ? '#ea580c' : '#ca8a04';

  let medDeclsHTML = '';
  medDecls.forEach((d, i) => {
    const details = (d.Details || '').replace(/\n/g, '<br/>');
    medDeclsHTML += '<div style="margin-bottom:16px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#fefce8">' +
      '<p style="font-weight:600;color:#92400e;margin:0 0 8px">Declaration ' + (i+1) + ': ' + (d.Answer || 'Yes') + '</p>' +
      '<p style="font-size:13px;color:#374151;margin:0 0 6px"><b>Question:</b> ' + (d.Questions || '').replace(/\n/g, ' ') + '</p>' +
      '<p style="font-size:12px;color:#6b7280;margin:0"><b>Details:</b><br/>' + details + '</p></div>';
  });

  let questionsHTML = '';
  followUpQuestions.forEach(fq => {
    questionsHTML += '<div style="margin-bottom:14px;padding:10px;border-left:4px solid ' + severityColor(fq.severity) + ';background:#f9fafb;border-radius:4px">' +
      '<p style="font-weight:600;margin:0 0 6px;color:#1f2937">' + fq.category + '</p>' +
      '<p style="font-size:11px;color:#6b7280;margin:0 0 6px">' + fq.context + '</p><ul style="margin:0;padding-left:18px">';
    fq.items.forEach(item => { questionsHTML += '<li style="font-size:12px;color:#374151;margin-bottom:3px">' + item + '</li>'; });
    questionsHTML += '</ul></div>';
  });

  let breakdownHTML = '';
  score.breakdown.forEach(b => {
    breakdownHTML += '<tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:13px">' + b.factor + '</td>' +
      '<td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center">' + b.points + ' / ' + b.max + '</td>' +
      '<td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:13px">' + b.detail + '</td></tr>';
  });

  const html = '<!DOCTYPE html><html><head><title>TeleMER Report - ' + (meta['Name of Member'] || meta['Name of the Proposer'] || 'Report') + '</title>' +
    '<style>body{font-family:Arial,sans-serif;margin:30px;color:#1f2937}h1{color:#1e40af;border-bottom:3px solid #1e40af;padding-bottom:8px}h2{color:#374151;margin-top:28px;border-bottom:1px solid #d1d5db;padding-bottom:6px}.meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px}.meta-item{font-size:13px;padding:4px 0}.meta-label{color:#6b7280;font-weight:600}table{width:100%;border-collapse:collapse;margin-top:8px}th{background:#f3f4f6;padding:8px 10px;text-align:left;font-size:12px;border-bottom:2px solid #d1d5db}@media print{body{margin:15px}}</style></head><body>' +
    '<div style="text-align:center;margin-bottom:20px"><h1 style="border:none;margin:0">PIVOT UW CoPilot - TeleMER Analysis Report</h1>' +
    '<p style="color:#6b7280;font-size:13px">Generated: ' + new Date().toLocaleString() + ' | Application: ' + (summary['Application No.'] || 'N/A') + '</p></div>' +
    '<div style="text-align:center;margin:20px 0;padding:20px;background:#f9fafb;border-radius:12px;border:2px solid ' + score.color + '">' +
    '<p style="margin:0;font-size:14px;color:#6b7280">PIVOT TeleMER Risk Score</p>' +
    '<p style="display:inline-block;padding:8px 20px;border-radius:20px;color:#fff;font-size:32px;font-weight:700;background:' + score.color + ';margin:10px 0">' + score.total + ' / 100</p>' +
    '<p style="margin:0;font-size:16px;font-weight:600;color:' + score.color + '">' + score.level + '</p></div>' +
    '<h2>Score Breakdown</h2><table><tr><th>Factor</th><th style="text-align:center">Score</th><th>Detail</th></tr>' + breakdownHTML + '</table>' +
    '<h2>Member Profile</h2><div class="meta-grid">' + Object.entries(meta).map(([k,v]) => '<div class="meta-item"><span class="meta-label">' + k + ':</span> ' + (v || 'N/A') + '</div>').join('') + '</div>' +
    '<h2>Medical Declarations (' + medDecls.length + ')</h2>' + medDeclsHTML +
    '<h2>Suggested Follow-up Questions (' + followUpQuestions.length + ' areas)</h2>' + questionsHTML +
    '<div style="margin-top:30px;padding-top:10px;border-top:2px solid #e5e7eb;font-size:11px;color:#9ca3af;text-align:center">PIVOT UW CoPilot by Attributum | Confidential - For Underwriting Use Only</div></body></html>';

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) { win.onload = () => { setTimeout(() => win.print(), 500); }; }
};

const App = () => {
  const [page, setPage] = useState('home');
  const [file, setFile] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  // Add state for expanded members sections
  const [expandedMembers, setExpandedMembers] = useState({});
  const [previousPolicies, setPreviousPolicies] = useState([]);
  const [multiYearUploadVisible, setMultiYearUploadVisible] = useState(false);

  // Underwriting CoPilot (TeleMER) states
  const [uwFile, setUwFile] = useState(null);
    const [uwCompany, setUwCompany] = useState('telemer_hdfcergo');
  const [uwLoading, setUwLoading] = useState(false);
  const [uwResponseData, setUwResponseData] = useState(null);
  const [uwFileError, setUwFileError] = useState(null);
  const [uwShowRaw, setUwShowRaw] = useState(false);
  const [uwExpandedDecl, setUwExpandedDecl] = useState(null);
  const [uwShowBreakdown, setUwShowBreakdown] = useState(false);

  // Session & permissions state (Phase 2)
  const [sessionInfo, setSessionInfo] = useState(null);
  const [allowedModules, setAllowedModules] = useState([]);

  // Fetch session permissions on mount
  useEffect(() => {
    fetch('/api/auth/permissions')
      .then(res => res.json())
      .then(data => {
        setSessionInfo(data);
        setAllowedModules(data.allowed_modules || []);
      })
      .catch(() => {
        // If permissions fetch fails, redirect to login
        window.location.href = '/login';
      });
  }, []);

  // Helper: check if a module is allowed
  const hasModule = (mod) => allowedModules.includes(mod);

  // Logout handler
  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => { window.location.href = '/login'; })
      .catch(() => { window.location.href = '/login'; });
  };

  const handleUwFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setUwFileError('Please upload a PDF, JPG, or PNG file');
        setUwFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setUwFileError('File size must be less than 10MB');
        setUwFile(null);
        return;
      }
      setUwFileError(null);
      setUwFile(selectedFile);
    }
  };

  const handleUwUpload = async (e) => {
    e.preventDefault();
    if (!uwFile) return;
    setUwFileError(null);
    setUwLoading(true);
    try {
      const formData = new FormData();
      formData.append('input_file', uwFile);
      formData.append('insurance_company', uwCompany);
      const response = await fetch('/api/underwriting/analyze', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Upload failed (HTTP ' + response.status + ')');
      }
      const data = await response.json();
      setUwResponseData(data);
    } catch (err) {
      console.error('TeleMER Error:', err);
      setUwFileError(err.message);
    } finally {
      setUwLoading(false);
    }
  };

  // Utility function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    
    try {
      const dobDate = parseDate(dob);
      if (!dobDate) return null;
      
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return null;
    }
  };

  // Toggle members expansion for a policy
  const toggleMembersExpansion = (policyIndex) => {
    setExpandedMembers(prev => ({
      ...prev,
      [policyIndex]: !prev[policyIndex]
    }));
  };

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
      setAnalysisCompleted(false); // Reset analysis state for new file
    } else {
      setFile(null);
    }
  };

  const handlePreviousPolicyUpload = async (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    if (validateFile(selectedFile)) {
      
      // Create new policy object with unique controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const newPolicy = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        processed: false,
        data: null,
        error: null,
        controller: controller, // Store controller for this specific policy
        timeoutId: timeoutId
      };
      
      
      // Add to state first
      setPreviousPolicies(prev => {
        const updated = [...prev, newPolicy];
        return updated;
      });
      
      // Process the file through API
      try {
        
        const formData = new FormData();
        formData.append('input_file', selectedFile);
        formData.append('insurance_company', 'STAR HEALTH');
        
        console.log('FormData prepared:', {
          file: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        });
        
        
        const response = await fetch('http://localhost:3000/api/ml_process', {
          method: 'POST',
          body: formData,
          signal: controller.signal // Use policy-specific controller
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update the last policy with API data
        setPreviousPolicies(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              data: data,
              processed: true,
              error: null,
              controller: null, // Clear controller after completion
              timeoutId: null
            };
          }
          return updated;
        });
        
      } catch (err) {
        console.error('Multi-year policy processing error:', err);
        console.error('Error details:', err.message, err.stack);
        
        // Mark the last policy as failed
        setPreviousPolicies(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              data: null,
              processed: false,
              error: err.name === 'AbortError' ? 'Processing timeout - please try again' : err.message,
              controller: null, // Clear controller after error
              timeoutId: null
            };
          }
          return updated;
        });
      }
      
      // Clear the file input
      e.target.value = '';
    } else {
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
      
      
      const response = await fetch('/api/ml_process', {
        method: 'POST',
        body: formData
      });
      
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const calculatedScore = calculateScore(data);
      setScoreData(calculatedScore);
      setResponseData(data);
      setAnalysisCompleted(true);
    } catch (err) {
      console.error('Error:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely access response data
  const getSafeResponseData = (responseData) => {
    return responseData?.response?.data || responseData || {};
  };

  // Utility function to parse DD/MM/YYYY date
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const dateParts = dateString.split('/');
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-indexed
      const year = parseInt(dateParts[2]);
      return new Date(year, month, day);
    }
    return null;
  };

  // Utility function to calculate duration between dates
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    if (!start || !end) return null;
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, totalMonths: years * 12 + months };
  };

  // Utility function to format duration
  const formatDuration = (duration) => {
    if (!duration) return '';
    
    const parts = [];
    if (duration.years > 0) {
      parts.push(`${duration.years} year${duration.years > 1 ? 's' : ''}`);
    }
    if (duration.months > 0) {
      parts.push(`${duration.months} month${duration.months > 1 ? 's' : ''}`);
    }
    
    return parts.join(', ');
  };

  // Function to process and sequence policies with automatic labeling
  const processPolicies = (currentPolicyData, previousPolicies) => {
    
    // Create immutable copy of all policies
    const allPolicies = [];
    
    // Add current policy
    const currentPolicy = {
      type: 'current',
      data: currentPolicyData,
      file: { name: 'Current Policy' },
      processed: true
    };
    allPolicies.push(currentPolicy);
    
    // Add previous policies with actual API data - never discard
    previousPolicies.forEach((policyFile, index) => {
      console.log(`Processing previous policy ${index}:`, {
        name: policyFile.name,
        processed: policyFile.processed,
        hasData: !!policyFile.data,
        error: policyFile.error
      });
      
      allPolicies.push({
        type: 'previous',
        data: policyFile.data || null, // Use API data if available
        file: policyFile,
        index: index,
        processed: policyFile.processed || false,
        error: policyFile.error || null
      });
    });
    
    
    // Process policies with date extraction and labeling - use copied array
    const processedPolicies = allPolicies.map(policy => {
      const policyData = policy.data;
      let label = 'Date Incomplete';
      let startDate = null;
      let endDate = null;
      let duration = null;
      let hasValidDates = false;
      
      // Handle the API response structure: data.response.data
      const responseData = policyData?.response?.data || policyData;
      
      // Relax validity gating - dates are optional for inclusion
      if (responseData && responseData.policy_and_coverage_details) {
        startDate = responseData.policy_and_coverage_details.policy_start_date;
        endDate = responseData.policy_and_coverage_details.policy_end_date;
        
        // Validity checks occur after date parsing and normalization
        if (startDate && endDate) {
          const parsedStart = parseDate(startDate);
          const parsedEnd = parseDate(endDate);
          
          if (parsedStart && parsedEnd && parsedStart <= parsedEnd) {
            duration = calculateDuration(startDate, endDate);
            hasValidDates = true;
          }
        }
      }
      
      // Add processing status to label
      if (!policy.processed && policy.type === 'previous') {
        label = 'Processing...';
      } else if (policy.error) {
        label = 'Processing Failed';
      } else if (!hasValidDates) {
        label = 'Date Incomplete';
      }
      
      return {
        ...policy,
        label,
        startDate,
        endDate,
        duration,
        hasValidDates
      };
    });
    
    
    // Create single sortedPolicies[] source of truth by policy_start_date (ascending)
    // Oldest policy on the left, most recent on the right
    const sortedPolicies = [...processedPolicies].sort((a, b) => {
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      
      // Handle policies without dates - put them at the end
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1; // a goes to end
      if (!dateB) return -1; // b goes to end
      
      return dateA - dateB; // Ascending order (oldest first)
    });
    
    
    // Assign labels based on sorted order
    sortedPolicies.forEach((policy, index) => {
      if (policy.hasValidDates) {
        if (index === sortedPolicies.length - 1) {
          // Most recent policy (last in ascending order)
          policy.label = 'Most Recent Policy';
        } else {
          // Previous policies get Year-N labels based on position from end
          const yearNumber = sortedPolicies.length - 1 - index;
          policy.label = `Previous Policy (Year-${yearNumber})`;
        }
      }
    });
    
    
    return sortedPolicies; // Return single sorted array as source of truth
  };

  // Function to extract comparable parameters from policy data
  const extractComparableParameters = (policyData) => {
    
    if (!policyData) {
      return null;
    }
    
    // Handle the API response structure: data.response.data
    const responseData = policyData.response?.data || policyData;
    
    const policyDetails = responseData.policy_and_coverage_details || {};
    const insuredDetails = responseData.insured_details || [];
    
    
    // Check policy type and extract appropriate values
    const isFloater = policyDetails.policy_type?.toLowerCase() === 'floater';
    
    let sumInsured = null;
    let cumulativeBonus = null;
    let memberCount = 0;
    let originalSumInsured = null; // Store original formatted value
    let originalCumulativeBonus = null; // Store original formatted value
    
    // Treat all policies as individual unless explicitly marked FLOATER
    if (isFloater) {
      // Only show floater values if explicitly marked as FLOATER
      sumInsured = policyDetails.floater_basic_sum_insured;
      cumulativeBonus = policyDetails.floater_cumulative_bonus;
      originalSumInsured = policyDetails.floater_basic_sum_insured; // Keep original
      originalCumulativeBonus = policyDetails.floater_cumulative_bonus; // Keep original
      memberCount = insuredDetails.length; // Count all members in floater
      
      console.log('📊 Using Floater values (explicitly marked FLOATER):', { 
        sumInsured, 
        cumulativeBonus, 
        memberCount,
        originalSumInsured,
        originalCumulativeBonus
      });
    } else {
      // Treat as individual policy - extract from first insured member's individual_policy_cumulative_bonus
      sumInsured = null; // Individual policies don't have policy-level SI
      originalSumInsured = null;
      memberCount = insuredDetails.length; // Count members
      
      // Extract individual_policy_cumulative_bonus from the first insured member
      if (insuredDetails.length > 0) {
        const firstInsured = insuredDetails[0];
        cumulativeBonus = firstInsured.individual_policy_cumulative_bonus;
        originalCumulativeBonus = firstInsured.individual_policy_cumulative_bonus;
        
        console.log('📊 Extracted from Individual Policy (first member):', { 
          cumulativeBonus,
          originalCumulativeBonus,
          memberCount,
          source: 'individual_policy_cumulative_bonus from first insured member'
        });
      } else {
        cumulativeBonus = null;
        originalCumulativeBonus = null;
        
        console.log('📊 No insured members found for Individual Policy:', { 
          memberCount: 0,
          cumulativeBonus: null
        });
      }
    }
    
    // Convert to numbers - handle various formats (for internal comparison only)
    let parsedSumInsured = null;
    let parsedCumulativeBonus = null;
    
    if (sumInsured !== null && sumInsured !== undefined) {
      // Remove any non-numeric characters and convert
      const cleanSumInsured = String(sumInsured).replace(/[^\d.]/g, '');
      parsedSumInsured = cleanSumInsured ? parseFloat(cleanSumInsured) : null;
    }
    
    if (cumulativeBonus !== null && cumulativeBonus !== undefined) {
      // Remove any non-numeric characters and convert
      const cleanCumulativeBonus = String(cumulativeBonus).replace(/[^\d.]/g, '');
      parsedCumulativeBonus = cleanCumulativeBonus ? parseFloat(cleanCumulativeBonus) : null;
    }
    
    console.log('🧹 Cleaned values:', { 
      cleanSumInsured: String(sumInsured).replace(/[^\d.]/g, ''),
      cleanCumulativeBonus: String(cumulativeBonus).replace(/[^\d.]/g, '')
    });
    
    const params = {
      // Policy Timeline
      policy_start_date: policyDetails.policy_start_date,
      policy_end_date: policyDetails.policy_end_date,
      
      // Coverage & Risk - properly separated by policy type
      sum_insured: parsedSumInsured, // For internal comparison only
      cumulative_bonus: parsedCumulativeBonus, // For internal comparison only
      original_sum_insured: originalSumInsured, // For display
      original_cumulative_bonus: originalCumulativeBonus, // For display
      policy_type: policyDetails.policy_type,
      is_floater: isFloater,
      
      // Proposer Information
      proposer_name: (responseData.proposer_details?.first_name && responseData.proposer_details?.last_name) ?
                     `${responseData.proposer_details.first_name} ${responseData.proposer_details.last_name}` :
                     responseData.proposer_details?.first_name || 
                     responseData.proposer_details?.last_name ||
                     responseData.proposer_details?.proposer_full_name || 
                     responseData.proposer_details?.proposer_name || 
                     'Not specified',
      
      // Members
      members: insuredDetails.map(insured => ({
        name: insured.insured_name || insured.name,
        relationship: insured.relationship,
        date_of_birth: insured.date_of_birth || insured.dob,
        age: insured.age || calculateAge(insured.date_of_birth || insured.dob), // Use age from data or compute from DOB
        individual_sum_insured: insured.individual_policy_sum_insured, // Keep individual SI separate
        individual_cumulative_bonus: insured.individual_policy_cumulative_bonus, // Keep individual CB separate
        original_individual_sum_insured: insured.individual_policy_sum_insured, // For display
        original_individual_cumulative_bonus: insured.individual_policy_cumulative_bonus, // For display
        declared_ped: insured.declared_ped // Member-level PED
      })).filter(m => m.name),
      
      // Member count
      member_count: memberCount,
      
      // Policy Structure
      policy_product_name: policyDetails.policy_product_name,
      insurer_name: policyDetails.optional_coverage_5
    };
    
    console.log('👤 Extracted proposer name:', (responseData.proposer_details?.first_name && responseData.proposer_details?.last_name) ?
                     `${responseData.proposer_details.first_name} ${responseData.proposer_details.last_name}` :
                     responseData.proposer_details?.first_name || 
                     responseData.proposer_details?.last_name ||
                     responseData.proposer_details?.proposer_full_name || 
                     responseData.proposer_details?.proposer_name || 
                     'Not specified');
    
    return params;
  };

  // Function to compare policies and generate insights
  const comparePolicies = (processedPolicies) => {
    
    if (processedPolicies.length < 2) {
      return { comparisons: [], insights: [] };
    }
    
    // Only compare policies with valid data and dates
    const policiesWithParams = processedPolicies
      .filter(p => p.hasValidDates && p.data && p.processed)
      .map(p => ({ ...p, params: extractComparableParameters(p.data) }));
    
    if (policiesWithParams.length < 2) {
      return { comparisons: [], insights: [] };
    }
    
    
    const comparisons = [];
    const rawInsights = [];
    const insightSet = new Set(); // Track unique insights to prevent duplication
    
    // Compare consecutive policies (chronological order)
    for (let i = 0; i < policiesWithParams.length - 1; i++) {
      const current = policiesWithParams[i];
      const previous = policiesWithParams[i + 1];
      
      
      if (!current.params || !previous.params) {
        continue;
      }
      
      // === POLICY-LEVEL CHANGES ===
      
      // Coverage comparison (Sum Insured)
      if (current.params.sum_insured !== null && previous.params.sum_insured !== null && 
          current.params.sum_insured !== previous.params.sum_insured) {
        const change = {
          parameter: 'Sum Insured',
          current: current.params.sum_insured !== null && current.params.sum_insured !== undefined ? 
                   `₹${current.params.sum_insured.toLocaleString('en-IN')}` : 'Not specified',
          previous: previous.params.sum_insured !== null && previous.params.sum_insured !== undefined ? 
                    `₹${previous.params.sum_insured.toLocaleString('en-IN')}` : 'Not specified',
          change: 'SI Change',
          level: 'policy'
        };
        comparisons.push(change);
        
        // Create unique key for deduplication
        const insightKey = `si_change_${i}`;
        if (!insightSet.has(insightKey)) {
          insightSet.add(insightKey);
          rawInsights.push({
            type: 'policy',
            signal_type: 'sum_insured_change',
            member_name: null,
            year_pair: `${previous.label}-${current.label}`,
            message: current.params.sum_insured > previous.params.sum_insured ? 
              `Sum insured increased from ₹${previous.params.sum_insured.toLocaleString('en-IN')} to ₹${current.params.sum_insured.toLocaleString('en-IN')} (${current.label})` :
              `Sum insured decreased from ₹${previous.params.sum_insured.toLocaleString('en-IN')} to ₹${current.params.sum_insured.toLocaleString('en-IN')} (${current.label})`,
            strength: Math.abs(current.params.sum_insured - previous.params.sum_insured)
          });
        }
      }
      
      // Cumulative bonus comparison
      if (current.params.cumulative_bonus !== null && previous.params.cumulative_bonus !== null && 
          current.params.cumulative_bonus !== previous.params.cumulative_bonus) {
        const change = {
          parameter: 'Cumulative Bonus',
          current: current.params.cumulative_bonus !== null && current.params.cumulative_bonus !== undefined ? 
                   current.params.cumulative_bonus.toLocaleString() : 'Not specified',
          previous: previous.params.cumulative_bonus !== null && previous.params.cumulative_bonus !== undefined ? 
                    previous.params.cumulative_bonus.toLocaleString() : 'Not specified',
          change: 'CB Change',
          level: 'policy'
        };
        comparisons.push(change);
        
        const insightKey = `cb_change_${i}`;
        if (!insightSet.has(insightKey)) {
          insightSet.add(insightKey);
          rawInsights.push({
            type: 'policy',
            signal_type: 'cumulative_bonus_reset',
            member_name: null,
            year_pair: `${previous.label}-${current.label}`,
            message: current.params.cumulative_bonus < previous.params.cumulative_bonus ? 
              `Cumulative bonus reset from ${previous.params.cumulative_bonus}% to ${current.params.cumulative_bonus}% - possible indication of claim (${current.label})` :
              `Cumulative bonus improved from ${previous.params.cumulative_bonus}% to ${current.params.cumulative_bonus}% (${current.label})`,
            strength: Math.abs(current.params.cumulative_bonus - previous.params.cumulative_bonus)
          });
        }
      }
      
      // Coverage gap detection
      if (current.startDate && previous.endDate) {
        const currentStart = parseDate(current.startDate);
        const previousEnd = parseDate(previous.endDate);
        
        if (currentStart && previousEnd) {
          const gapDays = Math.ceil((currentStart - previousEnd) / (1000 * 60 * 60 * 24));
          
          if (gapDays > 0) {
            const insightKey = `coverage_gap_${i}`;
            if (!insightSet.has(insightKey)) {
              insightSet.add(insightKey);
              rawInsights.push({
                type: 'policy',
                signal_type: 'coverage_gap',
                member_name: null,
                year_pair: `${previous.label}-${current.label}`,
                message: `Coverage gap of ${gapDays} days detected between ${previous.label} and ${current.label}`,
                strength: gapDays
              });
            }
          } else if (gapDays < 0) {
            const overlapDays = Math.abs(gapDays);
            const insightKey = `coverage_overlap_${i}`;
            if (!insightSet.has(insightKey)) {
              insightSet.add(insightKey);
              rawInsights.push({
                type: 'policy',
                signal_type: 'coverage_overlap',
                member_name: null,
                year_pair: `${previous.label}-${current.label}`,
                message: `Coverage overlap of ${overlapDays} days detected between ${previous.label} and ${current.label}`,
                strength: overlapDays
              });
            }
          }
        }
      }
      
      // === MEMBER-LEVEL CHANGES ===
      
      // Member count comparison
      const currentMembers = current.params.members || [];
      const previousMembers = previous.params.members || [];
      const currentMemberCount = currentMembers.length;
      const previousMemberCount = previousMembers.length;
      
      if (currentMemberCount !== previousMemberCount) {
        const change = {
          parameter: 'Members Count',
          current: currentMemberCount,
          previous: previousMemberCount,
          change: 'Member Count Change',
          level: 'member'
        };
        comparisons.push(change);
        
        const insightKey = `member_count_${i}`;
        if (!insightSet.has(insightKey)) {
          insightSet.add(insightKey);
          rawInsights.push({
            type: 'member',
            signal_type: 'member_count_change',
            member_name: null,
            year_pair: `${previous.label}-${current.label}`,
            message: currentMemberCount > previousMemberCount ? 
              `${currentMemberCount - previousMemberCount} member(s) added in ${current.label}` :
              `${previousMemberCount - currentMemberCount} member(s) removed in ${current.label}`,
            strength: Math.abs(currentMemberCount - previousMemberCount)
          });
        }
      }
      
      // Member additions and removals
      const currentMemberNames = new Set(currentMembers.map(m => m.name));
      const previousMemberNames = new Set(previousMembers.map(m => m.name));
      
      const addedMembers = currentMembers.filter(m => !previousMemberNames.has(m.name));
      const removedMembers = previousMembers.filter(m => !currentMemberNames.has(m.name));
      
      if (addedMembers.length > 0) {
        const insightKey = `members_added_${i}`;
        if (!insightSet.has(insightKey)) {
          insightSet.add(insightKey);
          const addedNames = addedMembers.map(m => m.name).join(', ');
          rawInsights.push({
            type: 'member',
            signal_type: 'member_addition',
            member_name: addedNames,
            year_pair: `${previous.label}-${current.label}`,
            message: `New members added in ${current.label}: ${addedNames}`,
            strength: addedMembers.length
          });
        }
      }
      
      if (removedMembers.length > 0) {
        const insightKey = `members_removed_${i}`;
        if (!insightSet.has(insightKey)) {
          insightSet.add(insightKey);
          const removedNames = removedMembers.map(m => m.name).join(', ');
          rawInsights.push({
            type: 'member',
            signal_type: 'member_removal',
            member_name: removedNames,
            year_pair: `${previous.label}-${current.label}`,
            message: `Members removed in ${current.label}: ${removedNames}`,
            strength: removedMembers.length
          });
        }
      }
      
      // PED changes for common members
      const commonMembers = currentMembers.filter(currentMember => 
        previousMembers.some(prevMember => prevMember.name === currentMember.name)
      );
      
      commonMembers.forEach(member => {
        const previousMember = previousMembers.find(m => m.name === member.name);
        const currentPED = member.declared_ped;
        const previousPED = previousMember?.declared_ped;
        
        // Normalize PED values for comparison
        const normalizePED = (ped) => {
          if (!ped || ped === 'None' || ped === 'No PED Declared' || ped === null) {
            return 'none';
          }
          return 'declared';
        };
        
        const currentPEDNormalized = normalizePED(currentPED);
        const previousPEDNormalized = normalizePED(previousPED);
        
        if (currentPEDNormalized !== previousPEDNormalized) {
          const insightKey = `ped_change_${member.name}_${i}`;
          if (!insightSet.has(insightKey)) {
            insightSet.add(insightKey);
            rawInsights.push({
              type: 'member',
              signal_type: 'ped_change',
              member_name: member.name,
              year_pair: `${previous.label}-${current.label}`,
              message: currentPEDNormalized === 'declared' && previousPEDNormalized === 'none' ? 
                `New PED declared for ${member.name} in ${current.label} - possible indication of health condition` :
                `PED no longer declared for ${member.name} in ${current.label}`,
              strength: currentPEDNormalized === 'declared' ? 10 : 5 // Higher strength for new PED
            });
          }
        }
      });
      
      // Individual Sum Insured changes for common members
      commonMembers.forEach(member => {
        const previousMember = previousMembers.find(m => m.name === member.name);
        const currentSI = member.individual_sum_insured ? parseInt(member.individual_sum_insured) : null;
        const previousSI = previousMember?.individual_sum_insured ? parseInt(previousMember.individual_sum_insured) : null;
        
        if (currentSI !== null && previousSI !== null && currentSI !== previousSI) {
          const insightKey = `individual_si_${member.name}_${i}`;
          if (!insightSet.has(insightKey)) {
            insightSet.add(insightKey);
            rawInsights.push({
              type: 'member',
              signal_type: 'individual_si_change',
              member_name: member.name,
              year_pair: `${previous.label}-${current.label}`,
              message: currentSI > previousSI ? 
                `Individual sum insured increased for ${member.name} from ₹${previousSI.toLocaleString('en-IN')} to ₹${currentSI.toLocaleString('en-IN')} (${current.label})` :
                `Individual sum insured decreased for ${member.name} from ₹${previousSI.toLocaleString('en-IN')} to ₹${currentSI.toLocaleString('en-IN')} (${current.label})`,
              strength: Math.abs(currentSI - previousSI)
            });
          }
        }
      });
    }
    
    // === DEMO-SAFE INSIGHT CLEANUP ===
    
    // Group insights by type
    const policyInsights = rawInsights.filter(insight => insight.type === 'policy');
    const memberInsights = rawInsights.filter(insight => insight.type === 'member');
    
    // Sort by strength (strongest signals first)
    policyInsights.sort((a, b) => b.strength - a.strength);
    memberInsights.sort((a, b) => b.strength - a.strength);
    
    // Cap insights to top 6-8 strongest signals
    const maxPolicyInsights = 3;
    const maxMemberInsights = 3;
    const cappedPolicyInsights = policyInsights.slice(0, maxPolicyInsights);
    const cappedMemberInsights = memberInsights.slice(0, maxMemberInsights);
    
    // Combine and format final insights
    const finalInsights = [
      ...cappedPolicyInsights.map(insight => `Policy-level: ${insight.message}`),
      ...cappedMemberInsights.map(insight => `Member-level: ${insight.message}`)
    ];
    
    // Add footer note if insights were capped
    const totalRawInsights = rawInsights.length;
    const totalCappedInsights = finalInsights.length;
    
    
    return { comparisons, insights: finalInsights };
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
        const noPEDIndicators = ['no ped declared', 'none', 'no ped', 'no peds', 'no pre-existing diseases', 'no pre-existing disease', 'no', 'no.'];
        
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
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 w-56">
                {/* Attributum Logo */}
                <div className="flex items-center space-x-2">
                  <img
                    src="/logos/attributum-logo.png"
                    alt="Attributum Logo"
                    className="w-50 h-20 rounded-lg object-contain"
                    style={{maxHeight: '56px', maxWidth: '180px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-50 h-20 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gray-800">PIVOT Insurance Automation Suite</h1>
                <p className="text-sm text-gray-600">Live Product Demos & Enterprise Sandbox</p>
              </div>

              <div className="flex items-center justify-end space-x-6 w-56">
                {/* PIVOT Logo */}
                <div className="flex items-center space-x-2">
                  <img
                    src="/logos/pivot-logo.png"
                    alt="PIVOT Logo"
                    className="w-40 h-20 rounded-lg object-contain"
                    style={{maxHeight: '56px', maxWidth: '160px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-40 h-20 bg-purple-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* User session bar */}
        {sessionInfo && (
        <div className="bg-blue-900 text-white py-2 px-4">
          <div className="container mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <i className="fas fa-user-circle"></i>
              <span>{sessionInfo.client_name}</span>
              {sessionInfo.role === 'super_admin' && (
                <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">ADMIN</span>
              )}
              <span className="text-blue-300">|</span>
              <span className="text-blue-300">{allowedModules.length} module{allowedModules.length !== 1 ? 's' : ''} active</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-300 text-xs">DEMO — FOR EVALUATION ONLY</span>
              {sessionInfo.role === 'super_admin' && (
                <a href="/admin" className="bg-amber-600 hover:bg-amber-500 px-3 py-1 rounded text-xs font-semibold transition-colors" style={{color:'#fff',textDecoration:'none'}}>
                  <i className="fas fa-cog mr-1"></i> Admin Panel
                </a>
              )}
              <button onClick={handleLogout} className="bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors">
                <i className="fas fa-sign-out-alt mr-1"></i> Logout
              </button>
            </div>
          </div>
        </div>
        )}

        <section className="py-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Transform Insurance Operations with AI</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Production-grade automation for Insurance Carriers
              </p>
            </div>
          </div>
        </section>

        <div className="text-center py-2">
          <p className="text-sm text-gray-500 font-bold">PIVOT Modules trusted by Carriers</p>
        </div>

        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              {/* Portability Module */}
              {hasModule('portability') ? (
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
              ) : (
              <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 opacity-70">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-exchange-alt text-gray-400 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-3">PIVOT Portability Module</h3>
                  <p className="text-gray-400 mb-4">
                    AI-powered policy portability scoring and compliance checks
                  </p>
                  <a href="mailto:pivot@attributum.com" className="flex items-center text-amber-600 font-medium hover:text-amber-700">
                    <i className="fas fa-envelope mr-2"></i> Contact Sales to Unlock
                  </a>
                </div>
              </div>
              )}

              {/* Endorsements Module */}
              {hasModule('endorsements') ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border-2 border-blue-500"
                   onClick={() => window.open('http://35.154.219.243:5173', '_blank')}>
                <div className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-file-contract text-orange-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">PIVOT Endorsements CoPilot</h3>
                  <p className="text-gray-600 mb-4">
                    Automated policy endorsements with built-in validation
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Launch Endorsements Demo →</span>
                  </div>
                </div>
              </div>
              ) : (
              <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 opacity-70">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-file-contract text-gray-400 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-3">PIVOT Endorsements CoPilot</h3>
                  <p className="text-gray-400 mb-4">
                    Automated policy endorsements with built-in validation
                  </p>
                  <a href="mailto:pivot@attributum.com" className="flex items-center text-amber-600 font-medium hover:text-amber-700">
                    <i className="fas fa-envelope mr-2"></i> Contact Sales to Unlock
                  </a>
                </div>
              </div>
              )}

              {/* TeleMER / Underwriting Module */}
              {hasModule('telemer') ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border-2 border-blue-500"
                   onClick={() => setPage('underwriting')}>
                <div className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-clipboard-check text-green-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">PIVOT Underwriting CoPilot (TeleMER)</h3>
                  <p className="text-gray-600 mb-4">
                    AI-assisted underwriting with automated risk assessment
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Launch TeleMER Demo →</span>
                  </div>
                </div>
              </div>
              ) : (
              <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 opacity-70">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-clipboard-check text-gray-400 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-3">PIVOT Underwriting CoPilot (TeleMER)</h3>
                  <p className="text-gray-400 mb-4">
                    AI-assisted underwriting with automated risk assessment
                  </p>
                  <a href="mailto:pivot@attributum.com" className="flex items-center text-amber-600 font-medium hover:text-amber-700">
                    <i className="fas fa-envelope mr-2"></i> Contact Sales to Unlock
                  </a>
                </div>
              </div>
              )}

              {/* Operations Module (Coming Soon) */}
              {hasModule('operations') ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border-2 border-blue-500">
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
              ) : (
              <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 opacity-70">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-cogs text-gray-400 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-3">PIVOT Operations CoPilot</h3>
                  <p className="text-gray-400 mb-4">
                    Automated insurance operations and workflows
                  </p>
                  <a href="mailto:pivot@attributum.com" className="flex items-center text-amber-600 font-medium hover:text-amber-700">
                    <i className="fas fa-envelope mr-2"></i> Contact Sales to Unlock
                  </a>
                </div>
              </div>
              )}

              {/* RFQ Module (Coming Soon) */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-indigo-300 relative">
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">Coming Soon</span>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-file-invoice text-indigo-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">PIVOT RFQ</h3>
                  <p className="text-gray-600 mb-4">
                    AI-powered RFQ extraction for Group Health — from quote generation to policy fulfilment
                  </p>
                  <div className="flex items-center text-indigo-500 font-medium">
                    <i className="fas fa-flask mr-2"></i>
                    <span>In Development</span>
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

  if (page === 'underwriting') {
    const uwData = uwResponseData?.response?.data;
    const uwScore = uwResponseData ? computeTeleMERScore(uwResponseData) : null;
    const uwQuestions = uwResponseData ? generateFollowUpQuestions(uwResponseData) : [];
    const uwMeta = uwData?.MetaData || {};
    const uwSummary = uwData?.Summary || {};
    const uwMedDecls = uwData?.YesMedicalDeclarationData || [];
    const uwNonMedDecls = uwData?.YesNonMedicalDeclarationData || [];

    // SVG Ring Chart component for score
    const ScoreRing = ({ score, color, size }) => {
      const radius = (size || 80) / 2 - 8;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (score / 100) * circumference;
      const center = (size || 80) / 2;
      return (
        <svg width={size || 80} height={size || 80} style={{transform: 'rotate(-90deg)'}}>
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle cx={center} cy={center} r={radius} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{transition: 'stroke-dashoffset 1s ease'}} />
        </svg>
      );
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 w-56">
                <div className="flex items-center space-x-2">
                  <img src="/logos/attributum-logo.png" alt="Attributum Logo" className="w-50 h-20 rounded-lg object-contain"
                    style={{maxHeight: '56px', maxWidth: '180px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                  <div className="w-50 h-20 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gray-800">PIVOT UW CoPilot (TeleMER)</h1>
                <p className="text-sm text-gray-600">AI-Assisted Underwriting with Automated Risk Assessment</p>
              </div>
              <div className="flex items-center justify-end space-x-6 w-56">
                <div className="flex items-center space-x-2">
                  <img src="/logos/pivot-logo.png" alt="PIVOT Logo" className="w-40 h-20 rounded-lg object-contain"
                    style={{maxHeight: '56px', maxWidth: '160px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                  <div className="w-40 h-20 bg-purple-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Top Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs text-gray-500 mt-1">Upload TeleMER documents for AI-powered medical risk analysis</p>
              </div>
              <div className="flex space-x-3">
                {uwResponseData && (
                  <>
                    <button onClick={() => exportTeleMERPDF(uwResponseData, uwScore, uwQuestions)}
                      className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      <i className="fas fa-file-pdf mr-1"></i> Export PDF
                    </button>
                    <button onClick={() => setUwShowRaw(!uwShowRaw)}
                      className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                      <i className="fas fa-code mr-1"></i> {uwShowRaw ? 'Hide' : 'Show'} Raw JSON
                    </button>
                  </>
                )}
                <button onClick={() => setPage('telemer-config')}
                  className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                  <i className="fas fa-sliders-h mr-1"></i> Score Settings
                </button>
                <button onClick={() => { setPage('home'); setUwResponseData(null); setUwFile(null); }}
                  className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                  <i className="fas fa-arrow-left mr-1"></i> Back to Home
                </button>
              </div>
            </div>

            {/* Upload Form - always visible as compact bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <form onSubmit={(e) => { e.preventDefault(); handleUwUpload(e); }} className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-stethoscope text-green-600"></i>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden md:inline">Analyse TeleMER</span>
                </div>
                <select value={uwCompany} onChange={(e) => setUwCompany(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg text-sm" style={{minWidth: 150}}>
                  <option value="telemer_hdfcergo">HDFC Ergo</option>
                  <option value="telemer_starhealth">Star Health</option>
                  <option value="telemer_icicilombard">ICICI Lombard</option>
                  <option value="telemer_bajajallianz">Bajaj Allianz</option>
                  <option value="telemer_maxbupa">Max Bupa / Niva</option>
                  <option value="telemer_carehealth">Care Health</option>
                </select>
                <div className="flex-1" style={{minWidth: 200}}>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('uw-file-input')?.click()}>
                    <p className="text-sm text-gray-600">
                      {uwFile ? (<span><i className="fas fa-file-pdf mr-1 text-red-500"></i>{uwFile.name}</span>) :
                        (<span><i className="fas fa-cloud-upload-alt mr-1 text-gray-400"></i>Click to select file (PDF, JPG, PNG)</span>)}
                    </p>
                  </div>
                  <input id="uw-file-input" type="file" onChange={(e) => { handleUwFileChange(e); setUwFileError(null); }} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
                <button type="submit" disabled={!uwFile || uwLoading}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm">
                  {uwLoading ? (<span><i className="fas fa-spinner fa-spin mr-1"></i>Analysing...</span>) :
                    (<span><i className="fas fa-search mr-1"></i>Analyse</span>)}
                </button>
              </form>
              {uwFileError && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600"><i className="fas fa-exclamation-circle mr-1"></i> {uwFileError}</p>
                </div>
              )}
            </div>

            {/* Placeholder when no results yet */}
            {!uwResponseData && !uwLoading && (
              <div className="text-center py-16">
                <i className="fas fa-clipboard-check text-6xl text-gray-200 mb-4"></i>
                <p className="text-gray-400 text-lg">Upload a TeleMER document above to see the analysis</p>
                <p className="text-gray-300 text-sm mt-2">Select insurance company, choose file, and click Analyse</p>
              </div>
            )}

            {/* Loading state */}
            {uwLoading && (
              <div className="text-center py-16">
                <i className="fas fa-spinner fa-spin text-5xl text-green-500 mb-4"></i>
                <p className="text-gray-600 text-lg">Analysing document...</p>
                <p className="text-gray-400 text-sm mt-2">This may take a few moments depending on document size</p>
              </div>
            )}

            {/* === RESULTS SECTION === */}
            {uwResponseData && (
              <div className="space-y-6">

                {/* Risk Score Banner */}
                <div className="bg-white rounded-xl shadow-lg p-6" style={{borderLeft: `6px solid ${uwScore.color}`}}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Score Ring + Label */}
                    <div className="flex items-center space-x-4">
                      <div style={{position: 'relative', width: 90, height: 90}}>
                        <ScoreRing score={uwScore.total} color={uwScore.color} size={90} />
                        <div style={{position: 'absolute', top: 0, left: 0, width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span style={{fontSize: '22px', fontWeight: 700, color: uwScore.color}}>{uwScore.total}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">PIVOT TeleMER Risk Score</p>
                        <p className="text-xl font-bold" style={{color: uwScore.color}}>{uwScore.level}</p>
                        <p className="text-xs text-gray-400">Application: {uwSummary['Application No.'] || 'N/A'}</p>
                      </div>
                    </div>
                    {/* Key Metrics */}
                    <div className="flex space-x-6">
                      <div className="text-center px-4 py-2 rounded-lg" style={{background: uwScore.bmi >= 30 ? '#fef2f2' : '#f0fdf4'}}>
                        <p className="text-xs text-gray-500">BMI</p>
                        <p className="text-lg font-bold" style={{color: uwScore.bmi >= 30 ? '#dc2626' : '#16a34a'}}>{uwScore.bmi || 'N/A'}</p>
                        <p className="text-xs" style={{color: uwScore.bmi >= 30 ? '#dc2626' : '#16a34a'}}>{uwSummary.PIVOT_BMI_Category || ''}</p>
                      </div>
                      <div className="text-center px-4 py-2 rounded-lg" style={{background: uwSummary.PIVOT_Medical_Declarations_Category === 'Adverse' ? '#fef2f2' : '#f0fdf4'}}>
                        <p className="text-xs text-gray-500">Medical</p>
                        <p className="text-lg font-bold" style={{color: uwSummary.PIVOT_Medical_Declarations_Category === 'Adverse' ? '#dc2626' : '#16a34a'}}>
                          {uwSummary.PIVOT_Medical_Declarations_Category || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{uwMedDecls.length} declaration{uwMedDecls.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="text-lg font-bold text-gray-800">{uwScore.age || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{uwMeta.Gender || ''}</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Pages</p>
                        <p className="text-lg font-bold text-gray-800">{uwSummary.Pages || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Processed</p>
                      </div>
                    </div>
                  </div>
                  {/* Score Breakdown Bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1" style={{height: 8, borderRadius: 4, overflow: 'hidden', background: '#e5e7eb'}}>
                      {uwScore.breakdown.map((b, i) => (
                        <div key={i} style={{width: `${b.max}%`, height: '100%', background: b.points > 0 ? uwScore.color : 'transparent', opacity: 0.3 + (b.points / b.max) * 0.7, borderRadius: 2}} title={`${b.factor}: ${b.points}/${b.max}`}></div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      {uwScore.breakdown.map((b, i) => (
                        <span key={i} title={b.detail}><i className={`fas ${b.icon} mr-1`}></i>{b.factor}: {b.points}/{b.max}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed Score Breakdown — collapsible, right below banner */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setUwShowBreakdown(!uwShowBreakdown)}>
                    <span className="text-base font-semibold text-gray-800">
                      <i className="fas fa-chart-bar mr-2 text-purple-600"></i>Detailed Score Breakdown
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">Final Score = {uwScore.breakdown.map(b => b.points).join(' + ')} = {uwScore.total}</span>
                      <i className={`fas fa-chevron-${uwShowBreakdown ? 'up' : 'down'} text-gray-400`}></i>
                    </div>
                  </button>
                  {uwShowBreakdown && (
                    <div className="px-6 pb-5 border-t border-gray-100 space-y-3 pt-4">
                      {uwScore.breakdown.map((b, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600"><i className={`fas ${b.icon} mr-2`}></i>{b.factor}</span>
                            <span className="font-semibold text-gray-800">{b.points} / {b.max}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full" style={{height: 6}}>
                            <div className="rounded-full" style={{width: `${b.max > 0 ? (b.points / b.max) * 100 : 0}%`, height: 6, background: uwScore.color, transition: 'width 0.8s ease'}}></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{b.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Member Profile Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4"><i className="fas fa-user-circle mr-2 text-blue-600"></i>Member Profile</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(uwMeta).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 font-medium">{key}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-1">{String(value || 'N/A').replace(/\n/g, ', ')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two-Column: Declarations + Follow-up Questions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Medical & Non-Medical Declarations */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        <i className="fas fa-notes-medical mr-2 text-red-600"></i>Medical Declarations ({uwMedDecls.length})
                      </h3>
                      {uwMedDecls.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No medical declarations reported</p>
                      ) : (
                        <div className="space-y-3">
                          {uwMedDecls.map((decl, idx) => (
                            <div key={idx} className="border border-amber-200 rounded-lg overflow-hidden" style={{background: '#fffbeb'}}>
                              <button className="w-full text-left p-4 flex items-center justify-between hover:bg-amber-50 transition-colors"
                                onClick={() => setUwExpandedDecl(uwExpandedDecl === idx ? null : idx)}>
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{background: '#d97706', minWidth: 32}}>
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">{(decl.Questions || '').replace(/\n/g, ' ').substring(0, 80)}{(decl.Questions || '').length > 80 ? '...' : ''}</p>
                                    <p className="text-xs text-amber-700 mt-1">Answer: {decl.Answer || 'Yes'}</p>
                                  </div>
                                </div>
                                <i className={`fas fa-chevron-${uwExpandedDecl === idx ? 'up' : 'down'} text-gray-400`}></i>
                              </button>
                              {uwExpandedDecl === idx && (
                                <div className="px-4 pb-4 border-t border-amber-200">
                                  <div className="mt-3 p-3 bg-white rounded-lg">
                                    <p className="text-xs font-semibold text-gray-600 mb-2">Full Question:</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{decl.Questions}</p>
                                    <p className="text-xs font-semibold text-gray-600 mt-3 mb-2">Detailed Response:</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{decl.Details}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Non-Medical Declarations */}
                    {uwNonMedDecls.length > 0 && (
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          <i className="fas fa-clipboard-list mr-2 text-blue-600"></i>Non-Medical Declarations ({uwNonMedDecls.length})
                        </h3>
                        <div className="space-y-3">
                          {uwNonMedDecls.map((decl, idx) => (
                            <div key={idx} className="border border-blue-200 rounded-lg p-4" style={{background: '#eff6ff'}}>
                              <p className="text-sm font-semibold text-gray-800">{(decl.Questions || '').replace(/\n/g, ' ')}</p>
                              <p className="text-xs text-blue-700 mt-1">Answer: {decl.Answer || 'Yes'}</p>
                              <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{decl.Details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: AI Follow-up Questions */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        <i className="fas fa-lightbulb mr-2 text-amber-500"></i>AI-Suggested Follow-up Questions
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">Context-aware questions generated from the medical analysis for the underwriter</p>
                      {uwQuestions.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No additional questions identified</p>
                      ) : (
                        <div className="space-y-4">
                          {uwQuestions.map((fq, idx) => {
                            const sevColors = { critical: {bg: '#fef2f2', border: '#dc2626', text: '#991b1b', badge: '#dc2626'},
                              high: {bg: '#fff7ed', border: '#ea580c', text: '#9a3412', badge: '#ea580c'},
                              medium: {bg: '#fefce8', border: '#ca8a04', text: '#854d0e', badge: '#ca8a04'} };
                            const sc = sevColors[fq.severity] || sevColors.medium;
                            return (
                              <div key={idx} className="rounded-lg p-4" style={{background: sc.bg, borderLeft: `4px solid ${sc.border}`}}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <i className={`fas ${fq.icon}`} style={{color: sc.border}}></i>
                                    <span className="text-sm font-semibold" style={{color: sc.text}}>{fq.category}</span>
                                  </div>
                                  <span className="text-xs px-2 py-1 rounded-full text-white font-medium" style={{background: sc.badge}}>
                                    {fq.severity}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2 italic">{fq.context}</p>
                                <ul className="space-y-1">
                                  {fq.items.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-start">
                                      <span className="text-xs mr-2 mt-1" style={{color: sc.border}}>&#9679;</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Collapsible Raw JSON */}
                {uwShowRaw && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4"><i className="fas fa-code mr-2 text-gray-600"></i>Raw API Response</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-auto" style={{maxHeight: 500}}>
                      <pre className="text-xs text-green-400 whitespace-pre-wrap">{JSON.stringify(uwResponseData, null, 2)}</pre>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (page === 'config') {
    return <ScoreConfigPage setPage={setPage} />;
  }

  if (page === 'telemer-config') {
    return <TeleMERConfigPage setPage={setPage} />;
  }

  if (page === 'demo') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 w-56">
                {/* Attributum Logo */}
                <div className="flex items-center space-x-2">
                  <img
                    src="/logos/attributum-logo.png"
                    alt="Attributum Logo"
                    className="w-50 h-20 rounded-lg object-contain"
                    style={{maxHeight: '56px', maxWidth: '180px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-50 h-20 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gray-800">PIVOT Insurance Automation Suite</h1>
                <p className="text-sm text-gray-600">Live Product Demos & Enterprise Sandbox</p>
              </div>

              <div className="flex items-center justify-end space-x-6 w-56">
                {/* PIVOT Logo */}
                <div className="flex items-center space-x-2">
                  <img
                    src="/logos/pivot-logo.png"
                    alt="PIVOT Logo"
                    className="w-40 h-20 rounded-lg object-contain"
                    style={{maxHeight: '56px', maxWidth: '160px', width: 'auto', height: 'auto', objectFit: 'contain'}}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-40 h-20 bg-purple-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
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
                <p className="text-xs text-gray-500 mt-1">AI-powered policy portability analysis</p>
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
            
            {/* Upload Form - compact inline bar matching TeleMER style */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <form onSubmit={handleFileUpload} className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-exchange-alt text-blue-600"></i>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden md:inline">Analyse Portability</span>
                </div>
                <div className="flex-1" style={{minWidth: 200}}>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('port-file-input')?.click()}>
                    <p className="text-sm text-gray-600">
                      {file ? (<span><i className="fas fa-file-pdf mr-1 text-red-500"></i>{file.name}</span>) :
                        (<span><i className="fas fa-cloud-upload-alt mr-1 text-gray-400"></i>Click to select file (PDF, JPG, PNG)</span>)}
                    </p>
                  </div>
                  <input id="port-file-input" type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
                <button type="submit" disabled={!file || loading || analysisCompleted}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm">
                  {loading ? (<span><i className="fas fa-spinner fa-spin mr-1"></i>Processing...</span>) :
                    (<span><i className="fas fa-search mr-1"></i>Analyse</span>)}
                </button>
              </form>
              {fileError && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600"><i className="fas fa-exclamation-circle mr-1"></i> {fileError}</p>
                </div>
              )}
              {analysisCompleted && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800"><i className="fas fa-info-circle mr-1"></i> You can now compare and analyse older policies below via Multi Year policy analysis.</p>
                </div>
              )}
            </div>

            {/* Placeholder when no results yet */}
            {!responseData && !loading && (
              <div className="text-center py-16">
                <i className="fas fa-exchange-alt text-6xl text-gray-200 mb-4"></i>
                <p className="text-gray-400 text-lg">Upload a policy document above to see the analysis</p>
                <p className="text-gray-300 text-sm mt-2">Choose file and click Analyse</p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="text-center py-16">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
                <p className="text-gray-500">Analysing your policy document...</p>
              </div>
            )}

            {/* Score Banner + Breakdown — full width */}
            {responseData && (() => {
              const pScore = scoreData?.score || 0;
              const pColor = pScore < 60 ? '#dc2626' : pScore < 80 ? '#ca8a04' : '#16a34a';
              const pLevel = pScore < 60 ? 'Needs Review' : pScore < 80 ? 'Review Recommended' : 'Good to Port';
              const pSettings = scoreData?.breakdown?.activeSettings;
              const pComponents = [
                { factor: 'Data Availability', points: scoreData?.breakdown?.dataAvailability?.points || 0, max: pSettings?.dataAvailability?.maxPoints || 30,
                  detail: `${scoreData?.breakdown?.dataAvailability?.availableFields?.length || 0} fields available`, icon: 'fa-database' },
                { factor: 'PED Declaration', points: scoreData?.breakdown?.pedDeclaration?.points || 0, max: pSettings?.pedDeclaration?.points || 15,
                  detail: scoreData?.breakdown?.pedDeclaration?.hasPED ? 'PED declared' : 'No PED', icon: 'fa-notes-medical' },
                { factor: 'Policy Currency', points: scoreData?.breakdown?.policyCurrency?.points || 0, max: pSettings?.policyCurrency?.points || 15,
                  detail: scoreData?.breakdown?.policyCurrency?.daysUntilExpiry !== null ? `${scoreData?.breakdown?.policyCurrency?.daysUntilExpiry} days to expiry` : 'No expiry date', icon: 'fa-calendar-check' },
                { factor: 'Continuity', points: scoreData?.breakdown?.continuityBonus?.points || 0, max: pSettings?.continuityBonus?.points || 20,
                  detail: scoreData?.breakdown?.continuityBonus?.hasContinuity ? 'Continuity data available' : 'No continuity data', icon: 'fa-link' },
                { factor: 'Sum Insured Risk', points: scoreData?.breakdown?.highSumInsuredRisk?.points || 0, max: pSettings?.highSumInsuredRisk?.points || 20,
                  detail: scoreData?.breakdown?.highSumInsuredRisk?.points > 0 ? 'Within limits' : 'Exceeds limits', icon: 'fa-shield-alt' }
              ];
              const pRingRadius = 37;
              const pCircumference = 2 * Math.PI * pRingRadius;
              const pOffset = pCircumference - (pScore / 100) * pCircumference;
              const policyNumber = responseData?.response?.data?.policy_and_coverage_details?.policy_number || 'N/A';
              const policyType = responseData?.response?.data?.policy_and_coverage_details?.policy_type || 'N/A';
              const sumInsured = responseData?.response?.data?.policy_and_coverage_details?.floater_basic_sum_insured || 'N/A';
              const insuredCount = responseData?.response?.data?.insured_details?.length || 0;
              const hasPED = scoreData?.breakdown?.pedDeclaration?.hasPED;

              return (
              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-6" style={{borderLeft: `6px solid ${pColor}`}}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div style={{position: 'relative', width: 90, height: 90}}>
                        <svg width="90" height="90" style={{transform: 'rotate(-90deg)'}}>
                          <circle cx="45" cy="45" r={pRingRadius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
                          <circle cx="45" cy="45" r={pRingRadius} fill="none" stroke={pColor} strokeWidth="6"
                            strokeDasharray={pCircumference} strokeDashoffset={pOffset} strokeLinecap="round"
                            style={{transition: 'stroke-dashoffset 1s ease'}} />
                        </svg>
                        <div style={{position: 'absolute', top: 0, left: 0, width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span style={{fontSize: '22px', fontWeight: 700, color: pColor}}>{pScore}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">PIVOT Portability Score</p>
                        <p className="text-xl font-bold" style={{color: pColor}}>{pLevel}</p>
                        <p className="text-xs text-gray-400">Policy: {policyNumber}</p>
                      </div>
                    </div>
                    <div className="flex space-x-6">
                      <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="text-sm font-bold text-gray-800">{policyType}</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Sum Insured</p>
                        <p className="text-sm font-bold text-gray-800">{sumInsured}</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Members</p>
                        <p className="text-lg font-bold text-gray-800">{insuredCount}</p>
                      </div>
                      <div className="text-center px-4 py-2 rounded-lg" style={{background: hasPED ? '#fef2f2' : '#f0fdf4'}}>
                        <p className="text-xs text-gray-500">PED</p>
                        <p className="text-sm font-bold" style={{color: hasPED ? '#dc2626' : '#16a34a'}}>{hasPED ? 'Declared' : 'None'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1" style={{height: 8, borderRadius: 4, overflow: 'hidden', background: '#e5e7eb'}}>
                      {pComponents.map((b, i) => (
                        <div key={i} style={{width: `${b.max}%`, height: '100%', background: b.points > 0 ? pColor : 'transparent', opacity: b.max > 0 ? 0.3 + (b.points / b.max) * 0.7 : 0.3, borderRadius: 2}} title={`${b.factor}: ${b.points}/${b.max}`}></div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      {pComponents.map((b, i) => (
                        <span key={i} title={b.detail}><i className={`fas ${b.icon} mr-1`}></i>{b.factor}: {b.points}/{b.max}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed Score Breakdown — collapsible */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <details className="group">
                    <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                      <span><i className="fas fa-chart-bar mr-2 text-purple-600"></i>Detailed Score Breakdown</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">Final Score = {pComponents.map(c => c.points).join(' + ')} = {pScore}</span>
                        <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                      </div>
                    </summary>
                    <div className="px-4 py-3 border-t border-gray-200 space-y-3">
                      {pComponents.map((b, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600"><i className={`fas ${b.icon} mr-2`}></i>{b.factor}</span>
                            <span className="font-semibold text-gray-800">{b.points} / {b.max}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full" style={{height: 6}}>
                            <div className="rounded-full" style={{width: `${b.max > 0 ? (b.points / b.max) * 100 : 0}%`, height: 6, background: pColor, transition: 'width 0.8s ease'}}></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{b.detail}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
              );
            })()}

            {/* Two-column: Policy Summary + Underwriter Flags */}
            {responseData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4"><i className="fas fa-file-alt mr-2 text-blue-600"></i>Policy Summary</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Policy Overview</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurer Name:</span>
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.policy_and_coverage_details?.optional_coverage_5 || 'Not Available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy Type:</span>
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.policy_and_coverage_details?.policy_type || 'Not Available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy Period:</span>
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.policy_and_coverage_details?.policy_start_date || 'Missing'} → {responseData?.response?.data?.policy_and_coverage_details?.policy_end_date || 'Missing'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product:</span>
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.policy_and_coverage_details?.policy_product_name || 'Not Available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy Number:</span>
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.policy_and_coverage_details?.policy_number || 'Missing'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Coverage Snapshot</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Floater Sum Insured:</span>
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.policy_and_coverage_details?.floater_basic_sum_insured || 'Missing'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Floater Cumulative Bonus:</span>
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.policy_and_coverage_details?.floater_cumulative_bonus || 'Not Available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">No. of Members:</span>
                        <span className="font-medium" style={dataBlue}>
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
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.policy_and_coverage_details?.floater_cumulative_bonus || 'Not Available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PED Declaration:</span>
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.insured_details?.[0]?.declared_ped || 'Not Available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Previous Claims:</span>
                        <span className="font-medium" style={dataBlue}>
                          {responseData?.response?.data?.policy_and_coverage_details?.previous_claims || 'Not Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4"><i className="fas fa-flag mr-2 text-amber-500"></i>Underwriter Flags</h3>
                <div className="text-sm space-y-2">
                  {(() => {
                    const settings = scoreData?.breakdown?.activeSettings;
                    const rd = scoreData?.responseData;
                    const flags = [];
                    if (!rd?.policy_and_coverage_details?.policy_number) flags.push({ name: 'Policy Number', status: 'Missing', type: 'critical' });
                    if (!rd?.policy_and_coverage_details?.policy_start_date) flags.push({ name: 'Policy Start Date', status: 'Missing', type: 'critical' });
                    if (!rd?.policy_and_coverage_details?.policy_end_date) flags.push({ name: 'Policy End Date', status: 'Missing', type: 'critical' });
                    if (!rd?.insured_details || rd.insured_details.length === 0) flags.push({ name: 'Insured Details', status: 'Missing', type: 'critical' });
                    if (scoreData?.breakdown?.pedDeclaration?.hasPED) flags.push({ name: 'PED Declaration', status: 'Declared', type: 'risk' });
                    if (!scoreData?.breakdown?.continuityBonus?.hasContinuity) flags.push({ name: 'Policy Continuity', status: 'Missing', type: 'continuity' });
                    if (!scoreData?.breakdown?.highSumInsuredRisk?.individualCondition) flags.push({ name: 'Individual Sum Insured', status: `Exceeds ₹${(settings?.highSumInsuredRisk?.individualLimit || 500000).toLocaleString()}`, type: 'risk' });
                    if (!scoreData?.breakdown?.highSumInsuredRisk?.floaterCondition) flags.push({ name: 'Floater Sum Insured', status: `Exceeds ₹${(settings?.highSumInsuredRisk?.floaterLimit || 1000000).toLocaleString()}`, type: 'risk' });
                    if (scoreData?.breakdown?.policyCurrency?.points === 0) flags.push({ name: 'Policy Currency', status: `Expires outside ${settings?.policyCurrency?.defaultDays || 30} days`, type: 'currency' });

                    if (flags.length === 0) {
                      return (
                        <div className="text-center py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            All criteria favorable for portability
                          </span>
                        </div>
                      );
                    }
                    return flags.map((flag, index) => (
                      <div key={index} className={`border rounded-lg p-3 ${
                        flag.type === 'critical' ? 'border-red-200 bg-red-50' :
                        flag.type === 'risk' ? 'border-amber-200 bg-amber-50' :
                        'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${
                            flag.type === 'critical' ? 'text-red-800' :
                            flag.type === 'risk' ? 'text-amber-800' :
                            'text-gray-800'
                          }`}>{flag.name}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            flag.type === 'critical' ? 'bg-red-100 text-red-800' :
                            flag.type === 'risk' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{flag.status}</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
            )}

            {/* Insured Snapshot — full width table */}
            {responseData && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4"><i className="fas fa-users mr-2 text-green-600"></i>Insured Snapshot</h3>
              <div className="text-xs overflow-x-auto">
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
                        <td className="py-1 px-1 font-medium" style={dataBlue}>{insured?.insured_name || 'Missing'}</td>
                        <td className="py-1 px-1" style={dataBlue}>{insured?.relationship || 'Not Available'}</td>
                        <td className="py-1 px-1" style={dataBlue}>{insured?.gender || 'Not Available'}</td>
                        <td className="py-1 px-1" style={dataBlue}>{insured?.age || (insured?.dob ? new Date().getFullYear() - new Date(insured.dob).getFullYear() : 'Missing')}</td>
                        <td className="py-1 px-1" style={dataBlue}>{insured?.declared_ped || 'Not Declared'}</td>
                        <td className="py-1 px-1" style={dataBlue}>{insured?.first_policy_started || 'Not Available'}</td>
                        <td className="py-1 px-1" style={dataBlue}>{insured?.individual_policy_sum_insured || 'Not Available'}</td>
                        <td className="py-1 px-1" style={dataBlue}>{insured?.individual_policy_cumulative_bonus || 'Not Available'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}

          </div>
        </div>

        {/* Multi-Year Policy Analysis */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-layer-group text-indigo-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Multi-Year Policy Analysis</h3>
                    <p className="text-xs text-gray-500">Compare policies across years to detect coverage changes, bonus shifts, and continuity gaps</p>
                  </div>
                </div>
                {!multiYearUploadVisible && (
                  <button
                    disabled={!responseData}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                    onClick={() => { if (responseData) setMultiYearUploadVisible(true); }}
                  >
                    <i className="fas fa-play mr-1"></i> Start Analysis
                  </button>
                )}
              </div>
              
              {/* Multi-Year Policy Upload Section */}
              {multiYearUploadVisible && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Compact upload bar matching main upload style */}
                  <div className="flex items-center gap-4 flex-wrap mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-history text-indigo-600 text-sm"></i>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Add Prior Year</span>
                    </div>
                    <div className="flex-1" style={{minWidth: 200}}>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('multiyear-file-input')?.click()}>
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-cloud-upload-alt mr-1 text-gray-400"></i>Click to select previous year policy (PDF, JPG, PNG)
                        </p>
                      </div>
                      <input id="multiyear-file-input" type="file" onChange={handlePreviousPolicyUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Upload policies from earlier years one by one for comparison.</p>

                  {/* Uploaded Files List */}
                  {previousPolicies.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-gray-600 uppercase mb-2">Uploaded Policies</h5>
                      <div className="space-y-2">
                        {previousPolicies.map((policy, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                policy.processed ? 'bg-green-500' :
                                policy.error ? 'bg-red-500' : 'bg-yellow-500'
                              }`}></span>
                              <span className="text-sm text-gray-700">{policy.name}</span>
                              <span className="text-xs text-gray-400 ml-2">({policy.size ? (policy.size / 1024 / 1024).toFixed(2) : '0.00'} MB)</span>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              policy.processed ? 'bg-green-100 text-green-700' :
                              policy.error ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {policy.processed ? 'Processed' :
                               policy.error ? 'Failed' : 'Processing...'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Policy Timeline Display */}
                  {(responseData || previousPolicies.length > 0) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h5 className="text-sm font-semibold text-gray-800 mb-3"><i className="fas fa-clock mr-2 text-indigo-500"></i>Policy Timeline</h5>
                      
                      {/* Processed Policies Display */}
                      {(() => {
                        const processedPolicies = processPolicies(responseData, previousPolicies);
                        
                        return (
                          <div className="space-y-3">
                            {processedPolicies.map((policy, index) => (
                              <div 
                                key={index}
                                className={`border rounded-lg p-4 ${
                                  policy.label === 'Most Recent Policy' 
                                    ? 'border-blue-300 bg-blue-50' 
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                {/* Policy Header */}
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      policy.label === 'Most Recent Policy'
                                        ? 'bg-blue-100 text-blue-800'
                                        : policy.label === 'Date Incomplete'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {policy.label}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-600">
                                      {policy.file.name}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Coverage Information */}
                                {policy.hasValidDates ? (
                                  <div className="text-sm text-gray-700">
                                    <div className="mb-1">
                                      <span className="font-medium" style={dataBlue}>Coverage: </span>
                                      {policy.startDate} → {policy.endDate}
                                    </div>
                                    {policy.duration && policy.duration.totalMonths > 12 && (
                                      <div className="text-xs text-gray-500">
                                        ({formatDuration(policy.duration)})
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-sm text-red-600">
                                    Policy dates incomplete - cannot determine coverage period
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                      
                      {/* Timeline Strip */}
                      {(() => {
                        // Use single sortedPolicies[] source of truth from processPolicies
                        const sortedPolicies = processPolicies(responseData, previousPolicies);
                        const policiesWithDates = sortedPolicies.filter(p => p.hasValidDates);
                        
                        if (policiesWithDates.length === 0) return null;
                        
                        // Find earliest and latest dates for timeline scale
                        const allDates = policiesWithDates.flatMap(p => [
                          parseDate(p.startDate),
                          parseDate(p.endDate)
                        ]).filter(d => d !== null);
                        
                        if (allDates.length === 0) return null;
                        
                        const minDate = new Date(Math.min(...allDates));
                        const maxDate = new Date(Math.max(...allDates));
                        const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                            <h6 className="text-xs font-semibold text-gray-600 mb-3"><i className="fas fa-project-diagram mr-1 text-indigo-400"></i>Coverage Timeline</h6>
                            <div className="relative">
                              {/* Timeline Base */}
                              <div className="h-2 bg-gray-300 rounded-full"></div>
                              
                              {/* Policy Bars - Use single sortedPolicies[] order (oldest to newest) */}
                              {policiesWithDates.map((policy, index) => {
                                const startOffset = Math.ceil((parseDate(policy.startDate) - minDate) / (1000 * 60 * 60 * 24));
                                const duration = Math.ceil((parseDate(policy.endDate) - parseDate(policy.startDate)) / (1000 * 60 * 60 * 24));
                                const leftPercent = (startOffset / totalDays) * 100;
                                const widthPercent = (duration / totalDays) * 100;
                                
                                return (
                                  <div
                                    key={index}
                                    className={`absolute h-2 rounded-full top-0 ${
                                      policy.label === 'Most Recent Policy'
                                        ? 'bg-blue-500'
                                        : 'bg-gray-500'
                                    }`}
                                    style={{
                                      left: `${leftPercent}%`,
                                      width: `${widthPercent}%`
                                    }}
                                    title={`${policy.file.name}: ${policy.startDate} → ${policy.endDate}`}
                                  />
                                );
                              })}
                              
                              {/* Timeline Labels */}
                              <div className="flex justify-between mt-3">
                                <span className="text-xs text-gray-500">
                                  {minDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {maxDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              
                              {/* Policy Labels - Use single sortedPolicies[] order */}
                              <div className="flex justify-between mt-1 mb-2">
                                {policiesWithDates.map((policy, index) => {
                                  const startOffset = Math.ceil((parseDate(policy.startDate) - minDate) / (1000 * 60 * 60 * 24));
                                  const leftPercent = (startOffset / totalDays) * 100;
                                  
                                  // Extract years from dates
                                  const startYear = parseDate(policy.startDate)?.getFullYear();
                                  const endYear = parseDate(policy.endDate)?.getFullYear();
                                  const yearDisplay = startYear && endYear ? `${startYear}–${endYear}` : 'No Dates';
                                  
                                  return (
                                    <div
                                      key={index}
                                      className={`absolute text-xs font-medium ${
                                        policy.label === 'Most Recent Policy'
                                          ? 'text-blue-700'
                                          : 'text-gray-600'
                                      }`}
                                      style={{
                                        left: `${leftPercent}%`,
                                        transform: 'translateX(-50%)',
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      <div className="text-center">
                                        <div>{yearDisplay}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          {policy.label === 'Most Recent Policy' ? 'Most Recent' : `Year-${policiesWithDates.length - 1 - index}`}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      
                      {/* Multi-Year Policy Comparison */}
                      {(() => {
                        const processedPolicies = processPolicies(responseData, previousPolicies);
                        const { comparisons, insights } = comparePolicies(processedPolicies);
                        
                        // Only show comparison if we have at least 2 policies with valid data
                        
                        // Use single sortedPolicies[] source of truth from processPolicies
                        
                        // Show all processed policies - never discard extracted policies
                        const policiesForDisplay = processedPolicies.filter(p => p.processed);
                        
                        // Log each policy's status
                        processedPolicies.forEach((policy, index) => {
                          console.log(`Policy ${index}:`, {
                            label: policy.label,
                            hasData: !!policy.data,
                            processed: policy.processed,
                            hasValidDates: policy.hasValidDates,
                            willShow: policy.processed // All processed policies show
                          });
                        });
                        
                        // At least 2 valid policies must trigger comparison
                        // Valid policies = processed policies with data and valid dates
                        const policiesWithValidData = processedPolicies.filter(p => p.processed && p.data && p.hasValidDates);
                        
                        // Show comparison if we have at least 2 valid policies, but display all processed policies
                        const shouldShowComparison = policiesWithValidData.length >= 2;
                        
                        
                        if (!shouldShowComparison) return null;
                        
                        return (
                          <div className="mt-8">
                            <h5 className="text-sm font-semibold text-gray-800 mb-4"><i className="fas fa-columns mr-2 text-indigo-500"></i>Multi-Year Policy Comparison</h5>
                            
                            {/* Comparison Table */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                    <th className="text-left p-3 font-medium text-gray-700">Parameter</th>
                                    {policiesForDisplay.map((policy, index) => (
                                      <th key={index} className="text-left p-3 font-medium text-gray-700">
                                        {policy.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {/* Policy Timeline */}
                                  <tr>
                                    <td className="p-3 font-medium text-gray-600">Policy Period</td>
                                    {policiesForDisplay.map((policy, index) => (
                                      <td key={index} className="p-3" style={dataBlue}>
                                        {policy.startDate && policy.endDate ? `${policy.startDate} → ${policy.endDate}` : 'Date Incomplete'}
                                      </td>
                                    ))}
                                  </tr>
                                  
                                  {/* Individual Sum Insured */}
                                  <tr>
                                    <td className="p-3 font-medium text-gray-600">Sum Insured</td>
                                    {policiesForDisplay.map((policy, index) => {
                                      const params = extractComparableParameters(policy.data);
                                      const isFloater = params.is_floater;
                                      
                                      return (
                                        <td key={index} className="p-3" style={dataBlue}>
                                          {isFloater ? (
                                            // Floater: Show "Floater Policy" (no individual SI in main table)
                                            <span className="text-gray-500 italic">Floater Policy</span>
                                          ) : (
                                            // Individual: Show "Member-level" (SI shown in member details)
                                            <span className="text-gray-500 italic">Member-level</span>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                  
                                  {/* Cumulative Bonus */}
                                  <tr>
                                    <td className="p-3 font-medium text-gray-600">Cumulative Bonus</td>
                                    {policiesForDisplay.map((policy, index) => {
                                      const params = extractComparableParameters(policy.data);
                                      const currentValue = params.cumulative_bonus; // For comparison logic
                                      const originalValue = params.original_cumulative_bonus; // For display
                                      const previousValue = index > 0 ? extractComparableParameters(policiesForDisplay[index - 1].data).cumulative_bonus : null;
                                      const hasChange = previousValue && currentValue !== previousValue;
                                      const isReset = hasChange && currentValue < previousValue;
                                      const isFloater = params.is_floater;
                                      
                                      return (
                                        <td key={index} className={`p-3 ${isReset ? 'bg-red-50 font-medium' : hasChange ? 'bg-yellow-50 font-medium' : 'text-gray-900'}`}>
                                          {isFloater ? (
                                            // Floater: Show original formatted value
                                            originalValue !== null && originalValue !== undefined ? 
                                              originalValue : 
                                              'Not specified'
                                          ) : (
                                            // Individual: Show "Member level"
                                            <span className="text-gray-500 italic">Member level</span>
                                          )}
                                          {isReset && isFloater && (
                                            <div className="text-xs text-red-600 mt-1">
                                              Reset (possible claim)
                                            </div>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                  
                                  {/* Members Count */}
                                  <tr>
                                    <td className="p-3 font-medium text-gray-600">Members Count</td>
                                    {policiesForDisplay.map((policy, index) => {
                                      const params = extractComparableParameters(policy.data);
                                      const memberCount = params.member_count || 0;
                                      const previousCount = index > 0 ? extractComparableParameters(policiesForDisplay[index - 1].data).member_count || 0 : 0;
                                      const hasChange = previousCount && memberCount !== previousCount;
                                      
                                      return (
                                        <td key={index} className={`p-3 ${hasChange ? 'bg-yellow-50 font-medium' : 'text-gray-900'}`}>
                                          {memberCount} member{memberCount !== 1 ? 's' : ''}
                                          {hasChange && (
                                            <div className="text-xs text-blue-600 mt-1">
                                              {memberCount > previousCount ? `+${memberCount - previousCount} added` : `-${previousCount - memberCount} removed`}
                                            </div>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                  
                                  {/* Policy Type */}
                                  <tr>
                                    <td className="p-3 font-medium text-gray-600">Policy Type</td>
                                    {policiesForDisplay.map((policy, index) => {
                                      const params = extractComparableParameters(policy.data);
                                      return (
                                        <td key={index} className="p-3" style={dataBlue}>
                                          {params.policy_type || 'Not specified'}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                  
                                  {/* Proposer Name */}
                                  <tr>
                                    <td className="p-3 font-medium text-gray-600">Proposer Name</td>
                                    {policiesForDisplay.map((policy, index) => {
                                      const params = extractComparableParameters(policy.data);
                                      const proposerName = params.proposer_name;
                                      
                                      // Check if proposer differs across policies
                                      const allProposerNames = policiesForDisplay.map(p => 
                                        extractComparableParameters(p.data).proposer_name
                                      );
                                      const uniqueProposers = [...new Set(allProposerNames)];
                                      const proposerDiffers = uniqueProposers.length > 1;
                                      
                                      return (
                                        <td key={index} className="p-3" style={dataBlue}>
                                          <div className="flex items-center space-x-2">
                                            <span>{proposerName}</span>
                                            {proposerDiffers && (
                                              <div className="group relative">
                                                <svg
                                                  className="w-4 h-4 text-amber-500 cursor-help"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                  Proposer differs across policies
                                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                  
                                  {/* Individual Member Details (for individual policies) */}
                                  {(() => {
                                    const hasIndividualPolicies = policiesForDisplay.some(policy => {
                                      const params = extractComparableParameters(policy.data);
                                      return !params.is_floater && params.members.length > 0;
                                    });
                                    
                                    if (!hasIndividualPolicies) return null;
                                    
                                    return (
                                      <tr>
                                        <td className="p-3 font-medium text-gray-600">Member Details</td>
                                        {policiesForDisplay.map((policy, index) => {
                                          const params = extractComparableParameters(policy.data);
                                          const isFloater = params.is_floater;
                                          
                                          if (isFloater) {
                                            return (
                                              <td key={index} className="p-3 text-gray-500 italic">
                                                Floater Policy
                                              </td>
                                            );
                                          }
                                          
                                          // Individual policy - show member details
                                          return (
                                            <td key={index} className="p-3" style={dataBlue}>
                                              <div className="text-xs space-y-1">
                                                {params.members.map((member, memberIndex) => (
                                                  <div key={memberIndex} className="border-b border-gray-100 pb-1">
                                                    <div className="font-medium" style={dataBlue}>{member.name}</div>
                                                    <div className="text-gray-600">
                                                      SI: {params.is_floater ? 
                                                            'Not applicable (Floater Policy)' : 
                                                            member.original_individual_sum_insured || 'Not specified'
                                                          }
                                                    </div>
                                                    <div className="text-gray-600">
                                                      CB: {params.is_floater ? 
                                                            'Not applicable (Floater Policy)' : 
                                                            member.original_individual_cumulative_bonus || 'Not specified'
                                                          }
                                                    </div>
                                                    <div className="text-gray-600">
                                                      PED: {member.declared_ped || 'Not declared'}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })()}
                                </tbody>
                              </table>
                            </div>
                            
                            {/* Member-wise Comparison Section */}
                            <div className="mt-8">
                              <h6 className="text-sm font-semibold text-gray-800 mb-4"><i className="fas fa-users mr-2 text-indigo-500"></i>Member-wise Comparison</h6>
                              
                              <div className="space-y-4">
                                {policiesForDisplay.map((policy, policyIndex) => {
                                  const params = extractComparableParameters(policy.data);
                                  const isExpanded = expandedMembers[policyIndex];
                                  const hasMembers = params.members && params.members.length > 0;
                                  
                                  if (!hasMembers) {
                                    return (
                                      <div key={policyIndex} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                          <h6 className="text-sm font-medium text-gray-700">{policy.label}</h6>
                                          <span className="text-xs text-gray-500 italic">No member data available</span>
                                        </div>
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <div key={policyIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                      {/* Expandable Header */}
                                      <button
                                        onClick={() => toggleMembersExpansion(policyIndex)}
                                        className="w-full px-4 py-6 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                                      >
                                        <h6 className="text-sm font-medium text-gray-700">{policy.label}</h6>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs text-gray-500">
                                            {params.members.length} member{params.members.length !== 1 ? 's' : ''}
                                          </span>
                                          <svg
                                            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </button>
                                      
                                      {/* Expandable Content */}
                                      {isExpanded && (
                                        <div className="border-t border-gray-200">
                                          <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                              <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                  <th className="text-left p-3 font-medium text-gray-700">Insured Name</th>
                                                  <th className="text-left p-3 font-medium text-gray-700">Relationship</th>
                                                  <th className="text-left p-3 font-medium text-gray-700">DOB (Age)</th>
                                                  <th className="text-left p-3 font-medium text-gray-700">Individual Sum Insured</th>
                                                  <th className="text-left p-3 font-medium text-gray-700">PED Declaration</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-gray-200">
                                                {params.members.map((member, memberIndex) => {
                                                  const pedStatus = member.declared_ped;
                                                  let pedDisplay = 'Not Available';
                                                  
                                                  if (pedStatus === 'None' || pedStatus === 'No PED Declared' || pedStatus === null) {
                                                    pedDisplay = 'No';
                                                  } else if (pedStatus && pedStatus !== 'None' && pedStatus !== 'No PED Declared') {
                                                    pedDisplay = 'Yes';
                                                  }
                                                  
                                                  return (
                                                    <tr key={memberIndex}>
                                                      <td className="p-3 text-gray-900 font-medium">{member.name}</td>
                                                      <td className="p-3" style={dataBlue}>{member.relationship || 'Not specified'}</td>
                                                      <td className="p-3" style={dataBlue}>
                                                        {member.date_of_birth && member.age ? 
                                                          `${member.date_of_birth} (${member.age} years)` : 
                                                          member.date_of_birth ? `${member.date_of_birth} (Age not available)` :
                                                          member.age ? `DOB not available (${member.age} years)` :
                                                          'Not specified'
                                                        }
                                                      </td>
                                                      <td className="p-3" style={dataBlue}>
                                                        {params.is_floater ? 
                                                          'Not applicable (Floater Policy)' : 
                                                          member.original_individual_sum_insured ? 
                                                            member.original_individual_sum_insured : 
                                                            'Not specified'
                                                        }
                                                      </td>
                                                      <td className="p-3">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                          pedDisplay === 'Yes' ? 'bg-red-100 text-red-800' :
                                                          pedDisplay === 'No' ? 'bg-green-100 text-green-800' :
                                                          'bg-gray-100 text-gray-800'
                                                        }`}>
                                                          {pedDisplay}
                                                        </span>
                                                      </td>
                                                    </tr>
                                                  );
                                                })}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Underwriting Insights */}
                            {insights.length > 0 && (
                              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h6 className="text-sm font-semibold text-blue-900 mb-3"><i className="fas fa-lightbulb mr-2 text-blue-500"></i>Underwriting Insights</h6>
                                <ul className="text-sm text-blue-800 space-y-2">
                                  {insights.map((insight, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                      {insight}
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                  <p className="text-xs text-blue-600 italic">Showing key underwriting-relevant changes across years</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
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
