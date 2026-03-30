import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Kanban,
  User,
  Mail,
  Phone,
  Building2,
  Clock,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Star,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const PIPELINE_STAGES = [
  {
    id: "lead",
    title: "Lead",
    notionStatuses: ["Lead"],
    color: "bg-blue-100 text-blue-700 border-blue-200",
    headerColor: "border-t-blue-500",
    dotColor: "bg-blue-500",
  },
  {
    id: "qualificato",
    title: "Qualificato",
    notionStatuses: ["Qualificado"],
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    headerColor: "border-t-emerald-500",
    dotColor: "bg-emerald-500",
  },
  {
    id: "negoziazione",
    title: "In Negoziazione",
    notionStatuses: ["In Negoziazione", "Negoziazione"],
    color: "bg-amber-100 text-amber-700 border-amber-200",
    headerColor: "border-t-amber-500",
    dotColor: "bg-amber-500",
  },
  {
    id: "chiuso",
    title: "Chiuso",
    notionStatuses: ["Chiuso", "Chiuso Vinto", "Chiuso Perso"],
    color: "bg-violet-100 text-violet-700 border-violet-200",
    headerColor: "border-t-violet-500",
    dotColor: "bg-violet-500",
  },
];

export default function AdminPipeline() {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: deals,
    isLoading,
    error,
    refetch,
  } = trpc.admin.pipeline.deals.useQuery();

  const {
    data: dealDetail,
    isLoading: detailLoading,
  } = trpc.admin.pipeline.dealDetail.useQuery(
    { pageId: selectedDealId! },
    { enabled: !!selectedDealId }
  );

  // Group deals by stage
  const stagesWithDeals = useMemo(() => {
    if (!deals) return PIPELINE_STAGES.map((s) => ({ ...s, items: [] as NonNullable<typeof deals> }));

    return PIPELINE_STAGES.map((stage) => ({
      ...stage,
      items: deals.filter((d) => stage.notionStatuses.includes(d.status)),
    }));
  }, [deals]);

  const totalDeals = deals?.length || 0;

  const handleDealClick = (dealId: string) => {
    setSelectedDealId(dealId);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Pipeline CRM</h1>
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Notion Live
          </Badge>
          {totalDeals > 0 && (
            <Badge variant="secondary">{totalDeals} deal{totalDeals !== 1 ? "s" : ""}</Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Aggiorna
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Errore di connessione con Notion
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                {error.message || "Verifica la NOTION_API_KEY e i permessi del database"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stagesWithDeals.map((stage) => (
          <Card key={stage.id} className={`border-t-4 ${stage.headerColor}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  {stage.title}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {isLoading ? "…" : (stage.items?.length ?? 0)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 min-h-[200px]">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : !stage.items || stage.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[180px] text-center">
                  <Kanban className="h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-sm text-slate-400">Nessun deal</p>
                </div>
              ) : (
                (stage.items ?? []).map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => handleDealClick(deal.id)}
                    className="w-full text-left p-3 rounded-lg border bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 text-sm truncate">
                          {deal.name}
                        </p>
                        {deal.company && (
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <Building2 className="h-3 w-3 shrink-0" />
                            <span className="truncate">{deal.company}</span>
                          </p>
                        )}
                        {deal.email && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{deal.email}</p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 shrink-0 mt-0.5" />
                    </div>
                    {deal.priority && (
                      <div className="mt-2">
                        <PriorityBadge priority={deal.priority} />
                      </div>
                    )}
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deal Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Dettagli Deal</SheetTitle>
          </SheetHeader>

          {detailLoading || !dealDetail ? (
            <div className="space-y-4 mt-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <div className="space-y-6 mt-6">
              {/* Deal header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">{dealDetail.deal.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={dealDetail.deal.status} />
                  {dealDetail.deal.priority && (
                    <PriorityBadge priority={dealDetail.deal.priority} />
                  )}
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Contatto
                </h4>
                <div className="space-y-2">
                  {dealDetail.deal.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <a
                        href={`mailto:${dealDetail.deal.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {dealDetail.deal.email}
                      </a>
                    </div>
                  )}
                  {dealDetail.deal.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <a
                        href={`tel:${dealDetail.deal.phone}`}
                        className="text-slate-700 hover:underline"
                      >
                        {dealDetail.deal.phone}
                      </a>
                    </div>
                  )}
                  {dealDetail.deal.company && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">{dealDetail.deal.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-500">Creato:</span>
                    <span className="text-slate-700">
                      {new Date(dealDetail.deal.createdTime).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-500">Aggiornato:</span>
                    <span className="text-slate-700">
                      {new Date(dealDetail.deal.lastEditedTime).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              {dealDetail.content && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Note e Dettagli
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {dealDetail.content}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    Lead: "bg-blue-50 text-blue-700 border-blue-200",
    Qualificado: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Negoziazione": "bg-amber-50 text-amber-700 border-amber-200",
    Negoziazione: "bg-amber-50 text-amber-700 border-amber-200",
    Chiuso: "bg-violet-50 text-violet-700 border-violet-200",
    "Chiuso Vinto": "bg-green-50 text-green-700 border-green-200",
    "Chiuso Perso": "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <Badge variant="outline" className={config[status] || "bg-slate-50 text-slate-600"}>
      {status}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { className: string; stars: number }> = {
    Alta: { className: "text-red-600", stars: 3 },
    Media: { className: "text-amber-600", stars: 2 },
    Baixa: { className: "text-slate-400", stars: 1 },
  };

  const c = config[priority] || config.Media;

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs ${c?.className}`}>
      {Array.from({ length: c?.stars || 1 }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-current" />
      ))}
      <span className="ml-1">{priority}</span>
    </span>
  );
}
