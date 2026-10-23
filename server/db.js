import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistent file storage directory
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
const dataFilePath = path.join(dataDir, 'visits.json');
const siteVisitsFilePath = path.join(dataDir, 'site_visits.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Relative date helper
function getRelativeDateStr(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const AVAILABLE_PROPERTIES = [
  {
    id: "park-solitaire",
    name: "Park Solitaire",
    shortName: "Park Solitaire",
    category: "Residential",
    tagline: "Signature Luxury Residences",
    location: "Andheri West, Mumbai",
    accentColor: "#c29135"
  },
  {
    id: "veena-developer",
    name: "Veena Developer Pvt LTD",
    shortName: "VDPL",
    category: "Commercial & Mixed Use",
    tagline: "Premium Residential & Commercial Spaces",
    location: "Mumbai",
    accentColor: "#059669"
  },
  {
    id: "luxury-empire",
    name: "Luxury Empire",
    shortName: "Luxury Empire",
    category: "Ultra-Luxury",
    tagline: "Sky Penthouses & Signature Estates",
    location: "Worli, Mumbai",
    accentColor: "#d97706"
  },
  {
    id: "other",
    name: "Other",
    shortName: "Other",
    category: "Other Properties",
    tagline: "Custom & Partner Real Estate Projects",
    location: "Pan India",
    accentColor: "#6366f1"
  }
];

export function generateSeedSiteVisits() {
  return [
    {
      id: 1,
      clientName: "Vikram Malhotra",
      phone: "+91 98200 98200",
      propertyName: "Park Solitaire",
      visitDate: getRelativeDateStr(0),
      visitTime: "11:00 AM",
      salesperson: "Rohan Deshmukh",
      status: "Confirmed",
      feedback: "Interested in 3BHK higher floor east-facing. Loan eligibility calculation underway.",
      nextFollowUpDate: getRelativeDateStr(-2),
      notes: "Arriving with family; arrange sample flat walkthrough on 14th floor."
    },
    {
      id: 2,
      clientName: "Rajesh Singhania",
      phone: "+91 98223 34455",
      propertyName: "VDPL",
      visitDate: getRelativeDateStr(0),
      visitTime: "02:30 PM",
      salesperson: "Pooja Sharma",
      status: "Scheduled",
      feedback: "",
      nextFollowUpDate: getRelativeDateStr(-1),
      notes: "Front-facing retail shop inspection. Client has pre-approved commercial loan."
    },
    {
      id: 3,
      clientName: "Meera Kapoor",
      phone: "+91 98334 55667",
      propertyName: "Luxury Empire",
      visitDate: getRelativeDateStr(0),
      visitTime: "04:30 PM",
      salesperson: "Aditya Mehta",
      status: "Confirmed",
      feedback: "Impressed by private elevator lobby and duplex layout.",
      nextFollowUpDate: getRelativeDateStr(-3),
      notes: "VIP client; prepare detailed penthouse specification brochure."
    },
    {
      id: 4,
      clientName: "Sunita Joshi",
      phone: "+91 97665 43210",
      propertyName: "Park Solitaire",
      visitDate: getRelativeDateStr(-1),
      visitTime: "10:30 AM",
      salesperson: "Rohan Deshmukh",
      status: "Scheduled",
      feedback: "",
      nextFollowUpDate: getRelativeDateStr(-4),
      notes: "Looking for 2BHK Jodi apartment for senior citizen parents."
    },
    {
      id: 5,
      clientName: "Amit Patel",
      phone: "+91 99887 66554",
      propertyName: "VDPL",
      visitDate: getRelativeDateStr(-1),
      visitTime: "03:00 PM",
      salesperson: "Vikram Deshmukh",
      status: "Rescheduled",
      feedback: "Rescheduled from Monday due to business travel.",
      nextFollowUpDate: getRelativeDateStr(-3),
      notes: "40-seat commercial office floorplate discussion."
    },
    {
      id: 6,
      clientName: "Dr. Sanjay Verma",
      phone: "+91 98112 23344",
      propertyName: "Luxury Empire",
      visitDate: getRelativeDateStr(1),
      visitTime: "05:00 PM",
      salesperson: "Aditya Mehta",
      status: "Completed",
      feedback: "Loved the double-height ceiling and duplex terrace. Requested payment milestone plan.",
      nextFollowUpDate: getRelativeDateStr(-2),
      notes: "Met with lead architect; discussion on customized interior finishes."
    },
    {
      id: 7,
      clientName: "Ananya Rao",
      phone: "+91 91234 56789",
      propertyName: "Park Solitaire",
      visitDate: getRelativeDateStr(2),
      visitTime: "11:30 AM",
      salesperson: "Pooja Sharma",
      status: "Completed",
      feedback: "Token advance discussion ongoing for 2BHK Jodi apartment 1102. Bank NOC pending.",
      nextFollowUpDate: getRelativeDateStr(0),
      notes: "Client requested follow-up today regarding stamp duty discount approval."
    },
    {
      id: 8,
      clientName: "Harish Mehta",
      phone: "+91 94444 55667",
      propertyName: "VDPL",
      visitDate: getRelativeDateStr(3),
      visitTime: "01:00 PM",
      salesperson: "Vikram Deshmukh",
      status: "Completed",
      feedback: "Corner retail shop finalized. Cheque collected; KYC documents under review.",
      nextFollowUpDate: getRelativeDateStr(0),
      notes: "Follow up today on allotment letter issuance."
    },
    {
      id: 9,
      clientName: "Ritu Sengupta",
      phone: "+91 90011 22334",
      propertyName: "Park Solitaire",
      visitDate: getRelativeDateStr(1),
      visitTime: "03:30 PM",
      salesperson: "Rohan Deshmukh",
      status: "No-show",
      feedback: "Client had urgent medical emergency; requested call back to reschedule.",
      nextFollowUpDate: getRelativeDateStr(0),
      notes: "Follow up today to reschedule for this weekend."
    },
    {
      id: 10,
      clientName: "Karan Johar",
      phone: "+91 96666 11223",
      propertyName: "Luxury Empire",
      visitDate: getRelativeDateStr(-2),
      visitTime: "04:00 PM",
      salesperson: "Aditya Mehta",
      status: "Scheduled",
      feedback: "",
      nextFollowUpDate: getRelativeDateStr(-5),
      notes: "Sky penthouse walkthrough with structural consultant."
    }
  ];
}

// Default seed visits across properties
export function generateSeedVisits() {
  return [
    {id:1,name:"Rahul Sharma",date:getRelativeDateStr(0),phone:"+91 98765 43210",mail:"rahul.s@email.com",address:"Andheri West, Mumbai",profession:"Business",interest:"2BHK",aspiration:"Personal Use",budget:"45 Lakh",source:"Walk-in",status:"Visited",visitsCount:1,propertyName:"Park Solitaire",remarks:"Client showed keen interest in east-facing 2BHK on higher floor. Loan eligibility check underway."},
    {id:2,name:"Priya Patel",date:getRelativeDateStr(0),phone:"+91 87654 32109",mail:"priya.p@email.com",address:"Bandra East, Mumbai",profession:"Doctor",interest:"3BHK",aspiration:"Investment",budget:"1.2 Cr",source:"Website",status:"FollowUp",followUpDate:getRelativeDateStr(0),visitsCount:2,propertyName:"Park Solitaire",remarks:"Requested detailed rental yield analysis and construction milestone schedule. Follow-up call on Tuesday."},
    {id:3,name:"Amit Verma",date:getRelativeDateStr(1),phone:"+91 99887 66554",mail:"amit.v@email.com",address:"Thane West",profession:"Service",interest:"SHOP",aspiration:"Investment",budget:"75 Lakh",source:"Website",status:"Revisited",revisitDate:getRelativeDateStr(0),visitsCount:1,propertyName:"Veena Developer Pvt LTD",remarks:"Revisited the ground floor retail arcade with his business partner. Discussing corner shop options."},
    {id:4,name:"Sneha Reddy",date:getRelativeDateStr(1),phone:"+91 91234 56789",mail:"sneha.r@email.com",address:"Powai, Mumbai",profession:"Teacher",interest:"2BHK JODI",aspiration:"Personal Use",budget:"90 Lakh",source:"Director Reference",status:"Booked",visitsCount:1,propertyName:"Park Solitaire",remarks:"Booking token received. Unit 1204 reserved; KYC documents collected for agreement draft."},
    {id:5,name:"Vikram Singh",date:getRelativeDateStr(1),phone:"+91 98123 45678",mail:"vikram.s@email.com",address:"Lower Parel",profession:"Business",interest:"OFFICE",aspiration:"Investment",budget:"1.5 Cr",source:"Outdoor Banner",status:"FollowUp",visitsCount:3,propertyName:"Veena Developer Pvt LTD",remarks:"Examining floor layout options for 40-seat commercial office. Second meeting with legal advisor set."},
    {id:6,name:"Ananya Joshi",date:getRelativeDateStr(2),phone:"+91 90011 22334",mail:"ananya.j@email.com",address:"Malad West",profession:"CA",interest:"1BHK",aspiration:"Personal Use",budget:"35 Lakh",source:"Pamphlet",status:"Visited",visitsCount:1,propertyName:"Park Solitaire",remarks:"First visit completed. Appreciated modern amenities and road connectivity. Discussing budget with family."},
    {id:7,name:"Rohan Mehta",date:getRelativeDateStr(3),phone:"+91 95555 11223",mail:"rohan.m@email.com",address:"Navi Mumbai",profession:"Engineer",interest:"2BHK",aspiration:"Personal Use",budget:"55 Lakh",source:"Website",status:"Revisited",visitsCount:2,propertyName:"Park Solitaire",remarks:"Second walkthrough completed. Very satisfied with clubhouse design and podium parking layout."},
    {id:8,name:"Kavita Nair",date:getRelativeDateStr(4),phone:"+91 94444 77889",mail:"kavita.n@email.com",address:"Goregaon East",profession:"Homemaker",interest:"3BHK",aspiration:"Personal Use",budget:"1.1 Cr",source:"Existing Customer",status:"Closed",visitsCount:1,propertyName:"Park Solitaire",remarks:"Registration completed at sub-registrar office. Welcome kit delivered to client."},
    {id:9,name:"Suresh Kumar",date:getRelativeDateStr(5),phone:"+91 93333 44556",mail:"suresh.k@email.com",address:"Vashi, Navi Mumbai",profession:"Business",interest:"JODI SHOPS",aspiration:"Investment",budget:"2 Cr",source:"Channel Partner",status:"Visited",visitsCount:1,propertyName:"Veena Developer Pvt LTD",remarks:"Inquired about multi-brand retail possibilities on frontage area. Proposal sent via email."},
    {id:10,name:"Meera Iyer",date:getRelativeDateStr(6),phone:"+91 96666 55443",mail:"meera.i@email.com",address:"Worli, Mumbai",profession:"Lawyer",interest:"3BHK",aspiration:"Investment",budget:"1.8 Cr",source:"Director Reference",status:"FollowUp",visitsCount:1,propertyName:"Luxury Empire",remarks:"Reviewed luxury specifications. Waiting for customized flexi-payment scheme approval."},
    {id:11,name:"Arjun Kapoor",date:getRelativeDateStr(7),phone:"+91 98888 12345",mail:"arjun.k@email.com",address:"Juhu, Mumbai",profession:"Architect",interest:"2BHK",aspiration:"Personal Use",budget:"85 Lakh",source:"Walk-in",status:"Visited",visitsCount:1,propertyName:"Park Solitaire",remarks:"Studied architectural floor plans. Interested in high ceiling height on tower 2."},
    {id:12,name:"Deepa Shah",date:getRelativeDateStr(8),phone:"+91 97777 98765",mail:"deepa.s@email.com",address:"Borivali West",profession:"Consultant",interest:"1BHK",aspiration:"Personal Use",budget:"42 Lakh",source:"Website",status:"Visited",visitsCount:1,propertyName:"Luxury Empire",remarks:"Looking for ready-to-move or near-possession timeline. Follow up in two days."},
    {id:13,name:"Karan Johar",date:getRelativeDateStr(9),phone:"+91 96666 11223",mail:"karan.j@email.com",address:"Bandra West",profession:"Producer",interest:"OFFICE",aspiration:"Investment",budget:"3.5 Cr",source:"Channel Partner",status:"FollowUp",visitsCount:2,propertyName:"Luxury Empire",remarks:"Requested penthouse office availability with private elevator access."},
    {id:14,name:"Neha Sharma",date:getRelativeDateStr(10),phone:"+91 95555 33445",mail:"neha.s@email.com",address:"Kandivali East",profession:"Dentist",interest:"2BHK",aspiration:"Personal Use",budget:"60 Lakh",source:"Walk-in",status:"Revisited",visitsCount:1,propertyName:"Luxury Empire",remarks:"Revisited sample flat with parents. Finalizing unit preference between floor 8 and 14."},
    {id:15,name:"Rajesh Khanna",date:getRelativeDateStr(11),phone:"+91 94444 55667",mail:"rajesh.k@email.com",address:"Dadar West",profession:"Business",interest:"SHOP",aspiration:"Investment",budget:"1.6 Cr",source:"Social Media Ad",status:"Booked",visitsCount:1,propertyName:"Veena Developer Pvt LTD",remarks:"Commercial shop 03 booked. Cheque cleared; allotment letter handed over."},
    {id:16,name:"Sunita Rao",date:getRelativeDateStr(12),phone:"+91 93333 77889",mail:"sunita.r@email.com",address:"Chembur East",profession:"Professor",interest:"2BHK JODI",aspiration:"Personal Use",budget:"95 Lakh",source:"Existing Customer",status:"Visited",visitsCount:1,propertyName:"Park Solitaire",remarks:"Looking for contiguous jodi apartments. Requested combined floor layout diagram."},
    {id:17,name:"Manish Malhotra",date:getRelativeDateStr(13),phone:"+91 92222 99001",mail:"manish.m@email.com",address:"Colaba, Mumbai",profession:"Designer",interest:"OFFICE",aspiration:"Personal Use",budget:"2.2 Cr",source:"Director Reference",status:"FollowUp",visitsCount:2,propertyName:"Veena Developer Pvt LTD",remarks:"Studio office design alignment discussion in progress with project architect."},
    {id:18,name:"Pooja Hegde",date:getRelativeDateStr(14),phone:"+91 91111 22334",mail:"pooja.h@email.com",address:"Santacruz West",profession:"Media",interest:"3BHK",aspiration:"Personal Use",budget:"1.4 Cr",source:"Outdoor Banner",status:"Closed",visitsCount:1,propertyName:"Other",remarks:"Sale deed executed and keys handed over. Very happy with sales team assistance."}
  ];
}

// PostgreSQL Connection Pool (used if DATABASE_URL is set on Railway)
let pool = null;
const isPostgres = Boolean(process.env.DATABASE_URL);

if (isPostgres) {
  const connectionString = process.env.DATABASE_URL;
  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  });
}

