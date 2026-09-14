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
| `data-etl` | Data & ETL | Δεδομένα & ETL |
| `automation` | Automation | Αυτοματισμοί |
| `machine-learning` | Machine Learning | Μηχανική Μάθηση |
| `web-app` | Web Apps | Εφαρμογές Web |
| `api-integration` | APIs & Integrations | APIs & Διασυνδέσεις |
| `finance` | Finance & Trading | Χρηματοοικονομικά |

Ένα project μπορεί να ανήκει σε πάνω από μία.

---

## 3. Draft shortlist — από τον φάκελο `PROJECTS`

Πρώτη ανάγνωση, **προς συζήτηση**. Στόχος 6–10 project: λιγότερα και καλύτερα
νικούν τα πολλά και μισοτελειωμένα.

| Project | Κατηγορίες | Γιατί μπαίνει | D9 |
|---|---|---|---|
| **Duty Scheduler** | web-app, automation | Πλήρες full-stack, αλγόριθμος δίκαιης κατανομής, δικό σου σχέδιο από το μηδέν | ⚠️ ψευδοδεδομένα στα screenshots |
| **ETL Stock Valuation** | data-etl, finance | Pipeline + βάση + Power BI. Δείχνει data engineering end-to-end | ✅ δημόσια δεδομένα |
| **ML Expenses Predictor** | machine-learning, web-app | Μοντέλο + API + frontend — σπάνιος συνδυασμός σε portfolio | ⚠️ ανωνυμοποίηση συναλλαγών |
| **AI Trading** | finance, api-integration | Alpaca API, dashboard, journal. Δείχνει δουλειά με live αγορές | ⚠️ χωρίς keys, χωρίς αποδόσεις λογαριασμού |
| **n8n Job Seeker** | automation, api-integration | Πραγματικός αυτοματισμός που λύνει δικό σου πρόβλημα | ⚠️ credentials έξω |
| **Αυτοματοποίηση Συνθηματικών** | automation | Desktop app με PyInstaller, export σε PDF/XLSX. Δείχνει εύρος πέρα από web | 🔴 **case study χωρίς repo** |
| **Διαύγεια / ΚΗΜΔΗΣ ανάκτηση** | data-etl, api-integration | Δουλειά με δημόσια open data APIs | ✅ δημόσια δεδομένα |
| **  * | web-app | Δεύτερη Next.js εφαρμογή — μπαίνει μόνο αν έχει κάτι να πει | ✅ |
| **Open Banking App** | finance, api-integration | Δυνατός τομέας, αλλά ευαίσθητος | 🔴 μόνο περιγραφικά |
| **SYNOLO / finance hub** | finance, web-app | Χρειάζεται να δω τι έχει μέσα | ❓ |

✅ ασφαλές · ⚠️ θέλει ανωνυμοποίηση · 🔴 όχι repo, μόνο περιγραφή

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
