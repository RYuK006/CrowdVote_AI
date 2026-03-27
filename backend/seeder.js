/**
 * Database Seeder — populates 140 constituencies from CSV into MongoDB
 * Also creates default SystemConfig for the Campaign phase.
 * 
 * Usage:
 *   node seeder.js         — import data
 *   node seeder.js -d      — destroy all data
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Constituency = require('./src/models/Constituency');
const SystemConfig = require('./src/models/SystemConfig');

dotenv.config();

// --- CSV Parser (handles quoted fields with commas) ---
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

// --- Main ---
const importData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const csvPath = path.join(__dirname, '..', 'kerala_2026_and_2021_master_data.csv');
    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found at: ${csvPath}`);
      process.exit(1);
    }

    const raw = fs.readFileSync(csvPath, 'utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = raw.split('\n').filter(l => l.trim());
    const headers = parseCSVLine(lines[0]);
    const idx = {};
    headers.forEach((h, i) => { idx[h.trim()] = i; });

    console.log(`Parsing ${lines.length - 1} rows...`);

    const constituencies = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 10) continue;

      const constId = (cols[idx['Constituency_ID']] || '').trim();
      const name = (cols[idx['Constituency_Name']] || '').trim();
      if (!constId || !name) continue;

      const district = getDistrict(constId);

      // Build candidates array
      const candidates = [];
      const ldfName = (cols[idx['2026_LDF_Candidate']] || '').trim();
      const ldfParty = (cols[idx['2026_LDF_Party']] || '').trim();
      if (ldfName && ldfName !== 'N/A') {
        candidates.push({ alliance: 'LDF', name: ldfName, party: ldfParty || 'LDF' });
      }

      const udfName = (cols[idx['2026_UDF_Candidate']] || '').trim();
      const udfParty = (cols[idx['2026_UDF_Party']] || '').trim();
      if (udfName && udfName !== 'N/A') {
        candidates.push({ alliance: 'UDF', name: udfName, party: udfParty || 'UDF' });
      }

      const ndaName = (cols[idx['2026_NDA_Candidate']] || '').trim();
      const ndaParty = (cols[idx['2026_NDA_Party']] || '').trim();
      if (ndaName && ndaName !== 'N/A') {
        candidates.push({ alliance: 'NDA', name: ndaName, party: ndaParty || 'NDA' });
      }

      const othRaw = (cols[idx['2026_OTH_Candidates']] || '').trim();
      if (othRaw) {
        othRaw.split('|').map(s => s.trim()).filter(Boolean).forEach(entry => {
          const match = entry.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
          if (match) {
            candidates.push({ alliance: 'OTH', name: match[1].trim(), party: match[2].trim() });
          } else {
            candidates.push({ alliance: 'OTH', name: entry.trim(), party: 'Independent' });
          }
        });
      }

      // Image files
      const imagesRaw = (cols[idx['Local_Images']] || '').trim();
      const imageFiles = imagesRaw
        .split('|').map(s => s.trim()).filter(Boolean)
        .map(s => { const parts = s.replace(/\\/g, '/').split('/'); return parts[parts.length - 1]; });

      constituencies.push({
        constituencyId: constId,
        name,
        district,
        candidates,
        sourceUrl: (cols[idx['URL']] || '').trim(),
        imageFiles,
        historical2021: {
          winnerFront: (cols[idx['2021_Winner_Front']] || '').trim(),
          winnerName: (cols[idx['2021_Winner_Name']] || '').trim(),
          winnerTotalVotes: cleanNum(cols[idx['2021_Winner_TotalVotes']]),
          runnerUpName: (cols[idx['2021_RunnerUp_Name']] || '').trim(),
          runnerUpTotalVotes: cleanNum(cols[idx['2021_RunnerUp_TotalVotes']]),
          margin: cleanNum(cols[idx['2021_Margin']]),
          electors: cleanNum(cols[idx['2021_Electors']]),
          turnout: cleanFloat(cols[idx['2021_Turnout']]),
          nota: cleanNum(cols[idx['2021_NOTA']]),
          rejected: cleanNum(cols[idx['2021_Rejected']])
        }
      });
    }

    console.log(`Parsed ${constituencies.length} constituencies. Upserting...`);

    let inserted = 0, updated = 0;
    for (const item of constituencies) {
      const res = await Constituency.updateOne(
        { constituencyId: item.constituencyId },
        { $set: item },
        { upsert: true }
      );
      if (res.upsertedCount > 0) inserted++;
      else updated++;
    }

    // Create/update SystemConfig
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({
        currentPhase: 'Campaign',
        electionDate: new Date('2026-04-14'),
        predictionLocked: false,
        isMaintenanceMode: false
      });
      console.log('✅ Created default SystemConfig (Campaign phase, election: 2026-04-14)');
    }

    console.log('\n--- Seeding Summary ---');
    console.log(`Inserted: ${inserted}`);
    console.log(`Updated:  ${updated}`);
    console.log(`Total:    ${constituencies.length} constituencies`);
    console.log(`Phase:    ${config.currentPhase}`);
    console.log('------------------------\n');
    process.exit();
  } catch (error) {
    console.error(`Fatal Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Constituency.deleteMany();
    await SystemConfig.deleteMany();
    console.log('All data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
