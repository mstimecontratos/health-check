import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    nome,
    empresa,
    email,
    whatsapp,
    num_contratos,
    modelo_expansao,
    score_geral,
    p1_resposta,
    p2_resposta,
    p3_resposta,
    p4_resposta,
    p5_resposta,
  } = body as Record<string, string | null>;

  if (!nome || !empresa || !email || !whatsapp) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await sql`
      INSERT INTO leads (
        nome, empresa, email, whatsapp, num_contratos,
        modelo_expansao, score_geral,
        p1_resposta, p2_resposta, p3_resposta, p4_resposta, p5_resposta
      ) VALUES (
        ${nome}, ${empresa}, ${email}, ${whatsapp}, ${num_contratos ?? null},
        ${modelo_expansao ?? null}, ${score_geral ?? null},
        ${p1_resposta ?? null}, ${p2_resposta ?? null},
        ${p3_resposta ?? null}, ${p4_resposta ?? null}, ${p5_resposta ?? null}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[save-lead] DB insert failed:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
