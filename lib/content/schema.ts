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
 * Τα στρώματα της αρχιτεκτονικής, με τη σειρά που στοιβάζονται στο γράφημα:
 * από ό,τι βλέπει ο χρήστης προς ό,τι το κρατάει όρθιο (D15).
 */
export const stackLayers = ["frontend", "backend", "data", "infra"] as const;
export type StackLayer = (typeof stackLayers)[number];

const galleryItemSchema = z.object({
  src: z
    .string()
    .startsWith("/", "gallery.src: διαδρομή από τη ρίζα του public"),
  /** Λεζάντα στη γλώσσα του αρχείου — δεν είναι εναλλακτικό κείμενο διακόσμησης. */
  caption: z.string().min(1, "gallery.caption: κάθε εικόνα χρειάζεται λεζάντα"),
});

export type GalleryItem = z.infer<typeof galleryItemSchema>;

/**
 * Το συμβόλαιο κάθε project (D6, D15). Ό,τι δεν το τηρεί, σπάει το build αντί να
 * εμφανιστεί μισοάδειο στη σελίδα.
 *
 * Τα `problem` / `goal` / `solution` / `outcome` είναι υποχρεωτικά επίτηδες: ένα
 * project χωρίς στόχο και αποτέλεσμα δεν είναι case study, είναι λίστα τεχνολογιών.
 */
export const projectFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: μόνο πεζά, ψηφία και παύλες"),
    year: z.number().int().min(2000).max(2100),
    status: z.enum(projectStatuses),
    categories: z.array(z.enum(categories)).min(1),
    role: z.string().min(1),

    /**
     * Το stack ανά στρώμα. Το επίπεδο `stack` **παράγεται** από εδώ, ώστε να μην
     * υπάρχουν δύο λίστες που μπορούν να αποκλίνουν.
     */
    stackLayers: z
      .object({
        frontend: z.array(z.string().min(1)).min(1).optional(),
        backend: z.array(z.string().min(1)).min(1).optional(),
        data: z.array(z.string().min(1)).min(1).optional(),
        infra: z.array(z.string().min(1)).min(1).optional(),
      })
      .refine(
        (layers) => Object.values(layers).some((v) => v !== undefined),
        "stackLayers: χρειάζεται τουλάχιστον ένα στρώμα",
      ),

    summary: z
      .string()
      .min(1)
      .max(180, "summary: μία πρόταση — μπαίνει σε κάρτα, δεν χωράει παράγραφος"),
    problem: z.string().min(1),
    /** Τι ήθελες να πετύχεις — διαφορετικό από το τι δεν δούλευε (D15). */
    goal: z.string().min(1),
    solution: z.string().min(1),
    outcome: z.string().min(1),

    repo: z.url().nullable().default(null),
    demo: z.url().nullable().default(null),

    /** Η κύρια εικόνα. Υποχρεωτική: το editorial ύφος δεν στέκει χωρίς (D14). */
    cover: z
      .string()
      .startsWith("/", "cover: διαδρομή από τη ρίζα του public, π.χ. /images/..."),
    gallery: z
      .array(galleryItemSchema)
      .min(1, "gallery: τουλάχιστον μία εικόνα ανά project (D15)"),

    featured: z.boolean().default(false),

    /**
     * Σημειώνει ότι το repo είναι ιδιωτικό ή ανύπαρκτο και το project παρουσιάζεται
     * μόνο περιγραφικά (D9). Χωρίς αυτό, μια κάρτα χωρίς σύνδεσμο μοιάζει με σφάλμα.
     */
    caseStudyOnly: z.boolean().default(false),
  })
  .refine(
    (p) => p.repo !== null || p.demo !== null || p.caseStudyOnly,
    {
      message:
        "Χρειάζεται repo ή demo. Αν δεν υπάρχει κανένα, δήλωσε caseStudyOnly: true " +
        "ώστε η απουσία συνδέσμου να είναι απόφαση και όχι παράλειψη (D15)",
      path: ["repo"],
    },
  );

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

/** Επίπεδη λίστα τεχνολογιών, για τα φίλτρα. Παράγεται, δεν γράφεται. */
export function flattenStack(
  layers: ProjectFrontmatter["stackLayers"],
): string[] {
  return stackLayers.flatMap((layer) => layers[layer] ?? []);
}
