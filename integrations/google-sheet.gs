/**
 * Lean Body Academy funnel: saves each opt in as a new row in the Google Sheet,
 * and emails Josh with their answers so he knows someone has applied.
 *
 * Set up (about 3 minutes, once):
 * 1. Open the Google Sheet you want the opt ins in.
 * 2. Extensions > Apps Script. Delete what's there, paste in this whole file, and Save.
 * 3. Optional check: pick "testEmail" in the function menu at the top and press Run.
 *    Allow the permissions, and Josh should get a test email.
 * 4. Deploy > New deployment > Select type: Web app.
 *    Execute as: Me. Who has access: Anyone. Deploy, and allow the permissions.
 * 5. Copy the Web app URL (ends in /exec) and send it to the REPS team
 *    (it goes in assets/config.js as sheetWebhookUrl).
 *
 * Updating this script later: Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 * That keeps the same /exec URL. A brand new deployment gives a new URL.
 */

// Who gets the "new opt in" email. Add more addresses separated by commas.
var NOTIFY_EMAIL = 'joshbell@leanbodyacademy.co.uk';

// Leave empty to use the sheet this script is attached to.
var SHEET_ID = '';

var HEADINGS = ['Submitted at', 'Name', 'Email', 'Phone', 'Page', 'UTM campaign', 'Main goal', 'Why 15-20lbs before the new year', 'Occupation'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  var d = {};
  try {
    try { d = JSON.parse(e.postData.contents); } catch (err) { d = e.parameter || {}; }
    var sheet = getSheet_();
    var ss = sheet.getParent();
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADINGS);
    if (sheet.getLastColumn() < HEADINGS.length || sheet.getRange(1, HEADINGS.length).getValue() !== HEADINGS[HEADINGS.length - 1]) {
      sheet.getRange(1, 1, 1, HEADINGS.length).setValues([HEADINGS]); // adds any new headings to an existing sheet
    }
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADINGS.length).setFontWeight('bold');
    var when = d.submittedAt ? new Date(d.submittedAt) : new Date();
    sheet.appendRow([when, clean_(d.name), clean_(d.email), clean_(d.phone), clean_(d.page), clean_(d.utm_campaign), clean_(d.goal), clean_(d.why), clean_(d.occupation)]);
    d.sheetUrl = ss.getUrl();
    d.when = when;
  } finally {
    lock.releaseLock();
  }
  // The row is saved first, so a problem with the email never loses a lead.
  try { notify_(d); } catch (err) { console.error('Opt in email failed: ' + err); }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('Lean Body Academy sheet receiver is running.');
}

/** Run this once from the editor to check the email arrives. */
function testEmail() {
  notify_({ name: 'Test Person', email: 'test@example.com', phone: '+447000000000', goal: 'Lose belly fat', why: 'Holiday in the summer', occupation: 'Electrician', page: '/test', when: new Date(), sheetUrl: getSheet_().getParent().getUrl() });
}

function getSheet_() {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets()[0];
}

function notify_(d) {
  if (!NOTIFY_EMAIL) return;
  var name = str_(d.name) || 'Someone';
  var email = str_(d.email), phone = str_(d.phone);
  var when = Utilities.formatDate(d.when || new Date(), 'Europe/London', "EEE d MMM yyyy 'at' HH:mm");
  var rows = [['Name', name], ['Email', email], ['Phone', phone], ['Main goal', str_(d.goal)], ['Why 15-20lbs before the new year', str_(d.why)], ['Occupation', str_(d.occupation)], ['Applied', when]];
  rows = rows.filter(function (r) { return r[1]; });
  if (d.utm_campaign) rows.push(['Campaign', str_(d.utm_campaign)]);

  var text = 'Someone has just applied for coaching through the Lean Body Academy funnel.\n\n' +
    rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') +
    '\n\nAll opt ins: ' + (d.sheetUrl || '');
  var html = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">' +
    '<p>Someone has just applied for coaching through the Lean Body Academy funnel.</p>' +
    '<table style="border-collapse:collapse">' +
    rows.map(function (r) {
      return '<tr><td style="padding:6px 16px 6px 0;color:#666">' + esc_(r[0]) + '</td><td style="padding:6px 0"><b>' + esc_(r[1]) + '</b></td></tr>';
    }).join('') +
    '</table>' +
    (d.sheetUrl ? '<p><a href="' + esc_(d.sheetUrl) + '" style="color:#FF4545;font-weight:bold">See all opt ins</a></p>' : '') +
    '<p style="color:#666;font-size:13px">Reply to this email to contact ' + esc_(name) + ' directly.</p></div>';

  var msg = { to: NOTIFY_EMAIL, subject: 'New Lean Body application: ' + name, body: text, htmlBody: html, name: 'Lean Body Academy Funnel' };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) msg.replyTo = email;
  MailApp.sendEmail(msg);
}

function str_(v) { return String(v == null ? '' : v).slice(0, 1000).trim(); }

function clean_(v) {
  v = str_(v);
  return /^[=+\-@]/.test(v) ? "'" + v : v; // stop anything being read as a formula
}

function esc_(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
