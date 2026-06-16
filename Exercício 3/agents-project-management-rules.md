# Project Management Rules

> **Audiência:** Esta seção é lida por agentes de IA ao gerar artefatos de gestão, tasks, issues ou documentação do projeto.  
> **Autoridade:** Regras aqui definidas têm precedência sobre convenções genéricas. Em caso de conflito, siga este documento.

---

## 1. Nomenclatura de Tasks e Issues

### 1.1 Formato do título

```
[TIPO] [MÓDULO] — <descrição imperativa em inglês>
```

**Exemplos válidos:**
```
[FEAT] pipeline-ingestao — Implement document chunking with table detection
[FIX] query-endpoint — Handle empty search result from Azure AI Search
[TEST] teams-bot — Add integration test for fallback response
[DOCS] feedback-api — Write OpenAPI spec for POST /feedback
[INFRA] painel-web — Add Bicep module for Static Web App deployment
[ADR] global — Document decision on contradiction handling strategy
```

### 1.2 Tipos permitidos

| Tipo | Uso |
|------|-----|
| `FEAT` | Nova funcionalidade ou comportamento |
| `FIX` | Correção de bug ou comportamento incorreto |
| `TEST` | Criação ou ajuste de testes automatizados |
| `DOCS` | Documentação, specs, runbooks, ADRs |
| `INFRA` | Infraestrutura como código (Bicep), CI/CD, configuração |
| `REFACTOR` | Reestruturação sem mudança de comportamento |
| `ADR` | Registro de decisão arquitetural |
| `CHORE` | Tarefas de manutenção sem impacto funcional direto |

### 1.3 Módulos permitidos no título

Use o slug exato da pasta em `/specs/`:

| Módulo | Slug obrigatório |
|--------|-----------------|
| Pipeline de ingestão | `pipeline-ingestao` |
| API de busca | `query-endpoint` |
| API de feedback | `feedback-api` |
| Bot do Teams | `teams-bot` |
| Painel web | `painel-web` |
| Sem módulo específico | `global` |

### 1.4 Labels obrigatórias

Toda task/issue deve conter **pelo menos** as seguintes labels:

| Dimensão | Labels disponíveis | Obrigatória? |
|----------|--------------------|-------------|
| **Módulo** | `pipeline-ingestao`, `query-endpoint`, `feedback-api`, `teams-bot`, `painel-web`, `global` | ✅ Sim |
| **Fase SDD** | `sdd:requirements`, `sdd:plan`, `sdd:tasks`, `sdd:implementation` | ✅ Sim |
| **Tipo** | `feat`, `fix`, `test`, `docs`, `infra`, `refactor`, `adr`, `chore` | ✅ Sim |
| **Prioridade** | `priority:high`, `priority:medium`, `priority:low` | ✅ Sim |
| **Status** | `status:todo`, `status:in-progress`, `status:blocked`, `status:done` | ✅ Sim |
| **Responsável** | `role:tech-lead`, `role:dev-senior`, `role:dev-pleno`, `role:qa`, `role:product-specialist`, `role:delivery-manager` | ✅ Sim |

### 1.5 Corpo da task (estrutura mínima)

Agentes devem gerar tasks com o seguinte template:

```markdown
## Contexto
<por que esta task existe — referência à spec ou ADR de origem>

## Critérios de aceitação
- [ ] <critério mensurável 1>
- [ ] <critério mensurável 2>

## Dependências
- Bloqueada por: <ID da task bloqueante, se houver>
- Bloqueia: <ID da task dependente, se houver>

## Referências
- Spec: `specs/<slug>/tasks.md`
- ADR: `docs/adr/<ADR-XXXX>.md` (se aplicável)
```

---

## 2. Documentação de Decisões (ADRs)

### 2.1 Regra geral

**Toda decisão técnica ou de escopo deve ser registrada como ADR em `/docs/adr/`.** Não há exceções. Uma decisão não documentada é considerada não tomada para fins de rastreamento.

