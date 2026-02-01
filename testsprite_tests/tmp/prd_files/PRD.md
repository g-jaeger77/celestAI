# 📜 Celest AI - Product Requirements Document (PRD)
**Versão:** 4.1 (Release Candidate)
**Data:** 01/02/2026
**Status:** Pronto para Deploy

---

## 1. Visão do Produto
**"Your Pocket Soul-Guide"**
O Celest AI é um oráculo pessoal de bolso que combina a sabedoria ancestral da astrologia com a precisão da inteligência artificial. Diferente de horóscopos genéricos, ele oferece orientação hiper-personalizada em tempo real, ajudando o usuário a navegar seus estados mentais, físicos e emocionais.

## 2. Objetivos
- **Engajamento Diário:** Tornar a verificação dos "Sinais Vitais Cósmicos" um hábito matinal.
- **Retenção:** Uso contínuo através do Chat Inteligente (Oracle).
- **Conversão:** Funil de entrada via Onboarding com "Gate" de pagamento simulado (Vigor Anual).

## 3. Funcionalidades Principais (Core Features)

### 🌟 3.1. Onboarding Cósmico
- **Coleta de Dados:** Nome, Data, Hora e Local de Nascimento (com Autocomplete de Cidades).
- **Cálculo Astral:** Determinação precisa de Signo Solar, Lunar e Ascendente.
- **Simulação de Pagamento:** Paywall simulado ("Vigor Anual") para validar interesse de compra.
- **Criptografia Visual:** Feedback visual de segurança dos dados.

### 🧭 3.2. Dashboard "Bússola"
- **Sinais Vitais (Sync Rings):**
  - Scores de 0-100% para **Mente**, **Corpo** e **Alma**.
  - Baseado no cálculo de trânsitos planetários atuais sobre o mapa natal.
- **Janelas de Ação:**
  - Identificação de "Lua Void" (períodos de cautela).
  - Sugestão de melhores horários para atividades.
- **Insight do Dia:** Frase síntese gerada por IA.

### 💬 3.3. Oracle Chat (IA Astrológica)
- **Persona:** Empática, mística, mas direta e fundamentada.
- **Contexto:** A IA "sabe" quem o usuário é (mapa astral) e o histórico da conversa.
- **Interface:** Chat fluido estilo mensageiro moderno.

### 💞 3.4. Sinastria (Compatibilidade)
- **Análise de Relacionamento:** Comparação entre dois mapas astrais.
- **Radar Chart:** Visualização gráfica da compatibilidade em 6 eixos (Comunicação, Emoção, etc.).

## 4. Arquitetura Técnica

### 🎨 Frontend (Client)
- **Framework:** React 19 (via Vite).
- **Estilização:** Tailwind CSS v3 (Design System: "Cosmic Dark Mode").
- **Componentes:** Glassmorphism, Animações CSS (Fade-in, Scale-in), Ícones Google Fonts.
- **SEO:** `react-helmet-async` com tags Open Graph padronizadas (`<SEOHead />`).
- **PWA:** Suporte básico configurado (manifest.json).

### ⚙️ Backend (Server)
- **Linguagem:** Python 3.9+.
- **Infra:** Serverless Functions (adaptado para Vercel).
- **Roteamento:** FastAPI (ou similar) servido via `api/index.py`.
- **Cálculos:** Bibliotecas astronômicas (`swisseph` ou `kerykeion` - *A verificar implementação final*).

### 💾 Dados & Infraestrutura
- **Banco de Dados:** Supabase (PostgreSQL) para persistência de usuários e histórico.
- **Sessão:** `localStorage` / `sessionStorage` para persistência rápida no cliente.
- **Hospedagem:** Vercel (Frontend e Backend Serverless no mesmo repo).

## 5. Status Atual & Próximos Passos

### ✅ Concluído (V4)
- [x] Refatoração completa da UI (Design Premium).
- [x] Implementação do Backend Python na Vercel.
- [x] Remoção de URLs hardcoded (`localhost`).
- [x] Otimização de SEO e Meta Tags.
- [x] Validação de Lint e Build.

### 🚀 Roadmap (V5 - Futuro)
- [ ] Integração com Stripe real para pagamentos.
- [ ] Notificações Push (PWA avançado).
- [ ] Modo "Deep Dive" com detalhamento técnico dos trânsitos.
- [ ] Geração de Mapa Astral em PDF.

---
**Assinado:** *Piloto do Sistema AntiGravity*
