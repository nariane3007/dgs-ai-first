# Conversa — Workflow AI First NovaTech
**Projeto:** NovaTech Assistant · DB1 · Fase 2 — Estruturação  
**Data:** 15/06/2026  
**Exercício:** 2.1 — Delivery Manager

---

## Contexto salvo em memória

### Cenário do projeto
O projeto NovaTech foi aprovado. O discovery está concluído e a fase de entendimento produziu artefatos concretos: ADRs com decisões arquiteturais (modelo LLM, estratégia de contexto, tratamento de documentos contraditórios, build vs buy), uma spec de requisitos de produto para o pipeline de RAG, um protótipo funcional de RAG com ferramentas open-source, cenários de falha mapeados pelo QA, e um plano de testes inicial. Agora o time precisa estruturar o ambiente, os padrões e os artefatos que vão governar o desenvolvimento.

### Stack e repositório
- **Modelo LLM:** Azure OpenAI (GPT-4o) — janela de 128K tokens (ADR-0001)
- **Pipeline de RAG:** Azure AI Search + Azure OpenAI
- **Stack:** TypeScript, Azure Functions, React, Bicep
- **Repositório local:** `novatech-assistant`
- **Integração:** Microsoft Teams (bot) + painel web interno

### Time
| Papel | Qtd |
|---|---|
| Tech Lead | 1 |
| Dev Sênior | 1 |
| Dev Pleno | 1 |
| QA | 1 |
| Product Specialist | 1 |
| Delivery Manager | 1 |

### Ferramentas disponíveis
| Ferramenta | Disponível para |
|---|---|
| GitHub Copilot | Devs + Tech Lead |
| Claude | Todo o time |
| Claude Cowork | Papéis não-dev (DM, QA, PS) |
| Claude Design | Product Specialist |
| Azure DevOps | Boards e tracking |
| GitHub | Repositório e CI/CD |

---

## Metodologia — DGS AI First SDLC

**Camadas:** DGS Mind (topo) → Harness (controle)

| Fase | Descrição |
|---|---|
| Intenção | Descrição da intenção, contexto e requisitos da demanda |
| Discovery | Refinamento da intenção, mapeamento de skills técnicas/negócio e contexto para implementação |
| Especificação | Definição e planejamento das specs a executar — **Validação + PR** |
| Implementação | Geração de código de funcionalidades e testes automatizados — **Validação + PR** |
| Deploy | Publicação do código gerado e revisado em ambiente de execução — **Validação** |
| Runtime Intelligence | Análise proativa de comportamento de usuário e dados de observabilidade para geração de novas intenções |

**Pontos de validação:** após Discovery, após Especificação e após Implementação.  
**PRs:** entre Especificação→Implementação e Implementação→Deploy.

---

## Exercício 2.1 — Workflow de Desenvolvimento AI First

### Ciclo de desenvolvimento

```
SPEC → [GATE 1] → PLAN → [GATE 2] → TASKS → IMPLEMENT → [GATE 3] → REVIEW → [GATE 4] → DEPLOY
```

Gates são checkpoints humanos obrigatórios. Nenhuma fase seguinte inicia sem aprovação explícita.

---

### Matriz Papel × Ferramenta × Etapa

#### Product Specialist
**Ferramentas:** Claude · Claude Cowork · Claude Design

| Etapa | Papel | Atividade |
|---|---|---|
| Spec | **Owner** | Redige `requirements.md` com Claude. Usa Claude Design para wireframes. Define critérios de aceite verificáveis por módulo. |
| Plan | Revisor | Valida se o `plan.md` do TL está alinhado aos requisitos de produto. |
| Tasks | Consultor | Clarifica dúvidas de regras de negócio nas tasks geradas. |
| Implement | — | Disponível para dúvidas de domínio. |
| Review | Revisor | Valida comportamento funcional via demo ou painel. |
| Deploy | Sign-off | Aprova release notes. Valida smoke test do fluxo principal. |

#### Tech Lead
**Ferramentas:** Claude · GitHub Copilot

