# Resumo da Conversa — DGS AI First SDLC e Plano de Discovery NovaTech
**Data:** 05/06/2026
**Classificação:** INTERNO — DB1 Global Software

---

## 1. Ponto de partida

A conversa começou com um print de uma apresentação interna da DB1 descrevendo o modelo **DGS AI First SDLC** — um ciclo de vida de desenvolvimento de software orientado por inteligência artificial, composto por seis fases sequenciais suportadas pelo DGS Mind (IA central) e pelo Harness (plataforma CI/CD).

Os dados do print foram extraídos e salvos no projeto como `DGS_AI_FIRST_SDLC.md`.

---

## 2. Divisão de responsabilidades: IA vs Humano no modelo DGS AI First

Foi gerado um diagrama e uma tabela detalhada classificando cada fase do ciclo por executor:

| Fase | Executor | Papel |
|---|---|---|
| Intenção | Humano | Define contexto e requisitos — ponto de partida insubstituível |
| Discovery | IA | Mapeia skills, contexto técnico e de negócio automaticamente |
| Especificação | IA + Humano | IA gera specs; humano valida e aprova via PR |
| Implementação | IA | Gera código e testes; humano aprova PR (code review) |
| Deploy | IA + Humano | IA publica; humano valida o ambiente de execução |
| Runtime Intelligence | IA | Monitora observabilidade e gera novas intenções (fecha o ciclo) |

**Princípio central:** o modelo é **AI First, não AI Only**. A IA faz o trabalho pesado de geração e análise. O humano é o guardião de qualidade nos pontos de Validação e PR, e o único que define a Intenção.

Salvo como `DGS_AI_FIRST_SDLC_IA_vs_Humano.md`.

---

## 3. Plano de Discovery AI First para a NovaTech

### Contexto do projeto
- **Cliente:** NovaTech Logística — 1.200 funcionários, setor de logística
- **Problema:** equipe de atendimento (45 pessoas) gasta 12 min/chamado buscando informações em ~1.200 documentos espalhados em SharePoint (~800 docs), Confluence (~400 páginas) e pasta de rede (planilhas mensais)
- **Objetivo:** assistente de IA integrado ao Microsoft Teams para consulta em linguagem natural, reduzindo o tempo de busca de 12 para menos de 2 minutos
- **Prazo:** 3 meses (discovery + desenvolvimento + go-live)
- **Infraestrutura:** Microsoft 365 E3 + Azure AI Services

### Estrutura do plano
O Discovery segue o modelo AI First DB1: agentes de IA pré-analisam a documentação **antes** das entrevistas com stakeholders. Duração total: 3 semanas.

---

## 4. Decisões e correções feitas ao longo da conversa

### 4.1 Adição da Atividade 1.0 — Histórico de chamados

**Pergunta que gerou a decisão:** "De onde serão retiradas as perguntas mais frequentes?"

**Problema identificado:** o plano original previa que o agente inferisse frequência de perguntas a partir do volume documental — ou seja, o que está mais documentado, não o que é mais consultado.

**Decisão:** adicionar Atividade 1.0 como primeira atividade da Semana 1, antes da catalogação de documentos. O agente analisa o histórico de chamados (CRM, Zendesk, ServiceNow ou planilhas de registro dos últimos 3–6 meses) para extrair frequência real de perguntas.

**Distinção registrada:**
- *Com histórico de chamados:* priorização baseada em evidência real
- *Sem histórico:* priorização inferida por volume documental — válida, mas com risco de priorizar o que está mais documentado em vez do mais consultado

**Fontes alternativas quando não há sistema de chamados:**
- Logs de acesso ao SharePoint/Confluence (proxy de frequência, não frequência real)
- Observação direta de sessões de atendimento (dado primário, trabalhoso)
- Entrevistas com atendentes (subjetivo — as pessoas lembram do que é difícil, não do que é frequente; usar como validação, não como fonte primária)

---

### 4.2 Correção da Atividade 1.4 — Mapa de prioridade de tratamento

**Pergunta que gerou a decisão:** "Qual a relevância para o processo deste ranking dos 50–100 documentos?"

**Problema identificado:** o plano chamava o output da Atividade 1.4 de "ranking dos 50–100 documentos prioritários", sugerindo que esses documentos seriam selecionados para o assistente. Isso é incorreto — em projetos de RAG, todos os documentos aprovados são indexados; o assistente recupera o mais relevante em tempo real para cada pergunta.

**Decisão:** renomear e reposicionar o output como **"Mapa de prioridade de tratamento e escopo do MVP"**.

**O que o mapa realmente serve:**
1. Priorizar quais documentos com problemas técnicos (PDFs escaneados, tabelas como imagem) recebem tratamento manual primeiro — dado o prazo, não dá para tratar todos
2. Orientar o corte de escopo do MVP — quais domínios entram na primeira versão
3. Definir os casos de teste prioritários para o go-live
4. Focar o Workshop de validação nos conflitos que mais importam

