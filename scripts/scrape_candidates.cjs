/**
 * Scrapes 2026 candidate data from kerala26.com for all 140 constituencies.
 * Uses Node.js built-in fetch (Node 18+) to get raw HTML, then parses
 * candidate info using regex on the rendered HTML.
 * 
 * If the site is server-side rendered (Next.js), the data may be in __NEXT_DATA__ JSON.
 */

const fs = require('fs');
const path = require('path');

const TOTAL = 140;
const BASE_URL = 'https://kerala26.com/constituency';
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'scraped_candidates.json');
const DELAY_MS = 500; // Polite delay between requests

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeConstituency(id) {
  const url = `${BASE_URL}/${id}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    
    if (!res.ok) {
      console.warn(`  ⚠ HTTP ${res.status} for constituency ${id}`);
      return { id, name: '', district: '', candidates: [], error: `HTTP ${res.status}` };
    }
    
    const html = await res.text();
    
    // Try to extract __NEXT_DATA__ (Next.js SSR data)
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const pageProps = nextData?.props?.pageProps;
        
        if (pageProps) {
          const constName = pageProps.constituency?.name || pageProps.name || '';
          const district = pageProps.constituency?.district || pageProps.district || '';
          
          // Extract candidates from pageProps
          const candidates = [];
          
          // Check various possible data structures
          if (pageProps.candidates2026 || pageProps.candidates) {
            const cands = pageProps.candidates2026 || pageProps.candidates;
            if (Array.isArray(cands)) {
              cands.forEach(c => {
                candidates.push({
                  name: c.name || c.candidateName || '',
                  party: c.party || c.partyName || '',
                  alliance: c.alliance || c.front || '',
                });
              });
            } else if (typeof cands === 'object') {
              // Object format: { LDF: { name, party }, UDF: { name, party }, ... }
              for (const [alliance, info] of Object.entries(cands)) {
                if (info && info.name) {
                  candidates.push({
                    name: info.name,
                    party: info.party || alliance,
                    alliance: alliance,
                  });
                }
              }
            }
          }

          // Also check constituency.candidates2026
          if (candidates.length === 0 && pageProps.constituency?.candidates2026) {
            const c2026 = pageProps.constituency.candidates2026;
            for (const [alliance, info] of Object.entries(c2026)) {
              if (info && typeof info === 'object' && info.name) {
                candidates.push({
                  name: info.name,
                  party: info.party || alliance,
                  alliance,
                });
              }
            }
          }

          // Deep search through all pageProps for candidate data
          if (candidates.length === 0) {
            const jsonStr = JSON.stringify(pageProps);
            // Try to find candidate patterns in any nested structure
            const candidatePattern = /"(?:name|candidateName)"\s*:\s*"([^"]+)"/g;
            let match;
            while ((match = candidatePattern.exec(jsonStr)) !== null) {
              // Check context around the match
            }
          }

          return { id, name: constName, district, candidates, source: 'nextdata' };
        }
      } catch (e) {
        console.warn(`  ⚠ Failed to parse __NEXT_DATA__ for ${id}: ${e.message}`);
      }
    }
    
    // Fallback: Parse raw HTML for candidate sections
    const candidates = [];
    
    // Pattern 1: Look for candidate name spans
    // <span class="text-sm font-semibold text-gray-900 truncate">CANDIDATE NAME</span>
    const namePattern = /class="[^"]*text-sm\s+font-semibold[^"]*"[^>]*>([^<]+)</g;
    let nameMatch;
    const names = [];
    while ((nameMatch = namePattern.exec(html)) !== null) {
      names.push(nameMatch[1].trim());
    }

    // Pattern 2: Alliance badges - LDF, UDF, NDA, OTH
    const alliancePattern = /class="[^"]*(?:rounded|badge)[^"]*"[^>]*>\s*(LDF|UDF|NDA|OTH)\s*</g;
    let allMatch;
    const alliances = [];
    while ((allMatch = alliancePattern.exec(html)) !== null) {
      alliances.push(allMatch[1]);
    }

    // Pattern 3: Extract from structured candidate sections
    // Look for patterns like: alliance badge followed by name and party
    const candidateBlockPattern = /(LDF|UDF|NDA|OTH)[\s\S]*?font-semibold[^>]*>([^<]+)<[\s\S]*?(?:party|logo)[\s\S]*?>([^<]*)</gi;
    let blockMatch;
    while ((blockMatch = candidateBlockPattern.exec(html)) !== null) {
      candidates.push({
        alliance: blockMatch[1],
        name: blockMatch[2].trim(),
        party: blockMatch[3].trim()
      });
    }

    // If no structured extraction, pair names with alliances
    if (candidates.length === 0 && names.length > 0) {
      for (let i = 0; i < Math.min(names.length, alliances.length); i++) {
        candidates.push({
          alliance: alliances[i] || 'Unknown',
          name: names[i],
          party: ''
        });
      }
    }

    // Extract constituency name from title  
    const titleMatch = html.match(/<title>([^<-]+)/);
    const constName = titleMatch ? titleMatch[1].trim() : '';

    return { id, name: constName, district: '', candidates, source: 'html' };
    
  } catch (err) {
    console.error(`  ✖ Error fetching constituency ${id}: ${err.message}`);
    return { id, name: '', district: '', candidates: [], error: err.message };
  }
}

async function main() {
  console.log(`🔍 Scraping 2026 candidate data from kerala26.com...`);
  console.log(`   Target: ${TOTAL} constituencies\n`);
  
  const results = [];
  
  for (let i = 1; i <= TOTAL; i++) {
    process.stdout.write(`  [${i}/${TOTAL}] Scraping constituency ${i}...`);
    const data = await scrapeConstituency(i);
    results.push(data);
    
    const candCount = data.candidates.length;
    const status = candCount > 0 ? `✅ ${candCount} candidates` : (data.error ? `⚠ ${data.error}` : '⚠ 0 candidates');
    console.log(` ${status} (${data.source || 'none'}) — ${data.name}`);
    
    if (i < TOTAL) await sleep(DELAY_MS);
  }
  
  // Save results
  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2), 'utf-8');
  
  // Stats
  const withCandidates = results.filter(r => r.candidates.length > 0).length;
  console.log(`\n📊 Summary:`);
  console.log(`   Total scraped: ${results.length}`);
  console.log(`   With candidates: ${withCandidates}`);
  console.log(`   Without candidates: ${results.length - withCandidates}`);
  console.log(`   Output: ${OUTPUT}`);
}

main().catch(console.error);
