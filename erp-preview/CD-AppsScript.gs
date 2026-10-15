// Deploy from script.google.com as Web App (Execute as: Me).
// Only CD lookup values are exposed; transaction sheets are never returned.
// IMPORTANT: deployment access Anyone exposes these CD lists publicly.
const SPREADSHEET_ID = '1Mt71OGa0999LoT8pg2fUVwrHMBq21bqPoZmY31wDcb0';
function doGet(e) {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('CD');
  const values = sh.getRange('A6:F1000').getDisplayValues();
  const columns = Array.from({length: 6}, (_, i) => [...new Set(values.map(row => String(row[i] || '').trim()).filter(Boolean))]);
  const output = {ok: true, columns, fetchedAt: new Date().toISOString()};
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
