import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-5 text-center">
      <p className="text-6xl font-bold text-[color:var(--brand-border)]">404</p>
      <h1 className="mt-4 text-lg font-semibold text-gray-900">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/browse"
        className="mt-6 inline-flex h-10 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
      >
        Browse Skills
      </Link>
    </div>
  );
}
