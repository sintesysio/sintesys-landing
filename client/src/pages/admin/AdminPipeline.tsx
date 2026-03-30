import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kanban } from "lucide-react";

/**
 * Pipeline CRM — placeholder para integração com Notion.
 * Na Fase 2, este componente lerá o pipeline do Notion via API
 * e exibirá como Kanban visual.
 */

const PIPELINE_STAGES = [
  {
    id: "lead",
    title: "Lead",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    headerColor: "border-t-blue-500",
    items: [],
  },
  {
    id: "qualificato",
    title: "Qualificato",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    headerColor: "border-t-emerald-500",
    items: [],
  },
  {
    id: "negoziazione",
    title: "In Negoziazione",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    headerColor: "border-t-amber-500",
    items: [],
  },
  {
    id: "chiuso",
    title: "Chiuso",
    color: "bg-violet-100 text-violet-700 border-violet-200",
    headerColor: "border-t-violet-500",
    items: [],
  },
];

export default function AdminPipeline() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Pipeline CRM</h1>
          <Badge variant="outline" className="text-slate-500">
            Notion Integration
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_STAGES.map((stage) => (
          <Card key={stage.id} className={`border-t-4 ${stage.headerColor}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  {stage.title}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {stage.items.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 min-h-[200px]">
              <div className="flex flex-col items-center justify-center h-[180px] text-center">
                <Kanban className="h-8 w-8 text-slate-300 mb-3" />
                <p className="text-sm text-slate-400">
                  Integrazione Notion
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  In arrivo nella Fase 2
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Kanban className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Integrazione con Notion CRM
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Questa sezione si collegherà al database CRM di Notion per
                visualizzare il pipeline di vendita in tempo reale. I deal
                verranno mostrati come card Kanban con drag-and-drop per
                aggiornare lo stato direttamente dal pannello.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
