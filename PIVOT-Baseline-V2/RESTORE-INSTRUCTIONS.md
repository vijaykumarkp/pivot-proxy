# PIVOT-Baseline-V2 Restore Instructions

## Quick Restore
```bash
# Navigate to project root
cd /Users/vijaykumarkp/pivot-proxy

# Backup current state (optional)
cp -r . current-backup-$(date +%Y%m%d-%H%M%S)

# Restore from V2 baseline
rm -rf public server.js package.json package-lock.json .env
cp -r PIVOT-Baseline-V2/* .

# Reinstall dependencies
npm install

# Start server
npm start
```

## File-by-File Restore
If you need to restore specific files:

### Core Application Files
```bash
# Main application (latest version with all enhancements)
cp PIVOT-Baseline-V2/public/app-new.js public/app-new.js

# Server
cp PIVOT-Baseline-V2/server.js server.js

# Dependencies
cp PIVOT-Baseline-V2/package.json package.json
cp PIVOT-Baseline-V2/package-lock.json package-lock.json

# Environment
cp PIVOT-Baseline-V2/.env .env

# HTML entry point
cp PIVOT-Baseline-V2/public/index.html public/index.html
```

### Static Assets
```bash
# All public assets
cp -r PIVOT-Baseline-V2/public/* public/
```

## Verification Checklist
After restore, verify:

- [ ] Server starts without errors (`npm start`)
- [ ] Demo page loads at http://localhost:3000
- [ ] File upload works
- [ ] Portability scoring functions
- [ ] Policy summary displays correctly with reordered fields
- [ ] Underwriter flags show proper data (no Additional Information section)
- [ ] Sum Insured flag works correctly based on policy type
- [ ] Insured Snapshot table includes Individual Cumulative Bonus
- [ ] Score Configuration page loads and functions
- [ ] Collapsible "How this score was calculated" works
- [ ] No JSX syntax errors in console

## Known Working State (Latest V2)
This V2 baseline includes:

### Core Features
- ✅ **Complete Demo Page**: All sections functional with proper layout
- ✅ **Enhanced UI**: Policy Summary, Underwriter Flags, color-coded scores
- ✅ **Responsive Tables**: Insured member data with Individual Cumulative Bonus
- ✅ **Proper Field Mapping**: Correct JSON field usage throughout

### Recent Enhancements
- ✅ **Score Configuration**: Working configuration page with JSON alignment
- ✅ **Clean Underwriter Flags**: Removed Additional Information section
- ✅ **Reordered Policy Overview**: Insurer → Type → Period → Product → Number
- ✅ **Smart Sum Insured Logic**: Policy type-aware field checking
- ✅ **Individual Cumulative Bonus**: New column in Insured Snapshot
- ✅ **Collapsible Score Details**: Better UI organization

### Layout Structure
```
Two-column layout:
┌─────────────────┬─────────────────┐
│  Upload Policy  │ Portability Score│
│   (top-left)    │   (top-right)   │
├─────────────────┼─────────────────┤
│  Policy Summary │ Underwriter Flags│
│ (below upload)  │ (below score)   │
└─────────────────┴─────────────────┘
```

## Troubleshooting
If issues occur after restore:

1. **Clear browser cache** and reload
2. **Check Node.js version** compatibility
3. **Verify API endpoint** is accessible
4. **Check environment variables** in .env file
5. **Reinstall dependencies**: `rm -rf node_modules && npm install`

## Rollback Safety
Before making major changes, create a new backup:
```bash
cp -r . PIVOT-Baseline-V3-$(date +%Y%m%d-%H%M%S)
```

## Contact Information
- **Created**: January 2, 2026 (Updated)
- **Purpose**: Latest stable baseline with all enhancements
- **Status**: Production-ready, all features functional
- **Version**: V2 Updated with recent improvements

## Key Improvements in This Version
1. **Score Configuration Page**: Fully implemented with JSON field mapping
2. **Underwriter Flags**: Streamlined to critical portability data only
3. **Policy Overview**: Reordered for better business logic
4. **Sum Insured Logic**: Policy type-aware (FLOATER vs INDIVIDUAL)
5. **Insured Snapshot**: Added Individual Cumulative Bonus column
6. **UI Enhancements**: Collapsible sections, cleaner interface
