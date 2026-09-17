"use client";

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#eceee6", color: "#17231b", minHeight: "100dvh", display: "grid", placeItems: "center" }}>
        <title>Something went wrong — GeorgiaGuided</title>
        <main style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>Something went wrong</h1>
          <p style={{ opacity: 0.7, lineHeight: 1.5 }}>Please try again. {error.digest ? `Reference: ${error.digest}` : ""}</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ marginTop: 16, padding: "10px 20px", borderRadius: 999, border: 0, background: "#245c3d", color: "#fff", cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
