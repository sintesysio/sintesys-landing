---
name: ilconsigliere-ads
description: Manage paid advertising campaigns (Meta Ads + Google Ads) for Il Consigliere. Use for creating ad campaigns, generating ad creatives and copy, monitoring KPIs (CPC, CPM, CTR, ROAS, CPL, CAC), optimizing budgets, producing daily performance reports on Notion, and making data-driven optimization recommendations. Integrates with ilconsigliere-content for organic+paid synergy. Follows a 5+5+5 funnel creative distribution (TOFU/MOFU/BOFU).
---

# Il Consigliere — Agente Anunciante (Performance Ads)

Manage the full paid advertising lifecycle for Il Consigliere across Meta Ads and Google Ads. Target audience: Italian SME owners (10-50 employees, €1.8M-€12M/year revenue).

## Diretriz Estrategica da Conta (CRITICO)

O objetivo central da Il Consigliere e **construir uma audiencia qualificada de empresarios de PMIs italianas** para, no momento certo, vender solucoes de IA (consultoria de transformacao operacional). A estrategia segue 3 fases sequenciais:

1. **Fase Atual (Meses 1-3): Distribuicao de Conteudo** — Todo o investimento em ads deve focar em distribuir o conteudo editorial "Il Giornale dell'IA" para atrair visitantes ao perfil do Instagram e converter em seguidores. NAO vender. NAO gerar leads de venda. Apenas crescer a audiencia.
2. **Fase 2 (Meses 4-6): Aquecimento e Captura** — Introduzir campanhas MOFU/BOFU para capturar leads via newsletter e lead magnets (Guia Transizione 5.0, Audit Gratuito). Continuar distribuicao TOFU.
3. **Fase 3 (Meses 7+): Conversao** — Ativar campanhas BOFU com CTA de agendamento de consultoria. Retargeting agressivo sobre base aquecida.

**Regra de Ouro da Distribuicao**: Os anuncios devem parecer conteudo nativo do feed (manchete de jornal), NAO anuncios tradicionais. O objetivo do TOFU e exclusivamente **visitas ao perfil + novos seguidores**. O objetivo de campanha no Meta Ads deve ser Engagement (Profile Visits) ou Awareness (Reach), NUNCA conversao nos primeiros 3 meses.

**Funil de Distribuicao de Conteudo (Fase Atual)**:
- TOFU (50% budget Meta): Impulsionar posts de "Noticias Quentes" (Pilastro 1) para publico frio → Visitas ao perfil
- MOFU (30% budget Meta): Distribuir conteudo "Passado vs IA" e "Curiosidades" (Pilastros 2-3) para retargeting → Engajamento
- BOFU (20% budget Meta): Conteudo premium + Lead Magnet → Leads para Newsletter (soft CTA apenas)

## Integration with ilconsigliere-content

This skill works alongside `ilconsigliere-content` (organic Instagram). Coordination rules:

- Organic content follows "Il Giornale dell'IA" editorial strategy — ads amplify the same narrative
- Ad creatives reuse visual identity and tone from organic content
- Retargeting audiences include Instagram engagement from organic posts
- Performance insights from ads inform organic content topics (high-performing ad themes become organic posts)
- Both skills share the same Notion workspace for task tracking

## Notion Connection

| Resource | ID |
|---|---|
| Database "Tarefas" | `8b43c788-4339-826f-8d1d-01cc33289697` |
| Data Source ID | `a4e3c788-4339-837d-af42-87c47cfbfe2f` |
| Parent Page "Il Consigliere" | `3f83c788-4339-8231-bd43-01bbf284ba5c` |

## Core Workflow

The Agente Anunciante operates in 6 sequential workflows:

