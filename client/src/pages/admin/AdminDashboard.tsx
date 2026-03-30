import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, TrendingUp, Wallet } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#1B2A4A",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export default function AdminDashboard() {
  const { data, isLoading } = trpc.admin.stats.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const leads = data?.leads;
  const financial = data?.financial;

  const conversionRate =
    leads && leads.totalLeads > 0
      ? ((leads.totalQualified / (leads.totalLeads + leads.totalQualified)) * 100).toFixed(1)
      : "0";

  const saldoFormatted = financial
    ? (financial.saldo / 100).toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
      })
    : "€0,00";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <span className="text-sm text-slate-500">
          {new Date().toLocaleDateString("it-IT", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Leads"
          value={leads?.totalLeads ?? 0}
          subtitle={`+${leads?.todayLeads ?? 0} oggi`}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <MetricCard
          title="Lead Qualificati"
          value={leads?.totalQualified ?? 0}
          subtitle={`+${leads?.todayQualified ?? 0} oggi`}
          icon={<UserCheck className="h-5 w-5 text-emerald-600" />}
          bgColor="bg-emerald-50"
        />
        <MetricCard
          title="Tasso Conversione"
          value={`${conversionRate}%`}
          subtitle="lead → qualificato"
          icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
          bgColor="bg-amber-50"
        />
        <MetricCard
          title="Saldo"
          value={saldoFormatted}
          subtitle="entrate - uscite"
          icon={<Wallet className="h-5 w-5 text-violet-600" />}
          bgColor="bg-violet-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700">
              Lead negli ultimi 30 giorni
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leads?.leadsByDay && leads.leadsByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={leads.leadsByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => {
                      const d = new Date(v);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#1B2A4A" radius={[4, 4, 0, 0]} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-slate-400">
                Nessun dato disponibile
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads by Sector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700">
              Lead per settore
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leads?.leadsBySector && leads.leadsBySector.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={280}>
                  <PieChart>
                    <Pie
                      data={leads.leadsBySector}
                      dataKey="count"
                      nameKey="sector"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                    >
                      {leads.leadsBySector.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {leads.leadsBySector.slice(0, 7).map((item, index) => (
                    <div
                      key={item.sector}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-slate-600 truncate">
                        {item.sector}
                      </span>
                      <span className="ml-auto font-medium text-slate-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-slate-400">
                Nessun dato disponibile
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Flow */}
      {financial?.monthlyFlow && financial.monthlyFlow.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700">
              Flusso finanziario mensile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={financial.monthlyFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => `€${(v / 100).toFixed(0)}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="entradas"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Entrate"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="saidas"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Uscite"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  bgColor,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
          <div className={`p-2.5 rounded-lg ${bgColor}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