function mapRowToVisit(r) {
  return {
    id: Number(r.id),
    name: r.name,
    date: r.date,
    phone: r.phone,
    mail: r.mail || '',
    address: r.address || '',
    profession: r.profession || '—',
    interest: r.interest || '2BHK',
    aspiration: r.aspiration || 'Personal Use',
    budget: r.budget || '—',
    source: r.source || 'Walk-in',
    status: r.status || 'Visited',
    visitsCount: Number(r.visits_count || 1),
    remarks: r.remarks || '',
    followUpDate: r.follow_up_date || undefined,
    revisitDate: r.revisit_date || undefined,
    followUpCompleted: Boolean(r.follow_up_completed),
    revisitCompleted: Boolean(r.revisit_completed),
    cp: r.cp || '',
    remarksHistory: Array.isArray(r.remarks_history)
      ? r.remarks_history
      : (typeof r.remarks_history === 'string' ? JSON.parse(r.remarks_history) : []),
    propertyName: r.property_name || 'Park Solitaire',
    createdAt: r.created_at || undefined,
    updatedAt: r.updated_at || undefined
  };
}

function mapRowToSiteVisit(r) {
  return {
    id: Number(r.id),
    clientName: r.client_name,
    phone: r.phone,
    propertyName: r.property_name || 'Park Solitaire',
    visitDate: r.visit_date,
    visitTime: r.visit_time || '',
    salesperson: r.salesperson || '',
    status: r.status || 'Scheduled',
    feedback: r.feedback || '',
    nextFollowUpDate: r.next_follow_up_date || undefined,
    notes: r.notes || '',
    createdAt: r.created_at || undefined,
    updatedAt: r.updated_at || undefined
  };
}

