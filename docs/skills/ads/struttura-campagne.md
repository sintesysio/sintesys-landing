# Struttura Campagne Ads — Il Consigliere

## Table of Contents
1. [Architettura del Funnel Paid](#architettura-del-funnel-paid)
2. [Meta Ads (Facebook + Instagram)](#meta-ads)
3. [Google Ads](#google-ads)
4. [Distribuzione Budget](#distribuzione-budget)
5. [Naming Convention](#naming-convention)
6. [Regole di Scaling](#regole-di-scaling)

## Architettura del Funnel Paid

```
TOFU (Awareness)     → 5 creativi → Pubblico freddo (Lookalike + Interessi)
MOFU (Consideration) → 5 creativi → Pubblico tiepido (Retargeting engagement + visitatori)
BOFU (Conversion)    → 5 creativi → Pubblico caldo (Retargeting sito + lead non convertiti)
```

Ogni fase ha 5 creativi statici con headline persuasive, testi brevi, focus sulle dores del target e il "nemico insolito" (il caos operazionale, non la concorrenza).

## Meta Ads

### Struttura Account

```
Campaign (1 per fase funnel)
├── Ad Set 1: Lookalike 1% (TOFU) / Retargeting Engagement (MOFU) / Retargeting Sito (BOFU)
│   ├── Ad 1: Creativo statico A
│   ├── Ad 2: Creativo statico B
│   └── Ad 3: Creativo video
├── Ad Set 2: Interessi (TOFU) / Visitatori sito (MOFU) / Lead non convertiti (BOFU)
│   ├── Ad 1: Creativo statico C
│   ├── Ad 2: Creativo statico D
│   └── Ad 3: Creativo video B
```

### Targeting — Pubblico Freddo (TOFU)

| Parametro | Valore |
|---|---|
| Età | 35-60 |
| Genere | Tutti |
| Località | Italia (focus: Lombardia, Veneto, Emilia-Romagna, Toscana, Lazio) |
| Lingua | Italiano |
| Interessi | Imprenditoria, PMI, Gestione aziendale, Innovazione, Digitalizzazione, Intelligenza Artificiale, CRM, ERP |
| Comportamenti | Proprietari di piccole imprese, Amministratori di pagine aziendali |
| Lookalike | 1% basato su: visitatori sito, engagement Instagram, lista email |
| Esclusioni | Già clienti, dipendenti, competitor |

### Targeting — Pubblico Tiepido (MOFU)

| Parametro | Valore |
|---|---|
| Retargeting | Engagement Instagram 90gg, Visitatori sito 30gg, Video viewers 50%+ |
| Esclusioni | Lead già acquisiti, clienti |

### Targeting — Pubblico Caldo (BOFU)

| Parametro | Valore |
|---|---|
| Retargeting | Visitatori landing page 14gg, Lead non convertiti 60gg, Carrello abbandonato |
| Esclusioni | Clienti attivi |

### Obiettivi Campagna Meta

| Fase | Obiettivo | Ottimizzazione |
|---|---|---|
| TOFU | Awareness / Reach | Impressioni / ThruPlay |
| MOFU | Traffic / Engagement | Link Click / Landing Page View |
| BOFU | Leads / Conversions | Lead Form / Conversione sito |

## Google Ads

### Struttura Account

```
Campaign Search (Brand + Non-Brand)
├── Ad Group: Brand Keywords
│   └── Ads: Brand protection
├── Ad Group: Consulenza IA PMI
│   └── Ads: Focus su dolori + soluzione
├── Ad Group: Automazione Aziendale
│   └── Ads: Focus su efficienza
└── Ad Group: Transizione 5.0
    └── Ads: Focus su incentivi fiscali

Campaign Display/YouTube (Retargeting)
├── Ad Group: Visitatori sito
└── Ad Group: Lookalike
```

### Keywords Principali (Google Search)

| Categoria | Keywords |
|---|---|
| Brand | ilconsigliere, ilconsigliere.io, ilconsigliere consulenza |
| Consulenza IA | consulenza intelligenza artificiale PMI, consulenza IA aziende, AI per piccole imprese |
| Automazione | automazione processi aziendali, automazione PMI, digitalizzazione PMI Italia |
| Dolori | caos aziendale, disorganizzazione azienda, gestione aziendale efficiente |
| Incentivi | transizione 5.0, incentivi digitalizzazione, credito imposta innovazione |

### Negative Keywords

Studenti, gratis, free, corso, tutorial, lavoro, assunzioni, stage, tirocinio, open source, fai da te.

## Distribuzione Budget

### Fase Iniziale (Mesi 1-3): Focus Awareness + Lead Generation

| Piattaforma | % Budget | Fase Funnel | % Allocazione |
|---|---|---|---|
| Meta Ads | 70% | TOFU | 50% |
| Meta Ads | 70% | MOFU | 30% |
| Meta Ads | 70% | BOFU | 20% |
| Google Ads | 30% | Search Brand | 30% |
| Google Ads | 30% | Search Non-Brand | 50% |
| Google Ads | 30% | Display/YouTube | 20% |

### Fase Matura (Mesi 4+): Ottimizzazione Conversioni

| Piattaforma | % Budget | Fase Funnel | % Allocazione |
|---|---|---|---|
| Meta Ads | 60% | TOFU | 30% |
| Meta Ads | 60% | MOFU | 30% |
| Meta Ads | 60% | BOFU | 40% |
| Google Ads | 40% | Search Brand | 20% |
| Google Ads | 40% | Search Non-Brand | 40% |
| Google Ads | 40% | Display/YouTube | 40% |

## Naming Convention

Formato standard per organizzazione e tracking:

```
[Piattaforma]_[Fase]_[Obiettivo]_[Audience]_[Data]
```

Esempi:
- `META_TOFU_REACH_LAL1%_2026-03`
- `META_MOFU_TRAFFIC_RETENG90_2026-03`
- `META_BOFU_LEADS_RETSITE14_2026-03`
- `GOOGLE_SEARCH_BRAND_2026-03`
- `GOOGLE_SEARCH_CONSULENZA-IA_2026-03`

## Regole di Scaling

| Condizione | Azione |
|---|---|
| CPA stabile per 5+ giorni e < target | Aumentare budget 20% ogni 3 giorni |
| CTR > 2x media per 3+ giorni | Duplicare ad set con budget maggiore |
| Frequenza > 2.5 su TOFU | Espandere audience o aggiungere nuovi creativi |
| CPL in calo costante | Spostare budget da TOFU a MOFU/BOFU |
| ROAS > 5x stabile | Scaling aggressivo: +30% budget settimanale |
| Performance in calo dopo scaling | Tornare al budget precedente, attendere 48h |
