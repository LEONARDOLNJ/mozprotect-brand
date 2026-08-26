import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, FastForward, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  advanceApplication,
  formatDate,
  loadApplications,
  mzn,
  STAGES,
  stageIndex,
  stageLabel,
  type Application,
} from "@/lib/trademark";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel de acompanhamento — MarcaMoç" },
      {
        name: "description",
        content:
          "Acompanhe o estado dos seus pedidos de marca no IPI, veja o histórico de eventos e descarregue o certificado de registo.",
      },
      { property: "og:title", content: "Painel de acompanhamento de marcas" },
      {
        property: "og:description",
        content: "Linha do tempo oficial, registo de eventos e certificado automático.",
      },
    ],
  }),
  component: PainelPage,
});

const TIMELINE = STAGES.filter((s) => s.key !== "rascunho" && s.key !== "recusado");

function certificateHtml(a: Application) {
  return `<!doctype html><html lang="pt"><head><meta charset="utf-8">
<title>Certificado ${a.registrationNumber ?? a.reference}</title>
<style>
body{font-family:Georgia,serif;margin:0;padding:56px;color:#1d2b23}
.frame{border:6px double #b98a2e;padding:48px;text-align:center}
h1{font-size:30px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 6px}
h2{font-size:34px;margin:28px 0 4px}
.small{font-size:13px;color:#5a6b60}
table{margin:32px auto 0;border-collapse:collapse;font-size:14px}
td{padding:6px 14px;border-bottom:1px solid #e2e2d8;text-align:left}
</style></head><body><div class="frame">
<p class="small">República de Moçambique · Instituto da Propriedade Industrial</p>
<h1>Certificado de Registo de Marca</h1>
<h2>${a.markName}</h2>
${a.tagline ? `<p class="small"><em>“${a.tagline}”</em></p>` : ""}
<p class="small">Titular: <strong>${a.applicantName}</strong> — NUIT ${a.nuit}</p>
<table>
<tr><td>N.º de registo</td><td>${a.registrationNumber ?? "—"}</td></tr>
<tr><td>Processo IPI</td><td>${a.ipiProcess ?? "—"}</td></tr>
<tr><td>Tipo de marca</td><td>${a.markType}</td></tr>
<tr><td>Classes de Nice</td><td>${a.classes.join(", ")}</td></tr>
<tr><td>Data de concessão</td><td>${formatDate(a.grantDate)}</td></tr>
<tr><td>Válido até</td><td>${formatDate(a.expiryDate)}</td></tr>
<tr><td>Província</td><td>${a.province}</td></tr>
</table>
<p class="small" style="margin-top:36px">Verifique a autenticidade em marcamoc.mz/verificar com a referência ${a.reference}.</p>
</div></body></html>`;
}

function downloadCertificate(a: Application) {
  const blob = new Blob([certificateHtml(a)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `certificado-${a.registrationNumber ?? a.reference}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

function PainelPage() {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => setApps(loadApplications()), []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Painel de acompanhamento</h1>
          <p className="mt-2 text-muted-foreground">
            Estado actual de cada pedido junto do IPI, com histórico e certificado.
          </p>
        </div>
        <Button asChild>
          <Link to="/registar">Novo pedido</Link>
        </Button>
      </div>

      <div className="mt-10 space-y-6">
        {apps.map((a) => {
          const current = stageIndex(a.stage);
          return (
            <article key={a.id} className="surface-plate p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl">{a.markName}</h2>
                  {a.tagline && (
                    <p className="text-sm italic text-muted-foreground">“{a.tagline}”</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {a.reference} · {a.ipiProcess ?? "sem processo"} · {a.province}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={a.stage === "concedido" ? "default" : "outline"}>
                    {stageLabel(a.stage)}
                  </Badge>
                  <p className="mt-2 text-sm text-muted-foreground">Taxas: {mzn(a.fees)}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {a.classes.map((c) => (
                  <Badge key={c} variant="secondary">
                    Classe {c}
                  </Badge>
                ))}
              </div>

              <ol className="mt-6 grid gap-3 sm:grid-cols-3">
                {TIMELINE.map((s, i) => {
                  const done = i <= current - 1;
                  const active = stageLabel(a.stage) === s.label;
                  return (
                    <li
                      key={s.key}
                      className={`rounded-lg border p-3 text-sm ${
                        active
                          ? "border-primary bg-secondary/60"
                          : done
                            ? "border-border bg-muted/50"
                            : "border-dashed border-border opacity-60"
                      }`}
                    >
                      <span className="font-semibold">{s.label}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{s.blurb}</span>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold">Registo de eventos</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    {a.events.map((e, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-24 shrink-0 text-xs text-muted-foreground">
                          {formatDate(e.date)}
                        </span>
                        <span className="text-muted-foreground">{e.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3 text-sm">
                  <h3 className="font-semibold">Datas oficiais</h3>
                  <p className="text-muted-foreground">Pedido: {formatDate(a.filingDate)}</p>
                  <p className="text-muted-foreground">Publicação: {formatDate(a.gazetteDate)}</p>
                  <p className="text-muted-foreground">Concessão: {formatDate(a.grantDate)}</p>
                  <p className="text-muted-foreground">Validade: {formatDate(a.expiryDate)}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setApps(advanceApplication(a.id))}
                  disabled={a.stage === "concedido" || a.stage === "recusado"}
                >
                  <FastForward className="mr-1 size-4" /> Simular próxima fase
                </Button>
                {a.stage === "concedido" ? (
                  <Button onClick={() => downloadCertificate(a)}>
                    <Download className="mr-1 size-4" /> Descarregar certificado
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>
                    <FileText className="mr-1 size-4" /> Certificado após concessão
                  </Button>
                )}
              </div>
            </article>
          );
        })}

        {apps.length === 0 && (
          <p className="surface-plate p-6 text-sm text-muted-foreground">
            Ainda não tem pedidos. <Link to="/registar" className="underline">Inicie um registo</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
