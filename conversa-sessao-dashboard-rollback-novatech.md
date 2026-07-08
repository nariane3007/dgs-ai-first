# Conversa — Cenário 3 NovaTech (Dashboard de Go-Live e Plano de Rollback)

---

## Turno 1 — Usuário

Colou o conteúdo (continuação do cenário 3: documentos de apoio, estado atual do projeto, descobertas, desafio da fase e conceitos-chave) e pediu:

> "salve estas informações, vamos usá-las no exercício."

## Turno 1 — Assistente

Salvou o conteúdo no arquivo `cenario-3-contexto.md`.

---

## Turno 2 — Usuário

Enviou o trecho sobre o framework de harness (5 camadas: Tool orchestration, Verification loops, Context & memory, Guardrails, Observability) e pediu:

> "Slave também" (salvar também)

## Turno 2 — Assistente

Adicionou a seção "Framework de harness (5 camadas)" ao mesmo arquivo `cenario-3-contexto.md`.

---

## Turno 3 — Usuário

"agora salve no projeto"

## Turno 3 — Assistente

Explicou que a base de conhecimento do projeto está montada como somente leitura nesta sessão, então não é possível gravar diretamente nela. Sugeriu que o arquivo `cenario-3-contexto.md` já salvo fosse baixado e enviado manualmente à aba de conhecimento do projeto no Claude.ai.

---

## Turno 4 — Usuário

"baixe o aqrquivo"

## Turno 4 — Assistente

Disponibilizou o arquivo `cenario-3-contexto.md` para download.

---

## Turno 5 — Usuário

Enviou o arquivo `conversa-cenario-3-novatech.md` (histórico de uma conversa anterior, contendo os critérios de go-live definidos por camada do harness) e pediu:

> "crie um dashboard de readiness do go-live mostrando o status de cada critério (verde/amarelo/vermelho), responsável, e data-alvo."

## Turno 5 — Assistente

Leu o arquivo enviado, extraiu os 16 critérios bloqueantes e 9 desejáveis organizados pelas 5 camadas do harness, e construiu o arquivo `dashboard-readiness-go-live-novatech.html`: um dashboard visual com cartões-resumo (2 verdes, 2 amarelos, 12 vermelhos entre os bloqueantes, readiness de 12,5%), barra de progresso, e uma tabela por camada com critério, classificação (bloqueante/desejável, com marcação HITL), status, responsável e data-alvo. Como a conversa original não definia responsável nem prazo por item, usou papéis de equipe e datas ilustrativas anteriores à demo (22/07) como sugestão, deixando isso explícito no próprio dashboard.

---

## Turno 6 — Usuário

> "Defina um plano de rollback simples: qual o sinal de que algo deu errado, quem decide desligar, e qual a ação."

## Turno 6 — Assistente

Respondeu diretamente no chat com uma tabela de plano de rollback com 4 cenários de sinal (rejeição de schema acima do limiar, falha de groundedness em lote, incidente de dado sensível exposto, fila HITL atrasada), o responsável pela decisão em cada caso, e a ação correspondente. Fechou com a regra geral de que qualquer sinal isolado já basta para desligar, e que a ação é sempre reversível, sem downtime total.

---

## Turno 7 — Usuário

"gere o Plano em .MD"

## Turno 7 — Assistente

Gerou o arquivo `plano-rollback-novatech.md` com o conteúdo completo do plano de rollback e disponibilizou para download.

---

## Turno 8 — Usuário

"salve a nossa conversa em .md"

## Turno 8 — Assistente

Gerou este arquivo (`conversa-sessao-dashboard-rollback-novatech.md`) com o histórico desta sessão.
