# PIVOT Portability Plus - File Structure & Organization

## Complete File Listing

```
/sessions/sweet-festive-curie/mnt/LIVE PIVOT-Automation-Suite/
│
├── 📁 BACKEND LOGIC ENGINES (3 files)
│   ├── portability-engines.js              [850+ lines] Core logic engines
│   ├── portability-routes.js               [400+ lines] REST API routes
│   └── portability-synthetic-data.js       [320+ lines] Test data
│
├── 📁 FRONTEND COMPONENTS (11 files)
│   ├── PortabilityDashboard.jsx            Main container & orchestration
│   ├── StepIndicator.jsx                   Progress bar component
│   ├── PortabilitySteps.jsx                All 6 step components
│   ├── Step1Upload.jsx                     Wrapper for Step 1
│   ├── Step2Extract.jsx                    Wrapper for Step 2
│   ├── Step3AppData.jsx                    Wrapper for Step 3
│   ├── Step4Anomalies.jsx                  Wrapper for Step 4
│   ├── Step5Fraud.jsx                      Wrapper for Step 5
│   ├── Step6Recommendation.jsx             Wrapper for Step 6
│   └── ReportViewer.jsx                    Report viewer component
│
├── 📁 SERVER INTEGRATION
│   └── server.js                           [MODIFIED] Added portability import + routes
│
├── 📁 DOCUMENTATION (4 files)
│   ├── PORTABILITY_PLUS_SETUP.md           Developer setup & quick start
│   ├── PORTABILITY_PLUS_API.md             Complete API documentation
│   ├── PORTABILITY_PLUS_IMPLEMENTATION_SUMMARY.md    Project overview
│   └── PORTABILITY_PLUS_FILE_STRUCTURE.md  This file - structure guide
│
├── 📁 ARCHITECTURE REFERENCE (from previous work)
│   ├── PIVOT_PORTABILITY_PLUS_ARCHITECTURE.md       [18KB] Complete blueprint
│   ├── PIVOT_PORTABILITY_PLUS_SUMMARY.md            [7KB] Executive summary
│   └── PIVOT_PORTABILITY_TECHNICAL_DOC.docx         [16KB] Technical details
│
└── 📁 EXISTING PIVOT APPLICATION
    ├── server.js                           Main Express server
    ├── package.json                        Dependencies
    ├── public/                             Static assets
    │   ├── app-new.js                      Main frontend app
    │   ├── index.html
    │   └── ...
    ├── invoice-to-journal.py               Invoice processing
    ├── education-verifier.js               Education module
    ├── rfq-extractor.js                    RFQ module
    └── ...
```

---

## File Organization by Function

### 1️⃣ CORE LOGIC (Backend)

```
portability-engines.js
├── AnomalyDetectionEngine
│   ├── detect()
│   ├── detectDataMismatches()
│   ├── detectCoverageGaps()
│   ├── detectMissingInformation()
│   ├── detectInconsistentDates()
│   ├── detectExclusionGaps()
│   └── detectPremiumVariance()
│
├── FraudDetectionEngine
│   ├── detect()
│   ├── analyzePdfMetadata()
│   ├── analyzeOcrConfidence()
│   ├── detectMedicalInconsistency()
│   ├── detectDocumentStructureAnomalies()
│   ├── analyzeFontConsistency()
│   └── detectInformationFabrication()
│
└── DecisionEngine
    ├── generateRecommendation()
    ├── assessUnderwritingRisk()
    ├── assessDataIntegrity()
    ├── assessMedicalCompleteness()
    ├── assessCoverageAlignment()
    ├── assessDocumentQuality()
    ├── assessFraudRisk()
    └── generateDecision()
```

### 2️⃣ API ROUTES (Backend)

```
portability-routes.js
├── POST /api/portability/cases              Create case
├── POST /api/portability/upload             Upload document
├── POST /api/portability/extract            Extract data
├── POST /api/portability/compare            Compare & anomalies
├── POST /api/portability/fraud-check        Fraud analysis
├── POST /api/portability/decide             Generate decision
├── GET /api/portability/case/:id            Get case
├── GET /api/portability/report/:id          Get report
├── GET /api/portability/cases               List cases
├── PUT /api/portability/case/:id            Update case
└── GET /api/portability/demo-data           Demo data
```

### 3️⃣ TEST DATA (Backend)

```
portability-synthetic-data.js
├── SYNTHETIC_POLICIES (3 policies)
│   ├── POL_2024_001 - NivaBupa Individual
│   ├── POL_2024_002 - Tata AIG Family
│   └── POL_2024_003 - Max Bupa Senior
│
├── SYNTHETIC_APPLICATIONS (2 applications)
│   ├── APP_2024_001 - Rajesh Kumar
│   └── APP_2024_002 - Priya Sharma
│
├── SYNTHETIC_ANOMALIES (3 examples)
│   ├── Coverage Gap
│   ├── Data Mismatch
│   └── Premium Variance
│
└── SYNTHETIC_FRAUD_INDICATORS (3 examples)
    ├── Document Quality
    ├── Medical Inconsistency
    └── Coverage Mismatch
```

