import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  Filter,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
  });
}

export default function AdminFinanceiro() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="clients">Clienti</TabsTrigger>
          <TabsTrigger value="transactions">Transazioni</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <FinancialOverview />
        </TabsContent>
        <TabsContent value="clients">
          <ClientsTab />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FinancialOverview() {
  const { data, isLoading } = trpc.admin.transactions.summary.useQuery();
  const { data: balanceByClient, isLoading: loadingBalances } =
    trpc.admin.transactions.balanceByClient.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Entrate Totali</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(data?.totalEntradas ?? 0)}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Uscite Totali</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(data?.totalSaidas ?? 0)}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Saldo</p>
                <p
                  className={`text-2xl font-bold ${
                    (data?.saldo ?? 0) >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(data?.saldo ?? 0)}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-violet-50">
                <Wallet className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance by client */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-700">
            Saldo per Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingBalances ? (
            <div className="p-6">
              <Skeleton className="h-[120px] w-full" />
            </div>
          ) : !balanceByClient || balanceByClient.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              Nessuna transazione registrata
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Azienda</TableHead>
                  <TableHead className="text-right">Entrate</TableHead>
                  <TableHead className="text-right">Uscite</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balanceByClient.map((b) => (
                  <TableRow key={b.clientId}>
                    <TableCell className="font-medium">
                      {b.clientName}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {b.clientCompany || "—"}
                    </TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">
                      {formatCurrency(b.entradas)}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      {formatCurrency(b.saidas)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        b.saldo >= 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(b.saldo)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ClientsTab() {
  const utils = trpc.useUtils();
  const { data: clientsList, isLoading } = trpc.admin.clients.list.useQuery();
  const createClient = trpc.admin.clients.create.useMutation({
    onSuccess: () => {
      utils.admin.clients.list.invalidate();
      toast.success("Cliente creato");
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteClient = trpc.admin.clients.delete.useMutation({
    onSuccess: () => {
      utils.admin.clients.list.invalidate();
      utils.admin.transactions.list.invalidate();
      utils.admin.transactions.summary.invalidate();
      utils.admin.transactions.balanceByClient.invalidate();
      toast.success("Cliente eliminato");
    },
    onError: (err) => toast.error(err.message),
  });

  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full mt-4" />;
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {clientsList?.length ?? 0} clienti registrati
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-2 bg-[#1B2A4A] hover:bg-[#2a3d66]"
            >
              <Plus className="h-4 w-4" />
              Nuovo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
                  }
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label>Azienda</Label>
                <Input
                  value={newClient.company}
                  onChange={(e) =>
                    setNewClient({ ...newClient, company: e.target.value })
                  }
                  placeholder="Nome azienda"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  placeholder="email@esempio.it"
                />
              </div>
              <div>
                <Label>Telefono</Label>
                <Input
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient({ ...newClient, phone: e.target.value })
                  }
                  placeholder="+39..."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annulla</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (!newClient.name.trim()) {
                      toast.error("Nome obbligatorio");
                      return;
                    }
                    createClient.mutate({
                      name: newClient.name,
                      company: newClient.company || undefined,
                      email: newClient.email || undefined,
                      phone: newClient.phone || undefined,
                    });
                    setNewClient({
                      name: "",
                      company: "",
                      email: "",
                      phone: "",
                    });
                  }}
                  className="bg-[#1B2A4A] hover:bg-[#2a3d66]"
                >
                  Crea
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Azienda</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!clientsList || clientsList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-slate-400 py-8"
                  >
                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    Nessun cliente registrato
                  </TableCell>
                </TableRow>
              ) : (
                clientsList.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-slate-600">
                      {client.company || "—"}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {client.email || "—"}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {client.phone || "—"}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(client.createdAt).toLocaleDateString("it-IT")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => {
                          if (
                            confirm(
                              "Eliminare questo cliente e tutte le sue transazioni?"
                            )
                          ) {
                            deleteClient.mutate({ id: client.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionsTab() {
  const utils = trpc.useUtils();
  const { data: clientsList } = trpc.admin.clients.list.useQuery();

  // Period filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [filtersActive, setFiltersActive] = useState(false);

  // Build query input based on filters
  const queryInput = useMemo(() => {
    if (clientFilter) return { clientId: parseInt(clientFilter) };
    if (startDate && endDate) return { startDate, endDate };
    return undefined;
  }, [clientFilter, startDate, endDate]);

  const { data: txList, isLoading } =
    trpc.admin.transactions.list.useQuery(queryInput);

  const createTx = trpc.admin.transactions.create.useMutation({
    onSuccess: () => {
      utils.admin.transactions.list.invalidate();
      utils.admin.transactions.summary.invalidate();
      utils.admin.transactions.balanceByClient.invalidate();
      utils.admin.stats.invalidate();
      toast.success("Transazione registrata");
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteTx = trpc.admin.transactions.delete.useMutation({
    onSuccess: () => {
      utils.admin.transactions.list.invalidate();
      utils.admin.transactions.summary.invalidate();
      utils.admin.transactions.balanceByClient.invalidate();
      utils.admin.stats.invalidate();
      toast.success("Transazione eliminata");
    },
    onError: (err) => toast.error(err.message),
  });

  const [newTx, setNewTx] = useState({
    clientId: "",
    type: "entrada" as "entrada" | "saida",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const clientMap = new Map(
    (clientsList ?? []).map((c) => [c.id, c.name])
  );

  const applyFilters = () => {
    setFiltersActive(true);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setClientFilter("");
    setFiltersActive(false);
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Filters bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Filter className="h-4 w-4" />
              Filtri
            </div>
            <div className="flex-1 min-w-[140px]">
              <Label className="text-xs text-slate-500">Cliente</Label>
              <Select
                value={clientFilter}
                onValueChange={(v) => {
                  setClientFilter(v);
                  setFiltersActive(true);
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tutti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti</SelectItem>
                  {(clientsList ?? []).map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[140px]">
              <Label className="text-xs text-slate-500">Da</Label>
              <Input
                type="date"
                className="h-9"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="min-w-[140px]">
              <Label className="text-xs text-slate-500">A</Label>
              <Input
                type="date"
                className="h-9"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-9"
              onClick={applyFilters}
            >
              Applica
            </Button>
            {filtersActive && (
              <Button
                size="sm"
                variant="ghost"
                className="h-9 text-slate-500"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {txList?.length ?? 0} transazioni
          {filtersActive && " (filtrate)"}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-2 bg-[#1B2A4A] hover:bg-[#2a3d66]"
            >
              <Plus className="h-4 w-4" />
              Nuova Transazione
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuova Transazione</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Cliente *</Label>
                <Select
                  value={newTx.clientId}
                  onValueChange={(v) => setNewTx({ ...newTx, clientId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {(clientsList ?? []).map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} {c.company ? `(${c.company})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo *</Label>
                <Select
                  value={newTx.type}
                  onValueChange={(v) =>
                    setNewTx({ ...newTx, type: v as "entrada" | "saida" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrata</SelectItem>
                    <SelectItem value="saida">Uscita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Importo (€) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newTx.amount}
                  onChange={(e) =>
                    setNewTx({ ...newTx, amount: e.target.value })
                  }
                  placeholder="150.00"
                />
              </div>
              <div>
                <Label>Descrizione *</Label>
                <Input
                  value={newTx.description}
                  onChange={(e) =>
                    setNewTx({ ...newTx, description: e.target.value })
                  }
                  placeholder="Consulenza IA — Fase 1"
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <Input
                  value={newTx.category}
                  onChange={(e) =>
                    setNewTx({ ...newTx, category: e.target.value })
                  }
                  placeholder="Consulenza, Software, Marketing..."
                />
              </div>
              <div>
                <Label>Data *</Label>
                <Input
                  type="date"
                  value={newTx.date}
                  onChange={(e) =>
                    setNewTx({ ...newTx, date: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annulla</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (
                      !newTx.clientId ||
                      !newTx.amount ||
                      !newTx.description
                    ) {
                      toast.error("Compilare tutti i campi obbligatori");
                      return;
                    }
                    createTx.mutate({
                      clientId: parseInt(newTx.clientId),
                      type: newTx.type,
                      amount: Math.round(parseFloat(newTx.amount) * 100),
                      description: newTx.description,
                      category: newTx.category || undefined,
                      date: newTx.date,
                    });
                    setNewTx({
                      clientId: "",
                      type: "entrada",
                      amount: "",
                      description: "",
                      category: "",
                      date: new Date().toISOString().split("T")[0],
                    });
                  }}
                  className="bg-[#1B2A4A] hover:bg-[#2a3d66]"
                >
                  Registra
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Importo</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!txList || txList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-slate-400 py-8"
                    >
                      <Wallet className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      Nessuna transazione
                      {filtersActive ? " per i filtri selezionati" : " registrata"}
                    </TableCell>
                  </TableRow>
                ) : (
                  txList.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-slate-600 text-sm">
                        {tx.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.type === "entrada" ? "default" : "destructive"
                          }
                          className={
                            tx.type === "entrada"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {tx.type === "entrada" ? "Entrata" : "Uscita"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {clientMap.get(tx.clientId) || `#${tx.clientId}`}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {tx.description}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {tx.category || "—"}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          tx.type === "entrada"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "entrada" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600"
                          onClick={() => {
                            if (confirm("Eliminare questa transazione?")) {
                              deleteTx.mutate({ id: tx.id });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
