# Email Templates - Mailchimp Automações

> Última atualização: 29 de março de 2026
> Remetente: Sintesys.io <commerciale@sintesys.info>
> Plataforma: Mailchimp (us14)
> Status: Ambas automações ATIVAS

---

## 1. Welcome - Lead Simples (Guida Incentivo)

**Automação ID**: 7061 (Customer Journey)
**Template ID**: 10054956
**Acionador**: Tag "Lead" adicionada ao contato
**Assunto**: `*|FNAME|*, ecco la tua Guida alla Transizione 5.0`
**Preview Text**: `Il 60% degli imprenditori italiani non conosce questi incentivi. Tu ora li conosci.`

### Conteúdo do Email

**Header**: Il Giornale dell'IA — Edizione Speciale — Guida Transizione 5.0

**Corpo principal**:
- Estatística de impacto: 60% dos empresários italianos não conhecem os incentivos
- Estado paga até 50% da inovação
- Guia prática para PMIs acessarem os fundos

**Capítulos da Guida**:
1. Cos'è la Transizione 5.0 e perché riguarda la tua azienda
2. Crediti d'imposta fino al 50% — requisiti e come ottenerli
3. I 6,3 miliardi di fondi disponibili e le scadenze 2025
4. Casi studio reali di PMI italiane che hanno già beneficiato
5. Checklist operativa — i primi 3 passi da fare questa settimana

**Estatísticas destacadas**:
- 50% Credito d'imposta
- €6.3 Mld Fondi disponibili
- 2025 Scadenza bando

**CTA**: "SCARICA LA GUIDA COMPLETA" → sintesysio.io

**Footer**: Sintesys.io — Intelligenza Artificiale per PMI Italiane

---

## 2. Welcome - Lead Qualificato (Agendar Reunião 30min)

**Automação ID**: 7062 (Customer Journey)
**Template ID**: 10054957
**Acionador**: Tag "Qualificato" adicionada ao contato
**Assunto**: `*|FNAME|*, il suo Audit IA Gratuito è confermato`
**Preview Text**: `Prenoti 30 minuti con Lamberto Grinover per scoprire come l'IA può trasformare la sua azienda.`

### Conteúdo do Email

**Header**: Sintesys.io — Conferma Audit IA Gratuito

**Corpo principal**:
- Lamberto Grinover analisa pessoalmente o perfil da empresa
- Sessão estratégica de 30 minutos dedicada à realidade do cliente

**Box destaque**: Sessione Strategica di 30 Minuti — Con Lamberto Grinover, Fondatore di Sintesys.io

**3 Passos (Cosa succede ora)**:
1. **Analisi del profilo** — Lamberto studia le risposte del suo audit nelle prossime 24 ore
2. **Conferma disponibilità** — Riceverà un link per prenotare i 30 minuti nell'agenda di Lamberto
3. **Report personalizzato** — Nella sessione, riceverà 3+ opportunità concrete con stima di ROI

**CTA**: "CONFERMA LA TUA DISPONIBILITÀ" → sintesysio.io/contattaci

**Nota**: Sessione completamente gratuita e senza impegno

**Footer**: Sintesys.io — Intelligenza Artificiale per PMI Italiane

---

## Configuração Técnica

### Tags do Backend → Automações

| Formulário | Tag aplicada | Automação acionada |
|---|---|---|
| Popup (lead simples) | `lead` + setor | Welcome - Lead Simples (ID: 7061) |
| Contattaci (qualificado) | `Qualificato` + setor | Welcome - Lead Qualificado (ID: 7062) |

### Registros DNS para Autenticação

| Tipo | Host | Valor |
|---|---|---|
| CNAME | k2._domainkey | dkim2.mcsv.net |
| CNAME | k3._domainkey | dkim3.mcsv.net |
| TXT | SPF | v=spf1 include:_spf.google.com include:servers.mcsv.net ~all |
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:commerciale@sintesys.info |

### Audiência Mailchimp

- **Nome**: Sintesys.io
- **ID**: b0d9ab0ecc
- **Remetente padrão**: Sintesys.io <commerciale@sintesys.info>
- **Status domínio**: Verificado + Autenticado (DKIM)
