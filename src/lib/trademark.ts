export type MarkType = "nominativa" | "figurativa" | "mista" | "slogan";

export type Stage =
  | "rascunho"
  | "submetido"
  | "exame_formal"
  | "publicado"
  | "oposicao"
  | "exame_substantivo"
  | "concedido"
  | "recusado";

export type ApplicantKind = "individual" | "empresa";

export interface StatusEvent {
  stage: Stage;
  date: string;
  note: string;
}

export interface Application {
  id: string;
  reference: string;
  ipiProcess: string | null;
  markType: MarkType;
  markName: string;
  tagline?: string;
  logoDataUrl?: string | null;
  logoDescription?: string;
  colourClaim?: string;
  classes: number[];
  applicantKind: ApplicantKind;
  applicantName: string;
  nuit: string;
  email: string;
  phone: string;
  province: string;
  address: string;
  agent?: string;
  stage: Stage;
  createdAt: string;
  filingDate: string | null;
  gazetteDate: string | null;
  grantDate: string | null;
  expiryDate: string | null;
  registrationNumber: string | null;
  fees: number;
  paymentMethod: string;
  events: StatusEvent[];
}

export const PROVINCES = [
  "Maputo Cidade",
  "Maputo Província",
  "Gaza",
  "Inhambane",
  "Sofala",
  "Manica",
  "Tete",
  "Zambézia",
  "Nampula",
  "Cabo Delgado",
  "Niassa",
];

export const MARK_TYPES: { value: MarkType; label: string; hint: string }[] = [
  { value: "nominativa", label: "Nominativa", hint: "Apenas o nome da marca, em texto." },
  { value: "figurativa", label: "Figurativa", hint: "Apenas o logótipo ou símbolo." },
  { value: "mista", label: "Mista", hint: "Nome e logótipo em conjunto." },
  { value: "slogan", label: "Slogan", hint: "Frase publicitária / tagline." },
];

export const NICE_CLASSES: { id: number; label: string }[] = [
  { id: 1, label: "Produtos químicos" },
  { id: 3, label: "Cosméticos e produtos de limpeza" },
  { id: 5, label: "Produtos farmacêuticos" },
  { id: 9, label: "Software, electrónica e aplicações" },
  { id: 11, label: "Aparelhos de iluminação e aquecimento" },
  { id: 14, label: "Joalharia e relógios" },
  { id: 16, label: "Papelaria e material impresso" },
  { id: 18, label: "Couro, malas e bagagem" },
  { id: 25, label: "Vestuário, calçado e chapelaria" },
  { id: 28, label: "Jogos e artigos desportivos" },
  { id: 29, label: "Carne, peixe e alimentos processados" },
  { id: 30, label: "Café, chá, farinha e pastelaria" },
  { id: 31, label: "Produtos agrícolas frescos" },
  { id: 32, label: "Cervejas, águas e refrigerantes" },
  { id: 33, label: "Bebidas alcoólicas" },
  { id: 35, label: "Publicidade, comércio e gestão" },
  { id: 36, label: "Serviços financeiros e seguros" },
  { id: 37, label: "Construção e reparação" },
  { id: 38, label: "Telecomunicações" },
  { id: 39, label: "Transporte e logística" },
  { id: 41, label: "Educação, formação e entretenimento" },
  { id: 42, label: "Serviços tecnológicos e de TI" },
  { id: 43, label: "Restauração e alojamento" },
  { id: 44, label: "Serviços médicos e de beleza" },
  { id: 45, label: "Serviços jurídicos e de segurança" },
];

