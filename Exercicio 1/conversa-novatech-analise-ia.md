# Exportação de Conversa — Projeto NovaTech / Análise de Viabilidade IA
**Data:** Junho/2026  
**Projeto:** Assistente de IA — NovaTech Logística  
**Contexto:** Sessão de trabalho entre PM e Claude para elaboração do Relatório de Riscos Técnicos direcionado à Diretoria DB1

---

## Mensagem 1 — Usuário
Envio dos arquivos de documentação da NovaTech para o projeto:
- `anexo-a-documentacao-simulada-novatech.md`
- `exercicio-fase-1-entendimento.md`
- `anexo-b-chunks-referencia-rag.md`
- `FAQ-atendimento.md`
- `POL-001-politica-devolucao.md`
- `PROC-042-frete-especial-v1.md`
- `PROC-042-v2-frete-especial-revisado.md`
- `SLA-2024-tabela-sla-clientes.md`

> "salvar os arquivos na pasta do projeto"

## Resposta 1 — Claude
Os 8 arquivos foram salvos no projeto.

---

## Mensagem 2 — Usuário
> "Como um gerente de projetos responsável pela análise da viabilidade do uso de IA em um novo projeto faça um relatório direcionado a diretoria da DB1 destacando os riscos técnicos que podem impactar prazo e custo para isso faça uma análise no cenário e informações adicionais abaixo"

**Cenário fornecido:**
- NovaTech: empresa de médio porte, logística, 1.200 funcionários
- Documentação espalhada em SharePoint (~800 docs), Confluence (~400 páginas) e pasta de rede (~50 planilhas)
- 45 atendentes gastam 12 min/chamado buscando informações
- 320 chamados/dia, ~60% com consulta documental
- Objetivo: reduzir tempo de busca de 12 para menos de 2 minutos
- Prazo: 3 meses (discovery + desenvolvimento + go-live)
- Stack: Microsoft 365 E3 + Azure AI Services
- Relatório com máximo 2 páginas, destacando contradições encontradas

## Resposta 2 — Claude
Geração do relatório Word (`relatorio-riscos-novatech-db1.docx`) com as seções:
1. Contexto Executivo
2. Contradições Identificadas na Documentação
3. Mapa de Riscos Técnicos
4. Análise Detalhada dos Principais Riscos
5. Recomendações à Diretoria DB1
6. Conclusão

**Contradições identificadas:**
- PROC-042 v1 vs v2: multiplicadores de frete e prazos conflitantes
- POL-001 vs FAQ-Atendimento: regra de devolução de carga perigosa divergente
- Desconto de volume: limiares e mecanismo conflitantes entre versões

---

## Mensagem 3 — Usuário
> "Ajustar o documento para apenas 2 páginas"

## Resposta 3 — Claude
Documento reestruturado e compactado para 2 páginas, consolidando seções e reduzindo espaçamentos. Conteúdo reorganizado em 4 seções mais densas mantendo todas as informações críticas.

---

## Mensagem 4 — Usuário
> "A data do documento está errada"

## Resposta 4 — Claude
Qual a data correta que devo colocar no documento?

---

## Mensagem 5 — Usuário
> "o mês está correto, mas o ano correto é 2026"

## Resposta 5 — Claude
Todas as datas corrigidas de 2025 para **Junho/2026** — cabeçalho, rodapé, subtítulo e assinatura.

---

## Mensagem 6 — Usuário
> "Senti falta do contexto sobre o que a novatech faz, nas contradiçoes faltou uma análise da resolução dos riscos gerados. no mapa de risco senti falta de um contexto sobre o que é a dimensão incluída na planilha"

## Resposta 6 — Claude
Três ajustes realizados no documento:

1. **Contexto da NovaTech** — seção 1 apresenta a empresa (logística e transporte de cargas, 1.200 funcionários, tiers Gold/Silver/Standard) antes de introduzir o projeto.

2. **Coluna "Resolução recomendada"** adicionada à tabela de contradições:
   - PROC-042: depreciar formalmente a v1 e definir v2 como única versão vigente
   - Carga perigosa: remover/sinalizar FAQ como não normativo para temas críticos
   - Desconto de volume: consolidar em documento único com vigência definida

3. **Legenda da coluna Dimensão** — box explicativo antes do mapa de riscos: Prazo (atraso na entrega), Custo (impacto no orçamento), Legal (exposição jurídica/compliance) e Adoção (risco de baixa aceitação pós go-live).

---

## Mensagem 7 — Usuário
> "Claude como você chegou na informação de que 3 meses são insuficientes?"

## Resposta 7 — Claude
Essa conclusão foi uma **inferência**, não está explicitamente nos documentos fornecidos pela NovaTech. Foi baseada na combinação de fatores do cenário:
- ~1.250 documentos em 3 formatos distintos exigindo conectores e pipelines diferentes
- Documentação com versões conflitantes que precisam de curadoria prévia
- Ausência de processo unificado de revisão entre 3 áreas
- Integração com Azure AI Search + Microsoft Teams
- Ciclos de ajuste de prompt, chunking e validação

Duas opções apresentadas: manter o risco com ressalva de que é avaliação técnica da DB1, ou reformular como "cronograma a validar no Discovery".

---

## Mensagem 8 — Usuário
> "eu faria uma junção entre as duas, colocaria no documento que a novatech possui um orçamento para 3 meses de projetos, mas que é importante uma avaliação do discovery para garantir que o tempo é suficiente para isso"

