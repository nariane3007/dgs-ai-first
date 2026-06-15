# Registro de Sessão — Spec Tracking Board · NovaTech Assistant

**Data:** 15/06/2026
**Projeto:** NovaTech Assistant
**Fase:** Fase 2 — Estruturação
**Ferramenta utilizada:** Claude (Cowork mode)
**Papel simulado:** Gerente de Projeto / Desenvolvedor de Ferramentas Internas

---

## Objetivo da sessão

Criar um board de tracking interativo (HTML) para acompanhar o status das specs SDD do projeto NovaTech Assistant, cobrindo os 5 módulos × 3 artefatos (requirements, plan, tasks) ao longo do fluxo: Rascunho → Em Revisão → Aprovada → Em Implementação → Validada.

---

## Artefatos gerados

| Artefato | Caminho |
|---|---|
| Board de tracking interativo | `outputs/2-spec-tracking-board.html` |
| Este registro de sessão | `outputs/2-conversa-spec-tracking-board.md` |

---

## Contexto de entrada

O usuário forneceu dois arquivos da sessão anterior:

- `1-conversa-governanca-specs.md` — registro da sessão de governança de specs
- `1-spec-governance.md` — documento de governança gerado na sessão anterior

Claude leu ambos os arquivos para extrair: módulos e slugs, artefatos por módulo, responsáveis, Gates de aprovação (Gate 1 = 1 dia útil, Gate 2 = 4h úteis) e checklists de cada Gate.

---

## Interações e prompts

### Prompt 1 — Criar board de tracking

**Enviado:**
```
com base nesta conversa anexada
crie um board de tracking (template de kanban ou tabela) que permita acompanhar o status de
cada spec: Rascunho → Em Revisão → Aprovada → Em Implementação → Validada.
Inclua os 5 módulos como itens iniciais.
```

*(Após solicitação de anexo, o usuário enviou os dois arquivos listados acima.)*

**Resposta do Claude:**
Leu os dois arquivos, identificou os 5 módulos com slugs e os 3 artefatos por módulo. Gerou um board HTML interativo com:
- 5 colunas Kanban (Rascunho → Validada)
- 15 cards (5 módulos × 3 artefatos), todos iniciando em Rascunho
- Cor de borda por módulo, chips de responsável/aprovador/gate
- Barra de progresso geral
- Drag & drop entre colunas
- Duplo clique para avançar etapa
- Filtro por módulo
- Persistência via `localStorage`
- Shift+R para reset

**Evidência de uso:**
Claude leu ambos os arquivos em paralelo para extrair os dados dos módulos e checklists, sem necessidade de o usuário reexplicar o projeto. Gerou o arquivo HTML completo em uma única operação de escrita.

---

### Prompt 2 — Adicionar SLA

**Enviado:**
```
incluir no card o tempo que falta para estourar o SLA
```

**Resposta do Claude:**
Identificou os SLAs nos Gates do `spec-governance.md`:
- Gate 1 (requirements.md e plan.md): **1 dia útil = 8h úteis**
- Gate 2 (tasks.md): **4 horas úteis**

Adicionou ao board:
- Cronômetro aparece **apenas na coluna "Em Revisão"**
- Conta somente horas úteis (seg–sex, 9h–18h)
- Barra de cor dinâmica: verde (>50% restante) → amarelo (risco) → vermelho (estourado)
- Card pulsa quando SLA estourado
- Timestamp registrado ao entrar em "Em Revisão"
- Auto-refresh a cada 60 segundos

**Decisões tomadas pelo Claude (inferidas):**
- Horário comercial definido como 9h–18h (8h por dia útil) — não estava explícito no documento
- Cor da barra: verde/amarelo/vermelho baseado em percentual consumido (>50%, 25–50%, <0)

**Evidência de uso:**
Claude extraiu os tempos limite diretamente do texto dos Gates (seção 5 do spec-governance.md) sem que o usuário precisasse informar os valores. Aplicou as alterações via edits pontuais, sem reescrever o arquivo inteiro.

---

### Prompt 3 — Abrir card com arquivo e checklist

**Enviado:**
```
permitir abrir o card e dele conseguir acessar o arquivo a ser validado
e tambem direcionar para o checklista para fazer a validação
```

**Resposta do Claude:**
Reescreveu o board com um painel lateral (drawer) que abre ao clicar em qualquer card. O drawer contém:

**Seção Arquivo:**
- Caminho relativo do spec (ex: `specs/pipeline-ingestao/requirements.md`)
- Botão "Copiar caminho"
- Botão "Abrir arquivo" que monta link `file://` com base no caminho do repositório configurado
- Botão ⚙ Repositório no header para configurar a raiz local do projeto

**Seção Checklist de validação:**
- Checklist específico por artefato, extraído do `spec-governance.md`:
  - `requirements.md` → Gate 1 (6 itens)
  - `plan.md` → Revisão de Plan (7 itens — derivado da seção 4.2)
  - `tasks.md` → Gate 2 (7 itens)
- Checkboxes interativos com persistência por card no `localStorage`
- Barra de progresso (X/N checks)
- Mini-progresso visível no próprio card

**Botão de avanço:**
- Move o card para a próxima coluna direto do drawer
- Fica verde quando todos os checks estão marcados

**Decisões tomadas pelo Claude (inferidas):**
- Checklist de `plan.md` não existia no documento — Claude derivou 7 itens a partir do conteúdo mínimo descrito na seção 4.2 do spec-governance.md, sinalizando a origem
- Atalho Esc para fechar o drawer

**Evidência de uso:**
Claude criou o checklist do `plan.md` a partir de conteúdo descritivo (não tabular) do documento, adaptando as exigências de conteúdo em critérios verificáveis. Manteve rastreabilidade entre cada item do checklist e a seção de origem.