// Initialize Database (Schema & Seeds)
export async function initDb() {
  if (isPostgres) {
    console.log('🐘 Connecting to Railway PostgreSQL Database...');
    const client = await pool.connect();
    try {
      // Create visits table
      await client.query(`
        CREATE TABLE IF NOT EXISTS visits (
          id BIGINT PRIMARY KEY,
          name TEXT NOT NULL,
          date TEXT NOT NULL,
          phone TEXT NOT NULL,
          mail TEXT DEFAULT '',
          address TEXT DEFAULT '',
          profession TEXT DEFAULT '—',
          interest TEXT DEFAULT '2BHK',
          aspiration TEXT DEFAULT 'Personal Use',
          budget TEXT DEFAULT '—',
          source TEXT DEFAULT 'Walk-in',
          status TEXT DEFAULT 'Visited',
          visits_count INTEGER DEFAULT 1,
          remarks TEXT DEFAULT '',
          follow_up_date TEXT DEFAULT NULL,
          revisit_date TEXT DEFAULT NULL,
          follow_up_completed BOOLEAN DEFAULT FALSE,
          revisit_completed BOOLEAN DEFAULT FALSE,
          cp TEXT DEFAULT '',
          remarks_history JSONB DEFAULT '[]'::jsonb,
          property_name TEXT DEFAULT 'Park Solitaire',
          created_at TEXT DEFAULT NULL,
          updated_at TEXT DEFAULT NULL
        );
      `);

      // Ensure property_name column exists for previously existing databases
      await client.query(`
        ALTER TABLE visits ADD COLUMN IF NOT EXISTS property_name TEXT DEFAULT 'Park Solitaire';
      `);

      // Create site_visits table
      await client.query(`
        CREATE TABLE IF NOT EXISTS site_visits (
          id BIGINT PRIMARY KEY,
          client_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          property_name TEXT DEFAULT 'Park Solitaire',
          visit_date TEXT NOT NULL,
          visit_time TEXT DEFAULT '',
          salesperson TEXT DEFAULT '',
          status TEXT DEFAULT 'Scheduled',
          feedback TEXT DEFAULT '',
          next_follow_up_date TEXT DEFAULT NULL,
          notes TEXT DEFAULT '',
          created_at TEXT DEFAULT NULL,
          updated_at TEXT DEFAULT NULL
        );
      `);

      // Ensure property_name column exists for previously existing databases
      await client.query(`
        ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS property_name TEXT DEFAULT 'Park Solitaire';
      `);

      // Check if visits seeded
      const countRes = await client.query('SELECT COUNT(*) AS total FROM visits;');
      const total = Number(countRes.rows[0].total);

      if (total === 0) {
        let seeds = [];
        if (fs.existsSync(dataFilePath)) {
          try {
            const raw = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
            if (Array.isArray(raw) && raw.length > 0) seeds = raw;
          } catch {}
        }
        if (seeds.length === 0) {
          seeds = generateSeedVisits();
        }
        console.log(`🌱 Seeding initial ${seeds.length} clients across properties into Railway PostgreSQL...`);
        for (const s of seeds) {
          await client.query(`
            INSERT INTO visits (
              id, name, date, phone, mail, address, profession, interest,
              aspiration, budget, source, status, visits_count, remarks,
              follow_up_date, revisit_date, cp, remarks_history, property_name, created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
              $15, $16, $17, $18, $19, $20, $21
            );
          `, [
            s.id, s.name, s.date, s.phone, s.mail || '', s.address || '', s.profession || '—',
            s.interest || '2BHK', s.aspiration || 'Personal Use', s.budget || '—',
            s.source || 'Walk-in', s.status || 'Visited', s.visitsCount || 1, s.remarks || '',
            s.followUpDate || null, s.revisitDate || null, s.cp || '',
            JSON.stringify(s.remarksHistory || []),
            s.propertyName || 'Park Solitaire',
            s.createdAt || new Date().toISOString(), s.updatedAt || new Date().toISOString()
          ]);
        }
        console.log('✅ Railway PostgreSQL seeded visits successfully!');
      } else {
        console.log(`✅ Railway PostgreSQL connected with ${total} visits.`);
      }

      // Check if site_visits seeded
      const siteCountRes = await client.query('SELECT COUNT(*) AS total FROM site_visits;');
      const siteTotal = Number(siteCountRes.rows[0].total);

      if (siteTotal === 0) {
        let siteSeeds = [];
        if (fs.existsSync(siteVisitsFilePath)) {
          try {
            const raw = JSON.parse(fs.readFileSync(siteVisitsFilePath, 'utf8'));
            if (Array.isArray(raw) && raw.length > 0) siteSeeds = raw;
          } catch {}
        }
        if (siteSeeds.length === 0) {
          siteSeeds = generateSeedSiteVisits();
        }
        console.log(`🌱 Seeding initial ${siteSeeds.length} site visits into Railway PostgreSQL...`);
        for (const s of siteSeeds) {
          await client.query(`
            INSERT INTO site_visits (
              id, client_name, phone, property_name, visit_date, visit_time,
              salesperson, status, feedback, next_follow_up_date, notes,
              created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            );
          `, [
            s.id, s.clientName, s.phone, s.propertyName || 'Park Solitaire',
            s.visitDate, s.visitTime || '', s.salesperson || '', s.status || 'Scheduled',
            s.feedback || '', s.nextFollowUpDate || null, s.notes || '',
            s.createdAt || new Date().toISOString(), s.updatedAt || new Date().toISOString()
          ]);
        }
        console.log('✅ Railway PostgreSQL seeded site visits successfully!');
      } else {
        console.log(`✅ Railway PostgreSQL connected with ${siteTotal} site visits.`);
      }
    } finally {
      client.release();
    }
  } else {
    // Local File Storage initialization
    console.log(`📁 Using Local File Database: ${dataFilePath}`);
    if (!fs.existsSync(dataFilePath)) {
      const seeds = generateSeedVisits();
      fs.writeFileSync(dataFilePath, JSON.stringify(seeds, null, 2), 'utf8');
    }
    if (!fs.existsSync(siteVisitsFilePath)) {
      const siteSeeds = generateSeedSiteVisits();
      fs.writeFileSync(siteVisitsFilePath, JSON.stringify(siteSeeds, null, 2), 'utf8');
    }
  }
}

