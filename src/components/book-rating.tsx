import { StarIcon } from "lucide-react";
import { formatNumberCompact, formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import { Link } from "./ui/link.tsx";

interface BookRatingProps {
  rating: number | null | undefined;
  ratingsCount?: number | null;
  url?: string | null;
  size?: "sm" | "base";
}

const sizeConfig = {
  sm: { text: "text-sm", icon: "size-2.5" },
  base: { text: "text-base", icon: "size-3" },
};

export function BookRating({ rating, ratingsCount, url, size = "sm" }: BookRatingProps) {
  const { text, icon } = sizeConfig[size];

  if (!rating) {
    return <div className={`${text} text-muted-foreground`}>Bez hodnocení</div>;
  }

  return (
    <div className={`flex items-center ${text}`}>
      <span className="font-semibold">{formatNumberCzech(Math.round(rating * 10) / 10)}</span>
      <StarIcon className={`ml-1 ${icon} fill-current mr-2`} />
      {ratingsCount && (
        <span className="text-muted-foreground">
          (
          {url ? (
            <Link href={url}>{formatNumberCompact(ratingsCount)} hodnocení</Link>
          ) : (
            <span>{formatNumberCompact(ratingsCount)} hodnocení</span>
          )}
          )
        </span>
      )}
    </div>
  );
}
