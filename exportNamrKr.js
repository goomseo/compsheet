function exportNameKr() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();

  var columnsToExport = [60, 53];  // 53: BA, 60: BH

  var startRow = 6;
  var lastRowWithData = sheet.getLastRow();
  for (var i = startRow; i < lastRowWithData; i++) {
    if (sheet.getRange(i, 55).isBlank()) {
      lastRowWithData = i - 1;
      break;
    }
  }
  
  var data = [];
  for (var i = startRow; i <= lastRowWithData; i++) {
    var row = [];
    for (var j = 0; j < columnsToExport.length; j++) {
      row.push(sheet.getRange(i, columnsToExport[j]).getValue());
    }
    data.push(row);
  }

  var csvContent = data.map(row => row.join(',')).join('\n');
  
  var folder = DriveApp.getRootFolder();
  var csvFile = folder.createFile("nameKr.csv", csvContent, MimeType.CSV);
  
  var fileUrl = csvFile.getUrl();
  var downloadUrl = fileUrl.replace(/\/file\/d\/([^\/]+)\/.*/, "/uc?export=download&id=$1");
  
  var ui = SpreadsheetApp.getUi();
  ui.alert("다운로드 링크: " + downloadUrl);
}
