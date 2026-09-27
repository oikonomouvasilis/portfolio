"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Carousel } from "@/components/carousel";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  EMPTY_FILTERS,
  filterProjects,
  filtersFromParams,
  isEmpty,
  paramsFromFilters,
  toggle,
  type Filters,
  type ProjectCard,
} from "@/lib/content/filter";

type Option = { value: string; label: string; count: number };

export type ExplorerLabels = {
  categories: string;
  stack: string;
  search: string;
  searchPlaceholder: string;
  clear: string;
  results: string;
  empty: string;
  /** Το κουμπί του συρταριού των τεχνολογιών. */
  show: string;
  hide: string;
  status: Record<string, string>;
};

type Props = {
  projects: ProjectCard[];
  locale: string;
  categoryOptions: Option[];
  stackOptions: Option[];
  labels: ExplorerLabels;
};

export function ProjectExplorer({
  projects,
  locale,
  categoryOptions,
  stackOptions,
  labels,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = filtersFromParams(new URLSearchParams(searchParams));

  /*
   * Το πεδίο αναζήτησης κρατά δική του κατάσταση ώστε η πληκτρολόγηση να είναι
   * άμεση· το URL ενημερώνεται με καθυστέρηση. Χωρίς αυτό, κάθε πλήκτρο θα
   * προκαλούσε navigation και ο δρομέας θα πηδούσε.
   */
  const [draft, setDraft] = useState(filters.query);

  /*
   * Όταν το URL αλλάξει απ' έξω (πίσω/εμπρός του browser, ή «Καθαρισμός»), το
   * πεδίο ακολουθεί. Η προσαρμογή γίνεται **κατά το render** και όχι σε effect:
   * είναι το πρότυπο του React για «διόρθωσε state όταν αλλάξει η είσοδος», και
   * αποφεύγει το επιπλέον πέρασμα που θα έδειχνε για μια στιγμή παλιό κείμενο.
   */
  const [lastSeenQuery, setLastSeenQuery] = useState(filters.query);
  if (filters.query !== lastSeenQuery) {
    setLastSeenQuery(filters.query);
    setDraft(filters.query);
  }

  /*
   * Η τελευταία κατάσταση που **ζητήσαμε**, όσο ο router δεν έχει προλάβει να τη
   * γράψει στο URL. Το `router.replace` είναι ασύγχρονο: χωρίς αυτό το κράτημα,
   * δύο γρήγορα κλικ σε διαφορετικά φίλτρα διαβάζουν και τα δύο το ίδιο παλιό
   * URL, και η δεύτερη αλλαγή σβήνει την πρώτη.
   */
  const pending = useRef<Filters | null>(null);

  // Μόλις το URL φτάσει, η πρόθεση έχει υλοποιηθεί και το κράτημα λύνεται.
  useEffect(() => {
    pending.current = null;
  }, [searchParams]);

  function update(mutate: (current: Filters) => Filters) {
    const base =
      pending.current ??
      filtersFromParams(new URLSearchParams(window.location.search));
    const next = mutate(base);
    pending.current = next;

    const query = paramsFromFilters(next).toString();
    // `replace` και όχι `push`: αλλιώς κάθε κλικ σε φίλτρο γεμίζει το ιστορικό
    // και το κουμπί «πίσω» χρειάζεται δέκα πατήματα για να βγει από τη σελίδα.
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  useEffect(() => {
    const current = new URLSearchParams(searchParams).get("q") ?? "";
    if (draft === current) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (draft.trim()) params.set("q", draft.trim());
      else params.delete("q");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [draft, pathname, router, searchParams]);

  const visible = useMemo(
    () => filterProjects(projects, filters),
    // Τα φίλτρα ξαναχτίζονται σε κάθε render από τα searchParams· εξαρτόμαστε
    // από τη σειριοποιημένη μορφή τους για σταθερή σύγκριση.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, searchParams],
  );

  const active = !isEmpty(filters);

  return (
    <div className="space-y-12">
      {/*
        `suppressHydrationWarning`: τα `data-shown` / `data-from` τα γράφει ο
        observer πάνω στο DOM, και αυτό το κομμάτι ενυδατώνεται **μετά** (ζει
        μέσα σε Suspense, λόγω `useSearchParams`). Χωρίς αυτό, ο React βρίσκει
        στο DOM attributes που δεν απέδωσε ο ίδιος και βγάζει mismatch.
      */}
      <div
        data-reveal
        suppressHydrationWarning
        className="space-y-6 border-y border-[var(--line)] py-6"
      >
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-center">
          <label
            htmlFor="project-search"
            className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase"
          >
            {labels.search}
          </label>
          <input
            id="project-search"
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full rounded-md border border-[var(--line)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--faint)]"
          />
        </div>

        <FilterGroup
          label={labels.categories}
          options={categoryOptions}
          selected={filters.categories}
          onToggle={(value) =>
            update((c) => ({ ...c, categories: toggle(c.categories, value) }))
          }
        />

        <FilterGroup
          label={labels.stack}
          options={stackOptions}
          selected={filters.stack}
          onToggle={(value) =>
            update((c) => ({ ...c, stack: toggle(c.stack, value) }))
          }
          collapsible={{ show: labels.show, hide: labels.hide }}
        />

        <div
          className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-baseline"
          aria-live="polite"
        >
          <span className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase">
            {labels.results}
          </span>
          <span className="text-sm text-[var(--muted)]">
            {visible.length} / {projects.length}
            {active && (
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  update(() => EMPTY_FILTERS);
                }}
                className="ml-4 underline underline-offset-4 hover:text-[var(--fg)]"
              >
                {labels.clear}
              </button>
            )}
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-[var(--muted)]">{labels.empty}</p>
      ) : (
        <ul data-reveal-children className="space-y-16">
          {visible.map((project) => (
            <li key={project.slug} suppressHydrationWarning>
              {/*
                Στη λίστα η εναλλαγή γίνεται με το ποντίκι, οπότε τίποτα δεν
                διεκδικεί το κλικ: ολόκληρη η κάρτα παραμένει ένας σύνδεσμος
                προς το project, όπως περιμένει κανείς από έναν κατάλογο.
              */}
              <Link
                href={`/${locale}/projects/${project.slug}`}
                className="project-card group grid gap-6 rounded-[var(--r-lg)] sm:grid-cols-[1fr_1.2fr] sm:items-center"
              >
                <Carousel
                  images={project.images}
                  mode="hover"
                  sizes="(max-width: 40rem) 100vw, 24rem"
                  label={project.title}
                />

                <div className="space-y-3">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    {/* Το hover το σηκώνει το τζάμι της κάρτας (`.project-card`). */}
                    <h2 className="text-3xl">{project.title}</h2>
                    <span className="font-mono text-xs text-[var(--faint)]">
                      {project.year} · {labels.status[project.status]}
                    </span>
                  </div>
                  <p className="text-block text-[var(--muted)]">
                    {project.summary}
                  </p>
                  <p className="font-mono text-xs text-[var(--faint)]">
                    {project.stack.join("  ·  ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
  collapsible,
}: {
  label: string;
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
  /** Αν δοθεί, τα chips ζουν σε συρτάρι που ανοίγει προς τα πλάγια. */
  collapsible?: { show: string; hide: string };
}) {
  const drawerId = useId();
  /*
   * Κλειστό από προεπιλογή — εκτός αν ο σύνδεσμος φέρνει ήδη επιλογές, οπότε
   * κρυμμένα ενεργά φίλτρα θα έκαναν τα αποτελέσματα να μοιάζουν αυθαίρετα.
   */
  const [open, setOpen] = useState(selected.length > 0);

  if (options.length === 0) return null;

  const chips = options.map((option, i) => (
    <Chip
      key={option.value}
      option={option}
      isOn={selected.includes(option.value)}
      onToggle={onToggle}
      index={collapsible ? i : undefined}
    />
  ));

  return (
    <fieldset className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-baseline">
      <legend className="sr-only">{label}</legend>
      <span
        aria-hidden="true"
        className="font-mono text-xs tracking-widest text-[var(--faint)] uppercase"
      >
        {label}
      </span>

      {collapsible ? (
        <div className="space-y-3">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={drawerId}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1 text-sm transition-colors hover:border-[var(--muted)]"
          >
            {open ? collapsible.hide : collapsible.show}
            {selected.length > 0 && (
              <span className="font-mono text-xs text-[var(--accent)]">
                {selected.length}
              </span>
            )}
            {/* Το βέλος γυρίζει προς την κατεύθυνση που θα κινηθούν τα chips. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            >
              <path
                d="M6 3l5 5-5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            id={drawerId}
            className="filter-drawer"
            data-open={open ? "" : undefined}
            // Κλειστό = ούτε Tab ούτε αναγνώστης οθόνης μπαίνουν στα κρυμμένα chips.
            inert={!open}
          >
            <div>
              {/* Λίγο padding ώστε ο δακτύλιος εστίασης να μην κόβεται από το overflow. */}
              <div className="flex flex-wrap gap-2 p-1">{chips}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">{chips}</div>
      )}
    </fieldset>
  );
}

function Chip({
  option,
  isOn,
  onToggle,
  index,
}: {
  option: Option;
  isOn: boolean;
  onToggle: (value: string) => void;
  /** Θέση μέσα στο συρτάρι — δίνει το βήμα της κλιμακωτής εισόδου. */
  index?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={isOn}
      onClick={() => onToggle(option.value)}
      style={
        index === undefined
          ? undefined
          : ({ "--i": index } as React.CSSProperties)
      }
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        index === undefined ? "" : "filter-chip"
      } ${
        isOn
          ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
          : "border-[var(--line)] hover:border-[var(--muted)]"
      }`}
    >
      {option.label}{" "}
      <span
        className={isOn ? "opacity-70" : "font-mono text-xs text-[var(--faint)]"}
      >
        {option.count}
      </span>
    </button>
  );
}
