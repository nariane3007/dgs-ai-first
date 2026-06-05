# Plano de Discovery — AI First DB1
## Projeto: Assistente de IA para Atendimento ao Cliente
### Cliente: NovaTech Logística
### Elaborado por: DB1 Global Software
### Classificação: INTERNO

---

## Contexto do Projeto

A NovaTech possui ~1.200 documentos distribuídos em três fontes (SharePoint: ~800 docs, Confluence: ~400 páginas, pasta de rede: planilhas mensais). O objetivo é construir um assistente de IA integrado ao Microsoft Teams que permita aos 45 atendentes consultar documentação em linguagem natural, reduzindo o tempo médio de busca de 12 para menos de 2 minutos por chamado.

O Discovery segue o modelo **AI First DB1**: agentes de IA executam a pré-análise da documentação existente *antes* das entrevistas com stakeholders, de forma que os humanos entrem nas sessões já com um mapa de contexto, gaps e contradições identificados.

---

## Visão Geral do Modelo

```
[PRÉ-DISCOVERY — IA]          [DISCOVERY — HUMANO]           [PÓS-DISCOVERY — IA + HUMANO]
Agentes analisam docs    →    Entrevistas contextualizadas  →  Consolidação e Especificação
antes das entrevistas         com mapa já gerado                validada para Implementação
```

**Duração total estimada:** 3 semanas
- Semana 1: Pré-Discovery (Agentes IA)
- Semana 2: Discovery Humano (Entrevistas + Validação)
- Semana 3: Consolidação e Handoff para Especificação

---

## FASE 1 — PRÉ-DISCOVERY: Agentes de IA na Intenção
> Executado **antes** das entrevistas com stakeholders. Os agentes operam de forma autônoma sobre as fontes existentes.

### Objetivo
Gerar um mapa priorizado de fontes, dependências, gaps e contradições para que os consultores DB1 entrem nas entrevistas com contexto profundo e perguntas cirúrgicas.

---

### Atividade 1.0 — Análise do Histórico de Chamados (se disponível)
**Executor:** Agente IA (Analisador de Frequência Real)
**Dependência:** Acesso ao sistema de chamados da NovaTech (CRM, Zendesk, ServiceNow, Freshdesk ou exportação de planilhas)
**Duração:** 1 dia
**Prioridade:** Alta — alimenta diretamente a Atividade 1.4

**O que o agente faz:**
- Conecta ao sistema de chamados ou processa exportação histórica (últimos 3–6 meses)
- Extrai e classifica as perguntas reais dos atendentes por tema: Frete, SLA, Devolução, Reclamação, Compliance, Outros
- Gera ranking de frequência real por tipo de pergunta (não inferida por volume documental)
- Identifica perguntas sem resposta documentada (casos em que o atendente escalou ou consultou um colega)
- Identifica variações de linguagem: como os atendentes formulam a mesma dúvida de formas diferentes (relevante para o design do assistente)

**Entrega:** Ranking de perguntas reais por frequência, classificadas por tema, com identificação de gaps de cobertura documental

> **Atenção — fontes alternativas se não houver sistema de chamados:**
> - **Logs de acesso ao SharePoint/Confluence:** indicam quais documentos são mais consultados (proxy de frequência, não frequência real de perguntas)
> - **Observação direta:** consultor DB1 acompanha ao vivo 2–4h de atendimento e registra consultas feitas (dado primário de alta qualidade, mas trabalhoso)
> - **Entrevista com atendentes (Atividade 2.2):** fonte subjetiva — as pessoas tendem a lembrar do que é mais difícil, não necessariamente do mais frequente; usar como validação, não como fonte primária
>
> **Verificar no kickoff:** a NovaTech possui sistema de chamados com histórico pesquisável? Se sim, esta atividade é executada antes de tudo e alimenta a Atividade 1.4 com frequência real. Se não, a Atividade 1.4 trabalhará com frequência inferida por volume documental — qualidade menor, risco de priorização incorreta.

---

### Atividade 1.1 — Catalogação e Inventário das Fontes
**Executor:** Agente IA (Catalogador)
**Dependência:** Acesso provisionado ao SharePoint, Confluence e pasta de rede
**Duração:** 1–2 dias

