export type WebsiteSignals = {
  host: string;
  title: string;
  metaDescription: string;
  headings: string[];
  topTerms: string[];
  textLength: number;
};

const STOP = new Set([
  "about", "which", "their", "there", "where", "when", "your", "our", "the", "and", "for",
  "with", "that", "this", "from", "have", "has", "will", "you", "are", "was", "were", "can",
  "not", "but", "all", "out", "one", "into", "than", "then", "them", "they", "over", "under",
  "more", "most", "some", "such", "only", "also", "very", "just", "because", "while", "during",
  "between", "through", "after", "before", "above", "below", "each", "few", "both", "own",
  "same", "being", "doing", "done", "how", "why", "what", "who", "whom", "get", "new", "use",
]);

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, " ");

export async function extractWebsiteSignals(url: string): Promise<WebsiteSignals> {
  const empty: WebsiteSignals = {
    host: hostOf(url),
    title: "",
    metaDescription: "",
    headings: [],
    topTerms: [],
    textLength: 0,
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "YogaWriteCodeBot/0.1", Accept: "text/html" },
    });
    clearTimeout(timer);
    if (!res.ok) return empty;

    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>([\s\S]{0,300}?)<\/title>/i);
    const metaMatch =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{0,500}?)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']{0,500}?)["'][^>]+name=["']description["']/i);

    const headings: string[] = [];
    const headingRe = /<h[1-3][^>]*>([\s\S]{0,200}?)<\/h[1-3]>/gi;
    let m: RegExpExecArray | null;
    while ((m = headingRe.exec(html)) !== null && headings.length < 12) {
      const text = decode(stripTags(m[1]));
      if (text.length > 3) headings.push(text);
    }

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");

    const counts = new Map<string, number>();
    for (const word of text.toLowerCase().match(/[a-z][a-z-]{4,}/g) ?? []) {
      if (STOP.has(word)) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    const topTerms = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word);

    return {
      host: hostOf(url),
      title: titleMatch ? decode(stripTags(titleMatch[1])) : "",
      metaDescription: metaMatch ? decode(metaMatch[1]) : "",
      headings,
      topTerms,
      textLength: text.trim().length,
    };
  } catch {
    return empty;
  }
}

export async function fetchWebsiteText(url: string): Promise<string | null> {
  const s = await extractWebsiteSignals(url);
  return s.textLength > 0 ? `${s.title}. ${s.metaDescription}` : null;
}