### 2.2 Gatilhos obrigatórios para criação de ADR

Um agente deve criar ou sinalizar a necessidade de um ADR sempre que identificar:

- Escolha entre duas ou mais alternativas de tecnologia, biblioteca ou serviço
- Mudança de arquitetura em relação ao que está descrito em ADR existente
- Decisão de escopo que afete mais de um módulo
- Definição de comportamento em cenário de falha ou ambiguidade de negócio
- Qualquer desvio do que foi definido na Fase 1 (Discovery)

### 2.3 Nomenclatura do arquivo

```
ADR-XXXX-<slug-descritivo>.md
```

**Exemplos:**
```
ADR-0001-llm-model-selection.md
ADR-0004-chunking-strategy-tables.md
ADR-0005-feedback-loop-architecture.md
```

O número `XXXX` é sequencial. O próximo ADR disponível é `ADR-0005` (ADRs 0001–0004 foram criados no Discovery).

### 2.4 Template obrigatório

```markdown
# ADR-XXXX — <Título em inglês>

**Data:** YYYY-MM-DD  
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXXX  
**Decisores:** <papéis envolvidos>  
**Módulos afetados:** <slugs>

## Contexto
<Situação que motivou a decisão>

## Decisão
<O que foi decidido e por quê>

## Alternativas consideradas
| Alternativa | Prós | Contras |
|-------------|------|---------|

## Consequências
<Impactos positivos e negativos esperados>

## Referências
<Links, specs ou outros ADRs relacionados>
```

### 2.5 Status de ADRs existentes

Agentes não devem modificar ADRs com status `Accepted` sem aprovação explícita do Tech Lead. Para superseder, crie um novo ADR referenciando o anterior.

---

## 3. Validation Gates

Agentes devem verificar e sinalizar o status dos gates antes de gerar artefatos de fase subsequente.

### Gate 1 — Discovery → Especificação

**Pré-condição para gerar qualquer spec SDD (`requirements.md`, `plan.md`, `tasks.md`).**

```yaml
gate: G1-discovery-to-spec
status: PASSED  # NovaTech: aprovado — Discovery concluído
checklist:
  - id: G1-01
    description: ADRs de decisões arquiteturais existem e têm status Accepted
    owner: tech-lead
    verified: true
  - id: G1-02
    description: Protótipo funcional executado e resultados documentados
    owner: tech-lead
    verified: true
  - id: G1-03
    description: Cenários de falha mapeados pelo QA
    owner: qa
    verified: true
  - id: G1-04
    description: Stack e estrutura do repositório definidos
    owner: tech-lead
    verified: true
  - id: G1-05
    description: Base documental validada (847 docs, 12 pendentes de Compliance)
    owner: product-specialist
    verified: true
```

### Gate 2 — Especificação → Implementação

**Pré-condição para qualquer commit de código de funcionalidade (`src/`) ou criação de PR de implementação.**

```yaml
gate: G2-spec-to-implementation
checklist:
  - id: G2-01
    description: requirements.md aprovado pelo Product Specialist
    owner: product-specialist
    artifact: specs/<slug>/requirements.md
  - id: G2-02
    description: plan.md aprovado pelo Tech Lead
    owner: tech-lead
    artifact: specs/<slug>/plan.md
  - id: G2-03
    description: tasks.md revisado pelo Dev responsável com apoio do Copilot
    owner: dev
    artifact: specs/<slug>/tasks.md
  - id: G2-04
    description: AGENTS.md atualizado se o módulo introduz nova skill ou comportamento esperado
    owner: tech-lead
    artifact: AGENTS.md
  - id: G2-05
    description: ADR criado para cada decisão técnica nova identificada na spec
    owner: tech-lead
    artifact: docs/adr/ADR-XXXX-*.md
  - id: G2-06
    description: Testes de contrato ou fixtures de teste definidos em /tests/fixtures/
    owner: qa
    artifact: tests/fixtures/<slug>/
```

### Gate 3 — Implementação → Deploy

