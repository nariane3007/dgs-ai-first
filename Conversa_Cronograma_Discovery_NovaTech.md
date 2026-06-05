# Conversa Completa — Cronograma Discovery AI First DB1 × NovaTech
**Data:** 05/06/2026  
**Participante:** Nariane Souza (nariane.souza@db1.com.br)  
**Sessão:** Cronograma Discovery NovaTech

---

## 💬 Interação 1

### 👤 Nariane
> Como um gerente de projetos transforme o plano anexo em um cronograma visual de 2 semanas de discovery, com atividades, responsáveis e dependências

**Arquivo anexado:** `Discovery_AIFirst_NovaTech.md`

---

### 🤖 Claude

Leu o arquivo `Discovery_AIFirst_NovaTech.md` e gerou um cronograma visual HTML (Gantt) com **duas fases separadas**:

**Fase 1 — Semana 1: Pré-Discovery (Agentes IA)**

| Dia(s) | ID | Atividade | Responsável |
|--------|-----|-----------|-------------|
| Dia 1 | PRÉ | Kickoff Técnico + Provisionamento de Acessos | DB1 + NovaTech |
| Dia 1 | 1.0 | Análise do Histórico de Chamados | Agente IA (Analisador de Frequência) |
| Dia 1–2 | 1.1 | Catalogação e Inventário das Fontes | Agente IA (Catalogador) |
| Dia 2–3 | 1.2 | Duplicatas e Contradições | Agente IA (Auditor de Consistência) |
| Dia 2–3 | 1.3 | Mapeamento Temático (Clustering) | Agente IA (Classificador Temático) |
| Dia 2–3 | 1.5 | Qualidade Técnica para Indexação | Agente IA (Auditor Técnico) |
| Dia 3–4 | 1.4 | Priorização e Escopo MVP | Agente IA (Analisador de Relevância) |
| Dia 4–5 | CON | Mapa de Discovery Consolidado | Agente IA (Sintetizador) |
| Dia 5 | REV | Revisão do Mapa | Consultor DB1 (Humano) |
| **Dia 5** | **M1** | **✅ Mapa aprovado** | — |

**Fase 2 — Semana 2: Discovery Humano**

| Dia(s) | ID | Atividade | Responsável |
|--------|-----|-----------|-------------|
| Dia 6–7 | 2.1 | Entrevistas: Gestores de Documentação (3×1h) | Consultor DB1 |
| Dia 7 | 2.2 | Sessão: Equipe de Atendimento (1h30) | Consultor DB1 |
| Dia 8 | 2.3 | Entrevista: TI / Infraestrutura (1h) | Consultor DB1 |
| Dia 6–9 | 2.5 | Coleta de Tickets Reais (assíncrono) | Equipe NovaTech |
| Dia 9–10 | 2.4 | Workshop de Validação e Priorização (2h) | DB1 + todas as áreas |
| **Dia 10** | **M2** | **✅ Escopo MVP validado** | — |

O cronograma foi apresentado com:
- Código de cores por responsável (IA = azul, Humano = laranja, Assíncrono = verde, Workshop = roxo, Marco = azul escuro)
- Legenda visual
- Cards de métricas (1.200 docs, 5 sessões, 5–8 atendentes, 50–100 tickets)
- Seção de riscos ao cronograma

---

## 💬 Interação 2

### 👤 Nariane
> consolidar a semana 1 e dois em um unico item

---

### 🤖 Claude

Atualizou o visual: as duas semanas foram unificadas em **um único bloco Gantt**, com:
- Cabeçalho dividido internamente: `⚙️ Semana 1 — Pré-Discovery (IA)` | `👥 Semana 2 — Discovery Humano`
- Uma linha tracejada separando as duas fases dentro do mesmo bloco
- Rótulo de transição: `▸ INÍCIO DA SEMANA 2 — pré-requisito: Mapa aprovado`
- Todas as 14 atividades visíveis em sequência contínua, dias 1 a 10

---

## 💬 Interação 3

### 👤 Nariane
> salvar esta conversa em .md

---

### 🤖 Claude

Salvou o arquivo `Conversa_Cronograma_Discovery_NovaTech.md` com o resumo estruturado do conteúdo gerado (cronograma em tabelas, dependências, riscos, pré-requisitos e métricas).

---

## 💬 Interação 4

### 👤 Nariane
> preciso que salve toda a conversa , incluindo as nossas interações

---

### 🤖 Claude

Tentou ler o transcript da sessão via ferramenta (`mcp__session_info__read_transcript`), mas a sessão atual não estava disponível na listagem (sessão em andamento). Reconstruiu a conversa completa a partir do contexto e gerou este arquivo.

---

## 📋 Resumo do que foi produzido nesta sessão

| Entrega | Arquivo |
|---------|---------|
| Cronograma visual interativo (HTML/Gantt) | Exibido inline na conversa |
| Resumo estruturado do cronograma | `Conversa_Cronograma_Discovery_NovaTech.md` |
| Conversa completa com interações | `Conversa_Completa_Discovery_NovaTech.md` *(este arquivo)* |

---

## 📎 Conteúdo do plano original (Discovery_AIFirst_NovaTech.md)

### Contexto do Projeto

A NovaTech possui ~1.200 documentos distribuídos em três fontes:
- SharePoint: ~800 docs
- Confluence: ~400 páginas
- Pasta de rede: planilhas mensais

**Objetivo:** construir um assistente de IA integrado ao Microsoft Teams que permita aos 45 atendentes consultar documentação em linguagem natural, reduzindo o tempo médio de busca de 12 para menos de 2 minutos por chamado.

