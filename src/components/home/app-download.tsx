import Link from "next/link";

export function AppDownload() {
  return (
    <section className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white px-6 py-10 text-center shadow-sm ring-1 ring-border sm:px-10">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Download the Majiflow App
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-foreground px-6 text-sm font-semibold text-white"
          >
            App Store
          </Link>
          <Link
            href="#"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-foreground px-6 text-sm font-semibold text-white"
          >
            Google Play
          </Link>
        </div>
      </div>
    </section>
  );
}
