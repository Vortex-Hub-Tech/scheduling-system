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

### Mobile App (React Native + Expo)
- **Framework**: Expo Router (File-based routing)
- **Plataformas**: iOS, Android, Web
- **API Communication**: Conecta ao backend via HTTP requests
- **Navegação**: Tab-based navigation com telas para Início e Serviços
- **Estilo**: React Native StyleSheet

### Frontend Web (React + Vite + TypeScript) - Legacy
- **Nota**: O frontend web original está em `client/` mas o foco agora é no app mobile
- **Porta**: 5000 (quando executado)
- **Framework**: React 19 com React Router

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

### Para Usuários (App Mobile)
- ✅ Sistema de login/cadastro com email e senha (autenticação JWT)
- ✅ Tela inicial com navegação por cards
- ✅ Listagem de serviços disponíveis
- ✅ Visualização de detalhes de cada serviço
- ✅ Agendamento de serviços com seleção de data/hora
- ✅ Formulário de agendamento com dados do cliente
- ✅ Visualização de agendamentos pessoais
- ✅ Galeria de trabalhos dos profissionais
- ✅ Sistema de avaliações com estrelas e comentários
- ✅ Botão de contato via WhatsApp
- ✅ Navegação fluida com Expo Router

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

## Fluxo de Uso (App Mobile)

1. **Primeiro acesso**: Usuário vê tela de login
2. **Criar conta**: Clica em "Cadastre-se" → Preenche email, senha, nome
3. **Login**: Insere credenciais → Sistema autentica via JWT
4. **Página inicial**: Vê cards de navegação (Serviços, Galeria, Avaliações, Meus Agendamentos)
5. **Escolher serviço**: 
   - Vai para aba "Serviços"
   - Clica em um serviço para ver detalhes
   - Vê informações do profissional, preço, duração
6. **Agendar**: 
   - Clica em "Agendar Agora"
   - Seleciona data e horário
   - Preenche nome, telefone, email (opcional)
   - Adiciona observações (opcional)
   - Confirma agendamento
7. **Visualizar agendamentos**: Acessa "Meus Agendamentos" na tela inicial
8. **Outros recursos**:
   - Visualiza galeria de trabalhos
   - Lê avaliações de outros clientes
   - Contata via WhatsApp

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
# Mobile App (Expo)
npm start             # Inicia Expo (mostra QR code para Expo Go)
npm run android       # Abre no emulador Android
npm run ios           # Abre no simulador iOS (apenas Mac)
npm run web           # Abre versão web do app mobile

# Backend
npm run dev:server    # Inicia backend (porta 3000)

# Database
npm run db:push       # Sincroniza schema do banco
npm run db:studio     # Abre Drizzle Studio

# Legacy Web Frontend
npm run dev:client    # Inicia frontend web React+Vite (porta 5000)
npm run build         # Build do frontend web
```

## Como Usar o App Mobile

### Desenvolvimento
1. **No seu celular**: Instale o aplicativo Expo Go (Android/iOS)
2. **No Replit**: O workflow "Expo App" já está rodando
3. **Escaneie o QR Code**: Visível nos logs do workflow "Expo App"
4. **Backend**: Certifique-se que o workflow "Backend" está rodando na porta 3000

### Estrutura do App Mobile
```
app/
├── (tabs)/               # Navegação por abas
│   ├── index.tsx         # Tela inicial com cards de navegação
│   ├── explore.tsx       # Tela de serviços (lista serviços do backend)
│   └── _layout.tsx       # Configuração das abas
├── contexts/
│   └── AuthContext.tsx   # Gerenciamento de autenticação com JWT
├── lib/
│   └── api.ts            # Configuração de API requests
├── login.tsx             # Tela de login
├── register.tsx          # Tela de cadastro
├── service-details.tsx   # Detalhes do serviço
├── booking.tsx           # Formulário de agendamento
├── my-bookings.tsx       # Lista de agendamentos do usuário
├── gallery.tsx           # Galeria de imagens
├── reviews.tsx           # Avaliações dos serviços
├── _layout.tsx           # Layout raiz do app
└── +not-found.tsx        # Tela de erro 404
```

### Conectando ao Backend
O app mobile se conecta automaticamente ao backend Express na porta 3000. A configuração está em `app/lib/api.ts` e detecta automaticamente o IP correto em desenvolvimento:
- No emulador/celular: Detecta o IP da máquina via Expo
- Na web: Usa localhost:3000
- Em produção: Usa a variável EXPO_PUBLIC_API_URL

### Autenticação
O app usa autenticação JWT (JSON Web Tokens):
- Tokens são armazenados com segurança via Expo SecureStore
- Login e registro com email/senha
- Tokens válidos por 7 dias
- AuthContext gerencia o estado de autenticação globalmente

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
