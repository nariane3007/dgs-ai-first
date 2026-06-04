# Conversa – Projeto Assistente IA NovaTech
**Data:** 04 de junho de 2026
**Participantes:** DB1 Global Software + Claude

---

## Contexto do Projeto

**Cliente:** NovaTech – empresa de médio porte do setor de logística (1.200 funcionários)

**Problema:** A equipe de atendimento ao cliente (45 pessoas) gasta em média 12 minutos por chamado buscando informações em documentações espalhadas em três fontes:
- SharePoint corporativo (~800 documentos em PDF e Word)
- Wiki interna no Confluence (~400 páginas)
- Pasta de rede com planilhas de referência atualizadas mensalmente

**Solução contratada:** A NovaTech contratou a DB1 para construir um assistente de IA integrado ao ambiente Microsoft (Teams + SharePoint), permitindo consultas em linguagem natural com respostas fundamentadas na documentação oficial.

**Informações adicionais:**
- Volume médio de 320 chamados/dia, dos quais ~60% envolvem consulta a documentação
- Documentação atualizada por 3 áreas (Operações, Compliance, Comercial) sem processo unificado de revisão
- Alguns documentos se contradizem entre versões
- NovaTech possui licenças Microsoft 365 E3 e está disposta a provisionar Azure AI Services
- Expectativa da diretoria: reduzir o tempo médio de busca de 12 para menos de 2 minutos por chamado

---

## E-mail do Diretor (entrada)

> "Estamos animados com o projeto. Nosso CEO viu uma demo do Copilot e quer algo parecido. A expectativa é que em 3 meses nosso time de atendimento não precise mais procurar nada manualmente. O assistente vai saber tudo."

---

## Iterações e Decisões ao Longo da Conversa

### Iteração 1 – Rascunho inicial
Gerado e-mail com tom consultivo abordando os três pontos solicitados:
- Respostas probabilísticas (por que a IA não "sabe tudo")
- Explicação do RAG e dependência da documentação-fonte
- 3 critérios de sucesso mensuráveis

**Critérios originais:**
1. Tempo médio de busca: de 12 para menos de 2 minutos
2. Taxa de adoção acima de 70% após 30 dias
3. Taxa de respostas com fonte identificada acima de 90%

---

### Iteração 2 – Correção: Copilot não é a solução
**Problema identificado:** O e-mail dava a entender que o Copilot seria a tecnologia utilizada.

**Correção aplicada:** Adicionado parágrafo deixando claro que o assistente será uma solução desenvolvida sob medida pela DB1, integrada ao ambiente Microsoft da NovaTech. O Copilot é mencionado apenas como referência de experiência desejada.

---

### Iteração 3 – Substituição de critério de sucesso
**Decisão:** Retirar um dos 3 critérios e substituir por um que responda ao CEO sobre retorno do investimento.

**Critério adicionado:**
> **Retorno em horas liberadas para o time** – 45 atendentes × ~192 chamados/dia com consulta × 10 min de economia = ~32 horas liberadas por dia, equivalente a quase 4 funcionários em tempo integral.

**Critério retirado:** Taxa de adoção acima de 70%

---

### Iteração 4 – Novo critério: confiabilidade das respostas
**Problema identificado:** Os critérios não respondiam à pergunta: *"E se o assistente repassar uma informação errada e isso gerar implicações para a empresa?"*

**Decisão:** Substituir o critério de "fonte identificada" por um critério de **confiabilidade das respostas**, medido por amostragem mensal com especialistas internos.

**Definição do %:** Não é possível definir a meta antes do projeto. A linha de base será estabelecida durante o piloto, e a meta será definida em conjunto com a NovaTech a partir dessa medição.

**Critérios finais:**
1. Tempo médio de busca reduzido de 12 para menos de 2 minutos por chamado
2. Confiabilidade das respostas medida por amostragem mensal (meta a definir após linha de base)
3. Retorno em horas liberadas para o time (~32h/dia)

---

### Iteração 5 – Ajuste de abertura do parágrafo sobre limitações da IA
**Problema identificado:** A frase *"A resposta curta é: não exatamente"* gerava impacto negativo logo de início.

**Correção aplicada:** O parágrafo passou a abrir diretamente com a analogia do funcionário que leu toda a documentação, chegando à limitação apenas no final, de forma contextualizada:

> *"Pense assim: um assistente de IA funciona como um funcionário muito ágil que leu toda a documentação da empresa. [...] Esse é o comportamento natural de qualquer tecnologia de IA hoje — inclusive no Copilot que o CEO viu."*

---

### Iteração 6 – Remoção do prazo de 3 meses
**Decisão:** Retirar a menção ao prazo de 3 meses do parágrafo de encerramento, pois ainda será validado durante o projeto.

