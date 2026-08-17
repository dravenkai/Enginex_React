import { apiRequest } from "./http";

// POST /engineers/portfolio and POST /engineers/portfolio/{id}/pdf — per
// https://api.enginexmm.tech/api/docs. Neither of these (nor a Portfolio
// schema) appears in the live OpenAPI spec at /api/docs/openapi.json, so —
// same situation as /engineers/direct-projects elsewhere in this app — this
// is trusting the live docs page over the (incomplete) machine-readable
// spec. The exact request/response shapes below are best-effort guesses;
// adjust once confirmed against a real call:
//   - createPortfolioEntry's body: sent empty, since the entry's actual
//     content is the PDF attached right after via uploadPortfolioPdf(). If
//     the backend actually requires fields here (title, etc.), this needs
//     to grow to accept them.
//   - PortfolioEntry's shape: only `id` is assumed (needed to make the
//     follow-up PDF call). Extend once the real response is seen.
//   - uploadPortfolioPdf's multipart field name: guessed as "file".

export interface PortfolioEntry {
  id: number;
}

export const createPortfolioEntry = () =>
  apiRequest<PortfolioEntry>("/engineers/portfolio", {
    method: "POST",
    body: JSON.stringify({}),
  });

export async function uploadPortfolioPdf(id: number | string, file: File): Promise<void> {
  const form = new FormData();
  form.append("file", file);
  await apiRequest(`/engineers/portfolio/${id}/pdf`, { method: "POST", body: form });
}
