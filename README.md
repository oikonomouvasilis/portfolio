# Portfolio

Προσωπικό βιογραφικό και portfolio σε μορφή ιστοτόπου. Δίγλωσσο (EN/GR), στατικό,
με τα project να ζουν ως αρχεία MDX μέσα στο repo.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · MDX · zod

## Τοπικά

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Τι κάνει |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript χωρίς παραγωγή αρχείων |

## Δομή

```
app/
  page.tsx              redirect στην προεπιλεγμένη γλώσσα
  [locale]/             όλες οι σελίδες, ανά γλώσσα (en | el)
components/             επαναχρησιμοποιήσιμα components
lib/i18n.ts             locales, μεταφράσεις, εναλλαγή γλώσσας
messages/               κείμενα UI ανά γλώσσα
content/                project ως MDX (Φάση 2)
docs/                   αποφάσεις, roadmap, απογραφή
```

## Τεκμηρίωση

- [DECISIONS.md](docs/DECISIONS.md) — ημερολόγιο σχεδιαστικών αποφάσεων
- [ROADMAP.md](docs/ROADMAP.md) — φάσεις υλοποίησης
- [CONTENT.md](docs/CONTENT.md) — content model και χάρτης σελίδας
- [INVENTORY.md](docs/INVENTORY.md) — απογραφή των project της βιτρίνας

## Ασφάλεια

Το repo είναι δημόσιο εκ σχεδιασμού (D2). Κανένα διαπιστευτήριο, κανένα ευαίσθητο
δεδομένο δεν μπαίνει ποτέ μέσα — οι κανόνες είναι γραμμένοι στο [D9](docs/DECISIONS.md).
