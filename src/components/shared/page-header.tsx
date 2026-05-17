export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h1 className="text-balance text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-[1.7] text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
