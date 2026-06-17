import Image from "next/image";
import { cn } from "@/lib/utils";

const BANNER_SRC = "/landing.png";
const BANNER_ALT = "Walrus Skills Marketplace";
const BANNER_WIDTH = 1586;
const BANNER_HEIGHT = 992;

export function BrandLogo({
  className,
  priority = false,
  sizes = "140px",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={BANNER_SRC}
      alt={BANNER_ALT}
      width={BANNER_WIDTH}
      height={BANNER_HEIGHT}
      priority={priority}
      sizes={sizes}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}

export function BrandBanner({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        className
      )}
      style={{ aspectRatio: `${BANNER_WIDTH} / ${BANNER_HEIGHT}` }}
    >
      <Image
        src={BANNER_SRC}
        alt={BANNER_ALT}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1152px"
        className="object-contain object-center"
      />
    </div>
  );
}
