import { mkdir } from "fs/promises";
import path from "path";
import ExcelJS from "exceljs";
import type { Lead } from "@/lib/lead";

const HEADERS = [
  "Data/Hora",
  "Nome",
  "WhatsApp",
  "Renda",
  "Tipo de renda",
  "Localidade",
] as const;

export function getExcelPath(): string {
  return path.join(process.cwd(), "data", "leads.xlsx");
}

export async function appendLeadToExcel(lead: Lead): Promise<string> {
  const filePath = getExcelPath();
  await mkdir(path.dirname(filePath), { recursive: true });

  const workbook = new ExcelJS.Workbook();
  let sheet: ExcelJS.Worksheet;

  try {
    await workbook.xlsx.readFile(filePath);
    sheet = workbook.getWorksheet("Leads") ?? workbook.worksheets[0];
    if (!sheet) {
      sheet = workbook.addWorksheet("Leads");
      addHeaderRow(sheet);
    }
  } catch {
    sheet = workbook.addWorksheet("Leads");
    addHeaderRow(sheet);
  }

  sheet.addRow([
    new Date().toLocaleString("pt-BR"),
    lead.nome,
    lead.contato,
    lead.renda,
    lead.tipoRenda,
    lead.localidade,
  ]);

  sheet.columns.forEach((column) => {
    column.width = Math.max(column.width ?? 12, 22);
  });

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

function addHeaderRow(sheet: ExcelJS.Worksheet) {
  const header = sheet.addRow([...HEADERS]);
  header.font = { bold: true };
}
