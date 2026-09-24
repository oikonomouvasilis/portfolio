"use client";

import { useEffect, useRef } from "react";

/**
 * Το ζωντανό φόντο: **ένα** σύστημα τροχιών, μόνιμα, σε κάθε σελίδα (D25).
 *
 * Ήταν πέντε σκηνές που εναλλάσσονταν (Galton, εκκρεμή, πολικές καμπύλες,
 * δίκτυο — D22, D23). Κόπηκαν: ένα φόντο που αλλάζει θέμα κάθε δεκαπέντε
 * δευτερόλεπτα ζητά προσοχή που ανήκει στο περιεχόμενο, και καμία από τις πέντε
 * δεν προλάβαινε να γίνει η υπογραφή της σελίδας.
 *
 * Μπάλες έρχονται από έξω και κουμπώνουν σε τροχιές γύρω από τρία ως πέντε
 * κέντρα, γυρίζουν, και φεύγουν πάλι — και μετά το ίδιο, με νέα διάταξη. Καμία
 * δεν κουμπώνει την ίδια στιγμή με την άλλη: η καθεμία έχει δική της ώρα άφιξης
 * και φυγής, οπότε το σύστημα χτίζεται και διαλύεται σαν διακόσια ανεξάρτητα
 * πράγματα, όχι σαν keyframe που ανοιγοκλείνει.
 *
 * Canvas και όχι SVG: διακόσιες μπάλες που κινούνται σε κάθε καρέ θα ήταν
 * διακόσιοι κόμβοι DOM.
 */

type RGB = [number, number, number];

interface Palette {
  ink: string;
  accent: string;
  inkRgb: RGB;
  accentRgb: RGB;
}

/** Ό,τι κάνει ο επισκέπτης, όπως το βλέπει η σκηνή. */
interface Motion {
  pointer: { x: number; y: number; active: boolean };
  /** Εξομαλυμένη ταχύτητα κύλισης, px/s. */
  scrollV: number;
}

// ── Χρώματα από τα tokens του CSS ────────────────────────────────────────────
function parseHex(value: string): RGB {
  const s = value.trim().replace("#", "");
  const full = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) || 0) as RGB;
}
const mixRgb = (a: RGB, b: RGB, t: number): RGB =>
  a.map((v, i) => Math.round(v * t + b[i] * (1 - t))) as RGB;
const css = ([r, g, b]: RGB, alpha = 1) => `rgb(${r} ${g} ${b} / ${alpha})`;

/**
 * Τα ίδια ποσοστά ανάμειξης με το CSS (`--sim-ink-mix`, `--sim-accent-mix`),
 * ώστε οι αριθμοί αντίθεσης του DECISIONS.md να ισχύουν και για το canvas.
 */
function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const bg = parseHex(s.getPropertyValue("--bg"));
  const fg = parseHex(s.getPropertyValue("--fg"));
  const accent = parseHex(s.getPropertyValue("--accent"));
  const inkMix = parseFloat(s.getPropertyValue("--sim-ink-mix")) / 100 || 0.6;
  const accentMix = parseFloat(s.getPropertyValue("--sim-accent-mix")) / 100 || 0.85;
  const inkRgb = mixRgb(fg, bg, inkMix);
  const accentRgb = mixRgb(accent, bg, accentMix);
  return { ink: css(inkRgb), accent: css(accentRgb), inkRgb, accentRgb };
}

/**
 * Ντετερμινιστικός τυχαίος για την **ακίνητη** εικόνα της μειωμένης κίνησης:
 * η ίδια εικόνα πρέπει να βγαίνει ίδια κάθε φορά που ζωγραφίζεται.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const clamp01 = (x: number) => clamp(x, 0, 1);
const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

// ── Το σύστημα τροχιών ───────────────────────────────────────────────────────

/** Πόσο κρατά το κούμπωμα μιας μπάλας στην τροχιά, και πόσο η φυγή της. */
const JOIN = 2.6;
const LEAVE = 3.4;
/** Κάθε τόσα δευτερόλεπτα στήνεται **νέα** διάταξη τροχιών. */
const REGEN = 38;
/** Ακτίνα επιρροής του δείκτη. */
const PUSH = 220;

