import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter

# Load the workbook
wb = openpyxl.load_workbook('Situación Financiera 2026.xlsx')

# Create or get Dashboard sheet
dashboard_name = 'Dashboard'
if dashboard_name in wb.sheetnames:
    del wb[dashboard_name]
ws_dash = wb.create_sheet(dashboard_name, 0) # insert at first position

# Define styles
header_font = Font(bold=True, size=14)
label_font = Font(bold=True)
link_font = Font(color="008000") # Green text for links pulling from other worksheets
formula_font = Font(color="000000") # Black text for calculations within the same sheet
currency_format = '#,##0'
percent_format = '0.0%'

# Title
ws_dash['B2'] = 'Financial Dashboard'
ws_dash['B2'].font = Font(bold=True, size=16)

# Row Labels
ws_dash['B4'] = 'Year'
ws_dash['B5'] = 'Total Income'
ws_dash['B6'] = 'Total Expenses'
ws_dash['B7'] = 'Net Savings'
ws_dash['B9'] = 'Savings Margin (%)'

for r in [4, 5, 6, 7, 9]:
    ws_dash[f'B{r}'].font = label_font

# Columns C (3) to AA (27) correspond to 2003-2027
for col in range(3, 28):
    col_letter = get_column_letter(col)
    
    # Year (Formula linking to Principal)
    cell_year = ws_dash[f'{col_letter}4']
    cell_year.value = f"='Principal'!{col_letter}3"
    cell_year.font = link_font
    cell_year.alignment = Alignment(horizontal='center')
    
    # Total Income
    cell_inc = ws_dash[f'{col_letter}5']
    cell_inc.value = f"='Principal'!{col_letter}13"
    cell_inc.font = link_font
    cell_inc.number_format = currency_format
    
    # Total Expenses
    cell_exp = ws_dash[f'{col_letter}6']
    cell_exp.value = f"='Principal'!{col_letter}51"
    cell_exp.font = link_font
    cell_exp.number_format = currency_format
    
    # Net Savings
    cell_net = ws_dash[f'{col_letter}7']
    cell_net.value = f"='Principal'!{col_letter}58"
    cell_net.font = link_font
    cell_net.number_format = currency_format
    
    # Savings Margin (%) - calculation within dashboard
    cell_margin = ws_dash[f'{col_letter}9']
    # If Income is 0, show -, otherwise Net Savings / Total Income
    cell_margin.value = f"=IF({col_letter}5=0, 0, {col_letter}7/{col_letter}5)"
    cell_margin.font = formula_font
    cell_margin.number_format = percent_format

# Adjust column widths
ws_dash.column_dimensions['B'].width = 25
for col in range(3, 28):
    ws_dash.column_dimensions[get_column_letter(col)].width = 12

wb.save('Situación Financiera 2026.xlsx')
print("Dashboard created successfully.")
