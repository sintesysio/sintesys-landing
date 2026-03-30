---
name: sintesys-content
description: Produce and publish daily Instagram content for Sintesys.io in editorial newspaper style ("Il Giornale dell'IA") targeting Italian SME owners. Use for creating posts, carousels, reels, captions, editorial calendars, designing visuals, and publishing to Instagram for Sintesys.io. Includes a 6-stage approval workflow (Backlog → Em planejamento → Produção → Aprovação → Aprovado → Publicado) with Notion task management and Instagram MCP publishing with soundtrack.
---

# Sintesys.io — Daily Content Production & Publishing

Produce and publish Instagram content daily for Sintesys.io following the "Il Giornale dell'IA" editorial strategy. Target audience: Italian SME owners (10-50 employees, €1.8M-€12M/year revenue).

## Diretriz Estrategica da Conta (CRITICO)

O foco da Sintesys.io e **construir uma audiencia de PMIs italianas** para vender solucoes de IA. O conteudo organico e o produto principal da estrategia de aquisicao. Cada post deve ser pensado como uma peca de distribuicao que sera amplificada por trafego pago (skill `sintesys-ads`).

**Prioridades do conteudo (em ordem)**:
1. **Atrair visitantes ao perfil** — O conteudo deve ser tao relevante que o empresario italiano clica no perfil para ver mais
2. **Converter visitantes em seguidores** — O feed deve parecer um portal de noticias serio, nao um perfil de influencer
3. **Gerar saves e shares** — Metricas que alimentam o algoritmo e expandem o alcance organico
4. **Capturar leads para newsletter** — Soft CTA no final das legendas ("Iscriviti alla newsletter — link in bio")

**O conteudo NAO vende**. O conteudo educa, informa e posiciona. A venda acontece no funil pago (BOFU) e no time comercial, NUNCA no conteudo organico.

## Roles of Each Tool

| Tool | Role | Responsibility |
|---|---|---|
| **Manus** | Strategic brain & executor | Plan content, research topics, generate designs, write captions, publish to Instagram |
| **Notion** | Control & organization hub | Track tasks through pipeline, store approvals, manage editorial calendar, organize commercial/sales processes |
| **Instagram** | Distribution channel | Publish approved content (posts, carousels, reels with soundtrack) |

## Notion Connection (LIVE)

The Notion workspace is connected via MCP. Below are the real IDs for the Sintesys.io content pipeline:

| Resource | ID |
|---|---|
| Database "Tarefas" | `8b43c788-4339-826f-8d1d-01cc33289697` |
| Data Source ID | `a4e3c788-4339-837d-af42-87c47cfbfe2f` |
| Parent Page "Sintesys.io" | `3f83c788-4339-8231-bd43-01bbf284ba5c` |

### Database Properties (Schema)

| Property | Type | Accepted Values |
|---|---|---|
| Tarefa | title | Free text (content piece name) |
| Status | select | Não iniciado, Backlog, Em planejamento, Produção, Aprovação, Aprovado, Pendente, Em andamento, Publicado, Concluído, Cancelado |
| Prioridade | select | Baixa, Médio, Alta |
| Data de vencimento | date | ISO-8601 date |
| Responsável | person | User IDs |
| Projeto | relation | Related project pages |

## Approval Pipeline (6 Stages)

Every piece of content flows through these stages sequentially:

```
Backlog → Em planejamento → Produção → Aprovação → Aprovado → Publicado
```

## Stage 1: Backlog

**Who acts**: Manus (research) + User (optional input)

### Actions

1. Research fresh AI/business news relevant to Italian SMEs
2. Cross-reference with editorial calendar to avoid topic repetition
3. Generate 3-5 content ideas with brief descriptions

### Create Task in Notion

```bash
manus-mcp-cli tool call notion-create-pages --server notion --input '{
  "parent": {"data_source_id": "a4e3c788-4339-837d-af42-87c47cfbfe2f"},
  "pages": [
    {
      "properties": {
        "Tarefa": "[Content title]",
        "Status": "Backlog",
        "Prioridade": "Alta",
        "date:Data de vencimento:start": "[YYYY-MM-DD]",
        "date:Data de vencimento:is_datetime": 0
      },
      "icon": "📰"
    }
  ]
}'
```

### Output to User