// 1. Fetch All Visits
export async function getAllVisits() {
  if (isPostgres) {
    const res = await pool.query('SELECT * FROM visits ORDER BY id DESC;');
    return res.rows.map(mapRowToVisit);
  } else {
    try {
      const seeds = generateSeedVisits();
      if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify(seeds, null, 2), 'utf8');
        return seeds;
      }
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return seeds;
      }
      // Ensure seed visits retain current relative dates
      return parsed.map(v => {
        if (v.id >= 1 && v.id <= 18) {
          const seed = seeds.find(s => s.id === v.id);
          if (seed) {
            return {
              ...v,
              date: seed.date,
              followUpDate: seed.followUpDate || v.followUpDate,
              revisitDate: seed.revisitDate || v.revisitDate,
              propertyName: seed.propertyName || v.propertyName || 'Park Solitaire'
            };
          }
        }
        return {
          ...v,
          propertyName: v.propertyName || 'Park Solitaire'
        };
      });
    } catch {
      return generateSeedVisits();
    }
  }
}

// 2. Fetch Single Visit by ID
export async function getVisitById(id) {
  if (isPostgres) {
    const res = await pool.query('SELECT * FROM visits WHERE id = $1;', [Number(id)]);
    return res.rows.length > 0 ? mapRowToVisit(res.rows[0]) : null;
  } else {
    const all = await getAllVisits();
    return all.find(v => v.id === Number(id)) || null;
  }
}

