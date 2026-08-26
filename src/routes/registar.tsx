import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  createApplication,
  FEES,
  MARK_TYPES,
  mzn,
  NICE_CLASSES,
  PROVINCES,
  quote,
  similarityCheck,
  type ApplicantKind,
  type MarkType,
} from "@/lib/trademark";

export const Route = createFileRoute("/registar")({
  head: () => ({
    meta: [
      { title: "Iniciar registo de marca — MarcaMoç" },
      {
        name: "description",
        content:
          "Formulário guiado para registar nome, logótipo ou slogan junto do IPI em Moçambique: classes de Nice, verificação de conflitos e orçamento.",
      },
      { property: "og:title", content: "Iniciar registo de marca em Moçambique" },
      {
        property: "og:description",
        content: "Pedido online passo a passo com verificação prévia e cálculo de taxas.",
      },
    ],
  }),
  component: RegistarPage,
});

const PAYMENTS = ["M-Pesa", "e-Mola", "Cartão bancário", "Transferência bancária"];
const STEP_LABELS = [
  "Tipo de marca",
  "Requerente",
  "Logótipo",
  "Classes",
  "Verificação",
  "Taxas e submissão",
];

function RegistarPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [markType, setMarkType] = useState<MarkType>("nominativa");
  const [markName, setMarkName] = useState("");
  const [tagline, setTagline] = useState("");

  const [applicantKind, setApplicantKind] = useState<ApplicantKind>("empresa");
  const [applicantName, setApplicantName] = useState("");
  const [nuit, setNuit] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState(PROVINCES[0]!);
  const [address, setAddress] = useState("");
  const [agent, setAgent] = useState("");

  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoDescription, setLogoDescription] = useState("");
  const [colourClaim, setColourClaim] = useState("");

  const [classes, setClasses] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENTS[0]!);
  const [declared, setDeclared] = useState(false);

  const fees = useMemo(() => quote(classes.length), [classes.length]);
  const conflicts = useMemo(
    () => (step >= 4 ? similarityCheck(markName) : []),
    [step, markName],
  );

  const needsLogo = markType === "figurativa" || markType === "mista";

  function stepValid(s: number) {
    switch (s) {
      case 0:
        return markType === "figurativa" ? true : markName.trim().length >= 2;
      case 1:
        return (
          applicantName.trim().length >= 2 &&
          nuit.trim().length >= 5 &&
          /\S+@\S+\.\S+/.test(email) &&
          phone.trim().length >= 6 &&
          address.trim().length >= 4
        );
      case 2:
        return !needsLogo || Boolean(logoDataUrl) || logoDescription.trim().length >= 4;
      case 3:
        return classes.length > 0;
      default:
        return true;
    }
  }

  function next() {
    if (!stepValid(step)) {
      toast.error("Preencha os campos obrigatórios para continuar.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function onLogo(file: File | undefined) {
    if (!file) return;
    if (file.size > 2_000_000) {
      toast.error("O ficheiro deve ter no máximo 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submit() {
    if (!declared) {
      toast.error("Confirme a declaração de boa-fé antes de submeter.");
      return;
    }
    const app = createApplication({
      markType,
      markName: markName.trim() || "(marca figurativa)",
      tagline: tagline.trim() || undefined,
      logoDataUrl,
      logoDescription: logoDescription.trim() || undefined,
      colourClaim: colourClaim.trim() || undefined,
      classes,
      applicantKind,
      applicantName: applicantName.trim(),
      nuit: nuit.trim(),
      email: email.trim(),
      phone: phone.trim(),
      province,
      address: address.trim(),
      agent: agent.trim() || undefined,
      fees: fees.total,
      paymentMethod,
    });
    toast.success(`Pedido submetido — processo ${app.ipiProcess}`);
    void navigate({ to: "/painel" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl">Pedido de registo de marca</h1>
      <p className="mt-2 text-muted-foreground">
        Passo {step + 1} de {STEP_LABELS.length} — {STEP_LABELS[step]}
      </p>
      <Progress value={((step + 1) / STEP_LABELS.length) * 100} className="mt-4" />

      <div className="surface-plate mt-8 space-y-6 p-6">
        {step === 0 && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {MARK_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setMarkType(t.value)}
                  className={`rounded-xl border p-4 text-left transition ${
                    markType === t.value
                      ? "border-primary bg-secondary/60"
                      : "border-border hover:bg-muted/60"
                  }`}
                >
                  <span className="font-semibold">{t.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{t.hint}</span>
                </button>
              ))}
            </div>
            <div>
              <Label htmlFor="markName">Nome da marca</Label>
              <Input
                id="markName"
                value={markName}
                onChange={(e) => setMarkName(e.target.value)}
                placeholder="Ex.: Xitende Café"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Slogan / tagline (opcional)</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex.: O sabor da nossa terra"
                className="mt-1.5"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex gap-2">
              {(["empresa", "individual"] as ApplicantKind[]).map((k) => (
                <Button
                  key={k}
                  type="button"
                  variant={applicantKind === k ? "default" : "outline"}
                  onClick={() => setApplicantKind(k)}
                >
                  {k === "empresa" ? "Empresa" : "Pessoa singular"}
                </Button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="applicantName">
                  {applicantKind === "empresa" ? "Denominação social" : "Nome completo"}
                </Label>
                <Input
                  id="applicantName"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="nuit">NUIT</Label>
                <Input
                  id="nuit"
                  value={nuit}
                  onChange={(e) => setNuit(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telemóvel</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+258 84 000 0000"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Província</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="agent">Mandatário / representante (opcional)</Label>
                <Input
                  id="agent"
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-muted-foreground">
              {needsLogo
                ? "Carregue o logótipo (PNG ou JPG, máx. 2 MB) e descreva os elementos figurativos."
                : "A sua marca é apenas textual — o logótipo é opcional."}
            </p>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground hover:bg-muted/50">
              <Upload className="size-5" />
              {logoDataUrl ? "Substituir ficheiro" : "Escolher ficheiro"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                onChange={(e) => onLogo(e.target.files?.[0])}
              />
            </label>
            {logoDataUrl && (
              <img
                src={logoDataUrl}
                alt="Pré-visualização do logótipo carregado"
                className="mx-auto max-h-40 rounded-lg border border-border bg-card p-2"
              />
            )}
            <div>
              <Label htmlFor="logoDescription">Descrição do logótipo</Label>
              <Textarea
                id="logoDescription"
                value={logoDescription}
                onChange={(e) => setLogoDescription(e.target.value)}
                className="mt-1.5"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="colourClaim">Reivindicação de cores (opcional)</Label>
              <Input
                id="colourClaim"
                value={colourClaim}
                onChange={(e) => setColourClaim(e.target.value)}
                placeholder="Ex.: Verde e dourado"
                className="mt-1.5"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-muted-foreground">
              Escolha as classes de Nice que cobrem os seus produtos ou serviços. Cada classe é
              taxada em {mzn(FEES.filingPerClass)}.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {NICE_CLASSES.map((c) => {
                const on = classes.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      setClasses((prev) =>
                        on ? prev.filter((x) => x !== c.id) : [...prev, c.id].sort((a, b) => a - b),
                      )
                    }
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition ${
                      on ? "border-primary bg-secondary/60" : "border-border hover:bg-muted/60"
                    }`}
                  >
                    <Badge variant={on ? "default" : "outline"}>{c.id}</Badge>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="font-display text-xl">Verificação de conflitos</h2>
            {conflicts.length === 0 ? (
              <p className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm">
                <CheckCircle2 className="size-5 shrink-0 text-success" />
                Não encontrámos marcas semelhantes a “{markName || "a sua marca"}” na base
                consultada. O risco de recusa por anterioridade é reduzido.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
                  <AlertTriangle className="size-5 shrink-0 text-warning" />
                  Encontrámos {conflicts.length} sinal(is) potencialmente conflituante(s). Pode
                  prosseguir, mas o IPI poderá levantar objecções.
                </p>
                {conflicts.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border p-4 text-sm">
                    <p className="font-semibold">{c.markName}</p>
                    <p className="text-muted-foreground">
                      {c.applicantName} · classes {c.classes.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="font-display text-xl">Orçamento</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">
                  Pedido ({classes.length} classe{classes.length === 1 ? "" : "s"})
                </span>
                <span className="font-semibold">{mzn(fees.filing)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Publicação no BPI</span>
                <span className="font-semibold">{mzn(FEES.publication)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Concessão</span>
                <span className="font-semibold">{mzn(FEES.grant)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Certificado</span>
                <span className="font-semibold">{mzn(FEES.certificate)}</span>
              </li>
            </ul>
            <div className="gold-rule h-px" />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-display">{mzn(fees.total)}</span>
            </div>
            <div>
              <Label>Método de pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENTS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={declared}
                onCheckedChange={(v) => setDeclared(v === true)}
                className="mt-0.5"
              />
              <span className="text-muted-foreground">
                Declaro, de boa-fé, que uso ou pretendo usar este sinal no comércio e que as
                informações prestadas são verdadeiras.
              </span>
            </label>
          </>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-1 size-4" /> Voltar
          </Button>
          {step < STEP_LABELS.length - 1 ? (
            <Button type="button" onClick={next}>
              Continuar <ArrowRight className="ml-1 size-4" />
            </Button>
          ) : (
            <Button type="button" onClick={submit}>
              Submeter ao IPI
            </Button>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        A submissão gera um número de processo IPI e activa o acompanhamento no painel. Esta
        plataforma facilita o pedido e não substitui aconselhamento jurídico.
      </p>
    </div>
  );
}
