/**
 * Parses kerala_2026_and_2021_master_data.csv into constituencies.json
 * Correctly handles quoted fields with commas inside.
 */
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'kerala_2026_and_2021_master_data.csv');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'constituencies.json');

const raw = fs.readFileSync(csvPath, 'utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function cleanNum(str) {
  if (!str) return 0;
  const n = parseInt(str.replace(/,/g, '').trim(), 10);
  return isNaN(n) ? 0 : n;
}

function cleanFloat(str) {
  if (!str) return 0;
  const n = parseFloat(str.replace(/,/g, '').trim());
  return isNaN(n) ? 0 : n;
}

const lines = raw.split('\n').filter(l => l.trim());
const headers = parseCSVLine(lines[0]);
const idx = {};
headers.forEach((h, i) => { idx[h.trim()] = i; });

// Log header mapping for debugging
console.log('Headers found:', headers.map(h => h.trim()).join(' | '));

// District mapping for all 140 constituencies
function getDistrict(id) {
  const n = parseInt(id, 10);
  if (n <= 4) return 'Kasaragod';
  if (n <= 16) return 'Kannur';
  if (n <= 19) return 'Wayanad';
  if (n <= 32) return 'Kozhikode';
  if (n <= 47) return 'Malappuram';
  if (n <= 60) return 'Palakkad';
  if (n <= 71) return 'Thrissur';
  if (n <= 87) return 'Ernakulam';
  if (n <= 92) return 'Idukki';
  if (n <= 101) return 'Kottayam';
  if (n <= 110) return 'Alappuzha';
  if (n <= 115) return 'Pathanamthitta';
  if (n <= 127) return 'Kollam';
  if (n <= 140) return 'Thiruvananthapuram';
  return 'Unknown';
}

const constituencies = [];

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  if (cols.length < 10) continue;

  const constId = (cols[idx['Constituency_ID']] || '').trim();
  const name = (cols[idx['Constituency_Name']] || '').trim();
  const district = getDistrict(constId);

  // 2026 Candidates
  const ldfName = (cols[idx['2026_LDF_Candidate']] || '').trim();
  const ldfParty = (cols[idx['2026_LDF_Party']] || '').trim();
  const udfName = (cols[idx['2026_UDF_Candidate']] || '').trim();
  const udfParty = (cols[idx['2026_UDF_Party']] || '').trim();
  const ndaName = (cols[idx['2026_NDA_Candidate']] || '').trim();
  const ndaParty = (cols[idx['2026_NDA_Party']] || '').trim();
  const othRaw = (cols[idx['2026_OTH_Candidates']] || '').trim();

  // 2021 Historical
  const winnerFront = (cols[idx['2021_Winner_Front']] || '').trim();
  const winnerName = (cols[idx['2021_Winner_Name']] || '').trim();
  const winnerVotes = cleanNum(cols[idx['2021_Winner_TotalVotes']]);
  const runnerUpName = (cols[idx['2021_RunnerUp_Name']] || '').trim();
  const runnerUpVotes = cleanNum(cols[idx['2021_RunnerUp_TotalVotes']]);
  const margin = cleanNum(cols[idx['2021_Margin']]);
  const electors = cleanNum(cols[idx['2021_Electors']]);
  const turnout = cleanFloat(cols[idx['2021_Turnout']]);
  const nota = cleanNum(cols[idx['2021_NOTA']]);

  // Local images
  const imagesRaw = (cols[idx['Local_Images']] || '').trim();
  const imageFiles = imagesRaw
    .split('|')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const parts = s.replace(/\\/g, '/').split('/');
      return parts[parts.length - 1];
    });

  // Find party logo from images
  function findPartyLogo(partyCode) {
    if (!partyCode) return null;
    const code = partyCode.toLowerCase()
      .replace(/\(|\)/g, '')  // Remove parentheses: CPI(M) -> cpim
      .replace(/\s/g, '');     // Remove spaces
    return imageFiles.find(f => {
      const lower = f.toLowerCase();
      const match = lower.match(/const\d+_([a-z0-9]+)\.(svg|png|jpg)$/);
      if (match && match[1] === code) return true;
      return false;
    }) || null;
  }

  // Build candidates array
  const candidates = [];

  if (ldfName && ldfName !== 'N/A') {
    candidates.push({
      alliance: 'LDF',
      name: ldfName,
      party: ldfParty !== 'N/A' ? ldfParty : 'LDF',
      partyLogo: findPartyLogo(ldfParty) || findPartyLogo('cpim') || findPartyLogo('cpi')
    });
  }

  if (udfName && udfName !== 'N/A') {
    candidates.push({
      alliance: 'UDF',
      name: udfName,
      party: udfParty !== 'N/A' ? udfParty : 'UDF',
      partyLogo: findPartyLogo(udfParty) || findPartyLogo('inc') || findPartyLogo('iuml')
    });
  }

  if (ndaName && ndaName !== 'N/A') {
    candidates.push({
      alliance: 'NDA',
      name: ndaName,
      party: ndaParty !== 'N/A' ? ndaParty : 'NDA',
      partyLogo: findPartyLogo(ndaParty) || findPartyLogo('bjp')
    });
  }

  // Parse OTH candidates: pipe-separated, format "Name (Party)"
  if (othRaw) {
    othRaw.split('|').map(s => s.trim()).filter(Boolean).forEach(entry => {
      const match = entry.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
      if (match) {
        candidates.push({
          alliance: 'OTH',
          name: match[1].trim(),
          party: match[2].trim(),
          partyLogo: null
        });
      } else {
        candidates.push({
          alliance: 'OTH',
          name: entry.trim(),
          party: 'Independent',
          partyLogo: null
        });
      }
    });
  }

  constituencies.push({
    constituencyId: constId,
    name,
    district,
    candidates,
    historical2021: {
      winnerFront,
      winnerName,
      winnerTotalVotes: winnerVotes,
      runnerUpName,
      runnerUpTotalVotes: runnerUpVotes,
      margin,
      electors,
      turnout,
      nota
    },
    imageFiles
  });
}

// Ensure output dir
const outDir = path.dirname(outputPath);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(constituencies, null, 2), 'utf-8');

// Stats
const withLDF = constituencies.filter(c => c.candidates.some(x => x.alliance === 'LDF')).length;
const withUDF = constituencies.filter(c => c.candidates.some(x => x.alliance === 'UDF')).length;
const withNDA = constituencies.filter(c => c.candidates.some(x => x.alliance === 'NDA')).length;
const withOTH = constituencies.filter(c => c.candidates.some(x => x.alliance === 'OTH')).length;

console.log(`\n✅ Generated ${constituencies.length} constituencies → ${outputPath}`);
console.log(`   LDF candidates: ${withLDF}/140`);
console.log(`   UDF candidates: ${withUDF}/140`);
console.log(`   NDA candidates: ${withNDA}/140`);
console.log(`   OTH candidates: ${withOTH}/140`);
console.log(`\nSample #1 (${constituencies[0]?.name}):`);
constituencies[0]?.candidates.forEach(c => console.log(`   ${c.alliance} | ${c.name} | ${c.party} | logo: ${c.partyLogo}`));
console.log(`\nSample #50 (${constituencies[49]?.name}):`);
constituencies[49]?.candidates.forEach(c => console.log(`   ${c.alliance} | ${c.name} | ${c.party} | logo: ${c.partyLogo}`));
