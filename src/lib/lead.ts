export type Lead = {
  nome: string;
  contato: string;
  renda: string;
  tipoRenda: string;
  localidade: string;
};

export function parseLead(input: unknown): Lead | null {
  if (!input || typeof input !== "object") return null;

  const data = input as Record<string, unknown>;
  const nome = String(data.nome ?? "").trim();
  const contato = String(data.contato ?? "").trim();
  const renda = String(data.renda ?? "").trim();
  const tipoRenda = String(data.tipoRenda ?? "").trim();
  const localidade = String(data.localidade ?? "").trim();
  const digits = contato.replace(/\D/g, "");

  if (!nome || !contato || !renda || !tipoRenda || !localidade) return null;
  if (digits.length < 10) return null;

  return { nome, contato, renda, tipoRenda, localidade };
}