**O que o agente faz:**
- Conecta às três fontes via APIs (Microsoft Graph para SharePoint, API Confluence, acesso à pasta de rede)
- Cataloga todos os ~1.200 documentos: nome, tipo (PDF/Word/planilha/wiki), área responsável (Operações/Compliance/Comercial), data de última atualização, tamanho, caminho/URL
- Extrai metadados estruturados e texto bruto de cada documento
- Gera inventário consolidado em formato tabular (planilha de catalogação)

**Entrega:** Inventário completo com ~1.200 registros catalogados, mapeados por fonte e área

---

### Atividade 1.2 — Identificação de Duplicatas e Contradições
**Executor:** Agente IA (Auditor de Consistência)
**Dependência:** Atividade 1.1 concluída (inventário disponível)
**Duração:** 1–2 dias

**O que o agente faz:**
- Aplica similaridade semântica entre documentos para identificar duplicatas (mesmo conteúdo, títulos diferentes) e versões conflitantes (mesmo tema, conteúdos divergentes)
- Cruza regras de frete, SLAs e políticas de devolução entre versões e fontes
- Identifica documentos que se contradizem entre si (ex: SLA para cliente tipo A = 48h em um doc e 72h em outro)
- Classifica cada conflito por criticidade: Alta (contradições em regras operacionais), Média (informações desatualizadas), Baixa (redundância sem conflito)
- Gera relatório de conflitos com: documento A x documento B, trecho conflitante, grau de criticidade, área responsável

**Entrega:** Relatório de conflitos priorizados por criticidade, lista de duplicatas e sugestão de documento canônico para cada conflito

---

### Atividade 1.3 — Mapeamento Temático e Clustering
**Executor:** Agente IA (Classificador Temático)
**Dependência:** Atividade 1.1 concluída
**Duração:** 1 dia

**O que o agente faz:**
- Classifica todos os documentos em temas/domínios: Frete, SLA, Devolução, Reclamação, Compliance, Segurança de Carga, Procedimentos Operacionais, Outros
- Identifica os temas mais frequentemente consultados (por volume de documentos e densidade de conteúdo)
- Mapeia quais temas têm cobertura densa, quais têm gaps (pouco documentado) e quais têm excesso de versões
- Cruza clustering temático com as três áreas responsáveis (Operações, Compliance, Comercial) para identificar sobreposições de responsabilidade

**Entrega:** Mapa temático com cobertura por domínio, identificação de gaps e sobreposições por área

---

### Atividade 1.4 — Priorização de Conteúdo
**Executor:** Agente IA (Analisador de Relevância)
**Dependência:** Atividades 1.1 e 1.3 concluídas + Atividade 1.0 (se disponível)
**Duração:** 1 dia

**O que o agente faz:**
- Cruza o mapa temático (1.3) com o ranking de perguntas reais (1.0) — quando disponível — para priorizar documentos com base em frequência real de uso, não em volume documental
- Quando o histórico de chamados não está disponível, infere frequência pelo volume e densidade de documentos por tema — qualidade menor, com risco de priorizar o que está mais documentado, não o que é mais consultado
- Mapeia cobertura por tipo de pergunta: quais têm resposta clara, quais têm resposta ambígua (múltiplos docs contraditórios) e quais não têm resposta documentada (gaps reais)
- Gera ranking dos 50–100 documentos de maior impacto para o atendimento
- Identifica documentos que precisam de normalização antes de serem indexados

**Entrega:** Mapa de prioridade de tratamento e escopo do MVP — identifica quais documentos requerem intervenção manual urgente, quais domínios entram na primeira versão do assistente, e quais perguntas devem compor os casos de teste prioritários. Não determina o que o assistente vai saber responder (isso é função da qualidade de indexação), mas orienta onde concentrar esforço humano no prazo disponível.

> **Nota:** a qualidade desta atividade depende diretamente da Atividade 1.0. Com histórico de chamados: priorização baseada em evidência. Sem histórico: priorização baseada em inferência — válida, mas sujeita a revisão nas entrevistas da Semana 2.

