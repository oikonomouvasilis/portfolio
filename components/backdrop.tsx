"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Το κοινό φόντο όλου του site (D18).
 *
 * Μία και μόνη επιφάνεια πίσω από κάθε σελίδα, αντί για ζώνες με διαφορετικά
 * συμπαγή χρώματα. Οι εικόνες είναι **των ίδιων των project** — το φόντο δείχνει
 * δουλειά, δεν είναι διακοσμητικό stock.
 *
 * Περνούν από βαρύ θόλωμα και από πέπλο στο χρώμα του χαρτιού: αυτό που μένει
 * είναι κίνηση και χρώμα, όχι αναγνωρίσιμο στιγμιότυπο. Έτσι η αντίθεση του
 * κειμένου παραμένει ουσιαστικά ίδια με πριν — ένα καθαρό screenshot από πίσω θα
 * έκανε το γκρι κείμενο αδιάβαστο σε κάποια σημεία και μόνο εκεί.
 */
const FRAMES = [
  "/images/projects/oil-site/hero.jpg",
  "/images/projects/ai-trader/dashboard-overview.png",
  "/images/projects/nutrition-tracker/dashboard.png",
  "/images/projects/oil-site/products.jpg",
  "/images/projects/etl-stock-valuation/architecture.png",
  "/images/projects/expenses-predictor/forecast.png",
  "/images/projects/duty-scheduler/month.png",
] as const;

/** Αρκετά αργά ώστε η εναλλαγή να μη γίνεται ποτέ το θέαμα της σελίδας. */
const HOLD_MS = 9000;

export function Backdrop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      // Σε κρυμμένη καρτέλα δεν αλλάζει τίποτα: ο επισκέπτης θα γύριζε πίσω σε
      // μια εικόνα που δεν είδε ποτέ να μπαίνει, και ως τότε η GPU θα δούλευε.
      if (document.hidden) return;
      setIndex((current) => (current + 1) % FRAMES.length);
    }, HOLD_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="site-backdrop" aria-hidden="true">
      {FRAMES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          /*
           * Το φόντο είναι θολό — δεν χρειάζεται ποτέ πλήρη ανάλυση. Το μικρό
           * `sizes` λέει στο Next να σερβίρει εικόνα ~640px και γλιτώνει τα
           * περισσότερα byte της σελίδας.
           */
          sizes="640px"
          priority={i === 0}
          className={`site-backdrop__frame${i === index ? " is-current" : ""}`}
        />
      ))}

      <div className="site-backdrop__veil" />

      {/*
        Η «παράσταση»: τρεις τεράστιες, αργές κηλίδες φωτός που ταξιδεύουν πάνω
        από το πέπλο. Είναι το μόνο κομμάτι του φόντου που κινείται συνεχώς —
        η εναλλαγή των εικόνων γίνεται κάθε εννιά δευτερόλεπτα, αυτό ποτέ δεν
        σταματά. Μένουν στην **περιφέρεια** (βλ. τη μάσκα στο CSS), ώστε να μην
        περνά τίποτα κάτω από τη στήλη ανάγνωσης.
      */}
      <div className="site-backdrop__scene">
        <span className="site-backdrop__blob site-backdrop__blob--a" />
        <span className="site-backdrop__blob site-backdrop__blob--b" />
        <span className="site-backdrop__blob site-backdrop__blob--c" />
      </div>
    </div>
  );
}
