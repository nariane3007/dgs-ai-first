# Conversa — Template de Relatório Semanal (NovaTech)

*Registro da conversa com Claude · Julho/2026*

---

## Pergunta 1

**Usuário:**
> com base nesta conversa [conversa-plano-observabilidade.md]: crie o template do relatório semanal para a NovaTech: 1 página com KPIs principais, tendência (melhorou/piorou), e ações planejadas.

**Claude:**

Perguntou em qual formato o usuário queria o template (Word, HTML visual ou Markdown).

**Usuário:** HTML visual.

**Claude:**

Gerou o arquivo `relatorio-semanal-novatech-template.html`, um template de 1 página seguindo o padrão visual DB1 (cores, tipografia e cards já usados em outros relatórios executivos DB1), com:

- **KPIs principais** (6 cards cobrindo as 4 dimensões do plano de observabilidade): feedback negativo dos atendentes, taxa de falha no retrieval, latência p95, volume de interações/dia, TMA e CSAT.
- **Tendência** por KPI: selo de "melhorou" (verde), "piorou" (vermelho) ou "estável" (cinza), comparado à semana anterior.
- **Alertas da semana**: status dos 3 alertas definidos no plano (feedback negativo > 15%/24h, falha no retrieval > 10%/1h, latência p95 > 5s/15min).
- **Ações planejadas**: tabela com ação, responsável, prazo e status (pendente/em andamento/concluída).

Campos entre `[ ]` devem ser preenchidos a cada semana antes do envio ao cliente.

---

## Pergunta 2

**Usuário:**
> salve a nossa conversa em .md

**Claude:**

Gerou este arquivo, `conversa-template-relatorio-novatech.md`, com o registro desta conversa.
