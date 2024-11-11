function cleanUp() {
  var spreadsheet = SpreadsheetApp.getActive();

  var range = spreadsheet.getRange("BA7:BA");
  range.clearContent();

  var lastRow = spreadsheet.getLastRow();
  for (var i = 7; i <= lastRow; i++) {
    var target = "BA" + i;
    var formula = getFormulaString("BD" + i, "BB" + i);
  
    spreadsheet.getRange(target).setFormula(formula);
}

  spreadsheet.getRange("I7:I").clearContent();
  spreadsheet.getRange("V7:V").clearContent();
  spreadsheet.getRange("M7:M").clearContent();
  spreadsheet.getRange("Y7:Y").clearContent();

  spreadsheet.getRange("K7:L").uncheck();
  spreadsheet.getRange("X7:X").uncheck();

  var ui = SpreadsheetApp.getUi();
  ui.alert("데이터 청소 완료");
}

function getFormulaString(cellReference1, cellReference2) {
  return '=IFERROR(VLOOKUP(' + cellReference1 + ',\'국문명 DB\'!$A$2:$C,3,FALSE), IF(AND(UNICODE("가") <= UNICODE(' + cellReference2 + '), UNICODE(' + cellReference2 + ') <= UNICODE("힣")),' + cellReference2 + ', IFERROR(IF(AND(UNICODE("가") <= UNICODE(INDEX(SPLIT(' + cellReference2 + ', "()", TRUE), 0, 2)), UNICODE(INDEX(SPLIT(' + cellReference2 + ', "()", TRUE), 0, 2)) <= UNICODE("힣")), INDEX(SPLIT(' + cellReference2 + ', "()", TRUE), 0, 2),"???"),"???")))';
}
