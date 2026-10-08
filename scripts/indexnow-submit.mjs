#!/usr/bin/env node
// IndexNow: anunta Bing (sursa principala pentru cautarea din ChatGPT), Yandex, Seznam etc. ce adrese
// s-au schimbat pe site. Citeste sitemap-ul public (urmeaza indexurile de sitemap) si trimite adresele
// la https://api.indexnow.org/indexnow, in loturi de cel mult 10.000.
//
//   node scripts/indexnow-submit.mjs                 doar numara (nu trimite nimic)
//   node scripts/indexnow-submit.mjs --days 3        doar adresele cu <lastmod> din ultimele 3 zile
//   node scripts/indexnow-submit.mjs --send          trimite efectiv (verifica intai fisierul cheii pe site)
//   optiuni: --sitemap <url> (repetabil; implicit cele din robots.txt + /sitemap.xml), --max <n> (implicit 100000, 0 = fara limita)
//
// Cheia e publica prin definitie: aceeasi valoare e servita la SITE_URL/<cheie>.txt (fisierul din public/).
// Ruleaza-l doar DUPA ce deploy-ul cu fisierul cheii e live.

const SITE_URL = 'https://invitonline.ro';
export const INDEXNOW_KEY = 'df9777deb293d2c8f5d245d133e50472';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 10_000;
const UA = 'Mozilla/5.0 (compatible; indexnow-submit/1.0)';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const values = (name) => args.flatMap((a, i) => (a === name && args[i + 1] ? [args[i + 1]] : []));
const SEND = flag('--send');
const DAYS = values('--days').length ? Number(values('--days')[0]) : null;
const MAX = values('--max').length ? Number(values('--max')[0]) : 100_000;

const site = new URL(SITE_URL);
const keyLocation = `${site.origin}/${INDEXNOW_KEY}.txt`;

const decode = (s) => s.trim()
  .replace(/^<!\[CDATA\[|\]\]>$/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
const tag = (block, name) => {
  const m = block.match(new RegExp(`<(?:[a-z]+:)?${name}>([\\s\\S]*?)</(?:[a-z]+:)?${name}>`, 'i'));
  return m ? decode(m[1]) : null;
};

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

async function startSitemaps() {
  const given = values('--sitemap');
  if (given.length) return given;
  const list = new Set();
  try {
    const robots = await get(`${site.origin}/robots.txt`);
    for (const m of robots.matchAll(/^\s*sitemap:\s*(\S+)/gim)) list.add(m[1]);
  } catch (e) {
    console.warn(`robots.txt: ${e.message}`);
  }
  list.add(`${site.origin}/sitemap.xml`);
  return [...list];
}

// Adresele din toate sitemap-urile (indexurile sunt urmate), cu lastmod cand exista.
async function collect(roots) {
  const seen = new Set();
  const urls = new Map();
  const queue = [...roots];
  let files = 0;
  while (queue.length) {
    const batch = queue.splice(0, 4);
    await Promise.all(batch.map(async (sm) => {
      if (seen.has(sm)) return;
      seen.add(sm);
      let xml;
      try { xml = await get(sm); } catch (e) { console.warn(`sitemap omis: ${e.message}`); return; }
      files++;
      if (/<(?:[a-z]+:)?sitemapindex[\s>]/i.test(xml)) {
        for (const m of xml.matchAll(/<(?:[a-z]+:)?sitemap>([\s\S]*?)<\/(?:[a-z]+:)?sitemap>/gi)) {
          const loc = tag(m[1], 'loc');
          if (loc && !seen.has(loc)) queue.push(loc);
        }
        return;
      }
      for (const m of xml.matchAll(/<(?:[a-z]+:)?url>([\s\S]*?)<\/(?:[a-z]+:)?url>/gi)) {
        const loc = tag(m[1], 'loc');
        if (!loc) continue;
        const lastmod = tag(m[1], 'lastmod');
        const t = lastmod ? Date.parse(lastmod) : NaN;
        const prev = urls.get(loc);
        if (prev === undefined || (Number.isFinite(t) && !(prev >= t))) urls.set(loc, Number.isFinite(t) ? t : prev ?? null);
      }
    }));
  }
  return { urls, files };
}

async function main() {
  const roots = await startSitemaps();
  console.log(`Site: ${site.origin}  cheie: ${keyLocation}`);
  console.log(`Sitemap-uri de pornire: ${roots.join(', ')}`);
  const { urls, files } = await collect(roots);

  let list = [...urls.entries()];
  const total = list.length;
  const otherHost = list.filter(([u]) => { try { return new URL(u).host !== site.host; } catch { return true; } }).length;
  list = list.filter(([u]) => { try { return new URL(u).host === site.host; } catch { return false; } });
  let undated = 0;
  if (DAYS !== null) {
    const since = Date.now() - DAYS * 86_400_000;
    undated = list.filter(([, t]) => t === null).length;
    list = list.filter(([, t]) => t !== null && t >= since);
  }
  list.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)); // cele mai noi intai, daca se aplica limita
  if (MAX > 0 && list.length > MAX) list = list.slice(0, MAX);

  console.log(`Fisiere sitemap citite: ${files}; adrese gasite: ${total}`);
  if (otherHost) console.log(`Omise (alt host decat ${site.host}): ${otherHost}`);
  if (DAYS !== null) console.log(`Filtru --days ${DAYS}: raman ${list.length} (fara lastmod, omise: ${undated})`);
  console.log(`De trimis: ${list.length} adrese in ${Math.ceil(list.length / BATCH)} lot(uri)`);

  if (!SEND) {
    console.log('Dry-run: nu s-a trimis nimic. Adauga --send pentru trimitere.');
    return;
  }
  if (!list.length) return;

  const keyText = (await get(keyLocation).catch((e) => { throw new Error(`fisierul cheii nu e accesibil (${e.message}); faci deploy intai`); })).trim();
  if (keyText !== INDEXNOW_KEY) throw new Error(`${keyLocation} nu contine cheia asteptata; faci deploy intai`);

  for (let i = 0; i < list.length; i += BATCH) {
    const urlList = list.slice(i, i + BATCH).map(([u]) => u);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'User-Agent': UA },
      body: JSON.stringify({ host: site.host, key: INDEXNOW_KEY, keyLocation, urlList }),
    });
    const body = (await res.text()).slice(0, 300);
    console.log(`Lot ${i / BATCH + 1}: ${urlList.length} adrese -> HTTP ${res.status}${body ? ` ${body}` : ''}`);
    if (res.status >= 400) process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(`Eroare: ${e.message}`);
  process.exit(1);
});
