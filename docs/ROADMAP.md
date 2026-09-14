# Roadmap

Φάσεις υλοποίησης. Κάθε φάση κλείνει με commit και με κάτι που **φαίνεται** —
ποτέ δύο φάσεις χωρίς ορατό αποτέλεσμα.

---

## Φάση 0 — Απογραφή & υλικό (τρέχουσα)
Η μόνη φάση όπου η δουλειά είναι κυρίως δική σου.

- [x] Καταγραφή αποφάσεων ([DECISIONS.md](DECISIONS.md))
- [x] Χάρτης σελίδας & content model ([CONTENT.md](CONTENT.md))
- [x] Επιλογή project: **9 σε 3 κατηγορίες**, κλειδωμένη ([CONTENT.md §3](CONTENT.md))
- [x] Απογραφή κώδικα & git ιστορικού ανά project ([INVENTORY.md](INVENTORY.md))
- [x] Draft case study ανά project — γραμμένο από την ανάγνωση του κώδικα
- [x] Σάρωση D9: έλεγχος για εκτεθειμένα διαπιστευτήρια σε όλα τα repos
- [ ] 🔴 **Ανάκληση Finnhub API key** — εκτεθειμένο σε public repo ([INVENTORY.md](INVENTORY.md))
- [ ] 🔴 Αθανéleon: πελάτης, δικό σου, ή άσκηση; (καθορίζει αν μπαίνει επώνυμα)
- [ ] Συμπλήρωση των `[?]` στο INVENTORY — ιδίως η ακρίβεια του μοντέλου στο #2
- [ ] Απόφαση: ένωση των δύο ETL; ένωση Διαύγεια + ΚΗΜΔΗΣ;
- [ ] `git init` + repo για τα 3 project που δεν έχουν
- [ ] Υλικό: βιογραφικό (PDF/Word), φωτογραφία, LinkedIn/GitHub URLs
- [ ] Screenshots ανά project — **ανωνυμοποιημένα** (D9)

**Blocker:** μόνο τα δύο 🔴 μπλοκάρουν. Τα υπόλοιπα τρέχουν παράλληλα με τις Φάσεις 1–3,
που δεν χρειάζονται περιεχόμενο.

## Φάση 1 — Υποδομή & πρώτο deploy
- [ ] `git init`, public repo στο GitHub
- [ ] Next.js 16 + TS + Tailwind 4 + MDX scaffold
- [ ] Routing δύο γλωσσών: `/[locale]` με `en` | `el`, redirect από `/`
- [ ] ESLint + Prettier + `typecheck` script
- [ ] Σύνδεση Vercel → deploy κενής σελίδας

**Παραδοτέο:** ζωντανό URL από την πρώτη μέρα. Κάθε επόμενο push ανεβαίνει μόνο του.

## Φάση 2 — Content pipeline
- [ ] zod schema για το frontmatter των project
- [ ] Loader που διαβάζει τα MDX, επικυρώνει, και σπάει το build σε λάθος
- [ ] Παραγωγή κατηγοριών/τεχνολογιών **από τα δεδομένα**, όχι από χειροκίνητη λίστα
- [ ] 2 πραγματικά project ως δείγμα, σε EN + EL
- [ ] `content/cv.ts` με typed δομή βιογραφικού

**Παραδοτέο:** προσθέτεις αρχείο → εμφανίζεται στο site χωρίς να αγγίξεις κώδικα.

## Φάση 3 — Design system
- [ ] Τυπογραφική κλίμακα, χρώματα, spacing, radius — ως tokens
- [ ] Dark / light mode με διακόπτη + `prefers-color-scheme`
- [ ] Βασικά components: Button, Card, Tag, Section, Prose, LocaleSwitch
- [ ] Responsive grid, mobile-first

**Παραδοτέο:** μία σελίδα-δείγμα με όλα τα components, σε δύο θέματα.

## Φάση 4 — Αρχική, About, Contact
- [ ] Hero: τι κάνεις, σε μία πρόταση που δεν είναι κλισέ
- [ ] Featured projects (3 κάρτες, από το flag `featured`)
- [ ] Δεξιότητες ομαδοποιημένες κατά τομέα
- [ ] `/about`: διαδρομή (εργασία · σπουδές), ενδιαφέροντα, φωτογραφία
- [ ] `/contact`: email, LinkedIn, GitHub, social
- [ ] Header με menu + διακόπτες γλώσσας/θέματος, footer

**Παραδοτέο:** το site στέκει μόνο του, ακόμα και χωρίς τη σελίδα projects.

## Φάση 5 — Projects (η καρδιά)
- [ ] `/projects`: grid με φίλτρα κατηγορίας **και** τεχνολογίας, συνδυαστικά
- [ ] Τα φίλτρα γράφονται στο URL (`?cat=etl&tech=python`) → μοιράζεται ο σύνδεσμος
- [ ] Αναζήτηση κειμένου, client-side
- [ ] `/projects/[slug]`: case study — πρόβλημα, λύση, αρχιτεκτονική, αποτέλεσμα
- [ ] Ανά project: stack badges, ρόλος, έτος, links (repo / demo), screenshots
- [ ] Διάγραμμα αρχιτεκτονικής όπου προσθέτει κάτι
- [ ] Πλοήγηση «επόμενο / προηγούμενο project»

**Παραδοτέο:** το κομμάτι που πραγματικά κρίνει αν σε καλέσουν για συνέντευξη.

## Φάση 6 — CV & PDF
- [ ] Σελίδα `/cv` από το `content/cv.ts`
- [ ] `npm run cv:pdf` → `public/cv-en.pdf` + `public/cv-el.pdf` (D7)
- [ ] Κουμπί λήψης σε header, `/cv` και footer
- [ ] Print stylesheet για όποιον τυπώσει τη σελίδα απευθείας

## Φάση 7 — Polish & go-live
- [ ] SEO: metadata ανά σελίδα, sitemap.xml, robots.txt, `hreflang` για τις 2 γλώσσες
- [ ] OG images — παραγόμενες δυναμικά ανά project
- [ ] JSON-LD `Person` schema (βοηθά να σε βρίσκουν στο Google)
- [ ] Lighthouse ≥ 95 και στους 4 άξονες
- [ ] Προσβασιμότητα: πλοήγηση μόνο με πληκτρολόγιο, contrast, alt κείμενα
- [ ] Έλεγχος σε κινητό, σε πραγματική συσκευή
- [ ] 404 σελίδα
- [ ] Analytics (D10)
- [ ] **Τελικός έλεγχος D9** — secret scanning, καμία διαρροή δεδομένων
- [ ] Custom domain αν έχει αποφασιστεί (D11)

---

## Εκτίμηση

| Φάση | Δουλειά | Ποιος |
|------|---------|-------|
| 0 | Απογραφή & υλικό | **εσύ**, εγώ βοηθώ με τη λίστα |
| 1–3 | Υποδομή, content pipeline, design | εγώ |
| 4–5 | Σελίδες & projects | εγώ, εσύ κρίνεις κείμενα |
| 6–7 | CV, SEO, go-live | εγώ |

Η Φάση 0 είναι το πραγματικό ρίσκο χρονοδιαγράμματος. Οι υπόλοιπες κυλάνε.
