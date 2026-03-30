import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Users,
  MousePointerClick,
  Eye,
  AlertTriangle,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export default function AdminCampanhas() {
  const {
    data: listStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = trpc.admin.campaigns.listStats.useQuery();

  const {
    data: campaigns,
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = trpc.admin.campaigns.list.useQuery();

  const handleRefresh = () => {
    refetchStats();
    refetchCampaigns();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Campanhas Email</h1>
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Mailchimp Live
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Aggiorna
        </Button>
      </div>

      {/* Error state */}
      {(statsError || campaignsError) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Errore di connessione con Mailchimp
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                {statsError?.message || campaignsError?.message || "Verifica le credenziali API"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50"
          title="Iscritti"
          value={statsLoading ? null : listStats?.memberCount ?? 0}
          subtitle="totale lista"
          format="number"
        />
        <MetricCard
          icon={<Eye className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          title="Open Rate"
          value={statsLoading ? null : listStats?.avgOpenRate ?? 0}
          subtitle="media campagne"
          format="percent"
        />
        <MetricCard
          icon={<MousePointerClick className="h-5 w-5 text-violet-600" />}
          iconBg="bg-violet-50"
          title="Click Rate"
          value={statsLoading ? null : listStats?.avgClickRate ?? 0}
          subtitle="media campagne"
          format="percent"
        />
        <MetricCard
          icon={<Mail className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-50"
          title="Campagne"
          value={statsLoading ? null : listStats?.campaignCount ?? 0}
          subtitle="totale inviate"
          format="number"
        />
      </div>

      {/* Campaigns table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campagne Recenti</CardTitle>
        </CardHeader>
        <CardContent>
          {campaignsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !campaigns || campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Nessuna campagna trovata</p>
              <p className="text-xs text-slate-400 mt-1">
                Le campagne inviate tramite Mailchimp appariranno qui
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-slate-500">Campagna</th>
                    <th className="pb-3 font-medium text-slate-500 text-center">Stato</th>
                    <th className="pb-3 font-medium text-slate-500 text-right">Destinatari</th>
                    <th className="pb-3 font-medium text-slate-500 text-right">Open Rate</th>
                    <th className="pb-3 font-medium text-slate-500 text-right">Click Rate</th>
                    <th className="pb-3 font-medium text-slate-500 text-right">Bounce</th>
                    <th className="pb-3 font-medium text-slate-500 text-right">Unsub</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-slate-900 truncate max-w-[250px]">
                            {c.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {c.sendTime
                              ? new Date(c.sendTime).toLocaleDateString("it-IT", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <CampaignStatusBadge status={c.status} />
                      </td>
                      <td className="py-3 text-right font-medium text-slate-700">
                        {c.recipients.toLocaleString("it-IT")}
                      </td>
                      <td className="py-3 text-right">
                        <span className={getRateColor(c.opens.rate * 100, "open")}>
                          {(c.opens.rate * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={getRateColor(c.clicks.rate * 100, "click")}>
                          {(c.clicks.rate * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-500">
                        {c.bounces.hardBounces + c.bounces.softBounces}
                      </td>
                      <td className="py-3 text-right text-slate-500">{c.unsubscribes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon,
  iconBg,
  title,
  value,
  subtitle,
  format,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: number | null;
  subtitle: string;
  format: "number" | "percent";
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">{title}</p>
            {value === null ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-slate-900">
                {format === "percent"
                  ? `${(value * 100).toFixed(1)}%`
                  : value.toLocaleString("it-IT")}
              </p>
            )}
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
          <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignStatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
    sent: {
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Inviata",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    sending: {
      icon: <Send className="h-3 w-3" />,
      label: "In invio",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    schedule: {
      icon: <Clock className="h-3 w-3" />,
      label: "Programmata",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    paused: {
      icon: <XCircle className="h-3 w-3" />,
      label: "In pausa",
      className: "bg-slate-50 text-slate-600 border-slate-200",
    },
    save: {
      icon: <Clock className="h-3 w-3" />,
      label: "Bozza",
      className: "bg-slate-50 text-slate-500 border-slate-200",
    },
  };

  const c = config[status] || config.save;

  return (
    <Badge variant="outline" className={`gap-1 ${c?.className}`}>
      {c?.icon}
      {c?.label}
    </Badge>
  );
}

function getRateColor(rate: number, type: "open" | "click"): string {
  if (type === "open") {
    if (rate >= 25) return "font-medium text-emerald-600";
    if (rate >= 15) return "font-medium text-amber-600";
    return "font-medium text-red-500";
  }
  // click
  if (rate >= 5) return "font-medium text-emerald-600";
  if (rate >= 2) return "font-medium text-amber-600";
  return "font-medium text-red-500";
}
