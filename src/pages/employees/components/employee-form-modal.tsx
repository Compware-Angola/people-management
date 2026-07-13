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







import {
    useEmployeeFormModal
} from '../hooks/use-employee-form-modal'



interface Props {

    open: boolean

    onOpenChange: (open: boolean) => void

    employee?: Employee | null

    onSave: (values: any, id?: number) => Promise<void>

}



export function EmployeeFormModal({
    open,
    onOpenChange,
    employee,
    onSave,

}: Props) {


    const isEdit =
        Boolean(employee)



    const {
        form,
        canSubmit,
        isLoading

    } =
        useEmployeeFormModal({

            employee,

            onSave:
                async (values) => {

                    await onSave(
                        values,
                        employee?.id
                    )

                    onOpenChange(false)

                }

        })



    function handleClose(open: boolean) {

        if (!open) {

            form.reset()

        }


        onOpenChange(open)

    }


    return (

        <Dialog
            open={open}
            onOpenChange={handleClose}
        >


            <DialogContent
                className="
 max-h-[90vh]
 max-w-2xl!
 overflow-y-auto
 "
            >


                <DialogHeader>

                    <DialogTitle>

                        {
                            isEdit
                                ?
                                'Editar Colaborador'
                                :
                                'Novo Colaborador'
                        }

                    </DialogTitle>


                    <DialogDescription>

                        {
                            isEdit
                                ?
                                'Atualize os dados do colaborador.'
                                :
                                'Preencha os dados para registar um novo colaborador.'
                        }

                    </DialogDescription>


                </DialogHeader>




                <form
                    className="space-y-6"

                    onSubmit={(e) => {

                        e.preventDefault()

                        form.handleSubmit()

                    }}

                >


                    {/* Dados pessoais */}

                    <div className="grid gap-4 md:grid-cols-2">


                        <form.AppField name="name">

                            {
                                (field) => (

                                    <field.TextField
                                        label="Nome Completo"
                                    />

                                )

                            }

                        </form.AppField>



                        <form.AppField name="bi">

                            {
                                (field) => (

                                    <field.TextField
                                        label="BI"
                                    />

                                )

                            }

                        </form.AppField>



                        <form.AppField name="nif">

                            {
                                (field) => (

                                    <field.TextField
                                        label="NIF"
                                    />

                                )

                            }

                        </form.AppField>



                        <form.AppField name="phone">

                            {
                                (field) => (

                                    <field.TextField
                                        label="Telefone"
                                    />

                                )

                            }

                        </form.AppField>


                    </div>





                    {/* Morada */}


                    <div className="grid gap-4 md:grid-cols-2">


                        <form.AppField name="province">

                            {
                                (field) => (

                                    <field.ComboboxField

                                        label="Província"

                                        options={
                                            provincias.map(item => ({
                                                label: item,
                                                value: item
                                            }))
                                        }

                                    />

                                )

                            }

                        </form.AppField>



                        <form.AppField name="municipality">

                            {
                                (field) => (

                                    <field.TextField
                                        label="Município"
                                    />

                                )

                            }

                        </form.AppField>



                        <form.AppField name="address">

                            {
                                (field) => (

                                    <field.TextField
                                        label="Morada"
                                    />

                                )

                            }

                        </form.AppField>



                        <form.AppField name="email">

                            {
                                (field) => (

                                    <field.TextField
                                        label="Email"
                                        type="email"
                                    />

                                )

                            }

                        </form.AppField>



                    </div>





                    {/* Bancos */}


                    <div className="grid gap-4 md:grid-cols-2">


                        <form.AppField name="bank">

                            {
                                (field) => (

                                    <field.ComboboxField

                                        label="Banco"

                                        options={
                                            bancos.map(item => ({
                                                label: item,
                                                value: item
                                            }))
                                        }

                                    />

                                )

                            }

                        </form.AppField>



                        <form.AppField name="currency">

                            {
                                (field) => (

                                    <field.SelectField

                                        label="Moeda"

                                        options={
                                            moedas.map(item => ({
                                                label: item,
                                                value: item
                                            }))
                                        }

                                    />

                                )

                            }

                        </form.AppField>




                        <form.AppField name="iban">

                            {
                                (field) => (

                                    <field.TextField
                                        label="IBAN"
                                    />

                                )

                            }

                        </form.AppField>




                        <form.AppField name="accountHolder">

                            {
                                (field) => (

                                    <field.TextField
                                        label="Titular da Conta"
                                    />

                                )

                            }

                        </form.AppField>


                    </div>






                    <DialogFooter>


                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >

                            <X className="mr-2 h-4 w-4" />

                            Cancelar

                        </Button>



                        <Button
                            type="submit"
                            disabled={
                                !canSubmit ||
                                isLoading
                            }
                        >


                            {
                                isLoading
                                    ?
                                    <Loader2 className="animate-spin" />
                                    :
                                    <Save />
                            }



                            {
                                isEdit
                                    ?
                                    'Guardar alterações'
                                    :
                                    'Criar colaborador'
                            }


                        </Button>



                    </DialogFooter>


                </form>


            </DialogContent>


        </Dialog>


    )

}