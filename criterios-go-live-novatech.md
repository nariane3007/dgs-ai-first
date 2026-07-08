# Critérios de Go-Live — NovaTech (por camada do harness)

## 1. Tool Orchestration

- **BLOQUEANTE** — Query endpoint só pode buscar chunks no índice oficial do Azure AI Search (847 docs); nenhuma chamada a fonte não indexada/não auditada.
- **BLOQUEANTE** — Nenhuma ação automática de escrita (ex: responder diretamente ao cliente final, disparar ticket) sem passar pelas camadas de verificação e guardrails abaixo — o bot só orquestra leitura/consulta nesta fase.
- **BLOQUEANTE** — Falha de uma ferramenta (ex: timeout do Azure AI Search) tem fallback definido (mensagem padrão ao atendente), não erro silencioso nem resposta inventada.
- **DESEJÁVEL** — Cache de buscas frequentes para reduzir latência.
- **DESEJÁVEL** — Orquestração multi-agente (ex: agente separado para reformular a pergunta antes da busca).

## 2. Verification Loops

- **BLOQUEANTE** — Structured output obrigatório: todo response passa por validação de schema (`answer`, `source_document`, `confidence_score`). Resposta que não valida é rejeitada programaticamente, nunca repassada ao atendente como está.
- **BLOQUEANTE** — Suite de regressão com o conjunto de perguntas de teste atual re-executada e taxa de erro abaixo de um limiar definido (os 12% de hoje não podem ir a produção — definir a meta, ex: <5%, antes do go-live).
- **BLOQUEANTE** — Verificação automática de *groundedness*: a resposta é comparada contra o(s) chunk(s) citados em `source_document` para reduzir alucinação (não basta citar uma fonte, a fonte precisa sustentar o que foi dito).
- **DESEJÁVEL** — LLM-as-judge como segunda camada de verificação antes do HITL, para priorizar a fila de revisão humana.
- **DESEJÁVEL** — Métrica automática de qualidade de citação (fonte relevante vs. fonte genérica).

## 3. Context & Memory

- **BLOQUEANTE** — Isolamento de contexto por sessão/atendente — sem vazamento de dados entre atendentes-piloto (relevante porque já houve um incidente de log de dado sensível).
- **BLOQUEANTE** — Versionamento do índice: quando um documento-fonte é atualizado, a resposta precisa refletir a versão vigente (resolve a causa "documento desatualizado" encontrada nos testes). Sem isso, o assistente pode responder correto hoje e errado amanhã sem que ninguém perceba.
- **BLOQUEANTE** — Confidence score reflete também a idade/atualidade do chunk recuperado, não só similaridade semântica.
- **DESEJÁVEL** — Memória multi-turno (lembrar perguntas anteriores na mesma conversa).
- **DESEJÁVEL** — Personalização por perfil de atendente.

## 4. Guardrails

- **BLOQUEANTE** — Guardrails DEVE/NÃO DEVE do Product Specialist aplicados como checagem programática (regex/schema/regra), não apenas como instrução de prompt — prompt sozinho não impede o modelo de "esquecer".
- **BLOQUEANTE** — Regras do AGENTS.md (ex: uso de Zod, proibição de logar dado sensível) verificadas em CI antes de merge — o incidente do módulo de feedback gerado por Copilot não pode se repetir sem ser pego automaticamente.
- **BLOQUEANTE — HITL** — Respostas de baixa confiança sobre temas sensíveis/regulatórios (ex: carga perigosa) não vão direto ao atendente: são roteadas para fila de revisão humana; um especialista valida ou corrige a resposta antes dela chegar ao atendente-piloto. Enquanto pendente, o atendente recebe um aviso de "aguardando validação", nunca uma resposta não verificada.
- **BLOQUEANTE — HITL (adicional)** — Código gerado por IA (Copilot) que toca em fluxo de dados sensíveis ou lógica de guardrail passa por revisão humana obrigatória antes do merge, independentemente de passar nos testes automatizados.
- **DESEJÁVEL** — Guardrails de tom/estilo de comunicação (formalidade, empatia).

## 5. Observability

- **BLOQUEANTE** — Todo request/response logado com os campos estruturados (`answer`, `source_document`, `confidence_score`) e timestamp, sem dado sensível do atendente ou cliente no log.
- **BLOQUEANTE** — Alerta automático quando a taxa de respostas de baixa confiança ou rejeitadas pelo schema ultrapassa um limiar em produção.
- **BLOQUEANTE** — Trilha de auditoria das escalações HITL: quem revisou, o que foi alterado, quanto tempo levou — essencial para a demo à diretoria e para responsabilização.
- **DESEJÁVEL** — Dashboard de analytics com tendência da taxa de alucinação ao longo do tempo.
- **DESEJÁVEL** — Monitoramento de custo por consulta (tokens/chamadas ao Azure AI Search).

---

**Nota:** os itens bloqueantes de *Verification Loops* e *Guardrails* dependem diretamente um do outro — sem structured output validado, o HITL não tem um campo de `confidence_score` confiável para decidir o que precisa de revisão humana. Faz sentido tratar essas duas frentes como a prioridade número um antes da demo em 2 semanas.