// 3. Create New Visit
export async function createVisit(visitData) {
  if (isPostgres) {
    const r = {
      id: Number(visitData.id) || Date.now(),
      name: visitData.name,
      date: visitData.date,
      phone: visitData.phone,
      mail: visitData.mail || visitData.email || '',
      address: visitData.address || '',
      profession: visitData.profession || '—',
      interest: visitData.interest || visitData.property || '2BHK',
      aspiration: visitData.aspiration || 'Personal Use',
      budget: visitData.budget || '—',
      source: Array.isArray(visitData.source) ? visitData.source.join(', ') : (visitData.source || 'Walk-in'),
      status: visitData.status || 'Visited',
      visits_count: Number(visitData.visitsCount || 1),
      remarks: visitData.remarks || '',
      follow_up_date: visitData.followUpDate || null,
      revisit_date: visitData.revisitDate || null,
      follow_up_completed: Boolean(visitData.followUpCompleted),
      revisit_completed: Boolean(visitData.revisitCompleted),
      cp: visitData.cp || '',
      remarks_history: JSON.stringify(visitData.remarksHistory || []),
      property_name: visitData.propertyName || 'Park Solitaire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const query = `
      INSERT INTO visits (
        id, name, date, phone, mail, address, profession, interest,
        aspiration, budget, source, status, visits_count, remarks,
        follow_up_date, revisit_date, follow_up_completed, revisit_completed,
        cp, remarks_history, property_name, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23
      ) RETURNING *;
    `;

    const res = await pool.query(query, [
      r.id, r.name, r.date, r.phone, r.mail, r.address, r.profession, r.interest,
      r.aspiration, r.budget, r.source, r.status, r.visits_count, r.remarks,
      r.follow_up_date, r.revisit_date, r.follow_up_completed, r.revisit_completed,
      r.cp, r.remarks_history, r.property_name, r.created_at, r.updated_at
    ]);

    return mapRowToVisit(res.rows[0]);
  } else {
    const visits = await getAllVisits();
    const newEntry = {
      ...visitData,
      propertyName: visitData.propertyName || 'Park Solitaire'
    };
    visits.unshift(newEntry);
    const tempFile = `${dataFilePath}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(visits, null, 2), 'utf8');
    fs.renameSync(tempFile, dataFilePath);
    return newEntry;
  }
}

