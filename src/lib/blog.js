import { getCollection } from "astro:content";

// Published posts, newest first. Drafts are hidden unless SHOW_DRAFTS is set.
export async function getPosts() {
  const showDrafts = !!process.env.SHOW_DRAFTS;
  const posts = await getCollection("blog", ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(date, lang) {
  const locale = lang === "ar" ? "ar-u-nu-latn" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function readingMinutes(body, lang) {
  const words = (body || "").trim().split(/\s+/).filter(Boolean).length;
  const min = Math.max(1, Math.round(words / 200));
  if (lang !== "ar") return min + " min read";
  if (min === 1) return "دقيقة قراءة";
  if (min === 2) return "دقيقتا قراءة";
  return min + (min <= 10 ? " دقائق قراءة" : " دقيقة قراءة");
}

// Cover paths are saved by the editor as "/assets/img/blog/x.jpg".
// Make them relative so the site also works from a subfolder or a preview.
export function coverUrl(cover, root) {
  if (/^https?:/.test(cover)) return cover;
  return root + cover.replace(/^\//, "");
}
