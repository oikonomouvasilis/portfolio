import type { Locale } from "@/lib/i18n";

/**
 * Κείμενο που υπάρχει και στις δύο γλώσσες. Ο τύπος απαιτεί **και τις δύο**, ώστε
 * μια μισοτελειωμένη μετάφραση να φαίνεται στον compiler και όχι στον επισκέπτη.
 */
export type Localized = Record<Locale, string>;

export type Period = {
  /** Μορφή `YYYY-MM`. Το `null` στο `to` σημαίνει «μέχρι σήμερα». */
  from: string;
  to: string | null;
};

export type ExperienceEntry = Period & {
  role: Localized;
  organization: Localized;
  location: Localized;
  /** Δύο-τρεις γραμμές ουσίας. Όχι λίστα καθηκόντων. */
  summary: Localized;
  /**
   * Τι σήκωσε πράγματι δουλειά και πώς αντιμετωπίστηκε.
   *
   * Κάθε γραμμή απαντά σε **πρόκληση → αντιμετώπιση**, όχι σε «αρμοδιότητες».
   * Ένας αναγνώστης βιογραφικού ξέρει τι κάνει ένας ελεγκτής· αυτό που δεν ξέρει
   * είναι τι ήταν δύσκολο και τι έκανες γι' αυτό.
   */
  highlights?: Localized[];
};

export type EducationEntry = Period & {
  degree: Localized;
  institution: Localized;
  note?: Localized;
};

export type SkillGroup = {
  label: Localized;
  /** Ονόματα τεχνολογιών — δεν μεταφράζονται. */
  items: string[];
};

export type Certification = Period & {
  /** Ο τίτλος του προγράμματος όπως τον δίνει ο διοργανωτής. */
  title: Localized;
  issuer: Localized;
};

export type LanguageEntry = {
  name: Localized;
  level: Localized;
};

/**
 * Συμμετοχή σε πρόγραμμα, σεμινάριο ή διαγωνισμό. Οι ημερομηνίες είναι εύρος
 * ημερών, όχι μηνών, οπότε γράφονται ως κείμενο — το `Period` θα έχανε τη μέρα.
 */
export type EventEntry = {
  title: Localized;
  organizer?: Localized;
  when: Localized;
  location: Localized;
};

export type Publication = {
  title: Localized;
  venue: Localized;
  year?: string;
  note?: Localized;
};

export type CvLink = {
  label: string;
  href: string;
};

export type Cv = {
  name: string;
  headline: Localized;
  location: Localized;
  email: string;
  /**
   * Διαδρομή από τη ρίζα του `public`. Η πηγή είναι το LinkedIn, το οποίο
   * σερβίρει μόνο **200×200** — αρκετό για avatar έως ~150px, οριακό πάνω από
   * αυτό σε οθόνη υψηλής πυκνότητας. Γι' αυτό δεν εμφανίζεται ποτέ μεγαλύτερη.
   */
  photo: string;
  /** Ανοιχτός σε προτάσεις — ελέγχει αν φαίνεται η σχετική ένδειξη (D5). */
  openToWork: boolean;
  links: CvLink[];
  summary: Localized;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  certifications: Certification[];
  languages: LanguageEntry[];
  events: EventEntry[];
  publications: Publication[];
  interests: Localized[];
};

/**
 * Ένα σημείο αλήθειας (D7): από εδώ τρέφονται **και** η σελίδα `/cv` **και** τα
 * δύο PDF. Μην αντιγράψεις τίποτα από εδώ σε σελίδα — η σελίδα διαβάζει από εδώ.
 *
 * Πηγές: `CV_REVISED.docx` (Αύγ 2025) για σπουδές, δεξιότητες και ενδιαφέροντα·
 * το προφίλ LinkedIn για τις θέσεις εργασίας και τις ημερομηνίες τους.
 *
 * ⚠️ **Τι ΔΕΝ μπαίνει εδώ, συνειδητά (D9):** το repo είναι δημόσιο, οπότε η
 * ημερομηνία γέννησης και η ακριβής οδός κατοικίας — που υπάρχουν στο βιογραφικό —
 * παραλείπονται. Ο εργοδότης δεν τα χρειάζεται· ο κάθε περαστικός ακόμη λιγότερο.
 */
