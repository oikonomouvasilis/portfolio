import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * Το eslint-config-next 16 εξάγει έτοιμα flat configs, οπότε δεν μεσολαβεί
 * FlatCompat — το legacy γεφύρωμα σκάει σε κυκλική αναφορά στο eslint-plugin-react.
 */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
