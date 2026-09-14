import Image from "next/image";
import type { GalleryItem } from "@/lib/content/schema";

/**
 * Το φωτογραφικό υλικό του project (D15).
 *
 * Κάθε εικόνα φέρει λεζάντα και την χρησιμοποιεί **και** ως `alt` — μία εικόνα
 * χωρίς εξήγηση δεν προσθέτει τίποτα, και ο screen reader διαβάζει το ίδιο
 * πράγμα που διαβάζει και ο βλέπων.
 */
export function Gallery({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-10">
      {items.map((item) => (
        <figure key={item.src} className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
            <Image
              src={item.src}
              alt={item.caption}
              width={1200}
              height={675}
              className="h-auto w-full"
              sizes="(max-width: 48rem) 100vw, 48rem"
            />
          </div>
          <figcaption className="text-sm text-[var(--muted)]">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
