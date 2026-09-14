import { stackLayers, type StackLayer } from "@/lib/content/schema";

type Props = {
  layers: Partial<Record<StackLayer, string[]>>;
  /** Ετικέτες στρωμάτων στη γλώσσα της σελίδας. */
  labels: Record<StackLayer, string>;
  title: string;
};

/**
 * Το stack ως **αρχιτεκτονική**, όχι ως σειρά από badges (D15).
 *
 * Τα στρώματα στοιβάζονται από ό,τι βλέπει ο χρήστης προς ό,τι το κρατάει όρθιο,
 * και το βάθος αποδίδεται με κλιμακωτή εσοχή και πυκνότητα χρώματος — ώστε μια
 * ματιά να λέει «τι είδους σύστημα είναι αυτό» πριν διαβαστεί λέξη.
 *
 * Το χρώμα δεν είναι το μόνο σήμα: κάθε στρώμα έχει και ετικέτα και θέση.
 */
export function StackDiagram({ layers, labels, title }: Props) {
  const present = stackLayers.filter(
    (layer) => (layers[layer]?.length ?? 0) > 0,
  );

  if (present.length === 0) return null;

  return (
    <figure className="not-prose">
      <figcaption className="mb-3 font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
        {title}
      </figcaption>

      <div className="overflow-hidden rounded-lg border border-[var(--line)]">
        {present.map((layer, index) => (
          <div
            key={layer}
            className="flex flex-col gap-2 border-t border-[var(--line)] px-4 py-3 first:border-t-0 sm:flex-row sm:items-baseline sm:gap-5"
            style={{
              // Κάθε στρώμα λίγο πιο βαθύ από το προηγούμενο: δείχνει τη στοίβαξη
              // χωρίς να χρειάζεται βέλη ή υπόμνημα.
              background: `color-mix(in oklab, var(--surface) ${
                18 + index * 22
              }%, var(--bg))`,
            }}
          >
            <span className="w-24 shrink-0 font-mono text-[11px] tracking-widest text-[var(--faint)] uppercase">
              {labels[layer]}
            </span>
            <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
              {layers[layer]!.map((tech) => (
                <li key={tech} className="text-sm text-[var(--fg)]">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </figure>
  );
}