| Etapa | Papel | Atividade |
|---|---|---|
| Spec | Revisor | Revisa `requirements.md` quanto à viabilidade técnica. Aprova no Gate 1. |
| Plan | **Owner** | Gera `plan.md` com Claude e Copilot. Define abordagem técnica, ADRs, dependências e riscos. |
| Tasks | Revisor | Aprova `tasks.md` no Gate 2. Verifica atomicidade e cobertura. |
| Implement | Suporte | Consultor técnico. Remove blockers arquiteturais. |
| Review | **Owner** | Code review no PR. Único approver obrigatório — Gate 3. |
| Deploy | Executor | Aprova deploy após validação do QA (Gate 4). Supervisiona o pipeline de CD. |

#### Dev Sênior
**Ferramentas:** GitHub Copilot · Claude

| Etapa | Papel | Atividade |
|---|---|---|
| Spec | Consultor | Contribui com perspectiva técnica. Sinaliza inviabilidades técnicas. |
| Plan | Revisor | Valida estimativas e abordagens no `plan.md`. |
| Tasks | **Owner** | Decompõe o plan em `tasks.md` com Copilot + skills do projeto. Tasks atômicas e testáveis. |
| Implement | **Owner** | Implementa com Copilot inline. Segue skills do projeto. Cria testes unitários e de integração. |
| Review | Autor do PR | Abre PR com descrição estruturada. Responde comentários do TL. |
| Deploy | Suporte | Disponível para hotfix pós-deploy. |

#### Dev Pleno
**Ferramentas:** GitHub Copilot · Claude

| Etapa | Papel | Atividade |
|---|---|---|
| Spec | Leitura obrigatória | Lê `requirements.md` e levanta dúvidas de domínio antes do Gate 1. |
| Plan | Contribuidor | Fornece estimativas das tasks que vai executar. Sinaliza impedimentos antes do plano ser fechado. |
| Tasks | Colaborador | Apoia Dev Sênior na decomposição de tasks. Usa Copilot para geração inicial. |
| Implement | **Owner** | Implementa tasks atribuídas. Pair programming com Copilot. Tira dúvidas com Claude antes de escalar para o TL. |
| Review | Autor do PR | Abre PR. Participa do review como aprendizado (não é approver obrigatório). |
| Deploy | Observador | Acompanha o deploy junto ao TL. Disponível para hotfix imediato. Aprende o processo de rollout e o ambiente de produção. |

#### QA
**Ferramentas:** Claude · Claude Cowork

| Etapa | Papel | Atividade |
|---|---|---|
| Spec | Revisor | Valida testabilidade dos critérios de aceite. Sinaliza requisitos ambíguos. |
| Plan | Revisor | Verifica se o plano inclui estratégia de testes coerente com os cenários de falha do Discovery. |
| Tasks | Consultor | Valida que tasks de implementação incluem tasks de teste correspondentes. |
| Implement | Paralelo | Gera casos de teste com Claude e Cowork à medida que o código avança. Usa chunks do Anexo B como fixtures realistas. |
| Review | Revisor | Valida cobertura de testes no PR. Verifica se cenários de falha do Discovery estão cobertos. |
| Deploy | **Approver** | Gate 4: aprova suficiência de testes antes do deploy. Executa smoke test pós-deploy. |

#### Delivery Manager
**Ferramentas:** Claude · Claude Cowork · Azure DevOps

| Etapa | Papel | Atividade |
|---|---|---|
| Spec | Facilitador | Garante que `requirements.md` seja iniciado. Usa Cowork para criar tasks no Azure DevOps a partir da spec. |
| Plan | Facilitador | Acompanha elaboração do plan. Atualiza board com estimativas. |
| Tasks | Facilitador | Garante que tasks sejam criadas no DevOps após aprovação do Gate 2. Usa Cowork para relatório de capacidade. |
| Implement | Monitor | Acompanha progresso via DevOps. Usa Cowork para status reports e identificação de riscos de prazo. |
| Review | Monitor | Acompanha ciclo de PRs. Escala se review travar por mais de 24h. |
| Deploy | Comunicador | Usa Cowork para gerar release notes e comunicado para stakeholders NovaTech. |

---

### Validation Gates — Checkpoints Humanos

#### GATE 1 — Spec → Plan
**Quem aprova:** Tech Lead (obrigatório) + Product Specialist (co-autor da spec)  
**Tempo limite:** 1 dia útil após entrega do `requirements.md`

