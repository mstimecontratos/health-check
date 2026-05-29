"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContextOption =
  | "franquia"
  | "representacao"
  | "agencia"
  | "intermediacao"
  | "misto";

type PilarAnswer = "A" | "B" | "C";

interface LeadData {
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  whatsapp: string;
  contratos: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const CONTEXT_OPTIONS: { id: ContextOption; label: string }[] = [
  { id: "franquia", label: "Franquia" },
  { id: "representacao", label: "Representação" },
  { id: "agencia", label: "Agência" },
  { id: "intermediacao", label: "Intermediação / Canais Digitais" },
  { id: "misto", label: "Misto / Outros" },
];

const PILARES = [
  {
    numero: 1,
    titulo: "Blindagem Documental",
    pergunta:
      "Sua rede possui 100% de contratos ativos com assinaturas digitais auditáveis e validade jurídica incontestável?",
    opcoes: {
      A: "Sim, tudo centralizado e auditável.",
      B: "Parcialmente, alguns contratos ainda são físicos ou informais.",
      C: "Não temos controle centralizado das assinaturas.",
    },
    recomendacoes: {
      A: "Sua rede tem lastro documental sólido. Isso é o que define se você consegue fazer valer um contrato quando precisar. Contudo, mantenha auditorias periódicas: o risco nesse estágio não é a ausência de documentação, é ela ficar desatualizada sem que ninguém perceba.",
      B: "Parte da sua rede ainda opera no informal ou no físico. Isso funciona enquanto as relações estão bem, mas o problema aparece quando uma parceria termina mal e você precisa provar o que foi acordado. Contratos sem trilha de auditoria são os primeiros a serem contestados e virarem passivo.",
      C: "Sem controle centralizado de assinaturas, você não tem certeza sobre o que está vigente, o que foi assinado e o que ficou em aberto. Esse vazio documental não é um risco futuro — ele já existe hoje, em cada contrato da sua rede que não tem lastro rastreável.",
    },
  },
  {
    numero: 2,
    titulo: "Higiene de Saída",
    pergunta:
      "Ao encerrar uma parceria, a empresa garante a assinatura de um termo de quitação que neutraliza pedidos de indenizações retroativas?",
    opcoes: {
      A: 'Sim, temos um fluxo de "Exit" padronizado com quitação plena.',
      B: "Nem sempre conseguimos colher a assinatura no desligamento.",
      C: "Não utilizamos termos de quitação específicos na saída.",
    },
    recomendacoes: {
      A: "Você tem um dos processos mais negligenciados em redes bem geridas funcionando corretamente. Uma saída bem documentada é o que separa um desligamento limpo de um litígio iminente. Contudo, certifique-se de que as quitações cobrem todas as verbas da relação, porque uma quitação genérica pode não ser suficiente.",
      B: "Cada parceria encerrada sem quitação é um passivo em aberto com prazo de prescrição. Você provavelmente já tem alguns acumulados, só não sabe exatamente quantos.",
      C: "Sem termos de quitação, o término de um contrato não encerra nada juridicamente. O ex-parceiro mantém aberta a possibilidade de reivindicar verbas da relação enquanto o prazo prescricional não esgotar. Quanto maior a rede e mais antigos os desligamentos, maior o passivo acumulado que você não consegue dimensionar.",
    },
  },
  {
    numero: 3,
    titulo: "Atualização Jurídica",
    pergunta:
      "Suas minutas contratuais foram revisadas no último ano para refletir as mudanças recentes na jurisprudência do STJ sobre sua área?",
    opcoes: {
      A: "Sim, revisão anual rigorosa.",
      B: "Revisão feita há mais de 18 meses.",
      C: "Utilizamos o mesmo padrão há anos sem revisão profunda.",
    },
    recomendacoes: {
      A: "Minutas atualizadas são a diferença entre uma cláusula que funciona no tribunal e uma que o juiz simplesmente ignora. Contudo, o risco é a falsa sensação de segurança. Mantenha o ciclo de revisão e não deixe a lei e os tribunais andarem mais rápido do que seus contratos.",
      B: "Com meses sem revisão profunda, suas minutas podem ter cláusulas que os tribunais já sinalizaram como problemáticas. Isso não significa que estão erradas — significa que você não sabe se estão. E descobrir em meio a um litígio é o pior momento possível para obter essa informação.",
      C: "Um contrato que não reflete um entendimento atual não protege quem o assinou; só dá a aparência de proteção. Quando testado judicialmente, cláusulas desatualizadas tendem a ser afastadas exatamente no ponto em que você mais precisaria delas. Quanto mais antiga a minuta, maior a distância entre o que o contrato diz e o que o juiz vai aplicar.",
    },
  },
  {
    numero: 4,
    titulo: "Governança e Gestão de Evidências",
    pergunta:
      "A empresa possui processos que comprovam documentalmente a autonomia do parceiro, afastando riscos de subordinação?",
    opcoes: {
      A: "Sim, auditamos a relação para garantir a independência.",
      B: "Confiamos apenas no que está escrito no contrato.",
      C: "Há um nível alto de controle diário sobre os parceiros.",
    },
    recomendacoes: {
      A: "Sua empresa documenta ativamente a natureza da relação com os parceiros — fator importante para ganhar seus processos. O risco nesse estágio é os processos do dia a dia derivarem do que está documentado sem que ninguém note. Revise periodicamente se a prática ainda reflete o modelo contratado.",
      B: "Em disputas judiciais — trabalhistas, comerciais ou regulatórias — o que prevalece não é apenas como a relação foi praticada, mas também como ela foi redigida. Confiar apenas no contrato escrito significa que, se a relação for questionada, você vai provar sua posição com o que tem registrado na prática. Vale a pena saber o que isso é antes que alguém pergunte.",
      C: "Quando há controle operacional intenso sem documentação que delimite e justifique esse controle, a relação fica exposta a requalificação judicial. As consequências variam por modelo de negócio, mas, em todos os casos, representam passivo relevante. Quanto mais antiga a relação e maior a rede, maior o risco acumulado.",
    },
  },
  {
    numero: 5,
    titulo: "Visibilidade Financeira",
    pergunta:
      "A diretoria possui um cálculo atualizado de qual seria o custo total de uma rescisão em massa de 10% da sua rede hoje?",
    opcoes: {
      A: "Sim, temos o provisionamento mapeado no P&L.",
      B: "Temos uma ideia aproximada, mas sem reserva específica.",
      C: "Não temos essa métrica calculada.",
    },
    recomendacoes: {
      A: "Você tem visibilidade sobre um risco que a maioria das empresas só descobre quando já está dentro dele. O provisionamento adequado não é só gestão financeira, como também é o que permite tomar decisões de crescimento e composição de rede sem surpresas que comprometam o P&L.",
      B: "Uma estimativa vaga funciona até o momento em que você precisa do número real para tomar uma decisão. Rescisões em massa não avisam com antecedência, e o custo real costuma ser significativamente maior do que a estimativa inicial quando se contabilizam verbas, despesas, honorários, tempo e o impacto operacional juntos.",
      C: "Sem essa métrica, você está gerindo o principal risco financeiro da sua rede sem saber o tamanho dele. Não é uma questão de probabilidade, mas sim de quando esse número vai aparecer e se você vai estar preparado para absorvê-lo ou não.",
    },
  },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

const QUALITY_MAP: Record<PilarAnswer, "good" | "medium" | "bad"> = {
  A: "good",
  B: "medium",
  C: "bad",
};

// Updated to match brand spec: yellow = #EAB308, red = #DC2626
const QUALITY_STYLES = {
  good: {
    border: "#B8CD0F",
    bg: "rgba(184,205,15,0.08)",
    badge: "#B8CD0F",
    label: "Excelente",
  },
  medium: {
    border: "#EAB308",
    bg: "rgba(234,179,8,0.08)",
    badge: "#EAB308",
    label: "Atenção",
  },
  bad: {
    border: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    badge: "#DC2626",
    label: "Crítico",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getScoreLevel(
  answers: (PilarAnswer | null)[]
): "green" | "yellow" | "red" {
  const bad = answers.filter((a) => a === "C").length;
  if (bad <= 2) return "green";
  if (bad === 3) return "yellow";
  return "red";
}

function stripPhone(value: string): string {
  return value.replace(/^\+?55[\s-]?/, "").replace(/\D/g, "");
}

function formatPhone(raw: string): string {
  const digits = stripPhone(raw).slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function validatePhone(value: string): boolean {
  const digits = stripPhone(value);
  if (digits.length !== 11) return false;
  const ddd = parseInt(digits.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  return digits[2] === "9";
}

// ─── Layout chrome ────────────────────────────────────────────────────────────

function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-24"
      style={{ backgroundColor: "#2D2F5B" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/fundo_ondas_gradiente-01.png)",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          opacity: 0.30,
        }}
      />
      <div className="relative h-full max-w-3xl mx-auto px-6 flex items-center">
        {/* Place logo_horizontal_em_branco-01.png in /public */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_horizontal_em_branco-01.png"
          alt="Moreira Suzuki Advogados"
          className="h-14 w-auto object-contain"
        />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 py-3 px-4"
      style={{ backgroundColor: "#2D2F5B" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/fundo_ondas_gradiente-01.png)",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          opacity: 0.30,
        }}
      />
      <p
        className="relative text-center text-xs"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        © 2026 Desenvolvido por Moreira Suzuki Advocacia para Negócios ·{" "}
        moreirasuzuki.com.br
      </p>
    </footer>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
        <span>
          Etapa {current} de {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1">
        <div
          className="h-1 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: "#B8CD0F" }}
        />
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-xs font-bold uppercase tracking-[0.15em] mb-3"
      style={{ color: "#B8CD0F" }}
    >
      {children}
    </span>
  );
}

function Question({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-lg sm:text-xl font-bold mb-6 leading-snug"
      style={{ color: "#1A1A1A" }}
    >
      {children}
    </h2>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continuar →",
  showBack = true,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showBack?: boolean;
}) {
  return (
    <div className="flex gap-3 mt-8">
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-full font-bold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all duration-200"
        >
          ← Voltar
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 py-3.5 rounded-full font-bold text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "#B8CD0F", color: "#1A1A1A" }}
      >
        {nextLabel}
      </button>
    </div>
  );
}

// ─── Step 0 — Context ─────────────────────────────────────────────────────────

function StepContext({
  value,
  onChange,
  onNext,
}: {
  value: ContextOption | null;
  onChange: (v: ContextOption) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <Tag>Contexto da sua rede</Tag>
      <Question>
        Quais os principais modelos de expansão da sua rede hoje?
      </Question>
      <div className="flex flex-col gap-2.5">
        {CONTEXT_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className="w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-sm font-medium bg-white hover:bg-gray-50"
              style={{
                borderColor: selected ? "#B8CD0F" : "#E5E7EB",
                color: selected ? "#1A1A1A" : "#6B7280",
                ...(selected ? { backgroundColor: "rgba(184,205,15,0.07)" } : {}),
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <NavButtons onNext={onNext} nextDisabled={!value} showBack={false} />
    </div>
  );
}

// ─── Steps 1–5 — Pilar questions ──────────────────────────────────────────────

function StepPilar({
  pilarIndex,
  answer,
  onChange,
  onNext,
  onBack,
}: {
  pilarIndex: number;
  answer: PilarAnswer | null;
  onChange: (v: PilarAnswer) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const pilar = PILARES[pilarIndex];

  return (
    <div>
      <Tag>
        Pilar {pilar.numero} · {pilar.titulo}
      </Tag>
      <Question>{pilar.pergunta}</Question>
      <div className="flex flex-col gap-3">
        {(Object.entries(pilar.opcoes) as [PilarAnswer, string][]).map(
          ([key, text]) => {
            const selected = answer === key;
            const quality = QUALITY_MAP[key];
            const styles = QUALITY_STYLES[quality];
            const badgeTextColor =
              selected && quality === "bad" ? "#FFFFFF" : "#1A1A1A";

            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className="w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-start gap-3 bg-white hover:bg-gray-50"
                style={{
                  borderColor: selected ? styles.border : "#E5E7EB",
                  ...(selected ? { backgroundColor: styles.bg } : {}),
                }}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors duration-150"
                  style={{
                    backgroundColor: selected ? styles.badge : "#E5E7EB",
                    color: selected ? badgeTextColor : "#9CA3AF",
                  }}
                >
                  {key}
                </span>
                <span
                  className="text-sm leading-relaxed mt-0.5"
                  style={{ color: selected ? "#1A1A1A" : "#6B7280" }}
                >
                  {text}
                </span>
              </button>
            );
          }
        )}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!answer} />
    </div>
  );
}

// ─── Step 6 — Lead capture ────────────────────────────────────────────────────

const LEAD_FIELDS: {
  field: keyof LeadData;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
}[] = [
  {
    field: "nome",
    label: "Nome",
    placeholder: "Seu nome completo",
    type: "text",
    required: true,
  },
  {
    field: "empresa",
    label: "Empresa",
    placeholder: "Nome da empresa",
    type: "text",
    required: true,
  },
  {
    field: "cargo",
    label: "Cargo",
    placeholder: "Ex: Diretor Comercial, CEO, Sócio",
    type: "text",
    required: false,
  },
  {
    field: "email",
    label: "E-mail corporativo",
    placeholder: "voce@empresa.com.br",
    type: "email",
    required: true,
  },
  {
    field: "whatsapp",
    label: "WhatsApp",
    placeholder: "(11) 99999-9999",
    type: "tel",
    required: true,
  },
  {
    field: "contratos",
    label: "Contratos ativos na rede",
    placeholder: "Ex: 150",
    type: "text",
    required: false,
  },
];

function StepLead({
  lead,
  onChange,
  onNext,
  onBack,
  isSaving = false,
}: {
  lead: LeadData;
  onChange: (field: keyof LeadData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isSaving?: boolean;
}) {
  const [whatsappTouched, setWhatsappTouched] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof LeadData | null>(null);

  const whatsappValid = validatePhone(lead.whatsapp);
  const showWhatsappError =
    whatsappTouched && !whatsappValid && lead.whatsapp.length > 0;

  const isValid = !!(
    lead.nome &&
    lead.empresa &&
    lead.email &&
    whatsappValid
  );

  return (
    <div>
      <Tag>Quase lá</Tag>
      <Question>
        Preencha seus dados para receber o diagnóstico completo
      </Question>
      <p className="text-sm text-gray-500 -mt-3 mb-6">
        Seus dados são usados exclusivamente para envio do relatório
        personalizado.
      </p>

      <div className="flex flex-col gap-4">
        {LEAD_FIELDS.map(({ field, label, placeholder, type, required }) => {
          const isWhatsapp = field === "whatsapp";
          const hasError = isWhatsapp && showWhatsappError;
          const isFocused = focusedField === field;

          const borderColor = hasError
            ? "#DC2626"
            : isFocused
            ? "#B8CD0F"
            : "#E5E7EB";

          return (
            <div key={field}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {label}{" "}
                {!required && (
                  <span className="text-gray-400 font-normal">(opcional)</span>
                )}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={lead[field]}
                inputMode={isWhatsapp ? "tel" : undefined}
                onChange={(e) => {
                  if (isWhatsapp) {
                    onChange(field, formatPhone(e.target.value));
                  } else {
                    onChange(field, e.target.value);
                  }
                }}
                onFocus={() => setFocusedField(field)}
                onBlur={() => {
                  setFocusedField(null);
                  if (isWhatsapp) setWhatsappTouched(true);
                }}
                className="w-full rounded-xl px-4 py-3 text-sm placeholder-gray-400 outline-none transition-all duration-150"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `1.5px solid ${borderColor}`,
                  color: "#1A1A1A",
                  boxShadow: isFocused ? "0 0 0 3px rgba(184,205,15,0.15)" : "none",
                }}
              />
              {hasError && (
                <p className="text-xs text-red-500 mt-1.5 leading-snug">
                  Informe um número de celular brasileiro válido com DDD (ex: 44
                  99999-9999)
                </p>
              )}
            </div>
          );
        })}
      </div>

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!isValid || isSaving}
        nextLabel={isSaving ? "Salvando..." : "Ver diagnóstico →"}
      />
    </div>
  );
}

// ─── Step 7 — Results ─────────────────────────────────────────────────────────

function StepResults({
  answers,
  lead,
}: {
  answers: (PilarAnswer | null)[];
  lead: LeadData;
}) {
  const level = getScoreLevel(answers);
  const badCount = answers.filter((a) => a === "C").length;

  const LEVEL_CONFIG = {
    green: {
      label: "Risco Baixo",
      sublabel: "Boa maturidade jurídica identificada na rede.",
      badgeBg: "#B8CD0F",
      badgeText: "#1A1A1A",
      dotColor: "#B8CD0F",
    },
    yellow: {
      label: "Risco Moderado",
      sublabel: "Pontos de atenção que exigem ação em curto prazo.",
      badgeBg: "#EAB308",
      badgeText: "#1A1A1A",
      dotColor: "#EAB308",
    },
    red: {
      label: "Risco Alto",
      sublabel: "Exposição a passivos jurídicos significativos.",
      badgeBg: "#DC2626",
      badgeText: "#FFFFFF",
      dotColor: "#DC2626",
    },
  }[level];

  const SCORE_LABEL_PT: Record<"green" | "yellow" | "red", string> = {
    green: "Verde",
    yellow: "Amarelo",
    red: "Vermelho",
  };

  const waMessage = encodeURIComponent(
    `Olá! Acabei de fazer o Diagnóstico de Maturidade Contratual da Moreira Suzuki. Minha rede está no nível ${SCORE_LABEL_PT[level]}. Gostaria de conversar com um especialista.`
  );
  const waUrl = `https://api.whatsapp.com/send/?phone=554430245400&text=${waMessage}&type=phone_number&app_absent=0`;

  return (
    <div>
      {/* Score header */}
      <div className="text-center mb-6">
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
          style={{ color: "#2D2F5B" }}
        >
          Diagnóstico de Maturidade Contratual
        </p>
        <h2 className="text-xl font-bold mb-0.5" style={{ color: "#1A1A1A" }}>
          {lead.nome}
        </h2>
        <p className="text-sm text-gray-500 mb-6">{lead.empresa}</p>

        {/* Score badge */}
        <div
          className="inline-block w-full max-w-xs rounded-2xl px-6 py-6"
          style={{ backgroundColor: LEVEL_CONFIG.badgeBg }}
        >
          <div
            className="text-2xl font-black mb-1"
            style={{ color: LEVEL_CONFIG.badgeText }}
          >
            {LEVEL_CONFIG.label}
          </div>
          <div
            className="text-sm mb-4 opacity-80"
            style={{ color: LEVEL_CONFIG.badgeText }}
          >
            {LEVEL_CONFIG.sublabel}
          </div>

          {/* 5-dot indicator */}
          <div className="flex justify-center gap-2.5">
            {answers.map((ans, i) => {
              const q = ans ? QUALITY_MAP[ans] : "medium";
              const dotBg =
                q === "good"
                  ? "rgba(0,0,0,0.25)"
                  : q === "medium"
                  ? "rgba(0,0,0,0.35)"
                  : "rgba(0,0,0,0.5)";
              const dotBorder =
                level === "red" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.2)";
              return (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border"
                  style={{
                    backgroundColor:
                      q === "good"
                        ? level === "green"
                          ? "rgba(0,0,0,0.2)"
                          : QUALITY_STYLES.good.badge
                        : q === "medium"
                        ? level === "yellow"
                          ? "rgba(0,0,0,0.2)"
                          : QUALITY_STYLES.medium.badge
                        : level === "red"
                        ? "rgba(255,255,255,0.35)"
                        : QUALITY_STYLES.bad.badge,
                    borderColor: dotBorder,
                  }}
                  title={`Pilar ${i + 1}`}
                />
              );
            })}
          </div>
        </div>

        {badCount > 0 && (
          <p className="text-xs text-gray-400 mt-3">
            {badCount} pilar{badCount > 1 ? "es" : ""} em situação crítica
          </p>
        )}
      </div>

      {/* WhatsApp CTA — prominent, above pilar breakdown */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full font-bold text-base mb-8 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "#B8CD0F", color: "#1A1A1A" }}
      >
        <WhatsAppIcon size={22} />
        Fale com um especialista
      </a>

      {/* Per-pilar breakdown */}
      <div className="flex flex-col gap-3 mb-8">
        <p
          className="text-xs font-bold uppercase tracking-[0.15em] mb-1"
          style={{ color: "#2D2F5B" }}
        >
          Análise por pilar
        </p>
        {PILARES.map((pilar, idx) => {
          const answer = answers[idx] as PilarAnswer;
          const quality = QUALITY_MAP[answer];
          const styles = QUALITY_STYLES[quality];

          return (
            <div
              key={pilar.numero}
              className="rounded-xl p-5 bg-white"
              style={{
                borderLeft: `4px solid ${styles.border}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: "#2D2F5B" }}
                >
                  Pilar {pilar.numero} · {pilar.titulo}
                </span>
                <span
                  className="flex-shrink-0 text-xs font-black px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: styles.bg,
                    color: styles.badge,
                    border: `1px solid ${styles.border}40`,
                  }}
                >
                  {styles.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {pilar.recomendacoes[answer]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA strip */}
      <div
        className="rounded-2xl p-7 text-center"
        style={{
          backgroundColor: "#2D2F5B",
          backgroundImage: "url(/fundo_ondas_gradiente-01.png)",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundBlendMode: "soft-light",
        }}
      >
        <h3 className="text-lg font-bold text-white mb-2">
          Pronto para blindar sua rede?
        </h3>
        <p
          className="text-sm mb-6 max-w-xs mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Nossos especialistas estruturam um plano de ação personalizado para o
          seu modelo de negócio.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#B8CD0F", color: "#1A1A1A" }}
        >
          <WhatsAppIcon size={16} />
          Fale com um especialista
        </a>
        <p
          className="text-xs mt-5"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Diagnóstico confidencial · Protegido por LGPD
        </p>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

const SCORE_PT: Record<"green" | "yellow" | "red", string> = {
  green: "verde",
  yellow: "amarelo",
  red: "vermelho",
};

export default function HealthCheckForm() {
  const [step, setStep] = useState(0);
  const [context, setContext] = useState<ContextOption | null>(null);
  const [answers, setAnswers] = useState<(PilarAnswer | null)[]>(
    Array(5).fill(null)
  );
  const [lead, setLead] = useState<LeadData>({
    nome: "",
    empresa: "",
    cargo: "",
    email: "",
    whatsapp: "",
    contratos: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const setAnswer = (idx: number, val: PilarAnswer) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const updateLead = (field: keyof LeadData, value: string) => {
    setLead((prev) => ({ ...prev, [field]: value }));
  };

  const handleLeadNext = async () => {
    setIsSaving(true);
    const payload = {
      nome: lead.nome,
      empresa: lead.empresa,
      email: lead.email,
      whatsapp: stripPhone(lead.whatsapp),
      cargo: lead.cargo || null,
      num_contratos: lead.contratos || null,
      modelo_expansao: context,
      score_geral: SCORE_PT[getScoreLevel(answers)],
      p1_resposta: answers[0] ? PILARES[0].opcoes[answers[0]] : null,
      p2_resposta: answers[1] ? PILARES[1].opcoes[answers[1]] : null,
      p3_resposta: answers[2] ? PILARES[2].opcoes[answers[2]] : null,
      p4_resposta: answers[3] ? PILARES[3].opcoes[answers[3]] : null,
      p5_resposta: answers[4] ? PILARES[4].opcoes[answers[4]] : null,
    };
    const opts: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    try {
      await Promise.all([
        fetch("/api/save-lead", opts),
        fetch("/api/send-email", opts),
      ]);
    } catch {
      // Fail silently — never block the user from seeing results
    }
    setIsSaving(false);
    setStep(7);
  };

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "'Barlow', Arial, sans-serif" }}
    >
      <Header />
      <Footer />

      {/* Main scrollable area — padded to clear fixed header/footer */}
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center">
        {/* Step label above card (form steps only) */}
        {step < 7 && (
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-center"
            style={{ color: "#2D2F5B" }}
          >
            Diagnóstico de Maturidade Contratual
          </p>
        )}

        {/* Card */}
        <div
          className="w-full max-w-lg rounded-2xl bg-white"
          style={{
            boxShadow: "0 4px 24px rgba(45,47,91,0.12)",
            borderTop: "3px solid #B8CD0F",
          }}
        >
          <div className="p-6 sm:p-8">
            {step < 7 && <ProgressBar current={step + 1} total={7} />}

            {step === 0 && (
              <StepContext
                value={context}
                onChange={setContext}
                onNext={() => setStep(1)}
              />
            )}

            {step >= 1 && step <= 5 && (
              <StepPilar
                pilarIndex={step - 1}
                answer={answers[step - 1]}
                onChange={(v) => setAnswer(step - 1, v)}
                onNext={() => setStep(step + 1)}
                onBack={() => setStep(step - 1)}
              />
            )}

            {step === 6 && (
              <StepLead
                lead={lead}
                onChange={updateLead}
                onNext={handleLeadNext}
                onBack={() => setStep(5)}
                isSaving={isSaving}
              />
            )}

            {step === 7 && <StepResults answers={answers} lead={lead} />}
          </div>
        </div>
      </div>
    </div>
  );
}
