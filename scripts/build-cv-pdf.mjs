/**
 * Παράγει τα `public/cv-en.pdf` και `public/cv-el.pdf` από τη σελίδα `/cv` (D7).
 *
 * Γιατί έτσι και όχι με βιβλιοθήκη PDF:
 *
 * 1. **Ελληνικά.** Οι προεπιλεγμένες γραμματοσειρές των βιβλιοθηκών PDF
 *    (Helvetica κ.λπ.) δεν έχουν ελληνικούς χαρακτήρες. Θα έπρεπε να
 *    ενσωματώσουμε δικό μας .ttf και να συντηρούμε δεύτερο πρότυπο.
 * 2. **Μία πηγή.** Το PDF είναι κυριολεκτικά η σελίδα `/cv` τυπωμένη, με το
 *    `@media print` του `globals.css`. Το online βιογραφικό και το PDF δεν
 *    μπορούν να αποκλίνουν, γιατί είναι το ίδιο πράγμα.
 * 3. **Καμία νέα εξάρτηση.** Χρησιμοποιεί το Chrome που ήδη υπάρχει στο
 *    μηχάνημα — όχι Puppeteer με δικό του κατέβασμα ~150MB.
 *
 * Τρέξιμο:  npm run cv:pdf
 * Απαιτεί:  npm run build να έχει τρέξει πρώτα.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const PORT = 4321;
const LOCALES = ["en", "el"];
const OUT_DIR = path.resolve("public");

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    console.error(
      "✗ Δεν βρέθηκε Chrome ή Edge. Οι διαδρομές που δοκιμάστηκαν:\n  " +
        CHROME_CANDIDATES.join("\n  "),
    );
    process.exit(1);
  }
  return found;
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", ...opts });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${path.basename(cmd)} → exit ${code}`)),
    );
  });
}

async function waitForServer(url, timeoutMs = 60_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      // Ο server δεν σηκώθηκε ακόμη.
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Ο server δεν απάντησε σε ${timeoutMs / 1000}s: ${url}`);
}

async function main() {
  const chrome = findChrome();
  console.log(`🖨  Chrome: ${chrome}`);

  await mkdir(OUT_DIR, { recursive: true });

  console.log(`▲  Εκκίνηση server στη θύρα ${PORT}…`);
  /*
   * Το binary καλείται απευθείας με `node` και όχι μέσω `npx`: στα Windows το
   * spawn ενός `.cmd` χωρίς shell πέφτει σε EINVAL, και το `shell: true` θα
   * άνοιγε τρύπα για command injection αν κάποτε μπει μεταβλητή στα ορίσματα.
   */
  const nextBin = path.resolve("node_modules/next/dist/bin/next");
  if (!existsSync(nextBin)) {
    console.error(`✗ Δεν βρέθηκε το next: ${nextBin}\n  Τρέξε πρώτα npm install.`);
    process.exit(1);
  }
  const server = spawn(
    process.execPath,
    [nextBin, "start", "--port", String(PORT)],
    { stdio: "ignore" },
  );

  let failed = null;
  try {
    await waitForServer(`http://localhost:${PORT}/en/cv`);
    console.log("✓  Ο server απαντά.\n");

    for (const locale of LOCALES) {
      const url = `http://localhost:${PORT}/${locale}/cv`;
      const out = path.join(OUT_DIR, `cv-${locale}.pdf`);
      console.log(`   ${locale} → ${path.basename(out)}`);

      await run(chrome, [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        "--virtual-time-budget=10000",
        `--print-to-pdf=${out}`,
        url,
      ]);
    }
    console.log("\n🎉 Έτοιμα. Τα PDF είναι στο public/.");
  } catch (error) {
    failed = error;
  } finally {
    server.kill();
  }

  if (failed) {
    console.error(`\n✗ ${failed.message}`);
    process.exit(1);
  }
}

main();