**O que verifica:**
- Cada requisito tem critério de aceite verificável (não ambíguo)
- Todos os módulos afetados estão identificados
- Não há contradição com ADRs existentes
- Escopo está dentro do que foi validado no Discovery

**Se reprovar:** PS revisa a spec com base nos comentários do TL. Nenhuma linha de `plan.md` é iniciada até aprovação. DM ajusta prazo no board.

---

#### GATE 2 — Tasks → Implement
**Quem aprova:** Tech Lead (obrigatório)  
**Tempo limite:** 4 horas úteis após entrega do `tasks.md`

**O que verifica:**
- Cada task é atômica (concluível em no máximo 1 dia)
- Toda task tem critério de "done" explícito
- Há tasks de teste para cada task de implementação
- Dependências entre tasks estão mapeadas
- Nenhuma task exige decisão arquitetural ainda não resolvida

**Se reprovar:** Dev Sênior refina as tasks apontadas. Tasks aprovadas podem iniciar; tasks reprovadas ficam bloqueadas até correção.

---

#### GATE 3 — Code → Merge
**Quem aprova:** Tech Lead (1 approval obrigatório no PR)  
**Tempo limite:** 24 horas úteis após abertura do PR. DM escala se travar.

**O que verifica:**
- Código segue as coding standards do AGENTS.md
- Testes unitários presentes e passando no CI
- Código gerado por IA foi lido e entendido pelo Dev (não é "vibe coding")
- Sem credenciais ou dados hardcoded
- Tipos TypeScript corretos (sem `any` não justificado)

**Se reprovar:** Dev resolve os comentários e solicita re-review. Merge bloqueado no GitHub por regra de branch protection.

---

#### GATE 4 — Tests → Deploy
**Quem aprova:** QA (suficiência de testes) + Tech Lead (autoriza deploy)  
**Tempo limite:** 4 horas úteis após pipeline de CI verde

**O que verifica:**
- Todos os cenários de falha do Discovery estão cobertos por testes
- Testes de integração passando (incluindo mock de Azure AI Search)
- Casos de alucinação e chunks contraditórios testados (Anexo B)
- Cobertura de testes ≥ 80% nas camadas de serviço
- Nenhum teste e2e crítico falhando

**Se reprovar:** Dev escreve os testes faltantes ou corrige os falhos. Deploy bloqueado. TL e DM notificados para ajuste de cronograma.

---

## Ajustes realizados durante a conversa

### 1. Dev Pleno nas fases Spec e Plan
**Problema identificado:** Dev Pleno estava sem participação nas fases de Spec e Plan.  
**Correção:** Dev Pleno incluído com responsabilidades distintas do Sênior:
- **Spec** → leitura obrigatória + levanta dúvidas de domínio antes do Gate 1
- **Plan** → contribui com estimativas das tasks que vai executar

**Justificativa:** Sem input de quem vai executar, o plan gera tasks mal dimensionadas e surpresas na implementação. A distinção entre Sênior e Pleno é de nível de responsabilidade, não de presença/ausência.

### 2. Dev Pleno na fase Deploy
**Problema identificado:** Dev Pleno sem participação no Deploy.  
**Correção:** Dev Pleno incluído como **Observador** — acompanha o deploy junto ao TL, disponível para hotfix imediato, aprende o processo de rollout e o ambiente de produção.

### 3. Diagrama do ciclo redesenhado em SVG
**Problema:** Diagrama original não deixava os gates visíveis o suficiente.  
**Correção:** Substituído por SVG com blocos de fase, gates verticais com cadeado, seta de reprovação em vermelho tracejado e deploy em verde separado visualmente.

---

## Artefatos gerados

| Artefato | Arquivo |
|---|---|
| Workflow AI First (documento visual) | `workflow-ai-first-novatech.html` |
| Esta conversa | `conversa-workflow-ai-first.md` |
| Anexo A — Documentação NovaTech | `anexo-a-documentacao-simulada-novatech.md` |
| Anexo B — Chunks RAG | `anexo-b-chunks-referencia-rag.md` |
| Anexo C — Estrutura do repositório | `anexo-c-estrutura-repositorio.md` |
| Exercício 2 — Fase de Estruturação | `exercicio-2-fase-estruturacao.md` |


