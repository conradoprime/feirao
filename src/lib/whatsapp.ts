import type { Lead } from "@/lib/lead";

const DEFAULT_WHATSAPP = "5581993988786";

export function getWhatsAppNumber(): string {
  return (process.env.WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP).replace(/\D/g, "");
}

export function buildWhatsAppUrl(lead: Lead): string {
  const number = getWhatsAppNumber();
  const text = [
    "Olá! Acabei de me cadastrar no Grande Feirão da Conrado Prime Imóveis.",
    "",
    `Nome: ${lead.nome}`,
    `WhatsApp: ${lead.contato}`,
    `Renda mensal: ${lead.renda}`,
    `Tipo de renda: ${lead.tipoRenda}`,
    `Localidade de interesse: ${lead.localidade}`,
  ].join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
