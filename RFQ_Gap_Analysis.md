# PIVOT RFQ Module - Gap Analysis Report

## Client Sheet vs PIVOT RFQ: What's Missing?

Comparison between the client's required output sheet ("Quote - Field Names.xlsx") and what PIVOT RFQ currently extracts + displays in the UI.

---

## SECTION 1: MISSING FIELDS (Client needs but PIVOT doesn't have)

### Fresh Quote - Missing Fields

| # | Client Field | Section it belongs to | Notes |
|---|---|---|---|
| 1 | Ambulance Amount | Cover & Benefits | Client has separate "Ambulance Amount" (1000, 1500, 2000, 2500) in addition to "Ambulance" selection |
| 2 | Alternate Email ID - 1 | Channel & Intermediary | Contact field for alternate email |
| 3 | Alternate SM Contact - 1 | Channel & Intermediary | Contact field for alternate SM |
| 4 | Alternate Email ID - 2 | Channel & Intermediary | Second alternate email |

### Renewal Quote - Additional Missing Fields

| # | Client Field | Section it belongs to | Notes |
|---|---|---|---|
| 5 | Terms required in Market Rollover | Existing Policy | Options: "Expiring Terms" or "Proposed Terms" |
| 6 | Channel Mobile Number | Channel & Intermediary | Separate from SM Contact |
| 7 | Is Emoha | Restrictions & Eligibility | Options: Applicable / Not Applicable |
| 8 | Quote With Rewards Percentage | Channel & Intermediary | Free text numeric entry |
| 9 | Alternate SM Contact - 2 | Channel & Intermediary | Second alternate SM contact |

**Total missing fields: 9**

---

## SECTION 2: EXTRA FIELDS IN PIVOT (PIVOT has but client sheet doesn't list)

| # | PIVOT Field | PIVOT Section | Assessment |
|---|---|---|---|
| 1 | female_employee_parents_in_law | Restrictions & Eligibility | NOT in client sheet - may be an internal field or outdated |
| 2 | unmarried_employee_parents | Restrictions & Eligibility | NOT in client sheet - may be an internal field or outdated |

**Note:** These 2 fields exist in PIVOT but are not in the client's required output. Confirm with client whether to keep or remove.

---

## SECTION 3: LOV / DROPDOWN VALUE MISMATCHES

These are fields where the allowed values in PIVOT don't match the client's required dropdown options.

### 3.1 Quote Type - MAJOR MISMATCH

| Client Sheet Values | PIVOT Current Values |
|---|---|
| Base | Base |
| Topup | Top-up (different spelling) |
| **Super-Topup** | MISSING from PIVOT |
| **Parents Only** | Parent (different label) |
| -- | Parent-Top Up (not in client sheet) |
| **Students Only** | Student (different label) |
| -- | Student-Top Up (not in client sheet) |
| Flex Plan | Flex Plan |
| Base+Flex Plan | Base+Flex Plan |
| **OPD** | MISSING from PIVOT |
| -- | Maternity (not in client sheet) |
| -- | Cancer (not in client sheet) |
| -- | Multiply Wellness (not in client sheet) |

**Action needed:** Add "Super-Topup" and "OPD" to PIVOT. Align naming: "Topup" vs "Top-up", "Parents Only" vs "Parent", "Students Only" vs "Student". Decide whether to keep Maternity/Cancer/Multiply Wellness.

### 3.2 Business Type - MISMATCH

| Client Sheet Values | PIVOT Current |
|---|---|
| Fresh (for new quotes) | Not defined as LOV dropdown |
| Own Renewal (for renewals) | Not defined as LOV dropdown |
| Market Rollover (for renewals) | Not defined as LOV dropdown |

**Action needed:** Add business_type LOV with values: Fresh, Own Renewal, Market Rollover

### 3.3 Normal Room Rent - MISSING VALUES

Client has additional values NOT in PIVOT:
- 3% of Sum Insured per day
- 4% of Sum Insured per day
- "Single standard ac room" (renewal sheet uses this instead of "Single Private Room")

PIVOT has values NOT in client sheet:
- "Deluxe room"

### 3.4 ICU Rent - MISSING VALUES