// 4. Update Visit
export async function updateVisit(id, updates) {
  if (isPostgres) {
    const existing = await getVisitById(id);
    if (!existing) return null;

    const merged = { ...existing, ...updates, id: Number(id), updatedAt: new Date().toISOString() };

    const query = `
      UPDATE visits SET
        name = $1, date = $2, phone = $3, mail = $4, address = $5,
        profession = $6, interest = $7, aspiration = $8, budget = $9,
        source = $10, status = $11, visits_count = $12, remarks = $13,
        follow_up_date = $14, revisit_date = $15, follow_up_completed = $16,
        revisit_completed = $17, cp = $18, remarks_history = $19,
        property_name = $20, updated_at = $21
      WHERE id = $22
      RETURNING *;
    `;

    const res = await pool.query(query, [
      merged.name, merged.date, merged.phone, merged.mail || '', merged.address || '',
      merged.profession || '—', merged.interest || '2BHK', merged.aspiration || 'Personal Use',
      merged.budget || '—', merged.source || 'Walk-in', merged.status || 'Visited',
      Number(merged.visitsCount || 1), merged.remarks || '',
      merged.followUpDate || null, merged.revisitDate || null,
      Boolean(merged.followUpCompleted), Boolean(merged.revisitCompleted),
      merged.cp || '', JSON.stringify(merged.remarksHistory || []),
      merged.propertyName || existing.propertyName || 'Park Solitaire',
      merged.updatedAt, Number(id)
    ]);

    return mapRowToVisit(res.rows[0]);
  } else {
    const visits = await getAllVisits();
    const index = visits.findIndex(v => v.id === Number(id));
    if (index === -1) return null;

    const updated = { ...visits[index], ...updates, id: Number(id), updatedAt: new Date().toISOString() };
    visits[index] = updated;

    const tempFile = `${dataFilePath}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(visits, null, 2), 'utf8');
    fs.renameSync(tempFile, dataFilePath);
    return updated;
  }
}

// 5. Delete Visit
export async function deleteVisit(id) {
  if (isPostgres) {
    const res = await pool.query('DELETE FROM visits WHERE id = $1 RETURNING id;', [Number(id)]);
    return res.rows.length > 0;
  } else {
    const visits = await getAllVisits();
    const filtered = visits.filter(v => v.id !== Number(id));
    if (filtered.length === visits.length) return false;

    const tempFile = `${dataFilePath}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(filtered, null, 2), 'utf8');
    fs.renameSync(tempFile, dataFilePath);
    return true;
  }
}

