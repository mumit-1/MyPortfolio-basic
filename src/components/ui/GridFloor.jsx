import { cn } from "../../lib/cn";

/**
 * Perspective grid receding to a glowing horizon — the floor motif of the design.
 * Pure CSS: a rotated plane scrolling one cell per loop (seamless). The grid
 * animation freezes automatically under prefers-reduced-motion (global guard).
 */
export default function GridFloor({ className }) {
  const grid = {
    backgroundImage:
      "linear-gradient(var(--grid-line) 1px, transparent 1px)," +
      "linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
    backgroundSize: "52px 52px",
  };

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] overflow-hidden [perspective:320px]",
        className,
      )}
    >
      {/* horizon bloom */}
      <div
        className="absolute inset-x-0 top-0 h-24 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, var(--glow), transparent 70%)",
        }}
      />
      {/* the receding plane */}
      <div className="absolute inset-0 [transform:rotateX(74deg)] [transform-origin:center_top]">
        <div className="absolute inset-[-50%]" style={grid} />
      </div>
      {/* fade the near edge into the page */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg), transparent 30%, transparent 70%, var(--bg))",
        }}
      />
    </div>
  );
}
