// 스태프 관리 시트 전용

function getMergedTable() {
    var targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("table_merged");

    var vstackFunc = "=VSTACK(";

    var row = 2;
    while (targetSheet.getRange(row, 1).isBlank() == false) {
      var compName = targetSheet.getRange(row, 1).getValue();
      var queryString = "QUERY('" + compName + "'!A3:F, \"SELECT A, B, F\")";

      vstackFunc += queryString;
      vstackFunc += ", "

      row++;
    }

    vstackFunc = vstackFunc.substring(0, vstackFunc.length - 2);
    vstackFunc += ")";
    
    targetSheet.getRange('C2').setFormula(vstackFunc);
}
