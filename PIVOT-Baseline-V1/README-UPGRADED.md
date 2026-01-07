# PIVOT-Baseline-V1 - Upgraded Version

**DO NOT MODIFY — USE AS FALLBACK**

## What This Snapshot Represents
This is a frozen, upgraded demo of the PIVOT Portability Module with:
- Live API integration to PIVOT backend service
- Complete UI with Policy Summary, Portability Score, and Underwriter Flags
- Real-time policy document analysis and scoring
- JSON response viewer for debugging
- Enhanced visual hierarchy and professional styling
- Image file upload support (JPG, JPEG, PNG)
- Improved scoring criteria configuration with descriptions
- Robust field mapping for policy data

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
- Underwriter Flags for risk assessment with professional styling
- Full JSON response viewer (collapsible)
- Responsive design with optimized spacing
- Enhanced visual hierarchy for better user experience
- File validation with clear error messages
- Professional scoring criteria configuration page

## Key Enhancements from Original
1. **Visual Hierarchy**: Enhanced Portability Score and Underwriter Flags prominence
2. **File Support**: Added image file uploads (JPG, JPEG, PNG) with validation
3. **Field Mapping**: Robust mapping for first policy start date and other fields
4. **UI Styling**: Professional, enterprise-ready color schemes
5. **Configuration**: Detailed descriptions for scoring criteria
6. **Error Handling**: Improved file validation and user feedback

## File Structure
```
PIVOT-Baseline-V1/
├── public/
│   ├── index.html          # Main HTML page
│   ├── app-new.js          # React UI application (upgraded)
│   └── logos/              # Company logos
├── server.js               # Express server with API proxy
├── .env                    # Environment variables (template)
├── package.json           # Node.js dependencies
├── README.md              # Original documentation
└── README-UPGRADED.md     # This file
```

## Restoration Instructions
To restore this upgraded baseline:
1. Copy all files from PIVOT-Baseline-V1/ to the main project directory
2. Ensure .env file contains valid API_KEY
3. Run: `node server.js`
4. Access: http://localhost:3000

## Runtime Behavior
- Upload form accepts policy documents (PDF, JPG, JPEG, PNG)
- API calls use real PIVOT service (not mock data)
- Scoring calculations based on configurable criteria
- Enhanced UI with professional styling and better user experience
- All UI elements functional and responsive
- No modifications to core logic or layout

## Version Information
- Created: December 30, 2025
- Status: Frozen upgraded demo with all enhancements
- Purpose: Enhanced fallback baseline with improved features

**IMPORTANT: This baseline preserves the upgraded working state with all enhancements. Do not modify any files in this directory.**
