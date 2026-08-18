const SHEET_ID = "1YVeCx9bGNAcWYBxPilQhoYgqZVE4ML4zx-x1eBYqko";

function doPost(e) {
  appendLead(parseBody(e));
  return jsonOk();
}

function doGet(e) {
  if (e && e.parameter && e.parameter.nome) {
    appendLead(e.parameter);
    return jsonOk();
  }

  return ContentService.createTextOutput("ok");
}

function appendLead(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheets()[0];
    ensureHeaders(sheet);
    sheet.appendRow([
      Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss"),
      data.nome || "",
      data.contato || "",
      data.renda || "",
      data.tipoRenda || "",
      data.localidade || "",
    ]);
  } finally {
    lock.releaseLock();
  }
}

function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (err) {
    // web app sem planilha ativa
  }

  return SpreadsheetApp.openById(SHEET_ID);
}

function ensureHeaders(sheet) {
  const firstCell = String(sheet.getRange(1, 1).getValue() || "");
  if (firstCell) return;

  sheet.getRange(1, 1, 1, 6).setValues([[
    "Data/Hora",
    "Nome",
    "WhatsApp",
    "Renda",
    "Tipo de renda",
    "Localidade",
  ]]);
  sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function jsonOk() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function parseBody(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      return e.parameter || {};
    }
  }

  return (e && e.parameter) || {};
}
