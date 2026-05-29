CREATE TABLE IF NOT EXISTS leads (
  id              SERIAL PRIMARY KEY,
  created_at      TIMESTAMP DEFAULT NOW(),
  nome            TEXT NOT NULL,
  empresa         TEXT NOT NULL,
  email           TEXT NOT NULL,
  whatsapp        TEXT NOT NULL,
  cargo           TEXT,
  num_contratos   TEXT,
  modelo_expansao TEXT,
  score_geral     TEXT,
  p1_resposta     TEXT,
  p2_resposta     TEXT,
  p3_resposta     TEXT,
  p4_resposta     TEXT,
  p5_resposta     TEXT
);