---

### Prompt 4 — Versionamento de specs alteradas pós-implementação

**Enviado:**
```
Caso uma Spec seja alterada após a implementação, sugiro que seja criado um
versionamento dela, o que acha?
```

**Resposta do Claude:**
Antes de implementar, avaliou o que o processo já cobre:
- Seção 7.2 do spec-governance.md: mudança pós-implementação exige issue no Azure DevOps + PR + re-aprovação
- Seção 7.3: `requirements.md` em produção não é editado — é substituído por nova iteração
- Git já funciona como versionador via commits semânticos

Identificou o que o Git **não resolve sozinho**: visibilidade rápida no board de que a spec está na "rev 2" sem precisar abrir o repositório.

Sugeriu: adicionar **contador de revisões no board** (quando card volta de impl/aprovada para revisão), em vez de alterar a convenção de nomenclatura de arquivos — mais leve e sem quebrar o processo existente.

Usuário confirmou: `sim`.

**Evidência de uso:**
Claude não implementou diretamente ao ser questionado — primeiro avaliou o que o processo existente já cobre, distinguiu o que faltava e propôs uma solução proporcional antes de agir.

---

### Prompt 5 — Implementar versionamento

**Enviado:**
```
sim
```

**Resposta do Claude:**
Implementou o sistema de revisões com edits pontuais no arquivo existente:

**No card:**
- Badge `rev 2`, `rev 3`... aparece quando a spec retorna a "Em Revisão" vinda de Aprovada ou posterior
- Roxo para rev 2, vermelho (`.hot`) para rev 3 em diante

**No drawer — seção "Histórico de revisões":**
- Linha do tempo com cada rodada de revisão
- Cada evento mostra: número da revisão, de onde voltou, data/hora, e motivo (se informado)
- Rev 1 = revisão inicial (sempre presente)

**Botão "↩ Reabrir spec para revisão":**
- Visível quando card está em Aprovada, Em Implementação ou Validada
- Campo de texto para registrar o motivo da reabertura (alinhado com commit semântico `spec(slug): update — motivo`)
- Ao confirmar, move o card e registra o evento no histórico

**Lógica de disparo:**
- Retorno de `rascunho` ou `revisao` → `revisao` = não conta revisão (fluxo normal)
- Retorno de `aprovada`, `impl` ou `validada` → `revisao` = nova revisão registrada

**Evidência de uso:**
Claude aplicou 7 edits pontuais (CSS, constantes, storage, moveCard, buildCard, HTML do drawer, refreshDrawer) sem reescrever o arquivo. Manteve consistência com o processo de governança existente ao alinhar o campo "motivo" com a convenção de commit semântico já definida no `spec-governance.md`.

---

## Padrões de uso identificados nesta sessão

| Padrão | Exemplo |
|---|---|
| **Leitura paralela de contexto** | Prompt 1: leu os dois arquivos simultaneamente para extrair módulos, artefatos e Gates antes de gerar qualquer código |
| **Inferência rastreável** | Prompt 3: sinalizou que o checklist de `plan.md` foi derivado da seção 4.2, não de um Gate explícito |
| **Avaliação antes de execução** | Prompt 4: avaliou o que o processo já cobre antes de implementar o versionamento |
| **Edits pontuais em vez de reescrita** | Prompts 2 e 5: adicionou features via edits cirúrgicos no arquivo existente |
| **Consistência com artefatos existentes** | Prompt 5: alinhou o campo "motivo" do versionamento com a convenção de commit semântico já definida no spec-governance.md |
| **Iteração incremental** | 5 prompts curtos construíram o board progressivamente, cada um adicionando uma camada de funcionalidade |

---

## Decisões tomadas e justificativas

| Decisão | Origem | Justificativa |
|---|---|---|
| SLA de requirements e plan = 8h úteis | Gate 1 do spec-governance.md | Tempo limite explícito: "1 dia útil após entrega" |
| SLA de tasks = 4h úteis | Gate 2 do spec-governance.md | Tempo limite explícito: "4 horas úteis após entrega" |
| Horário comercial 9h–18h | Inferência do Claude | Não estava no documento; padrão brasileiro de jornada comercial |
| Checklist de plan.md com 7 itens | Derivado da seção 4.2 | Gate explícito só existe para requirements (Gate 1) e tasks (Gate 2); plan foi derivado pelo Claude |
| Versionamento no board, não nos arquivos | Avaliação do Claude + decisão do usuário | Git já versiona os arquivos; o board adiciona visibilidade sem duplicar responsabilidade |
| Motivo da reabertura alinhado a commit semântico | spec-governance.md seção 6 | Coerência com processo existente de rastreamento por git log |
| Revisão dispara apenas de `aprovada`/`impl`/`validada` | Lógica do processo | Voltar de `rascunho` para `revisao` é fluxo normal, não uma revisão de escopo |

---

## Conteúdo final do artefato gerado

O arquivo `2-spec-tracking-board.html` cobre:

1. **Board Kanban** com 5 colunas e 15 cards (5 módulos × 3 artefatos)
2. **SLA visual** por card em "Em Revisão", contando apenas horas úteis
3. **Drawer lateral** com acesso ao arquivo (`file://` configurável) e checklist de Gate interativo
4. **Versionamento** com badge de revisão no card e linha do tempo no drawer
5. **Persistência completa** no `localStorage` (estado, SLA, checks, revisões, caminho do repositório)
6. **Drag & drop** para mover cards + botão de avanço no drawer

---

*Gerado em: 15/06/2026 — NovaTech Assistant — Fase 2 Estruturação*
