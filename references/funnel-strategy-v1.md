# ESTRATÉGIA DE FUNIL — Il Consigliere
## Briefing para implementação · Versão 1.0 · Maio 2026

Documento salvo de: pasted_content.txt + pasted_content_2.txt

## Resumo das mudanças necessárias:

### Páginas existentes a modificar:
1. `/` (Homepage) — Remover form inline, CTA → /lead, atualizar cards e FAQ
2. `/grazie` — Upsell Masterclass (não mais Mappa), mencionar Guida + Mappa no email
3. `/mappa` — Não é mais sales page, remover preços, CTAs → /lead
4. `/mappa/grazie` — Redirect 301 → /masterclass/grazie
5. `/links` — Nova ordem dos links
6. `/contattaci` — Repurpose para candidatura Mentoria
7. `/giornale` — Sidebar sem preço, CTA → /lead
8. `/lead` — Ajustar: sem navbar, copy específica, badges

### Páginas novas:
1. `/masterclass` — Sales page €97
2. `/masterclass/grazie` — Pós-compra com evento Purchase
3. `/mentoria` — Não-indexada, acesso por link

### Pixel Meta eventos:
- /grazie: Lead (content_name: 'newsletter')
- /masterclass clique compra: InitiateCheckout (value: 97, currency: EUR)
- /masterclass/grazie: Purchase (value: 97, currency: EUR)
- /mentoria clique candidatura: Lead (content_name: 'mentoria')

### Redirects:
- /mappa/grazie → /masterclass/grazie (301)

### Emails (4 sequência nurture):
1. Imediato: Entrega Guida + Mappa
2. Dia 3: Caso real
3. Dia 6: Convite Masterclass
4. Dia 9: Urgência
