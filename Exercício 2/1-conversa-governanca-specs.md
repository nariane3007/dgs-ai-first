# Registro de Sessão — Governança de Specs NovaTech Assistant

**Data:** 15/06/2026
**Projeto:** NovaTech Assistant
**Fase:** Fase 2 — Estruturação
**Ferramenta utilizada:** Claude (claude.ai)
**Papel simulado:** Gerente de Projeto

---

## Objetivo da sessão

Definir o processo de governança de specs SDD do projeto NovaTech Assistant, cobrindo: responsáveis por cada artefato, nomenclatura, localização no repositório e rastreamento de mudanças. O artefato final (`docs/spec-governance.md`) é destinado a ser commitado diretamente no repositório.

---

## Artefatos gerados

| Artefato | Caminho no repositório |
|---|---|
| Processo de Governança de Specs | `docs/spec-governance.md` |

---

## Interações e prompts

### Prompt 1 — Carregar contexto SDD e módulos

**Enviado:**
```
carregar estes dados no projeto

[bloco markdown com fluxo SDD, lista de módulos e referência ao Anexo C]
```

**Resposta do Claude:**
Carregou os dados na memória persistente do projeto (memory_user_edits). Confirmou o mapeamento de módulos para slugs de pasta e sinalizou que o Anexo C ainda não havia sido carregado.

**Evidência de uso:**
Claude utilizou a ferramenta `memory_user_edits` para persistir o contexto entre sessões, reconhecendo proativamente que faltava o Anexo C.

---

### Prompt 2 — Carregar Anexo C (estrutura do repositório)

**Enviado:**
```
[upload do arquivo anexo-c-estrutura-repositorio.md]
```

**Resposta do Claude:**
Leu o arquivo, atualizou a memória com a estrutura completa do repositório (slugs, diretórios, MCP servers) e apresentou tabela de mapeamento módulo → pasta.

**Evidência de uso:**
Claude integrou automaticamente o conteúdo do upload com o contexto já existente na memória, sem necessidade de reexplicar o projeto.

---

### Prompt 3 — Gerar documento de governança

**Enviado:**
```
Como um gerente de projeto, com base nos documentos anexados e nos textos fornecidos anteriormente,
defina um processo de governança de specs que cubra: quem cria cada tipo de spec
(requirements pelo Product Specialist, plan pelo Tech Lead, tasks pelo Dev com apoio do Copilot),
como as specs são nomeadas e versionadas, onde ficam no repositório, e como mudanças são rastreadas.
```

**Resposta do Claude:**
Gerou o documento `spec-governance.md` com 9 seções cobrindo: visão geral, módulos e pastas, responsáveis, conteúdo mínimo de cada artefato, fluxo de aprovação via PR, versionamento via Git, rastreamento de mudanças, checklist de qualidade e relação com outros artefatos.

**Decisões tomadas pelo Claude (inferidas, não documentadas na fonte):**
- Formato de task com campos `Arquivo`, `Depende de`, `Estimativa`, `O que fazer` e `Critério de done`
- Aprovação via PR (não estava nos documentos fornecidos)
- IDs de task com prefixo de módulo (`TASK-QUERY-01`)

**Evidência de uso:**
Claude adotou o papel de Gerente de Projeto explicitamente solicitado, estruturou o documento em seções coesas e já criou o arquivo diretamente no diretório de outputs.

---

### Prompt 4 — Questionar origem do formato de task

**Enviado:**
```
como definiu o formato de cada tarefa?
```

**Resposta do Claude:**
Reconheceu que o formato foi inferência própria (não estava nos documentos fornecidos), explicou as três fontes usadas como base (fluxo SDD, estrutura do repositório, convenções comuns de projetos com Copilot) e propôs duas alternativas: apresentar variações para o Tech Lead escolher, ou aguardar um padrão definido para incorporar.

**Evidência de uso:**
Claude demonstrou rastreabilidade e transparência, distinguindo claramente o que veio dos documentos do que foi inferido — comportamento essencial para uso em contexto profissional.

---

### Prompt 5 — Adicionar campo Contexto na task

**Enviado:**
```
poderia incluir um contexto na tarefa para especificar o porquê está sendo feita,
qual o ganho dela para o cliente
```

**Resposta do Claude:**
Adicionou o campo `### Contexto` ao formato de task, posicionado antes de `### O que fazer`, com orientação de que o Dev deve responder: por que a tarefa existe, qual RF endereça e qual o ganho concreto para o atendente da NovaTech.

