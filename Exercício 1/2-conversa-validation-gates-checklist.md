# Conversa — Validation Gates Checklist
**Projeto:** NovaTech Assistant · DB1 · Fase 2 — Estruturação  
**Data:** 15/06/2026  
**Exercício:** 2.2 — Delivery Manager  
**Artefato gerado:** `validation-gates-checklist-novatech.html`

---

## Sessão Claude

| Campo | Valor |
|-------|-------|
| Modelo | claude-sonnet-4-6 |
| Session ID | local_a241f462-2cd3-42a7-a6e1-67bf4e995fc1 |
| Usuário | nariane.souza@db1.com.br |
| Data/hora | 15/06/2026 |
| Plataforma | Claude Cowork (desktop) |

---

## Contexto

Com base na conversa do Exercício 2.1 (`1-conversa-workflow-ai-first.md`) e nos arquivos do Cenário 2, foi solicitada a criação de um template de checklist de **validation gates** — pontos onde um humano obrigatoriamente revisa e aprova antes de avançar no workflow AI First.

---

## Prompts da sessão

Registro cronológico de todos os prompts enviados durante esta conversa.

| # | Prompt |
|---|--------|
| 1 | Com base nesta conversa e nos arquivos anexados no projeto do Cenário 2 como uma gerente de projetos crie um template de checklist de validation gates — pontos onde um humano obrigatoriamente revisa e aprova antes de avançar. O checklist deve incluir ao menos: Gate entre Spec e Plan, Gate entre Tasks geradas por IA e início de implementação, Gate entre código gerado por agente e merge, Gate entre testes gerados por IA e deploy. Para cada gate, defina: quem aprova, o que verifica, quanto tempo tem, e o que acontece se reprovar. |
| 2 | De onde vieram os SLA's definidos no checklist |
| 3 | Sim, na minha visão o SLA pode ser definido de acordo com o tamanho do escopo |
| 4 | quero *(aceite da proposta de SLA dinâmico por escopo)* |
| 5 | conforme altero a barra de SL não está alterado os prazos nos gates |
| 6 | AInda não está alterando no texto abaixo da identificação do gate |
| 7 | incluir a opção para exportar para PDF o checklist, exportar todos os dados da página em uma arquivo |
| 8 | exportar conversa para .MD |
| 9 | salve em .md com a sessão do claude usada |
| 10 | registrar os prompts da minha interação com o claude |

---

## Solicitação inicial

> Com base nesta conversa e nos arquivos anexados no projeto do Cenário 2 como uma gerente de projetos, crie um template de checklist de validation gates — pontos onde um humano obrigatoriamente revisa e aprova antes de avançar. O checklist deve incluir ao menos:
> - Gate entre Spec e Plan (quem aprova a spec antes de gerar o plano?)
> - Gate entre Tasks geradas por IA e início de implementação (quem valida que as tasks fazem sentido?)
> - Gate entre código gerado por agente e merge (quem faz code review?)
> - Gate entre testes gerados por IA e deploy (quem valida que os testes são suficientes?)
>
> Para cada gate, defina: quem aprova, o que verifica, quanto tempo tem, e o que acontece se reprovar.

---

## Template gerado — Validation Gates

### Estrutura do pipeline

```
SPEC → [GATE 1] → PLAN → [GATE 2] → TASKS → IMPLEMENT → [GATE 3] → REVIEW → [GATE 4] → DEPLOY
```

Gates são checkpoints humanos obrigatórios e bloqueantes. Nenhuma fase seguinte inicia sem aprovação explícita.

---

### GATE 1 — Spec → Plan — Validação da Especificação

**Quem aprova:**
- Tech Lead (obrigatório) — viabilidade técnica + ausência de conflito com ADRs
- Product Specialist (co-autora) — alinhamento com negócio

**SLA:** variável por escopo (ver tabela abaixo)

