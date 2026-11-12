// Website signups → Kit (kit.com).
// The secret Kit API key lives in Netlify (Site configuration → Environment variables → KIT_API_KEY),
// never in this repository.

const KIT = "https://api.kit.com/v4";
const FORM_ID = 10178666; // Kit form "Newsletter site"
const TAGS = {
  guide: 25746489,   // Guide: Digital Transformation
  blog: 25746490,    // Blog updates
  ar: 25746491,      // Lang: Arabic
  en: 25746492,      // Lang: English
  website: 25746493  // Source: Website
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const key = process.env.KIT_API_KEY;
  if (!key) return json({ error: "Missing KIT_API_KEY" }, 500);

  let data;
  try {
    const type = req.headers.get("content-type") || "";
    data = type.includes("application/json")
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  // Spam trap: real people never fill this hidden field.
  if (data.company) return json({ ok: true });

  const email = String(data.email || "").trim().toLowerCase();
  const name = String(data.name || "").trim().slice(0, 100);
  const list = data["form-name"] === "blog" ? "blog" : "guide";
  const lang = data.lang === "en" ? "en" : "ar";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Invalid email" }, 400);

  const kit = (path, body) =>
    fetch(KIT + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": key },
      body: JSON.stringify(body)
    });

  try {
    const sub = await kit("/subscribers", { email_address: email, first_name: name || undefined });
    if (!sub.ok) return json({ error: "Subscribe failed" }, 502);
    await kit(`/forms/${FORM_ID}/subscribers`, { email_address: email, referrer: req.headers.get("referer") || "" });
    await Promise.all(
      [TAGS[list], TAGS[lang], TAGS.website].map((id) => kit(`/tags/${id}/subscribers`, { email_address: email }))
    );
    return json({ ok: true });
  } catch {
    return json({ error: "Kit unreachable" }, 502);
  }
};

export const config = { path: "/api/subscribe" };