---

### Atividade 1.5 — Análise de Qualidade Técnica da Documentação
**Executor:** Agente IA (Auditor Técnico)
**Dependência:** Atividade 1.1 concluída
**Duração:** 1 dia

**O que o agente faz:**
- Identifica documentos com problemas técnicos para indexação: PDFs escaneados sem texto extraível, imagens de tabelas, formatação complexa que dificulta chunking
- Mapeia planilhas de referência (.xlsx) e identifica quais têm estrutura favorável à extração automatizada
- Verifica presença de links internos entre documentos (referências cruzadas) que precisariam ser preservadas
- Identifica documentos com dados sensíveis ou restritos que não devem ser indexados no assistente

**Entrega:** Relatório de qualidade técnica com classificação de cada documento: Pronto para indexar / Requer tratamento / Requer decisão humana

---

### Entrega Consolidada da Fase 1 — Mapa de Discovery
**Executor:** Agente IA (Sintetizador) + Revisão humana (Consultor DB1)
**Dependência:** Atividades 1.1 a 1.5 concluídas
**Duração:** meio dia

O agente consolida todos os outputs anteriores em um único **Mapa de Discovery** com:
1. Inventário catalogado das 3 fontes
2. Conflitos e duplicatas priorizados
3. Mapa temático com gaps e sobreposições
4. Mapa de prioridade de tratamento e escopo do MVP (quais documentos requerem intervenção manual, quais domínios entram no MVP, quais perguntas compõem os casos de teste)
5. Cobertura por tipo de pergunta do atendimento
6. Qualidade técnica de cada documento
7. **Roteiro de perguntas para entrevistas** — gerado com base nos gaps, conflitos e ambiguidades encontrados

> O consultor DB1 revisa o Mapa de Discovery antes de usá-lo nas entrevistas. Revisão estimada: 2–4 horas.

---

## FASE 2 — DISCOVERY HUMANO: Entrevistas e Validação
> Executado com o Mapa de Discovery em mãos. As entrevistas são focadas, contextualizadas e cirúrgicas.

**Pré-requisito:** Mapa de Discovery da Fase 1 revisado e aprovado pelo consultor DB1.

---

### Atividade 2.1 — Entrevista: Gestores de Documentação (3 áreas)
**Executor:** Consultor DB1 (Humano)
**Participantes NovaTech:** Responsáveis por Operações, Compliance e Comercial
**Duração:** 1h por área (3 sessões)

**Objetivo:** Validar os conflitos identificados pela IA, entender o processo de atualização mensal e definir quem é a "fonte da verdade" em cada conflito.

**Perguntas guiadas pelo Mapa de Discovery:**
- Confirmar os conflitos de alta criticidade identificados: "O agente encontrou que o SLA para cliente tipo A aparece como 48h no doc X e 72h no doc Y — qual é o correto?"
- Mapear o processo de atualização: quem aprova, com qual frequência, onde é publicado
- Identificar documentos que NÃO devem entrar no assistente (restritos, em revisão, obsoletos)
- Definir o responsável por validação de conteúdo pós-go-live

---

### Atividade 2.2 — Entrevista: Equipe de Atendimento (amostra)
**Executor:** Consultor DB1 (Humano)
**Participantes NovaTech:** amostra de atendentes (ver critérios abaixo)
**Duração:** 1h30 (sessão de grupo focado)

**Objetivo:** Validar os tipos de pergunta mais frequentes, entender a jornada atual de busca e identificar os "truques" que a equipe usa para lidar com informações contraditórias.

---

#### Dimensionamento da amostra

O tamanho da amostra não é definido por proporção estatística dos 45 atendentes, mas por **saturação de informação** — ponto em que novas entrevistas param de revelar insights novos. Para uma função relativamente homogênea como atendimento, isso acontece rápido.

O que define o tamanho real é a **heterogeneidade da equipe**. Verificar no kickoff:

- Os atendentes são divididos por especialidade (ex: frete internacional vs. devolução vs. reclamação)?
- Há diferença de senioridade relevante no padrão de consulta?
- Existem turnos ou canais diferentes (telefone, chat, e-mail) com tipos de chamado distintos?

