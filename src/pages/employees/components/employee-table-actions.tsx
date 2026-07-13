import { Button } from '@/components/ui/button'
import type { Employee } from '@/services/employees/employees.types'
import { Archive, Eye, Pencil } from 'lucide-react'


interface EmployeeTableActionsProps {
  employee: Employee
  onView: (employee: Employee) => void
  onEdit: (employee: Employee) => void
  onArchive: (employee: Employee) => void
}

export function EmployeeTableActions({
  employee,
  onView,
  onEdit,
  onArchive,
}: EmployeeTableActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={() => onView(employee)}>
        <Eye className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        disabled={employee.status === 0}
        onClick={() => onArchive(employee)}
      >
        <Archive className="h-4 w-4" />
      </Button>
    </div>
  )
}
