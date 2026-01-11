# Dublin Study - Plataforma de Intercâmbio Educacional

## Problema Original
Criação de um aplicativo completo de intercâmbio educacional com foco em Dublin, Irlanda, desenvolvido para conectar estudantes diretamente às escolas credenciadas, sem intermediários.

## Arquitetura
- **Backend**: FastAPI + MongoDB + Stripe (emergentintegrations)
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Auth**: JWT (email/senha)
- **Payments**: Stripe (test mode)
- **Emails**: MOCKED (logged to console)

## User Personas
1. **Estudante Brasileiro** - Quer estudar inglês em Dublin, precisa de orientação sobre escolas, documentos e adaptação
2. **Estudante Internacional** - Busca informações sobre cursos, preços e processo de imigração

## Core Requirements (Static)
- Catálogo de escolas com preços transparentes
- Cursos com duração, carga horária e requisitos
- Pagamento online integrado (Stripe)
- Notificação automática por e-mail após pagamento
- Guias de transporte público de Dublin
- Lista de órgãos governamentais
- Guia PPS Number, GNIB/IRP, Passaporte
- Interface multilíngue (PT/EN)

## Implementado - Janeiro 2025

### Backend (21 endpoints)
- ✅ Auth: register, login, me
- ✅ Schools: list, detail, courses
- ✅ Courses: list, detail
- ✅ Enrollments: create, list, detail
- ✅ Payments: checkout, status, webhook
- ✅ Transport: routes (bus, luas, dart)
- ✅ Services: agencies list
- ✅ Guides: PPS, GNIB, Passport
- ✅ Seed endpoint

### Frontend Pages
- ✅ Landing page (hero, features, stats, CTA)
- ✅ Schools listing with search
- ✅ School detail with courses
- ✅ Enrollment dialog
- ✅ Dashboard (user enrollments)
- ✅ Payment success page
- ✅ Transport page (tabs: all, bus, luas, dart)
- ✅ Services page (guides + agencies)
- ✅ PPS Guide
- ✅ GNIB Guide
- ✅ Passport Guide
- ✅ Login/Register pages
- ✅ Language toggle PT/EN

### Dados Seed
- 4 escolas de inglês
- 6 cursos
- 5 rotas de transporte
- 5 órgãos governamentais

## Prioritized Backlog

### P0 - Crítico (Próximos passos)
- [ ] Integração real de e-mail (SendGrid/Resend)
- [ ] Admin panel para escolas cadastrarem cursos

### P1 - Importante
- [ ] Sistema de reviews/avaliações
- [ ] Chat/suporte integrado
- [ ] Calculadora de custos de vida
- [ ] Comparador de escolas

### P2 - Nice to Have
- [ ] PWA mobile
- [ ] Push notifications
- [ ] Blog/artigos
- [ ] Depoimentos de ex-alunos

## Tecnologias
- FastAPI 0.110.1
- React 19
- MongoDB (motor)
- Stripe (emergentintegrations)
- Tailwind CSS 3.4
- Shadcn UI
- lucide-react icons
