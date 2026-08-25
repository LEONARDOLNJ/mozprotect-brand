import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loadApplications, formatDate, type Application } from "@/lib/trademark";

export const Route = createFileRoute("/verificar")({
  head: () => ({
    meta: [
      { title: "Verificar certificado — MarcaMoç" },
      {
        name: "description",
        content:
          "Confirme a autenticidade de um certificado de registo de marca emitido pela MarcaMoç através do número de registo.",
      },
      { property: "og:title", content: "Verificação de certificados de marca" },
      {
        property: "og:description",
        content: "Introduza o número de registo e confirme a validade do certificado.",
      },
    ],
  }),
  component: VerificarPage,
});

function VerificarPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Application | null | "none">(null);

  function check() {
    const found = loadApplications().find(
      (a) =>
        a.stage === "concedido" &&
        [a.registrationNumber, a.reference, a.ipiProcess]
          .filter(Boolean)
          .some((v) => v!.toLowerCase() === code.trim().toLowerCase()),
    );
    setResult(found ?? "none");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-display text-3xl">Verificar certificado</h1>
      <p className="mt-2 text-muted-foreground">
        Introduza o número de registo (ex.: MZ-2025-004417) impresso no certificado ou lido pelo
        código QR.
      </p>

      <div className="mt-8 flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="MZ-2025-004417"
          className="h-12"
        />
        <Button size="lg" onClick={check}>
          Verificar
        </Button>
      </div>

      {result === "none" && (
        <div className="surface-plate mt-6 flex gap-3 p-5">
          <XCircle className="size-6 shrink-0 text-destructive" />
          <div>
            <p className="font-semibold">Certificado não encontrado</p>
            <p className="text-sm text-muted-foreground">
              Nenhum registo concedido corresponde a este número. Confirme os dados ou contacte o
              nosso apoio.
            </p>
          </div>
        </div>
      )}

      {result && result !== "none" && (
        <div className="surface-plate mt-6 p-6">
          <div className="flex items-center gap-3">
            <BadgeCheck className="size-7 text-success" />
            <p className="font-display text-xl">Certificado válido</p>
          </div>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <Row label="Marca" value={result.markName} />
            <Row label="Titular" value={result.applicantName} />
            <Row label="N.º de registo" value={result.registrationNumber ?? "—"} />
            <Row label="Processo IPI" value={result.ipiProcess ?? "—"} />
            <Row label="Classes" value={result.classes.join(", ")} />
            <Row label="Concedido em" value={formatDate(result.grantDate)} />
            <Row label="Válido até" value={formatDate(result.expiryDate)} />
          </dl>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