**Se a equipe for homogênea** (mesma função, mesmo canal, mesma faixa de senioridade): 5 atendentes cobrem bem.
**Se houver segmentações relevantes**: garantir ao menos 1–2 representantes de cada subgrupo — o número total segue dessa conta, não de uma faixa pré-definida.

---

#### Perfil ideal dos participantes

**Perfil 1 — Atendente sênior (2+ anos na função) — mínimo 2 participantes**
Conhece os atalhos informais, sabe de cor onde cada informação fica e é quem os colegas consultam quando não encontram algo. Representa o conhecimento tácito que o assistente precisa capturar. Indispensável — é quem mais conhece as contradições documentais na prática.

**Perfil 2 — Atendente recente (menos de 6 meses) — mínimo 1 participante**
Ainda depende da documentação formal, ainda não desenvolveu atalhos. Representa o usuário que mais vai se beneficiar do assistente — e também o que mais vai ser prejudicado se ele der uma resposta errada. Revela onde a documentação atual falha para quem não tem experiência acumulada.

**Perfil 3 — Atendente que lida com chamados complexos — mínimo 1 participante**
Frete especial, clientes corporativos, reclamações com escalonamento. Esses casos envolvem as regras mais difíceis de encontrar na documentação e os maiores riscos de resposta incorreta.

**Perfil 4 — Atendente com histórico de inconsistências de resposta — opcional**
Se o gestor conseguir identificar sem expor a pessoa, esse perfil representa o caso de maior risco que o assistente precisa resolver. Depende da maturidade da gestão em compartilhar esse dado.

> **O que evitar:** selecionar apenas os melhores atendentes ou os mais engajados com tecnologia. Isso cria viés de seleção e subestima as dificuldades reais de uso — o assistente será usado por todos, não pelos mais capacitados.

---

**Perguntas guiadas pelo Mapa de Discovery:**
- Validar o mapa temático gerado pela IA: "Os agentes identificaram que frete e SLA concentram a maior parte da documentação — isso reflete o que vocês mais consultam no dia a dia?"
- Mapear os gaps reais: "Para quais perguntas vocês hoje não encontram resposta nos documentos e precisam perguntar para alguém?"
- Entender o comportamento de busca atual: quais fontes acessam primeiro, o que é mais difícil de encontrar, quanto tempo levam em média
- Explorar os atalhos informais: "Quando o documento não ajuda, o que vocês fazem?" — isso revela conhecimento tácito que pode não estar documentado em lugar nenhum
- Coletar exemplos reais de perguntas de clientes das últimas semanas

---

### Atividade 2.3 — Entrevista: TI / Infraestrutura
**Executor:** Consultor DB1 (Humano)
**Participantes NovaTech:** Responsável de TI / Microsoft 365
**Duração:** 1h

**Objetivo:** Mapear o ambiente técnico, permissões, restrições de segurança e capacidade de integração.

**Tópicos:**
- Confirmar licenças Microsoft 365 E3 e escopo de uso do Azure AI Services
- Mapear permissões de acesso ao SharePoint: quem pode ler o quê
- Entender política de dados: documentos com restrição de acesso por perfil de usuário
- Definir viabilidade de integração Teams (bot vs app)
- Mapear processo de atualização mensal: como os documentos são versionados no SharePoint/Confluence

---

### Atividade 2.4 — Workshop de Validação e Priorização
**Executor:** Consultor DB1 (Humano) + Stakeholders NovaTech
**Participantes:** Representantes das 3 áreas + TI + 1–2 atendentes sêniores
**Duração:** 2h

**Objetivo:** Validar o Mapa de Discovery (agora enriquecido com as entrevistas), priorizar o escopo do MVP do assistente e resolver os conflitos de alta criticidade.

**Agenda:**
1. Apresentação do Mapa de Discovery atualizado (30 min)
2. Validação e resolução dos conflitos documentais priorizados (45 min) — decisão sobre qual versão é canônica para cada conflito
3. Priorização do escopo do MVP: quais domínios entram na primeira versão (45 min)
4. Definição do processo de governança documental pós-go-live (quem é responsável por atualizar o índice quando um documento muda)

