# PIVOT Portability Plus - REST API Documentation

## Base URL

```
http://localhost:3000/api/portability
```

## Authentication

All endpoints support authentication via session middleware. Add session cookies to requests.

## Endpoints

### 1. Create Portability Case

Create a new portability analysis case.

**Request:**
```
POST /api/portability/cases
Content-Type: application/json

{
  "policyId": "POL_2024_001",
  "applicantId": "APL_001"
}
```

**Response (200):**
```json
{
  "success": true,
  "caseId": "550e8400-e29b-41d4-a716-446655440000",
  "case": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "policyId": "POL_2024_001",
    "applicantId": "APL_001",
    "createdAt": "2026-05-28T10:30:00Z",
    "status": "DRAFT",
    "steps": {
      "upload": { "completed": false, "data": null },
      "extract": { "completed": false, "data": null },
      "appData": { "completed": false, "data": null },
      "anomalies": { "completed": false, "data": null },
      "fraud": { "completed": false, "data": null },
      "recommendation": { "completed": false, "data": null }
    }
  }
}
```

---

### 2. Upload Policy Document

Upload or register a policy document for analysis.

**Request:**
```
POST /api/portability/upload
Content-Type: application/json

{
  "caseId": "550e8400-e29b-41d4-a716-446655440000",
  "fileName": "NivaBupa_Policy_2024.pdf",
  "fileType": "PDF",
  "fileSize": 512000
}
```

**Response (200):**
```json
{
  "success": true,
  "uploadId": "660f9401-f30c-42e5-b807-557766551111",
  "upload": {
    "id": "660f9401-f30c-42e5-b807-557766551111",
    "caseId": "550e8400-e29b-41d4-a716-446655440000",
    "fileName": "NivaBupa_Policy_2024.pdf",
    "fileType": "PDF",
    "fileSize": 512000,
    "uploadedAt": "2026-05-28T10:31:00Z",
    "status": "Processing"
  }
}
```

**Error (400):**
```json
{
  "error": "Case not found"
}
```

---

### 3. Extract Policy Data

Extract structured data from uploaded policy document.

**Request:**
```
POST /api/portability/extract
Content-Type: application/json

{
  "caseId": "550e8400-e29b-41d4-a716-446655440000",
  "policyId": "POL_2024_001"
}
```

**Response (200):**
```json
{
  "success": true,
  "extracted": {
    "policyNumber": "NBHI/2024/001234",
    "insurer": "NivaBupa Health Insurance",
    "enrolleeName": "Rajesh Kumar",
    "dateOfBirth": "1975-06-15",
    "age": 49,
    "coverage": {
      "hospitalization": {
        "limit": 500000,
        "deductible": 0,
        "coPayPercentage": 0
      },
      "preHospitalization": {
        "days": 30,
        "limit": 100000
      }
    },
    "exclusions": [
      "Pre-existing diseases (applicable for 12 months)",
      "Cosmetic procedures"
    ],
    "sumInsured": 500000,
    "premium": {
      "annual": 12500,
      "paymentFrequency": "Annual"
    },
    "status": "Extracted",
    "extractedAt": "2026-05-28T10:32:00Z",
    "confidence": 0.94
  },
  "message": "Policy data extracted successfully"
}
```

---

### 4. Compare & Detect Anomalies

Compare policy with application data and detect inconsistencies.

**Request:**
```
POST /api/portability/compare
Content-Type: application/json

{
  "caseId": "550e8400-e29b-41d4-a716-446655440000",
  "applicationId": "APP_2024_001"
}
```

**Response (200):**
```json
{
  "success": true,
  "comparison": {
    "policyName": "Rajesh Kumar",
    "applicationName": "Rajesh Kumar",
    "anomaliesFound": 2,
    "anomalies": [
      {
        "type": "Data Mismatch",
        "severity": "High",
        "description": "Condition 'Hypertension' disclosed in policy but not in application",
        "riskScore": 0.75,
        "details": {
          "policyData": "Hypertension",
          "applicationData": "Not listed",
          "similarity": 0
        }
      },
      {
        "type": "Premium Variance",
        "severity": "Medium",
        "description": "Premium significantly lower than expected",
        "riskScore": 0.58,
        "details": {
          "actualPremium": 12500,
          "estimatedPremium": 18000,
          "variancePercent": "-30.6"
        }
      }
    ]
  }
}
```

