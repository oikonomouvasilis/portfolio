# Content model & υλικό

Τι σχήμα έχει το περιεχόμενο, και τι χρειάζομαι από σένα για να γεμίσει.

---

## 1. Χάρτης σελίδας

```
/                      → redirect στο /en
/[locale]              → αρχική: hero, featured projects, δεξιότητες, CTA
/[locale]/about        → διαδρομή, σπουδές, ενδιαφέροντα
/[locale]/projects     → grid + φίλτρα (κατηγορία × τεχνολογία) + αναζήτηση
/[locale]/projects/[slug] → case study
/[locale]/cv           → online βιογραφικό + λήψη PDF
/[locale]/contact      → email, LinkedIn, GitHub, social
```

`locale` ∈ `en` | `el`.

---

## 2. Σχήμα project

Κάθε project = `content/projects/<slug>.<locale>.mdx`.

```yaml
---
title:       "Duty Scheduler"
slug:        "duty-scheduler"
year:        2026
status:      "live" | "wip" | "archived"
categories:  ["web-app", "automation"]
stack:       ["Next.js", "TypeScript", "SQLite", "Drizzle"]
role:        "Σχεδιασμός & ανάπτυξη, εξ ολοκλήρου"
summary:     "Μία πρόταση — αυτή εμφανίζεται στην κάρτα."
problem:     "Τι δεν δούλευε πριν."
solution:    "Τι έφτιαξα και γιατί έτσι."
outcome:     "Τι άλλαξε. Νούμερα αν υπάρχουν."
repo:        "https://github.com/..."   # ή null
demo:        "https://..."              # ή null
cover:       "/images/projects/duty-scheduler/cover.png"
featured:    true
---

Ελεύθερο κείμενο MDX: αρχιτεκτονική, δυσκολίες, αποφάσεις,
screenshots, διαγράμματα, αποσπάσματα κώδικα.
```

Το frontmatter επικυρώνεται με zod στο build (D6). Λείπει πεδίο → σπάει το build.

### Κατηγορίες

| slug | Ετικέτα EN | Ετικέτα EL |
|---|---|---|
| `fullstack` | Full-stack | Full-stack |
| `data` | Data & ETL | Δεδομένα & ETL |
| `automation` | Automation | Αυτοματισμοί |

Τρεις κατηγορίες, όπως τις όρισες. Ένα project μπορεί να ανήκει σε πάνω από μία,
αλλά στην πράξη κάθε ένα έχει μία κύρια — αυτή καθορίζει πού εμφανίζεται πρώτα.

Οι **τεχνολογίες** (`stack`) λειτουργούν ως δεύτερος, ανεξάρτητος άξονας φιλτραρίσματος:
κάποιος που ψάχνει «Python» τα βρίσκει όλα, ανεξάρτητα από κατηγορία.

---

## 3. Τελική λίστα — κλειδωμένη

Επιλογή δική σου, 9 project σε 3 κατηγορίες. Η πλήρης απογραφή με draft case studies
και έλεγχο D9 ανά project είναι στο **[INVENTORY.md](INVENTORY.md)**.

| Project | Κατηγορία | slug | Repo | D9 |
|---|---|---|---|---|
| Nutrition Tracker | fullstack | `nutrition-tracker` | ✅ public | ✅ |
| AI Expenses Predictor | fullstack `+data?` | `expenses-predictor` | 🔒 private | ⚠️ ανωνυμοποίηση |
| Αθανéleon | fullstack | `athaneleon` | ✅ public | 🔴 θέλει άδεια |
| Stock Valuation & Validation | data | `etl-stock-valuation` | ✅ public | ⚠️ key |
| AI Trader | automation | `ai-trader` | ✅ public + live | ⚠️ χωρίς αποδόσεις |
| n8n Job Seeker | automation | `n8n-job-seeker` | ✅ public | ⚠️ λείπει το JSON |
| Ελληνικά μητρώα | automation `+data?` | `greek-public-registries` | ❌ χωρίς git | ✅ |
| Duty Scheduler | automation | `duty-scheduler` | 🔒 private | 🔴 θέλει έγκριση |

Τα δύο ETL **ενώθηκαν σε ένα** — το repo `ETL-STOCK-VALUATION` περιείχε ήδη το
`validations.pbix` του δεύτερου. Διαύγεια και ΚΗΜΔΗΣ είναι **ένα** project.

Το `+data?` σημειώνει τη δεύτερη κατηγορία που προτείνω για ισορροπία των φίλτρων —
βλ. [INVENTORY.md](INVENTORY.md), τελευταία ενότητα.

---

## 4. Φόρμα ανά project — αυτό θέλω από σένα

Για κάθε project που κρατάμε, τρεις παράγραφοι. Χωρίς λογοτεχνία:

> **Πρόβλημα** — Τι δεν δούλευε πριν; Ποιος υπέφερε και πόσο;
> *«Ο προγραμματισμός υπηρεσιών γινόταν σε χαρτί. Τρεις ώρες τον μήνα και συνεχή παράπονα για άνιση κατανομή.»*
>
> **Λύση** — Τι έφτιαξες και ποια ήταν η δύσκολη απόφαση;
> *«Web εφαρμογή με αλγόριθμο κατανομής που ζυγίζει βάρος ανά τύπο ημέρας. Η δύσκολη απόφαση ήταν να κρατήσω ένα ενιαίο table γεγονότων αντί για προ-υπολογισμένα σύνολα.»*
>
> **Αποτέλεσμα** — Τι άλλαξε; Νούμερα αν υπάρχουν, ειλικρίνεια αν δεν υπάρχουν.
> *«Από 3 ώρες σε 10 λεπτά. Η απόκλιση μεταξύ ατόμων έπεσε κάτω από μία υπηρεσία τον μήνα.»*

Ένα «αποτέλεσμα» με νούμερο αξίζει όσο δέκα ετικέτες τεχνολογιών.

---

## 5. Λοιπό υλικό

- [ ] Βιογραφικό σε PDF ή Word (πηγή για το `content/cv.ts`)
- [ ] Φωτογραφία προφίλ — καθαρή, φυσικό φως, ουδέτερο φόντο
- [ ] URLs: LinkedIn, GitHub, ό,τι social θέλεις δημόσιο
- [ ] Email επικοινωνίας — δημόσιο, ιδανικά όχι το προσωπικό gmail
- [ ] Screenshots ανά project, **ανωνυμοποιημένα** (D9)
- [ ] Μία πρόταση για το ποιος είσαι, με δικά σου λόγια. Την ξαναγράφουμε μαζί —
      αλλά θέλω να ξεκινήσει από σένα, όχι από μένα.
- [ ] Ενδιαφέροντα εκτός κώδικα. Αυτά κάνουν τη σελίδα να ανήκει σε άνθρωπο.