export const STAGES: { key: Stage; label: string; blurb: string }[] = [
  { key: "rascunho", label: "Rascunho", blurb: "Pedido em preenchimento." },
  { key: "submetido", label: "Submetido", blurb: "Dossier enviado ao IPI." },
  { key: "exame_formal", label: "Exame formal", blurb: "Verificação de requisitos e taxas." },
  { key: "publicado", label: "Publicado no BPI", blurb: "Boletim da Propriedade Industrial." },
  { key: "oposicao", label: "Prazo de oposição", blurb: "60 dias para terceiros contestarem." },
  { key: "exame_substantivo", label: "Exame substantivo", blurb: "Análise de distintividade." },
  { key: "concedido", label: "Concedido", blurb: "Registo deferido e certificado emitido." },
  { key: "recusado", label: "Recusado", blurb: "Pedido indeferido pelo IPI." },
];

export const FEES = {
  filingPerClass: 3500,
  publication: 2500,
  grant: 4000,
  certificate: 1500,
};

export function quote(classCount: number) {
  const filing = FEES.filingPerClass * Math.max(classCount, 0);
  const total = classCount
    ? filing + FEES.publication + FEES.grant + FEES.certificate
    : 0;
  return { filing, total };
}

export function mzn(value: number) {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function stageIndex(stage: Stage) {
  const i = STAGES.findIndex((s) => s.key === stage);
  return i < 0 ? 0 : i;
}

export function stageLabel(stage: Stage) {
  return STAGES.find((s) => s.key === stage)?.label ?? stage;
}

export function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STORE_KEY = "marcamoc.applications.v1";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export function makeReference(seq: number) {
  return `MM-${new Date().getFullYear()}-${String(seq).padStart(5, "0")}`;
}

const SEED: Application[] = [
  {
    id: "seed-1",
    reference: "MM-2026-00118",
    ipiProcess: "IPI/MC/2026/00418",
    markType: "mista",
    markName: "Xitende Café",
    tagline: "O sabor da nossa terra",
    logoDataUrl: null,
    logoDescription: "Grão de café estilizado sobre folha de palmeira.",
    colourClaim: "Verde e dourado",
    classes: [30, 43],
    applicantKind: "empresa",
    applicantName: "Xitende Comércio, Lda",
    nuit: "400123456",
    email: "geral@xitende.co.mz",
    phone: "+258 84 000 0000",
    province: "Maputo Cidade",
    address: "Av. 24 de Julho, 1200, Maputo",
    agent: "",
    stage: "oposicao",
    createdAt: "2026-02-10",
    filingDate: "2026-02-12",
    gazetteDate: "2026-05-30",
    grantDate: null,
    expiryDate: null,
    registrationNumber: null,
    fees: quote(2).total,
    paymentMethod: "M-Pesa",
    events: [
      { stage: "submetido", date: "2026-02-12", note: "Dossier submetido ao IPI." },
      { stage: "exame_formal", date: "2026-03-04", note: "Requisitos formais validados." },
      { stage: "publicado", date: "2026-05-30", note: "Publicado no BPI n.º 10/2026." },
      { stage: "oposicao", date: "2026-05-30", note: "Prazo de oposição de 60 dias iniciado." },
    ],
  },
  {
    id: "seed-2",
    reference: "MM-2025-00042",
    ipiProcess: "IPI/MC/2025/01142",
    markType: "nominativa",
    markName: "Ncatini",
    logoDataUrl: null,
    classes: [25],
    applicantKind: "individual",
    applicantName: "Ana Cossa",
    nuit: "112233445",
    email: "ana@ncatini.mz",
    phone: "+258 82 111 1111",
    province: "Sofala",
    address: "Rua da Beira, 45, Beira",
    stage: "concedido",
    createdAt: "2025-01-08",
    filingDate: "2025-01-10",
    gazetteDate: "2025-04-15",
    grantDate: "2025-11-20",
    expiryDate: "2035-11-20",
    registrationNumber: "MZ-2025-004417",
    fees: quote(1).total,
    paymentMethod: "Transferência bancária",
    events: [
      { stage: "submetido", date: "2025-01-10", note: "Dossier submetido ao IPI." },
      { stage: "exame_formal", date: "2025-02-02", note: "Requisitos formais validados." },
      { stage: "publicado", date: "2025-04-15", note: "Publicado no BPI n.º 08/2025." },
      { stage: "oposicao", date: "2025-06-14", note: "Prazo terminado sem oposições." },
      { stage: "exame_substantivo", date: "2025-09-01", note: "Marca considerada distintiva." },
      { stage: "concedido", date: "2025-11-20", note: "Registo concedido por 10 anos." },
    ],
  },
  {
    id: "seed-3",
    reference: "MM-2026-00203",
    ipiProcess: null,
    markType: "slogan",
    markName: "Moza Solar",
    tagline: "Energia que não falha",
    logoDataUrl: null,
    classes: [11, 37],
    applicantKind: "empresa",
    applicantName: "Moza Solar, SA",
    nuit: "400998877",
    email: "legal@mozasolar.mz",
    phone: "+258 87 222 2222",
    province: "Nampula",
    address: "Av. do Trabalho, 90, Nampula",
    stage: "submetido",
    createdAt: "2026-08-02",
    filingDate: "2026-08-02",
    gazetteDate: null,
    grantDate: null,
    expiryDate: null,
    registrationNumber: null,
    fees: quote(2).total,
    paymentMethod: "e-Mola",
    events: [{ stage: "submetido", date: "2026-08-02", note: "Dossier enviado ao IPI." }],
  },
];

export function loadApplications(): Application[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as Application[];
  } catch {
    return SEED;
  }
}