**Entrega:** Escopo validado do MVP, lista de documentos aprovados para indexação, responsáveis definidos por domínio

---

### Atividade 2.5 — Coleta de Exemplos Reais de Perguntas
**Executor:** Consultor DB1 (Humano) + Equipe de atendimento NovaTech
**Duração:** assíncrono (durante a semana 2)

**O que fazer:**
- Solicitar à equipe de atendimento uma amostra de 50–100 tickets reais das últimas 2 semanas que envolveram consulta a documentação
- Coletar as perguntas que os atendentes fizeram às fontes e as respostas que encontraram (ou não encontraram)
- Esses exemplos serão usados como casos de teste para o assistente na fase de Implementação

---

## FASE 3 — PÓS-DISCOVERY: Consolidação e Handoff
> Fase de transição entre Discovery e Especificação.

### Atividade 3.1 — Enriquecimento do Mapa de Discovery
**Executor:** Agente IA (Sintetizador) + Consultor DB1
**Dependência:** Fase 2 concluída
**Duração:** 1 dia

**O que acontece:**
- O consultor alimenta o agente com os outputs das entrevistas (notas, decisões do workshop, lista de documentos aprovados)
- O agente cruza as decisões humanas com o mapa original e atualiza: conflitos resolvidos, documentos aprovados/reprovados, escopo do MVP definido
- Gera o **Relatório Final de Discovery** pronto para alimentar a fase de Especificação

---

### Atividade 3.2 — Relatório Final de Discovery
**Executor:** Consultor DB1 (Humano) revisa e assina
**Dependência:** Atividade 3.1 concluída
**Duração:** meio dia

**Conteúdo do relatório:**
1. Inventário final: X documentos aprovados para indexação, Y reprovados, Z requerem tratamento
2. Mapa de domínios do MVP (ex: Frete, SLA, Devolução = MVP; Segurança de Carga = V2)
3. Conflitos documentais resolvidos e documento canônico definido
4. Arquitetura de dados sugerida: chunking strategy, metadados de indexação, política de atualização
5. Casos de teste (50–100 perguntas reais coletadas)
6. Riscos identificados: documentos sem OCR, atualização mensal sem processo formal, etc.
7. Recomendações para governança documental

**Este relatório é o insumo direto para a fase de Especificação.**

---

## Sequência e Dependências

```
SEMANA 1 — PRÉ-DISCOVERY (IA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kickoff:  [1.0] Histórico de chamados (se disponível) ────────┐
Dia 1–2:  [1.1] Catalogação ──────────────────────────────────┤
Dia 2–3:  [1.2] Duplicatas/Contradições (depende de 1.1)      │
Dia 2–3:  [1.3] Clustering Temático (depende de 1.1)          │
Dia 3–4:  [1.4] Priorização (depende de 1.1 + 1.3 + 1.0)     │
Dia 2–3:  [1.5] Qualidade Técnica (depende de 1.1)            │
Dia 4–5:  [Consolidação] Mapa de Discovery ←──────────────────┘
Dia 5:    [Revisão Humana] Consultor revisa Mapa (2–4h)

SEMANA 2 — DISCOVERY HUMANO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dia 6–7:  [2.1] Entrevistas Gestores de Documentação (3 sessões)
Dia 7:    [2.2] Sessão com Equipe de Atendimento
Dia 8:    [2.3] Entrevista TI
Dias 6–9: [2.5] Coleta de Tickets Reais (assíncrono)
Dia 9–10: [2.4] Workshop de Validação e Priorização

SEMANA 3 — CONSOLIDAÇÃO (IA + HUMANO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dia 11:   [3.1] Enriquecimento do Mapa (IA + inputs do Consultor)
Dia 12:   [3.2] Relatório Final de Discovery (Humano revisa e assina)
Dia 12:   → Handoff para Especificação
```

---

## Resumo de Responsabilidades

