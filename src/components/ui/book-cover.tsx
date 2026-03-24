import placeholderCover from "#@/images/book-placeholder.svg";
import { getImageUrl } from "#@/lib/shared/utils/image-utils.ts";

export interface BookCoverProps {
  src?: string | null;
  alt: string;
  href?: string;
  external?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export function BookCover({
  src,
  alt,
  href,
  external = true,
  className = "",
  width,
  height,
}: BookCoverProps) {
  const sizeClasses = className || "w-20 h-30 sm:w-28 sm:h-42";
  const baseClasses = `${sizeClasses} object-cover border border-border`;
  const imageClasses = href ? `${baseClasses} hover:opacity-80 transition-opacity` : baseClasses;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== placeholderCover) {
      img.src = placeholderCover;
      img.srcset = "";
    }
  };

  const imgSrc = src ? getImageUrl(src, { width, height }) : placeholderCover;
  const imgSrcSet = src
    ? `${getImageUrl(src, { width, height })} 1x, ${getImageUrl(src, { width: width && width * 2, height: height && height * 2 })} 2x`
    : undefined;

  const image = (
    <img src={imgSrc} srcSet={imgSrcSet} onError={handleError} alt={alt} className={imageClasses} />
  );

  if (href) {
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="shrink-0"
      >
        {image}
      </a>
    );
  }

  return <div className="shrink-0">{image}</div>;
}
