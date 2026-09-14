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
  /** Εμφανίζεται στο PDF· τα εικονίδια μένουν στο web. */
  displayAs?: string;
};

export type Cv = {
  name: string;
  headline: Localized;
  location: Localized;
  email: string;
  links: CvLink[];
  summary: Localized;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  interests: Localized[];
};

/**
 * ⚠️ ΣΚΕΛΕΤΟΣ — Φάση 0 εκκρεμότητα.
 *
 * Τα πραγματικά δεδομένα έρχονται από το βιογραφικό σου. Αυτό είναι το σημείο
 * αλήθειας (D7): από εδώ τρέφονται **και** η σελίδα `/cv` **και** τα δύο PDF.
 * Μην αντιγράψεις τίποτα από εδώ σε σελίδα — η σελίδα διαβάζει από εδώ.
 */
export const cv: Cv = {
  name: "Vasilis Oikonomou",
  headline: {
    en: "Data engineering · automation · full-stack",
    el: "Data engineering · αυτοματισμοί · full-stack",
  },
  location: {
    en: "Greece",
    el: "Ελλάδα",
  },
  email: "",
  links: [
    { label: "GitHub", href: "https://github.com/oikonomouvasilis" },
    // TODO Φ0: LinkedIn και ό,τι άλλο social θέλεις δημόσιο.
  ],
  summary: {
    en: "",
    el: "",
  },
  experience: [],
  education: [],
  skills: [],
  interests: [],
};

/** `true` όσο ο σκελετός είναι άδειος — η σελίδα `/cv` το χρησιμοποιεί για να
 * μην εμφανίσει κενές ενότητες πριν έρθει το υλικό. */
export const cvIsEmpty =
  cv.experience.length === 0 &&
  cv.education.length === 0 &&
  cv.skills.length === 0;