| Atividade | Executor | Semana |
|---|---|---|
| 1.0 Análise do histórico de chamados (se disponível) | IA | Kickoff / Semana 1 |
| 1.1 Catalogação das fontes | IA | 1 |
| 1.2 Identificação de duplicatas e conflitos | IA | 1 |
| 1.3 Clustering temático | IA | 1 |
| 1.4 Mapa de prioridade de tratamento e escopo do MVP | IA | 1 |
| 1.5 Qualidade técnica para indexação | IA | 1 |
| Revisão do Mapa de Discovery | Humano (Consultor DB1) | 1 |
| 2.1 Entrevistas com gestores de documentação | Humano | 2 |
| 2.2 Sessão com equipe de atendimento | Humano | 2 |
| 2.3 Entrevista com TI | Humano | 2 |
| 2.4 Workshop de validação e priorização | Humano | 2 |
| 2.5 Coleta de tickets reais | Humano (assíncrono) | 2 |
| 3.1 Enriquecimento do Mapa com inputs humanos | IA + Humano | 3 |
| 3.2 Relatório Final de Discovery | Humano (assina) | 3 |

---

## Pré-requisitos para Início

Antes do início da Semana 1, a NovaTech precisa provisionar:
- [ ] Acesso de leitura ao SharePoint via Microsoft Graph API (service principal ou conta de serviço)
- [ ] Acesso de leitura à API do Confluence
- [ ] Acesso de leitura à pasta de rede com as planilhas mensais
- [ ] **Exportação ou acesso ao sistema de chamados** (últimos 3–6 meses) — CRM, Zendesk, ServiceNow, Freshdesk ou planilha de registro; verificar disponibilidade no kickoff
- [ ] Definição do ponto focal de cada área (Operações, Compliance, Comercial) para as entrevistas
- [ ] Autorização formal do DPO/Jurídico para análise do conteúdo documental e dos chamados pela IA

---

## Sobre as Durações Estimadas

As durações definidas neste plano são **estimativas de ordem de grandeza**, construídas com base em heurísticas de mercado e no volume declarado de documentos (~1.200). Elas não substituem uma calibração feita após o kickoff com a NovaTech.

### Base dos Cálculos

| Fator | Premissa adotada |
|---|---|
| Volume de documentos | ~1.200 (800 SharePoint + 400 Confluence + planilhas) |
| Qualidade dos docs | Maioria com texto extraível (PDFs digitais, Word, wiki) |
| Acessos técnicos | Provisionados antes do início da Semana 1 |
| Disponibilidade dos stakeholders | Agenda liberada na Semana 2 sem conflitos |
| Infraestrutura dos agentes | Capacidade suficiente para processar 1.200 docs em horas |

### Riscos que Podem Aumentar a Duração

#### Risco 1 — Documentos não extraíveis (impacto: +3 a +5 dias na Semana 1)
**O que é:** PDFs escaneados sem OCR, tabelas salvas como imagem, documentos protegidos contra cópia.
**Por quê importa:** O agente não consegue extrair texto — precisa de pipeline de OCR antes da análise, o que aumenta significativamente o tempo de processamento.
**Sinal de alerta:** A Atividade 1.5 (Qualidade Técnica) vai revelar isso no Dia 2–3. Se mais de 20% dos documentos precisar de OCR, o cronograma da Semana 1 precisa ser revisado.
**Mitigação:** Solicitar à NovaTech, ainda no kickoff, uma amostra de 20–30 documentos para teste de extração antes de iniciar.

---

#### Risco 2 — Atraso no provisionamento de acessos (impacto: +3 a +10 dias)
**O que é:** A Semana 1 depende inteiramente de acesso via API ao SharePoint (Microsoft Graph), Confluence e pasta de rede. Processos de TI corporativos frequentemente levam mais tempo do que o previsto para liberar service principals, permissões e tokens.
**Por quê importa:** Sem acesso, os agentes não conseguem nem iniciar a Atividade 1.1.
**Sinal de alerta:** Se na data de início os acessos não estiverem confirmados, a Semana 1 não começa.
**Mitigação:** Tratar o provisionamento como Dia 0 do projeto — iniciar o processo de TI junto com a assinatura do contrato, não depois. Incluir como pré-requisito formal com data-limite.

