/*
  # Sistema de Candidaturas de Emprego

  1. Modificações na tabela notifications
    - Adicionar campo application_data para armazenar dados da candidatura
    - Adicionar tipo 'job_application' nas notificações

  2. Funcionalidades
    - Candidatos preenchem formulário com Nome, CPF, Idade e Telefone
    - Notificações são enviadas para mecânicos logados
    - Dados ficam armazenados para consulta posterior
*/

-- Adicionar campo para dados da candidatura na tabela notifications
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'application_data') THEN
    ALTER TABLE notifications ADD COLUMN application_data JSONB;
  END IF;
END $$;

-- Atualizar constraint do tipo de notificação para incluir job_application
DO $$
BEGIN
  -- Remover constraint existente se existir
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'notifications_type_check' AND table_name = 'notifications') THEN
    ALTER TABLE notifications DROP CONSTRAINT notifications_type_check;
  END IF;
  
  -- Adicionar nova constraint com job_application
  ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
    CHECK (type IN ('car_sale', 'service_order', 'invoice', 'mechanic_registration', 'general', 'job_application'));
END $$;

-- Inserir notificação de exemplo para testar
INSERT INTO notifications (type, message, application_data, is_read) VALUES
('job_application', 'Nova candidatura recebida: João Silva (CPF: 123.456.789-00, Idade: 28, Tel: (11) 99999-9999)', 
 '{"nome": "João Silva", "cpf": "123.456.789-00", "idade": "28", "telefone": "(11) 99999-9999"}', 
 false)
ON CONFLICT DO NOTHING;
