import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  loadApplications,
  stageLabel,
  formatDate,
  type Application,
} from "@/lib/trademark";

export const Route = createFileRoute("/pesquisa")({
  head: () => ({
    meta: [
      { title: "Pesquisa de marcas — MarcaMoç" },
      {
        name: "description",
        content:
          "Consulte marcas registadas e pendentes em Moçambique antes de submeter o seu pedido ao IPI.",
      },
      { property: "og:title", content: "Pesquisa pública de marcas em Moçambique" },
      {
        property: "og:description",
        content: "Base de marcas registadas e pendentes, por nome, titular ou classe.",
      },
    ],
  }),
  component: PesquisaPage,
});

function PesquisaPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => setApps(loadApplications()), []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return apps;
    return apps.filter(
      (a) =>
        a.markName.toLowerCase().includes(term) ||
        a.applicantName.toLowerCase().includes(term) ||
        a.classes.join(" ").includes(term) ||
        (a.tagline ?? "").toLowerCase().includes(term),
    );
  }, [apps, q]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="font-display text-3xl">Pesquisa pública de marcas</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Verifique se o sinal que pretende já está registado ou pendente em Moçambique.
      </p>

      <div className="relative mt-8">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nome da marca, titular ou classe…"
          className="h-12 pl-10"
        />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{results.length} resultado(s)</p>

      <div className="mt-4 space-y-3">
        {results.map((a) => (
          <article key={a.id} className="surface-plate flex flex-wrap gap-4 p-5">
            <div className="min-w-56 flex-1">
              <h2 className="font-display text-xl">{a.markName}</h2>
              {a.tagline && <p className="text-sm italic text-muted-foreground">“{a.tagline}”</p>}
              <p className="mt-1 text-sm text-muted-foreground">{a.applicantName}</p>
            </div>
            <div className="flex flex-1 flex-wrap items-start gap-2">
              {a.classes.map((c) => (
                <Badge key={c} variant="secondary">
                  Classe {c}
                </Badge>
              ))}
            </div>
            <div className="text-right text-sm">
              <Badge variant={a.stage === "concedido" ? "default" : "outline"}>
                {stageLabel(a.stage)}
              </Badge>
              <p className="mt-2 text-xs text-muted-foreground">
                Pedido: {formatDate(a.filingDate)}
              </p>
              <p className="text-xs text-muted-foreground">
                {a.registrationNumber ?? a.ipiProcess ?? a.reference}
              </p>
            </div>
          </article>
        ))}
        {results.length === 0 && (
          <p className="surface-plate p-6 text-sm text-muted-foreground">
            Nenhuma marca corresponde à sua pesquisa — isso é um bom sinal para o seu pedido.
          </p>
        )}
      </div>
    </div>
  );
}
