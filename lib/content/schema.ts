import { z } from "zod";

/**
 * Οι τρεις κατηγορίες της βιτρίνας. Ζουν εδώ και μόνο εδώ — οι ετικέτες τους ανά
 * γλώσσα είναι στο `messages/*.json` κάτω από `categories`.
 */
export const categories = ["fullstack", "data", "automation"] as const;
export type Category = (typeof categories)[number];

export const projectStatuses = ["live", "wip", "archived"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

/**
 * Το συμβόλαιο κάθε project (D6). Ό,τι δεν το τηρεί, σπάει το build αντί να
 * εμφανιστεί μισοάδειο στη σελίδα.
 *
 * Τα `problem` / `solution` / `outcome` είναι υποχρεωτικά επίτηδες: ένα project
 * χωρίς αποτέλεσμα δεν είναι case study, είναι λίστα τεχνολογιών.
 */
export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: μόνο πεζά, ψηφία και παύλες"),
  year: z.number().int().min(2000).max(2100),
  status: z.enum(projectStatuses),
  categories: z.array(z.enum(categories)).min(1),
  stack: z.array(z.string().min(1)).min(1),
  role: z.string().min(1),

  summary: z
    .string()
    .min(1)
    .max(180, "summary: μία πρόταση — μπαίνει σε κάρτα, δεν χωράει παράγραφος"),
  problem: z.string().min(1),
  solution: z.string().min(1),
  outcome: z.string().min(1),

  repo: z.url().nullable().default(null),
  demo: z.url().nullable().default(null),
  cover: z
    .string()
    .startsWith("/", "cover: διαδρομή από τη ρίζα του public, π.χ. /images/...")
    .nullable()
    .default(null),

  featured: z.boolean().default(false),

  /**
   * Σημειώνει ότι το repo είναι ιδιωτικό ή ανύπαρκτο και το project παρουσιάζεται
   * μόνο περιγραφικά (D9). Χωρίς αυτό, μια κάρτα χωρίς σύνδεσμο μοιάζει με σφάλμα.
   */
  caseStudyOnly: z.boolean().default(false),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
