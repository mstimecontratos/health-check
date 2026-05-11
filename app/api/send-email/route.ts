import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// Configure this sender address after verifying your domain in Resend.
// https://resend.com/domains
const FROM = "Moreira Suzuki Advogados <diagnostico@moreirasuzu ki.adv.br>"; // replace with verified Resend domain

type PilarAnswer = "A" | "B" | "C";

const PILARES_DATA = [
  {
    titulo: "Blindagem Documental",
    recomendacoes: {
      A: "Sua rede está bem protegida contra contestações de autenticidade. Mantenha auditorias regulares e certifique-se de que a plataforma utilizada possui certificação ICP-Brasil.",
      B: "Contratos físicos ou informais representam risco jurídico relevante. Priorize a migração para assinaturas digitais auditáveis — o processo pode ser gradual, começando pelos contratos de maior valor.",
      C: "Risco crítico. A ausência de controle centralizado expõe toda a rede a litígios sobre validade contratual. A implantação de uma plataforma de gestão documental deve ser tratada como prioridade imediata.",
    },
  },
  {
    titulo: "Higiene de Saída",
    recomendacoes: {
      A: "Excelente. Seu fluxo de exit protege a empresa contra reivindicações retroativas. Certifique-se de que as quitações são abrangentes e cobrem todas as verbas aplicáveis à relação.",
      B: "A coleta inconsistente de quitações cria janelas de vulnerabilidade. Cada saída sem termo assinado é um passivo em aberto. Estruture um checklist de offboarding com quitação como etapa obrigatória e bloqueante.",
      C: "Risco alto. Sem termos de quitação, cada desligamento representa potencial passivo judicial. Implante imediatamente um fluxo de exit com quitação formal — inclusive retroativamente para parcerias recentes encerradas.",
    },
  },
  {
    titulo: "Atualização Jurídica",
    recomendacoes: {
      A: "Ótimo. Minutas alinhadas à jurisprudência vigente minimizam o risco de cláusulas consideradas abusivas ou ineficazes em litígios. Mantenha o ciclo anual de revisão.",
      B: "Com mais de 18 meses sem revisão, suas minutas podem não refletir precedentes relevantes do STJ. Agende uma revisão com advogado especialista nos próximos 60 dias.",
      C: "Risco alto. Minutas desatualizadas são o principal vetor de decisões adversas. Uma revisão profunda com especialista em sua área de atuação é indispensável e urgente.",
    },
  },
  {
    titulo: "Gestão de Evidências",
    recomendacoes: {
      A: "Excelente. A documentação ativa de autonomia é a principal defesa contra reconhecimento de vínculo empregatício. Mantenha as auditorias e registre evidências de múltiplos clientes, liberdade de horário e ausência de subordinação.",
      B: "O texto contratual sozinho é insuficiente perante a Justiça do Trabalho. Evidências práticas da relação — como ausência de exclusividade, liberdade de horário e múltiplos clientes — precisam ser documentadas sistematicamente.",
      C: "Risco crítico. Alto controle operacional sobre parceiros é o principal argumento para reconhecimento de vínculo empregatício. Reestruture urgentemente os processos de supervisão e crie distância operacional documentada.",
    },
  },
  {
    titulo: "Visibilidade Financeira",
    recomendacoes: {
      A: "Excelente gestão de risco financeiro. O provisionamento adequado protege o P&L e permite decisões estratégicas informadas sobre crescimento e composição da rede.",
      B: "Uma estimativa vaga não é suficiente para gestão de risco real. Formalize o cálculo com parâmetros reais (verbas rescisórias, honorários, provisões) e crie uma reserva proporcional.",
      C: "Risco alto. Sem esta métrica, uma rescisão em massa pode comprometer seriamente a saúde financeira da operação. Realize este cálculo como prioridade — idealmente com suporte jurídico-financeiro especializado.",
    },
  },
];

const QUALITY_LABEL: Record<PilarAnswer, string> = {
  A: "Excelente",
  B: "Atenção",
  C: "Crítico",
};

const SCORE_LABEL: Record<string, string> = {
  verde: "RISCO BAIXO (Verde)",
  amarelo: "RISCO MODERADO (Amarelo)",
  vermelho: "RISCO ALTO (Vermelho)",
};

function buildEmailText(params: {
  nome: string;
  empresa: string;
  score_geral: string;
  answers: (PilarAnswer | null)[];
}): string {
  const { nome, empresa, score_geral, answers } = params;
  const D = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

  const pilarLines = PILARES_DATA.map((pilar, i) => {
    const ans = (answers[i] ?? "A") as PilarAnswer;
    return [
      `PILAR ${i + 1} — ${pilar.titulo.toUpperCase()}`,
      `Status: ${QUALITY_LABEL[ans]}`,
      pilar.recomendacoes[ans],
    ].join("\n");
  }).join("\n\n");

  return [
    `Olá, ${nome} — ${empresa}!`,
    "",
    "Você acabou de completar o Diagnóstico de Maturidade Contratual",
    "da Moreira Suzuki Advogados.",
    "",
    D,
    `RESULTADO GERAL: ${SCORE_LABEL[score_geral] ?? score_geral.toUpperCase()}`,
    D,
    "",
    pilarLines,
    "",
    D,
    "",
    "Quer conversar com um especialista?",
    "Abra o WhatsApp: https://api.whatsapp.com/send/?phone=554430245400",
    "",
    "—",
    "Diagnóstico confidencial · Protegido por LGPD",
    "Moreira Suzuki Advogados",
  ].join("\n");
}

export async function POST(request: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { nome, empresa, email, score_geral } = body;

  if (!email || !nome) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const answers = [
    body.p1_resposta,
    body.p2_resposta,
    body.p3_resposta,
    body.p4_resposta,
    body.p5_resposta,
  ] as (PilarAnswer | null)[];

  const text = buildEmailText({ nome, empresa, score_geral, answers });

  // Instantiated here so missing key at build time doesn't crash the module.
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Seu Diagnóstico de Maturidade Contratual — Moreira Suzuki",
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[send-email] Resend error:", error);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 500 });
  }
}
