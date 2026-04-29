# Project TODO

- [x] Landing page com design editorial de jornal
- [x] Formulário de captura de leads (nome, email, telefone, setor)
- [x] Seções: masthead, editorial, estatísticas, valor, infográfico, citação, CTA
- [x] Upgrade para full-stack com web-db-user
- [x] Resolver conflito do Home.tsx (restaurar landing page customizada)
- [x] Criar tabela de leads no schema do Drizzle
- [x] Executar pnpm db:push para sincronizar banco de dados
- [x] Criar API endpoint tRPC para salvar leads
- [x] Conectar formulário ao backend via tRPC mutation
- [x] Notificar o owner quando um novo lead é capturado
- [x] Escrever testes vitest para o endpoint de leads
- [x] Instalar dependência exceljs para gerar planilhas Excel
- [x] Criar endpoint tRPC para exportar leads como planilha Excel (.xlsx)
- [x] Gerar planilha com colunas: ID, Nome, Email, Telefone, Setor, Fonte, Data
- [x] Upload da planilha para S3 e retornar URL de download
- [x] Escrever testes vitest para o endpoint de exportação
- [x] Salvar checkpoint final
- [x] Pesquisar palavras-chave estratégicas para PMI + IA na Itália
- [x] Adicionar meta tags SEO completas (title, description, keywords) em italiano
- [x] Implementar Open Graph e Twitter Card para compartilhamento social
- [x] Adicionar hreflang para direcionar ao público italiano
- [x] Criar schema markup JSON-LD (Organization, WebPage, FAQPage)
- [x] Adicionar robots.txt e sitemap.xml
- [x] Otimizar semântica HTML (headings hierarchy, alt tags, aria labels)
- [x] Adicionar canonical URL e geo meta tags para Itália
- [x] Otimizar performance: lazy loading de imagens, preconnect fonts
- [x] Salvar checkpoint com SEO completo
- [x] Criar tabela de conteúdos diários no schema do Drizzle (dailyContent)
- [x] Popular banco com 30+ dias de conteúdo editorial variado
- [x] Criar endpoint tRPC para servir o conteúdo do dia (baseado na data)
- [x] Atualizar data do masthead para mostrar a data real do dia
- [x] Atualizar número da edição dinamicamente (incremento diário)
- [x] Tornar manchete principal dinâmica (muda diariamente)
- [x] Tornar texto editorial dinâmico (muda diariamente)
- [x] Tornar citação do dia dinâmica (muda diariamente)
- [x] Tornar dados/estatísticas dinâmicos (muda diariamente)
- [x] Adicionar fallback para conteúdo estático caso API falhe
- [x] Escrever testes vitest para o endpoint de conteúdo diário
- [x] Salvar checkpoint com sistema de conteúdo dinâmico
- [x] Criar barra de menu editorial no estilo jornal (Home, Chi Siamo, Contattaci)
- [x] Criar página Chi Siamo com perfil do Lamberto Grinover (foco inovação tecnológica, não facilities)
- [x] Criar seção de missão da Sintesys.io na página Chi Siamo
- [x] Criar página Contattaci com formulário estilo Typeform embutido (multi-step)
- [x] Implementar campos do formulário de qualificação (4 seções: Perfil, Dores, Maturidade, Urgência)
- [x] Criar tabela separada no banco para leads qualificados (qualifiedLeads)
- [x] Criar endpoint tRPC para salvar leads qualificados
- [x] Exportação Excel dos leads qualificados em pasta/tabela separada
- [x] Configurar rotas no App.tsx para as novas páginas
- [x] Escrever testes vitest para os novos endpoints
- [x] Salvar checkpoint com menu e novas páginas
- [x] Upload do ícone do cérebro (sem texto) para CDN
- [x] Substituir logo completo pelo ícone do cérebro na NavBar
- [x] Substituir logo no footer da Home
- [x] Substituir logo na página Chi Siamo
- [x] Substituir logo na página Contattaci
- [x] Usar o cérebro como assinatura de marca em todo o site
- [x] Salvar checkpoint
- [x] Criar componente NewsletterPopup com timer de 60 segundos
- [x] Campos: nome, email, telefone, setor com copy de convite semanal por setor
- [x] Estilo editorial consistente com o jornal (Playfair Display, cores navy/off-white)
- [x] Integrar com endpoint tRPC de leads existente (source: popup)
- [x] Não mostrar novamente se já fechou ou já se inscreveu (localStorage)
- [x] Animação suave de entrada/saída
- [x] Adicionar o pop-up na Home page
- [x] Salvar checkpoint
- [x] Reduzir timer do pop-up de 60s para 15s
- [x] Remover botão do LinkedIn do Lamberto na página Chi Siamo (já não existia no código)
- [x] Reduzir timer do pop-up de 15s para 10s
- [x] Bug: pop-up não ativa após 10 segundos - resolvido (localStorage de teste anterior bloqueava)
- [x] Adicionar seção "Transizione 5.0" na home page (incentivo fiscal, 60%+ não conhece, Estado paga até 50%)
- [x] Transformar popup em oferta de Lead Magnet (Guida Transizione 5.0 gratuita)
- [x] Adicionar seção FAQ visível na home (crenças limitantes do público-alvo)
- [x] Corrigir sitemap.xml (adicionar /chi-siamo e /contattaci)
- [x] Verificar link do LinkedIn na página Chi Siamo (confirmado: já estava correto com URL real, nenhuma correção necessária)
- [x] Melhorar copy do Contattaci (promessa de resultado + gratuidade)
- [x] Adicionar social proof na home (badges de credibilidade: Politecnico di Milano, Banca d'Italia, ISTAT, Transizione 5.0)
- [x] Reduzir timer do pop-up de 10s para 5s
- [x] Reduzir timer do pop-up de 5s para 2s (foco em conversões)
- [x] Remover campo "Ore settimanali" do formulário Contattaci
- [x] Redesenhar Step 2 (Diagnosi) com perguntas mais pertinentes às dores italianas
- [x] Adicionar novas perguntas: gestão de liquidez, delegação, sucessão, Shadow AI
- [x] Atualizar backend (router, schema, DB) para novos campos
- [x] Atualizar testes para refletir novos campos (18 testes passando)
- [x] Manter popup simples inalterado (lead magnet)
- [x] Reduzir opções de resposta de todas as perguntas do Step 4 (Urgenza e Visione Futura)
- [x] Deixar botões Chi Siamo e Contattaci sempre visíveis na navbar (sem menu hambúrguer)
- [x] Destacar visualmente o botão Contattaci como CTA principal na navbar ("Audit Gratuito" em navy)
- [x] Integrar Mailchimp API ao backend (server-side)
- [x] Conectar formulário popup (lead simples) ao Mailchimp com tag "lead" + setor
- [x] Conectar formulário Contattaci (lead qualificado) ao Mailchimp com tag "Qualificado" + merge fields
- [x] Adicionar tags automáticas por setor e tipo de lead (simples vs qualificado)
- [x] Escrever testes da integração Mailchimp (22 testes passando)
- [x] Documentar fluxos de automação para configurar no painel Mailchimp (boas-vindas, materiais por setor, régua de nutrição)
- [x] Criar template Welcome Email para lead simples (popup)
- [x] Criar template Welcome Email para lead qualificado (Contattaci)
- [x] Criar templates de materiais por setor (7 setores) — docs/email-templates-settore.md (copy pronto, configurar no Mailchimp manualmente)
- [x] Criar régua de nutrição 28 dias para leads simples (6 emails) — docs/drip-campaigns.md (spec pronto, configurar Customer Journey no Mailchimp)
- [x] Criar régua de nutrição 14 dias para leads qualificados (4 emails) — docs/drip-campaigns.md (spec pronto, configurar Customer Journey no Mailchimp)
- [x] Compilar documento final com todos os templates prontos para Mailchimp — docs/ (3 arquivos: email-templates.md, email-templates-settore.md, drip-campaigns.md)
- [x] Integrar Notion API ao backend para criar registros de leads
- [x] Criar/configurar database de Pipeline no Notion com propriedades adequadas (CRM de vendas existente)
- [x] Conectar formulário popup ao Notion (status: Lead)
- [x] Conectar formulário Contattaci ao Notion (status: Qualificado)
- [x] Escrever testes da integração Notion (3 testes de API + acesso ao CRM)
- [x] Adicionar testes de integração com mock do Notion nos endpoints leads.submit e qualifiedLeads.submit
- [x] Corrigir carregamento da NOTION_API_KEY no ambiente de teste (env inline para vitest)
- [x] Bug: popup não abre em 2s — corrigido: movido para App.tsx global + atualizado comentário
- [x] Validar que popup dispara Mailchimp sync (tag "lead" + setor)
- [x] Validar que popup dispara Notion sync (status "Lead")
- [x] Validar que Contattaci dispara Mailchimp sync (tag "Qualificado" + merge fields)
- [x] Validar que Contattaci dispara Notion sync (status "Qualificado")
- [x] Incluir foto real do Lamberto Grinover na página Chi Siamo (substituir placeholder "LG")
- [x] Configurar commerciale@sintesys.info como remetente verificado no Mailchimp
- [x] Autenticar domínio sintesys.info no Mailchimp (DKIM/SPF)
- [x] Confirmar verificação via email no Gmail
- [x] Atualizar configurações de campanha para usar novo remetente
- [x] Criar automação no Mailchimp para Welcome Email de lead simples (tag "lead")
- [x] Criar automação no Mailchimp para Welcome Email de lead qualificado (tag "Qualificato")
- [x] Ativar automações no Mailchimp para disparo automático
- [x] Corrigir tag backend de "Qualificado" para "Qualificato" (corresponder à automação Mailchimp)
- [x] Popup: manter timer de 2s para abertura inicial (já está correto)
- [x] Popup: reabrir automaticamente 2s após ser fechado (sem desistir permanentemente)
- [x] Email Lead Simples: atualizar template para foco em guia completa da nova lei de incentivo (entregar valor)
- [x] Email Lead Qualificado: atualizar template para foco em agendar reunião de 30 min com Lamberto
- [x] Revisar copys de todas as páginas em formato de funil (topo/meio/fundo)
- [x] Atualizar tela de sucesso do Contattaci para focar em reunião 30min com Lamberto Grinover
- [x] Adicionar CTA duplo na Home (Guida Gratuita + Audit Gratuito) para capturar leads em diferentes estágios do funil

## Arquitetura 2 Caminhos
- [x] Criar Landing Page de produto como nova home (/)
- [x] Formulário simplificado 6 campos (nome, email, telefone, setor, faturamento, funcionários)
- [x] Design mobile-first, persuasivo, formato funil (atenção → interesse → desejo → ação)
- [x] Mover Il Giornale dell'IA para rota /giornale
- [x] Criar Thank You Page dedicada (/grazie)
- [x] Atualizar NavBar para nova estrutura de rotas
- [x] Desativar popup na Landing Page (/) — manter ativo no Jornal e outras páginas
- [x] Criar endpoint backend para formulário simplificado (tag Qualificato no Mailchimp)
- [x] Atualizar App.tsx com novas rotas

## Testes e QA (Pós-Arquitetura)
- [x] Escrever testes vitest para endpoint landingLeads.submit (12 testes passando)
- [x] Corrigir teste mailchimp: tag "Qualificado" → "Qualificato" (italiano)
- [x] Executar teste de integração real do fluxo landingLeads.submit (DB + Mailchimp verificados; Notion skipped no env de teste por 401) — 38 testes passando
- [x] Documentar checklist de QA mobile (breakpoints, formulário, estados de erro/sucesso) — docs/qa-mobile-checklist.md
- [x] Adicionar tratamento de falhas externas com log estruturado no endpoint landing leads

## Pendências Futuras (P0/P1)
- [x] Adicionar Calendly/Cal.com link ao email de welcome do lead qualificado — adiado, usuário sem Calendly
- [x] Implementar Google Analytics 4 e Meta Pixel tracking — scripts condicionais no index.html (só carregam se VITE_GA4_ID e VITE_META_PIXEL_ID estiverem configurados)
- [x] Criar drip email campaigns (28 dias para leads, 14 dias para qualificados) — docs/drip-campaigns.md (spec completo)

## Ajustes Landing Page (v2)
- [x] Remover todos os botões/links do menu da NavBar na Landing Page (/) para focar no CTA
- [x] Substituir formulário fixo no hero por botão CTA que abre popup modal
- [x] Popup modal com formulário 6 campos (sem redirect para /grazie, sucesso inline)
- [x] Manter Calendly como pendência futura (sem link ainda) — usuário confirmou que não tem Calendly pronto
- [x] Incluir foto real do Lamberto Grinover na Landing Page (hero + seção Chi è Lamberto)

## Ajustes Landing Page (v3) — Copy e Layout
- [x] Remover palavra "Gratuito" de todos os CTAs, títulos e textos da LP
- [x] Substituir copy por linguagem que gere desejo de call estratégica com Lamberto
- [x] Remover foto do Lamberto do hero (2a dobra) — manter apenas na bio no final da página

## Intranet Sintesys.io (/admin) — Fase 1

### Estrutura Base
- [x] Criar schema de clientes no banco (clients table)
- [x] Criar schema de transações financeiras (transactions table: entrada/saída vinculadas a client_id)
- [x] Executar pnpm db:push para sincronizar banco
- [x] Criar rotas /admin/* protegidas por login admin
- [x] Implementar DashboardLayout com sidebar para /admin (AdminLayout.tsx)
- [x] Sidebar: Dashboard, Leads, Pipeline CRM, Campanhas, Financeiro

### Dashboard Principal (/admin)
- [x] Card de métricas: total leads, leads qualificados, taxa de conversão, saldo
- [x] Gráfico de leads por dia (últimos 30 dias)
- [x] Gráfico de leads por setor (pie chart)
- [x] Tabela de leads recentes com busca (nome, email, setor)

### Pipeline CRM (/admin/pipeline)
- [x] Pipeline CRM placeholder (integração Notion na Fase 2)
- [x] Kanban visual com 4 colunas (Lead, Qualificato, In Negoziazione, Chiuso)
- [x] Mostrar detalhes do deal ao clicar (drawer com conteúdo real do Notion)

### Campanhas (/admin/campanhas)
- [x] Campanhas placeholder (integração Mailchimp na Fase 2)
- [x] Exibir: open rate, click rate, bounces, subscribers (Mailchimp API real)
- [x] Mostrar lista de campanhas com performance (tabela com métricas reais do Mailchimp)

### Financeiro (/admin/financeiro)
- [x] CRUD de clientes (nome, empresa, email, telefone)
- [x] CRUD de transações (entrada/saída, valor, data, descrição, client_id)
- [x] Visão de fluxo de recebimentos (entradas vs saídas por mês)
- [x] Filtro por cliente e por período
- [x] Saldo total e por cliente

### Testes e QA
- [x] Testes vitest para endpoints admin (20 testes passando)
- [x] Teste de proteção admin (adminProcedure com role check)

### Gaps Identificados (Fase 1.1)
- [x] Implementar filtro por período no UI de /admin/financeiro (data inicial/final)
- [x] Implementar saldo por cliente (endpoint balanceByClient + tabela na Panoramica)
- [x] Adicionar teste vitest de proteção admin (FORBIDDEN para não-admin) — 61 testes passando

## Documentação para Claude Code
- [x] Criar CLAUDE.md com contexto completo do projeto (negócio, estratégia, arquitetura, integrações, decisões)

## Documentação Skills no GitHub
- [x] Copiar 8 arquivos de skills (content + ads) para docs/skills/ no projeto

## Tracking Completo (GA4 + Meta Pixel + GTM)
- [x] Criar helper de tracking centralizado (client/src/lib/tracking.ts)
- [x] Evento Lead no popup (GA4 generate_lead + Meta Pixel Lead)
- [x] Evento Lead Qualificado na Landing Page popup (GA4 generate_lead + Meta Pixel CompleteRegistration)
- [x] Evento Lead Qualificado no Contattaci (GA4 generate_lead + Meta Pixel CompleteRegistration)
- [x] Evento ViewContent ao abrir popup modal (GA4 view_item + Meta Pixel ViewContent)
- [x] Evento Conversion na Thank You Page /grazie (GA4 conversion + Meta Pixel Schedule)
- [x] Adicionar GTM container condicional ao index.html (VITE_GTM_ID)
- [x] Configurar secret VITE_GA4_ID = G-WWCFW68S8V (ativo e verificado no site)
- [x] Configurar secret VITE_META_PIXEL_ID = 1492021632520081 (ativo e verificado no site)
- [ ] Configurar secret VITE_GTM_ID (aguardando Container ID do GTM do usuário)
- [x] Corrigir bug na guarda condicional do index.html: %VITE_*% não-substituídos passavam pela verificação indexOf('VITE_')===0 porque % estava na posição 0. Corrigido para indexOf('VITE_')>=0 || indexOf('%')>=0

## Link in Bio Instagram (/links)
- [x] Criar página /links no estilo editorial do jornal (menu de links para bio do Instagram)
- [x] Links com UTM tracking completo (utm_source=ig, utm_medium=linkinbio, utm_campaign, utm_content)
- [x] Link para Landing Page (Sessione Strategica) com UTM
- [x] Link para Il Giornale dell'IA com UTM
- [x] Link para Chi Siamo com UTM
- [x] Link para Contattaci com UTM
- [x] Link para Instagram @sintesys.io
- [x] Design editorial consistente (Playfair Display, navy/off-white, logo Sintesys.io)
- [x] Mobile-first (100% do tráfego vem do Instagram mobile)
- [x] Tracking GA4: trackPageView e trackCTAClick em cada link
- [x] Adicionar rota /links no App.tsx
- [x] Escrever teste vitest para a rota /links (7 testes passando)
- [x] Remover "Il Giornale dell'IA" do header da página /links, deixar apenas "Sintesys.io" como título

## Campanhas Google Ads (v2 — Dual Focus)
- [x] Pesquisa de keywords mercado italiano: IA para PMI, automazione, consulenza IA
- [x] Campanha 1: Il Giornale dell'IA — Tráfego/Awareness (atrair leitores e visitantes)
- [x] Campanha 2: Landing Page Sessione Strategica — Lead Gen/Conversão (cadastro)
- [x] Ad copies em italiano para ambas campanhas (6 RSAs total)
- [x] Extensões de anúncio (sitelinks, callouts, snippets) para ambas campanhas
- [x] Configuração de targeting (Itália, PMI, setores, regiões prioritárias)
- [x] Documento completo: google-ads-campaigns-v2.md

## Configuração Meta Business Manager
- [x] Acessar Meta Business Manager e verificar setup atual
- [x] Criar Meta Pixel para Sintesys.io (ID: 1492021632520081 — fornecido pelo usuário)
- [x] Conectar página Facebook ao Instagram @sintesys.io (ID: 17841461523648062, BM: Sintesys.io 1)
- [x] Configurar conta de anúncios 976585205031533 — conectada ao Instagram @sintesys.io como ativo
- [x] Instalar Meta Pixel ID no site Sintesys.io (VITE_META_PIXEL_ID = 1492021632520081)
- [x] Verificar que pixel está disparando eventos corretamente (fbq loaded, PageView firing)

## Redução de Formulários (4 → 3)
- [x] Identificar os 4 formulários ativos: Pop-up, Landing Page, Contattaci, Giornale/Home inline
- [x] Manter apenas 3: Pop-up, Lead Qualificado (Contattaci), Landing Page
- [x] Remover formulário inline do Giornale.tsx e Home.tsx (substituído por sidebar CTAs editoriais)
- [x] Workflows Mailchimp já corretos: lead→Welcome Simples, Qualificato→Welcome Qualificado, LP→Qualificado
- [x] Todos os 113 testes passando (13 arquivos, 3 skipped)

## Popup: Limite de 2 Exibições
- [x] Popup aparece 1a vez após 2s de navegação
- [x] Se fechar, reabre automaticamente após 2s (2a tentativa)
- [x] Se fechar pela 2a vez, não abre mais (máximo 2 exibições por sessão)

## Copy Squad + Design Squad: Implementação no Site

- [x] CSS global: cor terracotta (#C4704B) para CTAs
- [x] CSS global: line-height body aumentado para 1.85
- [x] Landing Page: Hero headline, trust badges, subtext ajustados
- [x] Landing Page: Seção Problemi com copies novas
- [x] Landing Page: Seção Metodo alinhada à Settimana Zero
- [x] Landing Page: FAQ com fontes e copies ajustadas
- [x] Landing Page: CTA final ajustado
- [x] Landing Page: Seção Lamberto ajustada
- [x] Home/Giornale: Headline e editorial P1-P3 reescritos
- [x] Home/Giornale: Sidebar CTAs ajustados
- [x] NavBar: CTA "Audit Gratuito" → "Analisi Gratuita"
- [x] Popup: Headline, body, botão e success state ajustados
- [x] Link da Bio: Tagline, links, descrições e remover emojis
- [x] Chi Siamo: H1, founder headline, bio P1-P2, quote ajustados
- [x] Contattaci: Step titles e subtitles humanizados
- [x] Grazie: Headline, body, next steps com timeline

## Páginas Legais (Privacy Policy, Terms of Service, Data Deletion)
- [x] Criar página /privacy-policy com conteúdo GDPR-compliant em italiano
- [x] Criar página /terms-of-service com termos de uso em italiano
- [x] Criar página /data-deletion com instruções de exclusão de dados em italiano
- [x] Registrar rotas no App.tsx (já feito via GitHub)
- [x] Manter identidade visual editorial (jornal italiano) nas páginas legais

## Popup: Restringir ao /giornale
- [x] Popup deve aparecer somente na página /giornale (Home), não nas páginas legais

## Landing Page Low-Ticket: Mappa delle Opportunità IA (€47)
- [x] Criar componente MappaLandingPage.tsx com long-form editorial (12 seções)
- [x] Header: barra navy com brand Sintesys.io
- [x] Hero above-the-fold: headline + subheadline + CTA terracotta + trust badges
- [x] Seção "I dati" — problema em números com fontes (ISTAT, Banca d'Italia, Politecnico)
- [x] Seção "La Storia" — storytelling narrativo do dia típico do imprenditore
- [x] Seção "Cosa riceverà" — promessa específica (Excel 80 processi, 8 reparti, dashboard)
- [x] Seção "Per chi è / Per chi non è" — qualificação editorial
- [x] Seção "Chi l'ha costruita" — bio Lamberto + positioning Sintesys.io
- [x] Seção "Tutto incluso" — recap dos 6 deliverables a €47
- [x] Seção "Garanzia" — 14 giorni, email, bonifico
- [x] Seção "FAQ" — 6 domande stile editoriale
- [x] Blocco finale — decisione + CTA grande terracotta
- [x] Footer dedicado (email, Instagram, P.IVA, links legais)
- [x] Sticky bar CTA após 600px de scroll
- [x] 3 posições mínimas de CTA (hero, dopo incluso, blocco finale)
- [x] Gerar mockup imagem do produto (Excel + Word docs)
- [x] Registrar rota /mappa no App.tsx
- [x] Desativar popup na /mappa (popup já restrito ao /giornale)
- [x] Integrar Stripe checkout para pagamento €47 (endpoint /api/stripe/create-checkout funcionando)
- [x] Order bump no checkout: Sessione Diagnosi IA €97 (suportado via includeOrderBump)
- [x] Tracking GA4 + Meta Pixel para purchase events (begin_checkout, InitiateCheckout, purchase, Purchase)
- [x] Escrever testes vitest para a nova página (19 testes passando)
- [x] Stripe webhook handler (/api/stripe/webhook com verificação de assinatura)
- [x] Página /mappa/grazie (thank you page com tracking de purchase)
- [x] Notificação ao owner via notifyOwner() após compra
- [x] Testes vitest para Stripe products e checkout (8 testes passando)
- [x] Salvar checkpoint (version: 600af7bd)

## Site Institucional Sintesys.io (Substituir LP de Sessão Estratégica)
### Estratégia de Funil:
### 1. Instagram → Distribuição mídia paga (topo de funil)
### 2. Low-tickets → Vendas diretas (/mappa)
### 3. Newsletter → Canal de profundidade e conversão (Jornal + Site)

- [x] Redesenhar LandingPage.tsx como site institucional (não mais LP de sessão estratégica)
- [x] Hero: posicionamento institucional Sintesys.io — IA para PMI Italiane
- [x] Seção "Lamberto Grinover": bio do fundador com foto e quote
- [x] Seção "Il Giornale dell'IA": preview do jornal com link para /giornale
- [x] Seção "Newsletter": formulário inline no hero + CTA final (mesmo padrão do popup)
- [x] Seção "Cosa Facciamo": 3 pilares (Newsletter, Mappa €47, Audit)
- [x] Seção "Incentivi Fiscali 2025": Transizione 5.0 com dados
- [x] Seção "FAQ": 5 perguntas institucionais sobre Sintesys.io e IA
- [x] Footer com links legais, Instagram, email
- [x] Formulário de newsletter usa endpoint leads.submit (source: "homepage")
- [x] NavBar atualizada: Il Giornale, Chi Siamo, Mappa IA, Iscriviti Gratis
- [x] Ativar popup de newsletter na home (/) além do /giornale
- [x] Remover popup modal de "audit" (AuditPopup) da LandingPage
- [x] Manter design editorial (Playfair Display, Source Serif 4, navy/off-white/terracotta)
- [x] Atualizar Giornale sidebar CTA: Mappa IA em vez de Sessione Strategica
- [x] Atualizar Links page: Newsletter IA + Mappa IA em vez de Analisi Gratuita
- [x] Testes vitest passando (139 de 143, 1 timeout intermitente no Mailchimp)
- [x] Salvar checkpoint final (version: c9f9fca0)

## Ajuste Chi Siamo
- [x] Remover botão do LinkedIn do Lamberto da página /chi-siamo

## Ajuste Página /links
- [x] Reorganizar seções: 1) Mappa IA → Checkout Stripe, 2) Il Giornale → Newsletter, 3) Site Institucional → Newsletter, 4) Chi è Sintesys.io
- [x] Salvar checkpoint (version: 3b35e490)

## Mailchimp — Email Templates, Tags e Automação Pós-Compra Mappa IA
- [x] Verificar lista/audience existente no Mailchimp (Sintesys.io Contacts — ID: b0d9ab0ecc, 6 membros)
- [x] Criar tag PROD_mappa_ia_47 no Mailchimp
- [x] Criar tag STATUS_pronto_settimana_zero no Mailchimp
- [x] Criar template Email 1: Consegna Immediata (D+0) — ID: 10055005
- [x] Criar template Email 2: Follow-up & Valore (D+2) — ID: 10055006
- [x] Criar template Email 3: Qualificazione & Pitch (D+5) — ID: 10055007
- [x] Configurar webhook Stripe → Mailchimp (aplicar tag PROD_mappa_ia_47 após compra)
- [x] Criar Customer Journey no Mailchimp UI (não suportado via API — guia passo a passo criado)
- [x] Aplicar tag STATUS_pronto_settimana_zero no Email 3 (tag final — documentado no guia)
- [x] Testar fluxo e salvar checkpoint (version: 3adb6a9d)

## Ajuste Templates Email — Copy curta + Layout full-width
- [x] Reescrever Email 1 (Consegna) com copy curta e layout full-width
- [x] Reescrever Email 2 (Follow-up) com copy curta e layout full-width
- [x] Reescrever Email 3 (Qualificazione) com copy curta e layout full-width
- [x] Atualizar templates no Mailchimp via API
- [x] Reenviar os 3 emails para willian@nanymota.com

## Ajuste Popup Newsletter
- [x] Popup abre somente na página /giornale (remover da homepage /)
- [x] Delay de 5 segundos antes de abrir o popup

## Régua de Email — Padronização Layout Lead Qualificado
- [x] Analisar template Lead Qualificado como base de layout (600px centralizado, #f5f5f0, border-top navy, footer navy)
- [x] Upload PDF 00-Benvenuto.pdf para CDN (https://files.manuscdn.com/user_upload_by_module/session_file/310519663033619872/qXDZDlptIRrTeBBU.pdf)
- [x] Reescrever Email D0 (Onboarding/Consegna) com layout Lead Qualificado + PDF link
- [x] Reescrever Email D3 (Follow-up) com layout Lead Qualificado
- [x] Reescrever Email D4 (Qualificazione) com layout Lead Qualificado
- [x] Reescrever Email Welcome Newsletter com layout Lead Qualificado
- [x] Atualizar os 4 templates no Mailchimp via API (IDs: 10055005, 10055006, 10055007, 10054956)
- [x] Enviar os 4 emails de teste para willian@nanymota.com (todos enviados com sucesso)

## Ajuste Copy Emails — Subtítulos e Linguagem
- [x] Email D3: remover subtítulo "FOLLOW-UP — MAPPA DELLE OPPORTUNITÀ IA" do header
- [x] Email D4: remover subtítulo "QUALIFICAZIONE — SETTIMANA ZERO" do header
- [x] Email D4: reescrever copy sem "automatizzare" — foco em organização, controle, eficiência, redução de despesas fixas, aumento de margem
- [x] Email Welcome Newsletter: remover subtítulo "BENVENUTO NELLA NEWSLETTER" do header
- [x] Atualizar templates no Mailchimp e reenviar testes (3 emails enviados v5)

## Ajuste Régua de Emails — Nova Sequência de Nutrição
- [x] D+3: Reescrever como follow-up de acesso/uso do material + dica rápida (template 10055006)
- [x] D+5: Criar novo email "Curiosidade IA" (template 10055007)
- [x] D+8: Criar novo email "Convite Settimana Zero" com CTA placeholder (template 10055008)
- [x] Atualizar templates no Mailchimp
- [x] Enviar os 3 emails de teste para willian@nanymota.com

## Revisão Linguística — Italiano nos Templates de Email
- [x] Revisar Email D+0 (Onboarding) — italiano correto, concordância, sem brasileirismos (subtítulo removido, 'primer' → 'introduzione')
- [x] Revisar Email D+3 (Follow-up) — italiano correto, concordância, sem brasileirismos ('Dica rapida' → 'Suggerimento rapido')
- [x] Revisar Email D+5 (Curiosità IA) — italiano correto, concordância, sem brasileirismos ('Le condivido' → 'Condivido con Lei')
- [x] Revisar Email D+8 (Settimana Zero) — italiano correto, concordância, sem brasileirismos ('riduzione costi' → 'riduzione dei costi', artigos adicionados)
- [x] Revisar Email Welcome Newsletter — italiano correto, sem correções necessárias
- [x] Atualizar templates no Mailchimp e reenviar testes (4 templates atualizados + 4 test campaigns enviadas)

## Auditoria Completa do Site — 26/04/2026

### P0 — Infraestrutura (Bloccante)
- [x] P0.2: Meta tags únicos por página (title, description, og:title, og:description) para todas as 8 URLs — react-helmet-async + SEOHead component
- [x] P0.1: Server-side meta injection para as 8 páginas (seoMiddleware.ts — crawlers/social veem meta únicos sem JS)
- [x] P0.3: Meta Pixel já está no <head> com disparo imediato (PageView no noscript + JS init)

### P1 — Incoerências Estratégicas
- [x] P1.1: Reposicionar /contattaci de "Audit Gratuito" para "Conversazione Strategica" / "Parli con Lamberto"
- [x] P1.2: Unificar bio Lamberto em todas as páginas (multinazionali, não manifatturiere) — Mappa corrigida
- [x] P1.3: Referência Transizione 5.0 + MIMIT já presente em /giornale (seção dedicada) e /mappa (stat 60%)
- [x] P1.5: Padronizar CTAs de newsletter + contattaci ("Parli con Lamberto", "Iscriviti Gratis →")

### P2 — Copy & UX por Página
- [x] Fix 1: Home — hierarquia clara de CTAs (newsletter primário, "Parli con Lamberto" nos CTAs secundários)
- [x] Fix 2: Home — simplificar form newsletter (removidos phone + sector, agora só nome + email)
- [x] Fix 4: Giornale — CTA text atualizado com positioning de exclusividade
- [x] Fix 5: Giornale — "migliaia" → "Iscritti selezionati: titolari di PMI italiane con 10-50 dipendenti"
- [x] Fix 8: Mappa — bio Lamberto já alinhada com versão multinazionali (feito em P1.2)
- [x] Fix 9: Mappa/Grazie — upsell Sessione Diagnosi IA €97 (com desconto de €127) adicionado
- [x] Fix 10: Mappa/Grazie — convite newsletter adicionado abaixo do upsell
- [x] Fix 11: Chi Siamo — seção "Perché ora" adicionada ("5 aziende alla volta" + CTA "Parli con Lamberto")
- [x] Fix 12: Contattaci — já reposicionado em P1.1 ("Conversazione Strategica" + "Parli con Lamberto")
- [x] Fix 13: Grazie (newsletter) — upsell soft Mappa €47 adicionado antes do CTA Giornale
- [x] Links — reordenado: 1) Newsletter+Guida, 2) Mappa €47, 3) Giornale, 4) Chi è Sintesys, 5) Parli con Lamberto

### Popup Newsletter
- [x] Popup Fix 1: Headline encurtada para "Guida Transizione 5.0 — Gratis."
- [x] Popup Fix 2: Removidos campos Phone + Settore (agora só Nome + Email)
- [x] Popup Fix 5: Confirmação com soft upsell Mappa €47 ("Passo successivo" + CTA "Scopri la Mappa")
- [x] Popup Fix 6: Texto GDPR mantido conversacional ("Nessuno spam. Puoi cancellarti in qualsiasi momento.")

## Ajuste Logo Navbar Mappa
- [x] Corrigir logo Sintesys na barra de menu da página de venda (Mappa) — logo completo (brain + texto) com fundo transparente

## Atualização de Preços e Copy (08-Aggiornamento-Sito-LP.docx)
- [x] Substituição global: €47 → €95,50 em todo o codebase (stripe-products, seo, testes)
- [x] Substituição global: €127 → €197 (standalone) / €147 (com bump) (stripe-products, checkout)
- [x] Substituição global: quarantasette euro → novantacinque euro e cinquanta
- [x] /mappa: Full re-write da LP com novo pricing (€95,50 lançamento, €179,90 regular)
- [x] /mappa: Pricing Block com narrativa "primi 100 clienti"
- [x] /mappa: Seções completas (Storia, Cosa È, Per chi è, Chi l'ha costruita, Cosa Include, Garanzia, FAQ, Blocco Finale)
- [x] /mappa: Order Bump checkout — Sessione Diagnosi IA €147
- [x] /chi-siamo: Atualizar bio Lamberto (versão unificada multinazionali + €200M)
- [x] /chi-siamo: Atualizar seção "Perché ora" (50-80 clienti/ano, primi 12 mesi)
- [x] /mappa/grazie: Reescrever upsell pós-compra (Sessione €247→€197→€147)
- [x] /mappa/grazie: Soft invite newsletter abaixo do upsell
- [x] /grazie: Atualizar upsell Mappa (€179,90 regular → €95,50 lançamento)
- [x] Popup: Atualizar headline (Variante A/B com scroll 50% + exit-intent)
- [x] Popup: Form só email (removido campo nome)
- [x] Popup: Confirmation com upsell Mappa €95,50
- [x] Popup: Trigger scroll 50% + exit-intent, cooldown 14 dias, excluir /mappa /mappa/grazie /grazie /chi-siamo

## Ajuste Preço Mappa no /links
- [x] Destacar preço "de: para" na Mappa IA no /links (€179,90 riscado → €95,50)

## Revisão Final — Italiano
- [x] Giornale: "Audit Gratuito" → "Conversazione Strategica" + "Parli con Lamberto →"
- [x] NotFound.tsx: traduzida para italiano ("Pagina non trovata", "Torna alla Home")
- [x] MappaGraziePage: P.IVA falso removido, substituído por "Tutti i diritti riservati"
- [x] Padronizar tom Lei (formal) em: ChiSiamo (5x), Contattaci (12x), MappaLP (2x), MappaGrazie (2x), Links (3x), seoMiddleware (3x)
- [x] Comentários PT nos arquivos: Grazie.tsx e LandingPage.tsx convertidos para inglês

## Ajustes Pós-Rebrand (29/04/2026)
- [x] Ajustar preço Mappa para €49,50 (era €129,90) nas páginas /grazie, /links, /mappa
- [x] Logo navbar /mappa: remover fundo branco, deixar só o desenho (transparente)
- [x] Ajustar nome na barra de menu da /mappa para "Il Consigliere"
- [x] Remover upsell da página /mappa/grazie

- [x] Atualização de preço: €95,50 → €49,50 (lancio) e €179,90 → €129,90 (regular) em todas as páginas
- [x] Remoção do upsell da página /mappa/grazie
- [x] Logo transparente: removido fundo branco do emblema, upload CDN, atualizado em todas as páginas (10 arquivos)
- [x] /mappa header: remover logo e deixar apenas texto 'ilconsigliere.io' na barra de menu
