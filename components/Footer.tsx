import Logo from "./Logo";

const LINKS: Array<{ label: string; href: string }> = [
  { label: "Product", href: "https://askbobai.com" },
  { label: "About", href: "https://askbobai.com/about" },
  { label: "Get a demo", href: "https://askbobai.com/get-a-demo" },
  { label: "Privacy", href: "https://askbobai.com/privacy" },
  { label: "Terms", href: "https://askbobai.com/terms" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <a
              href="https://askbobai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bob-ink"
            >
              <Logo />
            </a>
            <p className="mt-3 text-sm text-bob-muted">
              AI for every function. Turn your company knowledge into instant,
              trusted answers inside the tools your team already uses.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-bob-muted transition hover:text-bob-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 sm:justify-end">
              <a
                href="https://linkedin.com/company/askbobai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AskBobAI on LinkedIn"
                className="text-bob-muted transition hover:text-brand-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.25 8h4.5v15H.25V8Zm7.5 0h4.31v2.05h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V23h-4.5v-6.5c0-1.55-.03-3.55-2.16-3.55-2.16 0-2.5 1.69-2.5 3.44V23h-4.5V8Z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@askbobai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AskBobAI on YouTube"
                className="text-bob-muted transition hover:text-brand-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-xs text-bob-muted">
          <p>© 2026 AskBob AI, Inc. · Fort Wayne, Indiana</p>
          <p className="mt-2 max-w-3xl">
            Rent Check is for informational purposes only. It is not a loan
            offer, an appraisal, or a guarantee of rent. Verify comps
            independently before underwriting.
          </p>
        </div>
      </div>
    </footer>
  );
}