**O que verifica:**
1. Cada requisito tem critério de aceite verificável e não ambíguo *(obrigatório)*
2. Todos os módulos afetados estão identificados (RAG pipeline, bot Teams, painel web)
3. Spec não contradiz nenhum ADR existente (ADR-0001 a ADR-0004) *(obrigatório)*
4. Escopo está dentro do que foi validado no Discovery — sem feature creep
5. Requisitos não-funcionais incluídos (latência, segurança, limites de tokens) *(obrigatório)*
6. QA validou testabilidade dos critérios de aceite antes da aprovação
7. Dev Pleno leu o requirements.md e levantou dúvidas de domínio

**Se aprovar:**
- TL inicia elaboração do `plan.md`
- DM atualiza status no Azure DevOps — task "Spec" → Done
- DM arquiva o requirements.md aprovado com data/hora

**Se reprovar:**
1. TL documenta itens reprovados com comentários objetivos
2. PS revisa spec com base nos comentários — sem reescrever do zero
3. Nenhuma linha de plan.md é iniciada até re-aprovação
4. DM ajusta prazo no board e registra motivo do bloqueio
5. Nova rodada de review em até 4h úteis após entrega da revisão

> 🔒 **BLOQUEANTE** — plan.md não pode ser iniciado

---

### GATE 2 — Tasks → Implement — Validação das Tasks Geradas por IA

**Quem aprova:**
- Tech Lead (obrigatório) — atomicidade, cobertura e ausência de bloqueios arquiteturais
- QA (consultor) — valida que há task de teste para cada task de implementação

**SLA:** variável por escopo (ver tabela abaixo)

**O que verifica:**
1. Cada task é atômica — concluível em no máximo 1 dia útil *(obrigatório)*
2. Toda task tem critério de "done" explícito e verificável *(obrigatório)*
3. Existe task de teste correspondente para cada task de implementação *(obrigatório)*
4. Dependências entre tasks estão mapeadas e não criam bloqueio circular
5. Nenhuma task exige decisão arquitetural ainda não resolvida em ADR
6. Tasks fazem sentido para o Dev Pleno (não apenas para o Sênior)
7. Cobertura total do plan.md — nenhum módulo ficou sem tasks
8. Tasks foram criadas no Azure DevOps pelo DM após geração pela IA

**Se aprovar:**
- DM cria/ativa tasks no board e faz atribuição (Sênior / Pleno)
- QA inicia geração paralela de casos de teste

**Se reprovar:**
1. TL marca tasks reprovadas com label "bloqueada"
2. Dev Sênior refina apenas as tasks bloqueadas indicadas
3. Tasks aprovadas podem iniciar imediatamente
4. Nova rodada de review das tasks corrigidas em até 2h úteis

> 🔒 **BLOQUEANTE PARCIAL** — apenas tasks reprovadas ficam bloqueadas

---

### GATE 3 — Código gerado por agente → Merge — Code Review

**Quem aprova:**
- Tech Lead (único approver obrigatório no PR) — merge owner
- QA (revisor) — cobertura de testes e cenários de falha

**SLA:** variável por escopo (ver tabela abaixo)  
**Mecanismo:** Branch protection rule no GitHub (1 approval obrigatório)

**O que verifica:**
1. Código segue as coding standards definidas no AGENTS.md *(obrigatório)*
2. Dev leu e entende o código gerado pela IA — não é "vibe coding" *(obrigatório)*
3. Testes unitários presentes e todos passando no CI *(obrigatório)*
4. Sem credenciais, connection strings ou dados hardcoded *(obrigatório)*
5. Tipos TypeScript corretos — sem `any` não justificado por comentário
6. Descrição do PR explica contexto, decisões e limitações conhecidas
7. Código está dentro do escopo da task — sem funcionalidade extra não aprovada
8. Logs e tratamento de erro adequados para o pipeline Azure Functions
9. QA revisou cobertura de testes e cenários de falha do Discovery no PR

**Se aprovar:**
- TL faz merge do PR na branch de staging/main
- CI/CD executa pipeline completo pós-merge
- QA inicia validação final dos testes para Gate 4

**Se reprovar:**
1. TL documenta comments no PR — específico e acionável
2. Dev resolve os comentários no mesmo branch
3. Dev solicita re-review via GitHub
4. Merge bloqueado automaticamente pela branch protection rule
5. DM monitora: se review travar por mais de 24h, escala para o gestor

