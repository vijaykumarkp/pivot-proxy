const { useState, useEffect } = React;

// PIVOT Automation Suite Products - Updated with sandbox metadata
const pivotProducts = [
  {
    id: 'pivot-portability',
    name: 'PIVOT Portability Module',
    description: 'AI-powered policy document analysis for seamless portability with automated data extraction and scoring.',
    icon: 'fa-exchange-alt',
    features: ['Document Upload', 'AI Extraction', 'Data Validation', 'Portability Scoring'],
    sandbox: [
      {
        method: 'POST',
        path: '/api/ml_process',
        label: 'Upload Policy Document',
        description: 'Upload insurance policy document for AI-powered data extraction and portability analysis.',
        apiEndpoint: 'https://PIVOT-Port-PolDoc-Health.Attributum.com/api/ml_process',
        requiresFile: true,
        fields: [
          { name: 'insurance_company', label: 'Insurance Company', type: 'text', required: true },
          { name: 'input_file', label: 'Policy Document', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' }
        ]
      }
    ]
  },
  {
    id: 'pivot-underwriting',
    name: 'PIVOT Underwriting CoPilot (TeleMER)',
    description:
      'AI-powered underwriting assistant that blends TeleMER data, medical rules, and risk scoring for faster onboarding.',
    icon: 'fa-user-md',
    features: ['AI Risk Assessment', 'TeleMER Technology', 'Decision Support', 'Real-time Analysis'],
    sandbox: [
      {
        method: 'POST',
        path: '/underwriting/assess',
        label: 'Run Risk Assessment',
        description: 'Submit TeleMER vitals and lifestyle data to receive an underwriting recommendation.',
        sampleRequest: {
          application_id: 'UW-10021',
          telemer_session: 'TEL-7788',
          applicant: {
            age: 34,
            gender: 'Female',
            smoker: false
          },
          vitals: {
            bp: '118/76',
            bmi: 22.4,
            pulse: 74
          },
          disclosures: ['thyroid_condition']
        },
        sampleResponse: {
          recommendation: 'Approve with Loading',
          loading_percent: 15,
          rationale: ['thyroid_condition', 'family_history_cvd'],
          turnaround_seconds: 3
        }
      },
      {
        method: 'GET',
        path: '/underwriting/reports/{application_id}',
        label: 'Fetch UW Report',
        description: 'Retrieve the TeleMER decision artefacts for audit or sharing.',
        sampleRequest: {
          application_id: 'UW-10021'
        },
        sampleResponse: {
          application_id: 'UW-10021',
          decision: 'Approve with Loading',
          documents: [
            { type: 'telemer_report', url: 'https://sandbox.pivot/reports/tel7788.pdf' },
            { type: 'risk_summary', url: 'https://sandbox.pivot/reports/uw10021.json' }
          ]
        }
      },
      {
        method: 'POST',
        path: '/underwriting/override',
        label: 'Decision Override',
        description: 'Allow authorised users to override the recommendation with justification.',
        sampleRequest: {
          application_id: 'UW-10021',
          override_action: 'approve_standard',
          justification: 'Medical board cleared the thyroid disclosure'
        },
        sampleResponse: {
          status: 'override_pending_dual_auth',
          approver_required: 'Chief Underwriter',
          sla_hours: 4
        }
      }
    ]
  },
  {
    id: 'pivot-operations',
    name: 'PIVOT Operations CoPilot',
    description: '360° automation for policy servicing tasks with orchestration, alerts, and productivity analytics.',
    icon: 'fa-cogs',
    features: ['Workflow Automation', 'Process Optimization', 'Real-time Monitoring', 'Performance Analytics'],
    sandbox: [
      {
        method: 'POST',
        path: '/operations/workflows',
        label: 'Trigger Workflow',
        description: 'Kick off an operations workflow such as KYC refresh or welcome kit fulfillment.',
        sampleRequest: {
          workflow_code: 'KYC_REFRESH',
          policy_number: 'POL1234567',
          priority: 'high',
          channel: 'digital'
        },
        sampleResponse: {
          workflow_instance: 'WF-77882',
          status: 'accepted',
          assigned_pod: 'Ops Squad North',
          expected_completion_hours: 12
        }
      },
      {
        method: 'GET',
        path: '/operations/workflows/{instance_id}',
        label: 'Workflow Status',
        description: 'Monitor tasks, escalations, and SLA breaches for a workflow instance.',
        sampleRequest: {
          workflow_instance: 'WF-77882'
        },
        sampleResponse: {
          status: 'in_progress',
          tasks: [
            { name: 'Document Verification', owner: 'bot', state: 'done' },
            { name: 'AML Screening', owner: 'ops_analyst', state: 'pending' }
          ],
          sla_risk: false
        }
      },
      {
        method: 'POST',
        path: '/operations/escalate',
        label: 'Raise Escalation',
        description: 'Create an escalation with reason codes and severity.',
        sampleRequest: {
          workflow_instance: 'WF-77882',
          severity: 'medium',
          reason_code: 'missing_documents',
          notes: 'Customer uploaded blurred ID proof'
        },
        sampleResponse: {
          escalation_id: 'ESC-5566',
          status: 'assigned',
          resolver: 'Team Lead - Ops Squad North'
        }
      }
    ]
  },
  {
    id: 'pivot-endorsements',
    name: 'PIVOT Endorsements CoPilot',
    description: 'Smart endorsements processing with rule-driven authorisations and instant premium impact preview.',
    icon: 'fa-file-contract',
    features: ['Automated Processing', 'Policy Modification', 'Compliance Checks', 'Real-time Updates'],
    sandbox: [
      {
        method: 'POST',
        path: '/endorsements/process',
        label: 'Submit Endorsement',
        description: 'Submit a new endorsement request with proposed changes.',
        sampleRequest: {
          endorsement_id: 'END-2211',
          policy_number: 'POL9876543',
          change_type: 'address_update',
          effective_date: '2025-01-15',
          remarks: 'Customer relocated to Bengaluru'
        },
        sampleResponse: {
          status: 'under_review',
          endorsement_id: 'END-2211',
          complying_documents: ['utility_bill', 'aadhaar_copy'],
          premium_change: 0
        }
      },
      {
        method: 'POST',
        path: '/endorsements/quote',
        label: 'Premium Impact Preview',
        description: 'Preview the premium or coverage impact for an endorsement before submission.',
        sampleRequest: {
          policy_number: 'POL9876543',
          change_type: 'sum_insured_increase',
          new_sum_insured: 1500000
        },
        sampleResponse: {
          premium_delta: 1250,
          taxes: 225,
          approval_required: 'underwriter'
        }
      },
      {
        method: 'GET',
        path: '/endorsements/status/{endorsement_id}',
        label: 'Track Endorsement',
        description: 'Check the live status, pending approvals, and communication trail.',
        sampleRequest: {
          endorsement_id: 'END-2211'
        },
        sampleResponse: {
          status: 'awaiting_customer_acceptance',
          pending_actions: ['Customer e-sign mandate'],
          last_updated: '2025-01-05T09:45:00Z'
        }
      }
    ]
  }
];

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with new layout */}
      <header className="gradient-bg text-white py-12">
        <div className="container mx-auto px-6">
          {/* Top section with logos and intro text */}
          <div className="flex items-center justify-between mb-8">
            {/* Attributum Logo - Left */}
            <div className="flex-1">
              <img 
                src="/assets/attributum-logo.png" 
                alt="Attributum Logo" 
                className="h-18 w-auto"
                style={{ maxHeight: '75px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none' }} className="logo-text text-2xl text-white font-bold">
                ATTRIBUTUM
              </div>
            </div>
            
            {/* Intro Text - Middle */}
            <div className="flex-1 text-center px-8">
              <h1 className="text-3xl font-bold mb-2">PIVOT Automation Suite</h1>
              <p className="text-sm opacity-80 mt-2">
                Transforming insurance operations with AI-powered automation and intelligent decision-making
              </p>
            </div>
            
            {/* PIVOT Logo - Right */}
            <div className="flex-1 text-right">
              <img 
                src="/assets/pivot-logo.png" 
                alt="PIVOT Automation Suite" 
                className="w-48 h-auto inline-block"
                style={{ 
                  maxWidth: '240px',
                  maxHeight: '60px',
                  opacity: 0.6,
                  mixBlendMode: 'multiply',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* PIVOT Products Grid */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our PIVOT Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Click on any product to explore interactive demos and API capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pivotProducts.map((product) => (
            <div key={product.id} onClick={() => window.location.hash = `#/demo/${product.id}`} className="block">
              <div className="bg-white rounded-lg shadow-lg p-6 card-hover cursor-pointer border-t-4 border-blue-600">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className={`fas ${product.icon} text-2xl text-blue-600`}></i>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{product.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="text-blue-600 font-medium flex items-center justify-center">
                  Explore Demo <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-4">
            <div className="logo-text text-2xl text-white">
              ATTRIBUTUM
            </div>
            <div className="text-sm text-blue-300">
              Data | Intelligence | Automation
            </div>
          </div>
          <p className="mb-4">&copy; 2024 Attributum Insurtech. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="https://attributum.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300">
              Visit Our Website
            </a>
            <a href="https://attributum.com/about-us/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300">
              About Us
            </a>
            <a href="https://attributum.com/contact-us/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Score Configuration Page Component
const ScoreConfigPage = () => {
  const [scoreConfig, setScoreConfig] = useState({
    criticalDataAvailability: { enabled: true, points: 40, condition: 'Critical data sections present' },
    policyPeriod: { enabled: true, points: 20, condition: 'Policy end date ahead or within 15 days' },
    cumulativeBonus: { enabled: true, points: 20, condition: '> 0' },
    noPED: { enabled: true, points: 20, condition: 'No PED declared' },
    claimFree: { enabled: true, points: 0, condition: 'No claims' }
  });

  // Load saved configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('portabilityScoreConfig');
    const configVersion = localStorage.getItem('portabilityScoreConfigVersion');
    
    // Force update if version doesn't match or doesn't exist
    if (!configVersion || configVersion !== 'v4') {
      console.log('Configuration version mismatch, forcing update');
      const defaultConfig = {
        criticalDataAvailability: { enabled: true, points: 40, condition: 'Critical data sections present' },
        policyPeriod: { enabled: true, points: 20, condition: 'Policy end date ahead or within 15 days' },
        cumulativeBonus: { enabled: true, points: 20, condition: '> 0' },
        noPED: { enabled: true, points: 20, condition: 'No PED declared' },
        claimFree: { enabled: true, points: 0, condition: 'No claims' }
      };
      setScoreConfig(defaultConfig);
      localStorage.setItem('portabilityScoreConfig', JSON.stringify(defaultConfig));
      localStorage.setItem('portabilityScoreConfigVersion', 'v4');
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
    localStorage.setItem('portabilityScoreConfigVersion', 'v4');
    alert('Score configuration saved successfully!');
  };

  const handleReset = () => {
    const defaultConfig = {
      criticalDataAvailability: { enabled: true, points: 40, condition: 'Critical data sections present' },
      policyPeriod: { enabled: true, points: 20, condition: 'Policy end date ahead or within 15 days' },
      cumulativeBonus: { enabled: true, points: 20, condition: '> 0' },
      noPED: { enabled: true, points: 20, condition: 'No PED declared' },
      claimFree: { enabled: true, points: 0, condition: 'No claims' }
    };
    setScoreConfig(defaultConfig);
    localStorage.setItem('portabilityScoreConfig', JSON.stringify(defaultConfig));
    localStorage.setItem('portabilityScoreConfigVersion', 'v4');
    alert('Score configuration reset to defaults!');
  };

  const totalPoints = Object.values(scoreConfig).reduce((sum, config) => 
    config.enabled ? sum + config.points : sum, 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logos */}
      <header className="gradient-bg text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* PIVOT Logo - Left */}
            <div className="flex items-center">
              <img 
                src="/assets/pivot-logo.png" 
                alt="PIVOT Automation Suite" 
                className="h-9 w-auto"
                style={{ 
                  opacity: 0.7,
                  filter: 'contrast(1.2) brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  maxHeight: '36px'
                }}
              />
            </div>
            
            {/* Title - Middle */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold">Score Configuration</h1>
              <p className="text-sm opacity-90 mt-1">Configure portability scoring criteria</p>
            </div>
            
            {/* Attributum Logo - Right */}
            <div className="flex items-center">
              <img 
                src="/assets/attributum-logo.png" 
                alt="Attributum" 
                className="h-9 w-auto"
                style={{ 
                  maxHeight: '36px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <button 
              onClick={() => window.location.hash = '#/demo/pivot-portability'}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Upload
            </button>
          </div>
          
          {/* Configuration Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Scoring Criteria</h2>
              <div className="text-sm text-gray-600">
                Total Points: <span className="font-bold text-blue-600">{totalPoints}</span>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(scoreConfig).map(([key, config]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => handleConfigChange(key, 'enabled', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-medium text-gray-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
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
                <i className="fas fa-undo mr-2"></i>
                Reset to Default
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <i className="fas fa-save mr-2"></i>
                Save Configuration
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">How to Use</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Enable/disable scoring criteria using the checkboxes</li>
              <li>• Adjust points for each criterion (0-100)</li>
              <li>• Modify the condition description for clarity</li>
              <li>• Total points will be calculated automatically</li>
              <li>• Click "Save Configuration" to apply changes</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};


const DemoPage = () => {
  const [apiId, setApiId] = useState(null);
  const [activeEndpoint, setActiveEndpoint] = useState(null);
  const [requestBody, setRequestBody] = useState('{}');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    const parts = hash.split('/');
    const id = parts[parts.length - 1];
    setApiId(id);
  }, []);

  const product = pivotProducts.find(p => p.id === apiId);

  useEffect(() => {
    if (product && product.sandbox && product.sandbox.length > 0) {
      setActiveEndpoint(product.sandbox[0]);
      setRequestBody(JSON.stringify(product.sandbox[0].sampleRequest, null, 2));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <a 
            href="#/"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 inline-block"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const handleExecuteRequest = async () => {
    if (!activeEndpoint) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API response based on active endpoint
      const mockResponse = activeEndpoint.sampleResponse || {
        status: 'success',
        message: 'Demo response for ' + product.name,
        timestamp: new Date().toISOString()
      };
      
      const responseText = JSON.stringify(mockResponse, null, 2);
      setResponse(responseText);
      
      // Add to history
      const historyEntry = {
        id: Date.now(),
        endpoint: activeEndpoint.label,
        method: activeEndpoint.method,
        path: activeEndpoint.path,
        request: requestBody,
        response: responseText,
        timestamp: new Date().toLocaleString()
      };
      setHistory(prev => [historyEntry, ...prev].slice(0, 5)); // Keep last 5
    } catch (error) {
      setResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndpointChange = (endpoint) => {
    setActiveEndpoint(endpoint);
    setRequestBody(JSON.stringify(endpoint.sampleRequest, null, 2));
    setResponse('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a 
                href="#/"
                className="text-white hover:text-blue-200"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Home
              </a>
              <div className="h-8 w-px bg-white opacity-50"></div>
              <div className="flex items-center space-x-3">
                <i className={`fas ${product.icon} text-2xl`}></i>
                <h1 className="text-2xl font-bold">{product.name}</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sandbox Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Endpoint Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Endpoints</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {product.sandbox.map((endpoint, index) => (
              <button
                key={index}
                onClick={() => handleEndpointChange(endpoint)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  activeEndpoint === endpoint
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                    endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {endpoint.method}
                  </span>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </div>
                <h3 className="font-semibold text-gray-800">{endpoint.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">
                  {endpoint.path}
                </code>
              </button>
            ))}
          </div>
        </div>

        {/* Active Endpoint Sandbox */}
        {activeEndpoint && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Request Panel */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Request - {activeEndpoint.label}
              </h3>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Request Body (JSON)
                    </label>
                    <button
                      onClick={() => setRequestBody(JSON.stringify(activeEndpoint.sampleRequest, null, 2))}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                    >
                      Reset to Sample
                    </button>
                  </div>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder='{"key": "value"}'
                  />
                </div>
                <button
                  onClick={handleExecuteRequest}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Executing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play mr-2"></i>
                      Execute Request
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Response Panel */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Response</h3>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Response Body
                    </label>
                    <button
                      onClick={() => navigator.clipboard.writeText(response)}
                      disabled={!response}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="w-full h-64 p-3 bg-gray-100 rounded-lg font-mono text-sm overflow-auto">
                    {response || 'Response will appear here...'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request History */}
        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Requests</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {history.map((entry) => (
                  <div key={entry.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded mr-2 ${
                          entry.method === 'POST' ? 'bg-green-100 text-green-700' :
                          entry.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {entry.method}
                        </span>
                        <span className="font-medium text-gray-800">{entry.endpoint}</span>
                        <code className="text-xs text-gray-500 ml-2">{entry.path}</code>
                      </div>
                      <span className="text-xs text-gray-500">{entry.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Portability Demo Page Component
const PortabilityDemoPage = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [version] = useState('1.0.1'); // Force re-render

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setResponse(null);
      setScoreResult(null); // Reset score when new file is selected
    }
  };

  const hasFile = () => {
    return file instanceof File;
  };

  const getFileName = () => {
    return file ? file.name : null;
  };

  const calculatePortabilityScore = (data) => {
  try {
    console.log('=== CALCULATE PORTABILITY SCORE START ===');
    console.log('Input data:', data);
    console.log('Input data type:', typeof data);
    console.log('Input data keys:', Object.keys(data));
    
    // Handle different response structures
    const responseData = data.response?.data || data.data || data;
    console.log('ResponseData:', responseData);
    console.log('ResponseData type:', typeof responseData);
    console.log('ResponseData keys:', Object.keys(responseData));
    
    // Get saved configuration or use defaults
    const savedConfig = localStorage.getItem('portabilityScoreConfig');
    console.log('Saved config from localStorage:', savedConfig);
    const scoreConfig = savedConfig ? JSON.parse(savedConfig) : {
      criticalDataAvailability: { enabled: true, points: 40, condition: 'Critical data sections present' },
      policyPeriod: { enabled: true, points: 20, condition: 'Policy end date ahead or within 15 days' },
      cumulativeBonus: { enabled: true, points: 20, condition: '> 0' },
      noPED: { enabled: true, points: 20, condition: 'No PED declared' },
      claimFree: { enabled: true, points: 0, condition: 'No claims' }
    };
    
    console.log('Score config:', scoreConfig);
    console.log('Score config type:', typeof scoreConfig);
    console.log('Score config keys:', Object.keys(scoreConfig));

    let score = 0;
    let maxScore = 0;
    const breakdown = {};
    let policyExpirationInfo = null;
    
    // 1. Critical Data Availability (40 points)
    if (scoreConfig.criticalDataAvailability && scoreConfig.criticalDataAvailability.enabled) {
      console.log('=== CHECKING CRITICAL DATA AVAILABILITY ===');
      console.log('Critical data config:', scoreConfig.criticalDataAvailability);
      let criticalDataScore = 0;
      const criticalChecks = [];
      
      // Check Proposer Section
      const proposer = responseData.proposer_details || {};
      console.log('Proposer data:', proposer);
      const hasProposerName = proposer.first_name || proposer.last_name || proposer.proposer_name;
      const hasProposerDOB = proposer.dob;
      criticalChecks.push(hasProposerName, hasProposerDOB);
      console.log('Proposer checks - Name:', hasProposerName, 'DOB:', hasProposerDOB);
      
      // Check Policy Details Section
      const policy = responseData.policy_and_coverage_details || {};
      console.log('Policy data:', policy);
      const hasPolicyStartDate = policy.policy_start_date;
      const hasPolicyEndDate = policy.policy_end_date;
      const hasPolicyNumber = policy.policy_number;
      criticalChecks.push(hasPolicyStartDate, hasPolicyEndDate, hasPolicyNumber);
      console.log('Policy checks - Start:', hasPolicyStartDate, 'End:', hasPolicyEndDate, 'Number:', hasPolicyNumber);
      
      // Check Member Details Section
      const members = responseData.insured_details || [];
      console.log('Members data:', members);
      const hasAtLeastOneMember = members.length > 0 && members.some(member => 
        member.insured_name || member.name
      );
      criticalChecks.push(hasAtLeastOneMember);
      console.log('Member check - At least one member:', hasAtLeastOneMember);
      
      // Check Coverage Details Section
      const hasSumInsured = policy.floater_basic_sum_insured || policy.sum_insured;
      const hasCumulativeBonus = policy.floater_cumulative_bonus || policy.cumulative_bonus;
      const hasOptionalCovers = policy.optional_coverage_1 || policy.optional_coverage_2 || 
                               policy.optional_coverage_3 || policy.optional_coverage_4;
      criticalChecks.push(hasSumInsured, hasCumulativeBonus, hasOptionalCovers);
      console.log('Coverage checks - Sum Insured:', hasSumInsured, 'Bonus:', hasCumulativeBonus, 'Optional Covers:', hasOptionalCovers);
      
      // Calculate score based on available critical data (40 points total)
      const totalChecks = criticalChecks.length;
      const passedChecks = criticalChecks.filter(check => check).length;
      criticalDataScore = Math.round((passedChecks / totalChecks) * scoreConfig.criticalDataAvailability.points);
      
      console.log('Critical data checks:', criticalChecks);
      console.log('Passed checks:', passedChecks, '/', totalChecks);
      console.log('Critical data score calculation:', passedChecks, '/', totalChecks, '*', scoreConfig.criticalDataAvailability.points, '=', criticalDataScore);
      
      score += criticalDataScore;
      breakdown.criticalDataAvailability = { 
        points: criticalDataScore, 
        met: criticalDataScore > 0,
        details: `${passedChecks}/${totalChecks} critical data points available`
      };
      maxScore += scoreConfig.criticalDataAvailability.points;
      console.log('Critical Data Availability Score:', criticalDataScore, 'points');
    } else {
      console.log('Critical Data Availability disabled or not found');
    }

    // 2. Policy Period (20 points) - Policy End Date check
    if (scoreConfig.policyPeriod && scoreConfig.policyPeriod.enabled) {
      console.log('=== CHECKING POLICY PERIOD ===');
      console.log('Policy period config:', scoreConfig.policyPeriod);
      const policy = responseData.policy_and_coverage_details || {};
      const policyEndDateStr = policy.policy_end_date;
      console.log('Policy End Date:', policyEndDateStr);
      
      if (policyEndDateStr) {
        try {
          // Parse policy end date (assuming DD/MM/YYYY format)
          const [day, month, year] = policyEndDateStr.split('/');
          const policyEndDate = new Date(`${year}-${month}-${day}`);
          const currentDate = new Date();
          
          // Calculate 15 days ago
          const fifteenDaysAgo = new Date(currentDate);
          fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
          
          console.log('Policy End Date:', policyEndDate);
          console.log('Current Date:', currentDate);
          console.log('15 Days Ago:', fifteenDaysAgo);
          
          // Check if policy end date is ahead of current date OR within 15 days in the past
          const isValidPolicyPeriod = policyEndDate >= fifteenDaysAgo;
          
          console.log('Policy Period Valid:', isValidPolicyPeriod);
          
          if (isValidPolicyPeriod) {
            score += scoreConfig.policyPeriod.points;
            breakdown.policyPeriod = { 
              points: scoreConfig.policyPeriod.points, 
              met: true,
              details: `Policy valid until ${policyEndDateStr}`
            };
          } else {
            breakdown.policyPeriod = { 
              points: 0, 
              met: false,
              details: `Policy expired on ${policyEndDateStr}`
            };
            // Set expiration info for flag display
            policyExpirationInfo = `Policy expired on ${policyEndDateStr}`;
          }
          maxScore += scoreConfig.policyPeriod.points;
        } catch (dateError) {
          console.error('Error parsing policy end date:', dateError);
          breakdown.policyPeriod = { 
            points: 0, 
            met: false,
            details: 'Invalid policy end date format'
          };
          maxScore += scoreConfig.policyPeriod.points;
        }
      } else {
        console.log('No policy end date found');
        breakdown.policyPeriod = { 
          points: 0, 
          met: false,
          details: 'Policy end date not available'
        };
        maxScore += scoreConfig.policyPeriod.points;
      }
    } else {
      console.log('Policy Period disabled or not found');
    }

    // 3. Cumulative Bonus (>0)
    if (scoreConfig.cumulativeBonus && scoreConfig.cumulativeBonus.enabled) {
      console.log('=== CHECKING CUMULATIVE BONUS ===');
      console.log('Cumulative bonus config:', scoreConfig.cumulativeBonus);
      const cumulativeBonus = parseInt(responseData.policy_and_coverage_details?.floater_cumulative_bonus?.replace(/[^0-9]/g, '')) || 0;
      console.log('Cumulative Bonus check:', cumulativeBonus, '> 0?');
      if (cumulativeBonus > 0) {
        score += scoreConfig.cumulativeBonus.points;
        breakdown.cumulativeBonus = { points: scoreConfig.cumulativeBonus.points, met: true };
      } else {
        breakdown.cumulativeBonus = { points: 0, met: false };
      }
      maxScore += scoreConfig.cumulativeBonus.points;
    } else {
      console.log('Cumulative Bonus disabled or not found');
    }

    // 4. No PED (No Pre-existing Diseases)
    if (scoreConfig.noPED && scoreConfig.noPED.enabled) {
      console.log('=== CHECKING PED ===');
      console.log('No PED config:', scoreConfig.noPED);
      const insuredMembers = responseData.insured_details || [];
      console.log('Insured members for PED check:', insuredMembers);
      const hasPED = insuredMembers.some(member => 
        member.declared_ped && member.declared_ped !== 'None' && member.declared_ped !== 'N/A'
      );
      console.log('PED check:', hasPED, 'No PED?');
      if (!hasPED) {
        score += scoreConfig.noPED.points;
        breakdown.noPED = { points: scoreConfig.noPED.points, met: true };
      } else {
        breakdown.noPED = { points: 0, met: false };
      }
      maxScore += scoreConfig.noPED.points;
    } else {
      console.log('No PED disabled or not found');
    }

    // 5. Claim Free (No claims) - 0 points as per new weights
    if (scoreConfig.claimFree && scoreConfig.claimFree.enabled && scoreConfig.claimFree.points > 0) {
      console.log('=== CHECKING CLAIMS ===');
      const hasClaims = responseData.policy_and_coverage_details?.previous_claims === 'Yes';
      console.log('Claim Free check:', hasClaims, 'No claims?');
      if (!hasClaims) {
        score += scoreConfig.claimFree.points;
        breakdown.claimFree = { points: scoreConfig.claimFree.points, met: true };
      } else {
        breakdown.claimFree = { points: 0, met: false };
      }
      maxScore += scoreConfig.claimFree.points;
    } else {
      console.log('Claim Free disabled or not found');
    }

    console.log('=== FINAL SCORE ===');
    console.log('Score:', score, '/', maxScore);
    console.log('Breakdown:', breakdown);
    console.log('Policy Expiration Info:', policyExpirationInfo);
    console.log('=== CALCULATE PORTABILITY SCORE END ===');
    
    return {
      score,
      maxScore,
      breakdown,
      policyExpirationInfo
    };
  } catch (err) {
    console.error('Error in calculatePortabilityScore:', err);
    return {
      score: 0,
      maxScore: 100,
      breakdown: {
        criticalDataAvailability: { points: 0, met: false },
        policyPeriod: { points: 0, met: false },
        cumulativeBonus: { points: 0, met: false },
        noPED: { points: 0, met: false },
        claimFree: { points: 0, met: false }
      },
      policyExpirationInfo: null
    };
  }
};

const summarizeResponse = (data) => {
  try {
    // Handle different response structures
    const response = data.response?.data || data.data || data;
    console.log('Summarizing response structure:', response);
    
    const proposer = response.proposer_details || {};
    const policy = response.policy_and_coverage_details || {};
    const insured = response.insured_details || [];
    const nominee = response.nominee_details?.[0] || {};
    const issuingOffice = response.issuing_office_details || {};
    
    return {
      // Key Policy Info (to show on top)
      carrier: policy.optional_coverage_5 || 'N/A',
      policyType: policy.policy_type || 'N/A',
      numberOfMembers: insured.length || 0,
      
      // Proposer Details
      proposer: {
        name: `${proposer.first_name || ''} ${proposer.last_name || ''}`.trim() || 'N/A',
        email: proposer.email || 'N/A',
        mobile: proposer.mobile_number || 'N/A',
        dob: proposer.dob || 'N/A',
        address: `${proposer.address || ''} ${proposer.city || ''} ${proposer.state || ''} - ${proposer.pin_code || ''}`.trim() || 'N/A'
      },
      
      // Policy Details
      policy: {
        number: policy.policy_number || 'N/A',
        productName: policy.policy_product_name || 'N/A',
        productId: policy.policy_product_id || 'N/A',
        sumInsured: policy.floater_basic_sum_insured || 'N/A',
        term: policy.policy_term || 'N/A',
        startDate: policy.policy_start_date || 'N/A',
        endDate: policy.policy_end_date || 'N/A',
        cumulativeBonus: policy.floater_cumulative_bonus || 'N/A',
        previousPolicyNumber: policy.previous_policy_number || 'N/A'
      },
      
      // Coverage Details
      coverage: {
        optionalCoverages: [
          policy.optional_coverage_1,
          policy.optional_coverage_2,
          policy.optional_coverage_3,
          policy.optional_coverage_4
        ].filter(Boolean),
        schemeDescription: policy.scheme_description || 'N/A'
      },
      
      // Members Details
      members: insured.map(member => ({
        name: member.insured_name || 'N/A',
        age: member.age || 'N/A',
        gender: member.gender || 'N/A',
        relationship: member.relationship || 'N/A',
        dob: member.dob || 'N/A',
        declaredPED: member.declared_ped || 'None'
      })),
      
      // Nominee Details
      nominee: {
        name: nominee.nominee_name || 'N/A',
        relation: nominee.nominee_relation || 'N/A',
        age: nominee.nominee_age || 'N/A',
        share: nominee.nominee_share || 'N/A'
      },
      
      // Issuing Office
      issuingOffice: {
        name: issuingOffice.office_name || 'N/A',
        address: issuingOffice.office_addresss || 'N/A'
      },
      
      // Additional Info
      additional: {
        processingTime: data.response?.time_to_complete_in_seconds || 'N/A',
        filename: data.response?.filename || data.filename || 'N/A',
        apiCallsConsumed: data.api_calls_consumed || 'N/A'
      }
    };
  } catch (err) {
    console.error('Error summarizing response:', err);
    return {
      carrier: 'Error',
      policyType: 'Error',
      numberOfMembers: 0,
      proposer: { name: 'Error', email: 'Error', mobile: 'Error', dob: 'Error', address: 'Error' },
      policy: { number: 'Error', productName: 'Error', productId: 'Error', sumInsured: 'Error', term: 'Error', startDate: 'Error', endDate: 'Error', cumulativeBonus: 'Error', previousPolicyNumber: 'Error' },
      coverage: { optionalCoverages: [], schemeDescription: 'Error' },
      members: [],
      nominee: { name: 'Error', relation: 'Error', age: 'Error', share: 'Error' },
      issuingOffice: { name: 'Error', address: 'Error' },
      additional: { processingTime: 'Error', filename: 'Error', apiCallsConsumed: 'Error' }
    };
  }
};

const handleSubmit = async (e) => {
    console.log('=== Frontend handleSubmit called ===');
    console.log('File:', file);
    console.log('hasFile():', hasFile());
    
    if (!hasFile()) {
      setError('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);
    console.log('Starting API call...');

    try {
      const formData = new FormData();
      formData.append('document', file);
      console.log('FormData created, file appended');

      const response = await fetch('/api/portability/analyze', {
        method: 'POST',
        body: formData,
      });
      console.log('Response received:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response received:', data);
      console.log('Response keys:', Object.keys(data));
      
      if (data.error) {
        console.error('API returned error:', data.error);
        setError(data.error);
      } else {
        setResponse(data);
        console.log('Response set successfully');
        
        // Calculate and store score result
        const calculatedScore = calculatePortabilityScore(data);
        console.log('Calculated score:', calculatedScore);
        setScoreResult(calculatedScore);
        console.log('Score result set in state');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      console.log('API call finished');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Back to Home Button - Left */}
            <button
              onClick={() => window.location.hash = '#/'}
              className="flex items-center text-white hover:text-blue-200 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Home
            </button>
            
            {/* Title - Middle */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold">PIVOT Portability Module</h1>
              <p className="text-sm opacity-90 mt-1">AI Powered Policy Porting and Underwriting Automation</p>
            </div>
            
            {/* PIVOT Logo - Right */}
            <img src="/assets/pivot-logo.png" alt="PIVOT Logo" className="h-16" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload your policy here</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Choose File
                  </label>
                  <p className="text-gray-500 mt-3 text-sm">
                    PDF, JPG, JPEG, PNG files supported
                  </p>
                  {getFileName() && (
                    <p className="text-green-600 mt-3 font-medium">
                      Selected: {getFileName()}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !hasFile()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Analyzing Document...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      Analyze Document
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Ensure document is clear and readable
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Include all pages of the policy document
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Check that policy details are up to date
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Verify proposer information matches records
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Results Section */}
          <div className="space-y-6">
            {response && scoreResult ? (
              <>
                {console.log('UI rendering with scoreResult:', scoreResult)}
                {/* Portability Score */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Portability Score</h3>
                    <button
                      onClick={() => window.location.hash = '#/score-config'}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <i className="fas fa-cog mr-1"></i>
                      Score Settings
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-medium text-gray-700">Your Score</span>
                      <span className="text-3xl font-bold text-blue-600">
                        {scoreResult.score}/{scoreResult.maxScore}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(scoreResult.score / scoreResult.maxScore) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Score Category */}
                    <div className="mt-4 text-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        scoreResult.score >= 80 ? 'bg-green-100 text-green-800' :
                        scoreResult.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {scoreResult.score >= 80 ? 'Excellent' :
                         scoreResult.score >= 60 ? 'Good' :
                         'Needs Improvement'}
                      </span>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Score Breakdown</h4>
                    <div className="space-y-2">
                      {Object.entries(scoreResult.breakdown).map(([key, value]) => {
                        const labels = {
                          criticalDataAvailability: 'Critical Data Availability',
                          policyPeriod: 'Policy Period',
                          cumulativeBonus: 'Cumulative Bonus',
                          noPED: 'No PED',
                          claimFree: 'Claim Free'
                        };
                        return (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-gray-600">
                              {labels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`font-medium ${value.met ? 'text-green-600' : 'text-red-600'}`}>
                              {value.met ? '+' : ''}{value.points} points
                              {value.details && <span className="text-xs text-gray-500 ml-2">({value.details})</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Policy Expiration Flag */}
                  {scoreResult.policyExpirationInfo && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700 font-medium">{scoreResult.policyExpirationInfo}</span>
                      </div>
                    </div>
                  )}
                </div>

                      {/* Policy Summary */}
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-4">
                          <img src="/assets/attributum-logo.png" alt="Attributum Logo" className="h-8 mr-3" />
                          <h3 className="text-xl font-semibold text-gray-800">Policy Summary</h3>
                        </div>
                        
                        {/* Key Policy Info - Top Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-1">Carrier</div>
                              <div className="font-semibold text-blue-700">{summarizeResponse(response).carrier}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-1">Policy Type</div>
                              <div className="font-semibold text-blue-700">{summarizeResponse(response).policyType}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-1">Members</div>
                              <div className="font-semibold text-blue-700">{summarizeResponse(response).numberOfMembers}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {/* Policy Details */}
                          <div>
                            <h5 className="font-medium text-gray-600 mb-3">Policy Details</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p><span className="font-medium">Policy Number:</span> {summarizeResponse(response).policy.number}</p>
                                <p><span className="font-medium">Product:</span> {summarizeResponse(response).policy.productName}</p>
                                <p><span className="font-medium">Product ID:</span> {summarizeResponse(response).policy.productId}</p>
                                <p><span className="font-medium">Sum Insured:</span> {summarizeResponse(response).policy.sumInsured}</p>
                              </div>
                              <div>
                                <p><span className="font-medium">Policy Term:</span> {summarizeResponse(response).policy.term} years</p>
                                <p><span className="font-medium">Start Date:</span> {summarizeResponse(response).policy.startDate}</p>
                                <p><span className="font-medium">End Date:</span> {summarizeResponse(response).policy.endDate}</p>
                                <p><span className="font-medium">Cumulative Bonus:</span> {summarizeResponse(response).policy.cumulativeBonus}</p>
                              </div>
                            </div>
                          </div>

                          {/* Raw Data (collapsible) */}
                          <div className="border-t pt-4 mt-6">
                            <details className="cursor-pointer">
                              <summary className="font-medium text-gray-700 hover:text-blue-600">View Raw API Response</summary>
                              <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm mt-3">
                                {JSON.stringify(response, null, 2)}
                              </pre>
                            </details>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty State */
                {console.log('UI rendering - scoreResult is null or missing, response:', response)}
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-upload text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Analysis Yet</h3>
                <p className="text-gray-500 text-sm">
                  Upload your policy document to see the portability analysis results here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState(window.location.hash || '#/');
  const [renderKey, setRenderKey] = useState(0);

  // Handle routing
  const getCurrentPage = () => {
    const hash = currentPage || window.location.hash;
    console.log('Current hash (from state):', hash);
    
    if (hash === '#/demo/pivot-portability') {
      console.log('Rendering PortabilityDemoPage');
      return <PortabilityDemoPage />;
    } else if (hash === '#/score-config') {
      return <ScoreConfigPage />;
    } else {
      return <LandingPage />;
    }
  };

  // Listen for hash changes
  useEffect(() => {
    console.log('Setting up hash change listener');
    
    const handleHashChange = () => {
      const newHash = window.location.hash || '#/';
      console.log('Hash changed to:', newHash);
      console.log('About to setCurrentPage to:', newHash);
      setCurrentPage(newHash);
      setRenderKey(prev => prev + 1); // Force re-render
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
      console.log('Cleaning up hash change listener');
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  console.log('App rendering, currentPage state:', currentPage, 'renderKey:', renderKey);

  return getCurrentPage();
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
