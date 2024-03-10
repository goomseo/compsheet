function cleanUp() {
  var spreadsheet = SpreadsheetApp.getActive();

  var range = spreadsheet.getRange("BB7:BB");
  range.clearContent();

  var lastRow = spreadsheet.getLastRow();
  for (var i = 7; i <= lastRow; i++) {
    var target = "BB" + i;
    var formula = getFormulaString("BE" + i);
  
    spreadsheet.getRange(target).setFormula(formula);
}

  spreadsheet.getRange("I7:I").clearContent();
  spreadsheet.getRange("V7:V").clearContent();
  spreadsheet.getRange("M7:M").clearContent();
  spreadsheet.getRange("Z7:Z").clearContent();

  spreadsheet.getRange("K7:L").uncheck();
  spreadsheet.getRange("X7:Y").uncheck();

  var ui = SpreadsheetApp.getUi();
  ui.alert("데이터 청소 완료");
}

function getFormulaString(cellReference) {
  return '=IFERROR(VLOOKUP(' + cellReference + ',\'국문명 DB\'!$A$2:$C,3,FALSE), IF(AND(UNICODE("가") <= UNICODE(' + cellReference + '), UNICODE(' + cellReference + ') <= UNICODE("힣")),' + cellReference + ', IFERROR(IF(AND(UNICODE("가") <= UNICODE(INDEX(SPLIT(' + cellReference + ', "()", TRUE), 0, 2)), UNICODE(INDEX(SPLIT(' + cellReference + ', "()", TRUE), 0, 2)) <= UNICODE("힣")), INDEX(SPLIT(' + cellReference + ', "()", TRUE), 0, 2),"???"),"???")))';
}