### 4️⃣ USER INTERFACE (Frontend)

```
PortabilityDashboard.jsx (Main Container)
├── StepIndicator.jsx (Progress Bar)
│   └── Shows steps 1-6 with completion status
│
├── Step1Upload.jsx (Policy Selection)
│   └── PortabilitySteps.jsx: Step1Upload()
│
├── Step2Extract.jsx (Data Extraction)
│   └── PortabilitySteps.jsx: Step2Extract()
│
├── Step3AppData.jsx (Application Data)
│   └── PortabilitySteps.jsx: Step3AppData()
│
├── Step4Anomalies.jsx (Anomaly Results)
│   └── PortabilitySteps.jsx: Step4Anomalies()
│
├── Step5Fraud.jsx (Fraud Results)
│   └── PortabilitySteps.jsx: Step5Fraud()
│
├── Step6Recommendation.jsx (Final Decision)
│   └── PortabilitySteps.jsx: Step6Recommendation()
│
└── ReportViewer.jsx (Report Display)
    └── PortabilitySteps.jsx: ReportViewer()
```

---

## Component Hierarchy

```
<PortabilityDashboard />
├── <StepIndicator />
│   └── Displays: [✓] [✓] [→] [ ] [ ] [ ]
│
├── <div className="stepContent">
│   └── CurrentStepComponent (dynamically rendered)
│       ├── <Step1Upload />
│       ├── <Step2Extract />
│       ├── <Step3AppData />
│       ├── <Step4Anomalies />
│       ├── <Step5Fraud />
│       ├── <Step6Recommendation />
│       └── <ReportViewer />
│
└── <div className="stepNavigation">
    ├── Button "Previous"
    ├── Text "Step X of 6"
    └── Button "Next" or "View Report"
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                             │
│                    (PortabilityDashboard)                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        ┌───────▼──────┐ ┌────▼─────────┐ ┌─▼────────────────┐
        │  Step1Upload │ │ Step2Extract │ │ Step3AppData     │
        └───────┬──────┘ └────┬─────────┘ └─┬────────────────┘
                │              │            │
        POST    │        POST   │   POST     │
        /upload │        /extract /compare  │
                │              │            │
                └──────────────┼────────────┘
                               │
                ┌──────────────▼──────────────┐
                │  portability-routes.js      │
                │  (API Layer)                │
                └──────────────┬──────────────┘
                               │
                ┌──────────────▼──────────────────────────────┐
                │  portability-engines.js (Logic Layer)       │
                │                                              │
                │  ┌────────────────────────────────────────┐ │
                │  │ AnomalyDetectionEngine                 │ │
                │  │ ├─ detectDataMismatches()              │ │
                │  │ ├─ detectCoverageGaps()                │ │
                │  │ ├─ detectMissingInformation()          │ │
                │  │ ├─ detectInconsistentDates()           │ │
                │  │ ├─ detectExclusionGaps()               │ │
                │  │ └─ detectPremiumVariance()             │ │
                │  └────────────────────────────────────────┘ │
                │                                              │
                │  ┌────────────────────────────────────────┐ │
                │  │ FraudDetectionEngine                   │ │
                │  │ ├─ analyzePdfMetadata()                │ │
                │  │ ├─ analyzeOcrConfidence()              │ │
                │  │ ├─ detectMedicalInconsistency()        │ │
                │  │ ├─ detectDocumentStructureAnomalies()  │ │
                │  │ ├─ analyzeFontConsistency()            │ │
                │  │ └─ detectInformationFabrication()      │ │
                │  └────────────────────────────────────────┘ │
                │                                              │
                │  ┌────────────────────────────────────────┐ │
                │  │ DecisionEngine                         │ │
                │  │ ├─ assessUnderwritingRisk()            │ │
                │  │ ├─ assessDataIntegrity()               │ │
                │  │ ├─ assessMedicalCompleteness()         │ │
                │  │ ├─ assessCoverageAlignment()           │ │
                │  │ ├─ assessDocumentQuality()             │ │
                │  │ ├─ assessFraudRisk()                   │ │
                │  │ └─ generateRecommendation()            │ │
                │  └────────────────────────────────────────┘ │
                └──────────────┬──────────────────────────────┘
                               │
                ┌──────────────▼──────────────┐
                │  Data Layer                  │
                │  portability-synthetic-data │
                │  (or MongoDB in production) │
                └─────────────────────────────┘
                               │
                ┌──────────────▼──────────────┐
                │  Response to Frontend       │
                │  (JSON)                     │
                └─────────────────────────────┘
```

---

## File Dependencies

### PortabilityDashboard.jsx depends on:
- React (18+)
- StepIndicator.jsx
- Step1Upload.jsx
- Step2Extract.jsx
- Step3AppData.jsx
- Step4Anomalies.jsx
- Step5Fraud.jsx
- Step6Recommendation.jsx
- ReportViewer.jsx

