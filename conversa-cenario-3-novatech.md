# Conversa — Cenário 3 NovaTech (Harness / Governança)

---

## Turno 1 — Usuário

**Arquivo enviado:** `cenario-3-contexto.md`

```markdown
## Documentos de apoio
- **Anexo A — Documentação Simulada da NovaTech:** Fonte de verdade para avaliação de respostas do assistente e design de guardrails.
- **Anexo B — Chunks de Referência do Pipeline de RAG:** Chunks e mapa de cobertura para testes de regressão e avaliação de retrieval.
- **Anexo C — Estrutura do Repositório:** Mapa de diretórios e convenções, relevante para exercícios de harness e revisão de código.

---

## O Cenário (continuação)

O assistente de IA da NovaTech está em desenvolvimento. O pipeline de RAG está funcional, os primeiros endpoints foram implementados, e o bot do Teams responde perguntas de teste. Mas antes do go-live, o time precisa garantir que o sistema é confiável e governável.

Esta fase usa os artefatos produzidos nas fases anteriores: as ADRs e o pipeline de RAG da fase de entendimento (cenário 1), e o AGENTS.md, as specs SDD, as skills e os guardrails da fase de estruturação (cenário 2). O harness que será trabalhado agora amarra tudo isso num sistema de governança.

### O que foi construído até agora

- O pipeline de ingestão processa 847 documentos e os indexa no Azure AI Search.
- O query endpoint recebe perguntas via POST, busca chunks, e retorna respostas com citação de fonte.
- O bot do Teams funciona em ambiente de staging, acessível por 5 atendentes-piloto.
- O AGENTS.md (construído pelo time no cenário 2), as specs SDD e as skills estão no repositório e sendo usadas pelo Copilot.
- Os guardrails de produto foram formalizados pelo Product Specialist (cenário 2) em DEVE / NÃO DEVE / QUANDO EM DÚVIDA.
- Testes de integração cobrem ~75% do código.

### O que foi descoberto durante o desenvolvimento

- Em testes internos, **12% das respostas estavam incorretas**: alucinação, documento desatualizado, e chunk incorreto recuperado.
- As respostas do assistente são retornadas como texto livre. Não há um formato estruturado garantindo que campos obrigatórios (fonte, confiança) sempre estejam presentes — quando o modelo "esquece" de incluir a fonte, nada impede a resposta de seguir.
- Um desenvolvedor gerou com o Copilot um módulo de feedback que ignorou regras do AGENTS.md (não usou Zod, logou dados sensíveis do atendente).
- A NovaTech pediu uma demonstração para a diretoria em 2 semanas.

### O desafio desta fase

O time precisa:
1. Reforçar o harness — o conjunto de verificações e limites que torna o assistente confiável, usando **structured outputs** (forçar o modelo a responder em formato validável) e **human-in-the-loop** (pontos onde um humano valida antes de prosseguir).
2. Aplicar revisão crítica ao que foi gerado por IA: código, respostas do assistente, testes.

### Conceitos-chave desta fase

- **Structured Outputs:** Em vez de deixar o modelo responder em texto livre, define-se um formato (JSON) que a resposta DEVE seguir, com campos obrigatórios (ex: `answer`, `source_document`, `confidence_score`). Respostas que não seguem o formato são rejeitadas programaticamente. Reduz campos faltantes e facilita a validação automática.
- **Human-in-the-Loop (HITL):** Pontos do fluxo onde a validação final é de um humano, não do modelo. O harness define onde HITL é obrigatório, com base no risco da decisão (ex: respostas de baixa confiança sobre temas sensíveis).

### Framework de harness (5 camadas)

1. **Tool orchestration** — coordenação de ferramentas e agentes.
2. **Verification loops** — verificação automática de outputs.
3. **Context & memory** — manutenção de contexto entre interações.
4. **Guardrails** — limites que o sistema não pode ultrapassar, incluindo pontos de human-in-the-loop.
5. **Observability** — visibilidade do que acontece em produção.
```