Client has additional values NOT in PIVOT:
- 3% of Sum Insured per day
- 4% of Sum Insured per day
- 7500, 9000, 8500 (specific amounts)

### 3.5 Co-Payment / Copay - FORMAT MISMATCH

| Client Sheet | PIVOT Current |
|---|---|
| No co-pay, 10%, 15%, 20%, 25%, 30% | No Co-pay, 0.1, 0.15, 0.2, 0.25, 0.3 |

Fresh sheet uses percentages (10%, 15%...), Renewal sheet uses plain numbers (0, 10, 20, 30, 40).
PIVOT uses decimal fractions (0.1, 0.15...).

**Action needed:** Align format - recommend using percentage display (10%, 15%, etc.)

### 3.6 Parental Co-Pay - MISSING "No Copay" OPTION

| Client Sheet | PIVOT Current |
|---|---|
| No Copay, 10, 15, 20, 25, 30 | 0.1, 0.15, 0.2, 0.25, 0.3 |

**Action needed:** Add "No Copay" option. Align number format.

### 3.7 Parent SI Restriction - LABEL MISMATCH

| Client Sheet | PIVOT Current |
|---|---|
| Not Covered, 25% of FSI, 50% of FSI, 75% of FSI | 25% of Family SI, 50% of Family SI, 75% of Family SI, Upto FSI |

**Action needed:** Add "Not Covered" option. Decide on "FSI" vs "Family SI" naming.

### 3.8 Ambulance - MISSING VALUES

| Client Sheet (Renewal) | PIVOT Current |
|---|---|
| 0, 1000, 2000, 2500, 3000, 5000 | 1000, 1500, 2000, 2500, 5000, Covered upto Actual Expenses |

**Action needed:** Add "0" and "3000". Decide on "Covered upto Actual Expenses" and "1500".

### 3.9 OPD - MISSING VALUES

| Client Sheet (Renewal) | PIVOT Current |
|---|---|
| 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000 | No OPD Cover, 1000, 2000, 5000, 10000 |

**Action needed:** Add values 3000, 4000, 6000, 7000, 8000, 9000. Add "0" option.

### 3.10 Corporate Buffer - MISSING "0" OPTION

Client renewal sheet includes "0" as an option. PIVOT only has "NO CB".

### 3.11 Lasik - LABEL MISMATCH

| Client Sheet | PIVOT Current |
|---|---|
| Not Covered | Not Applicable |
| Covered if correction index is +/-5D | Covered if correction index is +/- 5D |
| Covered if correction index is +/-6.5D | Covered if correction index is +/- 6.5D |
| Covered if correction index is +/-7.5D | Covered if correction index is +/- 7.5D |

Minor spacing differences in correction index values. "Not Covered" vs "Not Applicable".

### 3.12 Disease Sub Limits - LOV CONTAMINATION

PIVOT's disease_sub_limits LOV currently contains Lasik values mixed in:
`['Standard Limit','Higher Limit','No Limit','Lasik','Covered if correction index is +/- 5D',...]`

**Action needed:** Remove Lasik values from disease_sub_limits LOV. Should only be: Standard Limit, Higher Limit, No Limit, Not Applicable.

### 3.13 Modern Treatment - MISSING LOV

Client sheet has: Not Covered, Upto 25% of FSI, Upto 50% of FSI, Upto FSI
PIVOT has NO LOV defined for modern_treatment.

### 3.14 Domiciliary Hospitalization - MISSING LOV

Client sheet has: Covered, Not Covered
PIVOT has NO LOV defined for domiciliary_hospitalization.

### 3.15 Cyber Knife And Stem Cell - MISSING LOV

Client sheet has: Covered, Not Covered
PIVOT has NO LOV defined for cyber_knife_stem_cell.

### 3.16 Air Ambulance - MISSING LOV

Client sheet has: Covered, Not Covered
PIVOT has NO LOV defined for air_ambulance.

### 3.17 Reasonable And Customary Charges - MISSING LOV

Client sheet has: Applicable, Not Applicable
PIVOT has NO LOV defined for reasonable_customary_charges.

### 3.18 Baby Day One - MISSING LOV IN RENEWAL

