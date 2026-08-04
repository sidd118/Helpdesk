import { Separator } from '@/components/ui/separator'

// Every ticket lands in exactly one of these — see project-scope.md.
const categories = ['General', 'Technical', 'Refunds']

/**
 * The panel stays dark in both themes. `dark` on the root scopes the dark token
 * values to this subtree, so everything inside uses plain semantic classes.
 */
export default function LoginPanel() {
  return (
    <aside className="dark bg-card text-card-foreground border-border hidden flex-col justify-between border-r p-12 lg:flex xl:p-16">
      <p className="font-mono text-xs tracking-[0.22em] uppercase">Helpdesk</p>

      <div className="max-w-md">
        <p className="text-4xl leading-[1.08] font-medium tracking-tight text-balance xl:text-5xl">
          Every email, already triaged.
        </p>
        <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
          Tickets arrive classified, summarized, and drafted. You handle the
          ones that need a person.
        </p>
      </div>

      <div>
        <Separator />
        <p className="text-muted-foreground mt-6 font-mono text-[11px] tracking-[0.18em] uppercase">
          Categories
        </p>
        <ul className="divide-border mt-4 grid grid-cols-3 divide-x font-mono text-xs">
          {categories.map((category) => (
            <li key={category} className="px-4 first:pl-0 last:pr-0">
              {category}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