---

### 5. Run Fraud Detection

Analyze documents for tampering and fraud indicators.

**Request:**
```
POST /api/portability/fraud-check
Content-Type: application/json

{
  "caseId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "success": true,
  "fraudAnalysis": {
    "indicatorsFound": 1,
    "riskLevel": "Low",
    "indicators": [
      {
        "type": "Document Quality",
        "severity": "Low",
        "description": "Slightly lower OCR confidence in medical history section",
        "confidence": 0.89,
        "riskScore": 0.35
      }
    ]
  }
}
```

---

### 6. Generate Portability Decision

Generate final portability recommendation based on complete analysis.

**Request:**
```
POST /api/portability/decide
Content-Type: application/json

{
  "caseId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "success": true,
  "recommendation": {
    "decision": "APPROVE_WITH_CONDITIONS",
    "action": "Issue Policy with Rider",
    "priority": "Standard Processing",
    "overallRiskScore": "45",
    "confidence": "87",
    "categories": {
      "underwritingRisk": {
        "riskScore": 0.65,
        "issueCount": 2,
        "severity": "Medium"
      },
      "dataIntegrity": {
        "riskScore": 0.45,
        "mismatchCount": 1,
        "fraudIndicatorCount": 0,
        "severity": "Medium"
      },
      "medicalCompleteness": {
        "riskScore": 0.20,
        "completenessPercent": "80",
        "missingFields": [],
        "severity": "Low"
      },
      "coverageAlignment": {
        "riskScore": 0.35,
        "gapCount": 1,
        "sumInsured": 500000,
        "severity": "Low"
      },
      "documentQuality": {
        "riskScore": 0.06,
        "ocrConfidence": 0.94,
        "pageCount": 8,
        "scanQuality": "Good",
        "severity": "Low"
      },
      "fraudRisk": {
        "riskScore": 0.35,
        "indicatorCount": 1,
        "severity": "Low"
      }
    },
    "reasoning": "underwritingRisk: Medium - Risk score 65%; dataIntegrity: Medium - Risk score 45%"
  }
}
```

---

### 7. Get Case Details

Retrieve complete case information with all analysis results.

**Request:**
```
GET /api/portability/case/550e8400-e29b-41d4-a716-446655440000
```

**Response (200):**
```json
{
  "success": true,
  "case": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "policyId": "POL_2024_001",
    "applicantId": "APL_001",
    "createdAt": "2026-05-28T10:30:00Z",
    "status": "COMPLETED",
    "uploadId": "660f9401-f30c-42e5-b807-557766551111",
    "steps": {
      "upload": {
        "completed": true,
        "data": { "uploadId": "...", "policyId": "..." }
      },
      "extract": {
        "completed": true,
        "data": { "policyNumber": "...", "insurer": "..." }
      },
      "appData": {
        "completed": true,
        "data": { "applicantName": "...", "age": 49 }
      },
      "anomalies": {
        "completed": true,
        "data": [ { "type": "Data Mismatch", ... } ]
      },
      "fraud": {
        "completed": true,
        "data": [ { "type": "Document Quality", ... } ]
      },
      "recommendation": {
        "completed": true,
        "data": { "decision": "APPROVE_WITH_CONDITIONS", ... }
      }
    }
  }
}
```

**Error (404):**
```json
{
  "error": "Case not found"
}
```

---

### 8. Get Case Report

Generate comprehensive report for a case.

**Request:**
```
GET /api/portability/report/550e8400-e29b-41d4-a716-446655440000
```

