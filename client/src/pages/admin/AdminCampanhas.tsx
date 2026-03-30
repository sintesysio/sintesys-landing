import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

/**
 * Campanhas — placeholder para integração com Mailchimp API.
 * Na Fase 2, este componente lerá métricas de campanhas via Mailchimp API.
 */

export default function AdminCampanhas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Campanhas Email</h1>
          <Badge variant="outline" className="text-slate-500">
            Mailchimp Integration
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricPlaceholder title="Iscritti" value="—" subtitle="totale lista" />
        <MetricPlaceholder title="Open Rate" value="—" subtitle="media campagne" />
        <MetricPlaceholder title="Click Rate" value="—" subtitle="media campagne" />
        <MetricPlaceholder title="Bounce Rate" value="—" subtitle="media campagne" />
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-amber-50">
              <Mail className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Integrazione con Mailchimp
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Questa sezione si collegherà all'API di Mailchimp per mostrare
                le metriche delle campagne email in tempo reale: open rate,
                click rate, bounce rate, lista iscritti e performance per
                campagna. Sarà disponibile nella Fase 2.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricPlaceholder({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-300">{value}</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}
