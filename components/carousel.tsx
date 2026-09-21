"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type CarouselImage = { src: string; caption?: string };

/**
 * Εναλλαγή εικόνων, σε δύο τρόπους.
 *
 * `click` — στη σελίδα του project: κλικ στην εικόνα για την επόμενη, βέλη και
 * πληκτρολόγιο. Εκεί ο επισκέπτης έχει ήδη αποφασίσει να κοιτάξει.
 *
 * `hover` — στη λίστα των project: το ποντίκι περνά πάνω από την εικόνα και
 * αλλάζει καρέ ανάλογα με το πού βρίσκεται οριζόντια, σαν να ξεφυλλίζει. Καμία
 * ενέργεια δεν κλέβει το κλικ, γιατί εκεί ολόκληρη η κάρτα είναι σύνδεσμος.
 *
 * Σε καμία περίπτωση δεν υπάρχει αυτόματη περιστροφή: μια εικόνα που κινείται
 * μόνη της δίπλα σε κείμενο εμποδίζει το διάβασμα, και το στιγμιότυπο ενός
 * project είναι στοιχείο, όχι διαφήμιση.
 *
 * Με μία μόνο εικόνα δεν εμφανίζεται κανένα χειριστήριο.
 */
export function Carousel({
  images,
  priority = false,
  sizes,
  showCaption = false,
  label,
  mode = "click",
}: {
  images: CarouselImage[];
  priority?: boolean;
  sizes: string;
  /** `hover` στη λίστα, `click` μέσα στο project. */
  mode?: "click" | "hover";
  /** Δείχνει τη λεζάντα κάτω από την εικόνα — στη σελίδα του project, όχι στην κάρτα. */
  showCaption?: boolean;
  /** Προσβάσιμο όνομα της ομάδας, π.χ. ο τίτλος του project. */
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const region = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + count) % count);
    },
    [count],
  );

  // Τα βέλη του πληκτρολογίου δουλεύουν μόνο όσο η εστίαση είναι μέσα στο
  // carousel — αλλιώς θα έκλεβαν το ← → από την υπόλοιπη σελίδα.
  useEffect(() => {
    const node = region.current;
    if (!node || count < 2 || mode !== "click") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    };

    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [count, go, mode]);

  if (count === 0) return null;

  const current = images[index];
  const single = count < 2;

  return (
    <figure className="space-y-3">
      <div
        ref={region}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        className="group/carousel relative aspect-[16/9] overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]"
      >
        {/*
          Σταθερό κουτί 16:9 και `object-contain`: οι οθόνες που τραβήχτηκαν δεν
          έχουν όλες την ίδια αναλογία — ένα φύλλο Excel είναι σχεδόν τετράγωνο,
          ένα dashboard πλατύ. Με `cover` θα κόβαμε το μισό· με σταθερό ύψος δεν
          πηδάει η σελίδα σε κάθε κλικ. Ό,τι περισσεύει γίνεται κενό, όχι ψαλίδι.
        */}
        {images.map((image, i) => (
          <Image
            key={image.src}
            src={image.src}
            alt={i === index ? (image.caption ?? "") : ""}
            width={1200}
            height={675}
            priority={priority && i === 0}
            sizes={sizes}
            aria-hidden={i === index ? undefined : true}
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}

        {!single && (
          <>
            {mode === "click" ? (
              <>
                {/* Το κλικ πάνω στην εικόνα πάει στην επόμενη — το προφανές. */}
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute inset-0 cursor-pointer"
                >
                  <span className="sr-only">
                    {label} — {index + 1} / {count}
                  </span>
                </button>

                <Arrow side="left" onClick={() => go(-1)} label={label} />
                <Arrow side="right" onClick={() => go(1)} label={label} />
              </>
            ) : (
              /*
                Κάθετες λωρίδες, μία ανά εικόνα. Το ποντίκι δείχνει ποια θέλει
                αντί να πατά κουμπί — και επειδή είναι απλά `div`, η κάρτα από
                πάνω μένει ολόκληρη σύνδεσμος.
              */
              <div
                aria-hidden="true"
                className="absolute inset-0 flex"
                onMouseLeave={() => setIndex(0)}
              >
                {images.map((image, i) => (
                  <div
                    key={image.src}
                    className="h-full flex-1"
                    onMouseEnter={() => setIndex(i)}
                  />
                ))}
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
              <span className="flex gap-1.5">
                {images.map((image, i) => (
                  <span
                    key={image.src}
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === index ? "bg-white" : "bg-white/35"
                    }`}
                  />
                ))}
              </span>
              <span className="rounded bg-black/45 px-1.5 py-0.5 font-mono text-[10px] text-white/80 tabular-nums">
                {index + 1}/{count}
              </span>
            </div>
          </>
        )}
      </div>

      {showCaption && current.caption && (
        <figcaption
          aria-live="polite"
          className="text-sm text-[var(--muted)]"
        >
          {current.caption}
        </figcaption>
      )}
    </figure>
  );
}

function Arrow({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${side === "left" ? "←" : "→"}`}
      // Σε οθόνη αφής δεν υπάρχει hover: εκεί τα βέλη μένουν μόνιμα ορατά.
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover/carousel:opacity-100 focus-visible:opacity-100 ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      <span aria-hidden="true" className="block h-4 w-4 leading-4">
        {side === "left" ? "‹" : "›"}
      </span>
    </button>
  );
}
