# KPIs e Metriche per Campagne Ads — Il Consigliere

## Table of Contents
1. [Metriche Primarie](#metriche-primarie)
2. [Metriche per Fase del Funnel](#metriche-per-fase-del-funnel)
3. [Benchmark di Riferimento (B2B SaaS / Consulenza Italia)](#benchmark-di-riferimento)
4. [Formula di Calcolo](#formula-di-calcolo)
5. [Soglie di Allarme](#soglie-di-allarme)

## Metriche Primarie

| Metrica | Sigla | Descrizione |
|---|---|---|
| Costo per Click | CPC | Costo medio per ogni click sull'annuncio |
| Costo per Mille Impressioni | CPM | Costo per 1.000 visualizzazioni |
| Click-Through Rate | CTR | Percentuale di click rispetto alle impressioni |
| Costo per Lead | CPL | Costo per acquisire un contatto qualificato |
| Costo per Acquisizione | CPA/CAC | Costo per acquisire un cliente pagante |
| Return on Ad Spend | ROAS | Ricavo generato per ogni euro speso in ads |
| Conversion Rate | CR | Percentuale di conversione (click → lead o lead → cliente) |
| Frequenza | Freq | Numero medio di volte che un utente vede l'annuncio |
| Reach | Reach | Numero di utenti unici raggiunti |
| Impressioni | Impr | Numero totale di visualizzazioni dell'annuncio |
| Engagement Rate | ER | Interazioni totali / Impressioni |
| Costo per Engagement | CPE | Costo per ogni interazione (like, commento, salvataggio, condivisione) |
| Hook Rate | HR | Percentuale di utenti che guardano oltre i primi 3 secondi (video) |
| Hold Rate | HoldR | Percentuale di utenti che guardano oltre il 50% del video |
| ThruPlay Rate | TPR | Percentuale di utenti che guardano il video fino alla fine (o 15s) |

## Metriche per Fase del Funnel

### Topo (Awareness) — 5 criativos
- **Obiettivo**: Massimizzare Reach e Impressioni a basso CPM
- **KPI primari**: CPM, Reach, Frequenza, CTR, Hook Rate (video)
- **Target**: CPM < €8, CTR > 1.5%, Freq < 2.5

### Mezzo (Consideration) — 5 criativos
- **Obiettivo**: Generare engagement e traffico qualificato
- **KPI primari**: CPC, CTR, ER, CPE, Saves, Shares
- **Target**: CPC < €1.50, CTR > 2%, ER > 3%

### Fondo (Conversion) — 5 criativos
- **Obiettivo**: Generare lead qualificati (newsletter, contatto)
- **KPI primari**: CPL, CR, CPA, ROAS
- **Target**: CPL < €15, CR > 3%

## Benchmark di Riferimento

| Metrica | Benchmark B2B Italia | Ottimo | Critico |
|---|---|---|---|
| CPM (Meta) | €5-€12 | < €6 | > €15 |
| CPC (Meta) | €0.80-€2.00 | < €1.00 | > €3.00 |
| CTR (Meta) | 1.0%-2.5% | > 2.0% | < 0.8% |
| CPL (Meta) | €10-€25 | < €12 | > €30 |
| CPC (Google Search) | €1.50-€5.00 | < €2.00 | > €6.00 |
| CTR (Google Search) | 3%-8% | > 5% | < 2% |
| CPL (Google) | €15-€40 | < €20 | > €50 |
| ROAS | 3x-8x | > 5x | < 2x |

## Formula di Calcolo

```
CPC = Spesa Totale / Click Totali
CPM = (Spesa Totale / Impressioni) × 1.000
CTR = (Click / Impressioni) × 100
CPL = Spesa Totale / Lead Generati
CPA = Spesa Totale / Clienti Acquisiti
ROAS = Ricavo Generato / Spesa Ads
CR = (Conversioni / Click) × 100
Frequenza = Impressioni / Reach
ER = (Interazioni / Impressioni) × 100
Hook Rate = (Visualizzazioni 3s / Impressioni) × 100
```

## Soglie di Allarme

Condizioni che richiedono azione immediata:

| Condizione | Azione |
|---|---|
| CTR < 0.5% per 48h | Pausare creativo, testare nuovo hook/headline |
| Frequenza > 3.0 | Ampliare audience o ruotare creativi |
| CPL > 2x benchmark | Rivedere targeting e landing page |
| ROAS < 1.5x | Pausare campagna, analizzare funnel completo |
| Hook Rate < 15% (video) | Rifare primi 3 secondi del video |
| CR landing page < 1% | Ottimizzare landing page (copy, form, velocità) |
