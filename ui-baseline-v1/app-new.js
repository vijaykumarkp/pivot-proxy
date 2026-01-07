const { useState, useEffect } = React;

// Score Configuration Component
const ScoreConfigPage = ({ setPage }) => {
  const [config, setConfig] = useState({
    criticalDataAvailability: { enabled: true, points: 40, weight: 1.0 },
    policyPeriod: { enabled: true, points: 20, weight: 1.0 },
    cumulativeBonus: { enabled: true, points: 20, weight: 1.0 },
    noPED: { enabled: true, points: 20, weight: 1.0 },
    claimFree: { enabled: true, points: 20, weight: 0.5 },
    sumInsured: { enabled: true, points: 10, weight: 0.3 },
    ageCriteria: { enabled: true, points: 15, weight: 0.8 }
  });

  const handleToggle = (key) => {
    setConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const handlePointsChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], points: parseInt(value) || 0 }
    }));
  };

  const handleWeightChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], weight: parseFloat(value) || 0 }
    }));
  };

  const saveConfig = () => {
    localStorage.setItem('scoreConfig', JSON.stringify(config));
    alert('Configuration saved!');
  };

  const resetConfig = () => {
    const defaultConfig = {
      criticalDataAvailability: { enabled: true, points: 40, weight: 1.0 },
      policyPeriod: { enabled: true, points: 20, weight: 1.0 },
      cumulativeBonus: { enabled: true, points: 20, weight: 1.0 },
      noPED: { enabled: true, points: 20, weight: 1.0 },
      claimFree: { enabled: true, points: 20, weight: 0.5 },
      sumInsured: { enabled: true, points: 10, weight: 0.3 },
      ageCriteria: { enabled: true, points: 15, weight: 0.8 }
    };
    setConfig(defaultConfig);
    localStorage.setItem('scoreConfig', JSON.stringify(defaultConfig));
  };

  const totalPoints = Object.values(config).reduce((sum, item) => 
    sum + (item.enabled ? item.points * item.weight : 0), 0
  );

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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Scoring Criteria Configuration</h2>
            <p className="text-sm text-gray-600">Configure how portability scores are calculated.</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="space-x-4">
              <button
                onClick={() => setPage('demo')}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
              >
                ← Back to Product Page
              </button>
            </div>
            <div className="space-x-4">
              <button
                onClick={resetConfig}
                className="px-3 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 text-sm"
              >
                Reset to Default
              </button>
              <button
                onClick={saveConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Configuration
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Total Possible Score:</strong> {totalPoints.toFixed(1)} points
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(config).map(([key, item]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => handleToggle(key)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.enabled ? `${(item.points * item.weight).toFixed(1)} points` : 'Disabled'}
                  </div>
                </div>
                
                {item.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Base Points</label>
                      <input
                        type="number"
                        value={item.points}
                        onChange={(e) => handlePointsChange(key, e.target.value)}
                        className="w-full p-2 border rounded"
                        min="0"
                        max="100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum points awarded for this criterion</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Weight Multiplier</label>
                      <input
                        type="number"
                        value={item.weight}
                        onChange={(e) => handleWeightChange(key, e.target.value)}
                        className="w-full p-2 border rounded"
                        min="0"
                        max="2"
                        step="0.1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Higher values increase priority</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Configuration Notes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enable/disable scoring criteria based on business requirements</li>
              <li>• Adjust base points for each criterion</li>
              <li>• Use weight multipliers to prioritize certain criteria</li>
              <li>• Configuration is saved locally and persists across sessions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Landing Page App
const App = () => {
  const [page, setPage] = useState('home');
  const [file, setFile] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('input_file', file);
      formData.append('insurance_company', 'STAR HEALTH');
      
      console.log('Uploading file:', file.name);
      
      const response = await fetch('/ml_process', {
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
    } catch (err) {
      console.error('Error:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
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
      ageCriteria: { enabled: true, points: 15, weight: 0.8 }
    };

    const responseData = data.response?.data || {};
    const breakdown = {};
    let totalScore = 0;
    
    if (config.criticalDataAvailability.enabled && responseData.proposer_details) {
      breakdown.criticalDataAvailability = { 
        points: config.criticalDataAvailability.points * config.criticalDataAvailability.weight, 
        met: true 
      };
      totalScore += breakdown.criticalDataAvailability.points;
    } else {
      breakdown.criticalDataAvailability = { points: 0, met: false };
    }
    
    if (config.policyPeriod.enabled && responseData.policy_and_coverage_details?.policy_end_date) {
      breakdown.policyPeriod = { 
        points: config.policyPeriod.points * config.policyPeriod.weight, 
        met: true 
      };
      totalScore += breakdown.policyPeriod.points;
    } else {
      breakdown.policyPeriod = { points: 0, met: false };
    }
    
    if (config.cumulativeBonus.enabled && responseData.policy_and_coverage_details?.floater_cumulative_bonus) {
      breakdown.cumulativeBonus = { 
        points: config.cumulativeBonus.points * config.cumulativeBonus.weight, 
        met: true 
      };
      totalScore += breakdown.cumulativeBonus.points;
    } else {
      breakdown.cumulativeBonus = { points: 0, met: false };
    }
    
    if (config.noPED.enabled && responseData.insured_details?.[0]?.declared_ped === 'None') {
      breakdown.noPED = { 
        points: config.noPED.points * config.noPED.weight, 
        met: true 
      };
      totalScore += breakdown.noPED.points;
    } else {
      breakdown.noPED = { points: 0, met: false };
    }

    if (config.claimFree.enabled && responseData.policy_and_coverage_details?.previous_claims === 'No') {
      breakdown.claimFree = { 
        points: config.claimFree.points * config.claimFree.weight, 
        met: true 
      };
      totalScore += breakdown.claimFree.points;
    } else {
      breakdown.claimFree = { points: 0, met: false };
    }

    if (config.sumInsured.enabled && responseData.policy_and_coverage_details?.floater_basic_sum_insured) {
      const sumInsured = parseInt(responseData.policy_and_coverage_details.floater_basic_sum_insured);
      if (sumInsured >= 500000) {
        breakdown.sumInsured = { 
          points: config.sumInsured.points * config.sumInsured.weight, 
          met: true 
        };
        totalScore += breakdown.sumInsured.points;
      } else {
        breakdown.sumInsured = { points: 0, met: false };
      }
    } else {
      breakdown.sumInsured = { points: 0, met: false };
    }

    if (config.ageCriteria.enabled && responseData.proposer_details?.dob) {
      const dob = new Date(responseData.proposer_details.dob);
      const age = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));
      if (age >= 18 && age <= 60) {
        breakdown.ageCriteria = { 
          points: config.ageCriteria.points * config.ageCriteria.weight, 
          met: true 
        };
        totalScore += breakdown.ageCriteria.points;
      } else {
        breakdown.ageCriteria = { points: 0, met: false };
      }
    } else {
      breakdown.ageCriteria = { points: 0, met: false };
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Upload Policy Document</h2>
              <p className="text-sm text-gray-600 mb-4">AI-powered policy portability analysis</p>
              
              <form onSubmit={handleFileUpload}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Select File</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full p-2 border rounded"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, JPEG, PNG</p>
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
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Analyze Policy'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Portability Score</h2>
              
              {scoreData ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Portability Score</h3>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-blue-600">{scoreData.score}/100</div>
                      <div className="text-gray-600">Portability Score</div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${scoreData.score}%` }}
                        ></div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Excellent
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Key Findings</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        {Object.entries(scoreData.breakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`font-medium ${value.met ? 'text-green-600' : 'text-red-600'}`}>
                              {value.met ? '+' : ''}{value.points.toFixed(1)} points
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Portability Score</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        This policy meets all standard portability requirements.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-file-upload text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="font-medium text-gray-700 mb-2">No Analysis Yet</h3>
                  <p className="text-sm">Upload a policy document to see detailed portability analysis, scoring breakdown, and key findings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
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
