import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Employee } from '@/services/employees/employees.types'
import { Eye, Pencil } from 'lucide-react'

interface EmployeeTableActionsProps {
  employee: Employee
  onView: (employee: Employee) => void
  onEdit: (employee: Employee) => void
 
}

export function EmployeeTableActions({
  employee,
  onView,
  onEdit,
 
}: EmployeeTableActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => onView(employee)}>
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent>Ver detalhes</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent>Editar</TooltipContent>
      </Tooltip>
    </div>
  )
}
