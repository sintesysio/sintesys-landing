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
