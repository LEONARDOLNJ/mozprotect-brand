import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/registar", label: "Registar marca" },
  { to: "/painel", label: "Painel" },
  { to: "/pesquisa", label: "Pesquisa" },
  { to: "/proteccao", label: "Protecção" },
  { to: "/verificar", label: "Verificar certificado" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold">MarcaMoç</span>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Registo de marcas
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild>
            <Link to="/registar">Começar pedido</Link>
          </Button>
        </div>

        <button
          className="grid size-10 place-items-center rounded-md border border-border lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
