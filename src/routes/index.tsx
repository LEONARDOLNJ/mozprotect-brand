import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileSignature,
  Gavel,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FEES, mzn, STAGES } from "@/lib/trademark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MarcaMoç — Registe a sua marca em Moçambique, de qualquer província" },
      {
        name: "description",
        content:
          "Registo online de marcas em Moçambique: nome, logótipo ou slogan submetidos ao IPI, com acompanhamento de estado, certificado automático e defesa da marca.",
      },
      { property: "og:title", content: "MarcaMoç — Registo de marcas em Moçambique" },
      {
        property: "og:description",
        content:
          "Proteja o nome, logótipo e slogan do seu negócio com submissão electrónica ao Instituto da Propriedade Industrial.",
      },
    ],
  }),
  component: Home,
});

const STEPS = [
  {
    icon: FileSignature,
    title: "1. Preencha o pedido",
    text: "Escolha o tipo de marca, carregue o logótipo e seleccione as classes de Nice em português simples.",
  },
  {
    icon: Search,
    title: "2. Verificação prévia",
    text: "Comparamos o seu sinal com marcas registadas e pendentes e alertamos para conflitos antes de submeter.",
  },
  {
    icon: Building2,
    title: "3. Submissão ao IPI",
    text: "O dossier é transmitido ao Instituto da Propriedade Industrial e recebe um número de processo.",
  },
  {
    icon: BadgeCheck,
    title: "4. Certificado",
    text: "Concedido o registo, o certificado em PDF com QR de verificação é gerado automaticamente.",
  },
];

const FEATURES = [
  {
    icon: LineChart,
    title: "Painel de acompanhamento",
    text: "Linha do tempo com exame formal, publicação no BPI, oposição, exame substantivo e concessão.",
  },
  {
    icon: ShieldCheck,
    title: "Vigilância de marca",
    text: "Alertas quando surgir um sinal semelhante ao seu nas classes que protegeu.",
  },
  {
    icon: Gavel,
    title: "Salvaguardas jurídicas",
    text: "Oposições, notificações de cessação e denúncia de contrafacção com modelos prontos.",
  },
  {
    icon: Sparkles,
    title: "Renovação assistida",
    text: "Lembretes a 12, 6 e 1 mês do fim dos 10 anos de validade do registo.",
  },
];

function Home() {
  return (
    <>
      <section className="hero-weave text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Submissão electrónica ao IPI
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.08] text-balance-tight sm:text-5xl lg:text-6xl">
              Registe a sua marca em Moçambique sem sair da sua província
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              Proteja o nome, o logótipo e o slogan do seu negócio. Preenche online, nós instruímos
              o dossier, submetemos ao Instituto da Propriedade Industrial e acompanhamos o processo
              até ao certificado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/registar">
                  Iniciar registo <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/pesquisa">Pesquisar marcas</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-6">
              {[
                ["10 anos", "Validade renovável"],
                ["11", "Províncias abrangidas"],
                ["45", "Classes de Nice"],
              ].map(([big, small]) => (
                <div key={small}>
                  <dt className="font-display text-2xl text-accent">{big}</dt>
                  <dd className="mt-1 text-xs text-primary-foreground/70">{small}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="surface-plate p-6 text-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Tabela de taxas (MZN)
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ["Pedido por classe", FEES.filingPerClass],
                ["Publicação no BPI", FEES.publication],
                ["Concessão", FEES.grant],
                ["Emissão de certificado", FEES.certificate],
              ].map(([label, value]) => (
                <li key={label as string} className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{mzn(value as number)}</span>
                </li>
              ))}
            </ul>
            <div className="gold-rule my-5 h-px" />
            <p className="text-sm text-muted-foreground">
              Pagamento por M-Pesa, e-Mola, cartão ou transferência bancária. Orçamento detalhado
              antes de submeter.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link to="/registar">Calcular o meu pedido</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display text-3xl">Como funciona</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Um percurso guiado do primeiro formulário até ao certificado emitido.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.title} className="surface-plate p-6">
              <s.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl">Fases oficiais do processo</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Entre 6 e 18 meses, em média. Recebe notificação em cada mudança de estado.
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STAGES.filter((s) => s.key !== "rascunho" && s.key !== "recusado").map((s, i) => (
              <li key={s.key} className="surface-plate flex gap-4 p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold">{s.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{s.blurb}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display text-3xl">Protecção que continua depois do registo</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="surface-plate flex gap-4 p-6">
              <f.icon className="size-6 shrink-0 text-accent" />
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="font-display text-3xl">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="a">
            <AccordionTrigger>O que é uma marca registada?</AccordionTrigger>
            <AccordionContent>
              É um sinal — nome, logótipo, slogan ou combinação — que distingue os seus produtos ou
              serviços dos demais. O registo concede-lhe o uso exclusivo em Moçambique nas classes
              protegidas.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Quanto tempo demora?</AccordionTrigger>
            <AccordionContent>
              Normalmente entre 6 e 18 meses, dependendo do exame do IPI, da publicação no Boletim
              da Propriedade Industrial e de eventuais oposições.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Posso registar a partir de qualquer província?</AccordionTrigger>
            <AccordionContent>
              Sim. Todo o processo é electrónico e funciona em telemóvel, mesmo com ligação lenta.
              Não precisa de se deslocar a Maputo.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="d">
            <AccordionTrigger>Por quanto tempo é válido?</AccordionTrigger>
            <AccordionContent>
              O registo é válido por 10 anos a contar da concessão, renovável indefinidamente por
              períodos iguais.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="mt-8 rounded-lg border border-border bg-muted/60 p-4 text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">Aviso:</strong> esta plataforma facilita
          a submissão de pedidos junto do IPI e não substitui aconselhamento jurídico.
        </p>
      </section>
    </>
  );
}
