# -*- coding: utf-8 -*-
"""Παράγει τις εικόνες του case study «Αποστολέας Βεβαιώσεων Φόρου».

Όλα τα δεδομένα στις εικόνες είναι ΠΛΑΣΜΑΤΙΚΑ. Κανένα πραγματικό ΑΦΜ,
όνομα ή email δεν φεύγει από τον τοπικό φάκελο εργασίας.
Τα συγκεντρωτικά νούμερα (4.292 / 1.860 / 276 κ.λπ.) είναι τα πραγματικά,
μετρημένα από τις αναφορές και τα mbox.
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

# Η ρίζα του site βγαίνει από τη θέση του script, ώστε να τρέχει από οπουδήποτε.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images", "projects", "tax-certificate-sender")
os.makedirs(OUT, exist_ok=True)

FONT = "Calibri"
INK = "#12161f"
MUTED = "#545a66"
ACCENT = "#a8122b"
HEADER_BG = "#1f3864"
BAD_BG = "#fbe3e4"
BAD_INK = "#8b1a1a"
OK_INK = "#1e6b3a"

# Πλασματικά ΑΦΜ. Όσα ξεκινούν από 0 είναι ακριβώς εκείνα που έσπαγαν: το Excel
# τα κρατούσε ως ακέραιους, οπότε έφταναν οκταψήφια και δεν έβρισκαν το PDF τους.
ROWS = [
    ("427283112", "promitheftis01@example.com", False),
    ("099963235", "promitheftis02@example.com", True),
    ("314402000", "promitheftis03@example.com", False),
    ("051385349", "promitheftis04@example.com", True),
    ("826143639", "promitheftis05@example.com", False),
    ("094771820", "promitheftis06@example.com", True),
    ("123091020", "promitheftis07@example.com", False),
    ("067205513", "promitheftis08@example.com", True),
    ("725328060", "promitheftis09@example.com", False),
    ("083440176", "promitheftis10@example.com", True),
    ("521412032", "promitheftis11@example.com", False),
    ("078612394", "promitheftis12@example.com", True),
    ("640118273", "promitheftis13@example.com", False),
    ("035907441", "promitheftis14@example.com", True),
    ("218774905", "promitheftis15@example.com", False),
    ("062330118", "promitheftis16@example.com", True),
    ("934615702", "promitheftis17@example.com", False),
    ("047128366", "promitheftis18@example.com", True),
    ("386029514", "promitheftis19@example.com", False),
    ("019845273", "promitheftis20@example.com", True),
]

FNAME = "213_Bebaiosi_FE_Bookmarks_BY_afm-2_{}.pdf"


def spreadsheet(path, title, subtitle, before):
    """Στιγμιότυπο φύλλου εργασίας στο ύφος του Excel."""
    n = len(ROWS)
    row_h = 26
    head_h = 30
    top = 74
    width = 1120
    height = top + head_h + n * row_h + 18

    fig = plt.figure(figsize=(width / 100, height / 100), dpi=200)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, width)
    ax.set_ylim(height, 0)
    ax.axis("off")
    fig.patch.set_facecolor("white")

    ax.text(16, 26, title, fontname=FONT, fontsize=13, fontweight="bold", color=INK,
            va="center")
    ax.text(16, 52, subtitle, fontname=FONT, fontsize=10.5, style="italic",
            color=MUTED, va="center")

    # Στήλες: x αρχής, πλάτος, επικεφαλίδα
    cols = [(16, 430, "ΑΡΧΕΙΟ"), (446, 130, "ΑΦΜ"),
            (576, 300, "EMAIL"), (876, 228, "ΚΑΤΑΣΤΑΣΗ")]

    y = top
    ax.add_patch(Rectangle((16, y), 1088, head_h, facecolor=HEADER_BG, edgecolor="none"))
    for x, w, label in cols:
        ax.text(x + 8, y + head_h / 2, label, fontname=FONT, fontsize=10.5,
                fontweight="bold", color="white", va="center")

    y += head_h
    for i, (afm, email, leading_zero) in enumerate(ROWS):
        broken = before and leading_zero
        band = "#ffffff" if i % 2 == 0 else "#f4f4f2"
        ax.add_patch(Rectangle((16, y), 1088, row_h, facecolor=band,
                               edgecolor="#d8d8d4", linewidth=0.6))

        cells = [
            FNAME.format(afm),
            afm if not broken else afm,
            "—" if broken else email,
            "2. ΛΕΙΠΕΙ ΑΠΟ EXCEL" if broken else "0. ΕΤΟΙΜΟ ΓΙΑ ΑΠΟΣΤΟΛΗ",
        ]
        for (x, w, _), text in zip(cols, cells):
            colour = INK
            if text.startswith("2."):
                ax.add_patch(Rectangle((x, y), w, row_h, facecolor=BAD_BG,
                                       edgecolor="#d8d8d4", linewidth=0.6))
                colour = BAD_INK
            elif text.startswith("0."):
                colour = OK_INK
            ax.text(x + 8, y + row_h / 2, text, fontname=FONT, fontsize=10,
                    color=colour, va="center")
        y += row_h

    fig.savefig(path, facecolor="white")
    plt.close(fig)
    print("γράφτηκε", path)


def bounces(path):
    """Οι λόγοι αποτυχίας παράδοσης — μία σειρά, ένα χρώμα, ετικέτες πάνω στις μπάρες."""
    data = [
        ("Ανύπαρκτο γραμματοκιβώτιο", 248),
        ("Μπλοκαρίστηκε ως ανεπιθύμητο", 11),
        ("Άλλο / ασαφής αιτία", 9),
        ("Γεμάτο γραμματοκιβώτιο", 5),
        ("Νεκρό domain", 3),
    ]
    labels = [d[0] for d in data][::-1]
    values = [d[1] for d in data][::-1]

    fig, ax = plt.subplots(figsize=(8.4, 4.6), dpi=200)
    fig.patch.set_facecolor("#f6f6f4")
    ax.set_facecolor("#f6f6f4")

    bars = ax.barh(labels, values, color=ACCENT, height=0.55)
    for bar, v in zip(bars, values):
        ax.text(bar.get_width() + 4, bar.get_y() + bar.get_height() / 2, str(v),
                va="center", ha="left", fontname=FONT, fontsize=11, color=INK)

    ax.set_xlim(0, 285)
    for side in ("top", "right", "bottom"):
        ax.spines[side].set_visible(False)
    ax.spines["left"].set_color("#c9c9c4")
    ax.tick_params(axis="both", length=0)
    ax.set_xticks([])
    for label in ax.get_yticklabels():
        label.set_fontname(FONT)
        label.set_fontsize(11)
        label.set_color(INK)

    fig.tight_layout(rect=[0, 0.07, 1, 0.84])
    fig.text(0.011, 0.93, "276 μηνύματα επέστρεψαν ως αδύνατη παράδοση",
             fontname=FONT, fontsize=13, fontweight="bold", color=INK, va="center")
    fig.text(0.011, 0.865,
             "Από ~4.284 αποστολές · κατηγοριοποίηση των κωδικών SMTP στα δύο αρχεία mbox",
             fontname=FONT, fontsize=9.5, style="italic", color=MUTED, va="center")
    fig.savefig(path, facecolor="#f6f6f4")
    plt.close(fig)
    print("γράφτηκε", path)


spreadsheet(
    os.path.join(OUT, "audit-before.png"),
    "ΑΝΑΦΟΡΑ ΕΛΕΓΧΟΥ, 1η ΕΚΤΕΛΕΣΗ — ΔΕΙΓΜΑ ΜΕ ΠΛΑΣΜΑΤΙΚΑ ΔΕΔΟΜΕΝΑ",
    "4.292 αρχεία PDF · 2.427 έτοιμα · 1.860 δηλώνονται «λείπει από Excel» — και όλα τους έχουν ΑΦΜ που ξεκινά από μηδέν",
    before=True,
)
spreadsheet(
    os.path.join(OUT, "audit-after.png"),
    "ΑΝΑΦΟΡΑ ΕΛΕΓΧΟΥ, 2η ΕΚΤΕΛΕΣΗ — ΔΕΙΓΜΑ ΜΕ ΠΛΑΣΜΑΤΙΚΑ ΔΕΔΟΜΕΝΑ",
    "Ίδια αρχεία, ίδιο Excel, συμπλήρωση του ΑΦΜ στα 9 ψηφία · 4.284 έτοιμα, 8 υπολείμματα",
    before=False,
)
bounces(os.path.join(OUT, "bounces.png"))