**Response (200):**
```json
{
  "success": true,
  "report": {
    "caseId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-05-28T10:40:00Z",
    "status": "COMPLETED",
    "sections": {
      "extraction": {
        "policyNumber": "NBHI/2024/001234",
        "insurer": "NivaBupa Health Insurance",
        "enrolleeName": "Rajesh Kumar",
        "confidence": 0.94
      },
      "anomalies": [
        {
          "type": "Data Mismatch",
          "severity": "High",
          "description": "Condition not in application"
        }
      ],
      "fraud": [
        {
          "type": "Document Quality",
          "severity": "Low"
        }
      ],
      "recommendation": {
        "decision": "APPROVE_WITH_CONDITIONS",
        "overallRiskScore": 0.45
      }
    }
  }
}
```

---

### 9. List All Cases

Get list of all portability cases.

**Request:**
```
GET /api/portability/cases
```

**Response (200):**
```json
{
  "success": true,
  "cases": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-05-28T10:30:00Z",
      "status": "COMPLETED",
      "progressPercent": 100
    },
    {
      "id": "660f9401-f30c-42e5-b807-557766551111",
      "createdAt": "2026-05-28T09:15:00Z",
      "status": "DRAFT",
      "progressPercent": 20
    }
  ],
  "total": 2
}
```

---

### 10. Update Case

Update case with additional data.

**Request:**
```
PUT /api/portability/case/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "step": "extract",
  "data": {
    "policyNumber": "UPDATED/001",
    "premium": 15000
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "case": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "DRAFT",
    "steps": {
      "extract": {
        "completed": true,
        "data": { "policyNumber": "UPDATED/001", "premium": 15000 }
      }
    }
  }
}
```

---

### 11. Get Demo Data

Retrieve synthetic test data for development and demonstrations.

**Request:**
```
GET /api/portability/demo-data
```

**Response (200):**
```json
{
  "success": true,
  "policies": [
    {
      "id": "POL_2024_001",
      "insurer": "NivaBupa Health Insurance",
      "policyNumber": "NBHI/2024/001234",
      "enrolleeName": "Rajesh Kumar",
      "sumInsured": 500000,
      "premium": { "annual": 12500 }
    },
    {
      "id": "POL_2024_002",
      "insurer": "Tata AIG General Insurance",
      "policyNumber": "TAIG/2024/005678",
      "enrolleeName": "Priya Sharma",
      "sumInsured": 1000000,
      "premium": { "annual": 24000 }
    },
    {
      "id": "POL_2024_003",
      "insurer": "Max Bupa Health Insurance",
      "policyNumber": "MAXB/2024/009999",
      "enrolleeName": "Ramesh Iyer",
      "sumInsured": 300000,
      "premium": { "annual": 18000 }
    }
  ],
  "applications": [
    {
      "id": "APP_2024_001",
      "applicantName": "Rajesh Kumar",
      "age": 49,
      "status": "Approved"
    },
    {
      "id": "APP_2024_002",
      "applicantName": "Priya Sharma",
      "age": 42,
      "status": "Approved"
    }
  ]
}
```

---

## Data Models

### Case Object

```javascript
{
  id: string,              // UUID
  policyId: string,        // Reference to policy
  applicantId: string,     // Reference to applicant
  createdAt: datetime,     // ISO 8601
  status: enum,            // DRAFT, IN_PROGRESS, COMPLETED
  uploadId: string,        // ID of uploaded document
  steps: {
    upload: { completed: bool, data: object },
    extract: { completed: bool, data: object },
    appData: { completed: bool, data: object },
    anomalies: { completed: bool, data: array },
    fraud: { completed: bool, data: array },
    recommendation: { completed: bool, data: object }
  }
}
```

### Anomaly Object

```javascript
{
  type: string,            // Data Mismatch, Coverage Gap, etc.
  severity: enum,          // Low, Medium, High
  description: string,     // Human-readable description
  riskScore: number,       // 0.0 to 1.0
  details: object          // Type-specific details
}
```

### Fraud Indicator Object