**Evidência de uso:**
Claude aplicou a alteração diretamente no arquivo existente via `str_replace`, sem reescrever o documento inteiro.

---

### Prompt 6 — Questionar origem da aprovação via PR

**Enviado:**
```
de onde foi tirado que as aprovações precisam ser feitas via PR?
```

**Resposta do Claude:**
Reconheceu novamente que foi inferência própria. Explicou que os documentos definem "checkpoint humano" mas não especificam o mecanismo. Sugeriu que a decisão seja tomada pelo Tech Lead junto com a Gerência de Projeto e ofereceu marcar o ponto como "a definir" ou aguardar a decisão.

**Evidência de uso:**
Segunda demonstração de rastreabilidade na mesma sessão — padrão consistente de distinguir fonte documentada de inferência.

---

### Prompt 7 — Substituir PR pelos Gates da atividade anterior

**Enviado:**
```
na atividade anterior criamos um checklist de aprovação, nesta vejo que pode colocar
o checklist no lugar do PR e deixar PR somente para aprovação de código
```

**Resposta do Claude:**
Buscou ativamente os Gates na conversa anterior usando `conversation_search`, recuperou os checklists dos Gates 1 e 2 com aprovadores, tempo limite e critérios, substituiu a seção 5 do documento pelos dois Gates, adicionou o item "Contexto preenchido" ao checklist do Gate 2 (consistência com a alteração anterior) e removeu a seção 8 de checklist de PR que havia se tornado redundante.

**Evidência de uso:**
Claude utilizou a ferramenta `conversation_search` para recuperar contexto de uma sessão anterior sem que o usuário precisasse reenviar o conteúdo, demonstrando continuidade de memória entre sessões.

---

### Prompt 8 — Salvar a conversa com evidências

**Enviado:**
```
Agora salve a nossa conversa, com todo prompt de interação, e a evidência do uso do Claude
```

**Resposta do Claude:**
Este documento.

---

## Padrões de uso identificados nesta sessão

| Padrão | Exemplo |
|---|---|
| **Papel explícito** | "Como um gerente de projeto" direcionou tom, estrutura e perspectiva do documento |
| **Rastreabilidade ativa** | Prompts 4 e 6 questionaram a origem de decisões — Claude distinguiu fonte de inferência |
| **Iteração incremental** | Prompts curtos adicionaram campo, substituíram seção, sem reescrever o documento |
| **Memória entre sessões** | Prompt 7 recuperou Gates de conversa anterior via `conversation_search` |
| **Transparência sobre limitações** | Claude sinalizou o que não estava nos documentos em vez de apresentar inferências como fatos |
| **Coerência entre alterações** | Ao substituir os Gates, Claude incluiu automaticamente o campo Contexto (adicionado no Prompt 5) no checklist do Gate 2 |

---

## Decisões tomadas e justificativas

| Decisão | Origem | Justificativa |
|---|---|---|
| Formato de task com campo Contexto | Solicitação do usuário (Prompt 5) | Garantir que o Dev entenda o valor de negócio antes de implementar |
| Aprovação de specs via Gates (não PR) | Gates definidos na atividade anterior | PRs são para código; Gates são checkpoints de artefatos — separação de responsabilidades |
| `requirements.md` aprovado em produção não é editado retroativamente | Decisão de PM do documento | Preserva histórico de intenção de negócio; escopo incremental vai para nova iteração |
| Commits semânticos para specs (`spec(slug): ação`) | Convenção criada nesta sessão | Rastreabilidade no `git log` sem depender de ferramentas externas |

---

## Conteúdo final do artefato gerado

O documento `spec-governance.md` cobre:

1. Visão geral do processo
2. Módulos e slugs das pastas em `/specs/`
3. Responsáveis por artefato (com quem aprova cada transição)
4. Conteúdo mínimo de `requirements.md`, `plan.md` e `tasks.md`
5. Fluxo de aprovação — Gate 1 e Gate 2 com checklists
6. Versionamento via Git (convenções de commit)
7. Rastreamento de mudanças (antes e depois do início da implementação)
8. Relação com outros artefatos do projeto (AGENTS.md, ADRs, prompts, skills, DevOps)

---

*Gerado em: 15/06/2026 — NovaTech Assistant — Fase 2 Estruturação*
