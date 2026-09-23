import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/content/projects";
import { cv } from "@/content/cv";
import { Container } from "@/components/container";

/**
 * Τα πλάτη των σειρών, εναλλάξ και **άνισα**.
 *
 * Ίσα πλάτη δίνουν grid, και το grid δεν έχει ρυθμό: το μάτι μαθαίνει τη θέση
 * της επόμενης κάρτας και σταματά να κοιτάζει. Επειδή όλες οι εικόνες έχουν την
 * ίδια αναλογία, το διαφορετικό πλάτος παράγει και διαφορετικό **ύψος** — χωρίς
 * να χρειαστεί να περικοπεί καμία.
 */
const ROW_WIDTHS = ["sm:w-full", "sm:w-[72%]", "sm:w-[86%]", "sm:w-[64%]"];

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

            <ul className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
              {featured.map((project, i) => {
                const flip = i % 2 === 1;

                return (
                  <li
                    key={project.slug}
                    data-reveal
                    className={`${ROW_WIDTHS[i % ROW_WIDTHS.length]} ${
                      flip ? "sm:ml-auto" : ""
                    }`}
                  >
                    <Link
                      href={`/${locale}/projects/${project.slug}`}
                      className="group block rounded-[var(--r-xl)]"
                    >
                      <div className="overflow-hidden rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--bg)]">
                        <Image
                          src={project.cover}
                          alt=""
                          width={1200}
                          height={675}
                          /*
                           * Η πρώτη σειρά είναι το LCP. Φορτωμένη τεμπέλικα,
                           * περίμενε το JavaScript.
                           */
                          priority={i === 0}
                          className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                          sizes="(max-width: 40rem) 100vw, 60rem"
                        />
                      </div>

                      {/*
                       * Η σειρά **δεν** αντιστρέφεται στις μετατοπισμένες
                       * σειρές. Το `flex-row-reverse` έβγαζε το έτος πρώτο και
                       * τον τίτλο τελευταίο: διάβαζες «2026 → περίληψη →
                       * τίτλος». Η ασυμμετρία υπάρχει ήδη στη θέση και στο
                       * πλάτος της σειράς· δεν χρειάζεται να πληρωθεί με τη
                       * σειρά ανάγνωσης.
                       */}
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
                        <h3 className="shrink-0 transition-colors group-hover:text-[var(--accent)]">
                          {project.title}
                        </h3>
                        <p className="max-w-[52ch] text-[length:var(--t-small)] leading-relaxed text-[var(--muted)]">
                          {project.summary}
                        </p>
                        <span className="text-[length:var(--t-micro)] text-[var(--faint)] tabular-nums sm:ml-auto">
                          {project.year}
                        </span>
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
