# Plano de Rollback — Assistente NovaTech

| Sinal (o que dispara) | Quem decide | Ação |
|---|---|---|
| Taxa de respostas rejeitadas pelo schema estruturado ultrapassa o limiar de alerta (ex.: >15% em 1h) | Eng. de IA/ML de plantão | Suspende o bot do Teams (kill switch), retorna mensagem padrão "atendimento redirecionado", atendentes seguem sem o assistente até correção |
| Groundedness falha em lote (respostas citando fonte errada ou desatualizada, detectado pelo verification loop) | Tech Lead | Reverte para a versão anterior do índice/prompt já validada; bot só reativa após nova rodada de regressão <5% |
| Incidente de dado sensível exposto (log, resposta ao atendente, ou código mesclado sem revisão) | Tech Lead + Product Specialist (decisão conjunta, sensível o suficiente para não ser unilateral) | Desliga o bot imediatamente, aciona revisão de segurança, só volta ao ar com o guardrail que falhou corrigido e re-testado |
| Fila de revisão humana (HITL) atrasada e respostas de baixa confiança chegando ao atendente sem validação | Product Specialist | Pausa o roteamento automático de respostas sensíveis; força modo "só revisão humana" até a fila normalizar |

**Regra geral:** qualquer um dos sinais acima é suficiente para desligar — não precisa esperar confirmação de todos. A ação padrão é sempre reversível e sem downtime total: o atendente continua trabalhando, só perde o assistente temporariamente.