## Resposta 8 — Claude
Ajuste realizado em dois pontos:

- **Mapa de riscos:** risco reformulado de *"Cronograma de 3 meses insuficiente"* (Alto/Alta) para *"Cronograma de 3 meses a validar no Discovery"* (Médio/Média)
- **Recomendações:** substituído "revisar para 4 meses" por orientação de que a NovaTech possui orçamento para 3 meses, devendo o Discovery confirmar a viabilidade antes do fechamento do cronograma

---

## Mensagem 9 — Usuário
> "Neste parte Alucinação por lacunas de cobertura documental sugeriria como mitigação a adoção de um padrão de uso obrigatório"

## Resposta 9 — Claude
Atualizado em dois pontos:

- **Mapa de riscos:** mitigação passou para *"Adotar padrão de uso obrigatório: o assistente só responde dentro das coberturas documentais homologadas; perguntas fora do escopo são redirecionadas ao atendimento humano"*
- **Recomendações:** bullet atualizado detalhando que o padrão de uso deve ser documentado com redirecionamento obrigatório ao atendente humano

---

## Mensagem 10 — Usuário
> "Acha possível a adoção de um padrão na fonte dos documentos?"

## Resposta 10 — Claude
Sim — é uma das mitigações mais efetivas. Análise apresentada:

- **Governança documental unificada:** políticas normativas no SharePoint com controle de versão, procedimentos no Confluence, planilhas na pasta de rede com nomenclatura padronizada
- **Benefícios:** elimina coexistência de versões conflitantes, facilita configuração do pipeline RAG, simplifica atualização incremental pós go-live
- **Desafio:** depende de mudança de processo interno da NovaTech (3 áreas independentes)
- **Abordagem sugerida:** incluir no contrato como pré-condição do go-live, validado pelo Compliance

---

## Mensagem 11 — Usuário
> "inclua como recomendação"

## Resposta 11 — Claude
Adicionado como último bullet da seção de recomendações: adoção de padrão único de fonte por categoria documental como pré-condição do go-live, validado pelo Compliance da NovaTech.

---

## Mensagem 12 — Usuário
> "Senti falta de uma análise se é viável ou não a adoção de IA neste projeto"

## Resposta 12 — Claude
Pergunta de alinhamento: a leitura aponta para **viável com ressalvas** ou inviável?

---

## Mensagem 13 — Usuário
> "viável com ressalvas"

## Resposta 13 — Claude
Adicionada seção **4. Parecer de Viabilidade** em destaque verde com veredicto claro e quatro ressalvas:

1. Base documental precisa ser curada e versionada antes da indexação
2. FAQ-Atendimento não pode ser tratado como fonte normativa no estado atual
3. Prazo de 3 meses a confirmar no Discovery
4. Padrão único de fonte documental como condição de sustentabilidade

Seção de recomendações renumerada para **5**.

---

## Mensagem 14 — Usuário
> "antes de confirmar o prazo de 3 meses eu faria as seguintes perguntas ao tech lead, entende que faz sentido elas. 1 - Os conectores para as 3 fontes heterogêneas já têm viabilidade confirmada? 2 - Já foi validado acesso técnico às três, incluindo permissões de leitura, limites de rate e formato dos documentos retornados? 3 - Alguma das fontes exige conector customizado?"

## Resposta 14 — Claude
Faz sentido — as três perguntas atacam pontos distintos:

1. Valida se a integração é possível com ferramentas disponíveis ou se há risco de desenvolvimento adicional não previsto
2. Garante que o acesso não será bloqueado por permissão ou throttling no meio do projeto (risco real em ambientes SharePoint com políticas restritivas)
3. Maior impacto direto no prazo — um conector customizado pode consumir 2 a 3 semanas não previstas no escopo

Proposta: incluir as três como perguntas abertas ao tech lead dentro do parecer de viabilidade, sinalizando para a diretoria que há pontos técnicos a responder antes do fechamento do contrato.

---

## Mensagem 15 — Usuário
> "sim"

## Resposta 15 — Claude
Bullet do prazo no parecer de viabilidade expandido com as três perguntas ao tech lead, encerrando com a consequência: resposta negativa a qualquer uma representa risco direto de extensão de prazo e custo.

---

## Mensagem 16 — Usuário
> "exportar toda esta conversa"

## Resposta 16 — Claude
Exportação da conversa completa gerada neste arquivo.

---

## Artefatos gerados nesta sessão

| Arquivo | Descrição |
|---------|-----------|
| `relatorio-riscos-novatech-db1.docx` | Relatório de Riscos Técnicos — versão final (2 páginas) |
| `anexo-a-documentacao-simulada-novatech.md` | Documentação simulada NovaTech |
| `anexo-b-chunks-referencia-rag.md` | Chunks de referência do pipeline RAG |
| `exercicio-fase-1-entendimento.md` | Exercício fase 1 |
| `FAQ-atendimento.md` | FAQ do time de atendimento |
| `POL-001-politica-devolucao.md` | Política de devolução de mercadorias |
| `PROC-042-frete-especial-v1.md` | Procedimento frete especial v1 |
| `PROC-042-v2-frete-especial-revisado.md` | Procedimento frete especial v2 (revisado) |
| `SLA-2024-tabela-sla-clientes.md` | Tabela de SLA por tipo de cliente |

---

*Exportação gerada em Junho/2026 — DB1 Global Software*
