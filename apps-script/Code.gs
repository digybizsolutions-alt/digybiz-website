/**
 * DigyBiz — Free Proposal form → Google Sheets
 *
 * How to use (full steps in README.md):
 *  1. Create a Google Sheet, then open Extensions → Apps Script.
 *  2. Replace everything in Code.gs with this file and click Save.
 *  3. Run the `setup` function once and allow the permissions.
 *  4. Deploy → New deployment → Web app
 *       Execute as: Me
 *       Who has access: Anyone
 *  5. Copy the Web App URL into assets/js/config.js (SCRIPT_URL).
 */

// ---- Settings -------------------------------------------------------------
var SHEET_NAME = 'Leads';

// Optional: get an email for every new lead. Leave '' to turn this off.
var NOTIFY_EMAIL = '';

var HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'Source', 'Page URL', 'Status', 'Notes'];
// ---------------------------------------------------------------------------


/** Receives the website form (POST). */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var p = (e && e.parameter) || {};

    // Spam trap: real visitors never fill this hidden field.
    if (p.website) return json_({ result: 'success' });

    var name = clean_(p.name, 100);
    var phone = clean_(p.phone, 30);
    var email = clean_(p.email, 150);

    if (name.length < 2) return json_({ result: 'error', message: 'Name is required.' });
    if (!/^\+?[\d\s\-().]{7,20}$/.test(phone)) return json_({ result: 'error', message: 'A valid phone number is required.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json_({ result: 'error', message: 'A valid email is required.' });

    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      safe_(name),
      "'" + phone, // leading ' keeps it as text (no lost zeros, no formulas)
      safe_(email),
      safe_(clean_(p.source, 120)),
      safe_(clean_(p.page, 300)),
      'New',
      ''
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New DigyBiz lead: ' + name,
        body:
          'You have a new Free Proposal request.\n\n' +
          'Name:  ' + name + '\n' +
          'Phone: ' + phone + '\n' +
          'Email: ' + email + '\n' +
          'Form:  ' + clean_(p.source, 120) + '\n\n' +
          'Open your sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      });
    }

    return json_({ result: 'success' });
  } catch (err) {
    console.error(err);
    return json_({ result: 'error', message: 'Server error. Please try again.' });
  } finally {
    lock.releaseLock();
  }
}

/** Lets you open the Web App URL in a browser to check it is live. */
function doGet() {
  return json_({ result: 'ok', message: 'DigyBiz lead form endpoint is running.' });
}

/** Run once from the editor: creates the sheet + headers and asks for permissions. */
function setup() {
  var sheet = getSheet_();
  Logger.log('Ready: sheet "' + sheet.getName() + '" in ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}


// ---- Helpers --------------------------------------------------------------

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#071126')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('dd-mmm-yyyy hh:mm');
    sheet.getRange('G2:G').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['New', 'Contacted', 'Proposal Sent', 'Won', 'Lost'], true)
        .build()
    );
    sheet.setColumnWidths(1, HEADERS.length, 170);
  }
  return sheet;
}

function clean_(value, max) {
  return String(value == null ? '' : value).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
}

/** Stops values like "=HYPERLINK(...)" or "+91..." being treated as formulas. */
function safe_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