export function saveApplications(apps: Application[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(apps));
}

export function createApplication(
  input: Omit<
    Application,
    | "id"
    | "reference"
    | "ipiProcess"
    | "stage"
    | "createdAt"
    | "filingDate"
    | "gazetteDate"
    | "grantDate"
    | "expiryDate"
    | "registrationNumber"
    | "events"
  >,
): Application {
  const existing = loadApplications();
  const today = new Date().toISOString().slice(0, 10);
  const app: Application = {
    ...input,
    id: makeId(),
    reference: makeReference(existing.length + 300),
    ipiProcess: `IPI/MC/${new Date().getFullYear()}/${String(existing.length + 900).padStart(5, "0")}`,
    stage: "submetido",
    createdAt: today,
    filingDate: today,
    gazetteDate: null,
    grantDate: null,
    expiryDate: null,
    registrationNumber: null,
    events: [
      { stage: "submetido", date: today, note: "Dossier transmitido ao IPI (canal electrónico)." },
    ],
  };
  saveApplications([app, ...existing]);
  return app;
}

export function advanceApplication(id: string): Application[] {
  const apps = loadApplications();
  const today = new Date().toISOString().slice(0, 10);
  const next = apps.map((a) => {
    if (a.id !== id) return a;
    const order: Stage[] = [
      "submetido",
      "exame_formal",
      "publicado",
      "oposicao",
      "exame_substantivo",
      "concedido",
    ];
    const i = order.indexOf(a.stage);
    if (i < 0 || i === order.length - 1) return a;
    const stage = order[i + 1]!;
    const updated: Application = {
      ...a,
      stage,
      events: [...a.events, { stage, date: today, note: `Estado actualizado: ${stageLabel(stage)}.` }],
    };
    if (stage === "publicado") updated.gazetteDate = today;
    if (stage === "concedido") {
      updated.grantDate = today;
      updated.registrationNumber = `MZ-${new Date().getFullYear()}-${a.reference.slice(-6)}`;
      const exp = new Date();
      exp.setFullYear(exp.getFullYear() + 10);
      updated.expiryDate = exp.toISOString().slice(0, 10);
    }
    return updated;
  });
  saveApplications(next);
  return next;
}

export function similarityCheck(name: string): Application[] {
  const q = name.trim().toLowerCase();
  if (q.length < 2) return [];
  return loadApplications().filter((a) => {
    const target = a.markName.toLowerCase();
    return target.includes(q) || q.includes(target);
  });
}