export const cv: Cv = {
  name: "Vasileios Oikonomou",

  headline: {
    en: "Finance Officer · Data & automation",
    el: "Αξιωματικός Οικονομικού · Δεδομένα & αυτοματισμοί",
  },

  location: {
    en: "Athens, Greece",
    el: "Αθήνα, Ελλάδα",
  },

  email: "billoiko8@gmail.com",

  photo: "/images/profile.jpg",

  /** Το LinkedIn δηλώνει «Open to work · Recruiters only», Αθήνα / hybrid / remote. */
  openToWork: true,

  links: [
    // Το portfolio πρώτο: είναι ο λόγος που υπάρχει το βιογραφικό σε PDF.
    { label: "Portfolio", href: "https://portfolio-oiko4.vercel.app" },
    { label: "GitHub", href: "https://github.com/oikonomouvasilis" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/vasileios-oikonomoy/",
    },
  ],

  summary: {
    en:
      "Finance officer with a background in economics and applied informatics. " +
      "My day job is public-sector financial control — payroll and the execution " +
      "of budget funds — and most of what I build comes from automating the parts " +
      "of it that should never have been manual.",
    el:
      "Αξιωματικός οικονομικού με υπόβαθρο στα οικονομικά και στην εφαρμοσμένη " +
      "πληροφορική. Η καθημερινή μου δουλειά είναι ο δημοσιονομικός έλεγχος — " +
      "μισθοδοσία και εκτέλεση κονδυλίων — και τα περισσότερα από όσα φτιάχνω " +
      "προκύπτουν από την αυτοματοποίηση όσων δεν θα έπρεπε ποτέ να γίνονται στο χέρι.",
  },

  experience: [
    {
      from: "2024-06",
      to: null,
      role: { en: "Fiscal Auditor", el: "Δημοσιονομικός Ελεγκτής" },
      organization: { en: "Greek Army", el: "Ελληνικός Στρατός" },
      location: { en: "Athens", el: "Αθήνα" },
      summary: {
        en:
          "Payroll for a large body of personnel, and execution and control of " +
          "national funds from the defence budget.",
        el:
          "Μισθοδοσία μεγάλου αριθμού στελεχών, και εκτέλεση και έλεγχος εθνικών " +
          "κονδυλίων από τον προϋπολογισμό άμυνας.",
      },
      // ⚠️ DRAFT — γραμμένο από το About του CV/LinkedIn. Διόρθωσέ τα ή πες μου
      // τι ισχύει πραγματικά· δεν εφευρίσκω μετρήσεις που δεν μου έδωσες.
      highlights: [
        {
          en:
            "Payroll leaves no room for error and repeats every month. I moved the " +
            "recurring cross-checks into scripts, so the same mistake cannot be made twice.",
          el:
            "Η μισθοδοσία δεν σηκώνει λάθος και επαναλαμβάνεται κάθε μήνα. Μετέφερα " +
            "τους επαναλαμβανόμενους ελέγχους σε scripts, ώστε το ίδιο λάθος να μη " +
            "γίνεται δεύτερη φορά.",
        },
        {
          en:
            "Controlling budget execution means reconciling figures that live in " +
            "separate systems and formats. Most of what I build starts from exactly " +
            "that friction.",
          el:
            "Ο έλεγχος εκτέλεσης προϋπολογισμού σημαίνει συμφωνία αριθμών που ζουν σε " +
            "διαφορετικά συστήματα και μορφές. Τα περισσότερα από όσα φτιάχνω ξεκινούν " +
            "ακριβώς από αυτή την τριβή.",
        },
      ],
    },
    {
      from: "2023-11",
      to: "2024-07",
      role: {
        en: "Trainee, Finance Corps Military Academy",
        el: "Εκπαιδευόμενος, Σχολή Οικονομικού",
      },
      organization: { en: "Greek Army", el: "Ελληνικός Στρατός" },
      location: { en: "Athens", el: "Αθήνα" },
      summary: {
        en: "Specialist training in military financial administration.",
        el: "Ειδίκευση στη στρατιωτική οικονομική διοίκηση.",
      },
    },
    {
      from: "2022-10",
      to: "2023-07",
      role: {
        en: "Assistant Accounting Manager",
        el: "Βοηθός Προϊσταμένου Λογιστηρίου",
      },
      organization: { en: "Greek Army", el: "Ελληνικός Στρατός" },
      location: { en: "Thessaloniki", el: "Θεσσαλονίκη" },
      summary: {
        en: "Internship in accounting operations.",
        el: "Πρακτική άσκηση σε λογιστικές εργασίες.",
      },
    },
    {
      from: "2019-10",
      to: "2023-10",
      role: { en: "Finance Cadet", el: "Δόκιμος Οικονομικού" },
      organization: {
        en: "Hellenic National Defence General Staff",
        el: "Γενικό Επιτελείο Εθνικής Άμυνας",
      },
      location: { en: "Thessaloniki", el: "Θεσσαλονίκη" },
      summary: {
        en: "Officer training, alongside the economics degree.",
        el: "Εκπαίδευση αξιωματικού, παράλληλα με τις σπουδές οικονομικών.",
      },
      highlights: [
        {
          en:
            "Four years of officer training running in parallel with a full economics " +
            "degree — both finished with honors. What it taught me was scheduling, not theory.",
          el:
            "Τέσσερα χρόνια εκπαίδευσης αξιωματικού παράλληλα με πλήρεις σπουδές " +
            "οικονομικών — και τα δύο με διάκριση. Αυτό που έμαθα ήταν διαχείριση " +
            "χρόνου, όχι θεωρία.",
        },
      ],
    },
  ],

  education: [
    {
      from: "2022-10",
      to: "2024-05",
      degree: {
        en: "MSc, Applied Informatics — Business Computing",
        el: "MSc, Εφαρμοσμένη Πληροφορική — Επιχειρηματική Πληροφορική",
      },
      institution: {
        en: "University of Macedonia",
        el: "Πανεπιστήμιο Μακεδονίας",
      },
      note: { en: "Graduated with honors", el: "Αποφοίτηση με διάκριση" },
    },
    {
      from: "2019-10",
      to: "2022-07",
      degree: {
        en: "BSc, Economics — Business Administration",
        el: "BSc, Οικονομικά — Διοίκηση Επιχειρήσεων",
      },
      institution: {
        en: "Aristotle University of Thessaloniki",
        el: "Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης",
      },
      note: { en: "Graduated with honors", el: "Αποφοίτηση με διάκριση" },
    },
    {
      from: "2019-09",
      to: "2023-10",
      degree: { en: "Officer training", el: "Εκπαίδευση αξιωματικού" },
      institution: {
        en: "Military Academy of Combat Support Officers",
        el: "Στρατιωτική Σχολή Αξιωματικών Σωμάτων",
      },
    },
  ],

  skills: [
    {
      label: { en: "Languages & data", el: "Γλώσσες & δεδομένα" },
      items: ["Python", "SQL", "TypeScript", "Java"],
    },
    {
      label: { en: "Data & ML", el: "Δεδομένα & ML" },
      items: [
        "Pandas",
        "NumPy",
        "scikit-learn",
        "SciPy",
        "Matplotlib",
        "Seaborn",
        "Plotly",
      ],
    },
    {
      label: { en: "Web", el: "Web" },
      items: ["Next.js", "React", "Tailwind CSS", "HTML5", "CSS3"],
    },
    {
      label: { en: "BI & analysis", el: "BI & ανάλυση" },
      items: ["Power BI", "Tableau", "Excel / VBA", "EViews", "GAMS / LINGO"],
    },
    {
      label: { en: "Automation", el: "Αυτοματισμοί" },
      items: ["n8n", "GitHub Actions", "Web scraping", "REST APIs"],
    },
  ],

  // Πηγή για τα τέσσερα παρακάτω: οι ενότητες Certifications, Languages,
  // Participation και Research του `CV_REVISED.docx`.
  certifications: [
    {
      from: "2024-07",
      to: "2024-08",
      title: {
        en: "The Complete Python Bootcamp: From Zero to Hero in Python",
        el: "The Complete Python Bootcamp: From Zero to Hero in Python",
      },
      issuer: { en: "Udemy", el: "Udemy" },
    },
    {
      from: "2024-03",
      to: "2024-07",
      title: { en: "Data Analysis Bootcamp", el: "Data Analysis Bootcamp" },
      issuer: {
        en: "Workearly Greece, powered by Public",
        el: "Workearly Greece, με την υποστήριξη του Public",
      },
    },
    {
      from: "2024-02",
      to: "2024-03",
      title: {
        en: "The ReGeneration Initiative: AI 360° School",
        el: "The ReGeneration Initiative: AI 360° School",
      },
      issuer: {
        en: "Microsoft & Code Hub",
        el: "Microsoft & Code Hub",
      },
    },
  ],

  languages: [
    {
      name: { en: "Greek", el: "Ελληνικά" },
      level: { en: "Native", el: "Μητρική" },
    },
    {
      name: { en: "English", el: "Αγγλικά" },
      level: {
        en: "C2 — Pearson Edexcel Level 3 Certificate in ESOL International",
        el: "C2 — Pearson Edexcel Level 3 Certificate in ESOL International",
      },
    },
  ],

  events: [
    {
      title: {
        en: "ReGeneration — 19th cycle",
        el: "ReGeneration — 19ος κύκλος",
      },
      when: { en: "22–24 Oct 2024", el: "22–24 Οκτ 2024" },
      location: { en: "Athens", el: "Αθήνα" },
    },
    {
      title: {
        en: "Common Module on Budget and Finance",
        el: "Κοινή Ενότητα Προϋπολογισμού και Οικονομικών",
      },
      organizer: {
        en: "European Security and Defence College",
        el: "Ευρωπαϊκό Κολλέγιο Ασφάλειας και Άμυνας",
      },
      when: { en: "20–24 Feb 2023", el: "20–24 Φεβ 2023" },
      location: { en: "Thessaloniki", el: "Θεσσαλονίκη" },
    },
    {
      title: {
        en: "Common Module on the Common Security and Defence Policy (CSDP)",
        el: "Κοινή Ενότητα για την Κοινή Πολιτική Ασφάλειας και Άμυνας (ΚΠΑΑ)",
      },
      organizer: {
        en: "European Security and Defence College",
        el: "Ευρωπαϊκό Κολλέγιο Ασφάλειας και Άμυνας",
      },
      when: { en: "24–28 Oct 2022", el: "24–28 Οκτ 2022" },
      location: { en: "Wiener Neustadt", el: "Βίνερ Νόισταντ" },
    },
    {
      title: {
        en: "Building a Development Center",
        el: "Building a Development Center",
      },
      organizer: {
        en: "Aristotle University of Thessaloniki & INTERSPORT ATHLETICS",
        el: "Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης & INTERSPORT ATHLETICS",
      },
      when: { en: "3–4 Jun 2022", el: "3–4 Ιούν 2022" },
      location: { en: "Thessaloniki", el: "Θεσσαλονίκη" },
    },
  ],

  publications: [
    {
      title: {
        en:
          "Evolution of total health expenditure in Greece, 1988–2017: effects " +
          "of the crisis and comparison with Southern European countries",
        el:
          "Εξέλιξη των συνολικών δαπανών υγείας στην Ελλάδα, 1988–2017: " +
          "επιδράσεις της κρίσης και σύγκριση με τις χώρες της Νότιας Ευρώπης",
      },
      venue: {
        en: "Hellenic Association of Certified Stockmarket Analysts (H.A.S.C.A.)",
        el: "Hellenic Association of Certified Stockmarket Analysts (H.A.S.C.A.)",
      },
      note: { en: "Group publication", el: "Ομαδική δημοσίευση" },
    },
    {
      title: {
        en: "Analysis of Marfin Investment Group",
        el: "Ανάλυση της Marfin Investment Group",
      },
      venue: {
        en: "Hellenic Investors Association (SED) — annual magazine",
        el: "Σύλλογος Επενδυτών & Διαδικτύου (ΣΕΔ) — ετήσιο περιοδικό",
      },
      year: "2021",
      note: { en: "Group publication", el: "Ομαδική δημοσίευση" },
    },
  ],

  interests: [
    { en: "Psychology & sociology", el: "Ψυχολογία & κοινωνιολογία" },
    { en: "Football", el: "Ποδόσφαιρο" },
    { en: "Training", el: "Γυμναστική" },
  ],
};

export const cvIsEmpty =
  cv.experience.length === 0 &&
  cv.education.length === 0 &&
  cv.skills.length === 0;
