function makeStaffTable() {
  // Edit sheets' name if needed
  var dataSheet = "4. 개인별 조&스탭";
  var resultSheet = "스태프 편성 메일 발송용";

  // Access to the active spreadsheet
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Set the number format of the data sheet as text
  var targetSheet = spreadSheet.getSheetByName(dataSheet);
  var range = targetSheet.getDataRange();
  range.setNumberFormat("@");

  // Access to the result sheet and clear the datas
  targetSheet = spreadSheet.getSheetByName(resultSheet);
  targetSheet.getRange('A1:F').clear();

  // Adjust column widths for columns A to F
  var columnWidths = [75, 225, 100, 50, 30, 75];
  for (var i = 0; i < columnWidths.length; i++) {
    targetSheet.setColumnWidth(i + 1, columnWidths[i]);
  }

  // Set text and background color for headers (A1:F1) and make the text bold
  var headerValues = ['국문명', '영문명', 'WCA ID', '종목', '그룹', '스태프 업무'];
  var headerRange = targetSheet.getRange('A1:F1');
  headerRange.setValues([headerValues]);
  headerRange.setBackground('#E69138');
  headerRange.setFontWeight("bold");

  // Load data using the QUERY function into A2
  var queryString = "=QUERY('" + (dataSheet) + "'!A2:F, \"SELECT B, A, C, D, E, F WHERE F IS NOT NULL ORDER BY B\")";
  targetSheet.getRange('A2').setFormula(queryString);

  // Get the data range with values
  var dataRange = targetSheet.getDataRange();
  var values = dataRange.getValues();

  // Set outer borders with a thicker line and inner borders with a thinner line
  var lastColumn = dataRange.getLastColumn();
  var lastRow = dataRange.getLastRow();
  var outerBorderRange = targetSheet.getRange(1, 1, lastRow, lastColumn);
  outerBorderRange.setBorder(true, true, true, true, null, null, "#000000", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  outerBorderRange.setBorder(null, null, null, null, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID);

  // Initialize variables for loop
  var prevValue = values[1][0]; // Assuming A2 is the starting cell
  var startRow = 2;
  var repaint = true;

  // Loop for setting background alternately
  for (var row = 2; row <= lastRow; row++) {
    var currentValue = values[row - 1][0];

    // Draw bold borders and shading when A column value changes
    if (currentValue !== prevValue) {
      if (repaint) {
        setShadeAndBorder(targetSheet, startRow, row - 1);
      }

      repaint = !repaint;

      // Update for the next iteration
      startRow = row;
      prevValue = currentValue;
    }
  }

  // Set background for the last person
  if (repaint) {
    setShadeAndBorder(targetSheet, startRow, row - 1);
  }

  // Center-align text for the entire data range
  targetSheet.getRange(1, 1, lastRow, 6).setHorizontalAlignment("center");

  // 조건부서식
  applyConditionalFormatting(targetSheet);
  
  var ui = SpreadsheetApp.getUi();
  ui.alert("생성 완료")
}

function setShadeAndBorder(targetSheet, startRow, endRow) {
    var shadedRange = targetSheet.getRange(startRow, 1, endRow - startRow + 1, 4); // Columns A to D
    shadedRange.setBackground('#CCCCCC'); // Gray shading

    // Draw regular borders for the inner cells of the range
    var borderRange = targetSheet.getRange(startRow, 1, endRow - startRow + 1, 6);
    borderRange.setBorder(true, null, true, null, null, null, "#000000", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function applyConditionalFormatting(targetSheet) {
  var rangeE = targetSheet.getRange('E2:E');
  var rangeF = targetSheet.getRange('F2:F');

  // Define conditions for column E
  var conditionsE = [
    { text: 'B', color: '#6D9EEB' },
    { text: 'Y', color: '#FFD966' },
    { text: 'R', color: '#E06766' },
    { text: 'G', color: '#93C47D' }
  ];

  conditionsE.forEach(function(condition) {
    var ruleE = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains(condition.text)
      .setBackground(condition.color)
      .setRanges([rangeE])
      .build();

    var rulesE = targetSheet.getConditionalFormatRules();
    rulesE.push(ruleE);
    targetSheet.setConditionalFormatRules(rulesE);
  });

  // Define conditions for column F
  var conditionsF = [
    { text: 'Judge', color: '#00FF03' },
    { text: 'Runner', color: '#FFFF03' },
    { text: 'Scrambler', color: '#01FFFF' },
    { text: 'Scoretaker', color: '#FF01FF' }
  ];

  conditionsF.forEach(function(condition) {
    var ruleF = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains(condition.text)
      .setBackground(condition.color)
      .setRanges([rangeF])
      .build();

    var rulesF = targetSheet.getConditionalFormatRules();
    rulesF.push(ruleF);
    targetSheet.setConditionalFormatRules(rulesF);
  });
}

function clear() {
  // Access to the active spreadsheet
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

  targetSheet = spreadSheet.getSheetByName("스태프 편성 메일 발송용");
  targetSheet.getRange('A1:F').clear();

  // Adjust column widths for columns A to F
    for (var i = 0; i < 6; i++) {
    targetSheet.setColumnWidth(i + 1, 100);
  }
}
