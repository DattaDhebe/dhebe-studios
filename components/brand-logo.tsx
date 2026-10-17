interface BrandLogoProps {
  eager?: boolean;
  className?: string;
  imageClassName?: string;
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function BrandLogo({
  eager = false,
  className,
  imageClassName,
}: BrandLogoProps) {
  return (
    <div
      className={joinClasses(
        'brand-logo',
        className,
      )}
    >
      <img
        src="/logo4-optimized-480.webp"
        srcSet="/logo4-optimized-360.webp 360w, /logo4-optimized-480.webp 480w, /logo4-optimized.webp 600w"
        sizes="216px"
        alt="DHEBE Studios"
        width={600}
        height={400}
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        className={joinClasses(
          'brand-logo-image',
          imageClassName,
        )}
      />
    </div>
  );
}
