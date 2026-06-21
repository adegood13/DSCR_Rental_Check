import Logo from "./Logo";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <a
            href="https://askbobai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bob-ink"
            aria-label="AskBobAI home"
          >
            <Logo />
          </a>
          <span className="hidden h-5 w-px bg-slate-200 sm:block" aria-hidden />
          <span className="hidden text-sm font-medium text-bob-muted sm:block">
            Rent Check
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://askbobai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-bob-muted transition hover:text-bob-ink sm:block"
          >
            askbobai.com
          </a>
          <a
            href="https://askbobai.com/get-a-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill"
          >
            Get a demo
          </a>
        </div>
      </div>
    </nav>
  );
}
