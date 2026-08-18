import type { Lead } from "@/lib/lead";

export async function appendLeadToGoogleSheet(lead: Lead): Promise<boolean> {
  const url = process.env.SHEETS_WEBHOOK_URL?.trim();
  if (!url) {
    throw new Error("SHEETS_WEBHOOK_URL não configurada");
  }

  const body = JSON.stringify(lead);

  const postRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body,
    redirect: "follow",
  });
  const postText = await postRes.text();
  console.log("Google Sheets POST", postRes.status, postText.slice(0, 300));

  if (confirmed(postText)) return true;

  const getRes = await fetch(`${url}?${new URLSearchParams(lead).toString()}`, {
    method: "GET",
    redirect: "follow",
  });
  const getText = await getRes.text();
  console.log("Google Sheets GET", getRes.status, getText.slice(0, 300));

  if (confirmed(getText)) return true;

  throw new Error("Google Sheets não confirmou a gravação");
}

function confirmed(text: string): boolean {
  return text.includes('"ok":true') || text.includes('"ok": true');
}
