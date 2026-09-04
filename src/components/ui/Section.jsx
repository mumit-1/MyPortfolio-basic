import { cn } from '../../lib/cn'

/**
 * Standard section shell: id anchor (with scroll offset for the fixed bar),
 * consistent padding + max width, and an optional faint continuing grid so the
 * grid floor motif carries across section boundaries (part of the "blend,
 * not plain lines" ask).
 */
export default function Section({ id, className, children, grid = false }) {
  return (
    <section id={id} className={cn('relative scroll-mt-24 px-6 py-24 sm:py-28 md:px-10', className)}>
      {grid && (
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
        />
      )}
      <div className="relative mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}
