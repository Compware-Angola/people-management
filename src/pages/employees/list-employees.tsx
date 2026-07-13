import { useEffect, useState } from "react";
import {
    Users,
    Search,
    Plus,
    Eye,
    Pencil,
    Archive,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { EmployeeFormModal, type Employee, type EmployeeFormValues } from "./components/employee-form-modal";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";



const PAGE_SIZE_OPTIONS = ["10", "20", "50"];

// Mock: dados de colaboradores (em produção viriam do EmployeeService via API)
const MOCK_EMPLOYEES: Employee[] = [
    {
        id: 1,
        name: "João Manuel da Silva",
        bi: "003456789LA042",
        nif: "5417896321",
        phone: "923 456 789",
        alternativePhone: "222 345 678",
        province: "Luanda",
        municipality: "Belas",
        address: "Rua das Acácias, nº 12, Talatona",
        email: "joao.silva@empresa.co.ao",
        bank: "BAI",
        iban: "AO06 0040 0000 1234 5678 9012 3",
        accountHolder: "João Manuel da Silva",
        currency: "AOA",
        status: 1,
        createdAt: "2025-01-10T09:15:00Z",
    },
    {
        id: 2,
        name: "Maria Fernanda dos Santos",
        bi: "004512378LA033",
        nif: "5423178965",
        phone: "912 345 678",
        alternativePhone: null,
        province: "Luanda",
        municipality: "Viana",
        address: "Bairro Zango 3, Rua 15",
        email: "maria.santos@empresa.co.ao",
        bank: "BFA",
        iban: "AO06 0006 0000 9876 5432 1098 7",
        accountHolder: "Maria Fernanda dos Santos",
        currency: "AOA",
        status: 1,
        createdAt: "2025-01-14T11:40:00Z",
    },
    {
        id: 3,
        name: "Ana Paula Costa Neto",
        bi: "005698741LA019",
        nif: "5439871245",
        phone: "934 567 123",
        alternativePhone: "923 111 222",
        province: "Benguela",
        municipality: "Benguela",
        address: "Rua Comandante Che Guevara, 45",
        email: "ana.costa@empresa.co.ao",
        bank: "BIC",
        iban: "AO06 0051 0000 4567 8912 3456 1",
        accountHolder: "Ana Paula Costa Neto",
        currency: "AOA",
        status: 0,
        createdAt: "2024-11-02T08:20:00Z",
    },
    {
        id: 4,
        name: "Pedro António Gomes",
        bi: "006123457LA027",
        nif: "5445632198",
        phone: "941 234 567",
        alternativePhone: null,
        province: "Huambo",
        municipality: "Huambo",
        address: "Avenida da Independência, 200",
        email: "pedro.gomes@empresa.co.ao",
        bank: "Standard Bank",
        iban: "AO06 0025 0000 3216 5498 7123 4",
        accountHolder: "Pedro António Gomes",
        currency: "AOA",
        status: 1,
        createdAt: "2025-02-03T14:05:00Z",
    },
    {
        id: 5,
        name: "Isabel Cristina Mendes",
        bi: "007894561LA054",
        nif: "5451237896",
        phone: "952 678 912",
        alternativePhone: "222 987 654",
        province: "Bengo",
        municipality: "Calumbo",
        address: "Rua Principal, s/n",
        email: "isabel.mendes@empresa.co.ao",
        bank: "Atlântico",
        iban: "AO06 0055 0000 7891 2345 6789 0",
        accountHolder: "Isabel Cristina Mendes",
        currency: "AOA",
        status: 1,
        createdAt: "2025-02-20T16:50:00Z",
    },
    {
        id: 6,
        name: "Carlos Alberto Domingos",
        bi: "008732541LA066",
        nif: "5467891234",
        phone: "913 789 456",
        alternativePhone: null,
        province: "Huíla",
        municipality: "Lubango",
        address: "Bairro Comercial, Rua 4",
        email: "carlos.domingos@empresa.co.ao",
        bank: "BAI",
        iban: "AO06 0040 0000 6543 2198 7654 3",
        accountHolder: "Carlos Alberto Domingos",
        currency: "AOA",
        status: 0,
        createdAt: "2024-09-18T10:30:00Z",
    },
];

export function ListEmployees() {
    const navigate = useNavigate();


    const [allEmployees, setAllEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
        null,
    );

    const openCreateModal = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const openEditModal = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    // Mock: cria ou atualiza um colaborador diretamente no state local
    const handleSaveEmployee = async (
        values: EmployeeFormValues,
        id?: number,
    ) => {
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (id) {
            setAllEmployees((prev) =>
                prev.map((item) => (item.id === id ? { ...item, ...values } : item)),
            );
            toast("Colaborador atualizado", {
                description: `${values.name} foi atualizado com sucesso.`,
            });
        } else {
            const nextId = Math.max(0, ...allEmployees.map((e) => e.id)) + 1;
            const newEmployee: Employee = {
                ...values,
                id: nextId,
                createdAt: new Date().toISOString(),
            };
            setAllEmployees((prev) => [newEmployee, ...prev]);
            toast("Colaborador criado", {
                description: `${values.name} foi registado com sucesso.`,
            });
        }
    };

    // Mock: simula latência de rede ao "carregar" os colaboradores
    const fetchEmployees = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleArchive = async (employee: Employee) => {
        setAllEmployees((prev) =>
            prev.map((item) =>
                item.id === employee.id ? { ...item, status: 0 } : item,
            ),
        );

        toast("Colaborador arquivado", {
            description: `${employee.name} foi marcado como inativo.`,
        });
    };

    const searchedEmployees = allEmployees.filter((employee) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
            employee.name.toLowerCase().includes(term) ||
            employee.bi.toLowerCase().includes(term) ||
            employee.nif.toLowerCase().includes(term) ||
            employee.email.toLowerCase().includes(term)
        );
    });

    const total = searchedEmployees.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);

    const filteredEmployees = searchedEmployees.slice(
        (currentPage - 1) * limit,
        currentPage * limit,
    );

    const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1;
    const rangeEnd = Math.min(currentPage * limit, total);

    return (
        <div className="flex-1 space-y-6 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Colaboradores</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Colaboradores
                    </h1>
                    <p className="text-muted-foreground">
                        Consultar e gerir os colaboradores registados
                    </p>
                </div>

                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Colaborador
                </Button>
            </div>

            <div className="rounded-lg border border-border bg-card shadow-sm">
                {/* Barra de filtros */}
                <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar por nome, BI, NIF ou email..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="bg-background pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Itens por página</span>
                        <Select
                            value={String(limit)}
                            onValueChange={(value) => {
                                setLimit(Number(value));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[80px] bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZE_OPTIONS.map((size) => (
                                    <SelectItem key={size} value={size}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>BI</TableHead>
                                <TableHead>NIF</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Província</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center">
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            A carregar colaboradores...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredEmployees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Users className="h-8 w-8" />
                                            <span>Nenhum colaborador encontrado.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell className="font-medium text-foreground">
                                            {employee.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {employee.bi}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {employee.nif}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {employee.phone}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {employee.province}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {employee.email}
                                        </TableCell>
                                        <TableCell>
                                            {employee.status === 1 ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    Ativo
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Inativo</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-1">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"

                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Ver detalhes</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditModal(employee)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Editar</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                disabled={employee.status === 0}
                                                                onClick={() => handleArchive(employee)}
                                                            >
                                                                <Archive className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Arquivar</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginação */}
                <div className="flex flex-col gap-3 border-t border-border p-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                    <span>
                        {total === 0
                            ? "0 resultados"
                            : `A mostrar ${rangeStart}–${rangeEnd} de ${total}`}
                    </span>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1 || isLoading}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Anterior
                        </Button>
                        <span className="text-foreground">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages || isLoading}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            Seguinte
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <EmployeeFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                employee={editingEmployee}
                onSave={handleSaveEmployee}
            />
        </div>
    );
}