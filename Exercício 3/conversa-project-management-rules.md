# Registro de Sessão — Project Management Rules (AGENTS.md)

**Data:** 16/06/2026  
**Projeto:** NovaTech Assistant  
**Fase:** Fase 2 — Estruturação  
**Ferramenta utilizada:** Claude (claude.ai) — claude-sonnet-4-6  
**Papel simulado:** Gerente de Projeto  
**Artefato gerado:** `AGENTS.md > # Project Management Rules`  
**Arquivo de saída:** `agents-project-management-rules.md`

---

## Objetivo da sessão

Criar a seção `Project Management Rules` do `AGENTS.md` do projeto NovaTech Assistant. A seção deve ser consumível por agentes de IA ao gerar artefatos de gestão, tasks ou documentação, cobrindo quatro requisitos explícitos: nomenclatura de tasks/issues, documentação de decisões (ADRs), validation gates e restrições de comunicação.

---

## Artefatos gerados

| Artefato | Caminho no repositório |
|----------|------------------------|
| Project Management Rules (v1 + v1.1 corrigida) | `AGENTS.md` (seção) |
| Arquivo standalone para revisão | `agents-project-management-rules.md` |

---

## Interações

---

### Prompt 1 — Geração inicial da seção

**Papel:** Gerente de Projeto  
**Entrada:**

```
Como um gerente de projeto, com base no cenário a seguir [...] precisamos criar a seção
Project Management Rules será lida por agentes de IA quando gerarem artefatos de gestão,
tasks, ou documentação. Ela deve conter:

1. Regras de nomenclatura de tasks e issues (ex: formato do título, labels obrigatórias).
2. Regras de documentação de decisões (ex: toda decisão técnica ou de escopo deve ser
   registrada como ADR em `/docs/adr/`).
3. Definição dos validation gates em formato consumível por agentes.
4. Restrições de comunicação que afetam geração de artefatos (ex: "documentos de status
   devem ser em português, código e comments em inglês").
```

O prompt incluiu o cenário completo da Fase 2 como documento anexado, com todo o histórico de decisões da Fase 1 (stack, ADRs, arquitetura, time).

**Resposta do Claude:**

Claude buscou o contexto de sessões anteriores (`conversation_search`: "AGENTS.md NovaTech estrutura repositório") antes de gerar, recuperando o mapeamento de módulos → slugs e a estrutura do repositório (Anexo C) da memória do projeto.

Gerou a seção completa com 4 subseções:

- **1. Nomenclatura** — formato `[TIPO] [MÓDULO] — descrição`, tabela de tipos, slugs obrigatórios, 6 dimensões de labels, template de corpo de task
- **2. ADRs** — gatilhos obrigatórios para criação, nomenclatura `ADR-XXXX-slug.md`, template completo, regra de não-modificação de ADRs `Accepted`
- **3. Gates** — 3 gates em YAML estruturado (G1 já com `status: PASSED`, G2 e G3 com checklists por `id/owner/artifact`), comportamento esperado do agente
- **4. Restrições** — tabela idioma por artefato, tom por audiência, lista de proibições, referência cruzada obrigatória em todo artefato gerado

**Ferramentas usadas pelo Claude:**
- `conversation_search` — recuperação de contexto de sessões anteriores
- `create_file` — geração do arquivo de saída
- `present_files` — entrega do artefato

**Evidência de uso — padrões observados:**
- Claude recuperou os slugs exatos do Anexo C (memória do projeto) sem que o usuário os repetisse
- Gate 1 nasceu com `status: PASSED` porque Claude inferiu corretamente que o Discovery estava concluído
- Escolha de YAML para os gates foi deliberada — Claude justificou que agentes consomem YAML melhor que prosa para validação condicional

---

### Prompt 2 — Questionamento sobre origem das siglas

**Papel:** Gerente de Projeto  
**Entrada:**

```
de onde tirou as siglas?
```

**Resposta do Claude:**

Claude admitiu que as siglas (`FEAT`, `FIX`, `TEST`, `DOCS`, `INFRA`, `REFACTOR`, `CHORE`, `ADR`) vieram da convenção **Conventional Commits** — padrão de mercado amplamente adotado em projetos TypeScript/Node — sem que houvesse referência a essa convenção nos documentos do projeto.

Sinalizou o problema: a seção seria tratada por agentes como verdade do projeto, não como convenção genérica. Se o time ou a DB1 usa outra nomenclatura, os agentes gerariam artefatos inconsistentes.

