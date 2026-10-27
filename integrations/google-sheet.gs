/**
 * Lean Body Academy funnel: saves each opt in as a new row in the Google Sheet.
 *
 * Set up (about 2 minutes, once):
 * 1. Open the sheet "Lean Body Academy - Funnel Opt Ins".
 * 2. Extensions > Apps Script. Delete what's there, paste in this whole file, and Save.
 * 3. Deploy > New deployment > Select type: Web app.
 *    Execute as: Me. Who has access: Anyone. Deploy, and allow the permissions.
 * 4. Copy the Web app URL (ends in /exec) and put it in assets/config.js as sheetWebhookUrl.
 */
var SHEET_ID = '1WE8eiis9MqlUBG6wMSdEAakzQHVoX0koaFVlLIE1wKU';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = {};
    try { d = JSON.parse(e.postData.contents); } catch (err) { d = e.parameter || {}; }
    var clean = function (v) {
      v = String(v == null ? '' : v).slice(0, 300);
      return /^[=+\-@]/.test(v) ? "'" + v : v; // stop anything being read as a formula
    };
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    sheet.appendRow([
      d.submittedAt ? new Date(d.submittedAt) : new Date(),
      clean(d.name), clean(d.email), clean(d.phone), clean(d.page), clean(d.utm_campaign)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Lean Body Academy sheet receiver is running.');
}