**Frase ajustada:**
> *"acreditamos que o time de atendimento vai operar em um nível completamente diferente — mais rápido, mais consistente e com muito menos frustração."*

---

## E-mail Final

**Assunto:** Re: Assistente IA – Alinhando expectativas para um projeto de sucesso

---

Olá [Nome do Diretor],

Que ótima notícia saber que o CEO ficou animado com a demo do Copilot! Essa referência é muito útil para o projeto — ela nos mostra o tipo de experiência que vocês querem proporcionar ao time de atendimento.

Vale esclarecer um ponto importante: o assistente que a DB1 vai construir para a NovaTech não será o Copilot em si, mas uma solução desenvolvida sob medida para a realidade de vocês, integrada ao ambiente Microsoft que já utilizam (Teams + SharePoint) e alimentada pela documentação interna da empresa. A experiência para o usuário será parecida — perguntar em linguagem natural e receber respostas rápidas e fundamentadas — mas o que estará por trás será construído especificamente para as necessidades da NovaTech.

Gostaríamos de compartilhar alguns pontos importantes antes de começarmos — não para frear o entusiasmo, mas exatamente para garantir que o resultado supere as expectativas.

---

### 📌 O assistente vai saber tudo?

Pense assim: um assistente de IA funciona como um funcionário muito ágil que leu toda a documentação da empresa. Ele não guarda as respostas na memória como um banco de dados fixo — ele lê os documentos e, a partir do que encontra, formula a melhor resposta possível. Isso significa que ele pode acertar muito, mas em alguns casos pode errar ou ser impreciso, especialmente se a documentação for incompleta, desatualizada ou contraditória. Esse é o comportamento natural de qualquer tecnologia de IA hoje — inclusive no Copilot que o CEO viu.

Por isso, o assistente sempre indicará a fonte do que diz, para que o atendente possa checar quando necessário.

---

### 📚 Por que a qualidade da documentação é tão importante?

O assistente que vamos construir funciona assim:

1. Quando um atendente faz uma pergunta, o sistema busca os trechos mais relevantes da documentação interna.
2. Com esses trechos em mãos, a IA formula uma resposta clara e objetiva.

É como se o assistente fosse um pesquisador que abre os manuais, lê os trechos certos e explica em linguagem simples — só que faz isso em segundos.

O ponto crítico: o assistente só pode ser tão bom quanto os documentos que ele consulta. Se um documento estiver desatualizado, o assistente vai dar uma resposta desatualizada. Se dois documentos se contradizerem, o assistente vai ter dificuldade em saber qual seguir — o mesmo problema que o time de atendimento enfrenta hoje, aliás.

Identificamos que a NovaTech tem documentos atualizados por três áreas diferentes, sem um processo unificado de revisão — e alguns chegam a se contradizer entre versões. Antes ou durante o projeto, será fundamental trabalhar isso. A boa notícia: podemos ajudar a mapear e priorizar esse processo.

---

### ✅ Como vamos medir o sucesso?

Para garantir que o projeto entrega valor real — e não apenas uma demo impressionante — propomos três critérios objetivos de sucesso:

**1. Tempo médio de busca reduzido de 12 para menos de 2 minutos por chamado**
Esse é o principal objetivo declarado. Vamos medir antes e depois, com amostragem real do time de atendimento.

**2. Confiabilidade das respostas medida por amostragem mensal**
Sabemos que velocidade sem precisão não resolve — e essa é uma preocupação legítima. Por isso, durante o piloto, vamos separar uma amostra de perguntas reais e pedir que especialistas das áreas de Operações, Compliance e Comercial avaliem se as respostas estão corretas. Esse processo vai nos dar uma linha de base real de acurácia, e a meta será definida em conjunto com a NovaTech a partir dessa medição — não antes. Isso garante uma promessa honesta e um compromisso que podemos de fato cumprir.

**3. Retorno em horas liberadas para o time**
Com 45 atendentes e ~192 chamados por dia que envolvem consulta à documentação, a economia de 10 minutos por chamado representa aproximadamente 32 horas liberadas por dia no time inteiro — o equivalente a quase 4 funcionários em tempo integral que hoje dedicam seu tempo apenas a buscar informação. Esse número torna o investimento tangível e mensurável, independentemente dos ajustes que faremos ao longo do caminho.

---

Estamos muito animados com o potencial desse projeto para a NovaTech. Com a documentação organizada e as expectativas alinhadas, acreditamos que o time de atendimento vai operar em um nível completamente diferente — mais rápido, mais consistente e com muito menos frustração.

Ficamos à disposição para uma conversa com o CEO e com o time, se fizer sentido antes do kick-off.

Abraço,
[Seu Nome]
DB1 Global Software
