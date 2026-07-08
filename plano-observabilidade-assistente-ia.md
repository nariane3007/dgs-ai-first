# Plano de Observabilidade — Assistente de IA para Atendentes

> Escopo: assistente de IA (ex: copiloto baseado em RAG) usado por atendentes de suporte/atendimento, que sugere respostas a clientes e recebe feedback (👍/👎) sobre as sugestões.

---

## 1. Métricas por dimensão

### A. Qualidade da resposta (a IA está acertando?)
- Taxa de feedback negativo do atendente (👎 / total de interações)
- Taxa de "resposta usada sem edição" vs. "editada" vs. "descartada"
- Groundedness/citação de fonte (% de respostas com referência rastreável à base de conhecimento)
- Taxa de alucinação detectada (amostragem manual ou classificador automático)
- Taxa de escalonamento humano após resposta da IA (indica resposta insuficiente)

### B. Performance técnica (o sistema está estável?)
- Latência p50/p95 de resposta
- Taxa de erro/timeout da API (modelo + busca/retrieval)
- Disponibilidade (uptime) do serviço
- Taxa de falha no retrieval (nenhum documento relevante encontrado)

### C. Adoção e uso (os atendentes estão usando?)
- Volume de interações/dia e por atendente
- Taxa de adoção (atendentes ativos / atendentes com acesso)
- Taxa de abandono (atendente para de usar após X dias)
- Tempo médio até a primeira resposta útil

### D. Impacto no negócio (isso está gerando resultado?)
- Tempo médio de atendimento (TMA) — com IA vs. sem IA (baseline)
- Taxa de resolução no primeiro contato (FCR)
- CSAT/NPS do cliente final em atendimentos assistidos por IA
- Custo por interação (chamadas de API/tokens ÷ volume)

---

## 2. Alertas com thresholds concretos

| # | Condição | Threshold | Ação |
|---|---|---|---|
| 1 | Feedback negativo dos atendentes | > 15% em janela de 24h | Notificar squad de conteúdo/IA (Slack/e-mail) para revisão imediata das últimas respostas mal avaliadas |
| 2 | Taxa de falha no retrieval (sem fonte relevante) | > 10% em 1h | Notificar time técnico — pode indicar base de conhecimento desatualizada ou problema na indexação |
| 3 | Latência p95 | > 5s por 15 min consecutivos | Notificar engenharia/infra — risco de atendentes abandonarem o uso da ferramenta |

*Os números são ponto de partida — ajustar após 2–3 semanas de baseline real de uso.*

---

## 3. Feedback loop: do atendente até a melhoria do assistente

```
Atendente avalia (👍/👎 + comentário opcional)
        ↓
Feedback salvo com contexto completo
(pergunta do cliente, resposta da IA, fonte usada, atendente, timestamp)
        ↓
Triagem semanal (squad de conteúdo/IA)
categoriza os 👎 em:
  • resposta errada/desatualizada
  • fonte não encontrada
  • resposta incompleta
  • tom/formato inadequado
        ↓
Ação de melhoria conforme categoria:
  • Atualizar/corrigir base de conhecimento
  • Ajustar prompt ou regras de retrieval
  • Adicionar exemplo de referência (few-shot)
  • Escalar para revisão de produto se for recorrente
        ↓
Métrica de fechamento: % de feedbacks negativos "resolvidos"
que não se repetem no mês seguinte
```

**Ponto-chave:** o feedback do atendente precisa carregar contexto suficiente (pergunta + resposta + fonte) para que a triagem não dependa de "lembrar o caso" — senão o volume trava o processo depois de poucas semanas.

---

*DB1 Global Software · Plano de Observabilidade · Julho/2026*
