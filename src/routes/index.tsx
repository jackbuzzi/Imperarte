import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, MapPin, Phone } from "lucide-react";

import logo from "@/assets/logo.jpg.asset.json";
import booth from "@/assets/booth.jpg.asset.json";
import cadeirao from "@/assets/cadeirao.jpg.asset.json";
import banqueta from "@/assets/banqueta.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Imperarte Móveis | Novo site em construção" },
      {
        name: "description",
        content:
          "Imperarte Móveis: cadeiras, banquetas, mesas, bistrôs e booths em madeira para lojistas. Rio Negrinho - SC. Fale pelo WhatsApp (47) 99966-1025.",
      },
      { property: "og:title", content: "Imperarte Móveis | Novo site em construção" },
      {
        property: "og:description",
        content:
          "Móveis em madeira com qualidade e personalidade para lojistas. Rio Negrinho - SC.",
      },
    ],
  }),
  component: Index,
});

const WHATSAPP =
  "https://wa.me/5547999661025?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20Imperarte%20M%C3%B3veis";

const produtos = [
  { src: booth.url, alt: "Booth estofado em couro vermelho com base em madeira" },
  { src: cadeirao.url, alt: "Cadeirão infantil em madeira maciça" },
  { src: banqueta.url, alt: "Banqueta alta em madeira com encosto cruzado" },
];

const telefones = ["(47) 3644-7411", "(47) 3644-1919", "(47) 3644-8707"];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <header className="relative isolate flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
        <img
          src={booth.url}
          alt="Booth estofado fabricado pela Imperarte Móveis"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="wood-grain absolute inset-0 -z-10 opacity-40" aria-hidden />

        <div className="mx-auto w-full max-w-2xl">
          <div className="mx-auto w-56 rounded-xl bg-background/95 p-5 shadow-[var(--shadow-lift)] sm:w-72">
            <img
              src={logo.url}
              alt="Logotipo Imperarte Móveis"
              className="mx-auto h-auto w-full object-contain"
            />
          </div>

          <h1 className="mt-10 text-4xl font-semibold tracking-wide text-background sm:text-6xl">
            IMPERARTE MÓVEIS
          </h1>
          <div className="rule-gold mx-auto mt-6 w-40" aria-hidden />
          <p className="mt-6 text-lg text-background/90 sm:text-xl">
            Nosso novo site está em construção
          </p>
          <p className="mx-auto mt-3 max-w-lg font-display text-xl italic text-background/75 sm:text-2xl">
            “Em breve, um novo espaço para você conhecer nossos móveis, projetos e soluções.”
          </p>

          <div
            className="progress-track mx-auto mt-10 h-1.5 w-56 rounded-full sm:w-72"
            role="presentation"
          />

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-[1.03]"
            style={{ background: "var(--gradient-green)" }}
          >
            <MessageCircle className="h-5 w-5" />
            Fale conosco pelo WhatsApp
          </a>
        </div>
      </header>

      <main>
        {/* SOBRE */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Sobre a empresa</p>
              <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Imperarte Móveis</h2>
              <div className="rule-gold mt-6 w-32" aria-hidden />
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Qualidade, personalidade e cuidado em cada detalhe. A Imperarte Móveis trabalha com
                móveis e soluções que unem beleza, funcionalidade e o aconchego da madeira, criando
                ambientes com identidade.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]">
              <img
                src={cadeirao.url}
                alt="Cadeirão infantil em madeira maciça da Imperarte Móveis"
                loading="lazy"
                className="h-full w-full bg-card object-contain p-8"
              />
            </div>
          </div>
        </section>

        {/* GALERIA */}
        <section className="wood-grain bg-secondary/50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-4xl font-semibold sm:text-5xl">Em breve, novidades</h2>
            <div className="rule-gold mx-auto mt-6 w-32" aria-hidden />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {produtos.map((p) => (
                <div
                  key={p.src}
                  className="group overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]"
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOCALIZAÇÃO */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-4xl font-semibold sm:text-5xl">Onde estamos</h2>
          </div>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Rua Domingos da Silva, 111
            <br />
            Bairro Campo Lençol
            <br />
            Rio Negrinho - SC
            <br />
            CEP 89295-260
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]">
            <iframe
              title="Mapa da localização da Imperarte Móveis"
              src="https://www.google.com/maps?q=Rua%20Domingos%20da%20Silva%2C%20111%2C%20Campo%20Len%C3%A7ol%2C%20Rio%20Negrinho%20-%20SC%2C%2089295-260&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full border-0 sm:h-[420px]"
            />
          </div>
        </section>

        {/* CONTATO */}
        <section className="bg-secondary/50 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-4xl font-semibold sm:text-5xl">Entre em contato</h2>
            <div className="rule-gold mx-auto mt-6 w-32" aria-hidden />
            <p className="mt-8 text-lg font-medium">Silvio</p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-muted-foreground">
              {telefones.map((t) => (
                <a
                  key={t}
                  href={`tel:+55${t.replace(/\D/g, "")}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {t}
                </a>
              ))}
            </div>
            <p className="mt-8 font-display text-3xl font-semibold text-primary">
              (47) 99966-1025
            </p>
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">WhatsApp</p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-green)" }}
            >
              <MessageCircle className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </div>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="bg-wood-deep py-14 text-center text-background">
        <div className="mx-auto w-32 rounded-lg bg-background/95 p-3">
          <img
            src={logo.url}
            alt="Logotipo Imperarte Móveis"
            className="mx-auto h-auto w-full object-contain"
          />
        </div>
        <p className="mt-6 font-display text-2xl">Imperarte Móveis</p>
        <p className="text-sm text-background/70">Rio Negrinho - SC</p>
        <p className="mt-8 text-xs text-background/60">
          Desenvolvido por{" "}
          <a
            href="https://www.negocio360graus.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-background"
          >
            Negócio 360 Graus
          </a>
        </p>
      </footer>

      {/* WHATSAPP FLUTUANTE */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar no WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-110"
        style={{ background: "var(--gradient-green)" }}
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
