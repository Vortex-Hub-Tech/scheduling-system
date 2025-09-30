# Sistema de Agendamento de Serviços Profissionais

## Visão Geral
Sistema completo de agendamento de serviços profissionais com pagamento integrado via Stripe, gerenciamento administrativo completo e interface moderna e profissional.

## Arquitetura do Projeto

### Backend (Node.js + Express + TypeScript)
- **Porta**: 3000
- **Framework**: Express.js com TypeScript
- **Banco de Dados**: PostgreSQL (Neon) via Drizzle ORM
- **Autenticação**: Replit Auth (OpenID Connect) com sessões em banco
- **Pagamentos**: Stripe para processamento seguro
- **Localização**: API em português brasileiro

### Frontend (React + Vite + TypeScript)
- **Porta**: 5000
- **Framework**: React 19 com React Router
- **Estado**: TanStack Query (React Query)
- **Build**: Vite
- **Estilo**: CSS customizado com tema profissional

## Estrutura do Banco de Dados

### Tabelas Principais
1. **users** - Usuários do sistema (via Replit Auth)
   - Campos: id, email, firstName, lastName, profileImageUrl, isAdmin
   
2. **professionals** - Profissionais que oferecem serviços
   - Campos: id, name, specialty, description, email, phone, address, latitude, longitude, profileImage
   
3. **services** - Serviços oferecidos pelos profissionais
   - Campos: id, professionalId, name, description, price, duration, isActive
   
4. **bookings** - Agendamentos realizados
   - Campos: id, userId, serviceId, professionalId, bookingDate, status, totalAmount, paymentStatus, paymentIntentId, notes
   
5. **reviews** - Avaliações dos serviços
   - Campos: id, userId, professionalId, bookingId, rating, comment
   
6. **gallery_images** - Galeria de imagens dos profissionais
   - Campos: id, professionalId, imageUrl, caption, displayOrder

## Funcionalidades Implementadas

### Para Usuários
- ✅ Landing page atrativa para usuários não autenticados
- ✅ Sistema de login/cadastro via Replit Auth (Google, GitHub, email)
- ✅ Listagem de serviços disponíveis com filtros
- ✅ Agendamento de serviços com seleção de data/hora
- ✅ Pagamento integrado via Stripe (cartão de crédito)
- ✅ Visualização de agendamentos (histórico e pendentes)
- ✅ Sistema de avaliações com estrelas e comentários
- ✅ Galeria de trabalhos dos profissionais
- ✅ Página de informações detalhadas do profissional com localização
- ✅ Botão flutuante de WhatsApp (número: 47996885117)

### Para Administradores
- ✅ Painel administrativo completo (rota /admin)
- ✅ CRUD de profissionais (criar, editar, excluir)
- ✅ CRUD de serviços (criar, editar, excluir)
- ✅ Gerenciamento de imagens da galeria
- ✅ Visualização de todos os agendamentos
- ✅ Visualização de todas as avaliações
- ✅ Dashboard com estatísticas

## Configuração do Primeiro Admin

Para tornar um usuário administrador:
1. Faça login no sistema
2. Obtenha seu ID de usuário do banco
3. Execute no console do banco:
```sql
UPDATE users SET is_admin = true WHERE email = 'seu-email@exemplo.com';
```

## Fluxo de Uso

1. **Usuário não autenticado**: Vê landing page → Clica em "Entrar/Cadastrar"
2. **Login via Replit Auth**: Escolhe método (Google, GitHub, etc)
3. **Página inicial**: Vê cards de navegação e profissionais disponíveis
4. **Escolher serviço**: Navega para "Serviços" → Seleciona um serviço
5. **Agendar**: Preenche data, horário e observações
6. **Pagamento**: Completa pagamento via Stripe
7. **Confirmação**: Agendamento confirmado e visível em "Meus Agendamentos"

## Integração Stripe

### Configuração das Chaves
As seguintes variáveis de ambiente são necessárias:
- `STRIPE_SECRET_KEY`: Chave secreta do Stripe (sk_test_... ou sk_live_...)
- `VITE_STRIPE_PUBLIC_KEY`: Chave pública do Stripe (pk_test_... ou pk_live_...)

### Modo de Teste
- Use chaves de teste para desenvolvimento
- Cartões de teste: https://stripe.com/docs/testing

### Webhooks (Opcional)
Para sincronizar status de pagamento automaticamente, configure webhook em:
- URL: `https://seu-dominio.repl.co/api/webhooks/stripe`
- Eventos: `payment_intent.succeeded`

## Scripts Disponíveis

```bash
npm run dev:server    # Inicia backend (porta 3000)
npm run dev:client    # Inicia frontend (porta 5000)
npm run db:push       # Sincroniza schema do banco
npm run db:studio     # Abre Drizzle Studio
npm run build         # Build do frontend
```

## Contato WhatsApp

Botão flutuante verde no canto inferior direito de todas as páginas.
- **Número**: +55 47 99688-5117
- **Mensagem padrão**: "Olá! Gostaria de mais informações sobre os serviços."

## Design e UX

### Tema de Cores
- **Primary**: Azul (#2563eb)
- **Secondary**: Roxo (#7c3aed)
- **Success**: Verde (#10b981)
- **Accent**: Ciano (#06b6d4)

### Características
- Design moderno com gradientes
- Layout responsivo para mobile/desktop
- Cards com sombras e hover effects
- Tipografia Inter (Google Fonts)
- Animações suaves
- Ícones emoji para melhor UX

## Segurança

- ✅ Autenticação via OpenID Connect
- ✅ Sessões seguras em PostgreSQL
- ✅ HTTPS obrigatório em produção
- ✅ CORS configurado
- ✅ Proteção de rotas admin
- ✅ Validação de dados
- ✅ Secrets gerenciados via Replit

## Próximos Passos (Sugestões)

1. Sistema de notificações por email
2. Calendário interativo para visualização de horários
3. Sistema de cancelamento de agendamentos
4. Relatórios para administradores
5. Upload de imagens para galeria
6. Sistema de cupons de desconto
7. Integração com Google Maps para localização
8. Notificações push
9. Sistema de fidelidade/pontos

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, TypeScript, Passport
- **Frontend**: React, Vite, React Router, TanStack Query
- **Banco**: PostgreSQL (Neon), Drizzle ORM
- **Pagamentos**: Stripe
- **Auth**: Replit Auth (OpenID Connect)
- **Deploy**: Replit

## Suporte

Para dúvidas ou problemas, entre em contato via WhatsApp: +55 47 99688-5117
