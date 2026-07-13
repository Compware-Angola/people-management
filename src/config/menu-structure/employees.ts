import type { NavItem } from "@/components/layout/dashboard/nav-main";
import { Users } from "lucide-react";


export const EMPLOYEES_NAV: NavItem[] = [
    {
        title: "Colaboradores",
        icon: Users,
        url: "/employees",

    },
];