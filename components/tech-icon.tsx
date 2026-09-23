import { techIcon } from "@/lib/tech-icons";

/**
 * Το σύμβολο μιας τεχνολογίας, inline SVG.
 *
 * `aria-hidden`: το εικονίδιο επαναλαμβάνει το όνομα που ήδη βρίσκεται δίπλα του.
 * Αν το ανακοίνωνε και ο αναγνώστης οθόνης, κάθε δεξιότητα θα ακουγόταν δύο φορές.
 */
export function TechIcon({
  name,
  className = "size-4",
}: {
  name: string;
  className?: string;
}) {
  const icon = techIcon(name);
  if (!icon) return null;

  if (icon.kind === "glyph") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className={className}
        fill="none"
        stroke="currentColor"
        /*
         * Πιο λεπτή γραμμή από το προεπιλεγμένο 2: τα γεμισμένα σήματα δίπλα
         * είναι ελαφριά, και μια χοντρή γραμμή θα τραβούσε το μάτι στο λάθος
         * μισό της λίστας.
         */
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={icon.d} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d={icon.d} />
    </svg>
  );
}

/**
 * Λίστα τεχνολογιών με το σύμβολο της καθεμιάς.
 *
 * Λίστα και όχι κείμενο χωρισμένο με κόμματα: ο αναγνώστης οθόνης ανακοινώνει
 * πόσα στοιχεία έχει η ομάδα, και το μάτι πιάνει τη μία τεχνολογία ανά γραμμή
 * αντί για μια ενιαία πρόταση.
 */
export function TechList({
  items,
  className = "",
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2.5 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="group/tech inline-flex items-center gap-2 transition-colors hover:text-[var(--fg)]"
        >
          <TechIcon
            name={item}
            className="size-4 shrink-0 text-[var(--faint)] transition-colors group-hover/tech:text-[var(--fg)]"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
