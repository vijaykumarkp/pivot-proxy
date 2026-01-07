# PIVOT-Baseline-V1

**DO NOT MODIFY — USE AS FALLBACK**

## What This Snapshot Represents
This is a frozen, working demo of the PIVOT Portability Module with:
- Live API integration to PIVOT backend service
- Complete UI with Policy Summary, Portability Score, and Underwriter Flags
- Real-time policy document analysis and scoring
- JSON response viewer for debugging

## API Configuration
- **Endpoint**: `/api/ml_process` (proxies to external PIVOT API)
- **External API**: `https://PIVOT-Port-PolDoc-Health.Attributum.com/api/ml_process`
- **Authentication**: Api-Key header with environment variable

## Required Environment Variables
- `PORT` - Server port (default: 3000)
- `API_KEY` - PIVOT API authorization key
- `API_BASE_URL` - External API base URL

## Features Included
- Upload and analyze policy documents (PDF, JPG, JPEG, PNG)
- Real-time portability scoring with configurable criteria
- Policy Summary with Coverage Details and Insured Members table
- Underwriter Flags for risk assessment
- Full JSON response viewer (collapsible)
- Responsive design with optimized spacing

## File Structure
```
PIVOT-Baseline-V1/
├── public/
│   ├── index.html          # Main HTML page
│   ├── app-new.js          # React UI application
│   └── logos/              # Company logos
├── server.js               # Express server with API proxy
├── .env                    # Environment variables (template)
├── package.json           # Node.js dependencies
└── README.md              # This file
```

## Restoration Instructions
To restore this baseline:
1. Copy all files from PIVOT-Baseline-V1/ to the main project directory
2. Ensure .env file contains valid API_KEY
3. Run: `node server.js`
4. Access: http://localhost:3000

## Runtime Behavior
- Upload form accepts policy documents
- API calls use real PIVOT service (not mock data)
- Scoring calculations based on configurable criteria
- All UI elements functional and responsive
- No modifications to logic or layout

## Version Information
- Created: December 30, 2025
- Status: Frozen working demo
- Purpose: Fallback baseline for recovery

**IMPORTANT: This baseline preserves the exact working state. Do not modify any files in this directory.**