Present in current PIVOT but confirmed in both Fresh and Renewal client sheets.

### 3.19 Maternity Normal - DIFFERENT VALUES

| Client Sheet (Renewal) | PIVOT Current |
|---|---|
| Not Covered, 25000, 35000, 50000, 75000, 100000 | Not Covered, 20000, 25000, 30000, 35000... through 100000 |

Renewal sheet has fewer options than Fresh. PIVOT combines both.

### 3.20 Premium Rate Chart - MISSING LOV

Client sheet has: Per Life-Age Band wise, Per Family-Age Band wise, Flat Per Life, Flat per Family
PIVOT has NO LOV defined for premium_rate_chart.

### 3.21 Installment Type - MISSING LOV

Client sheet has: Monthly, Quarterly, Half Yearly, Annual
PIVOT has NO LOV defined for installment_type.

### 3.22 Deletion of Member - MISSING LOV

Client sheet has: Pro Rata, NIL refund
PIVOT has NO LOV defined for deletion_of_member.

### 3.23 Are All Employees Covered - MISSING LOV

Client sheet has: Yes, No
PIVOT has NO LOV defined for are_all_employees_covered.

### 3.24 Is PPN Clause Applicable - MISSING LOV

Client sheet has: Yes, No
PIVOT has NO LOV defined for is_ppn_clause_applicable.

---

## SECTION 4: STRUCTURAL/BEHAVIORAL DIFFERENCES

| # | Difference | Details |
|---|---|---|
| 1 | Fresh vs Renewal distinction | Client sheet has TWO separate forms. PIVOT has one combined form. Client distinguishes with "Is this the first time your corporate opt for Group Health Insurance" toggle. |
| 2 | Demographics placement | In Fresh quote, demographics (employees, spouse, children, parents) are NOT listed. In Renewal, they appear under existing policy section. PIVOT always shows demographics. |
| 3 | Cover/Benefits field order | Renewal sheet has a completely different ordering of benefits fields compared to Fresh sheet. PIVOT uses one fixed order. |
| 4 | Required vs Optional marking | Client uses asterisk (*) to mark required fields. Some fields are required in one form but not the other. PIVOT's required flags don't always match. |
| 5 | Enterprise Type | Client says "System auto select" - this is auto-determined, not extracted from RFQ documents. |
| 6 | Clone from another quote | Client system feature - not relevant to AI extraction. |
| 7 | Policy End Date | Client says "Auto Change" - auto-calculated from start date. Not extracted. |
| 8 | Total Lives | Client says "Auto Calculate" - sum of employees + spouse + children + parents. |

---

## SECTION 5: SUMMARY SCORECARD

| Category | Count |
|---|---|
| Fields missing from PIVOT | 9 |
| Extra fields in PIVOT (not in client sheet) | 2 |
| LOV/Dropdown mismatches | 24 |
| Structural differences | 8 |
| **Total gaps to address** | **43** |

---

## SECTION 6: PRIORITY RECOMMENDATIONS

### High Priority (breaks client workflow)
1. Fix Quote Type LOV values (add Super-Topup, OPD, align naming)
2. Add Business Type LOV (Fresh, Own Renewal, Market Rollover)
3. Fix Disease Sub Limits LOV (remove contaminated Lasik values)
4. Add missing LOVs for 10 fields (modern_treatment, domiciliary, cyber_knife, air_ambulance, etc.)
5. Fix Co-Payment format (decimal fractions -> percentages)

### Medium Priority (data completeness)
6. Add 9 missing fields (Ambulance Amount, alternate contacts, Emoha, Rewards %, etc.)
7. Expand OPD values (add 3000-9000 range)
8. Expand Normal Room Rent and ICU Rent values
9. Add "No Copay" to Parental Co-Pay
10. Add "Not Covered" to Parent SI Restriction

### Low Priority (nice-to-have)
11. Remove or flag extra PIVOT fields not in client sheet
12. Align minor label differences (FSI vs Family SI, spacing in Lasik values)
13. Consider Fresh vs Renewal form separation in UI
14. Auto-calculate fields (Total Lives, Policy End Date)
