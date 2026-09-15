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
