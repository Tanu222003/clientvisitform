import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initDb,
  getAllVisits,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit,
  getDbInfo,
  AVAILABLE_PROPERTIES,
  getAllSiteVisits,
  getSiteVisitById,
  createSiteVisit,
  updateSiteVisit,
  deleteSiteVisit
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'X-Requested-With']
}));
app.use(express.json());

// Disable all caching so multi-device sync (Tab <-> PC) is always 100% fresh
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// ==========================================
// API ROUTES
// ==========================================

// 1. Health Check
app.get('/api/health', async (req, res) => {
  try {
    const visits = await getAllVisits();
    const dbInfo = getDbInfo();
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      totalVisits: visits.length,
      database: dbInfo.type,
      storage: dbInfo.storage
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 2. GET /api/properties - Available real estate projects
app.get('/api/properties', (req, res) => {
  res.json({ success: true, count: AVAILABLE_PROPERTIES.length, data: AVAILABLE_PROPERTIES });
});

// 3. POST /api/auth/login - Multi-Property & Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { role, username, password, propertyName } = req.body;

  if (role === 'admin' || username === 'admin') {
    if (password && password !== 'admin' && password !== 'admin123') {
      return res.status(401).json({ success: false, error: 'Invalid admin password' });
    }
    return res.json({
      success: true,
      user: {
        id: 'admin',
        role: 'admin',
        name: 'Master Admin',
        email: 'admin@parksolitaire.com',
        property: 'ALL'
      }
    });
  }

  // Property Desk Login
  const targetPropName = propertyName || username || 'Park Solitaire';
  const prop = AVAILABLE_PROPERTIES.find(
    p => p.name.toLowerCase() === targetPropName.toLowerCase() || p.id.toLowerCase() === targetPropName.toLowerCase()
  ) || AVAILABLE_PROPERTIES[0];

  res.json({
    success: true,
    user: {
      id: prop.id,
      role: 'property',
      name: `${prop.name} Desk`,
      email: `desk@${prop.id}.com`,
      property: prop.name
    }
  });
});

// 4. GET /api/visits - Get all visits with search, property & status filters
app.get('/api/visits', async (req, res) => {
  try {
    let visits = await getAllVisits();
    const { q, status, aspiration, property, propertyName, project } = req.query;

    const targetProperty = propertyName || project;
    if (targetProperty && targetProperty !== 'ALL' && targetProperty !== 'All') {
      visits = visits.filter(v => (v.propertyName || 'Park Solitaire') === targetProperty);
    }

    if (q) {
      const query = q.toLowerCase();
      visits = visits.filter(v => 
        (v.name && v.name.toLowerCase().includes(query)) ||
        (v.phone && v.phone.toLowerCase().includes(query)) ||
        (v.mail && v.mail.toLowerCase().includes(query)) ||
        (v.remarks && v.remarks.toLowerCase().includes(query)) ||
        (v.address && v.address.toLowerCase().includes(query)) ||
        (v.propertyName && v.propertyName.toLowerCase().includes(query))
      );
    }

    if (status && status !== 'All') {
      const norm = status.toLowerCase().replace(/[^a-z]/g, '');
      visits = visits.filter(v => (v.status || '').toLowerCase().replace(/[^a-z]/g, '') === norm);
    }

    if (aspiration && aspiration !== 'All') {
      visits = visits.filter(v => v.aspiration === aspiration);
    }

    if (property && property !== 'All') {
      visits = visits.filter(v => v.interest && v.interest.includes(property));
    }

    res.json({ success: true, count: visits.length, data: visits });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET /api/visits/:id - Get single visit
app.get('/api/visits/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const visit = await getVisitById(id);

    if (!visit) {
      return res.status(404).json({ success: false, error: 'Visit not found' });
    }

    res.json({ success: true, data: visit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. POST /api/visits - Create new visit
app.post('/api/visits', async (req, res) => {
  try {
    const { name, phone, date, mail, email, address, profession, property, interest, budget, aspiration, source, remarks, cp, remarksHistory } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and phone are required.' });
    }

    let cleanDigits = String(phone).replace(/\D/g, '');
    if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
      cleanDigits = cleanDigits.slice(2);
    } else if (cleanDigits.length === 11 && cleanDigits.startsWith('0')) {
      cleanDigits = cleanDigits.slice(1);
    }

    if (cleanDigits.length !== 10) {
      return res.status(400).json({ success: false, error: 'Phone number must be exactly 10 digits.' });
    }

    const visitDate = date
      ? (String(date).includes('-') ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : date)
      : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const visitId = Number(req.body.id) || Date.now();
    const newVisit = {
      id: visitId,
      name: name.trim(),
      date: visitDate,
      phone: `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`,
      mail: mail || email || "",
      address: address || "Mumbai",
      profession: profession || "—",
      interest: property || interest || "2BHK",
      aspiration: aspiration || "Personal Use",
      budget: budget || "—",
      source: Array.isArray(source) ? source.join(", ") : (source || "Walk-in"),
      status: req.body.status || "Visited",
      remarks: remarks || "",
      remarksHistory: remarksHistory || (remarks ? [{
        id: Date.now(),
        date: visitDate,
        status: req.body.status || "Visited",
        remarks,
        source: "Visit Form"
      }] : []),
      cp: cp || "",
      visitsCount: 1,
      createdAt: new Date().toISOString()
    };

    const created = await createVisit(newVisit);
    res.status(201).json({ success: true, message: 'Visit created successfully', data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. PATCH /api/visits/:id - Update visit (Status, Remarks, etc.)
app.patch('/api/visits/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updatedVisit = await updateVisit(id, req.body);

    if (!updatedVisit) {
      return res.status(404).json({ success: false, error: 'Visit not found' });
    }

    res.json({ success: true, message: 'Visit updated successfully', data: updatedVisit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. DELETE /api/visits/:id - Delete visit
app.delete('/api/visits/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteVisit(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Visit not found' });
    }

    res.json({ success: true, message: 'Visit deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. GET /api/stats - Real-time Dashboard Analytics
app.get('/api/stats', async (req, res) => {
  try {
    const visits = await getAllVisits();
    const total = visits.length;
    const personal = visits.filter(v => v.aspiration === 'Personal Use').length;
    const investment = visits.filter(v => v.aspiration === 'Investment').length;

    const propertyTypes = ["1BHK", "2BHK", "3BHK", "SHOP", "2BHK JODI", "OFFICE"];
    const propertyCounts = propertyTypes.map(t => ({
      type: t,
      count: visits.filter(v => v.interest && v.interest.toUpperCase().includes(t)).length
    }));

    res.json({
      success: true,
      data: {
        totalVisits: total,
        personalUse: personal,
        investment,
        personalPercent: Math.round((personal / Math.max(total, 1)) * 100),
        investmentPercent: Math.round((investment / Math.max(total, 1)) * 100),
        propertyBreakdown: propertyCounts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. GET /api/export - CSV Export
app.get('/api/export', async (req, res) => {
  try {
    const visits = await getAllVisits();
    const headers = ["Client Name", "Date", "Phone", "Mail ID", "Profession", "Property", "Aspiration", "Budget", "Source", "Status", "Remarks"];
    const rows = visits.map(v => [
      `"${(v.name || '').replace(/"/g, '""')}"`,
      `"${v.date || ''}"`,
      `"${v.phone || ''}"`,
      `"${(v.mail || '').replace(/"/g, '""')}"`,
      `"${(v.profession || '').replace(/"/g, '""')}"`,
      `"${(v.interest || '').replace(/"/g, '""')}"`,
      `"${(v.aspiration || '').replace(/"/g, '""')}"`,
      `"${(v.budget || '').replace(/"/g, '""')}"`,
      `"${(v.source || '').replace(/"/g, '""')}"`,
      `"${v.status || 'Visited'}"`,
      `"${(v.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="park-solitaire-visits-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Site Visits API
app.get('/api/site-visits', async (req, res) => {
  try {
    let siteVisits = await getAllSiteVisits();
    const { property, propertyName, status, q } = req.query;
    const targetProp = propertyName || property;
    if (targetProp && targetProp !== 'ALL' && targetProp !== 'All') {
      siteVisits = siteVisits.filter(v => {
        const vp = (v.propertyName || 'Park Solitaire').toLowerCase();
        const tp = targetProp.toLowerCase();
        if (vp === tp) return true;
        if (tp === 'vdpl' && (vp === 'vdpl' || vp.includes('veena developer'))) return true;
        if (vp === 'vdpl' && (tp === 'vdpl' || tp.includes('veena developer'))) return true;
        return false;
      });
    }
    if (status && status !== 'All') {
      siteVisits = siteVisits.filter(v => (v.status || '').toLowerCase() === status.toLowerCase());
    }
    if (q) {
      const query = q.toLowerCase();
      siteVisits = siteVisits.filter(v =>
        (v.clientName && v.clientName.toLowerCase().includes(query)) ||
        (v.phone && v.phone.includes(query)) ||
        (v.salesperson && v.salesperson.toLowerCase().includes(query)) ||
        (v.notes && v.notes.toLowerCase().includes(query)) ||
        (v.feedback && v.feedback.toLowerCase().includes(query))
      );
    }
    res.json({ success: true, count: siteVisits.length, data: siteVisits });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/site-visits', async (req, res) => {
  try {
    const { clientName, phone, propertyName, visitDate, visitTime, salesperson, status, feedback, nextFollowUpDate, notes } = req.body;
    if (!clientName || !phone) {
      return res.status(400).json({ success: false, error: 'Client name and phone are required.' });
    }
    const newEntry = await createSiteVisit({
      clientName: clientName.trim(),
      phone,
      propertyName: propertyName || 'Park Solitaire',
      visitDate: visitDate || new Date().toISOString().slice(0, 10),
      visitTime: visitTime || '11:00 AM',
      salesperson: salesperson || 'Unassigned',
      status: status || 'Scheduled',
      feedback: feedback || '',
      nextFollowUpDate: nextFollowUpDate || '',
      notes: notes || ''
    });
    res.status(201).json({ success: true, message: 'Site visit scheduled successfully', data: newEntry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/site-visits/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateSiteVisit(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Site visit not found' });
    }
    res.json({ success: true, message: 'Site visit updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/site-visits/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteSiteVisit(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Site visit not found' });
    }
    res.json({ success: true, message: 'Site visit deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Production: Serve React Frontend static files if dist exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server & Initialize Database
app.listen(PORT, '0.0.0.0', async () => {
  await initDb();
  const dbInfo = getDbInfo();
  console.log(`===============================================`);
  console.log(`✨ Park Solitaire Backend Server is running!`);
  console.log(`📍 Local Port: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️ Database: ${dbInfo.storage} (${dbInfo.type.toUpperCase()})`);
  console.log(`===============================================`);
});
