/**
 * Brown Brains — contact form receiver.
 *
 * Paste this whole file into Extensions > Apps Script inside the Google Sheet
 * you want the enquiries to land in, change SHARED_SECRET below, then deploy it
 * as a Web App (Execute as: Me, Who has access: Anyone).
 *
 * The /exec URL it gives you goes into GOOGLE_SHEETS_WEBHOOK_URL, and the same
 * secret goes into SHEETS_SHARED_SECRET.
 */

// Must match SHEETS_SHARED_SECRET in your environment variables.
var SHARED_SECRET = '0dbb2dc61210e75a6aa6526b4f76d7577df0d0333b922483';

var SHEET_NAME = 'Enquiries';

var HEADERS = [
  'Received',
  'Name',
  'Email',
  'Company',
  'Interested in',
  'Budget',
  'Message',
  'Source',
  'User agent',
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply({ ok: false, error: 'empty request' });
    }

    var body = JSON.parse(e.postData.contents);

    if (body.secret !== SHARED_SECRET) {
      return reply({ ok: false, error: 'unauthorised' });
    }

    var sheet = getSheet();

    sheet.appendRow([
      formatTimestamp(body.submittedAt),
      body.name || '',
      body.email || '',
      body.company || '',
      body.service || '',
      body.budget || '',
      body.message || '',
      body.source || '',
      body.userAgent || '',
    ]);

    return reply({ ok: true });
  } catch (error) {
    return reply({ ok: false, error: String(error) });
  }
}

/** Lets you confirm the deployment is live by opening the URL in a browser. */
function doGet() {
  return reply({ ok: true, message: 'Brown Brains enquiry endpoint is live.' });
}

function getSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(7, 420);
  }

  return sheet;
}

/** Stores the timestamp in the spreadsheet's own timezone, not UTC. */
function formatTimestamp(iso) {
  var date = iso ? new Date(iso) : new Date();
  if (isNaN(date.getTime())) date = new Date();

  return Utilities.formatDate(
    date,
    SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(),
    'yyyy-MM-dd HH:mm:ss'
  );
}

function reply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