Ofereceu duas alternativas:
1. Manter as siglas do Conventional Commits com nota explícita de fonte, para o time validar conscientemente
2. Deixar em aberto com placeholder para o Tech Lead definir antes do commit

**Evidência de uso — padrão observado:**
- Claude identificou proativamente o risco de impacto downstream (agentes gerando artefatos com convenção não validada) sem ser questionado sobre isso
- Não defensivo ao admitir a assunção — apresentou o problema e propôs caminhos objetivos

---

### Prompt 3 — Decisão sobre o placeholder

**Papel:** Gerente de Projeto  
**Entrada:**

```
2
```

Resposta de uma palavra — o usuário escolheu a opção 2 (placeholder).

**Resposta do Claude:**

Aplicou três mudanças cirúrgicas no arquivo existente via `str_replace`:

1. **Seção 1.2** — substituiu a tabela de tipos fixos por placeholder com aviso `⚠️ PENDENTE — Tech Lead`, indicando que precisa ser preenchida antes do commit e listando fontes possíveis sem escolher
2. **Exemplos do 1.1** — trocou os tipos reais (`FEAT`, `FIX`, etc.) por `[???]` para não induzir cópia
3. **Tabela de labels (1.4)** — removeu os tipos fixos e vinculou o preenchimento à seção 1.2

**Ferramentas usadas pelo Claude:**
- `view` — releitura do arquivo antes de editar (para garantir str_replace exato)
- `str_replace` × 2 — edições cirúrgicas sem reescrever o arquivo inteiro
- `present_files` — entrega da versão atualizada

**Evidência de uso — padrão observado:**
- Claude leu o arquivo antes de editar em vez de reescrever do zero — preservação do trabalho anterior
- As três mudanças foram consistentes entre si: o `[???]` nos exemplos, o placeholder na 1.2 e a remoção da label na 1.4 se reforçam mutuamente — nenhum agente consegue inferir os tipos por uma das seções se as outras também estão em aberto

---

## Padrões de uso do Claude identificados nesta sessão

| Padrão | Evidência |
|--------|-----------|
| **Recuperação de contexto entre sessões** | Slugs e estrutura do repositório foram buscados da memória do projeto sem repetição pelo usuário |
| **Inferência contextual correta** | Gate 1 gerado com `status: PASSED` por inferência do estado do Discovery |
| **Transparência sobre assunções** | Claude admitiu origem das siglas sem ser questionado diretamente sobre isso |
| **Identificação de risco downstream** | Sinalizou que convenção não validada causaria inconsistência nos artefatos gerados por agentes |
| **Edição cirúrgica** | Usou `str_replace` localizado em vez de reescrever o arquivo inteiro |
| **Consistência entre partes do documento** | As três mudanças do Prompt 3 se reforçam mutuamente — nenhuma seção contradiz outra |

---

## Decisões tomadas e justificativas

| Decisão | Origem | Justificativa |
|---------|--------|---------------|
| Gates em YAML estruturado | Claude (explicado na resposta) | Agentes consomem YAML melhor que prosa para validação condicional; cada item com `id/owner/artifact` permite filtrar por papel |
| Gate 1 com `status: PASSED` | Inferência do contexto | Discovery concluído — evita alarme falso por agentes ao processar o AGENTS.md |
| Tipos de task como placeholder | Decisão do usuário (Prompt 3) | Convenção não estava nos documentos do projeto; Tech Lead deve validar antes do commit |
| Proibições explícitas na seção 4 | Decisão de PM | Regras negativas ("não faça X") são mais acionáveis por agentes do que diretrizes positivas genéricas |
| Referência cruzada obrigatória em todo artefato | Decisão de PM | Rastreabilidade sem depender de ferramentas externas — qualquer agente lendo o artefato sabe sua origem |

---

## Pendências identificadas (ações para o time)

| # | Pendência | Responsável | Prazo sugerido |
|---|-----------|-------------|----------------|
| 1 | Definir tipos de task e siglas (seção 1.2 do artefato) | Tech Lead | Antes de commitar o AGENTS.md |
| 2 | Validar se as 6 dimensões de labels fazem sentido para o Azure DevOps configurado | Tech Lead + Delivery Manager | Antes de commitar o AGENTS.md |
| 3 | Confirmar se o template de corpo de task (seção 1.5) é compatível com o board do Azure DevOps | Delivery Manager | Antes de commitar o AGENTS.md |

---

*Gerado em: 16/06/2026 — NovaTech Assistant — Fase 2 Estruturação*
