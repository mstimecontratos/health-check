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
      A: "Sua rede está bem protegida contra contestações de autenticidade. Mantenha auditorias regulares e certifique-se de que a plataforma utilizada possui certificação ICP-Brasil.",
      B: "Contratos físicos ou informais representam risco jurídico relevante. Priorize a migração para assinaturas digitais auditáveis — o processo pode ser gradual, começando pelos contratos de maior valor.",
      C: "Risco crítico. A ausência de controle centralizado expõe toda a rede a litígios sobre validade contratual. A implantação de uma plataforma de gestão documental deve ser tratada como prioridade imediata.",
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
      A: "Excelente. Seu fluxo de exit protege a empresa contra reivindicações retroativas. Certifique-se de que as quitações são abrangentes e cobrem todas as verbas aplicáveis à relação.",
      B: "A coleta inconsistente de quitações cria janelas de vulnerabilidade. Cada saída sem termo assinado é um passivo em aberto. Estruture um checklist de offboarding com quitação como etapa obrigatória e bloqueante.",
      C: "Risco alto. Sem termos de quitação, cada desligamento representa potencial passivo judicial. Implante imediatamente um fluxo de exit com quitação formal — inclusive retroativamente para parcerias recentes encerradas.",
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
      A: "Ótimo. Minutas alinhadas à jurisprudência vigente minimizam o risco de cláusulas consideradas abusivas ou ineficazes em litígios. Mantenha o ciclo anual de revisão.",
      B: "Com mais de 18 meses sem revisão, suas minutas podem não refletir precedentes relevantes do STJ. Agende uma revisão com advogado especialista nos próximos 60 dias.",
      C: "Risco alto. Minutas desatualizadas são o principal vetor de decisões adversas. Uma revisão profunda com especialista em sua área de atuação é indispensável e urgente.",
    },
  },
  {
    numero: 4,
    titulo: "Gestão de Evidências",
    pergunta:
      "A empresa possui processos que comprovam documentalmente a autonomia do parceiro, afastando riscos de subordinação?",
    opcoes: {
      A: "Sim, auditamos a relação para garantir a independência.",
      B: "Confiamos apenas no que está escrito no contrato.",
      C: "Há um nível alto de controle diário sobre os parceiros.",
    },
    recomendacoes: {
      A: "Excelente. A documentação ativa de autonomia é a principal defesa contra reconhecimento de vínculo empregatício. Mantenha as auditorias e registre evidências de múltiplos clientes, liberdade de horário e ausência de subordinação.",
      B: "O texto contratual sozinho é insuficiente perante a Justiça do Trabalho. Evidências práticas da relação — como ausência de exclusividade, liberdade de horário e múltiplos clientes — precisam ser documentadas sistematicamente.",
      C: "Risco crítico. Alto controle operacional sobre parceiros é o principal argumento para reconhecimento de vínculo empregatício. Reestruture urgentemente os processos de supervisão e crie distância operacional documentada.",
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
      A: "Excelente gestão de risco financeiro. O provisionamento adequado protege o P&L e permite decisões estratégicas informadas sobre crescimento e composição da rede.",
      B: "Uma estimativa vaga não é suficiente para gestão de risco real. Formalize o cálculo com parâmetros reais (verbas rescisórias, honorários, provisões) e crie uma reserva proporcional.",
      C: "Risco alto. Sem esta métrica, uma rescisão em massa pode comprometer seriamente a saúde financeira da operação. Realize este cálculo como prioridade — idealmente com suporte jurídico-financeiro especializado.",
    },
  },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

const QUALITY_MAP: Record<PilarAnswer, "good" | "medium" | "bad"> = {
  A: "good",
  B: "medium",
  C: "bad",
};

