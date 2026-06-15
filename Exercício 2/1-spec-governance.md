# Governança de Specs — NovaTech Assistant

> **Localização no repositório:** `docs/spec-governance.md`
> **Responsável:** Gerência de Projeto / Tech Lead
> **Revisão:** a cada ciclo de release ou quando o processo precisar de ajuste

---

## 1. Visão Geral

As specs SDD são o contrato escrito entre negócio, tecnologia e execução. Cada módulo do projeto passa por três artefatos em sequência — `requirements.md`, `plan.md` e `tasks.md` — e cada transição entre artefatos é um checkpoint humano explícito. Este documento define quem faz o quê, como os artefatos são nomeados, onde vivem e como mudanças são rastreadas.

---

## 2. Módulos e Pastas

Cada módulo tem pasta própria em `/specs/`. O nome da pasta é o slug do módulo — fixo, em kebab-case, nunca renomeado após a criação.

| Módulo | Pasta |
|---|---|
| Pipeline de ingestão de documentos | `specs/pipeline-ingestao/` |
| API de busca | `specs/query-endpoint/` |
| API de feedback | `specs/feedback-api/` |
| Bot do Teams | `specs/teams-bot/` |
| Painel web | `specs/painel-web/` |

Dentro de cada pasta existem exatamente três arquivos:

```
specs/{slug}/
├── requirements.md
├── plan.md
└── tasks.md
```

Nenhum outro arquivo vai para dentro dessas pastas. Materiais de apoio (diagramas, referências) ficam em `docs/`.

---

## 3. Responsáveis por Artefato

| Artefato | Quem cria | Quem aprova antes de avançar |
|---|---|---|
| `requirements.md` | Product Specialist | Tech Lead |
| `plan.md` | Tech Lead | Product Specialist + Dev Sênior |
| `tasks.md` | Dev (com apoio do Copilot) | Tech Lead |

**Regra de ouro:** nenhum artefato avança para o próximo sem aprovação explícita do revisor. A aprovação é registrada via PR — não por mensagem de chat.

---

## 4. Conteúdo Mínimo de Cada Artefato

### 4.1 `requirements.md` — O Quê

Escrito pelo **Product Specialist** antes de qualquer discussão técnica. Deve responder:

- **Contexto:** por que este módulo existe, que problema resolve para o atendente da NovaTech.
- **Usuários e papéis:** quem usa, quem administra, quem é impactado.
- **Requisitos funcionais:** o que o módulo deve fazer (numerados, ex: `RF-01`, `RF-02`).
- **Requisitos não-funcionais:** latência, disponibilidade, segurança, limites de volume.
- **Critérios de aceite:** condições objetivas que definem que o módulo está pronto.
- **Fora de escopo:** o que explicitamente *não* será feito nesta iteração.

Proibido neste artefato: decisões técnicas, escolhas de tecnologia, detalhes de implementação.

### 4.2 `plan.md` — O Como

Escrito pelo **Tech Lead** após aprovação do `requirements.md`. Deve responder:

- **Decisões arquiteturais:** escolhas de design relevantes para o módulo (com referência ao ADR correspondente quando existir).
- **Estrutura de código:** quais arquivos serão criados ou modificados em `/src/`, com responsabilidade de cada um.
- **Dependências:** serviços externos, pacotes, outros módulos do projeto.
- **Estratégia de testes:** o que será coberto em `unit/`, `integration/` e `e2e/`.
- **Riscos e mitigações:** o que pode dar errado e como será tratado.
- **Estimativa:** esforço em dias/pontos por tipo de entrega.

### 4.3 `tasks.md` — As Unidades de Execução

Gerado pelo **Dev com apoio do Copilot** a partir do `plan.md` aprovado. Cada tarefa deve ser:

- **Atômica:** implementável e testável de forma independente.
- **Verificável:** tem critério de done claro (ex: "função retorna X dado Y input", "teste passa").
- **Referenciada:** aponta para o arquivo em `/src/` que será criado ou modificado.

Formato de cada tarefa:

```markdown
## TASK-{MODULO}-{N}: {Título da tarefa}

**Arquivo:** `src/{caminho/para/arquivo.ts}`
**Depende de:** TASK-{MODULO}-{N-1} (se houver)
**Estimativa:** {X}h

### Contexto
{Por que esta tarefa existe — qual problema resolve, qual RF do requirements.md endereça, e qual o ganho concreto para o atendente da NovaTech quando ela estiver pronta.}

### O que fazer
{Descrição objetiva da implementação}

### Critério de done
- [ ] {Condição verificável 1}
- [ ] {Condição verificável 2}
```

Exemplos de slugs de módulo para IDs: `INGEST`, `QUERY`, `FEEDBACK`, `BOT`, `WEB`.

