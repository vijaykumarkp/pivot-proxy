# PIVOT-Baseline-V3 - Restore Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup
```bash
# Navigate to the PIVOT-Baseline-V3 directory
cd PIVOT-Baseline-V3

# Install dependencies
npm install

# Start the development server
npm start

# Open browser and navigate to:
# http://localhost:3000
```

### Alternative: Using yarn
```bash
# Install dependencies
yarn install

# Start development server
yarn start
```

## 📁 Project Structure

```
PIVOT-Baseline-V3/
├── app-new.js                 # Main application file (copy from public/)
├── package.json              # Dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── server.js                 # Express server configuration
├── .env                      # Environment variables
├── public/                   # Static assets directory
│   ├── app-new.js           # Main application (primary)
│   ├── logos/               # Logo assets
│   └── ...                  # Other static files
├── README.md                # Complete documentation
├── SCORING-ENHANCEMENTS-SUMMARY.md
├── VALIDATION-CHECKLIST.md
└── RESTORE-INSTRUCTIONS.md   # This file
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Copy this template to .env file
PORT=3000
NODE_ENV=development
```

### Server Configuration
The Express server is configured to:
- Serve static files from `/public` directory
- Handle CORS for development
- Provide fallback to `index.html` for SPA routing

## 🎯 Key Features

### Additive Scoring System
- **Total Score**: 100 points (sum of 5 components)
- **No Weights**: Pure additive model
- **Transparent**: Every point traceable to specific conditions

### Scoring Components
1. **Data Availability** (30 points max): Proportional field completeness
2. **PED Declaration** (15 points): Risk factor (0 if PED declared)
3. **Policy Currency** (15 points): Within expiry threshold
4. **Policy Continuity** (20 points): First policy started data
5. **High Sum Insured Risk** (20 points): Individual + floater limits

### PED Logic (Risk Factor)
- **No PED**: Full 15 points
- **Any PED**: 0 points (risk reduction)
- **Variations Handled**: "No PED declared", "none", "No PED", etc.

### Date Format
- **Standard**: DD/MM/YYYY
- **Validation**: Proper parsing with error handling
- **Examples**: "31/12/2024", "15/06/2024"

## 🎨 User Interface

### Pages
1. **Portability Demo**: Main scoring interface
2. **PIVOT Portability Score Settings**: Configuration page

### Key UI Elements
- **Score Card**: Visual score display with verdict
- **Scoring Breakdown**: Expandable detailed component analysis
- **Underwriter Flags**: Failed conditions with point impact
- **Settings Panel**: Configurable thresholds and points

## 🔧 Customization

### Scoring Configuration
Access via "PIVOT Portability Score Settings" page:

1. **Data Availability**: Adjust max points (default: 30)
2. **PED Declaration**: Modify points (default: 15)
3. **Policy Currency**: Configure points + days threshold (default: 15, 30 days)
4. **Policy Continuity**: Set points (default: 20)
5. **High Sum Insured Risk**: Points + individual/floater limits (default: 20, ₹5L/₹10L)

### JSON Field Mapping
Critical fields for scoring:
```json
{
  "policy_and_coverage_details": {
    "policy_number": "Required",
    "policy_start_date": "Required (DD/MM/YYYY)",
    "policy_end_date": "Required (DD/MM/YYYY)",
    "floater_basic_sum_insured": "Required for risk assessment"
  },
  "insured_details": [
    {
      "age": "Required",
      "individual_policy_sum_insured": "Required",
      "declared_ped": "Required (PED risk assessment)",
      "first_policy_started": "Required for continuity"
    }
  ],
  "proposer_details": {
    "first_name": "Required",
    "last_name": "Required"
  }
}
```

## 🚀 Deployment

### Development
```bash
npm start
# Server runs on http://localhost:3000
```

### Production
```bash
# Build for production (if needed)
npm run build

# Start production server
npm run start:prod
```

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Testing

### Manual Testing Steps
1. **Load Sample Data**: Use provided JSON examples
2. **Verify Scoring**: Check component scores add to final score
3. **Test Configuration**: Modify settings and verify persistence
4. **Validate PED Logic**: Test with PED and no-PED scenarios
5. **Date Format Testing**: Verify DD/MM/YYYY parsing

### Automated Testing (if implemented)
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Common Issues

#### Score Not Calculating
- **Check**: JSON data structure matches expected format
- **Verify**: All required fields present
- **Confirm**: Date format is DD/MM/YYYY

#### PED Logic Not Working
- **Check**: PED field values in JSON
- **Verify**: Case insensitive matching
- **Confirm**: "No PED declared" variations handled

#### Date Parsing Errors
- **Check**: Date format is DD/MM/YYYY
- **Verify**: Valid date values
- **Confirm**: No MM/DD/YYYY format data

#### Settings Not Persisting
- **Check**: Browser localStorage enabled
- **Verify**: No localStorage quota exceeded
- **Confirm**: Settings JSON structure valid

### Debug Mode
Add console logging for debugging:
```javascript
// In calculateScore function
console.log('Scoring debug:', {
  responseData,
  settings,
  breakdown
});
```

## 📞 Support

### Documentation
- **README.md**: Complete feature documentation
- **SCORING-ENHANCEMENTS-SUMMARY.md**: Technical changes
- **VALIDATION-CHECKLIST.md**: Quality assurance checklist

### Key Contacts
- **Development**: Refer to project documentation
- **Business Logic**: See scoring enhancement summary
- **Technical Issues**: Check validation checklist

## 🔄 Migration from Previous Versions

### From V2 to V3
**Breaking Changes:**
- Scoring model completely changed (weighted → additive)
- PED logic inverted (reward → penalty)
- Date format changed (MM/DD/YYYY → DD/MM/YYYY)
- UI structure streamlined

**Migration Steps:**
1. **Backup Current Settings**: Export any custom configurations
2. **Reset Settings**: Use default V3 settings
3. **Reconfigure**: Apply business rules using new additive model
4. **Validate**: Test with sample data
5. **Train Users**: Update documentation for new scoring logic

### Data Compatibility
- **Input JSON**: Same structure supported
- **Settings Storage**: Automatic migration on first load
- **API Endpoints**: No changes required

## 🎉 Success Criteria

### Functional Requirements
- [x] Additive scoring (100 points total)
- [x] PED as risk factor (inverted logic)
- [x] DD/MM/YYYY date support
- [x] "Policy Continuity" naming
- [x] Streamlined UI
- [x] Full configurability

### Quality Requirements
- [x] Deterministic scoring
- [x] Error handling
- [x] Performance optimization
- [x] Cross-browser compatibility
- [x] Responsive design

### Business Requirements
- [x] Predictable scoring
- [x] Transparent logic
- [x] Configurable rules
- [x] Audit readiness
- [x] User-friendly interface

---

**Restore Status: ✅ COMPLETE**
**PIVOT-Baseline-V3** is fully restored and operational with complete additive scoring system, PED risk factor logic, DD/MM/YYYY date support, and streamlined UI.