```
BACKLOG — Ideias de Conteudo

1. [Titulo] — [Pilar] — [Formato] — [Breve descricao]
2. [Titulo] — [Pilar] — [Formato] — [Breve descricao]
3. [Titulo] — [Pilar] — [Formato] — [Breve descricao]

Selecione a ideia para desenvolver ou sugira uma nova.
```

**WAIT for user selection before advancing.**

## Stage 2: Em planejamento

**Who acts**: Manus (strategic planning)

### Actions

1. Develop the selected idea into a full content plan
2. Define editorial angle, data sources, slide structure (if carousel)
3. Check recent posts to ensure differentiation

```bash
manus-mcp-cli tool call get_post_list --server instagram --input '{"limit": 10}'
```

### Update Notion Status

```bash
manus-mcp-cli tool call notion-update-page --server notion --input '{
  "page_id": "[PAGE_ID]",
  "command": "update_properties",
  "properties": {
    "Status": "Em planejamento"
  }
}'
```

### Output to User

```
PLANEJAMENTO — [Titulo]

Pilastro: [Radar del Saggio / Ordine del Governante]
Formato: [Carosello / Immagine Singola / Citazione / Grafico / Reel]
Angolo: [Editorial angle]
Fonte dati: [Sources to cite]
Obiettivo: [Salvataggi / Condivisioni / Follower]

Struttura (se carosello):
- Slide 1: [Cover — title]
- Slide 2: [Context]
- Slide 3-N: [Development]
- Slide finale: [Closure + soft CTA]

Approva il piano per procedere alla produzione.
```

**WAIT for user approval. On approval, advance to Producao.**

## Stage 3: Producao

**Who acts**: Manus (design + copywriting)

### Actions

1. Generate visual content following brand guidelines (read `references/templates-contenuto.md`)
2. Write the detailed caption in Italian (minimum 150 words)

