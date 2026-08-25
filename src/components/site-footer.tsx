import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">MarcaMoç</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Plataforma electrónica para registo e protecção de marcas em Moçambique, com submissão
            ao Instituto da Propriedade Industrial (IPI).
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Serviços</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><Link to="/registar" className="hover:text-foreground">Novo pedido</Link></li>
            <li><Link to="/painel" className="hover:text-foreground">Acompanhar estado</Link></li>
            <li><Link to="/pesquisa" className="hover:text-foreground">Pesquisa de marcas</Link></li>
            <li><Link to="/proteccao" className="hover:text-foreground">Defesa da marca</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Contactos</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>apoio@marcamoc.mz</li>
            <li>+258 84 000 0000</li>
            <li>Av. 25 de Setembro, Maputo</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Aviso legal</p>
          <p className="mt-3 text-muted-foreground">
            A MarcaMoç facilita a instrução e submissão de pedidos junto do IPI. Não substitui
            aconselhamento jurídico nem garante a concessão do registo.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MarcaMoç. Todos os direitos reservados.
      </div>
    </footer>
  );
}
