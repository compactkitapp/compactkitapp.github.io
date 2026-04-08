const SPREADSHEET_ID = "1ecbqP-WGnNmOlud94Znf81QssB4I4zcFk0sgvOL8NF8";
const SHEET_NAME = "Wishlist";

function doGet() {
  return jsonResponse({ ok: true, message: "CompactKit wishlist endpoint is running." });
}

function doPost(e) {
  const email = ((e && e.parameter && e.parameter.email) || "").trim();
  const source = ((e && e.parameter && e.parameter.source) || "landing-page").trim();
  const userAgent = ((e && e.parameter && e.parameter.userAgent) || "").trim();
  const submittedAt = new Date();

  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, error: "Invalid email address." });
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet(spreadsheet, SHEET_NAME);

  sheet.appendRow([submittedAt, email, source, userAgent]);

  return jsonResponse({ ok: true });
}

function getOrCreateSheet(spreadsheet, name) {
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    sheet.appendRow(["Submitted At", "Email", "Source", "User Agent"]);
  }

  return sheet;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