// Database Info for Health Check
export function getDbInfo() {
  return {
    type: isPostgres ? 'postgresql' : 'file',
    storage: isPostgres ? 'Railway PostgreSQL' : dataFilePath
  };
}

// ==========================================
// SITE VISITS CRUD OPERATIONS
// ==========================================

export async function getAllSiteVisits() {
  if (isPostgres) {
    const res = await pool.query('SELECT * FROM site_visits ORDER BY id DESC;');
    return res.rows.map(mapRowToSiteVisit);
  } else {
    try {
      const seeds = generateSeedSiteVisits();
      if (!fs.existsSync(siteVisitsFilePath)) {
        fs.writeFileSync(siteVisitsFilePath, JSON.stringify(seeds, null, 2), 'utf8');
        return seeds;
      }
      const data = fs.readFileSync(siteVisitsFilePath, 'utf8');
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return seeds;
      }
      return parsed.map(v => {
        if (v.id >= 1 && v.id <= 10) {
          const seed = seeds.find(s => s.id === v.id);
          if (seed) {
            return {
              ...v,
              visitDate: seed.visitDate,
              nextFollowUpDate: seed.nextFollowUpDate || v.nextFollowUpDate
            };
          }
        }
        return v;
      });
    } catch {
      return generateSeedSiteVisits();
    }
  }
}

