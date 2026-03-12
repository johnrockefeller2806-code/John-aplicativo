# Dublin Study - Plataforma de Intercâmbio Educacional

## Problema Original
Criação de um aplicativo completo de intercâmbio educacional com foco em Dublin, Irlanda, desenvolvido para conectar estudantes diretamente às escolas credenciadas, sem intermediários.

## Arquitetura
- **Backend**: FastAPI + MongoDB + Stripe (emergentintegrations)
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Auth**: JWT (email/senha) com 3 roles: student, school, admin
- **Payments**: Stripe (test mode) com Split 20/80
- **Emails**: MOCKED (logged to console) - pronto para Resend
- **Assinatura Digital**: MOCK - pronto para Dropbox Sign/HelloSign
- **Reconhecimento Facial**: Pendente - Onfido recomendado

## User Personas
1. **Estudante Brasileiro** - Quer estudar inglês em Dublin
2. **Escola de Inglês** - Quer cadastrar cursos e receber matrículas
3. **Administrador** - Gerencia a plataforma, aprova escolas

## Implementado - Março 2026

### Fase 6 - Passaporte Digital ✅
- Passaporte visual estilo documento real (3 páginas)
- Capa + Dados do Aluno + Detalhes do Curso
- QR Code para verificação pública
- Rota: `/passport/view/:token`

### Fase 7 - Fluxo Completo de Matrícula ✅
- **Sistema de Contrato Digital**
  - Geração automática do contrato
  - Página de assinatura (`/contract/:enrollmentId`)
  - Checkbox + área de desenho de assinatura
  - Registro de IP/data/hora
  
- **Split de Pagamento 20/80**
  - 20% STUFF (taxa de serviço)
  - 80% Escola (repasse direto)
  
- **Emails Automáticos (MOCK)**
  - Contrato Assinado
  - Pagamento Confirmado
  - Passaporte Gerado
  - Carta da Escola em Processamento
  
- **Dashboard de Acompanhamento** (`/enrollment/:enrollmentId`)
  - Timeline visual com 4 etapas
  - Contrato → Pagamento → Passaporte → Carta
  - Status em tempo real
  - Barra de progresso
  - Botões de ação contextuais

### Endpoints Novos
- `GET /api/contract/:enrollmentId` - Obter contrato
- `POST /api/contract/:enrollmentId/sign` - Assinar contrato
- `POST /api/enrollment/full-flow` - Criar matrícula + contrato
- `POST /api/enrollment/:id/simulate-full-flow` - Simular fluxo completo
- `GET /api/passport/view/:token` - Visualizar passaporte (público)

## Próximos Passos (Integrações Reais)

### P0 - Crítico
- [ ] **Dropbox Sign** - Assinatura digital com validade jurídica
- [ ] **Resend** - Envio de emails reais
- [ ] **Onfido** - Reconhecimento facial (verificação no login + periódica)

### P1 - Importante
- [ ] Stripe Connect real para split de pagamentos
- [ ] Download do passaporte em PDF
- [ ] Upload de foto do estudante no passaporte

### P2 - Nice to Have
- [ ] Notificações push
- [ ] WhatsApp Business API para notificações
- [ ] PWA mobile

## Credenciais de Teste
- **Novo usuário**: tracker.test@gmail.com / Test123!
- **Passaporte**: https://thirsty-knuth-2.preview.emergentagent.com/passport/view/335fd3a7-6029-41ea-8822-8dfc33c7ff0a

## Tecnologias
- FastAPI 0.110.1
- React 19
- MongoDB (motor)
- Stripe (emergentintegrations)
- Tailwind CSS 3.4
- Shadcn UI
- lucide-react icons
- qrcode.react - QR Code generation
- WebSockets (FastAPI native)