**Visual rules (MANDATORY)**:
- Aspect ratio: 1:1 (1080x1080) for feed, 4:5 (1080x1350) for carousels
- Background: White or very light gray (#FAFAFA)
- Typography: Serif for headlines, sans-serif for body
- Colors: Black text, dark blue (#1B2A4A) or charcoal (#333333) accents
- Logo: "Sintesys.io" bottom-right, small and discrete
- Style: Clean, editorial, premium — Apple meets Il Sole 24 Ore
- NO decorative elements, gradients, stock photos, or emoji

**Caption structure** (read `references/templates-contenuto.md`):
- HOOK: Shocking data or provocative question
- BODY: 2-3 paragraphs, concrete data, Italian context (min 150 words)
- REFLECTION: Open question stimulating saves/shares
- SOFT CTA: "Segui @sintesys.io" / "Salva questo post" / "Iscriviti alla newsletter"
- HASHTAGS: Maximum 5

### Update Notion Status

```bash
manus-mcp-cli tool call notion-update-page --server notion --input '{
  "page_id": "[PAGE_ID]",
  "command": "update_properties",
  "properties": {
    "Status": "Produção"
  }
}'
```

### Output to User

```
PRODUCAO COMPLETA — [Titulo]

[Attach all generated images]

LEGENDA:
[Full caption text]

---
Hashtag: [list]
Parole: [word count]

Pronto per revisione. Approva o richiedi modifiche.
```

**WAIT for user to move to Aprovacao or request changes. If changes requested, revise and re-present.**

## Stage 4: Aprovacao

**Who acts**: User (review and decision)

This is a **user-driven stage**. The user reviews the complete content package (visuals + caption) and decides:
- **Approve** → Status moves to "Aprovado"
- **Request changes** → Status returns to "Producao" with notes

### Update Notion Status

```bash
manus-mcp-cli tool call notion-update-page --server notion --input '{
  "page_id": "[PAGE_ID]",
  "command": "update_properties",
  "properties": {
    "Status": "Aprovação"
  }
}'
```

## Stage 5: Aprovado

**Who acts**: User confirms → Manus prepares for publishing

When the user approves, Manus uploads all media assets and prepares the publication.

```bash
manus-upload-file /path/to/slide1.png /path/to/slide2.png ...
```

### Update Notion Status

```bash
manus-mcp-cli tool call notion-update-page --server notion --input '{
  "page_id": "[PAGE_ID]",
  "command": "update_properties",
  "properties": {
    "Status": "Aprovado"
  }
}'
```

## Stage 6: Publicado

**Who acts**: Manus (auto-publish with standing permission)

The user has granted **standing permission to publish with soundtrack**. Proceed directly after approval.

### Publish to Instagram

**Post (single image or carousel):**

```bash
manus-mcp-cli tool call create_instagram --server instagram --input '{
  "type": "post",
  "caption": "[approved caption]",
  "media": [
    {"type": "image", "media_url": "[url_1]", "alt_text": "[desc]"},
    {"type": "image", "media_url": "[url_2]", "alt_text": "[desc]"}
  ]
}'
```

**Reel (video with soundtrack):**

```bash
manus-mcp-cli tool call create_instagram --server instagram --input '{
  "type": "reels",
  "caption": "[approved caption]",
  "share_to_feed": true,
  "media": [{"type": "video", "media_url": "[video_url]"}]
}'
```

### Update Notion Status

```bash
manus-mcp-cli tool call notion-update-page --server notion --input '{
  "page_id": "[PAGE_ID]",
  "command": "update_properties",
  "properties": {
    "Status": "Publicado"
  }
}'
```

### Confirmation to User

```
PUBBLICATO — [Titulo]

Tipo: [Post / Carosello / Reel]
Orario: [timestamp]
Pilastro: [pillar]
Link: [instagram URL]

Notion aggiornato
Prossimo contenuto previsto: [next day and topic]
```

## Core Rules (ALWAYS ENFORCE)

- **Mission**: Build Italian SME audience to sell AI solutions. Content is the distribution vehicle, not the sales pitch
- **Profile Magnetism**: Every post must make the reader want to visit the profile and follow. Feed must look like a serious news portal
- **Language**: ALL content (captions, text on images) MUST be in Italian
- **No sales CTA**: First 3 months — NEVER include sales CTAs. Only: "Segui @sintesys.io", "Salva questo post", "Iscriviti alla newsletter — link in bio"
- **Tone**: Analytical, direct, institutional. Like Il Sole 24 Ore. Never informal, never internet slang
- **Archetypes**: Saggio (wisdom, data, clarity) + Governante (order, control, method)
- **Audience**: ALWAYS speak to the OWNER (imprenditore/titolare), never IT or marketing teams
- **Key words**: Marginalita, Controllo, Tranquillita, Flusso di Cassa, Efficienza, Governance
- **Metrics focus**: Saves and Shares, not Likes. Profile Visits is the north star metric
- **Frequency**: Minimum 3 excellent posts per week (Mon/Wed/Fri), can extend to daily
- **Paid Amplification**: Every post published is a candidate for paid distribution via `sintesys-ads`. High-performing organic posts (saves/shares) should be flagged for boosting

## Performance Review

Periodically check post performance to refine strategy:

```bash
manus-mcp-cli tool call get_post_insights --server instagram --input '{"post_id": "[post_id]"}'
```

Topics with high saves/shares should be expanded. Low-performing formats should be adjusted.

## Editorial Pillars

| Pillar | Funnel Stage | Focus | Use When |
|---|---|---|---|
| Il Radar del Saggio | Top (Awareness) | News, trends, market data for SMEs | Sharing industry news, statistics, AI developments |
| L'Ordine del Governante | Middle (Consideration) | Governance, control, operational method | Addressing operational chaos, Shadow AI, data centralization |
| L'Esecuzione Implacabile | Bottom (Conversion) | Case studies, before/after | ONLY after first 3 months |

## Available Data for Content

| Data Point | Value | Source |
|---|---|---|
| Want to innovate vs actually do | 88% vs 26% | Politecnico di Milano |
| Credit access difficulty | 42% | Banca d'Italia |
| Feel alone in role | 36.4% | Blackship 2026 |
| Considered closing due to burnout | 41.7% | Blackship 2026 |
| Don't digitalize due to cost fears | 27% | Osservatorio PMI |
| Italy worried about AI | 50% | Il Sole 24 Ore 2025 |
| Digitally mature SMEs | Only 26% | Politecnico di Milano |
| Annual turnover in tech sectors | 28% | Cerved |
| Succession problems | 1 in 2 SMEs | Il Sole 24 Ore 2026 |
| Unaware of Transizione 5.0 incentives | 60%+ | Osservatorio PMI |

## Resources

- `references/pubblico-target.md` — Psychographic profile of Italian SME owner
- `references/strategia-editoriale.md` — Full editorial strategy (archetypes, tone, pillars, visual identity)
- `references/sintesys-knowledge-base.md` — Sintesys.io service details (90-day method, pricing, positioning)
- `references/templates-contenuto.md` — Content templates for each format (carousel, image, quote, chart, caption, calendar)