```javascript
{
  type: string,            // Document Quality, Medical Inconsistency, etc.
  severity: enum,          // Low, Medium, High, Critical
  description: string,     // Human-readable description
  confidence: number,      // 0.0 to 1.0
  riskScore: number,       // 0.0 to 1.0
  details: object          // Optional details
}
```

### Recommendation Object

```javascript
{
  recommendation: {
    decision: enum,        // APPROVE, APPROVE_WITH_CONDITIONS, CONDITIONAL_APPROVE, DENY
    action: string,        // Action to take
    priority: string       // Processing priority
  },
  overallRiskScore: number, // 0.0 to 1.0
  confidence: number,       // 0.0 to 1.0
  categories: {
    underwritingRisk: {},
    dataIntegrity: {},
    medicalCompleteness: {},
    coverageAlignment: {},
    documentQuality: {},
    fraudRisk: {}
  },
  details: {
    reasoning: string      // Decision reasoning
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 404 | Not Found (case/resource doesn't exist) |
| 500 | Server Error |

---

## Error Responses

Standard error response format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

Examples:

```json
{
  "error": "Case not found"
}
```

```json
{
  "error": "Invalid application ID"
}
```

---

## Rate Limiting

No rate limits implemented in MVP. Production implementation should include:

- 100 requests/minute per user
- 1000 requests/hour per API key
- 60-second lockout after exceeding limits

---

## Pagination

Not yet implemented. For future versions:

```
GET /api/portability/cases?page=1&limit=20
```

---

## Filtering

Not yet implemented. For future versions:

```
GET /api/portability/cases?status=COMPLETED&createdAfter=2026-05-01
```

---

## Webhooks

Not yet implemented. For future versions:

```
POST /api/portability/webhooks
{
  "url": "https://example.com/webhook",
  "events": ["case.completed", "case.anomaly.detected"]
}
```

---

## Versioning

Current API version: **1.0**

Future versions will be supported at `/api/v2/portability/*`

---

## CORS

CORS is enabled for all origins. For production, restrict to specific domains:

```javascript
{
  origin: 'https://yourdomain.com',
  credentials: true
}
```

---

## Testing Endpoints

### Create and Complete a Case (Full Flow)

```bash
# 1. Create case
curl -X POST http://localhost:3000/api/portability/cases \
  -H "Content-Type: application/json" \
  -d '{"policyId":"POL_2024_001","applicantId":"APL_001"}'

# 2. Upload document (replace CASE_ID)
curl -X POST http://localhost:3000/api/portability/upload \
  -H "Content-Type: application/json" \
  -d '{"caseId":"CASE_ID","fileName":"test.pdf","fileType":"PDF"}'

# 3. Extract policy data
curl -X POST http://localhost:3000/api/portability/extract \
  -H "Content-Type: application/json" \
  -d '{"caseId":"CASE_ID","policyId":"POL_2024_001"}'

# 4. Compare and detect anomalies
curl -X POST http://localhost:3000/api/portability/compare \
  -H "Content-Type: application/json" \
  -d '{"caseId":"CASE_ID","applicationId":"APP_2024_001"}'

# 5. Run fraud detection
curl -X POST http://localhost:3000/api/portability/fraud-check \
  -H "Content-Type: application/json" \
  -d '{"caseId":"CASE_ID"}'

# 6. Generate recommendation
curl -X POST http://localhost:3000/api/portability/decide \
  -H "Content-Type: application/json" \
  -d '{"caseId":"CASE_ID"}'

# 7. Get full case details
curl http://localhost:3000/api/portability/case/CASE_ID

# 8. Get report
curl http://localhost:3000/api/portability/report/CASE_ID
```

---

## Support

For API questions or issues:
- Check the setup guide: `PORTABILITY_PLUS_SETUP.md`
- Review architecture docs: `PIVOT_PORTABILITY_PLUS_ARCHITECTURE.md`
- See example responses in this document

---

**Last Updated**: May 28, 2026
**API Version**: 1.0 MVP
