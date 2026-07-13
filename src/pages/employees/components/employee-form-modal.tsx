import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, X } from "lucide-react";


export interface Employee {
    id: number;
    name: string;
    bi: string;
    nif: string;
    phone: string;
    alternativePhone: string | null;
    province: string;
    municipality: string;
    address: string;
    email: string;
    bank: string;
    iban: string;
    accountHolder: string;
    currency: string;
    status: number;
    createdAt: string;
}

// Payload equivalente ao CreateEmployeeDto (sem id/createdAt)
export type EmployeeFormValues = Omit<Employee, "id" | "createdAt">;

interface EmployeeFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee?: Employee | null;
    onSave: (values: EmployeeFormValues, id?: number) => Promise<void> | void;
}

const provincias = [
    "Bengo",
    "Benguela",
    "Bié",
    "Cabinda",
    "Cuando Cubango",
    "Cuanza Norte",
    "Cuanza Sul",
    "Cunene",
    "Huambo",
    "Huíla",
    "Luanda",
    "Lunda Norte",
    "Lunda Sul",
    "Malanje",
    "Moxico",
    "Namibe",
    "Uíge",
    "Zaire",
];

const bancos = [
    "BAI",
    "BFA",
    "BIC",
    "BPC",
    "Standard Bank",
    "Atlântico",
    "Banco Sol",
    "Banco Keve",
];

const moedas = ["AOA", "USD", "EUR"];

const emptyForm: EmployeeFormValues = {
    name: "",
    bi: "",
    nif: "",
    phone: "",
    alternativePhone: "",
    province: "",
    municipality: "",
    address: "",
    email: "",
    bank: "",
    iban: "",
    accountHolder: "",
    currency: "AOA",
    status: 1,
};

