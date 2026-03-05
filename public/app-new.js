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
        throw new Error('HTTP error! status: ' + response.status);
      }
      const data = await response.json();
      setUwResponseData(data);
    } catch (err) {
      console.error('TeleMER Error:', err);
      alert('Upload failed: ' + err.message);
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
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 w-56">
                <div className="flex items-center space-x-2">
                  <img src="/logos/attributum-logo.png" alt="Attributum Logo" className="w-50 h-20 rounded-lg object-contain"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
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
                <div className="flex items-center space-x-2">
                  <img src="/logos/pivot-logo.png" alt="PIVOT Logo" className="w-40 h-20 rounded-lg object-contain"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
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
                <h1 className="text-3xl font-bold text-gray-800">PIVOT Underwriting CoPilot (TeleMER)</h1>
                <p className="text-xs text-gray-500 mt-1">AI-assisted underwriting with automated risk assessment</p>
              </div>
              <div className="space-x-4">
                <button onClick={() => { setPage('home'); setUwResponseData(null); setUwFile(null); }}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">
                  ← Back to Home
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Upload Medical Document for Underwriting Analysis</h2>
                  <form onSubmit={handleUwUpload}>
                    <div>
                      <input type="file" onChange={handleUwFileChange} className="w-full p-2 border rounded" accept=".pdf,.jpg,.jpeg,.png" />
                      <p className="text-xs text-gray-500 mt-3 mb-4">Supported formats: PDF, JPG, JPEG, PNG</p>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
                      <select
                        value={uwCompany}
                        onChange={(e) => setUwCompany(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="telemer_hdfcergo">HDFC Ergo</option>
                        <option value="telemer_starhealth">Star Health</option>
                        <option value="telemer_icicilombard">ICICI Lombard</option>
                        <option value="telemer_bajajallianz">Bajaj Allianz</option>
                        <option value="telemer_maxbupa">Max Bupa / Niva</option>
                        <option value="telemer_carehealth">Care Health</option>
                      </select>
                    </div>
                      {uwFileError && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-600">{uwFileError}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button type="submit" disabled={!uwFile || uwLoading}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex-1">
                        {uwLoading ? 'Analysing...' : 'Analyse Document'}
                      </button>
                    </div>
                  </form>
                </div>

                {uwResponseData && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Underwriting Analysis Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Proposer Details</h4>
                        <div className="text-sm space-y-2">
                          {uwResponseData?.response?.data?.proposer_details && Object.entries(uwResponseData.response.data.proposer_details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium">{String(value || 'Not Available')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Policy & Coverage Details</h4>
                        <div className="text-sm space-y-2">
                          {uwResponseData?.response?.data?.policy_and_coverage_details && Object.entries(uwResponseData.response.data.policy_and_coverage_details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-right ml-4">{String(value || 'Not Available')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {uwResponseData?.response?.data?.insured_details && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-3">Insured Members</h4>
                          <div className="text-xs overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b bg-gray-50">
                                  <th className="text-left py-2 px-2 font-medium text-gray-700">Name</th>
                                  <th className="text-left py-2 px-2 font-medium text-gray-700">Relationship</th>
                                  <th className="text-left py-2 px-2 font-medium text-gray-700">Gender</th>
                                  <th className="text-left py-2 px-2 font-medium text-gray-700">DOB / Age</th>
                                  <th className="text-left py-2 px-2 font-medium text-gray-700">PED</th>
                                </tr>
                              </thead>
                              <tbody>
                                {uwResponseData.response.data.insured_details.map((insured, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="py-2 px-2 font-medium">{insured?.insured_name || 'N/A'}</td>
                                    <td className="py-2 px-2">{insured?.relationship || 'N/A'}</td>
                                    <td className="py-2 px-2">{insured?.gender || 'N/A'}</td>
                                    <td className="py-2 px-2">{insured?.dob || insured?.age || 'N/A'}</td>
                                    <td className="py-2 px-2">{insured?.declared_ped || 'None'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">TeleMER Raw Response</h3>
                  {!uwResponseData ? (
                    <div className="text-center py-12">
                      <i className="fas fa-clipboard-check text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500">Upload a medical document to see AI-powered underwriting analysis</p>
                      <p className="text-sm text-gray-400 mt-2">The system will extract and analyse medical information for underwriting decisions</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded p-4 overflow-auto max-h-screen">
                      <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(uwResponseData, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 w-56">
                {/* Attributum Logo */}
                <div className="flex items-center space-x-2">
                  <img 
                    src="/logos/attributum-logo.png" 
                    alt="Attributum Logo" 
                    className="w-50 h-20 rounded-lg object-contain"
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Upload Current / Most Recent Policy Document</h2>
                  <form onSubmit={handleFileUpload}>
                    <div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <p className="text-xs text-gray-500 mt-3 mb-4">Supported formats: PDF, JPG, JPEG, PNG</p>
                      {fileError && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-600">{fileError}</p>
                        </div>
                      )}
                    </div>
                    
                                        
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={!file || loading || analysisCompleted}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex-1"
                      >
                        {loading ? 'Processing...' : 'Analyse Policy'}
                      </button>
                      
                      {/* Multi-Year Analysis Info - Only show after analysis completed */}
                      {analysisCompleted && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                          You can now compare and analyse older policies of the same family / insured to identify coverage changes, sum insured movement, cumulative bonus shifts, and continuity gaps. Please click on Multi Year policy analysis below.
                        </div>
                      )}
                    </div>
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
                                    <td className="py-1 px-1 font-medium" style={dataBlue}>
                                      {insured?.insured_name || 'Missing'}
                                    </td>
                                    <td className="py-1 px-1" style={dataBlue}>
                                      {insured?.relationship || 'Not Available'}
                                    </td>
                                    <td className="py-1 px-1" style={dataBlue}>
                                      {insured?.gender || 'Not Available'}
                                    </td>
                                    <td className="py-1 px-1" style={dataBlue}>
                                      {insured?.age || (
                                        insured?.dob 
                                          ? new Date().getFullYear() - new Date(insured.dob).getFullYear()
                                          : 'Missing'
                                      )}
                                    </td>
                                    <td className="py-1 px-1" style={dataBlue}>
                                      {insured?.declared_ped || 'Not Declared'}
                                    </td>
                                    <td className="py-1 px-1" style={dataBlue}>
                                      {insured?.first_policy_started || 'Not Available'}
                                    </td>
                                    <td className="py-1 px-1" style={dataBlue}>
                                      {insured?.individual_policy_sum_insured || 'Not Available'}
                                    </td>
                                    <td className="py-1 px-1" style={dataBlue}>
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
                    <div className="text-sm space-y-2">
                      {(() => {
                        const settings = scoreData?.breakdown?.activeSettings;
                        const responseData = scoreData?.responseData;
                        const flags = [];
                        
                        // Critical Data Missing
                        if (!responseData?.policy_and_coverage_details?.policy_number) {
                          flags.push({
                            name: 'Policy Number',
                            status: 'Missing',
                            type: 'critical'
                          });
                        }
                        
                        if (!responseData?.policy_and_coverage_details?.policy_start_date) {
                          flags.push({
                            name: 'Policy Start Date', 
                            status: 'Missing',
                            type: 'critical'
                          });
                        }
                        
                        if (!responseData?.policy_and_coverage_details?.policy_end_date) {
                          flags.push({
                            name: 'Policy End Date',
                            status: 'Missing', 
                            type: 'critical'
                          });
                        }
                        
                        if (!responseData?.insured_details || responseData.insured_details.length === 0) {
                          flags.push({
                            name: 'Insured Details',
                            status: 'Missing',
                            type: 'critical'
                          });
                        }
                        
                        // PED Declaration (Risk Factor)
                        if (scoreData?.breakdown?.pedDeclaration?.hasPED) {
                          flags.push({
                            name: 'PED Declaration',
                            status: 'Declared',
                            type: 'risk'
                          });
                        }
                        
                        // Policy Continuity Missing
                        if (!scoreData?.breakdown?.continuityBonus?.hasContinuity) {
                          flags.push({
                            name: 'Policy Continuity',
                            status: 'Missing',
                            type: 'continuity'
                          });
                        }
                        
                        // Sum Insured Risk
                        if (!scoreData?.breakdown?.highSumInsuredRisk?.individualCondition) {
                          flags.push({
                            name: 'Individual Sum Insured',
                            status: `Exceeds ₹${(settings?.highSumInsuredRisk?.individualLimit || 500000).toLocaleString()}`,
                            type: 'risk'
                          });
                        }
                        
                        if (!scoreData?.breakdown?.highSumInsuredRisk?.floaterCondition) {
                          flags.push({
                            name: 'Floater Sum Insured',
                            status: `Exceeds ₹${(settings?.highSumInsuredRisk?.floaterLimit || 1000000).toLocaleString()}`,
                            type: 'risk'
                          });
                        }
                        
                        // Policy Currency Issue
                        if (scoreData?.breakdown?.policyCurrency?.points === 0) {
                          flags.push({
                            name: 'Policy Currency',
                            status: `Expires outside ${settings?.policyCurrency?.defaultDays || 30} days`,
                            type: 'currency'
                          });
                        }
                        
                        if (flags.length === 0) {
                          return (
                            <div className="text-center py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                ✓ All criteria favorable for portability
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
                              }`}>
                                {flag.name}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                flag.type === 'critical' ? 'bg-red-100 text-red-800' :
                                flag.type === 'risk' ? 'bg-amber-100 text-amber-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {flag.status}
                              </span>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Multi-Year Policy Analysis Placeholder */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Multi-Year Policy Analysis</h3>
              <p className="text-sm text-gray-600 mb-6">
                Compare this policy against prior years to detect coverage changes, sum insured movement, cumulative bonus shifts, and continuity gaps.
              </p>
              
              <button
                disabled={!responseData}
                className={`px-4 py-2 rounded mb-3 ${
                  responseData 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                onClick={() => {
                  if (responseData) {
                    // Show inline info banner
                    const banner = document.getElementById('multiyear-info-banner');
                    if (banner) {
                      banner.style.display = 'block';
                      setTimeout(() => {
                        banner.style.display = 'none';
                      }, 5000);
                    }
                    // Show multi-year upload section
                    setMultiYearUploadVisible(true);
                  }
                }}
              >
                Start Multi-Year Policy Analysis
              </button>
              
              {/* Inline Info Banner */}
              <div 
                id="multiyear-info-banner" 
                className="hidden bg-blue-50 border border-blue-200 rounded p-3 mb-3"
              >
                <p className="text-sm text-blue-800">
                  Multi-year policy upload will be enabled next. Current policy is saved as the reference year.
                </p>
              </div>
              
              {/* Multi-Year Policy Upload Section */}
              {multiYearUploadVisible && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Multi-Year Policy Upload</h4>
                  <p className="text-sm text-gray-600 mb-4">Upload prior-year policy documents for comparison</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="mb-3">
                      <label className="block text-gray-700 mb-2">Upload Previous Policy (Older Year)</label>
                      <input
                        type="file"
                        onChange={handlePreviousPolicyUpload}
                        className="w-full p-2 border border-gray-300 rounded bg-white"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, JPEG, PNG</p>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-3">You may upload policies from earlier years one by one.</p>
                    
                    {/* Uploaded Files List */}
                    {previousPolicies.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Uploaded Previous Policies:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {previousPolicies.map((policy, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                  policy.processed ? 'bg-green-500' : 
                                  policy.error ? 'bg-red-500' : 'bg-yellow-500'
                                }`}></span>
                                {policy.name} ({policy.size ? (policy.size / 1024 / 1024).toFixed(2) : '0.00'} MB)
                              </div>
                              <span className={`text-xs ${
                                policy.processed ? 'text-green-600' : 
                                policy.error ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                                {policy.processed ? 'Processed' : 
                                 policy.error ? 'Failed' : 'Processing...'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Policy Timeline Display */}
                  {(responseData || previousPolicies.length > 0) && (
                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Policy Timeline</h5>
                      
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
                            <h6 className="text-xs font-medium text-gray-600 mb-3">Coverage Timeline</h6>
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
                            <h5 className="text-sm font-medium text-gray-700 mb-4">Multi-Year Policy Comparison</h5>
                            
                            {/* Comparison Table */}
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                              <h6 className="text-sm font-medium text-gray-700 mb-4">Member-wise Comparison</h6>
                              
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
                                <h6 className="text-sm font-medium text-blue-900 mb-3">Underwriting Insights</h6>
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
