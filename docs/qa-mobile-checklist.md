# Checklist de QA Mobile — Sintesys.io

> Ultima atualização: 29 de março de 2026
> Responsável: Equipe de QA
> Dispositivos de referência: iPhone 14 (390px), Samsung Galaxy S23 (360px), iPad (768px)

Este documento define o checklist de Quality Assurance para garantir que todas as páginas do site Sintesys.io funcionam corretamente em dispositivos móveis. O site foi desenvolvido com abordagem mobile-first usando Tailwind CSS com breakpoints responsivos.

---

## Breakpoints Testados

| Breakpoint | Largura | Dispositivos de referência | Status |
|---|---|---|---|
| Mobile S | 320px | iPhone SE, dispositivos antigos | A testar |
| Mobile M | 375px | iPhone 12/13/14, Pixel 6 | A testar |
| Mobile L | 414px | iPhone 14 Plus, Samsung S23+ | A testar |
| Tablet | 768px | iPad, Galaxy Tab | A testar |
| Desktop | 1024px+ | Laptop, Desktop | Verificado |

---

## Landing Page (/)

### Hero Section

| Item | Critério | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Headline | Texto legível sem overflow horizontal | A testar | A testar | OK |
| Sub-copy | Parágrafos com espaçamento adequado | A testar | A testar | OK |
| Trust badges | 3 badges em coluna no mobile, linha no desktop | A testar | A testar | OK |
| Estatísticas animadas | Contadores visíveis e alinhados | A testar | A testar | OK |

### Formulário de Audit (6 campos)

| Item | Critério | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Layout | Campos empilhados (1 coluna) no mobile | A testar | A testar | OK |
| Inputs de texto | Teclado correto (text, email, tel) | A testar | A testar | OK |
| Selects (setor, fatturato, dipendenti) | Dropdown nativo funcional | A testar | A testar | OK |
| Validação | Mensagens de erro visíveis sem scroll | A testar | A testar | OK |
| CTA button | Largura total, texto legível, tap target >= 44px | A testar | A testar | OK |
| Estado de loading | Spinner visível durante submissão | A testar | A testar | OK |
| Estado de sucesso | Redirect para /grazie funcional | A testar | A testar | OK |
| Estado de erro | Mensagem de erro visível e acionável | A testar | A testar | OK |
| Estado de duplicata | Mensagem "Già registrato" visível | A testar | A testar | OK |

### Seções de Conteúdo

| Item | Critério | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Problemi che Risolviamo | 3 cards empilhados no mobile | A testar | A testar | OK |
| Il Metodo | Timeline vertical no mobile | A testar | A testar | OK |
| Incentivi Fiscali | Layout adaptado sem overflow | A testar | A testar | OK |
| Lamberto Grinover | Foto + texto empilhados | A testar | A testar | OK |
| FAQ | Perguntas/respostas legíveis | A testar | A testar | OK |
| CTA Final | Formulário repetido funcional | A testar | A testar | OK |

---

## Il Giornale dell'IA (/giornale)

### Masthead e Conteúdo

| Item | Critério | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Masthead | Data e edição legíveis | A testar | A testar | OK |
| Título "IL GIORNALE DELL'IA" | Sem overflow horizontal | A testar | A testar | OK |
| Editorial | Texto com drop cap legível | A testar | A testar | OK |
| Formulário sidebar | Empilhado abaixo do editorial no mobile | A testar | A testar | OK |
| Estatísticas | Cards de números visíveis | A testar | A testar | OK |
| FAQ | Perguntas expandíveis funcionais | A testar | A testar | OK |

### Popup (Lead Magnet)

| Item | Critério | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Aparição | Popup aparece após 2s | A testar | A testar | OK |
| Layout | Centralizado, sem overflow | A testar | A testar | OK |
| Campos | Inputs acessíveis com teclado | A testar | A testar | OK |
| Botão fechar | Tap target >= 44px | A testar | A testar | OK |
| Scroll bloqueado | Body não scrolla com popup aberto | A testar | A testar | OK |
| Reabertura | Popup reabre 2s após ser fechado | A testar | A testar | OK |

---

## Thank You Page (/grazie)

| Item | Critério | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Ícone de check | Centralizado e visível | A testar | A testar | OK |
| Headline | "Richiesta Ricevuta!" legível | A testar | A testar | OK |
| 3 próximos passos | Cards empilhados, numeração visível | A testar | A testar | OK |
| CTA Giornale | Botão com tap target adequado | A testar | A testar | OK |

---

## NavBar (Global)

| Item | Critério | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Logo Sintesys.io | Visível e clicável (→ /) | A testar | A testar | OK |
| Link "Il Giornale" | Visível e funcional | A testar | A testar | OK |
| CTA "Audit Gratuito" | Botão navy destacado, tap target >= 44px | A testar | A testar | OK |
| Sticky behavior | NavBar fixa no topo ao scrollar | A testar | A testar | OK |
| Espaçamento | Sem sobreposição com conteúdo | A testar | A testar | OK |

---

## Chi Siamo (/chi-siamo)

| Item | Critério | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Foto Lamberto | Imagem circular responsiva | A testar | A testar | OK |
| Texto biográfico | Parágrafos legíveis | A testar | A testar | OK |
| Missão Sintesys | Seção visível sem overflow | A testar | A testar | OK |

---

## Contattaci (/contattaci)

| Item | Critério | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Multi-step form | Navegação entre steps funcional | A testar | A testar | OK |
| Progress indicator | Visível e atualizado | A testar | A testar | OK |
| Campos de cada step | Inputs acessíveis, teclado correto | A testar | A testar | OK |
| Botões Avanti/Indietro | Tap target >= 44px | A testar | A testar | OK |
| Submissão final | Loading + redirect para sucesso | A testar | A testar | OK |

---

## Critérios Gerais de Acessibilidade

| Item | Critério |
|---|---|
| Contraste de texto | Ratio >= 4.5:1 para texto normal, >= 3:1 para texto grande |
| Tap targets | Mínimo 44x44px para todos os elementos interativos |
| Focus rings | Visíveis em todos os inputs e botões |
| Keyboard navigation | Tab order lógico em todos os formulários |
| Screen reader | Labels associados a todos os inputs |
| Zoom | Conteúdo legível até 200% de zoom sem scroll horizontal |
| Orientação | Funcional em portrait e landscape |

---

## Procedimento de Teste

1. Abrir cada página nos breakpoints listados usando DevTools do Chrome (Ctrl+Shift+M)
2. Verificar cada item da checklist marcando "OK" ou "Bug" com descrição
3. Testar o fluxo completo de submissão em cada formulário (popup, landing page, contattaci)
4. Verificar estados de erro: campos vazios, email inválido, conexão offline
5. Testar o popup: aparição, fechamento, reabertura, submissão
6. Verificar performance: tempo de carregamento < 3s em 3G simulado
7. Documentar bugs encontrados com screenshot e breakpoint

---

## Notas de Implementação

O site utiliza Tailwind CSS com as seguintes classes responsivas principais: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px). O formulário da Landing Page usa grid com `grid-cols-1 md:grid-cols-2` para empilhar campos no mobile. A NavBar usa flexbox com `gap-4` e esconde/mostra elementos conforme o breakpoint. O popup usa `max-w-md` com padding responsivo.
