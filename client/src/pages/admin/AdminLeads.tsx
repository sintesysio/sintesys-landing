import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

export default function AdminLeads() {
  const { data, isLoading } = trpc.admin.leads.list.useQuery();
  const [search, setSearch] = useState("");

  const filteredSimple = useMemo(() => {
    if (!data?.simple) return [];
    if (!search) return data.simple;
    const q = search.toLowerCase();
    return data.simple.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.sector.toLowerCase().includes(q)
    );
  }, [data?.simple, search]);

  const filteredQualified = useMemo(() => {
    if (!data?.qualified) return [];
    if (!search) return data.qualified;
    const q = search.toLowerCase();
    return data.qualified.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.sector.toLowerCase().includes(q)
    );
  }, [data?.qualified, search]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
            {data?.simple?.length ?? 0} semplici
          </Badge>
          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
            {data?.qualified?.length ?? 0} qualificati
          </Badge>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cerca per nome, email o settore..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="simple">
        <TabsList>
          <TabsTrigger value="simple">
            Lead Semplici ({filteredSimple.length})
          </TabsTrigger>
          <TabsTrigger value="qualified">
            Lead Qualificati ({filteredQualified.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefono</TableHead>
                      <TableHead>Settore</TableHead>
                      <TableHead>Fonte</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSimple.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                          Nessun lead trovato
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSimple.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell className="text-slate-600">{lead.email}</TableCell>
                          <TableCell className="text-slate-600">{lead.phone || "—"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {lead.sector}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-500 text-xs">{lead.source}</TableCell>
                          <TableCell className="text-slate-500 text-xs">
                            {new Date(lead.createdAt).toLocaleDateString("it-IT")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualified">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Azienda</TableHead>
                      <TableHead>Settore</TableHead>
                      <TableHead>Fatturato</TableHead>
                      <TableHead>Dipendenti</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQualified.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                          Nessun lead qualificato trovato
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQualified.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell className="text-slate-600">{lead.email}</TableCell>
                          <TableCell className="text-slate-600">{lead.companyName || "—"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {lead.sector}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600 text-sm">{lead.revenue}</TableCell>
                          <TableCell className="text-slate-600 text-sm">{lead.employees}</TableCell>
                          <TableCell className="text-slate-500 text-xs">
                            {new Date(lead.createdAt).toLocaleDateString("it-IT")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
