# 🦈 SharkBJJ - Academia de Jiu-Jitsu Management System

Um sistema completo de gestão para academias de Brazilian Jiu-Jitsu com QR Code para presença, gamificação e acompanhamento de progresso.

## 🌐 Demo

**Live Demo:** https://sharkbjj.vercel.app  
**Repositório:** https://github.com/bolivinhoia-lab/sharkbjj

---

## 📋 O que é o SharkBJJ?

O SharkBJJ é uma **Progressive Web App (PWA)** completa para gestão de academias de Brazilian Jiu-Jitsu. Desenvolvido com foco na experiência do usuário e gamificação, oferece todas as ferramentas necessárias para:

- **Gestão de Alunos:** Cadastro, acompanhamento de progresso, histórico de graduações
- **Controle de Presença:** Sistema QR Code integrado para check-in rápido
- **Dashboard Instrutor:** Visão completa da academia, estatísticas e relatórios
- **Portal do Aluno:** Acompanhamento pessoal de progresso e conquistas
- **Sistema de Gamificação:** Badges, conquistas e acompanhamento de metas

---

## ✨ Funcionalidades Principais

### 🎯 Para Instrutores
- **Dashboard Completo:** Visão geral da academia com métricas importantes
- **Gestão de Alunos:** CRUD completo de estudantes
- **Sistema de Graduação:** Controle de faixas e graus
- **Relatórios:** Frequência, progresso, pagamentos
- **QR Code Generator:** Gerar códigos únicos para check-in

### 📱 Para Alunos
- **Portal Pessoal:** Dashboard individual com progresso
- **Check-in QR:** Registrar presença via QR Code
- **Histórico de Treinos:** Acompanhar frequência e evolução
- **Sistema de Badges:** Conquistas e marcos alcançados
- **Calendário de Aulas:** Visualizar horários e eventos

### 🏆 Gamificação
- **Sistema de Badges:** Conquistas por frequência, técnicas, etc.
- **Metas Pessoais:** Objetivos individuais de treino
- **Ranking de Frequência:** Competição saudável entre alunos
- **Marcos de Progresso:** Acompanhamento de evolução técnica

### 📊 Analytics
- **Métricas de Frequência:** Relatórios detalhados de presença
- **Progressão de Faixa:** Acompanhamento de evolução por faixa
- **Engajamento:** Análise de participação e retenção
- **Relatórios Financeiros:** Controle de mensalidades e pagamentos

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes UI modernos
- **Lucide React** - Ícones consistentes

### Backend/Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security (RLS)

### Features Especiais
- **PWA** - Progressive Web App instalável
- **QR Code** - Geração e leitura para check-in
- **Responsive Design** - Funciona perfeitamente em mobile e desktop
- **Real-time Updates** - Atualizações instantâneas via Supabase

---

## 🚀 Instalação e Deploy

### Pré-requisitos
- Node.js 18+
- Conta no Supabase
- Conta no Vercel (para deploy)

### 1. Clone o Repositório
```bash
git clone https://github.com/bolivinhoia-lab/sharkbjj.git
cd sharkbjj
```

### 2. Instale Dependências
```bash
npm install
```

### 3. Configure Variáveis de Ambiente
```bash
cp .env.example .env.local
```

Configure no `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica
SUPABASE_SERVICE_ROLE_KEY=sua_chave_servico
```

### 4. Configure o Banco (Supabase)
Execute os scripts SQL em `sql/` na ordem:
1. `01_create_tables.sql`
2. `02_create_policies.sql`
3. `03_seed_data.sql`

### 5. Execute Localmente
```bash
npm run dev
```

### 6. Deploy na Vercel
```bash
vercel --prod
```

---

## 🗄️ Estrutura do Banco

### Principais Tabelas

**students:** Dados dos alunos
- id, name, email, belt, stripe, join_date, status

**attendance:** Registro de presença
- id, student_id, date, check_in_time, method

**belts:** Sistema de graduação
- id, name, color, order, requirements

**badges:** Sistema de conquistas
- id, name, description, icon, requirements

**student_badges:** Badges conquistados
- student_id, badge_id, earned_date

---

## 📱 Como Usar

### Para Instrutores

1. **Primeiro Acesso:**
   - Acesse o sistema e crie sua conta
   - Configure dados da academia
   - Adicione primeiro aluno

2. **Gestão Diária:**
   - Visualize dashboard com métricas
   - Registre presenças via QR ou manual
   - Acompanhe progresso dos alunos

3. **Graduações:**
   - Acesse perfil do aluno
   - Atualize faixa/grau quando apropriado
   - Sistema registra automaticamente

### Para Alunos

1. **Check-in:**
   - Escaneie QR Code na academia
   - Ou use check-in manual se autorizado

2. **Acompanhamento:**
   - Visualize seu progresso no portal
   - Veja badges conquistados
   - Acompanhe frequência mensal

---

## 🎯 Casos de Uso

### Academia Pequena (até 50 alunos)
- Foco na simplicidade e gamificação
- QR Code para agilizar check-in
- Dashboard básico para instrutor

### Academia Média (50-200 alunos)
- Relatórios detalhados de frequência
- Sistema de graduação robusto
- Múltiplos instrutores

### Academia Grande (200+ alunos)
- Analytics avançados
- Sistema de badges complexo
- Integração com pagamentos

---

## 🔄 Roadmap

### Versão 2.0 (Próximas Features)
- [ ] Sistema de pagamentos integrado
- [ ] Chat entre alunos e instrutores
- [ ] Agendamento de aulas particulares
- [ ] Sistema de eventos e campeonatos
- [ ] Mobile app nativo
- [ ] Integração com redes sociais

### Versão 3.0 (Futuro)
- [ ] IA para análise de progresso
- [ ] Sistema de vídeo-aulas
- [ ] Marketplace de equipamentos
- [ ] Network entre academias

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob licença MIT. Veja `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

**Rob Boliver** - [@maximus_irl](https://t.me/maximus_irl)

*Desenvolvido para modernizar a gestão de academias de Jiu-Jitsu com tecnologia e gamificação.*

---

## 🙏 Agradecimentos

- Comunidade BJJ pelo feedback
- Supabase pela infraestrutura
- Vercel pelo hosting
- shadcn/ui pelos componentes

---

**🥋 Oss!** 🦈