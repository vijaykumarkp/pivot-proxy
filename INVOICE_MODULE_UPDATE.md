# PIVOT Invoices Module - Journal Entry Upload Format Update

## Changes Made

### 1. AI Extraction Prompt (server.js - line 900)
**Before:** Simple field extraction (vendor_name, gstin, pan, etc.)

**After:** Rich extraction with:
- All vendor details (name, code, GSTIN, PAN, address)
- Line items array with description, HSN/SAC, taxable_value, gst_rate, qty
- Separate fields for taxable_value_total, cgst_amount, sgst_amount, igst_amount
- Properly formatted dates (YYYY-MM-DD and YYYY-MM-DD HH:MM:SS)

### 2. Excel Output Format (server.js - /api/invoices/download)
**Before:** Simple tabular export with basic vendor info

**After:** Exact match to journal entry upload format with:
- **Sheet 1: "details to be captured"** — Field reference guide (44 rows, 2 columns)
- **Sheet 2: "upload format"** — Journal entry lines ready for RS/ERP upload (56 columns)

### 3. Journal Entry Line Generation
Each invoice automatically generates multiple journal entry lines:
1. **Expense Debit Line** — Main invoice amount to expense GL code
2. **SGST Input Credit** — If SGST present
3. **CGST Input Credit** — If CGST present
4. **IGST Input Credit** — If IGST present
5. **Vendor Credit Line** — Total invoice amount to vendor payable

### 4. Excel Column Structure (56 columns)
```
L id | Acc Period | Trans Date | Account Code | Description | Curr Code |
Trans Amount | Dr_Cr | Jrnal Type | Jrnal Source | Reference | Description |
Asset Code | Asset Indicator | Asset/Item Qty | Due Date | Branch Analysis Code |
Product Analysis Code | ChannelAnalysisCode | Sub-Channel Analysis Code |
Underwriting Year Analysis Code | Employee Code Analysis Code |
TDS Applicability Analysis Code | Department Analysis Code |
Sequence Code Analysis Code | Vendor Code Analysis Code | Invoice Date |
From Date | To Date | Addl Date 4 | Addl Date 5 | Cheque & NEFT Number |
Invoice Number | Additional Remarks | Additional Remarks 2 |
CREDENCE DESCRIPTION | HSN/SAC NO | Taxable on Amount |
Reverse Charge (Y/N) | Reverse charge % | Item Details (Sr.No) |
Goods/Service | GST Tax Rate | Original Invoice for Dr/Cr Notes |
Advance Challan No | Addl Description 15-25 (12 columns)
```

### 5. Frontend Display Updates (app-new.js)
- Shows line items in tabular format with description, HSN/SAC, amount, GST %
- Displays all GST components (CGST, SGST, IGST) if available
- Shows formatted amounts with ₹ symbol and Indian number formatting

## GL Codes Used (Sample - Configure as needed)
- **1310020100** — Expense/Repairs account
- **1120599005** — GST Input Credit - SGST
- **1120599007** — GST Input Credit - CGST
- **1120599009** — GST Input Credit - IGST (can be updated)
- **Vendor Code** — Used for vendor payable account

## Configuration Notes
You can customize:
- GL codes in the journal entry generation logic
- Branch codes, analysis codes, TDS flags per your Chart of Accounts
- Journal types (SEXPS, HEXPS, SPYMT, etc.)

## Testing Checklist
- [ ] Upload a single invoice PDF/image
- [ ] Verify line items are extracted correctly
- [ ] Check all GST components are captured
- [ ] Download Excel file
- [ ] Verify Sheet 1 shows field reference
- [ ] Verify Sheet 2 has correct number of rows (1 header + 5 lines per invoice)
- [ ] Verify all 56 columns are populated correctly
- [ ] Load Excel into RS/ERP system and validate

## Next Steps
- Customize GL codes to match your Chart of Accounts
- Add multi-line item support (currently uses first line item as default)
- Add TDS determination logic based on vendor type
- Add payment method mapping (NEFT, Cheque, etc.)
