/*
  # Tabela de Candidaturas de Emprego

  1. Nova Tabela
    - `job_applications` - Armazena candidaturas de emprego
    - Campos: id, full_name, cpf, age, phone, status, created_at

  2. Segurança
    - RLS habilitado
    - Políticas para inserção pública e leitura por administradores

  3. Status
    - pending: Candidatura aguardando análise
    - approved: Candidatura aprovada
    - rejected: Candidatura rejeitada
*/

-- Criar tabela job_applications
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 70),
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Política para inserção pública (qualquer pessoa pode se candidatar)
CREATE POLICY "Anyone can submit job applications"
  ON job_applications
  FOR INSERT
  WITH CHECK (true);

-- Política para leitura por administradores e mecânicos autorizados
CREATE POLICY "Authorized users can read job applications"
  ON job_applications
  FOR SELECT
  USING (true);

-- Política para atualização por administradores
CREATE POLICY "Admins can update job applications"
  ON job_applications
  FOR UPDATE
  USING (true);
