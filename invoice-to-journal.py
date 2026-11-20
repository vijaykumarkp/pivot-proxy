"""
Convert extracted invoice data to Journal Entry Upload Format
"""
import json
from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter
from datetime import datetime

def create_journal_entry_excel(invoices, output_path):
    """Convert invoice data to journal entry format and create Excel"""
    
    wb = Workbook()
    wb.remove(wb.active)  # Remove default sheet
    
    # Sheet 1: Reference guide
    ref_sheet = wb.create_sheet('details to be captured', 0)
    ref_data = [
        ['Head', 'Details'],
        ['Acc Period', 'Period of entry'],
        ['Trans Date', 'Date of entry'],
        ['Account Code', 'Respective GL code'],
        ['Curr Code', 'INR'],
        ['Trans Amount', 'Amount'],
        ['Dr_Cr', 'Debit or Credit'],
        ['Jrnal Type', 'SEXPS or HEXPS'],
        ['Jrnal Source', 'Not applicable'],
        ['Reference', 'Vendor code and Name'],
        ['Description', 'Nature of expenses'],
        ['Asset Code', 'to be blank'],
        ['Asset Indicator', 'to be blank'],
        ['Asset / Item Qty', 'to be blank'],
        ['Due Date', 'to be blank'],
        ['Branch Analysis Code', 'Branch code'],
        ['Product  Analysis Code', 'Not applicable'],
        ['ChannelAnalysisCode', 'Respective channel code'],
        ['Sub-Channel  Analysis Code', 'Not applicable'],
        ['Underwriting Year  Analysis Code', 'Not applicable'],
        ['Employee Code  Analysis Code', 'Not applicable'],
        ['TDS Applicability  Analysis Code', 'TD01  if TDS applicable'],
        ['Department   Analysis Code', None],
        ['Sequence Code  Analysis Code', 'Not applicable'],
        ['Vendor Code  Analysis Code', 'Vendor code'],
        ['Invoice Date', 'Invoice date'],
        ['From Date', 'Not applicable'],
        ['To Date', 'Not applicable'],
        ['Addl Date 4', None],
        ['Addl Date 5', None],
        ['Cheque & NEFT Number', 'Vendor GST number'],
        ['Invoice Number', 'Vendor invoice number'],
        ['Additional Remarks', 'NEFT or Cheque'],
        ['Àdditional Remarks 2', 'Not applicable'],
        ['CREDENCE DESCRIPTION', 'Not applicable'],
        ['HSN/SAC NO', 'As per invoice'],
        ['Taxable on Amount', 'Invoice value for GST'],
        ['Reverse Charge (Y/N)', 'Not applicable'],
        ['Reverse charge %', 'Not applicable'],
        ['Item Details (Sr.No)', 'Not applicable'],
        ['Goods/Service', 'Not applicable'],
        ['GST Tax Rate', 'GST rate'],
        ['Orginal Invoice no for Dr/Cr Notes', 'RS GST number'],
        ['Advance Challan No ', 'Respective expenses account code'],
    ]
    
    for row in ref_data:
        ref_sheet.append(row)
    
    ref_sheet.column_dimensions['A'].width = 35
    ref_sheet.column_dimensions['B'].width = 40
    
    # Sheet 2: Upload format with invoice data
    data_sheet = wb.create_sheet('upload format', 1)
    
    headers = [
        'L id', 'Acc Period', 'Trans Date', 'Account Code', 'Description', 'Curr Code', 'Trans Amount',
        'Dr_Cr', 'Jrnal Type', 'Jrnal Source', 'Reference', 'Description', 'Asset Code', 'Asset Indicator',
        'Asset / Item Qty', 'Due Date', 'Branch Analysis Code', 'Product  Analysis Code', 'ChannelAnalysisCode',
        'Sub-Channel  Analysis Code', 'Underwriting Year  Analysis Code', 'Employee Code  Analysis Code',
        'TDS Applicability  Analysis Code', 'Department   Analysis Code', 'Sequence Code  Analysis Code',
        'Vendor Code  Analysis Code', 'Invoice Date', 'From Date', 'To Date', 'Addl Date 4', 'Addl Date 5',
        'Cheque & NEFT Number', 'Invoice Number', 'Additional Remarks', 'Àdditional Remarks 2',
        'CREDENCE DESCRIPTION', 'HSN/SAC NO', 'Taxable on Amount', 'Reverse Charge (Y/N)', 'Reverse charge %',
        'Item Details (Sr.No)', 'Goods/Service', 'GST Tax Rate', 'Orginal Invoice no for Dr/Cr Notes',
        'Advance Challan No ', 'Addl Description 15', 'Addl Description 16', 'Addl Description 17',
        'Addl Description 18', 'Addl Description 19', 'Addl Description 20', 'Addl Description 21',
        'Addl Description 22', 'Addl Description 23', 'Addl Description 24', 'Addl Description 25'
    ]
    
    data_sheet.append(headers)
    
    # Add invoice data rows
    for inv in invoices:
        row = [''] * len(headers)
        
        # Map invoice fields to columns
        vendor_name = inv.get('vendor_name', '')
        invoice_date = inv.get('invoice_date', '')
        invoice_number = inv.get('invoice_number', '')
        total_amount = inv.get('total_amount', 0)
        taxable_value = inv.get('taxable_value_total', 0)
        total_tax = inv.get('total_tax', 0)
        gstin = inv.get('gstin', '')
        
        # Simplified: Just one line per invoice for now
        row[0] = '1'  # L id
        row[1] = '2026/001'  # Acc Period
        row[2] = invoice_date  # Trans Date
        row[3] = '1310020100'  # Account Code (expense)
        row[4] = vendor_name  # Description
        row[5] = 'INR'  # Curr Code
        row[6] = total_amount  # Trans Amount
        row[7] = 'D'  # Dr_Cr (Debit)
        row[8] = 'SEXPS'  # Jrnal Type
        row[10] = f"{gstin}/{vendor_name}" if gstin else vendor_name  # Reference
        row[16] = 'BR001'  # Branch Analysis Code
        row[18] = 'CH001'  # ChannelAnalysisCode
        row[26] = invoice_date  # Invoice Date
        row[31] = gstin  # Cheque & NEFT Number
        row[32] = invoice_number  # Invoice Number
        row[37] = taxable_value  # Taxable on Amount
        row[43] = total_tax  # GST Tax Rate
        
        data_sheet.append(row)
    
    # Set column widths
    for col in range(1, len(headers) + 1):
        data_sheet.column_dimensions[get_column_letter(col)].width = 15
    
    wb.save(output_path)
    return output_path

if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        sys.exit(1)

    output_path = sys.argv[1]
    invoices = []

    if len(sys.argv) > 2:
        try:
            invoices = json.loads(sys.argv[2])
        except:
            invoices = []

    if not isinstance(invoices, list):
        invoices = [invoices] if invoices else []

    if not invoices:
        invoices = [{
            'vendor_name': 'Sample',
            'invoice_date': '2026-05-26',
            'invoice_number': 'INV-001',
            'total_amount': 1000,
            'taxable_value_total': 950,
            'total_tax': 50,
            'gstin': '33AAPFG8037J1Z2'
        }]

    create_journal_entry_excel(invoices, output_path)