export function EmployeeFormModal({
    open,
    onOpenChange,
    employee,
    onSave,
}: EmployeeFormModalProps) {
    const isEditing = Boolean(employee);

    const [formData, setFormData] = useState<EmployeeFormValues>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Preenche o formulário ao abrir em modo edição, ou limpa em modo criação
    useEffect(() => {
        if (!open) return;

        if (employee) {
            const { id, createdAt, ...rest } = employee;
            setFormData({ ...rest, alternativePhone: rest.alternativePhone ?? "" });
        } else {
            setFormData(emptyForm);
        }
        setErrors({});
    }, [open, employee]);

    const updateField = <K extends keyof EmployeeFormValues>(
        field: K,
        value: EmployeeFormValues[K],
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!formData.name.trim()) nextErrors.name = "Nome é obrigatório";
        if (!formData.bi.trim()) nextErrors.bi = "BI é obrigatório";
        if (!formData.nif.trim()) nextErrors.nif = "NIF é obrigatório";
        if (!formData.phone.trim()) nextErrors.phone = "Telefone é obrigatório";
        if (!formData.province) nextErrors.province = "Província é obrigatória";
        if (!formData.municipality.trim())
            nextErrors.municipality = "Município é obrigatório";
        if (!formData.address.trim()) nextErrors.address = "Morada é obrigatória";

        if (!formData.email.trim()) {
            nextErrors.email = "Email é obrigatório";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            nextErrors.email = "Email inválido";
        }

        if (!formData.bank) nextErrors.bank = "Banco é obrigatório";
        if (!formData.iban.trim()) nextErrors.iban = "IBAN é obrigatório";
        if (!formData.accountHolder.trim())
            nextErrors.accountHolder = "Titular da conta é obrigatório";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSaving(true);
        try {
            await onSave(
                {
                    ...formData,
                    alternativePhone: formData.alternativePhone?.trim()
                        ? formData.alternativePhone
                        : null,
                },
                employee?.id,
            );
            onOpenChange(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl! overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Colaborador" : "Novo Colaborador"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize os dados do colaborador."
                            : "Preencha os dados para registar um novo colaborador."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-6"
                >
                    {/* Dados pessoais */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">
                            Dados Pessoais
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="name">
                                    Nome Completo <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    className="bg-background"
                                    aria-invalid={Boolean(errors.name)}
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bi">
                                    BI <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="bi"
                                    value={formData.bi}
                                    onChange={(e) => updateField("bi", e.target.value)}
                                    placeholder="00000000LA000"
                                    className="bg-background"
                                    aria-invalid={Boolean(errors.bi)}
                                />
                                {errors.bi && (
                                    <p className="text-xs text-destructive">{errors.bi}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nif">
                                    NIF <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="nif"
                                    value={formData.nif}
                                    onChange={(e) => updateField("nif", e.target.value)}
                                    className="bg-background"
                                    aria-invalid={Boolean(errors.nif)}
                                />
                                {errors.nif && (
                                    <p className="text-xs text-destructive">{errors.nif}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contacto e morada */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">
                            Contacto e Morada
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Telefone <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    placeholder="923 000 000"
                                    className="bg-background"
                                    aria-invalid={Boolean(errors.phone)}
                                />
                                {errors.phone && (
                                    <p className="text-xs text-destructive">{errors.phone}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alternativePhone">Telefone Alternativo</Label>
                                <Input
                                    id="alternativePhone"
                                    value={formData.alternativePhone ?? ""}
                                    onChange={(e) =>
                                        updateField("alternativePhone", e.target.value)
                                    }
                                    placeholder="222 000 000"
                                    className="bg-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="province">
                                    Província <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.province}
                                    onValueChange={(value) => updateField("province", value)}
                                >
                                    <SelectTrigger
                                        id="province"
                                        className="bg-background"
                                        aria-invalid={Boolean(errors.province)}
                                    >
                                        <SelectValue placeholder="Selecionar província" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provincias.map((provincia) => (
                                            <SelectItem key={provincia} value={provincia}>
                                                {provincia}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.province && (
                                    <p className="text-xs text-destructive">
                                        {errors.province}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="municipality">
                                    Município <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="municipality"
                                    value={formData.municipality}
                                    onChange={(e) =>
                                        updateField("municipality", e.target.value)
                                    }
                                    className="bg-background"
                                    aria-invalid={Boolean(errors.municipality)}
                                />
                                {errors.municipality && (
                                    <p className="text-xs text-destructive">
                                        {errors.municipality}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">
                                    Morada <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => updateField("address", e.target.value)}
                                    className="bg-background"
                                    aria-invalid={Boolean(errors.address)}
                                />
                                {errors.address && (
                                    <p className="text-xs text-destructive">{errors.address}</p>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="email">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    className="bg-background"
                                    aria-invalid={Boolean(errors.email)}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dados bancários */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">
                            Dados Bancários
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="bank">
                                    Banco <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.bank}
                                    onValueChange={(value) => updateField("bank", value)}
                                >
                                    <SelectTrigger
                                        id="bank"
                                        className="bg-background"
                                        aria-invalid={Boolean(errors.bank)}
                                    >
                                        <SelectValue placeholder="Selecionar banco" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bancos.map((banco) => (
                                            <SelectItem key={banco} value={banco}>
                                                {banco}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.bank && (
                                    <p className="text-xs text-destructive">{errors.bank}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Moeda</Label>
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) => updateField("currency", value)}
                                >
                                    <SelectTrigger id="currency" className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {moedas.map((moeda) => (
                                            <SelectItem key={moeda} value={moeda}>
                                                {moeda}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="iban">
                                    IBAN <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="iban"
                                    value={formData.iban}
                                    onChange={(e) => updateField("iban", e.target.value)}
                                    placeholder="AO06 0000 0000 0000 0000 0000 0"
                                    className="bg-background"
                                    aria-invalid={Boolean(errors.iban)}
                                />
                                {errors.iban && (
                                    <p className="text-xs text-destructive">{errors.iban}</p>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="accountHolder">
                                    Titular da Conta <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="accountHolder"
                                    value={formData.accountHolder}
                                    onChange={(e) =>
                                        updateField("accountHolder", e.target.value)
                                    }
                                    className="bg-background"
                                    aria-invalid={Boolean(errors.accountHolder)}
                                />
                                {errors.accountHolder && (
                                    <p className="text-xs text-destructive">
                                        {errors.accountHolder}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSaving}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    A guardar...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEditing ? "Guardar Alterações" : "Criar Colaborador"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}