**O que o mapa não faz:** não determina o que o assistente vai saber responder. Isso é função da qualidade do chunking, da indexação e do prompt.

---

### 4.3 Correção da Atividade 2.2 — Perfil e dimensionamento da amostra de atendentes

**Pergunta que gerou a decisão:** "Como chegou na quantidade de 5 a 8 atendentes? Qual o perfil ideal?"

**Problema identificado:** o número 5–8 era arbitrário, baseado em heurística genérica de grupos focais, sem calibração para o contexto da NovaTech. O plano também não definia perfil nenhum dos participantes.

**Decisão sobre dimensionamento:**
- O tamanho da amostra é definido por **saturação de informação**, não por proporção dos 45 atendentes
- O que determina o número real é a **heterogeneidade da equipe** — se há segmentação por especialidade, turno, canal ou senioridade, a amostra precisa cobrir cada subgrupo com pelo menos 1–2 representantes
- Verificar no kickoff antes de definir quantos chamar

**Perfis definidos:**

| Perfil | Mínimo | Justificativa |
|---|---|---|
| Sênior (2+ anos) | 2 | Conhece atalhos informais e contradições documentais na prática |
| Recente (menos de 6 meses) | 1 | Representa o usuário que mais depende da documentação formal |
| Chamados complexos | 1 | Lida com as regras mais difíceis de encontrar |
| Histórico de inconsistências | Opcional | Representa o caso de maior risco — depende da maturidade da gestão |

**Alerta registrado:** evitar selecionar apenas os melhores atendentes ou os mais engajados com tecnologia — cria viés de seleção e subestima as dificuldades reais de uso.

**Pergunta adicionada ao roteiro:** "Quando o documento não ajuda, o que vocês fazem?" — revela o conhecimento tácito informal que frequentemente não está documentado em lugar nenhum.

---

### 4.4 Transparência sobre as durações

**Pergunta que gerou a discussão:** "Como definiu a duração de cada tarefa?"

**Resposta registrada:** as durações são estimativas de ordem de grandeza, não medições precisas. Foram construídas com base em:
- Volume conhecido (~1.200 documentos)
- Premissa de que a maioria dos docs tem texto extraível
- Padrão de mercado para entrevistas de discovery (1h por gestor, 1h30 para grupo focal)

**O que não estava calibrado:** estado real dos documentos (PDFs escaneados aumentam muito o tempo), disponibilidade dos stakeholders, tempo de provisionamento de acessos de TI.

**Conclusão:** o cronograma só deve ser comprometido formalmente após uma **sessão de kickoff técnico de 2h** que revele os riscos reais.

---

## 5. Riscos mapeados

| Risco | Impacto potencial | Quando se revela |
|---|---|---|
| Documentos não extraíveis (PDFs escaneados) | +3 a +5 dias Semana 1 | Atividade 1.5 (Dia 2–3) |
| Atraso no provisionamento de acessos | +3 a +10 dias | Antes do início |
| Indisponibilidade de stakeholders | +3 a +7 dias Semana 2 | Agendamento na Semana 1 |
| Alta densidade de conflitos documentais | +2 a +4 dias no Workshop | Atividade 1.2 |
| Documentos com restrição de acesso por perfil | Impacto na arquitetura (indeterminado) | Entrevista TI (2.3) |
| Atualização mensal sem versionamento formal | Risco estrutural de dado desatualizado | Entrevista TI (2.3) |

---

## 6. Arquivos gerados no projeto

| Arquivo | Conteúdo |
|---|---|
| `DGS_AI_FIRST_SDLC.md` | Dados extraídos do print — fases, camadas, pontos de controle |
| `DGS_AI_FIRST_SDLC_IA_vs_Humano.md` | Divisão de responsabilidades por fase com justificativas |
| `Discovery_AIFirst_NovaTech.md` | Plano completo de Discovery — atividades, sequência, perfis, riscos, durações |
| `Conversa_DGS_AIFirst_NovaTech.md` | Este documento — resumo estruturado da conversa |

---

## 7. Próximos passos sugeridos

1. **Kickoff técnico com a NovaTech (2h)** — calibrar durações, verificar estado dos documentos, confirmar existência de sistema de chamados, bloquear agendas da Semana 2, verificar restrições de acesso por perfil
2. **Provisionamento de acessos** — tratar como Dia 0, iniciar junto com a assinatura do contrato
3. **Definição dos perfis de atendentes** — confirmar com o gestor a heterogeneidade da equipe antes de definir quantos e quem chamar para a Atividade 2.2
4. **Refinamento do plano** após o kickoff — ajustar durações e sequência com base nos riscos reais identificados

---

> **Classificação: INTERNO — DB1 Global Software**
