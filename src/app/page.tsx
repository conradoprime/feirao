import { LeadForm } from "@/components/LeadForm";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
        <div className="subtle-pattern absolute inset-0 opacity-60" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "url(/conrado-prime-logo.png)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
      </div>

      <div className="pointer-events-none absolute inset-4 z-10 rounded-2xl border border-gold/20 md:inset-6" />

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-12 md:px-8">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex justify-center">
            <img
              src="/conrado-prime-logo.png"
              alt="Conrado Prime Imóveis"
              width={208}
              height={208}
              className="h-40 w-40 rounded-xl border border-gold/30 object-cover shadow-[0_0_40px_-12px_rgba(212,175,55,0.45)] md:h-52 md:w-52"
            />
          </div>

          <div className="mb-8 text-center">
            <p className="mb-3 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-gold">
              Evento por tempo limitado
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              Grande Feirão de Imóveis
            </h1>
            <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
              A Conrado Prime Imóveis selecionou empreendimentos do programa{" "}
              <strong className="font-semibold text-gold">MCMV</strong> e{" "}
              <strong className="font-semibold text-gold">Morar Bem</strong> com
              condições especiais. Cadastre-se agora e garanta atendimento
              prioritário com nossos corretores.
            </p>
          </div>

          <LeadForm />

          <p className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Conrado Prime Imóveis. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}
