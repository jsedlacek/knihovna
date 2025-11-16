import placeholderCover from "#@/images/book-placeholder.svg";

export interface BookCoverProps {
  src?: string | null;
  alt: string;
  href?: string;
  className?: string;
}

export function BookCover({ src, alt, href, className = "" }: BookCoverProps) {
  const baseClasses =
    "w-16 h-24 sm:w-20 sm:h-30 object-cover border border-border";
  const imageClasses = href
    ? `${baseClasses} hover:opacity-80 transition-opacity mx-auto sm:mx-0 ${className}`
    : `${baseClasses} mx-auto sm:mx-0 ${className}`;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== placeholderCover) {
      img.src = placeholderCover;
    }
  };

  const image = (
    <img
      src={src || placeholderCover}
      onError={handleError}
      alt={alt}
      className={imageClasses}
    />
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0"
      >
        {image}
      </a>
    );
  }

  return <div className="shrink-0">{image}</div>;
}