1. **Planejamento de Campanha** — Define strategy, budget, audiences
2. **Criacao de Criativos** — Generate 15 ad creatives (5 per funnel stage)
3. **Lancamento** — Set up campaigns on platforms
4. **Monitoramento Diario** — Track KPIs and produce daily Notion report
5. **Otimizacao** — Data-driven adjustments (budget, creative, audience)
6. **Reporting Estrategico** — Weekly/monthly synthesis with recommendations

## Workflow 1: Planejamento de Campanha

### Actions

1. Define monthly budget and platform split (default: 70% Meta / 30% Google)
2. Set funnel budget allocation per `references/struttura-campagne.md`
3. Define target audiences per funnel stage
4. Align ad themes with current organic content calendar from `ilconsigliere-content`

### Create Notion Task

```bash
manus-mcp-cli tool call notion-create-pages --server notion --input '{
  "parent": {"data_source_id": "a4e3c788-4339-837d-af42-87c47cfbfe2f"},
  "pages": [
    {
      "properties": {
        "Tarefa": "[ADS] Campanha [Mes/Ano] — Planejamento",
        "Status": "Em planejamento",
        "Prioridade": "Alta",
        "date:Data de vencimento:start": "[YYYY-MM-DD]",
        "date:Data de vencimento:is_datetime": 0
      },
      "icon": "📊"
    }
  ]
}'
```

### Output to User

```
PLANEJAMENTO CAMPANHA — [Mes/Ano]

Budget Total: €[XX]
Meta Ads: €[XX] (70%)  |  Google Ads: €[XX] (30%)

Distribuicao Funnel (Meta):
- TOFU (50%): €[XX] — Reach + Awareness
- MOFU (30%): €[XX] — Traffic + Engagement
- BOFU (20%): €[XX] — Lead Generation

Audiences definidas. Temas alinhados com calendario editorial.
Aprovar para prosseguir com criacao de criativos.
```

**WAIT for user approval before advancing.**

## Workflow 2: Criacao de Criativos

### Actions

1. Read `references/creativi-copy.md` for copy structure and visual rules
2. Generate 15 creatives: 5 TOFU + 5 MOFU + 5 BOFU
3. Each creative includes: static image/video + headline + copy + CTA
4. Follow brand visual identity from `ilconsigliere-content` references

**Creative rules**:
- Headlines persuasive, short, addressing target pain points
- The "uncommon enemy": operational chaos, not competition
- Language: Italian (always)
- Tone: Institutional, direct, entrepreneur-to-entrepreneur
- First 3 months: NO sales CTA. Only: newsletter, guide, audit

### Output to User

```
CRIATIVOS PRONTOS — [Mes/Ano]

TOFU (5 criativos):
1. [Headline] — [Formato: Statico/Video]
2. [Headline] — [Formato]
...

MOFU (5 criativos):
1. [Headline] — [Formato]
...

BOFU (5 criativos):
1. [Headline] — [Formato]
...

[Attach all images/previews]
Aprovar para lancamento ou solicitar alteracoes.
```

**WAIT for user approval. On changes, revise and re-present.**

## Workflow 3: Lancamento

### Actions

1. Set up campaigns following naming convention from `references/struttura-campagne.md`
2. Configure targeting, budgets, and placements per platform
3. Upload approved creatives
4. Activate campaigns

### Update Notion

```bash
manus-mcp-cli tool call notion-update-page --server notion --input '{
  "page_id": "[PAGE_ID]",
  "command": "update_properties",
  "properties": {
    "Status": "Em andamento"
  }
}'
```

## Workflow 4: Monitoramento Diario

**Frequency**: Daily. This is the core operational workflow.

### Actions

1. Collect performance data from Meta Ads and Google Ads (via API or manual input)
2. Calculate KPIs using `scripts/calcola_kpi.py`:
   ```bash
   python scripts/calcola_kpi.py input_data.csv output_kpis.csv
   ```
3. Check alert thresholds per `references/kpis-metriche.md`
4. Generate daily report using `templates/report-giornaliero.md`
5. Publish report to Notion

### Publish Daily Report to Notion

