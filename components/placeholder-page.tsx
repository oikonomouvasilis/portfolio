/**
 * Σκελετός για σελίδα που θα γεμίσει σε επόμενη φάση.
 *
 * Υπάρχει ώστε το menu να μην έχει σπασμένους συνδέσμους: καλύτερα μια σελίδα
 * που λέει ειλικρινά «δεν είναι έτοιμη» παρά ένα 404.
 */
export function PlaceholderPage({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-5xl">{title}</h1>
      <p
        role="status"
        className="border-l-2 border-[var(--line)] pl-4 text-[var(--muted)]"
      >
        {note}
      </p>
    </div>
  );
}
