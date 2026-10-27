/* Service sign-up receiver. Call only from the website SERVER, never the browser.
 * Set SERVICE_SIGNUP_SECRET in Apps Script > Project settings > Script properties.
 * Deploy as a web app executing as the spreadsheet owner. See SETUP.txt.
 */
const SPREADSHEET_ID = '17sTvuegHDMt0dYPTnJUeJg999R71lqK-4Dw5O_0bysc';
const SHEET_NAME = 'Sheet1';
const OPTIONS_NAME = 'Service options';
const SERVICES = {
  'content-calendar': 'Content Calendar',
  'copywriting': 'Copywriting',
  'viral-media': 'Viral media',
  'paid-campaigns': 'Paid Campaigns',
  'events': 'Events',
  'community-marketing': 'Community'
};

function jsonReply(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeSubmission(body, options) {
  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim();
  if (!name || name.length > 120 || /[\u0000-\u001f]/.test(name)) throw Error('invalid_name');
  if (email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(email)) throw Error('invalid_email');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submissionId || '')) throw Error('invalid_submission_id');
  if (!Array.isArray(body.cards) || body.cards.length < 1 || body.cards.length > 6) throw Error('invalid_cards');
  const seen = new Set();
  const cards = body.cards.map(card => {
    if (!Object.prototype.hasOwnProperty.call(SERVICES, card.serviceId) || seen.has(card.serviceId)) throw Error('invalid_service');
    seen.add(card.serviceId);
    if (!Array.isArray(card.addons) || card.addons.length > 10) throw Error('invalid_addons');
    const service = SERVICES[card.serviceId];
    const allowed = options.filter(row => row[0] === service).map(row => row[1]).filter(Boolean);
    if (card.addons.some(addon => typeof addon !== 'string' || !allowed.includes(addon))) throw Error('invalid_addons');
    return { service, addons: [...new Set(card.addons)].sort() };
  }).sort((a, b) => a.service.localeCompare(b.service));
  return { submissionId: body.submissionId.toLowerCase(), name, email, cards };
}

function inferredCompany(email) {
  const domain = email.split('@')[1];
  // A domain-derived display label is an estimate, not a verified legal name.
  const personal = ['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com', 'me.com', 'naver.com', 'daum.net', 'hanmail.net', 'proton.me', 'protonmail.com'];
  if (personal.includes(domain)) return null;
  const parts = domain.split('.');
  const compound = ['co.uk', 'com.au', 'co.kr', 'co.jp', 'co.nz', 'com.sg', 'com.hk', 'co.in', 'com.br'];
  const index = compound.includes(parts.slice(-2).join('.')) ? parts.length - 3 : parts.length - 2;
  const brand = parts[Math.max(0, index)];
  const name = brand.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return { name, url: 'https://' + domain };
}

function doPost(event) {
  let lock;
  try {
    if (!event || !event.postData || event.postData.contents.length > 20000) return jsonReply({ ok: false, error: 'invalid_request' });
    const body = JSON.parse(event.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SERVICE_SIGNUP_SECRET');
    if (!secret || body.secret !== secret) return jsonReply({ ok: false, error: 'unauthorized' });
    lock = LockService.getScriptLock();
    if (!lock.tryLock(20000)) return jsonReply({ ok: false, error: 'busy', retryable: true });
    const book = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = book.getSheetByName(SHEET_NAME);
    const optionsSheet = book.getSheetByName(OPTIONS_NAME);
    if (!sheet || !optionsSheet) throw Error('configuration_error');
    const expected = ['UUID', 'Name', 'Email', 'Company name', 'Service', 'Add on'];
    const headers = sheet.getRange(1, 1, 1, 6).getValues()[0];
    if (headers.some((value, i) => value !== expected[i])) throw Error('configuration_error');
    const options = optionsSheet.getRange(2, 1, Math.max(1, optionsSheet.getLastRow() - 1), 2).getValues();
    const submission = normalizeSubmission(body, options);
    const last = Math.max(1, sheet.getLastRow());
    const rows = last > 1 ? sheet.getRange(2, 1, last - 1, 6).getValues() : [];
    const notes = last > 1 ? sheet.getRange(2, 1, last - 1, 1).getNotes() : [];
    const digest = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(submission)));
    const prefix = 'service-signup:' + submission.submissionId + ':';
    const prior = notes.findIndex(row => String(row[0]).startsWith(prefix));
    if (prior >= 0) {
      if (notes[prior][0] !== prefix + digest) throw Error('submission_conflict');
      return jsonReply({ ok: true, duplicate: true, rows: submission.cards.length });
    }
    const known = [...new Set(rows.filter(row => String(row[2]).trim().toLowerCase() === submission.email && row[0]).map(row => String(row[0])))];
    if (known.length > 1) throw Error('customer_uuid_conflict');
    const customerId = known[0] || Utilities.getUuid();
    const company = inferredCompany(submission.email);
    const rowData = submission.cards.map(card => ({ values: [customerId, submission.name, submission.email, company ? company.name : '', card.service, card.addons.join('\n')].map((value, i) => ({ userEnteredValue: { stringValue: value }, ...(i === 0 ? { note: prefix + digest } : i === 3 ? { note: company ? 'Company label inferred from email domain; not a verified legal name.' : 'Personal email provider: company was not inferred.' } : {}) })) }));
    const sheetId = sheet.getSheetId();
    const end = last + rowData.length;
    const requests = [];
    if (end > sheet.getMaxRows()) requests.push({ appendDimension: { sheetId, dimension: 'ROWS', length: end - sheet.getMaxRows() } });
    requests.push({ updateCells: { start: { sheetId, rowIndex: last, columnIndex: 0 }, rows: rowData, fields: 'userEnteredValue,note' } });
    // Website selections are validated above; allow multiple add-ons in one cell.
    requests.push({ repeatCell: { range: { sheetId, startRowIndex: last, endRowIndex: end, startColumnIndex: 5, endColumnIndex: 6 }, cell: { userEnteredFormat: { wrapStrategy: 'WRAP' } }, fields: 'dataValidation,userEnteredFormat.wrapStrategy' } });
    if (company) requests.push({ repeatCell: { range: { sheetId, startRowIndex: last, endRowIndex: end, startColumnIndex: 3, endColumnIndex: 4 }, cell: { userEnteredFormat: { textFormat: { link: { uri: company.url } } } }, fields: 'userEnteredFormat.textFormat.link' } });
    // One atomic Sheets request prevents partial rows and supports safe retries.
    const response = UrlFetchApp.fetch('https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_ID + ':batchUpdate', { method: 'post', contentType: 'application/json', headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, payload: JSON.stringify({ requests }), muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) throw Error('sheet_write_failed');
    return jsonReply({ ok: true, rows: rowData.length });
  } catch (error) {
    const safe = ['invalid_name', 'invalid_email', 'invalid_submission_id', 'invalid_cards', 'invalid_service', 'invalid_addons', 'submission_conflict'];
    return jsonReply({ ok: false, error: safe.includes(error.message) ? error.message : 'submission_failed' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