interface Ring {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  tilt: number;
  cos: number;
  sin: number;
  dir: number;
  omega: number;
  angle: number;
  accent: boolean;
  /** Ποια γενιά διάταξης — οι παλιές σβήνουν όταν αδειάσουν από μπάλες. */
  gen: number;
  /** Πόσες μπάλες ζωγραφίστηκαν πάνω της στο προηγούμενο καρέ. */
  live: number;
}

interface Ball {
  ring: Ring;
  phase: number;
  size: number;
  joinAt: number;
  leaveAt: number;
  fromX: number;
  fromY: number;
}

/** Κέντρα απλωμένα ώστε να μην πέφτει κανένα στη μέση της οθόνης. */
const SPOTS: [number, number][] = [
  [0.16, 0.28],
  [0.84, 0.6],
  [0.5, 0.92],
  [0.08, 0.84],
  [0.92, 0.16],
];

function orbits(motion: Motion) {
  /** Όλες οι τροχιές: της τρέχουσας γενιάς και όσες παλιές έχουν ακόμη μπάλες. */
  let rings: Ring[] = [];
  /** Μόνο η τρέχουσα γενιά — εκεί πηγαίνουν οι μπάλες που ξαναγεννιούνται. */
  let current: Ring[] = [];
  let balls: Ball[] = [];
  let w = 0;
  let h = 0;
  let gen = 0;
  let nextRegen = REGEN;
  let frozen = false;

  /**
   * Στήνει **νέα γενιά** τροχιών. Οι παλιές δεν σβήνονται εδώ: μένουν όσο έχουν
   * μπάλες πάνω τους και φεύγουν μόνες τους όταν αδειάσουν. Έτσι η μια διάταξη
   * περνά στην άλλη χωρίς να αδειάσει ποτέ η οθόνη.
   */
  const makeRings = (rnd: () => number, t: number) => {
    /*
     * Η κλίμακα βγαίνει από τον **μέσο όρο** των δύο διαστάσεων, όχι από τη
     * μικρότερη: με βάση το ύψος, σε φαρδιά οθόνη οι τροχιές μάζευαν στη μέση
     * και άφηναν τα πλάγια άδεια.
     */
    const base = (w + h) / 2;
    // Όσο φαρδύτερη η οθόνη, τόσα περισσότερα συστήματα χωρούν χωρίς να πέσει
    // το ένα πάνω στο άλλο.
    const systems = w > 1600 ? 5 : w > 1200 ? 4 : w > 900 ? 3 : 2;
    const fresh: Ring[] = [];
    gen++;

    for (let s = 0; s < systems; s++) {
      const cx = w * (SPOTS[s][0] + (rnd() - 0.5) * 0.07);
      const cy = h * (SPOTS[s][1] + (rnd() - 0.5) * 0.1);
      const count = 2 + Math.floor(rnd() * 3);

      for (let i = 0; i < count; i++) {
        const rx = base * (0.08 + i * 0.1 + rnd() * 0.06);
        const tilt = rnd() * Math.PI;
        fresh.push({
          cx,
          cy,
          rx,
          ry: rx * (0.28 + rnd() * 0.57),
          tilt,
          cos: Math.cos(tilt),
          sin: Math.sin(tilt),
          dir: rnd() < 0.5 ? -1 : 1,
          /*
           * Κέπλερ, χοντρικά: όσο μεγαλώνει η τροχιά τόσο αργεί. Με μία ταχύτητα
           * παντού το σύνολο θα γύριζε σαν δίσκος — σαν **ένα** πράγμα αντί για
           * σύστημα.
           */
          omega: 0.8 / Math.pow(rx / (base * 0.2), 1.35),
          angle: rnd() * Math.PI * 2,
          accent: false,
          gen,
          live: 0,
        });
      }
    }

    // Ένα accent σε κάθε γενιά: η «ενεργή» τροχιά (D17).
    fresh[Math.floor(rnd() * fresh.length)].accent = true;
    current = fresh;
    rings = rings.concat(fresh);
    nextRegen = t + REGEN;
  };

  /**
   * Δίνει σε μια μπάλα τροχιά, μέγεθος, και ώρες άφιξης και φυγής.
   *
   * `seed = true` σημαίνει «πρώτο γέμισμα»: οι ώρες απλώνονται ώστε ο πληθυσμός
   * να μην ανανεώνεται ποτέ όλος μαζί. Χωρίς αυτό, κάθε σαράντα δευτερόλεπτα η
   * οθόνη θα άδειαζε και θα ξαναγέμιζε — το αντίθετο από «να μένει μόνιμα».
   */
  const place = (ball: Ball, t: number, rnd: () => number, seed: boolean) => {
    const ring = current[Math.floor(rnd() * current.length)];
    const reach = Math.max(w, h);
    const from = rnd() * Math.PI * 2;
    const life = seed ? 8 + rnd() * 34 : 18 + rnd() * 24;

    ball.ring = ring;
    ball.phase = rnd() * Math.PI * 2;
    /*
     * Η ύψωση σε δύναμη είναι που δίνει τα **διαφορετικά** μεγέθη: οι
     * περισσότερες μπάλες μένουν μικρές και λίγες βγαίνουν μεγάλες. Με
     * ομοιόμορφη κατανομή όλες κατέληγαν στη μέση, και το σύστημα έμοιαζε με
     * σειρά από ίδια κουκκίδια.
     */
    ball.size = 3 + Math.pow(rnd(), 2.4) * 14;
    ball.joinAt = seed ? rnd() * 9 : t + rnd() * 4;
    ball.leaveAt = ball.joinAt + JOIN + life;
    ball.fromX = ring.cx + Math.cos(from) * reach * (0.7 + rnd() * 0.6);
    ball.fromY = ring.cy + Math.sin(from) * reach * (0.7 + rnd() * 0.6);
  };

  const populate = (rnd: () => number) => {
    // Σταθερός πληθυσμός, ανάλογος της οθόνης — όχι ανάλογος του κύκλου.
    const target = Math.round(70 + (w * h) / 9000);
    balls = [];
    for (let i = 0; i < target; i++) {
      const ball: Ball = {
        ring: current[0],
        phase: 0,
        size: 0,
        joinAt: 0,
        leaveAt: 0,
        fromX: 0,
        fromY: 0,
      };
      place(ball, 0, rnd, true);
      balls.push(ball);
    }
  };

  return {
    reset(width: number, height: number) {
      w = width;
      h = height;
      frozen = false;
      gen = 0;
      rings = [];
      makeRings(Math.random, 0);
      populate(Math.random);
    },

    /** Τελική, ακίνητη κατάσταση — για μειωμένη κίνηση. */
    still() {
      frozen = true;
      // Σταθερός σπόρος: η ακίνητη εικόνα πρέπει να βγαίνει ίδια κάθε φορά.
      const rnd = mulberry32(9);
      gen = 0;
      rings = [];
      makeRings(rnd, 0);
      populate(rnd);
      for (const ball of balls) {
        ball.joinAt = 0;
        ball.leaveAt = Infinity;
      }
    },

    draw(ctx: CanvasRenderingContext2D, t: number, dt: number, p: Palette) {
      const reach = Math.max(w, h);
      if (!frozen && t > nextRegen) makeRings(Math.random, t);

      /*
       * Η κύλιση επιταχύνει όλο το σύστημα. Το κάτω όριο δεν φτάνει στο μηδέν:
       * μια τροχιά που σταματά τελείως διαβάζεται ως κόλλημα, όχι ως επιβράδυνση.
       */
      const spin = frozen ? 0 : 1 + clamp(motion.scrollV / 1600, -0.45, 1.6);
      for (const ring of rings) ring.angle += ring.dir * ring.omega * spin * dt;

      /*
       * Οι ελλείψεις είναι το φθηνότερο κάλυμμα που υπάρχει: γραμμή 1,2px κάτω
       * από θόλωμα 7px φτάνει στο 2% της έντασής της — δεν αγγίζει την αντίθεση
       * του κειμένου, αλλά απλώνεται σε όλη την οθόνη και δένει τις μπάλες σε
       * σύστημα.
       *
       * Η ένταση ακολουθεί το **πόσες μπάλες** έχει πάνω της η τροχιά, μετρημένες
       * στο προηγούμενο καρέ: μια τροχιά που αδειάζει σβήνει μόνη της.
       */
      ctx.lineWidth = 1.2;
      for (const ring of rings) {
        const strength = Math.min(1, ring.live / 5);
        if (strength <= 0.02) continue;
        ctx.strokeStyle = css(
          ring.accent ? p.accentRgb : p.inkRgb,
          strength * (ring.accent ? 0.45 : 0.3),
        );
        ctx.beginPath();
        ctx.ellipse(ring.cx, ring.cy, ring.rx, ring.ry, ring.tilt, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (const ring of rings) ring.live = 0;

      for (const ball of balls) {
        // Έφυγε τελείως: ξαναγεννιέται στην **τρέχουσα** γενιά τροχιών.
        if (!frozen && t > ball.leaveAt + LEAVE) {
          place(ball, t, Math.random, false);
          continue;
        }

        const j = clamp01((t - ball.joinAt) / JOIN);
        if (j <= 0) continue;

        const ring = ball.ring;
        const a = ring.angle + ball.phase;
        const ox = Math.cos(a) * ring.rx;
        const oy = Math.sin(a) * ring.ry;
        let x = ring.cx + ox * ring.cos - oy * ring.sin;
        let y = ring.cy + ox * ring.sin + oy * ring.cos;
        let alpha = 1;

        // Άφιξη: από ένα σημείο έξω από την οθόνη προς τη θέση της τροχιάς.
        if (j < 1) {
          const k = ease(j);
          x = ball.fromX + (x - ball.fromX) * k;
          y = ball.fromY + (y - ball.fromY) * k;
          alpha = k;
        }

        // Φυγή: ακτινικά προς τα έξω ενώ η γωνία συνεχίζει — βγαίνει σπείρα.
        const l = clamp01((t - ball.leaveAt) / LEAVE);
        if (l > 0) {
          const dx = x - ring.cx;
          const dy = y - ring.cy;
          const d = Math.hypot(dx, dy) || 1;
          const push = ease(l) * reach * 0.8;
          x += (dx / d) * push;
          y += (dy / d) * push;
          alpha *= 1 - l;
        }

        if (motion.pointer.active) {
          const dx = x - motion.pointer.x;
          const dy = y - motion.pointer.y;
          const d = Math.hypot(dx, dy);
          if (d > 0.001 && d < PUSH) {
            const f = (1 - d / PUSH) ** 2 * 32;
            x += (dx / d) * f;
            y += (dy / d) * f;
          }
        }

        /*
         * Η μισή τροχιά είναι «μπροστά» και η άλλη «πίσω». Το ημίτονο της γωνίας
         * δίνει το βάθος, και μαζί του αλλάζουν μέγεθος και ένταση· χωρίς αυτό
         * οι ελλείψεις διαβάζονται ως επίπεδοι δακτύλιοι.
         */
        const depth = (Math.sin(a) + 1) / 2;
        ctx.fillStyle = css(
          ring.accent ? p.accentRgb : p.inkRgb,
          alpha * (0.4 + depth * 0.55),
        );
        ctx.beginPath();
        ctx.arc(x, y, ball.size * (0.7 + depth * 0.55), 0, Math.PI * 2);
        ctx.fill();
        ring.live++;
      }

      // Παλιές γενιές που άδειασαν: φεύγουν, αλλιώς ο πίνακας μεγαλώνει για πάντα.
      if (rings.length > current.length) {
        rings = rings.filter((ring) => ring.gen === gen || ring.live > 0);
      }
    },
  };
}

export function BackdropSim() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motion: Motion = {
      pointer: { x: 0, y: 0, active: false },
      scrollV: 0,
    };
    const scene = orbits(motion);
    let palette = readPalette();
    let started = performance.now();
    let last = started;
    let lastScroll = window.scrollY;
    let w = 0;
    let h = 0;
    let frame = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      // Πάνω από 2× δεν φαίνεται διαφορά σε κάτι που είναι φόντο — μόνο κόστος.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.reset(w, h);
      started = performance.now();
    };

    /*
     * Η προσομοίωση αδυνατίζει εκεί που κάθεται το κείμενο — στα περιθώρια μένει
     * ακέραιη.
     *
     * Αυτό είναι που επιτρέπει στο υπόλοιπο να είναι τολμηρό: με θόλωμα 7px και
     * τζάμι 40% περνά πάνω από το μισό της έντασης στα πλάγια, και η αντίθεση
     * του κειμένου μένει πάνω από 4,8:1 **επειδή** από πίσω του περνά το 17%.
     *
     * Δεν είναι η μάσκα-στήλη του D21: η πτώση απλώνεται σε εκατοντάδες pixel,
     * δεν έχει ακμή, και το τζάμι από πάνω είναι ενιαίο — δεν υπάρχει σχήμα να
     * προδώσει πού αρχίζει.
     */
    const softenBehindText = () => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgb(0 0 0 / 0)");
      grad.addColorStop(0.12, "rgb(0 0 0 / 0.42)");
      grad.addColorStop(0.3, "rgb(0 0 0 / 0.83)");
      grad.addColorStop(0.7, "rgb(0 0 0 / 0.83)");
      grad.addColorStop(0.88, "rgb(0 0 0 / 0.42)");
      grad.addColorStop(1, "rgb(0 0 0 / 0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    };

    const renderStill = () => {
      scene.reset(w, h);
      scene.still();
      ctx.clearRect(0, 0, w, h);
      scene.draw(ctx, 16, 0, palette);
      softenBehindText();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Η κύλιση διαβάζεται εδώ, μία φορά ανά καρέ — όχι σε κάθε scroll event.
      const y = window.scrollY;
      const delta = y - lastScroll;
      lastScroll = y;
      const instant = dt > 0 ? delta / dt : 0;
      motion.scrollV += (instant - motion.scrollV) * Math.min(1, dt * 6);

      /*
       * Ο χρόνος τρέχει συνέχεια και δεν μηδενίζεται ποτέ: το σύστημα δεν έχει
       * «τέλος κύκλου» με άδεια οθόνη. Οι μπάλες ξαναγεννιούνται μία-μία και οι
       * τροχιές ανανεώνονται κατά γενιές, μέσα στην ίδια σκηνή.
       */
      const t = (now - started) / 1000;

      ctx.clearRect(0, 0, w, h);
      scene.draw(ctx, t, dt, palette);
      softenBehindText();
      frame = requestAnimationFrame(tick);
    };

    resize();
    if (reduced) renderStill();
    else frame = requestAnimationFrame(tick);

    const onResize = () => {
      resize();
      if (reduced) renderStill();
    };
    const onPointer = (e: PointerEvent) => {
      motion.pointer.x = e.clientX;
      motion.pointer.y = e.clientY;
      motion.pointer.active = e.pointerType === "mouse";
    };
    const onLeave = () => {
      motion.pointer.active = false;
    };
    // Το θέμα αλλάζει είτε από το σύστημα είτε από τον διακόπτη (data-theme).
    const onTheme = () => {
      palette = readPalette();
      if (reduced) renderStill();
    };
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const observer = new MutationObserver(onTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    media.addEventListener("change", onTheme);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      media.removeEventListener("change", onTheme);
    };
  }, []);

  return <canvas ref={ref} className="site-backdrop__sim" />;
}
