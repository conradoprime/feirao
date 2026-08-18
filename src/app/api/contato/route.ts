import { NextResponse } from "next/server";
import { parseLead } from "@/lib/lead";
import { appendLeadToExcel } from "@/lib/excel";
import { appendLeadToGoogleSheet } from "@/lib/google-sheets";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const lead = parseLead(body);
  if (!lead) {
    return NextResponse.json(
      { error: "Preencha todos os campos com um telefone válido." },
      { status: 400 },
    );
  }

  const errors: string[] = [];
  let excelPath: string | null = null;
  let googleSaved = false;

  try {
    excelPath = await appendLeadToExcel(lead);
  } catch (error) {
    console.error("Falha ao gravar Excel:", error);
    errors.push("excel");
  }

  try {
    googleSaved = await appendLeadToGoogleSheet(lead);
  } catch (error) {
    console.error("Falha ao gravar Google Sheets:", error);
    errors.push("google");
  }

  if (!googleSaved) {
    return NextResponse.json(
      {
        error:
          "Não foi possível gravar na planilha do Google. Atualize o Apps Script e tente de novo.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    whatsappUrl: buildWhatsAppUrl(lead),
    savedToExcel: Boolean(excelPath),
    savedToGoogle: googleSaved,
    warnings: errors,
  });
}
