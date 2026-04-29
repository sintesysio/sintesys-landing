# Réguas de Nutrição — Drip Campaigns Mailchimp

> Ultima atualização: 29 de março de 2026
> Plataforma: Mailchimp (us14) — Customer Journeys
> Público-alvo: PMI italiane (10-50 dipendenti)

Este documento define as duas réguas de nutrição completas para a Il Consigliere, segmentadas por tipo de lead. Cada régua é acionada automaticamente pela tag aplicada no momento da inscrição pelo backend do site.

---

## Régua 1: Lead Simples (Tag "Lead")

**Duração total**: 28 dias (4 semanas)
**Objetivo**: Educar, construir confiança e converter em lead qualificado (agendamento de audit)
**Acionador**: Tag "Lead" adicionada ao contato (formulário do popup/Giornale)

### Sequência de Emails

| Dia | Assunto | Objetivo | CTA |
|---|---|---|---|
| 0 | *\|FNAME\|*, ecco la tua Guida alla Transizione 5.0 | Welcome + entrega do lead magnet | Scarica la Guida |
| 3 | *\|FNAME\|*, [email por setor — ver templates-settore.md] | Valor específico para o setor do lead | Prenota Audit |
| 7 | Il 72% delle PMI italiane sa che deve innovare, ma non agisce | Educação: gap entre intenção e ação | Leggi Il Giornale |
| 10 | *\|FNAME\|*, 3 errori che le PMI commettono con l'IA | Educação: erros comuns a evitar | Prenota Audit |
| 14 | Transizione 5.0: la scadenza si avvicina | Urgência: incentivos fiscais com prazo | Prenota Audit |
| 21 | *\|FNAME\|*, un imprenditore del suo settore ha risparmiato il 30% | Social proof: caso studio do setor | Prenota Audit |
| 28 | Ultima opportunità: 30 minuti che possono cambiare la sua azienda | Último push: oferta de audit gratuito | Prenota Audit |

### Detalhamento dos Emails

**Dia 0 — Welcome + Guida** (já implementado, Template ID: 10054956)

Entrega imediata da Guida alla Transizione 5.0. Estatísticas de impacto, capítulos da guia e CTA para download. Já ativo no Mailchimp como Customer Journey ID 7061.

**Dia 3 — Email por Setor**

Email segmentado pela tag de setor do lead. Conteúdo específico com 3 aplicações concretas da IA no setor do lead, dados de ROI e CTA para agendamento. Templates completos disponíveis em `email-templates-settore.md`.

**Dia 7 — Gap Intenzione vs. Azione**

Conteúdo educacional baseado nos dados do Politecnico di Milano: 87% dos empresários reconhecem a necessidade de inovar, mas menos de 30% agiram. Posiciona a Il Consigliere como a ponte entre intenção e ação. CTA suave para o Giornale dell'IA (mantém engajamento sem pressão de venda).

**Dia 10 — 3 Erros Comuns**

Conteúdo de valor que aborda os 3 erros mais comuns que PMIs cometem ao implementar IA: (1) começar sem estratégia, (2) ignorar os incentivos fiscais, (3) tentar fazer sozinho sem consultoria especializada. Cada erro é seguido pela solução que a Il Consigliere oferece.

**Dia 14 — Urgência Transizione 5.0**

Email focado na urgência dos incentivos fiscais. Destaca que os fundos de Transizione 5.0 são limitados e que as empresas que se movem primeiro capturam os melhores benefícios. Inclui timeline de scadenze e CTA direto para agendamento.

**Dia 21 — Caso Studio por Setor**

Email com caso studio (real ou representativo) de uma PMI do mesmo setor do lead que implementou IA com a Il Consigliere. Inclui métricas de antes/depois (eficiência, custos, tempo economizado) e citação do empresário.

**Dia 28 — Último Push**

Email final da régua com tom de "última oportunidade". Recapitula o valor oferecido nos emails anteriores, reforça que o audit é gratuito e sem compromisso, e apresenta uma oferta de tempo limitado (ex: "prenota entro venerdì e ricevi un report personalizzato extra").

### Regras de Saída

O lead sai da régua automaticamente se:
- Agendar um audit (tag "Qualificato" adicionada) — migra para Régua 2
- Cancelar a inscrição (unsubscribe)
- Não abrir nenhum email nos últimos 14 dias (move para lista de re-engagement)

---

## Régua 2: Lead Qualificado (Tag "Qualificato")

**Duração total**: 14 dias (2 semanas)
**Objetivo**: Confirmar agendamento, preparar para a reunião e garantir comparecimento
**Acionador**: Tag "Qualificato" adicionada ao contato (formulário da Landing Page ou Contattaci)

