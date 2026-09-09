export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-surface-lowest)] border-t border-[var(--color-outline-variant)] py-8 mt-12 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-4 text-[var(--color-on-surface-variant)] text-[13px]">
        {/* Centered Brand & Copyright */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-5 w-5 rounded-md bg-[var(--color-primary)] flex items-center justify-center opacity-85 shrink-0">
            <span className="material-symbols-outlined text-[var(--color-on-primary)] text-[13px]">
              shield
            </span>
          </div>
          <span className="font-medium text-[var(--color-on-surface)]">
            © {new Date().getFullYear()} ScamGuard. Designed for personal
            security &amp; scam prevention.
          </span>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[var(--color-outline)] text-[12px]">
          <a
            href="#how-it-works"
            className="hover:text-[var(--color-on-surface)] transition-colors font-medium"
          >
            How It Works
          </a>
          <span className="text-[var(--color-outline-variant)]">•</span>
          <a
            href="#common-scams"
            className="hover:text-[var(--color-on-surface)] transition-colors font-medium"
          >
            Common Scams
          </a>
          <span className="text-[var(--color-outline-variant)]">•</span>
          <a
            href="#privacy"
            className="hover:text-[var(--color-on-surface)] transition-colors font-medium"
          >
            Privacy
          </a>
          <span className="text-[var(--color-outline-variant)]">•</span>
          <a
            href="#terms"
            className="hover:text-[var(--color-on-surface)] transition-colors font-medium"
          >
            Terms
          </a>
          <span className="text-[var(--color-outline-variant)]">•</span>
          <a
            href="#safety-guide"
            className="hover:text-[var(--color-on-surface)] transition-colors font-medium"
          >
            Safety Guide
          </a>
        </div>
      </div>
    </footer>
  );
}