export async function getSiteVisitById(id) {
  if (isPostgres) {
    const res = await pool.query('SELECT * FROM site_visits WHERE id = $1;', [Number(id)]);
    return res.rows.length > 0 ? mapRowToSiteVisit(res.rows[0]) : null;
  } else {
    const list = await getAllSiteVisits();
    return list.find(v => v.id === Number(id)) || null;
  }
}

export async function createSiteVisit(data) {
  if (isPostgres) {
    const id = Number(data.id) || Date.now();
    const res = await pool.query(`
      INSERT INTO site_visits (
        id, client_name, phone, property_name, visit_date, visit_time,
        salesperson, status, feedback, next_follow_up_date, notes,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `, [
      id,
      data.clientName,
      data.phone,
      data.propertyName || 'Park Solitaire',
      data.visitDate,
      data.visitTime || '',
      data.salesperson || '',
      data.status || 'Scheduled',
      data.feedback || '',
      data.nextFollowUpDate || null,
      data.notes || '',
      new Date().toISOString(),
      new Date().toISOString()
    ]);
    return mapRowToSiteVisit(res.rows[0]);
  } else {
    const list = await getAllSiteVisits();
    const newVisit = {
      ...data,
      id: Number(data.id) || Date.now(),
      propertyName: data.propertyName || 'Park Solitaire',
      status: data.status || 'Scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newVisit);
    const tempFile = `${siteVisitsFilePath}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), 'utf8');
    fs.renameSync(tempFile, siteVisitsFilePath);
    return newVisit;
  }
}

export async function updateSiteVisit(id, updates) {
  if (isPostgres) {
    const existing = await getSiteVisitById(id);
    if (!existing) return null;
    const merged = { ...existing, ...updates, id: Number(id), updatedAt: new Date().toISOString() };
    const res = await pool.query(`
      UPDATE site_visits SET
        client_name = $1, phone = $2, property_name = $3, visit_date = $4,
        visit_time = $5, salesperson = $6, status = $7, feedback = $8,
        next_follow_up_date = $9, notes = $10, updated_at = $11
      WHERE id = $12
      RETURNING *;
    `, [
      merged.clientName,
      merged.phone,
      merged.propertyName || 'Park Solitaire',
      merged.visitDate,
      merged.visitTime || '',
      merged.salesperson || '',
      merged.status || 'Scheduled',
      merged.feedback || '',
      merged.nextFollowUpDate || null,
      merged.notes || '',
      merged.updatedAt,
      Number(id)
    ]);
    return mapRowToSiteVisit(res.rows[0]);
  } else {
    const list = await getAllSiteVisits();
    const index = list.findIndex(v => v.id === Number(id));
    if (index === -1) return null;
    const updated = {
      ...list[index],
      ...updates,
      id: Number(id),
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    const tempFile = `${siteVisitsFilePath}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), 'utf8');
    fs.renameSync(tempFile, siteVisitsFilePath);
    return updated;
  }
}

export async function deleteSiteVisit(id) {
  if (isPostgres) {
    const res = await pool.query('DELETE FROM site_visits WHERE id = $1 RETURNING id;', [Number(id)]);
    return res.rows.length > 0;
  } else {
    const list = await getAllSiteVisits();
    const filtered = list.filter(v => v.id !== Number(id));
    if (filtered.length === list.length) return false;
    const tempFile = `${siteVisitsFilePath}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(filtered, null, 2), 'utf8');
    fs.renameSync(tempFile, siteVisitsFilePath);
    return true;
  }
}

