import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      /*
       * Το `/cv` συγχωνεύτηκε στο `/about` (D27). Μόνιμη ανακατεύθυνση, ώστε
       * όποιος σύνδεσμος κυκλοφορεί ήδη — σε LinkedIn, σε email, σε ευρετήριο —
       * να καταλήγει στη σωστή σελίδα αντί για 404.
       */
      {
        source: "/:locale(en|el)/cv",
        destination: "/:locale/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