---

## 5. Fluxo de Aprovação — Gates de Spec

```
requirements.md  ──► [GATE 1] ──► plan.md  ──► [GATE 2] ──► tasks.md  ──► Implementação
```

Os Gates são checkpoints humanos obrigatórios. Nenhum artefato seguinte é iniciado sem aprovação explícita. PRs são reservados para aprovação de código (Gates 3 e 4 do ciclo de desenvolvimento — fora do escopo deste documento).

---

### GATE 1 — requirements.md → plan.md

**Quem aprova:** Tech Lead (obrigatório) + Product Specialist (co-autor)
**Tempo limite:** 1 dia útil após entrega do `requirements.md`

**Checklist de aprovação:**
- [ ] Cada requisito tem critério de aceite verificável (não ambíguo)
- [ ] Todos os módulos afetados estão identificados
- [ ] Não há contradição com ADRs existentes
- [ ] Escopo está dentro do que foi validado no Discovery
- [ ] "Fora de escopo" está explícito
- [ ] Nenhuma decisão técnica foi tomada no documento

**Se reprovar:** Product Specialist revisa com base nos comentários do Tech Lead. Nenhuma linha de `plan.md` é iniciada até aprovação. Delivery Manager ajusta prazo no board.

---

### GATE 2 — tasks.md → Implementação

**Quem aprova:** Tech Lead (obrigatório)
**Tempo limite:** 4 horas úteis após entrega do `tasks.md`

**Checklist de aprovação:**
- [ ] Cada task é atômica (concluível em no máximo 1 dia)
- [ ] Toda task tem critério de done explícito com checkboxes
- [ ] Toda task tem campo Contexto preenchido
- [ ] Há tasks de teste para cada task de implementação
- [ ] Dependências entre tasks estão mapeadas
- [ ] Nenhuma task exige decisão arquitetural ainda não resolvida
- [ ] Todo RF do `requirements.md` está endereçado no conjunto de tasks

**Se reprovar:** Dev refina as tasks apontadas. Tasks aprovadas podem iniciar; tasks reprovadas ficam bloqueadas até correção.

---

## 6. Versionamento

As specs são versionadas via Git — o histórico de commits é o log de versões. Não existe número de versão manual dentro dos arquivos.

Convenções de commit para specs:

| Ação | Mensagem de commit |
|---|---|
| Criar artefato novo | `spec({slug}): add {artefato}` |
| Revisar após feedback | `spec({slug}): revise {artefato} — {motivo curto}` |
| Atualizar após mudança de escopo | `spec({slug}): update {artefato} — scope change` |
| Corrigir erro pontual | `spec({slug}): fix {artefato} — {descrição}` |

Exemplos:

```
spec(query-endpoint): add requirements
spec(query-endpoint): revise requirements — latency SLA ajustado para 2s
spec(pipeline-ingestao): add plan
spec(feedback-api): update tasks — scope change aprovado em 2025-08-12
```

---

## 7. Rastreamento de Mudanças

### 7.1 Mudanças durante a fase de especificação (antes da implementação)

Qualquer alteração em spec já mergeada exige um novo PR com:

- Motivo da mudança descrito no corpo do PR
- Referência ao item que motivou a mudança (issue no Azure DevOps, decisão de reunião, ADR)
- Re-aprovação pelo mesmo conjunto de revisores do artefato original

### 7.2 Mudanças após início da implementação

Se uma spec precisar mudar depois que a implementação começou:

1. Abrir uma **issue no Azure DevOps** descrevendo o impacto
2. Tech Lead avalia se a mudança afeta `plan.md` e/ou `tasks.md`
3. PR de atualização da spec com referência à issue
4. Tasks já concluídas que são impactadas voltam para "in progress" no board

### 7.3 O que não muda retroativamente

`requirements.md` aprovado e em produção não é editado — é substituído por uma nova iteração com escopo incremental. Isso preserva o histórico de intenção do negócio.

---

## 8. Relação com outros artefatos do projeto

| Artefato | Relação com as specs |
|---|---|
| `AGENTS.md` | Define como agentes de IA devem ler e usar as specs durante a implementação |
| `docs/adr/` | ADRs referenciados no `plan.md` justificam decisões arquiteturais |
| `prompts/system-prompt.md` | Não é uma spec SDD — tem governança própria via `prompt-changelog.md` |
| `/skills/` | Skills usadas pelo Dev durante a geração de `tasks.md` e implementação |
| Azure DevOps | Issues e boards rastreiam o progresso das tasks definidas nas specs |

---

*Documento mantido por: Gerência de Projeto — NovaTech Assistant*
*Última revisão: início da Fase 2 (Estruturação)*
