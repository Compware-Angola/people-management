import { Page } from '@/pages/teste'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/')({ component: Page })

