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
  const baseClasses = "w-16 h-24 sm:w-20 sm:h-30 object-cover border border-border";
  const imageClasses = href
    ? `${baseClasses} hover:opacity-80 transition-opacity mx-auto sm:mx-0 ${className}`
    : `${baseClasses} mx-auto sm:mx-0 ${className}`;

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
