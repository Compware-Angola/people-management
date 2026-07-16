import { TestePage } from '@/pages/teste'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/about/')({
  component: TestePage,
})
