/**
 * AskBobAI logo lockup: the wordmark in Figtree Extra Bold followed by the
 * sparkle mark (a white four-point sparkle on an AskBob Green rounded square).
 *
 * The wordmark uses `currentColor`, so set the text color on the parent
 * (white on brand blue, ink on white). Per the brand guide the mark is always
 * AskBob Green and is never recolored.
 */
export default function Logo({
  className = "",
  markSize = 22,
}: {
  className?: string;
  markSize?: number;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-sans font-extrabold tracking-tight ${className}`}
    >
      <span className="text-xl leading-none">AskBobAI</span>
      <SparkleMark size={markSize} />
    </span>
  );
}

export function SparkleMark({ size = 22 }: { size?: number }) {
  const radius = size * 0.27;
  return (
    <span
      className="inline-flex items-center justify-center bg-action-500"
      style={{ width: size, height: size, borderRadius: radius }}
      aria-hidden
    >
      <svg
        width={size * 0.66}
        height={size * 0.66}
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Four-point sparkle: edges curve in toward the center. */}
        <path
          d="M12 0 C12.7 6.6 17.4 11.3 24 12 C17.4 12.7 12.7 17.4 12 24 C11.3 17.4 6.6 12.7 0 12 C6.6 11.3 11.3 6.6 12 0 Z"
          fill="#ffffff"
        />
      </svg>
    </span>
  );
}
