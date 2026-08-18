"use client";

import { FormEvent, ReactNode, useState } from "react";
import { maskCurrency, maskPhone } from "@/lib/masks";

const INCOME_TYPES = [
  "Assalariado (CLT)",
  "Informal",
  "Autônomo / MEI",
  "Aposentado / Pensionista",
  "Outros",
] as const;

type FormState = {
  nome: string;
  contato: string;
  renda: string;
  tipoRenda: string;
  localidade: string;
};

const INITIAL: FormState = {
  nome: "",
  contato: "",
  renda: "",
  tipoRenda: "",
  localidade: "",
};

export function LeadForm() {
  const [values, setValues] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as {
        error?: string;
        whatsappUrl?: string;
      };

      if (!response.ok || !payload.whatsappUrl) {
        throw new Error(payload.error || "Não foi possível enviar o cadastro.");
      }

      setWhatsappUrl(payload.whatsappUrl);
      setSubmitted(true);
      window.location.assign(payload.whatsappUrl);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível enviar o cadastro.",
      );
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-card/80 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-md gold-glow">
        <p className="text-sm font-medium uppercase tracking-widest text-gold">
          Cadastro recebido
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          Abrindo o WhatsApp...
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Obrigado, {values.nome.split(" ")[0]}. Se o WhatsApp não abrir,
          toque no botão abaixo e envie a mensagem.
        </p>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            className="gold-glow mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-gold px-4 text-base font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:bg-gold-dark"
          >
            Enviar no WhatsApp
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-md gold-glow md:p-8">
      <form className="space-y-5" onSubmit={onSubmit}>
        <Field id="nome" label="Nome completo" icon={<UserIcon />}>
          <input
            id="nome"
            name="nome"
            required
            autoComplete="name"
            placeholder="Digite seu nome completo"
            className="field-input"
            value={values.nome}
            onChange={(event) => update("nome", event.target.value)}
          />
        </Field>

        <Field id="contato" label="Telefone / WhatsApp" icon={<PhoneIcon />}>
          <input
            id="contato"
            name="contato"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            className="field-input"
            value={values.contato}
            onChange={(event) => update("contato", maskPhone(event.target.value))}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="renda" label="Renda mensal" icon={<WalletIcon />}>
            <input
              id="renda"
              name="renda"
              inputMode="numeric"
              required
              placeholder="R$ 0,00"
              className="field-input"
              value={values.renda}
              onChange={(event) =>
                update("renda", maskCurrency(event.target.value))
              }
            />
          </Field>

          <Field id="tipoRenda" label="Tipo de renda" icon={<WalletIcon />}>
            <select
              id="tipoRenda"
              name="tipoRenda"
              required
              className={`field-input appearance-none pr-8 ${
                values.tipoRenda ? "" : "text-muted-foreground"
              }`}
              value={values.tipoRenda}
              onChange={(event) => update("tipoRenda", event.target.value)}
            >
              <option value="" disabled>
                Selecione
              </option>
              {INCOME_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          id="localidade"
          label="Localidade de interesse"
          icon={<PinIcon />}
        >
          <input
            id="localidade"
            name="localidade"
            required
            placeholder="Bairro, cidade ou região"
            className="field-input"
            value={values.localidade}
            onChange={(event) => update("localidade", event.target.value)}
          />
        </Field>

        {error ? (
          <p className="text-center text-sm text-red-400">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={sending}
          className="gold-glow inline-flex h-12 w-full items-center justify-center rounded-md bg-gold px-4 text-base font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Enviando..." : "Quero receber oportunidades"}
        </button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Ao enviar, você autoriza o contato da Conrado Prime Imóveis. Seus
          dados estão seguros e não serão compartilhados.
        </p>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium text-foreground"
      >
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold"
      aria-hidden="true"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold"
      aria-hidden="true"
    >
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold"
      aria-hidden="true"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold"
      aria-hidden="true"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
