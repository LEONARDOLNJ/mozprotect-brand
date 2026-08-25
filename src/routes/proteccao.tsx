import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Gavel, Eye, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadApplications, type Application } from "@/lib/trademark";

export const Route = createFileRoute("/proteccao")({
  head: () => ({
    meta: [
      { title: "Protecção da marca — oposições e contrafacção | MarcaMoç" },
      {
        name: "description",
        content:
          "Vigilância de marcas, apresentação de oposições, carta de cessação e denúncia de contrafacção para titulares em Moçambique.",
      },
      { property: "og:title", content: "Salvaguardas jurídicas para a sua marca" },
      {
        property: "og:description",
        content: "Monitorize sinais semelhantes, oponha-se a pedidos e reaja a usos indevidos.",
      },
    ],
  }),
  component: ProteccaoPage,
});

function ProteccaoPage() {
  const [apps, setApps] = useState<Application[]>([]);
  useEffect(() => setApps(loadApplications()), []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-display text-3xl">Salvaguardas para a sua marca</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        O registo é o começo. Aqui vigia sinais semelhantes, contesta pedidos de terceiros e reage a
        usos indevidos do seu nome, logótipo ou slogan.
      </p>

      <Tabs defaultValue="vigilancia" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="vigilancia">Vigilância</TabsTrigger>
          <TabsTrigger value="oposicao">Oposição</TabsTrigger>
          <TabsTrigger value="cessacao">Carta de cessação</TabsTrigger>
          <TabsTrigger value="denuncia">Denúncia</TabsTrigger>
        </TabsList>

        <TabsContent value="vigilancia" className="surface-plate mt-4 p-6">
          <div className="flex items-center gap-2">
            <Eye className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Marcas sob vigilância</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Receba um alerta sempre que for publicado um sinal semelhante nas suas classes.
          </p>
          <ul className="mt-5 divide-y divide-border">
            {apps.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{a.markName}</p>
                  <p className="text-xs text-muted-foreground">
                    Classes {a.classes.join(", ")} · {a.reference}
                  </p>
                </div>
                <Switch
                  defaultChecked
                  onCheckedChange={(v) =>
                    toast.success(v ? `Vigilância activada para ${a.markName}` : "Vigilância desactivada")
                  }
                />
              </li>
            ))}
            {apps.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">Ainda não tem marcas registadas.</li>
            )}
          </ul>
        </TabsContent>

        <TabsContent value="oposicao" className="surface-plate mt-4 p-6">
          <div className="flex items-center gap-2">
            <Gavel className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Apresentar oposição</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Dispõe de 60 dias após a publicação no Boletim da Propriedade Industrial.
          </p>
          <form
            className="mt-5 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Oposição registada. Será instruída e submetida ao IPI.");
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="proc">Processo contestado (n.º IPI ou nome)</Label>
              <Input id="proc" required placeholder="IPI/MC/2026/00418" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fund">Fundamentos</Label>
              <Textarea
                id="fund"
                required
                rows={5}
                placeholder="Descreva a semelhança, o risco de confusão e a anterioridade da sua marca…"
              />
            </div>
            <Button type="submit" className="justify-self-start">
              Submeter oposição
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="cessacao" className="surface-plate mt-4 p-6">
          <CeaseAndDesist apps={apps} />
        </TabsContent>

        <TabsContent value="denuncia" className="surface-plate mt-4 p-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Denunciar contrafacção</h2>
          </div>
          <form
            className="mt-5 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Denúncia recebida. A nossa equipa jurídica entrará em contacto.");
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="onde">Onde ocorre o uso indevido</Label>
              <Input id="onde" required placeholder="Loja, mercado, website, rede social…" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Descrição dos factos</Label>
              <Textarea id="desc" required rows={5} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prova">Provas (fotografias, capturas de ecrã)</Label>
              <Input id="prova" type="file" multiple accept="image/*,application/pdf" />
            </div>
            <Button type="submit" className="justify-self-start">
              Enviar denúncia
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CeaseAndDesist({ apps }: { apps: Application[] }) {
  const [mark, setMark] = useState("");
  const [target, setTarget] = useState("");
  const owner = apps.find((a) => a.markName === mark);

  const letter = `À atenção de ${target || "[destinatário]"}

Assunto: Uso não autorizado da marca "${mark || "[marca]"}"

Na qualidade de titular da marca "${mark || "[marca]"}"${
    owner?.registrationNumber ? `, registada sob o n.º ${owner.registrationNumber}` : ""
  }${owner ? ` nas classes ${owner.classes.join(", ")}` : ""}, junto do Instituto da Propriedade Industrial de Moçambique, venho por este meio notificar V. Exa. de que o uso do referido sinal distintivo, sem a nossa autorização expressa, constitui violação dos direitos de propriedade industrial conferidos pelo Código da Propriedade Industrial.

Solicitamos que, no prazo de 10 (dez) dias úteis a contar da recepção da presente, cesse de imediato todo e qualquer uso da marca, incluindo em produtos, embalagens, materiais publicitários, sinalética e meios digitais, e que nos confirme por escrito o cumprimento.

Não o fazendo, reservamo-nos o direito de recorrer às vias administrativas e judiciais competentes, com pedido de indemnização pelos danos causados.

Com os melhores cumprimentos,
${owner?.applicantName || "[titular]"}
${new Date().toLocaleDateString("pt-MZ")}`;

  return (
    <>
      <h2 className="text-lg font-semibold">Gerador de carta de cessação</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="marca">A sua marca</Label>
          <Input
            id="marca"
            list="marcas"
            value={mark}
            onChange={(e) => setMark(e.target.value)}
            placeholder="Ncatini"
          />
          <datalist id="marcas">
            {apps.map((a) => (
              <option key={a.id} value={a.markName} />
            ))}
          </datalist>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dest">Destinatário</Label>
          <Input
            id="dest"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Nome da empresa infractora"
          />
        </div>
      </div>
      <pre className="mt-5 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed">
        {letter}
      </pre>
      <Button
        className="mt-4"
        variant="secondary"
        onClick={() => {
          navigator.clipboard?.writeText(letter);
          toast.success("Carta copiada para a área de transferência.");
        }}
      >
        <Copy className="mr-2 size-4" /> Copiar carta
      </Button>
    </>
  );
}
