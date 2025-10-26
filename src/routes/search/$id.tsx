import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/search/$id"!</div>
}
