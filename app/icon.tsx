import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Μονόγραμμα αντί για αρχείο `.ico`: παράγεται στο build και ακολουθεί τα
 * χρώματα του design system, χωρίς δυαδικό αρχείο στο repo που κανείς δεν
 * ξέρει πια πώς φτιάχτηκε.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#171614",
          color: "#fdfcfa",
          fontSize: 19,
          letterSpacing: -1,
        }}
      >
        VO
      </div>
    ),
    size,
  );
}