**Pré-condição para merge do PR de implementação e publicação em ambiente.**

```yaml
gate: G3-implementation-to-deploy
checklist:
  - id: G3-01
    description: Todos os testes unitários passando (vitest)
    owner: dev
    command: npm run test:unit
  - id: G3-02
    description: Testes de integração passando
    owner: qa
    command: npm run test:integration
  - id: G3-03
    description: PR revisado e aprovado pelo Tech Lead
    owner: tech-lead
  - id: G3-04
    description: Sem secrets ou credenciais hardcoded no código
    owner: tech-lead
  - id: G3-05
    description: Runbook de operação criado ou atualizado em /docs/runbooks/
    owner: dev
    artifact: docs/runbooks/<slug>.md
  - id: G3-06
    description: prompt-changelog.md atualizado se system prompt foi modificado
    owner: tech-lead
    artifact: prompts/prompt-changelog.md
```

### Comportamento esperado do agente em relação aos gates

```
SE gate não passou:
  → Sinalize o gate bloqueante com os itens pendentes
  → NÃO gere artefatos da fase subsequente
  → Gere uma task [CHORE] para resolução dos itens pendentes

SE gate passou:
  → Registre no artefato gerado: "Gate G<N> verificado em <data>"
  → Prossiga com a geração
```

---

## 4. Restrições de Comunicação e Geração de Artefatos

### 4.1 Idioma por tipo de artefato

| Artefato | Idioma obrigatório |
|----------|--------------------|
| Código-fonte (`/src/`) | Inglês |
| Comentários e docstrings no código | Inglês |
| Nomes de variáveis, funções, classes | Inglês |
| Commits (mensagem) | Inglês |
| Specs SDD (`requirements.md`, `plan.md`, `tasks.md`) | Português |
| ADRs | Inglês (título e campos técnicos), Português (contexto e decisão) |
| Documentos de status e relatórios | **Português** |
| Runbooks operacionais | Português |
| AGENTS.md | Português (seções de contexto e regras), Inglês (exemplos de código) |
| Mensagens de erro expostas ao usuário final (atendente NovaTech) | Português |
| Logs internos e mensagens de sistema | Inglês |

### 4.2 Tom e formato por audiência

| Documento | Audiência | Tom esperado |
|-----------|-----------|--------------|
| Relatórios de status | Delivery Manager, cliente NovaTech | Executivo, objetivo, sem jargão técnico |
| Specs SDD | Time técnico | Técnico, preciso, sem ambiguidade |
| ADRs | Tech Lead, futuro time de manutenção | Analítico, com raciocínio explícito |
| Tasks | Agentes de IA e desenvolvedores | Imperativo, critérios de aceitação mensuráveis |
| Runbooks | Qualquer pessoa operando o sistema | Passo-a-passo, sem pressupostos de contexto |

### 4.3 O que agentes NÃO devem fazer ao gerar artefatos

- Criar ADRs com status `Accepted` sem marcação explícita de aprovação humana — use `Proposed`
- Modificar `system-prompt.md` sem criar entrada correspondente em `prompt-changelog.md`
- Gerar tasks sem referência à spec de origem (`specs/<slug>/tasks.md`)
- Criar arquivos fora da estrutura de diretórios definida no Anexo C
- Incluir dados reais de clientes, CPFs, placas ou cargas nos fixtures de teste — use dados sintéticos baseados no Anexo A
- Marcar um Gate como `PASSED` sem verificar todos os itens do checklist

### 4.4 Referência cruzada obrigatória

Todo artefato gerado deve referenciar sua origem:

```markdown
<!-- Gerado por agente em: YYYY-MM-DD -->
<!-- Gate verificado: G<N> -->
<!-- Spec de origem: specs/<slug>/tasks.md -->
<!-- ADR relacionado: docs/adr/ADR-XXXX-*.md -->
```

---

*Seção mantida pelo: Delivery Manager + Tech Lead*  
*Última atualização: 16/06/2026*  
*Versão: 1.0.0*
