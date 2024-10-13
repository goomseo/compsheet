// 스태프 관리 시트 전용

function getMergedTable() {
    var targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("table_merged");

    var vstackFunc1 = "=VSTACK(";
    var vstackFunc2 = "=VSTACK("

    var row = 5;
    while (targetSheet.getRange(row, 1).isBlank() == false) {
      var compName = targetSheet.getRange(row, 1).getValue();
      
      var queryString1 = "QUERY('" + compName + "'!A4:H, \"SELECT B, G WHERE (A contains 'TRUE')\")";
      var queryString2 = "QUERY('" + compName + "'!H4:H, \"SELECT H WHERE H IS NOT NULL\")"

      vstackFunc1 += queryString1;
      vstackFunc1 += ", "

      vstackFunc2 += queryString2;
      vstackFunc2 += ", ";

      row++;
    }

    vstackFunc1 = vstackFunc1.substring(0, vstackFunc1.length - 2);
    vstackFunc1 += ")";

    vstackFunc2 = vstackFunc2.substring(0, vstackFunc2.length - 2);
    vstackFunc2 += ")";
    
    targetSheet.getRange('C5').setFormula(vstackFunc1);
    targetSheet.getRange('F5').setFormula(vstackFunc2);

}