**Modelo AI First DB1:** agentes de IA executam a pré-análise da documentação *antes* das entrevistas com stakeholders.

### Estrutura do Discovery (3 semanas no plano original)

- **Semana 1:** Pré-Discovery (Agentes IA)
- **Semana 2:** Discovery Humano (Entrevistas + Validação)
- **Semana 3:** Consolidação e Handoff para Especificação *(não incluída no cronograma visual — fora do escopo das 2 semanas solicitadas)*

### Atividades da Fase 1 — Pré-Discovery

**Atividade 1.0 — Análise do Histórico de Chamados**  
Executor: Agente IA (Analisador de Frequência Real)  
Dependência: Acesso ao sistema de chamados  
Duração: 1 dia  
Entrega: Ranking de perguntas reais por frequência, classificadas por tema, com gaps de cobertura

**Atividade 1.1 — Catalogação e Inventário das Fontes**  
Executor: Agente IA (Catalogador)  
Dependência: Acesso provisionado ao SharePoint, Confluence e pasta de rede  
Duração: 1–2 dias  
Entrega: Inventário completo com ~1.200 registros catalogados

**Atividade 1.2 — Identificação de Duplicatas e Contradições**  
Executor: Agente IA (Auditor de Consistência)  
Dependência: 1.1 concluída  
Duração: 1–2 dias  
Entrega: Relatório de conflitos priorizados por criticidade

**Atividade 1.3 — Mapeamento Temático e Clustering**  
Executor: Agente IA (Classificador Temático)  
Dependência: 1.1 concluída  
Duração: 1 dia  
Entrega: Mapa temático com cobertura por domínio, gaps e sobreposições

**Atividade 1.4 — Priorização de Conteúdo**  
Executor: Agente IA (Analisador de Relevância)  
Dependência: 1.1 + 1.3 + 1.0  
Duração: 1 dia  
Entrega: Mapa de prioridade de tratamento e escopo do MVP

**Atividade 1.5 — Qualidade Técnica da Documentação**  
Executor: Agente IA (Auditor Técnico)  
Dependência: 1.1 concluída  
Duração: 1 dia  
Entrega: Classificação de cada documento: Pronto / Requer tratamento / Requer decisão humana

**Entrega Consolidada — Mapa de Discovery**  
Executor: Agente IA (Sintetizador) + Revisão humana (Consultor DB1)  
Dependência: 1.1 → 1.5  
Duração: meio dia + revisão de 2–4h

### Atividades da Fase 2 — Discovery Humano

**Atividade 2.1 — Entrevista: Gestores de Documentação (3 áreas)**  
Executor: Consultor DB1  
Participantes: Responsáveis por Operações, Compliance e Comercial  
Duração: 1h por área (3 sessões)  
Objetivo: Validar conflitos, entender processo de atualização, definir "fonte da verdade"

**Atividade 2.2 — Entrevista: Equipe de Atendimento**  
Executor: Consultor DB1  
Participantes: Amostra de 5–8 atendentes (sênior, recente, chamados complexos)  
Duração: 1h30 (grupo focado)  
Objetivo: Validar tipos de pergunta, jornada atual de busca, conhecimento tácito

**Atividade 2.3 — Entrevista: TI / Infraestrutura**  
Executor: Consultor DB1  
Participantes: Responsável de TI / Microsoft 365  
Duração: 1h  
Objetivo: Mapear ambiente técnico, permissões, restrições de segurança e integrações

**Atividade 2.4 — Workshop de Validação e Priorização**  
Executor: Consultor DB1 + Stakeholders NovaTech  
Participantes: 3 áreas + TI + 1–2 atendentes sêniores  
Duração: 2h  
Entrega: Escopo validado do MVP, documentos aprovados para indexação, responsáveis por domínio

**Atividade 2.5 — Coleta de Exemplos Reais de Perguntas**  
Executor: Assíncrono — Equipe de atendimento NovaTech  
Duração: durante toda a Semana 2  
Entrega: 50–100 tickets reais para uso como casos de teste

### Riscos ao Cronograma

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| 🔴 Atraso no provisionamento de acessos | +3 a +10 dias | Tratar como Dia 0, junto à assinatura do contrato |
| 🔴 Documentos não extraíveis (PDFs sem OCR) | +3 a +5 dias | Testar amostra de 20–30 docs no kickoff |
| 🟡 Indisponibilidade de stakeholders | +3 a +7 dias | Bloquear agendas na Semana 1 |
| 🟡 Alta densidade de conflitos documentais | +2 a +4 dias | Resolver médio/baixo assincronamente após Workshop |
| 🟡 Documentos com restrição de acesso por perfil | Indeterminado — muda arquitetura | Mapear no kickoff, incluir como requisito do MVP |
| 🟡 Processo de atualização sem versionamento formal | Risco estrutural | Definir governança no Workshop 2.4 |

### Pré-requisitos para Início

- [ ] Acesso de leitura ao SharePoint via Microsoft Graph API
- [ ] Acesso de leitura à API do Confluence
- [ ] Acesso de leitura à pasta de rede com planilhas mensais
- [ ] Exportação ou acesso ao sistema de chamados (últimos 3–6 meses)
- [ ] Ponto focal definido por área (Operações, Compliance, Comercial)
- [ ] Autorização formal do DPO/Jurídico para análise pela IA

---

*Gerado em 05/06/2026 via DB1 × Claude (Cowork)*