**Mensagem:** "carregue o arquivo"

---

## Turno 2 — Assistente

Confirmou o carregamento do arquivo e resumiu seu conteúdo: estado atual do projeto (pipeline de ingestão, query endpoint, bot do Teams em staging, AGENTS.md/specs/skills, guardrails formalizados, cobertura de testes ~75%), problemas descobertos (12% de respostas incorretas, ausência de formato estruturado, módulo do Copilot que violou o AGENTS.md, prazo de 2 semanas para demo), o desafio da fase (harness com structured outputs + HITL, revisão crítica) e as 5 camadas do framework de harness.

Observou que os Anexos A, B e C ainda não haviam sido enviados, e perguntou se o usuário queria trabalhar só com o contexto atual e qual seria a tarefa específica desta etapa.

---

## Turno 3 — Usuário

```markdown
defina critérios de go-live organizados pelas 5 camadas do harness. Para cada camada, especifique o que precisa estar pronto e classifique cada critério como **bloqueante** (sem isso não vai ao ar) ou **desejável** (pode ir ao ar sem). Inclua ao menos um ponto de human-in-the-loop (ex: respostas de baixa confiança sobre carga perigosa passam por revisão humana antes de chegar ao atendente)
```

---

## Turno 4 — Assistente

Produziu os **Critérios de Go-Live — NovaTech**, organizados pelas 5 camadas do harness (Tool Orchestration, Verification Loops, Context & Memory, Guardrails, Observability), cada uma com critérios classificados como **BLOQUEANTE** ou **DESEJÁVEL**, incluindo dois pontos de HITL em Guardrails (respostas de baixa confiança sobre temas sensíveis roteadas para revisão humana; código gerado por IA que toca dado sensível/guardrail exige revisão humana antes do merge). Fechou com uma nota ligando a dependência entre Verification Loops e Guardrails como prioridade antes da demo em 2 semanas.

*(Conteúdo completo replicado no Turno 8 abaixo e no arquivo `criterios-go-live-novatech.md`.)*

---

## Turno 5 — Usuário

Reenviou o mesmo texto do cenário (a seção "O Cenário" do Turno 1, sem os Anexos, o desafio e os conceitos-chave), com a introdução:

> "agora faça com base neste cenário"

---

## Turno 6 — Assistente

Observou que o texto era o mesmo cenário-base já enviado, mas que o pedido "faça com base neste cenário" não especificava qual artefato deveria ser produzido desta vez. Perguntou, via opções, qual artefato o usuário queria:
- Schema de structured output (JSON)
- Desenho do fluxo de HITL
- Revisão crítica do módulo de feedback do Copilot
- Outro (descrever)

---

## Turno 7 — Usuário

**Resposta selecionada:** "Outro (vou descrever)"

---

## Turno 8 — Assistente

Pediu para o usuário descrever o que precisava.

---

## Turno 9 — Usuário

```markdown
defina critérios de go-live organizados pelas 5 camadas do harness. Para cada camada, especifique o que precisa estar pronto e classifique cada critério como **bloqueante** (sem isso não vai ao ar) ou **desejável** (pode ir ao ar sem). Inclua ao menos um ponto de human-in-the-loop (ex: respostas de baixa confiança sobre carga perigosa passam por revisão humana antes de chegar ao atendente).
```

---

## Turno 10 — Assistente

Apontou que era o mesmo pedido já respondido no Turno 4, e reapresentou o conteúdo completo:

### Critérios de Go-Live — NovaTech (por camada do harness)

#### 1. Tool Orchestration
- **BLOQUEANTE** — Query endpoint só busca chunks no índice oficial do Azure AI Search (847 docs); nenhuma chamada a fonte não indexada/não auditada.
- **BLOQUEANTE** — Nenhuma ação automática de escrita (responder direto ao cliente final, disparar ticket) sem passar pelas camadas de verificação/guardrails — nesta fase o bot só orquestra leitura/consulta.
- **BLOQUEANTE** — Falha de ferramenta (ex: timeout do Azure AI Search) tem fallback definido (mensagem padrão ao atendente), nunca erro silencioso ou resposta inventada.
- **DESEJÁVEL** — Cache de buscas frequentes para reduzir latência.
- **DESEJÁVEL** — Orquestração multi-agente (ex: agente que reformula a pergunta antes da busca).

