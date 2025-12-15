import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/protected/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/protected/"!</div>
}