> 🔒 **BLOQUEANTE** — merge impedido por branch protection

---

### GATE 4 — Testes gerados por IA → Deploy — Suficiência de Testes

**Quem aprova:**
- QA (approver primário) — sign-off de qualidade
- Tech Lead (autoriza deploy) — supervisiona CD
- Product Specialist (sign-off) — valida smoke test do fluxo principal

**SLA:** variável por escopo (ver tabela abaixo)  
**Threshold:** ≥ 80% cobertura nas camadas de serviço

**O que verifica:**
1. Todos os cenários de falha mapeados no Discovery estão cobertos *(obrigatório)*
2. Testes de integração passando — incluindo mock de Azure AI Search *(obrigatório)*
3. Casos de alucinação e chunks contraditórios testados (Anexo B) *(obrigatório)*
4. Cobertura de testes ≥ 80% nas camadas de serviço *(obrigatório)*
5. Nenhum teste e2e crítico falhando *(obrigatório)*
6. Testes gerados pela IA foram revisados por humano
7. Smoke test manual executado em staging pelo QA
8. Product Specialist validou comportamento funcional via demo ou painel web

**Se aprovar:**
- TL autoriza e supervisiona pipeline de CD
- Dev Pleno acompanha como observador — aprende o processo
- DM gera release notes e comunicado via Claude Cowork
- QA executa smoke test pós-deploy em produção
- DM comunica stakeholders NovaTech

**Se reprovar:**
1. QA documenta testes faltantes ou falhos com precisão
2. Dev escreve os testes faltantes ou corrige os falhos
3. Deploy bloqueado — TL e DM notificados imediatamente
4. DM re-alinha prazo de deploy com stakeholders NovaTech

> 🔒 **BLOQUEANTE** — deploy impedido. TL e DM notificados

---

## SLAs por Escopo de Entrega

> **Decisão de design:** SLA fixo é inadequado para escopos variáveis. O DM classifica o escopo no início de cada ciclo e registra no board qual SLA se aplica.

| Escopo | Critério | Gate 1 | Gate 2 | Gate 3 | Gate 4 |
|--------|----------|--------|--------|--------|--------|
| 🟢 Pequeno | 1–3 req · até 5 tasks | 4h úteis | 2h úteis | 8h úteis | 2h úteis |
| 🟡 Médio | 4–8 req · 6–15 tasks | 1 dia útil | 4h úteis | 24h úteis | 4h úteis |
| 🔴 Grande | 9+ req · 16+ tasks | 2 dias úteis | 1 dia útil | 48h úteis | 8h úteis |

**Responsável pela classificação:** Delivery Manager, antes do início do ciclo.

---

## Decisões tomadas durante a conversa

### 1. SLAs originais vieram do arquivo da conversa anterior
Os valores de SLA usados como base (1 dia, 4h, 24h, 4h) vieram diretamente do arquivo `1-conversa-workflow-ai-first.md`, seção "Validation Gates — Checkpoints Humanos". Não foram criados do zero.

### 2. SLAs alterados para modelo variável por escopo
**Problema:** SLA fixo não reflete a realidade — uma spec de 2 requisitos e uma de 20 não têm o mesmo custo de review.  
**Decisão:** Modelo de 3 níveis (Pequeno / Médio / Grande) com critérios explícitos de classificação. DM é responsável pela classificação antes do ciclo começar.

### 3. Checklist interativo com exportação para PDF
O template foi construído como HTML interativo com:
- Checklist com checkboxes clicáveis e contagem de progresso por gate
- Seletor de status por gate (Pendente / Aprovado / Reprovado)
- Campos de assinatura com data por aprovador
- Barra de classificação de escopo que atualiza todos os SLAs dinamicamente
- Botão "Exportar PDF" que captura o estado atual da página e gera arquivo datado

---

## Artefatos gerados

| Artefato | Arquivo |
|----------|---------|
| Checklist interativo de Validation Gates | `validation-gates-checklist-novatech.html` |
| Esta conversa | `2-conversa-validation-gates-checklist.md` |