#### 2. Verification Loops
- **BLOQUEANTE** — Structured output obrigatório: toda resposta passa por validação de schema (`answer`, `source_document`, `confidence_score`); resposta que não valida é rejeitada programaticamente, nunca repassada como está.
- **BLOQUEANTE** — Suite de regressão re-executada e taxa de erro abaixo de um limiar definido (os 12% atuais não podem ir a produção — definir meta, ex: <5%).
- **BLOQUEANTE** — Verificação automática de *groundedness*: a resposta é checada contra o(s) chunk(s) citados em `source_document`, não basta citar uma fonte qualquer.
- **DESEJÁVEL** — LLM-as-judge como segunda camada, para priorizar a fila de revisão humana.
- **DESEJÁVEL** — Métrica automática de qualidade de citação.

#### 3. Context & Memory
- **BLOQUEANTE** — Isolamento de contexto por sessão/atendente — sem vazamento entre atendentes-piloto (relevante pelo incidente de log de dado sensível já ocorrido).
- **BLOQUEANTE** — Versionamento do índice: resposta reflete a versão vigente do documento-fonte (resolve a causa "documento desatualizado").
- **BLOQUEANTE** — Confidence score considera também idade/atualidade do chunk, não só similaridade semântica.
- **DESEJÁVEL** — Memória multi-turno na mesma conversa.
- **DESEJÁVEL** — Personalização por perfil de atendente.

#### 4. Guardrails
- **BLOQUEANTE** — Guardrails DEVE/NÃO DEVE aplicados como checagem programática (regra/schema), não só como instrução de prompt.
- **BLOQUEANTE** — Regras do AGENTS.md (ex: uso de Zod, proibição de logar dado sensível) verificadas em CI antes do merge — o incidente do módulo de feedback do Copilot não pode se repetir sem ser pego automaticamente.
- **BLOQUEANTE — HITL** — Respostas de baixa confiança sobre temas sensíveis/regulatórios (ex: carga perigosa) são roteadas para fila de revisão humana antes de chegar ao atendente; enquanto pendente, o atendente vê "aguardando validação", nunca uma resposta não verificada.
- **BLOQUEANTE — HITL** — Código gerado por IA que toca dado sensível ou lógica de guardrail passa por revisão humana obrigatória antes do merge, mesmo passando nos testes automatizados.
- **DESEJÁVEL** — Guardrails de tom/estilo de comunicação.

#### 5. Observability
- **BLOQUEANTE** — Todo request/response logado com os campos estruturados e timestamp, sem dado sensível no log.
- **BLOQUEANTE** — Alerta automático quando a taxa de respostas de baixa confiança/rejeitadas pelo schema ultrapassa um limiar.
- **BLOQUEANTE** — Trilha de auditoria das escalações HITL: quem revisou, o que mudou, quanto tempo levou — essencial para a demo à diretoria.
- **DESEJÁVEL** — Dashboard de tendência da taxa de alucinação.
- **DESEJÁVEL** — Monitoramento de custo por consulta.

Perguntou se o pedido era diferente disso (ex: documento formatado para entrega, ajuste de algum critério).

---

## Turno 11 — Usuário

"gere em Markdown"

---

## Turno 12 — Assistente

Gerou o arquivo `criterios-go-live-novatech.md` com o conteúdo completo dos critérios de go-live e apresentou o arquivo para download.

---

## Turno 13 — Usuário

"agora gere toda esta conversa em Markdow"

---

## Turno 14 — Assistente

Gerou este arquivo (`conversa-cenario-3-novatech.md`) com o histórico completo da conversa.
