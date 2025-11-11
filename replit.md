# Sistema de Agendamento de Serviços para Pequenas Empresas

## Visão Geral
Sistema simples e eficiente de agendamento de serviços, ideal para pequenas empresas. Os clientes navegam e agendam sem necessidade de cadastro, enquanto o proprietário gerencia todo o sistema com acesso seguro.

## Arquitetura do Projeto

### Backend (Node.js + Express + TypeScript)
- **Porta**: 3000
- **Framework**: Express.js com TypeScript
- **Banco de Dados**: PostgreSQL (Neon) via Drizzle ORM
- **Autenticação**: Sistema simples de proprietário com username/password (variáveis de ambiente)
- **Acesso Público**: Clientes não precisam fazer login para navegar e agendar
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

### Para Clientes (App Mobile)
- ✅ Acesso livre sem necessidade de login ou cadastro
- ✅ Tela inicial com navegação por cards
- ✅ Listagem de serviços disponíveis
- ✅ Visualização de detalhes de cada serviço
- ✅ Agendamento de serviços com seleção de data/hora
- ✅ Formulário de agendamento onde o cliente fornece seus dados (nome, telefone, email)
- ✅ Visualização de agendamentos (se o cliente souber buscar)
- ✅ Galeria de trabalhos dos profissionais
- ✅ Sistema de avaliações com estrelas e comentários
- ✅ Botão de contato via WhatsApp
- ✅ Navegação fluida com Expo Router

### Para Proprietários
- ✅ Acesso via botão "🔐 Sou proprietário" na tela inicial
- ✅ Login seguro com username e senha
- ✅ Painel administrativo completo (rota /admin no cliente web)
- ✅ CRUD de profissionais (criar, editar, excluir)
- ✅ CRUD de serviços (criar, editar, excluir)
- ✅ Gerenciamento de imagens da galeria
- ✅ Visualização de todos os agendamentos
- ✅ Visualização de todas as avaliações
- ✅ Dashboard com estatísticas

## Configuração de Acesso do Proprietário

As credenciais do proprietário são configuradas através de variáveis de ambiente:
- **ADMIN_USERNAME**: Nome de usuário do proprietário (padrão: "admin")
- **ADMIN_PASSWORD**: Senha do proprietário (padrão: "admin123")

⚠️ **IMPORTANTE**: Altere a senha padrão em produção para uma senha forte!

## Fluxo de Uso (App Mobile)

### Para Clientes:
1. **Primeiro acesso**: App abre direto na tela inicial - sem necessidade de login
2. **Página inicial**: Vê cards de navegação (Serviços, Galeria, Avaliações, Meus Agendamentos)
3. **Escolher serviço**: 
   - Vai para aba "Serviços"
   - Clica em um serviço para ver detalhes
   - Vê informações do profissional, preço, duração
4. **Agendar**: 
   - Clica em "Agendar Agora"
   - Seleciona data e horário
   - Preenche seus dados: nome, telefone, email
   - Adiciona observações (opcional)
   - Confirma agendamento
5. **Outros recursos**:
   - Visualiza galeria de trabalhos
   - Lê avaliações de outros clientes
   - Contata via WhatsApp

### Para Proprietários:
1. **Acesso**: Na tela inicial, clica em "🔐 Sou proprietário"
2. **Login**: Insere username e senha (configurados nas variáveis de ambiente)
3. **Gerenciamento**: Acessa painel web administrativo em `/admin` para gerenciar todo o sistema

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
│   └── AuthContext.tsx   # Gerenciamento de identificação proprietário/cliente
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
Sistema simplificado de identificação:
- **Clientes**: Não precisam de cadastro ou login
- **Proprietário**: Acesso protegido com username/senha via sessões seguras
- **Sessões**: Gerenciadas pelo servidor com PostgreSQL
- **AuthContext**: Gerencia apenas o estado de "proprietário" ou "cliente"

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