### portability-routes.js depends on:
- express
- uuid (uuidv4)
- portability-synthetic-data.js
- portability-engines.js
- AnomalyDetectionEngine
- FraudDetectionEngine
- DecisionEngine

### portability-engines.js depends on:
- None (standalone logic)

### portability-synthetic-data.js depends on:
- None (standalone data)

### server.js depends on:
- portability-routes.js

---

## Import/Export Structure

### Backend Exports

```javascript
// portability-engines.js
export class AnomalyDetectionEngine { }
export class FraudDetectionEngine { }
export class DecisionEngine { }

// portability-synthetic-data.js
export const SYNTHETIC_POLICIES = [...]
export const SYNTHETIC_APPLICATIONS = [...]
export const SYNTHETIC_ANOMALIES = [...]
export const SYNTHETIC_FRAUD_INDICATORS = [...]
export const getPolicyById = (id) => { }
export const getApplicationById = (id) => { }
// ... other helpers

// portability-routes.js
export default router  // Express Router

// server.js
import portabilityRoutes from './portability-routes.js'
app.use(portabilityRoutes)
```

### Frontend Exports

```javascript
// PortabilityDashboard.jsx
export default function PortabilityDashboard() { }

// StepIndicator.jsx
export default function StepIndicator() { }

// PortabilitySteps.jsx
export function Step1Upload() { }
export function Step2Extract() { }
export function Step3AppData() { }
export function Step4Anomalies() { }
export function Step5Fraud() { }
export function Step6Recommendation() { }
export function ReportViewer() { }

// Individual step wrappers
// Step1Upload.jsx
import { Step1Upload } from './PortabilitySteps.jsx'
export default Step1Upload
```

---

## File Sizes

| File | Size | Type |
|------|------|------|
| portability-engines.js | 850+ lines | Logic |
| portability-routes.js | 400+ lines | API |
| portability-synthetic-data.js | 320+ lines | Data |
| PortabilityDashboard.jsx | 450+ lines | React |
| PortabilitySteps.jsx | 700+ lines | React |
| StepIndicator.jsx | 60+ lines | React |
| 9 Step wrappers | 10 lines each | React |
| Documentation | 2000+ lines | Markdown |
| **Total** | **~4500+ lines** | **Code** |

---

## Quick Reference

### To Add Portability to Your App:

1. All files are already created in `/sessions/sweet-festive-curie/mnt/LIVE PIVOT-Automation-Suite/`
2. Server.js is already updated with routes
3. Just restart the server: `node server.js`
4. Access at: `http://localhost:3000/api/portability/*`

### To View Documentation:

- Setup: `PORTABILITY_PLUS_SETUP.md`
- API Reference: `PORTABILITY_PLUS_API.md`
- Project Status: `PORTABILITY_PLUS_IMPLEMENTATION_SUMMARY.md`
- Architecture: `PIVOT_PORTABILITY_PLUS_ARCHITECTURE.md`

### To Test Endpoints:

Use the curl examples in `PORTABILITY_PLUS_API.md` (Section: Testing Endpoints)

---

## Integration Checklist

- [x] Create backend logic engines
- [x] Create REST API routes
- [x] Create synthetic test data
- [x] Create React dashboard
- [x] Create step components
- [x] Create progress indicator
- [x] Integrate with server.js
- [x] Create API documentation
- [x] Create setup documentation
- [x] Create file structure documentation
- [ ] Integrate UI tile into main dashboard
- [ ] Test in browser
- [ ] Demo to client
- [ ] Gather feedback
- [ ] Plan Phase 2 enhancements

---

## Development Workflow

### To Add a New Feature:

1. **Logic**: Add method to appropriate engine in `portability-engines.js`
2. **API**: Add endpoint to `portability-routes.js`
3. **Data**: Update test data in `portability-synthetic-data.js` if needed
4. **UI**: Update step component in `PortabilitySteps.jsx`
5. **Docs**: Update documentation files

### To Deploy:

1. Commit changes
2. Run tests
3. Deploy to staging
4. Test in staging
5. Deploy to production

---

## File Maintenance

### Regular Updates:

- `portability-synthetic-data.js` - Add new test cases quarterly
- `portability-engines.js` - Update thresholds based on user feedback
- Documentation files - Keep in sync with code changes

### Backup Strategy:

- All source files in Git repository
- Documentation in Markdown (version controlled)
- Test data separated from logic (easy to refresh)

---

## Version Control

All files are ready for Git:
- No sensitive data
- No hardcoded credentials
- ES6 module compatible
- Properly documented
- Test data included

```bash
git add portability-*.js portability-*.jsx *.md
git commit -m "feat: Add PIVOT Portability Plus MVP module"
git push origin feature/portability-plus
```

---

**Last Updated**: May 28, 2026
**Total Files Created**: 16
**Total Lines of Code**: 4500+
**Status**: ✅ MVP Complete - Ready for Testing