---

## Prompts da Interação

> Esta seção registra cada prompt enviado durante a conversa, na forma original e como template reutilizável.

---

### Prompt 1 — Salvar arquivos no projeto

**Original:**
```
Salvar os seguintes arquivos para serem usados neste projeto
[anexos: anexo-a, anexo-b, anexo-c, exercicio-2]
```

**Template reutilizável:**
```
Salve os seguintes arquivos para serem usados como referência neste projeto:
[liste os arquivos ou faça upload]
```

**Intenção:** Persistir documentos de referência no contexto do projeto para uso nas interações seguintes.

---

### Prompt 2 — Salvar contexto do cenário

**Original:**
```
Salve as informações do cenário: O projeto NovaTech foi aprovado. O discovery está 
concluído e a fase de entendimento produziu artefatos concretos: ADRs com decisões 
arquiteturais (modelo LLM, estratégia de contexto, tratamento de documentos 
contraditórios, build vs buy), uma spec de requisitos de produto para o pipeline de RAG, 
um protótipo funcional de RAG com ferramentas open-source, cenários de falha mapeados 
pelo QA, e um plano de testes inicial. Agora o time precisa estruturar o ambiente, os 
padrões e os artefatos que vão governar o desenvolvimento.
```

**Template reutilizável:**
```
Salve as informações do cenário do projeto:
- Nome do projeto: [nome]
- Cliente: [cliente]
- Fase atual: [fase]
- O que foi concluído: [artefatos da fase anterior]
- Objetivo da próxima fase: [objetivo]
- Stack técnica: [tecnologias]
- Repositório: [nome do repositório]
```

**Intenção:** Registrar em memória o estado atual do projeto para que o Claude mantenha contexto entre conversas.

---

### Prompt 3 — Salvar imagem da metodologia

**Original:**
```
Salve também os dados desta imagem, que serão usados para validar o modelo IA First DGS
[upload: imagem do diagrama DGS AI First SDLC]
```

**Template reutilizável:**
```
Salve as informações desta imagem em memória. Ela representa [descrição do que é a imagem]
e será usada como referência para [finalidade].
[upload da imagem]
```

**Intenção:** Extrair e persistir informações de um diagrama visual para uso como referência metodológica nas interações seguintes.

---

### Prompt 4 — Salvar lista de ferramentas

**Original:**
```
Salve também uma lista das ferramentas disponíveis no projeto:
* GitHub Copilot (ativo para todos os devs e Tech Lead)
* Claude (disponível para todo o time)
* Claude Cowork (disponível para papéis não-dev)
* Claude Design (disponível para Product Specialist)
* Azure DevOps para boards e tracking
* GitHub para repositório e CI/CD
```

**Template reutilizável:**
```
Salve as ferramentas disponíveis no projeto, indicando para cada uma:
- Nome da ferramenta
- Quem tem acesso (papel/perfil)
- Finalidade principal no projeto
```

**Intenção:** Registrar o toolset do projeto para que o Claude saiba quais ferramentas atribuir a cada papel ao gerar fluxos e orientações.

---

### Prompt 5 — Gerar o workflow AI First

**Original:**
```
Preciso definir como o time vai trabalhar no modelo AI First DGS: quais ferramentas cada 
papel usa, qual o fluxo de trabalho, e quais são os checkpoints humanos (validation gates), 
usando os documentos anexados, e seguindo o modelo IA First DGS, como um gerente de 
projetos elabore um fluxo de trabalho que mapeie, para cada papel do time, quais 
ferramentas de IA usa e em qual etapa do ciclo 
(Spec → Plan → Tasks → Implement → Review → Deploy).
```

**Template reutilizável:**
```
Atuando como [papel] e usando os documentos de referência do projeto, elabore um 
fluxo de trabalho que mapeie:
1. Para cada papel do time ([lista de papéis]), quais ferramentas de IA utiliza
2. Em qual etapa do ciclo cada papel atua ([etapas do ciclo])
3. Quais são os checkpoints humanos obrigatórios (validation gates) entre etapas

Referências: [metodologia adotada], ferramentas disponíveis: [lista de ferramentas]
```