const QUALITY_STYLES = {
  good: {
    border: "#B8CD0F",
    bg: "rgba(184,205,15,0.08)",
    badge: "#B8CD0F",
    label: "Excelente",
  },
  medium: {
    border: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    badge: "#F59E0B",
    label: "Atenção",
  },
  bad: {
    border: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    badge: "#EF4444",
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

// ─── Primitives ───────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
        <span>
          Etapa {current} de {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-0.5">
        <div
          className="h-0.5 rounded-full transition-all duration-500 ease-out"
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
    <h2 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
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
          className="flex-1 py-3 rounded-lg font-bold text-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
        >
          ← Voltar
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 py-3.5 rounded-lg font-bold text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
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
              className="w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-150 text-sm font-medium"
              style={{
                borderColor: selected ? "#B8CD0F" : "#2e2e2e",
                backgroundColor: selected
                  ? "rgba(184,205,15,0.08)"
                  : "transparent",
                color: selected ? "#ffffff" : "#888888",
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
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className="w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-start gap-3"
                style={{
                  borderColor: selected ? styles.border : "#2a2a2a",
                  backgroundColor: selected ? styles.bg : "transparent",
                }}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors duration-150"
                  style={{
                    backgroundColor: selected ? styles.badge : "#2a2a2a",
                    color: selected ? "#1A1A1A" : "#666",
                  }}
                >
                  {key}
                </span>
                <span
                  className="text-sm leading-relaxed mt-0.5"
                  style={{ color: selected ? "#f0f0f0" : "#888" }}
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
}: {
  lead: LeadData;
  onChange: (field: keyof LeadData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isValid = !!(
    lead.nome &&
    lead.empresa &&
    lead.email &&
    lead.whatsapp
  );

  return (
    <div>
      <Tag>Quase lá</Tag>
      <Question>
        Preencha seus dados para receber o diagnóstico completo
      </Question>
      <p className="text-sm text-gray-600 -mt-3 mb-6">
        Seus dados são usados exclusivamente para envio do relatório
        personalizado.
      </p>

      <div className="flex flex-col gap-4">
        {LEAD_FIELDS.map(({ field, label, placeholder, type, required }) => (
          <div key={field}>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              {label}{" "}
              {!required && (
                <span className="text-gray-700 font-normal">(opcional)</span>
              )}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={lead[field]}
              onChange={(e) => onChange(field, e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-gray-700 outline-none transition-all duration-150"
              style={{ backgroundColor: "#252525", border: "1px solid #333" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#B8CD0F";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#333";
              }}
            />
          </div>
        ))}
      </div>

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!isValid}
        nextLabel="Ver diagnóstico →"
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
      color: "#B8CD0F",
      bg: "rgba(184,205,15,0.06)",
      border: "rgba(184,205,15,0.2)",
    },
    yellow: {
      label: "Risco Moderado",
      sublabel: "Pontos de atenção que exigem ação em curto prazo.",
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.06)",
      border: "rgba(245,158,11,0.2)",
    },
    red: {
      label: "Risco Alto",
      sublabel: "Exposição a passivos jurídicos significativos.",
      color: "#EF4444",
      bg: "rgba(239,68,68,0.06)",
      border: "rgba(239,68,68,0.2)",
    },
  }[level];

  return (
    <div>
      {/* Score header */}
      <div className="text-center mb-8">
        <p className="text-xs text-gray-700 uppercase tracking-[0.2em] mb-3">
          Health Check Jurídico
        </p>
        <h2 className="text-xl font-bold text-white mb-0.5">{lead.nome}</h2>
        <p className="text-sm text-gray-600 mb-6">{lead.empresa}</p>

        <div
          className="inline-block w-full max-w-xs rounded-2xl px-6 py-6"
          style={{
            backgroundColor: LEVEL_CONFIG.bg,
            border: `2px solid ${LEVEL_CONFIG.border}`,
          }}
        >
          <div
            className="text-2xl font-black mb-1"
            style={{ color: LEVEL_CONFIG.color }}
          >
            {LEVEL_CONFIG.label}
          </div>
          <div className="text-sm text-gray-400 mb-4">
            {LEVEL_CONFIG.sublabel}
          </div>

          {/* 5-dot indicator */}
          <div className="flex justify-center gap-2.5">
            {answers.map((ans, i) => {
              const q = ans ? QUALITY_MAP[ans] : "medium";
              const color =
                q === "good" ? "#B8CD0F" : q === "medium" ? "#F59E0B" : "#EF4444";
              return (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                  title={`Pilar ${i + 1}`}
                />
              );
            })}
          </div>
        </div>

        {badCount > 0 && (
          <p className="text-xs text-gray-700 mt-3">
            {badCount} pilar{badCount > 1 ? "es" : ""} em situação crítica
          </p>
        )}
      </div>

      {/* Per-pilar breakdown */}
      <div className="flex flex-col gap-3 mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-700 mb-1">
          Análise por pilar
        </p>
        {PILARES.map((pilar, idx) => {
          const answer = answers[idx] as PilarAnswer;
          const quality = QUALITY_MAP[answer];
          const styles = QUALITY_STYLES[quality];

          return (
            <div
              key={pilar.numero}
              className="rounded-xl p-5"
              style={{
                backgroundColor: styles.bg,
                border: `1px solid ${styles.border}35`,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Pilar {pilar.numero} · {pilar.titulo}
                </span>
                <span
                  className="flex-shrink-0 text-xs font-black px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: styles.badge + "22",
                    color: styles.badge,
                  }}
                >
                  {styles.label}
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {pilar.recomendacoes[answer]}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        className="rounded-2xl p-7 text-center"
        style={{
          backgroundColor: "rgba(184,205,15,0.04)",
          border: "1px solid rgba(184,205,15,0.18)",
        }}
      >
        <div
          className="w-8 h-0.5 mx-auto mb-5"
          style={{ backgroundColor: "#B8CD0F" }}
        />
        <h3 className="text-lg font-bold text-white mb-2">
          Pronto para blindar sua rede?
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
          Nossos especialistas estruturam um plano de ação personalizado para o
          seu modelo de negócio.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 py-3.5 px-8 rounded-lg font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#B8CD0F", color: "#1A1A1A" }}
        >
          Fale com um especialista →
        </a>
        <p className="text-xs text-gray-800 mt-5">
          Diagnóstico confidencial · Protegido por LGPD
        </p>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function HealthCheckForm() {
  const [step, setStep] = useState(0);
  const [context, setContext] = useState<ContextOption | null>(null);
  const [answers, setAnswers] = useState<(PilarAnswer | null)[]>(
    Array(5).fill(null)
  );
  const [lead, setLead] = useState<LeadData>({
    nome: "",
    empresa: "",
    email: "",
    whatsapp: "",
    contratos: "",
  });

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

  return (
    <div
      className="min-h-screen py-10 px-4 flex flex-col items-center justify-center"
      style={{ backgroundColor: "#1A1A1A" }}
    >
      {/* Top label */}
      {step < 7 && (
        <div className="w-full max-w-lg mb-5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-700">
            Health Check Jurídico
          </span>
          <div
            className="w-5 h-px"
            style={{ backgroundColor: "#B8CD0F" }}
          />
        </div>
      )}

      {/* Card */}
      <div
        className="w-full max-w-lg rounded-2xl border"
        style={{ backgroundColor: "#1e1e1e", borderColor: "#272727" }}
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
              onNext={() => setStep(7)}
              onBack={() => setStep(5)}
            />
          )}

          {step === 7 && <StepResults answers={answers} lead={lead} />}
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-800 mt-6 text-center">
        © {new Date().getFullYear()} · Diagnóstico de uso exclusivamente
        orientativo
      </p>
    </div>
  );
}