---

#### Risco 3 — Indisponibilidade de stakeholders (impacto: +3 a +7 dias na Semana 2)
**O que é:** Os gestores das 3 áreas (Operações, Compliance, Comercial) e a equipe de TI precisam estar disponíveis na Semana 2. Em empresas de médio porte, agenda é frequentemente o maior gargalo real de um discovery.
**Por quê importa:** Entrevistas não realizadas no prazo empurram o Workshop (2.4) e, consequentemente, o Relatório Final.
**Mitigação:** Confirmar e bloquear as agendas na Semana 1 (enquanto os agentes processam os documentos). O Mapa de Discovery deve ser enviado aos participantes com antecedência para que cheguem preparados.

---

#### Risco 4 — Alta densidade de conflitos documentais (impacto: +2 a +4 dias no Workshop)
**O que é:** Se o agente identificar um volume muito alto de contradições (ex: mais de 50 conflitos de alta criticidade), o Workshop de Validação (2.4) de 2h não será suficiente para resolver todos.
**Por quê importa:** Cada conflito não resolvido vira ambiguidade no assistente de IA — resposta errada ou resposta "depende".
**Mitigação:** Apresentar apenas os conflitos de alta criticidade no Workshop. Conflitos de média e baixa criticidade podem ser resolvidos assincronamente com os responsáveis de área após o evento.

---

#### Risco 5 — Documentos com restrição de acesso por perfil (impacto: indeterminado)
**O que é:** Parte da documentação pode ter permissões diferenciadas — documentos de Compliance visíveis apenas para gestores, por exemplo. O assistente precisaria respeitar essas permissões por perfil de usuário.
**Por quê importa:** Muda a arquitetura de indexação (não é um índice único — são índices por perfil ou com filtros de segurança). Impacto direto na Especificação e na complexidade de Implementação.
**Sinal de alerta:** A Atividade 2.3 (Entrevista TI) vai revelar isso.
**Mitigação:** Mapear permissões ainda no kickoff. Se houver restrições de perfil, incluir como requisito explícito no escopo do MVP.

---

#### Risco 6 — Processo de atualização mensal sem versionamento formal (impacto: risco estrutural)
**O que é:** A NovaTech atualiza documentos mensalmente sem processo unificado de revisão. Isso significa que o índice do assistente pode ficar desatualizado entre um ciclo e outro.
**Por quê importa:** Um assistente que responde com informação desatualizada é pior do que não ter assistente — gera confiança indevida em dado errado.
**Mitigação:** Definir no Workshop (2.4) um processo formal de governança: quem notifica a DB1 (ou o sistema) quando um documento é atualizado, e qual é o SLA para reindexação. Isso precisa estar no escopo do projeto, não ser tratado como pós-go-live.

---

### Variáveis que Podem Reduzir a Duração

| Variável | Impacto potencial |
|---|---|
| Documentação já bem organizada e versionada no SharePoint | −2 a −3 dias na Semana 1 |
| Stakeholders já familiarizados com o problema e com opiniões formadas | −1 a −2 dias na Semana 2 |
| NovaTech já ter feito um mapeamento interno prévio da documentação | −1 a −2 dias na Semana 1 |
| Escopo do MVP muito focado (ex: apenas Frete e SLA) | Reduz volume de docs analisados e conflitos a resolver |

---

### Recomendação: Sessão de Calibração no Kickoff

Antes de fechar o cronograma definitivo, realizar uma **sessão de kickoff técnico de 2h** com a NovaTech para:

1. Testar extração de uma amostra de 20–30 documentos (revelar Risco 1)
2. Confirmar status do provisionamento de acessos (revelar Risco 2)
3. Bloquear agendas da Semana 2 (mitigar Risco 3)
4. Fazer triagem inicial de documentos restritos por perfil (revelar Risco 5)
5. Entender o processo atual de atualização mensal (revelar Risco 6)

Somente após essa sessão o cronograma deve ser comprometido formalmente com a NovaTech.

---

## Classificação

> **CLASSIFICAÇÃO: INTERNO — DB1 Global Software / NovaTech**
