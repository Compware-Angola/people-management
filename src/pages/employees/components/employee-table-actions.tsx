import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { User } from '@/services/users/users.types'
import { Pencil, UserPlus } from 'lucide-react'

interface EmployeeTableActionsProps {
  user: User
  onEdit: (user: User) => void
  onRegisterEmployee: (user: User) => void
}

export function EmployeeTableActions({
  user,
  onEdit,
  onRegisterEmployee,
}: EmployeeTableActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent>Editar</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRegisterEmployee(user)}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent>Cadastrar como colaborador</TooltipContent>
      </Tooltip>
    </div>
  )
}
