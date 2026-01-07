# PIVOT-Baseline-V2

## Backup Information
- **Created**: January 2, 2026 (Updated)
- **Version**: V2 Baseline - Latest Stable Version
- **Purpose**: Complete backup snapshot with all recent enhancements

## Recent Updates Since Initial V2
- ✅ **Fixed Score Configuration Page**: Full implementation with JSON-aligned criteria
- ✅ **Enhanced Underwriter Flags**: Removed Additional Information section
- ✅ **Cleaned Policy Overview**: Reordered fields (Insurer → Type → Period → Product → Number)
- ✅ **Fixed Sum Insured Logic**: Policy type-aware field checking
- ✅ **Added Individual Cumulative Bonus**: New column in Insured Snapshot table
- ✅ **Removed Redundant Fields**: Proposer/Insured names removed from Underwriter Flags
- ✅ **Collapsible Score Details**: "How this score was calculated" now collapsible

## Project Structure
```
PIVOT-Baseline-V2/
├── public/                 # Frontend assets
│   ├── app-new.js         # Main application (updated with latest fixes)
│   ├── app.js             # Previous version backup
│   ├── index.html         # HTML entry point
│   ├── assets/            # Static assets
│   └── logos/             # Logo files
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── .env                   # Environment variables
└── README.md              # This file
```

## Key Features in V2 (Latest)
- ✅ **Complete Demo Page**: All sections functional with proper layout
- ✅ **Enhanced UI**: Policy Summary, Underwriter Flags, color-coded scores
- ✅ **Responsive Tables**: Insured member data with Individual Cumulative Bonus
- ✅ **Proper Field Mapping**: Correct JSON field usage throughout
- ✅ **Score Configuration**: Working configuration page with JSON alignment
- ✅ **Clean Underwriter Flags**: Focused on critical portability data
- ✅ **Policy Type Logic**: Smart sum insured checking based on policy type
- ✅ **Professional Layout**: Reordered and optimized information hierarchy

## Dependencies
- **Node.js**: Express server framework
- **Frontend**: Pure JavaScript with React (global)
- **Styling**: Tailwind CSS classes
- **API Integration**: ML processing service

## Environment Configuration
- **Port**: 3000
- **API Endpoint**: PIVOT-Port-PolDoc-Health service
- **Authentication**: API key configured

## Recovery Instructions
To restore from this backup:
1. Replace current project files with V2 backup files
2. Run `npm install` to restore dependencies
3. Start server with `npm start`
4. Verify all components render correctly

## Known Working State
- ✅ Demo page loads without JSX errors
- ✅ File upload and analysis functional
- ✅ Portability scoring works correctly
- ✅ Policy summary displays properly with reordered fields
- ✅ Underwriter flags show accurate data with fixed sum insured logic
- ✅ Score Configuration page fully functional
- ✅ Insured Snapshot table includes Individual Cumulative Bonus
- ✅ All navigation functions correctly

## Files Status
- **app-new.js**: Updated with latest enhancements (current main application)
- **server.js**: 9,063 bytes (backend server)
- **package.json**: 350 bytes (dependencies)
- **package-lock.json**: 43,499 bytes (locked versions)
- **.env**: 137 bytes (environment config)
- **index.html**: 1,431 bytes (frontend entry)

## Recent Improvements
1. **Score Configuration**: Complete implementation with JSON field mapping
2. **Underwriter Flags**: Streamlined to show only critical portability data
3. **Policy Overview**: Reordered for better business logic flow
4. **Sum Insured Logic**: Policy type-aware field checking (FLOATER vs INDIVIDUAL)
5. **Insured Snapshot**: Added Individual Cumulative Bonus column
6. **UI Enhancements**: Collapsible sections, cleaner layout

## Notes
- This baseline represents the latest stable working state
- All JSX syntax errors have been resolved
- UI enhancements are complete and functional
- Score Configuration page is fully implemented
- Field mappings align with actual JSON structure
- Ready for future development with rollback capability

## Version History
- **V2 Initial**: Basic layout and functionality
- **V2 Updated**: Current version with all enhancements listed above