### Sequência de Emails

| Dia | Assunto | Objetivo | CTA |
|---|---|---|---|
| 0 | *\|FNAME\|*, il suo Audit IA Gratuito è confermato | Welcome + confirmação do audit | Conferma Disponibilità |
| 1 | Cosa preparare per la sua sessione con Lamberto | Preparação: o que esperar da reunião | Nenhum (informativo) |
| 3 | *\|FNAME\|*, [email por setor — insights avançados] | Valor avançado para o setor | Leggi Il Giornale |
| 7 | Promemoria: la sua sessione strategica | Lembrete da reunião agendada | Conferma Appuntamento |
| 14 | *\|FNAME\|*, come è andata? | Follow-up pós-reunião | Lascia una Recensione |

### Detalhamento dos Emails

**Dia 0 — Confirmação do Audit** (já implementado, Template ID: 10054957)

Confirmação imediata com os 3 próximos passos (análise do perfil, contato em 24h, sessão de 30min). CTA para confirmar disponibilidade. Já ativo no Mailchimp como Customer Journey ID 7062.

**Dia 1 — Preparação para a Reunião**

Email informativo que prepara o lead para a sessão estratégica. Inclui: (1) o que Lamberto vai analisar, (2) 3 perguntas que o lead deve se fazer antes da reunião (qual processo consome mais tempo? onde estão os maiores custos? qual o objetivo de crescimento para os próximos 12 meses?), (3) o que esperar como resultado (report com 3+ oportunidades concretas e estimativa de ROI).

**Dia 3 — Insights Avançados por Setor**

Versão avançada do email por setor, com dados mais profundos e casos studio detalhados. Diferente da Régua 1, este email assume que o lead já está engajado e busca validação da decisão de agendar o audit.

**Dia 7 — Promemoria**

Lembrete gentil da sessão agendada. Inclui link para confirmar/reagendar e um "preview" do que será discutido (baseado nas informações do formulário: setor, faturamento, número de funcionários).

**Dia 14 — Follow-up Pós-Reunião**

Email de follow-up enviado 14 dias após a inscrição (tipicamente 7 dias após a reunião). Pede feedback sobre a experiência, oferece link para deixar uma avaliação e apresenta os próximos passos para quem deseja prosseguir com a implementação.

### Regras de Saída

O lead sai da régua automaticamente se:
- Converter em cliente (tag "Cliente" adicionada)
- Cancelar a inscrição (unsubscribe)
- Solicitar não receber mais emails

---

## Métricas de Acompanhamento

| Métrica | Meta Régua 1 | Meta Régua 2 |
|---|---|---|
| Taxa de abertura | > 35% | > 50% |
| Taxa de clique | > 5% | > 10% |
| Conversão para Qualificato | > 8% (em 28 dias) | N/A |
| Comparecimento na reunião | N/A | > 75% |
| Conversão para Cliente | N/A | > 20% |
| Taxa de unsubscribe | < 2% | < 1% |

---

## Implementação no Mailchimp

### Régua 1 — Customer Journey

1. **Trigger**: Tag "Lead" adicionada
2. **Wait**: 3 dias → Email por setor (condição: tag de setor)
3. **Wait**: 4 dias → Email gap intenzione/azione
4. **Wait**: 3 dias → Email 3 erros comuns
5. **Wait**: 4 dias → Email urgência Transizione 5.0
6. **Wait**: 7 dias → Email caso studio
7. **Wait**: 7 dias → Email último push
8. **Exit**: Tag "Qualificato" adicionada OU unsubscribe

### Régua 2 — Customer Journey

1. **Trigger**: Tag "Qualificato" adicionada
2. **Wait**: 1 dia → Email preparação
3. **Wait**: 2 dias → Email insights avançados
4. **Wait**: 4 dias → Email promemoria
5. **Wait**: 7 dias → Email follow-up
6. **Exit**: Tag "Cliente" adicionada OU unsubscribe

### Segmentação por Setor

A condição de setor no Dia 3 de ambas as réguas usa a tag de setor aplicada pelo backend. Se o lead não tem tag de setor (ex: "Altro" ou "Tecnologia"), recebe um email genérico com os 3 benefícios mais comuns da IA para PMIs.

---

## Próximos Passos

1. Configurar os Customer Journeys no Mailchimp com os delays e condições acima
2. Criar os templates HTML no Mailchimp para cada email (usar o design system do Giornale dell'IA)
3. Configurar as regras de saída (exit conditions) em cada journey
4. Testar o fluxo completo com um email de teste
5. Ativar as réguas e monitorar as métricas semanalmente
