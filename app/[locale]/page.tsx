import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/content/projects";
import { cv } from "@/content/cv";
import { Container } from "@/components/container";

/*
 * Η εικόνα αλλάζει πλευρά σε κάθε σειρά, το κείμενο κάθεται **δίπλα** της.
 *
 * Οι εικόνες κρατιούνται μικρές επίτηδες: στόχος είναι να χωρούν δύο με τρία
 * project στην οθόνη ταυτόχρονα, όπως στους καταλόγους βιτρίνας. Μια εικόνα σε
 * πλήρες πλάτος δείχνει εντυπωσιακή και αφήνει τον επισκέπτη να δει ένα έργο τη
 * φορά — που είναι ακριβώς ό,τι δεν θέλει ένα portfolio.
 *
 * Η εναλλαγή γίνεται με τοποθέτηση σε πλέγμα και όχι με αντιστροφή σειράς: η
 * σειρά στο DOM μένει σταθερή, οπότε δεν ξαναγεννιέται το πρόβλημα όπου το
 * κείμενο διαβαζόταν ανάποδα.
 */
/*
 * Το `row-start-1` είναι υποχρεωτικό και στα δύο.
 *
 * Με δηλωμένη μόνο τη στήλη, η αυτόματη τοποθέτηση του grid έστελνε το κείμενο
 * —που έρχεται δεύτερο στο DOM αλλά ζητά **προηγούμενη** στήλη— σε νέα γραμμή.
 * Οι εναλλασσόμενες σειρές έβγαιναν στοιβαγμένες, με ύψος 456px αντί για 230.
 */
const IMAGE_SIDE = {
  left: "sm:col-start-1 sm:col-end-6 sm:row-start-1",
  right: "sm:col-start-8 sm:col-end-13 sm:row-start-1",
} as const;

const TEXT_SIDE = {
  left: "sm:col-start-7 sm:col-end-13 sm:row-start-1",
  right: "sm:col-start-1 sm:col-end-7 sm:row-start-1",
} as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const t = await getMessages(locale);
  const featured = (await getProjects(locale)).filter((p) => p.featured);

  return (
    <>
      <Container className="py-20 sm:py-28">
        <section className="grid gap-12 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="max-w-3xl">
            <h1>{t.home.tagline}</h1>
            <p className="mt-8 max-w-[58ch] text-[length:var(--t-lead)] leading-[1.7] text-[var(--muted)]">
              {cv.summary[locale]}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[length:var(--t-small)]">
              <Link
                href={`/${locale}/projects`}
                className="rounded-[var(--r-sm)] font-medium text-[var(--accent)] underline decoration-[var(--accent)]/35 underline-offset-[6px] transition-colors hover:decoration-[var(--accent)]"
              >
                {t.home.ctaProjects}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="rounded-[var(--r-sm)] text-[var(--muted)] underline-offset-[6px] transition-colors hover:text-[var(--fg)] hover:underline"
              >
                {t.nav.about}
              </Link>
              <a
                href={`/cv-${locale}.pdf`}
                download
                className="rounded-[var(--r-sm)] text-[var(--muted)] underline-offset-[6px] transition-colors hover:text-[var(--fg)] hover:underline"
              >
                {t.home.ctaCv}
              </a>
            </div>
          </div>

          <Image
            src={cv.photo}
            alt=""
            width={200}
            height={200}
            priority
            className="order-first size-24 rounded-[var(--r-lg)] object-cover sm:order-none sm:size-36"
          />
        </section>
      </Container>

      {featured.length > 0 && (
        /*
         * Η ζώνη αλλάζει φόντο και πιάνει όλο το πλάτος του παραθύρου. Αυτό
         * ξεχωρίζει την ενότητα πολύ πιο καθαρά από μια γραμμή, και είναι ο
         * λόγος που ο περιορισμός πλάτους έφυγε από το `main`.
         */
        <section className="border-y border-[var(--line)] bg-[var(--surface)] py-20 sm:py-28">
          <Container>
            <div className="flex items-baseline gap-6">
              <h2>{t.home.selectedWork}</h2>
              <span
                aria-hidden="true"
                data-rule
                className="h-px flex-1 bg-[var(--line)]"
              />
            </div>

            <ul className="mt-14 space-y-14 sm:mt-16 sm:space-y-16">
              {featured.map((project, i) => {
                const side = i % 2 === 1 ? "right" : "left";

                return (
                  <li key={project.slug} data-reveal>
                    <Link
                      href={`/${locale}/projects/${project.slug}`}
                      className="group grid items-center gap-5 rounded-[var(--r-lg)] sm:grid-cols-12 sm:gap-10"
                    >
                      <div
                        className={`overflow-hidden rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--bg)] ${IMAGE_SIDE[side]}`}
                      >
                        <Image
                          src={project.cover}
                          alt=""
                          width={1200}
                          height={675}
                          /* Η πρώτη σειρά είναι το LCP· τεμπέλικη, περίμενε το JavaScript. */
                          priority={i === 0}
                          className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          sizes="(max-width: 40rem) 100vw, 26rem"
                        />
                      </div>

                      <div className={TEXT_SIDE[side]}>
                        <div className="flex items-baseline gap-4">
                          <h3 className="transition-colors group-hover:text-[var(--accent)]">
                            {project.title}
                          </h3>
                          <span className="ml-auto shrink-0 text-[length:var(--t-micro)] text-[var(--faint)] tabular-nums">
                            {project.year}
                          </span>
                        </div>

                        <p className="mt-3 text-[length:var(--t-small)] leading-[1.65] text-[var(--muted)]">
                          {project.summary}
                        </p>

                        {/*
                         * Δεύτερη παράγραφος από το `outcome`. Η περίληψη είναι
                         * 80–140 χαρακτήρες — από σχεδιασμό, γιατί φτιάχτηκε για
                         * κάρτα. Δίπλα σε εικόνα αφήνει τη στήλη μισοάδεια και
                         * δεν λέει τι βγήκε τελικά, που είναι το ενδιαφέρον.
                         */}
                        <p className="mt-3 text-[length:var(--t-small)] leading-[1.65] text-[var(--faint)]">
                          {project.outcome}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-20">
              <Link
                href={`/${locale}/projects`}
                className="inline-block rounded-[var(--r-sm)] text-[length:var(--t-small)] font-medium text-[var(--accent)] underline decoration-[var(--accent)]/35 underline-offset-[6px] transition-colors hover:decoration-[var(--accent)]"
              >
                {t.projects.title}
              </Link>
            </div>
          </Container>
        </section>
      )}

      <Container className="py-20 sm:py-28">
        <section>
          <div className="flex items-baseline gap-6">
            <h2>{t.about.skills}</h2>
            <span
              aria-hidden="true"
              data-rule
              className="h-px flex-1 bg-[var(--line)]"
            />
          </div>

          <dl className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {cv.skills.map((group) => (
              <div key={group.label.en} data-reveal>
                <dt className="text-[length:var(--t-small)] font-semibold">
                  {group.label[locale]}
                </dt>
                <dd className="mt-2 text-[length:var(--t-small)] leading-relaxed text-[var(--muted)]">
                  {group.items.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
    </>
  );
}