Create a new page under the parent page with the daily report content:

```bash
manus-mcp-cli tool call notion-create-pages --server notion --input '{
  "parent": {"page_id": "3f83c788-4339-8231-bd43-01bbf284ba5c"},
  "pages": [
    {
      "properties": {
        "title": "Report Ads [YYYY-MM-DD]"
      },
      "icon": "📈",
      "content": "[Full report content in Notion-flavored Markdown]"
    }
  ]
}'
```

### Alert Protocol

When alert thresholds are triggered (see `references/kpis-metriche.md` — Soglie di Allarme):

1. Flag the alert in the daily report
2. Notify user immediately for critical alerts (ROAS < 1.5x, CPL > 2x benchmark)
3. Propose specific corrective action
4. Execute approved actions within 24h

## Workflow 5: Otimizacao

Data-driven optimization based on accumulated performance data.

### Decision Matrix

**Creative optimization**:
- CTR < 0.5% after 1,000 impressions → Pause creative, test new hook
- Top 3 creatives by CTR → Increase budget allocation
- Frequency > 2.5 → Rotate creatives or expand audience

**Budget optimization**:
- CPA stable and below target for 5+ days → Increase budget 20%
- ROAS > 5x stable → Aggressive scaling (+30%/week)
- Performance declining after scaling → Revert to previous budget, wait 48h

**Audience optimization**:
- Lookalike performing > Interest-based → Shift budget to Lookalike
- Retargeting CPL < Prospecting CPL → Increase retargeting budget
- Geographic data shows regional winners → Concentrate budget

### Scaling Rules

Read `references/struttura-campagne.md` — Regole di Scaling for detailed rules.

## Workflow 6: Reporting Estrategico

Weekly and monthly synthesis for strategic decisions.

### Weekly Report (every Monday)

- 7-day performance summary per platform and funnel stage
- Week-over-week trends (improving/declining)
- Top performing creatives and audiences
- Budget utilization vs. plan
- Recommended actions for the week

### Monthly Report (1st of each month)

- Full month performance vs. targets
- ROI analysis per platform and funnel stage
- Creative fatigue analysis
- Audience saturation analysis
- Budget reallocation recommendations for next month
- Learnings and strategic insights

## Resources

- `references/kpis-metriche.md` — Complete KPI definitions, benchmarks, formulas, and alert thresholds
- `references/struttura-campagne.md` — Campaign architecture, targeting, budget distribution, naming conventions, scaling rules
- `references/creativi-copy.md` — Creative guidelines, copy templates per funnel stage, visual rules, A/B testing framework
- `templates/report-giornaliero.md` — Daily performance report template (Notion-compatible)
- `scripts/calcola_kpi.py` — Python script to calculate KPIs from raw CSV data with automatic alert detection

## Core Rules (ALWAYS ENFORCE)

- **Mission**: Build Italian SME audience FIRST, sell AI solutions LATER. Audience before revenue
- **Distribution First**: Ads exist to distribute editorial content, not to sell. Ads must look like native feed content
- **Profile Visits**: TOFU campaign objective is ALWAYS profile visits and followers, never link clicks or conversions
- **Language**: All ad content MUST be in Italian
- **No sales CTA (months 1-3)**: Only newsletter, guide, audit CTAs
- **Tone**: Institutional, analytical, Il Sole 24 Ore style
- **Target**: Always speak to the OWNER (imprenditore/titolare)
- **Uncommon enemy**: Operational chaos, not competition
- **Creative distribution**: Always 5 TOFU + 5 MOFU + 5 BOFU
- **Daily reporting**: MANDATORY — never skip a day
- **Budget discipline**: Never exceed monthly budget without explicit approval
- **Organic synergy**: Always coordinate with `ilconsigliere-content` calendar
- **KPI Primario (Fase Atual)**: Custo por Seguidor (CPF) < €2,00 e Custo por Lead Newsletter (CPL) < €12,00