**Intenção:** Gerar um documento visual e estruturado que governe como o time vai trabalhar com IA em cada fase do desenvolvimento, com responsabilidades claras por papel.

---

### Prompt 6 — Questionar origem de informação

**Original:**
```
De onde veio a informação de que teremos DEV Senior e Pleno?
```

**Template reutilizável:**
```
De onde veio a informação de [dado específico presente na resposta]?
Qual documento ou trecho embasa essa afirmação?
```

**Intenção:** Rastrear a fonte de uma informação gerada pelo Claude para validar sua procedência — boa prática para evitar alucinações em contextos de projeto.

---

### Prompt 7 — Questionar lacuna no fluxo

**Original:**
```
Não faz sentido o Dev Pleno também participar da fase de Spec e Plan?
```

**Template reutilizável:**
```
Não faz sentido [papel] também participar de [etapa(s)]?
Revise o fluxo considerando [justificativa ou preocupação].
```

**Intenção:** Identificar e corrigir lacunas no fluxo gerado, desafiando ausências que não fazem sentido do ponto de vista do processo real de desenvolvimento.

---

### Prompt 8 — Solicitar correção após validação

**Original:**
```
sim
```

**Template reutilizável:**
```
Confirmo. Aplique a correção no documento.
```

**Intenção:** Confirmar e aplicar um ajuste discutido na interação anterior. Prompt curto e direto após validação de raciocínio.

---

### Prompt 9 — Identificar outra lacuna

**Original:**
```
e do Deploy?
```

**Template reutilizável:**
```
E a participação de [papel] na fase de [etapa]? Revise e corrija se necessário.
```

**Intenção:** Iterar sobre o documento gerado identificando novas lacunas de forma incremental, sem precisar reescrever o prompt anterior.

---

### Prompt 10 — Melhorar o diagrama visual

**Original:**
```
AJUSTAR MELHOR A IMAGEM PARA APARECER O DESENHO DOS GATES
```

**Template reutilizável:**
```
Redesenhe o diagrama do ciclo de desenvolvimento para que os [elementos específicos] 
fiquem mais visíveis e claros. Inclua: [o que deve aparecer no diagrama].
Use SVG com [estilo/elementos desejados].
```

**Intenção:** Melhorar a clareza visual de um diagrama gerado, especificando o elemento que precisa de maior destaque.

---

### Prompt 11 — Salvar a conversa

**Original:**
```
Salve a conversa em .MD
```

**Template reutilizável:**
```
Salve o conteúdo desta conversa em um arquivo .md com:
- Contexto do projeto
- Decisões tomadas
- Artefatos gerados
- Ajustes realizados e justificativas
```

**Intenção:** Persistir o histórico da sessão de trabalho como documentação do projeto, incluindo raciocínio e decisões para consulta futura.

---

### Prompt 12 — Registrar os prompts

**Original:**
```
registrar os prompts da minha interação com o claude
```

**Template reutilizável:**
```
Registre todos os prompts que utilizei nesta conversa em duas versões:
1. Prompt original (como foi enviado)
2. Template reutilizável (versão genérica para outros projetos)
Inclua a intenção de cada prompt.
Adicione ao arquivo .md existente da conversa.
```

**Intenção:** Documentar os prompts utilizados como referência de engenharia de prompt, permitindo reutilização em projetos futuros com contexto diferente.

---

## Padrões identificados nesta sessão

Observações sobre o uso de prompts nesta interação:

| Padrão | Exemplo nesta conversa |
|---|---|
| **Salvar contexto antes de trabalhar** | Prompts 1–4 estabelecem contexto antes de qualquer geração |
| **Papel explícito** | "como um gerente de projetos" direciona o tom e a perspectiva da resposta |
| **Rastreabilidade** | "De onde veio essa informação?" valida a procedência antes de aceitar |
| **Iteração incremental** | Prompts curtos ("sim", "e do Deploy?") corrigem sem reescrever tudo |
| **Confirmação antes de corrigir** | Claude apresenta o raciocínio, usuário confirma, então aplica |
| **Persistência de artefatos** | Salvar em .md e .html garante que o trabalho não se perde ao fechar a conversa |

