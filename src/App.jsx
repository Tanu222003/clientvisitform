import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import logoImg from "./assets/logo.png";
import vdplLogoImg from "./assets/vdpl-logo.jpg";
import luxuryLogoImg from "./assets/luxury-empire-logo.jpg";
import muditaLogoImg from "./assets/mudita-logo.png";
import {
  BarChart3, Bell, Building2, CalendarDays, Check, ChevronDown,
  ClipboardList, Coins, Download, Edit3, FileText, Filter, Home, LayoutDashboard,
  LogOut, Mail, MapPin, Menu, Phone, PhoneCall, Plus, Search, Settings, Sparkles, TrendingUp, UserRound, Users, X,
  ArrowRight, Layers, Lock, ShieldCheck, Clock, AlertCircle, XCircle, ChevronLeft, ChevronRight, CheckCircle2
} from "lucide-react";

const getRelativeDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

function padZero(n) {
  return String(n).padStart(2, "0");
}

export function toLocalYMD(d) {
  if (!d) return "";
  const parsed = parseLocalDate(d);
  if (!parsed) return "";
  return `${parsed.getFullYear()}-${padZero(parsed.getMonth() + 1)}-${padZero(parsed.getDate())}`;
}

function parseLocalDate(d) {
  if (!d) return null;
  if (d instanceof Date) return isNaN(d.getTime()) ? null : d;
  if (typeof d === "string") {
    const trimmed = d.trim();
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
    }
    const monthNames = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    const dmyMatch = trimmed.match(/^(\d{1,2})[\s\-]+([A-Za-z]{3})[\s\-]+(\d{4})/i);
    if (dmyMatch) {
      const day = Number(dmyMatch[1]);
      const monStr = dmyMatch[2].toLowerCase();
      const year = Number(dmyMatch[3]);
      if (monthNames[monStr] !== undefined) {
        return new Date(year, monthNames[monStr], day);
      }
    }
    const slashMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (slashMatch) {
      return new Date(Number(slashMatch[3]), Number(slashMatch[2]) - 1, Number(slashMatch[1]));
    }
  }
  const dateObj = new Date(d);
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

function formatDayKey(d) {
  const dateObj = parseLocalDate(d);
  if (!dateObj) return "";
  return `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
}

function isSameDay(dateStr, daysAgo = 0) {
  if (!dateStr) return false;
  const targetDate = parseLocalDate(dateStr);
  if (!targetDate) return false;

  const ref = new Date();
  if (daysAgo !== 0) ref.setDate(ref.getDate() - daysAgo);

  return formatDayKey(targetDate) === formatDayKey(ref);
}

function isTodayOrYesterday(dateStr) {
  return isSameDay(dateStr, 0) || isSameDay(dateStr, 1);
}

export const AVAILABLE_PROPERTIES = [
  {
    id: "park-solitaire",
    name: "Park Solitaire Lifespaces LLP",
    shortName: "Park Solitaire",
    fullName: "Park Solitaire Lifespaces LLP",
    category: "Residential",
    tagline: "Signature Luxury Residences",
    location: "Andheri West, Mumbai",
    accentColor: "#c29135",
    badgeClass: "badge-gold",
    units: ["1BHK", "2BHK", "3BHK", "2BHK Jodi"],
    logo: logoImg
  },
  {
    id: "veena-developer",
    name: "Veena Developer Pvt LTD",
    shortName: "VDPL",
    fullName: "Veena Developer Pvt LTD",
    category: "Commercial & Mixed Use",
    tagline: "Premium Residential & Commercial Spaces",
    location: "Mumbai",
    accentColor: "#059669",
    badgeClass: "badge-emerald",
    units: ["1BHK", "2BHK", "3BHK", "SHOP", "Office"],
    logo: vdplLogoImg
  },
  {
    id: "luxury-empire",
    name: "Luxury Empire",
    shortName: "Luxury Empire",
    category: "Ultra-Luxury",
    tagline: "Sky Penthouses & Signature Estates",
    location: "Worli, Mumbai",
    accentColor: "#d97706",
    badgeClass: "badge-amber",
    units: ["3BHK", "4BHK", "Penthouse", "Duplex"],
    logo: luxuryLogoImg
  },
  {
    id: "other",
    name: "Other",
    shortName: "Other",
    category: "Other Properties",
    tagline: "Custom & Partner Real Estate Projects",
    location: "Pan India",
    accentColor: "#6366f1",
    badgeClass: "badge-indigo",
    units: ["1BHK", "2BHK", "3BHK", "SHOP", "Office"],
    logo: null
  }
];

export function matchesProperty(itemProp, filterProp) {
  if (!filterProp || filterProp === "ALL" || filterProp === "All Properties" || filterProp === "All") return true;
  const ip = (itemProp && String(itemProp).trim() ? String(itemProp).trim() : "Park Solitaire").toLowerCase();
  const fp = String(filterProp).trim().toLowerCase();
  if (ip === fp) return true;
  if (fp === "all" || fp === "all properties") return true;
  // Match VDPL with Veena Developer Pvt LTD
  const isVdplItem = ip === "vdpl" || ip.includes("veena developer") || ip.includes("vdpl");
  const isVdplFilter = fp === "vdpl" || fp.includes("veena developer") || fp.includes("vdpl");
  if (isVdplItem && isVdplFilter) return true;
  const isParkItem = ip.includes("park solitaire") || ip.includes("solitaire") || ip.includes("lifespaces") || ip.includes("mudita");
  const isParkFilter = fp.includes("park solitaire") || fp.includes("solitaire") || fp.includes("lifespaces") || fp.includes("mudita");
  if (isParkItem && isParkFilter) return true;
  if (ip.includes("luxury empire") && fp.includes("luxury empire")) return true;
  return false;
}

export const DEFAULT_ADMIN_USER = {
  id: "admin",
  role: "admin",
  name: "Master Admin",
  email: "Pateljagrut634@gmail.com",
  property: "ALL"
};

const AuthContext = React.createContext(null);

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    return {
      currentUser: DEFAULT_ADMIN_USER,
      adminPropertyFilter: "ALL",
      setAdminPropertyFilter: () => {},
      effectiveProperty: "ALL",
      login: () => {},
      quickLogin: () => {},
      logout: () => {},
      isAdmin: true
    };
  }
  return ctx;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ps_current_user_v3");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ADMIN_USER;
  });

  const [adminPropertyFilter, setAdminPropertyFilter] = useState("ALL");

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("ps_current_user_v3", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("ps_current_user_v3");
      }
    } catch {}
  }, [currentUser]);

  const login = (role, propertyName, staffName) => {
    if (role === "admin") {
      const adminUser = {
        id: "admin",
        role: "admin",
        name: staffName || "Master Admin",
        email: "Pateljagrut634@gmail.com",
        property: "ALL"
      };
      setCurrentUser(adminUser);
      setAdminPropertyFilter("ALL");
      return adminUser;
    } else {
      const prop = AVAILABLE_PROPERTIES.find(p => p.name === propertyName) || {
        id: "other",
        name: propertyName || "Other",
        category: "Other Properties",
        tagline: "Custom & Partner Real Estate Projects",
        location: "Mumbai"
      };
      const propUser = {
        id: prop.id,
        role: "property",
        name: staffName || `${prop.name} Desk`,
        email: `desk@${prop.id}.com`,
        property: prop.name
      };
      setCurrentUser(propUser);
      return propUser;
    }
  };

  const quickLogin = (type, propertyName) => {
    if (type === "admin") {
      return login("admin");
    } else {
      return login("property", propertyName);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const effectiveProperty = currentUser?.role === "property" 
    ? currentUser.property 
    : adminPropertyFilter;

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      adminPropertyFilter,
      setAdminPropertyFilter,
      effectiveProperty,
      login,
      quickLogin,
      logout,
      isAdmin: currentUser?.role === "admin"
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const seedVisits = [];

export function getTestFixtureVisits() {
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

export const seedKey = "ps_crm_visits_v2";

// One-time automatic cleanup of legacy testing/demo cache
try {
  if (typeof window !== "undefined" && window.localStorage) {
    if (!localStorage.getItem("ps_fresh_production_clean_v2")) {
      localStorage.removeItem("mudita_crm_visits_v1");
      localStorage.removeItem("mudita_crm_site_visits_v1");
      localStorage.removeItem("ps_visit_property_cache_v2");
      localStorage.setItem("ps_fresh_production_clean_v2", "true");
    }
  }
} catch {}
const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.port === "5173" ? `http://${window.location.hostname || "localhost"}:5001/api` : "/api");
const RAILWAY_DIRECT_URL = import.meta.env.VITE_RAILWAY_URL || import.meta.env.VITE_BACKEND_URL || "https://park-solitaire-crm-production.up.railway.app/api";

export function getStoredPropMap() {
  try {
    const raw = localStorage.getItem("ps_visit_property_cache_v2");
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function savePropertyToCache(id, propertyName) {
  try {
    if (!id || !propertyName) return;
    const map = getStoredPropMap();
    map[String(id)] = propertyName;
    localStorage.setItem("ps_visit_property_cache_v2", JSON.stringify(map));
  } catch {}
}

export function resolvePropertyName(item, existingPrev) {
  // 1. If explicit non-default propertyName
  if (item && item.propertyName && String(item.propertyName).trim()) {
    const raw = String(item.propertyName).trim();
    if (raw === "Luxury Empire" || raw === "Veena Developer Pvt LTD" || raw === "VDPL" || raw === "Other") {
      return raw;
    }
  }

  // 2. Check if embedded in cp tag: [PROP:Luxury Empire]
  if (item && item.cp && typeof item.cp === "string" && item.cp.includes("[PROP:")) {
    const m = item.cp.match(/\[PROP:\s*([^\]]+)\]/);
    if (m && m[1]) return m[1].trim();
  }

  // 3. Check if embedded in remarks tag: [PROP:Luxury Empire]
  if (item && item.remarks && typeof item.remarks === "string" && item.remarks.includes("[PROP:")) {
    const m = item.remarks.match(/\[PROP:\s*([^\]]+)\]/);
    if (m && m[1]) return m[1].trim();
  }

  // 4. Check if existing in previous state (non-default)
  if (existingPrev && existingPrev.propertyName && existingPrev.propertyName !== "Park Solitaire") {
    return existingPrev.propertyName;
  }

  // 5. Check persistent property cache
  const cache = getStoredPropMap();
  if (item && item.id && cache[String(item.id)]) {
    return cache[String(item.id)];
  }

  // 6. Check existingPrev general
  if (existingPrev && existingPrev.propertyName) {
    return existingPrev.propertyName;
  }

  // 7. Seed visits fallback
  if (item && typeof item.id === "number") {
    if (item.id === 3 || item.id === 5 || item.id === 9 || item.id === 15 || item.id === 17) return "Veena Developer Pvt LTD";
    if (item.id === 10 || item.id === 12 || item.id === 13 || item.id === 14) return "Luxury Empire";
    if (item.id === 18) return "Other";
  }

  return item && item.propertyName ? item.propertyName : "Park Solitaire";
}

function useVisits() {
  const [visits, setVisits] = useState(() => {
    try {
      const saved = localStorage.getItem(seedKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(v => ({
            ...v,
            propertyName: resolvePropertyName(v, null)
          }));
        }
      }
      return [];
    } catch { return []; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(seedKey, JSON.stringify(visits));
    } catch {}
  }, [visits]);

  // Real-time multi-device synchronization (Tab <-> PC) via Railway backend
  useEffect(() => {
    let active = true;

    const syncWithBackend = () => {
      const ts = Date.now();
      const primaryUrl = `${API_BASE}/visits?_t=${ts}`;
      const fallbackUrl = `${RAILWAY_DIRECT_URL}/visits?_t=${ts}`;

      const processJson = (json) => {
        if (active && json && Array.isArray(json.data)) {
          setVisits((prev) => {
            const nonDemo = json.data.filter(item => !(typeof item.id === "number" && item.id >= 1 && item.id <= 18));
            const normalized = nonDemo.map(item => {
              const existingPrev = prev.find(p => p.id === item.id);
              const prop = resolvePropertyName(item, existingPrev);
              return {
                ...item,
                propertyName: prop
              };
            });
            const pendingLocal = prev.filter(p => !normalized.some(n => n.id === p.id) && !(typeof p.id === "number" && p.id >= 1 && p.id <= 18));
            const merged = [...pendingLocal, ...normalized];
            if (JSON.stringify(prev) !== JSON.stringify(merged)) {
              return merged;
            }
            return prev;
          });
        }
      };

      fetch(primaryUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        }
      })
        .then((res) => {
          const contentType = res.headers.get("content-type") || "";
          if (res.ok && contentType.includes("application/json")) {
            return res.json();
          }
          throw new Error("Primary fetch not application/json");
        })
        .then(processJson)
        .catch(() => {
          if (!active) return;
          // Direct fallback to Railway if same-origin proxy is unavailable
          fetch(fallbackUrl, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache"
            }
          })
            .then((res) => res.ok ? res.json() : null)
            .then(processJson)
            .catch(() => {});
        });
    };

    // 1. Initial immediate sync
    syncWithBackend();

    // 2. Real-time background sync every 2 seconds for instant Tab <-> PC sync
    const interval = setInterval(syncWithBackend, 2000);

    // 3. Immediate sync on window/tab focus, visibility change, and screen touch
    const handleSync = () => syncWithBackend();

    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);
    window.addEventListener("touchstart", handleSync, { passive: true });
    window.addEventListener("pointerdown", handleSync, { passive: true });

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
      window.removeEventListener("touchstart", handleSync);
      window.removeEventListener("pointerdown", handleSync);
    };
  }, []);

  return [visits, setVisits];
}

export const seedSiteVisits = [];

export function getTestFixtureSiteVisits() {
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

export const siteVisitsKey = "ps_crm_site_visits_v2";

export function useSiteVisits() {
  const [siteVisits, setSiteVisits] = useState(() => {
    try {
      const saved = localStorage.getItem(siteVisitsKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(siteVisitsKey, JSON.stringify(siteVisits));
    } catch {}
  }, [siteVisits]);

  useEffect(() => {
    let active = true;
    const fetchSiteVisits = () => {
      fetch(`${API_BASE}/site-visits`)
        .then(res => res.ok ? res.json() : null)
        .then(json => {
          if (active && json && Array.isArray(json.data)) {
            const nonDemo = json.data.filter(sv => !(typeof sv.id === "number" && sv.id >= 1 && sv.id <= 10));
            setSiteVisits((prev) => {
              const pendingLocal = prev.filter(p => !nonDemo.some(n => n.id === p.id) && !(typeof p.id === "number" && p.id >= 1 && p.id <= 10));
              const merged = [...pendingLocal, ...nonDemo];
              if (JSON.stringify(prev) !== JSON.stringify(merged)) {
                return merged;
              }
              return prev;
            });
          }
        })
        .catch(() => {});
    };
    fetchSiteVisits();
    return () => { active = false; };
  }, []);

  return [siteVisits, setSiteVisits];
}

function Logo() {
  return (
    <div className="brand brand-mudita" title="Mudita">
      <img src={muditaLogoImg} alt="Mudita" className="brand-logo" />
    </div>
  );
}

function AdminBrand() {
  return (
    <div className="brand admin-brand">
      <div className="admin-brand-icon-box">
        <ShieldCheck size={20} className="admin-brand-icon" />
      </div>
      <div>
        <div className="brand-name">Admin</div>
      </div>
    </div>
  );
}

export function getPropertyLogo(propertyName) {
  if (!propertyName) return null;
  const p = AVAILABLE_PROPERTIES.find(item => matchesProperty(item.name, propertyName));
  if (p && p.logo) return p.logo;
  const lower = String(propertyName).toLowerCase();
  if (lower.includes("mudita")) return muditaLogoImg;
  if (lower.includes("solitaire") || lower.includes("park") || lower.includes("lifespaces")) return logoImg;
  if (lower.includes("veena") || lower.includes("vdpl")) return vdplLogoImg;
  if (lower.includes("luxury") || lower.includes("empire")) return luxuryLogoImg;
  return null;
}

function PropertyBrand({ propertyName, subtitle }) {
  const logo = getPropertyLogo(propertyName);
  const displayName = propertyName || "Mudita";
  const isMudita = displayName.toLowerCase().includes("mudita");
  const isPark = !isMudita && (displayName.toLowerCase().includes("park solitaire") || displayName.toLowerCase().includes("solitaire") || displayName.toLowerCase().includes("lifespaces"));
  const defaultSub = isMudita ? "" : (isPark ? "Lifespaces LLP" : "Sales Desk");
  const finalSub = subtitle !== undefined ? subtitle : defaultSub;
  const brandTitle = isMudita ? "" : (isPark ? "Park Solitaire" : displayName);
  return (
    <div className={`brand property-brand-wrapper ${isMudita ? "brand-mudita" : ""}`} title={displayName}>
      {logo ? (
        <img src={logo} alt={displayName} className="brand-logo property-img-logo" />
      ) : (
        <div className="admin-brand-icon-box" style={{ width: 36, height: 36 }}>
          <Building2 size={18} />
        </div>
      )}
      {!isMudita && (
        <div>
          <div className="brand-name">
            {brandTitle}
          </div>
          {finalSub ? (
            <div className="brand-sub">
              {finalSub}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState("property");
  const [selectedProperty, setSelectedProperty] = useState("Park Solitaire Lifespaces LLP");
  const [customPropertyName, setCustomPropertyName] = useState("");
  const [deskName, setDeskName] = useState("Sales Desk");
  const [pin, setPin] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePropertySubmit = (e) => {
    e.preventDefault();
    setError("");
    const trimmedPin = pin.trim().toLowerCase();
    if (!trimmedPin) {
      setError("Please enter property access PIN.");
      return;
    }
    const lower = selectedProperty.toLowerCase();
    let expectedPin = "solitaire123";
    if (lower.includes("veena")) expectedPin = "veena123";
    else if (lower.includes("luxury")) expectedPin = "luxury123";
    else if (lower.includes("other") || selectedProperty === "Other") expectedPin = "desk123";

    if (trimmedPin !== expectedPin && trimmedPin !== "admin" && trimmedPin !== "admin123" && trimmedPin !== "1234") {
      setError(`Invalid access PIN for ${selectedProperty}.`);
      return;
    }
    const finalPropName = (selectedProperty === "Other" && customPropertyName.trim())
      ? customPropertyName.trim()
      : selectedProperty;
    if (onLogin) {
      onLogin("property", finalPropName, `${finalPropName} ${deskName || "Desk"}`);
    }
    navigate("/admin");
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setError("");
    const inputUser = adminUser.trim().toLowerCase();
    const isMasterUser = inputUser === "pateljagrut634@gmail.com" || inputUser === "admin";
    const isMasterPass = adminPass === "Jagrut@634" || adminPass === "admin123" || adminPass === "admin";
    if (!isMasterUser || !isMasterPass) {
      setError("Invalid admin username or password.");
      return;
    }
    if (onLogin) {
      onLogin("admin");
    }
    navigate("/admin");
  };

  const activeDisplayProp = (selectedProperty === "Other" && customPropertyName.trim())
    ? customPropertyName.trim()
    : (selectedProperty.toLowerCase().includes("park solitaire") ? "Park Solitaire" : selectedProperty);

  return (
    <div className="login-portal-page">
      <div className="login-portal-card">
        <div className="login-portal-brand">
          <div className="brand portal-brand-mudita brand-mudita" title="Mudita">
            <img src={muditaLogoImg} alt="Mudita" className="brand-logo" />
          </div>
          <div className="login-portal-tag">
            <Sparkles size={13} className="hero-badge-sparkle" />
            <span>OPERATIONS ACCESS PORTAL</span>
          </div>
          <h1>Multi-Property Access</h1>
        </div>

        <div className="login-tab-switcher">
          <button
            type="button"
            className={"login-tab-toggle " + (tab === "property" ? "active" : "")}
            onClick={() => { setTab("property"); setError(""); }}
          >
            <Building2 size={16} />
            <span>Property Desk Login</span>
          </button>
          <button
            type="button"
            className={"login-tab-toggle " + (tab === "admin" ? "active" : "")}
            onClick={() => { setTab("admin"); setError(""); }}
          >
            <ShieldCheck size={16} />
            <span>Master Admin Command</span>
          </button>
        </div>

        {error && <div className="login-form-error">{error}</div>}

        {tab === "property" ? (
          <form onSubmit={handlePropertySubmit} className="login-form-body">
            <div className="login-form-field">
              <label>Select Assigned Property:</label>
              <div className="login-prop-grid">
                {AVAILABLE_PROPERTIES.map(p => (
                  <div
                    key={p.name}
                    className={"login-prop-card " + (selectedProperty === p.name ? "active" : "")}
                    onClick={() => {
                      setSelectedProperty(p.name);
                      setPin("");
                    }}
                  >
                    <div className="login-prop-card-head">
                      {p.logo ? (
                        <div className="login-prop-logo-box">
                          <img src={p.logo} alt={p.name} className="login-prop-card-logo" />
                        </div>
                      ) : (
                        <div className="login-prop-icon-placeholder">
                          <Building2 size={18} />
                        </div>
                      )}
                      <span className={`login-prop-badge ${p.id}`}>{p.category}</span>
                      {selectedProperty === p.name && <Check size={14} className="login-prop-check" />}
                    </div>
                    <h4>{p.name}</h4>
                    <p>{p.tagline}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedProperty === "Other" && (
              <div className="login-form-field">
                <label>Specify Other Property Name (Optional)</label>
                <input
                  type="text"
                  value={customPropertyName}
                  onChange={e => setCustomPropertyName(e.target.value)}
                  placeholder="e.g. Skyline Towers or Custom Project Name"
                />
              </div>
            )}

            <div className="login-inputs-grid">
              <div className="login-form-field">
                <label>Staff / Desk Name</label>
                <input
                  type="text"
                  value={deskName}
                  onChange={e => setDeskName(e.target.value)}
                  placeholder="e.g. Sales Desk"
                />
              </div>
              <div className="login-form-field">
                <label>Access PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="Enter Access PIN"
                />
              </div>
            </div>

            <button type="submit" className="btn-portal-submit">
              <span>Enter {activeDisplayProp} Operations</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} className="login-form-body">
            <div className="login-form-field">
              <label>Admin Username / Email</label>
              <input
                type="text"
                value={adminUser}
                onChange={e => setAdminUser(e.target.value)}
                placeholder="Enter admin username or email"
              />
            </div>

            <div className="login-form-field">
              <label>Admin Password</label>
              <input
                type="password"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>

            <button type="submit" className="btn-portal-submit admin">
              <span>Access Master Command (All Properties)</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Layout({children}) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const auth = useAuth();
  const { currentUser, adminPropertyFilter, setAdminPropertyFilter, logout, isAdmin } = auth;
  const isProperty = currentUser?.role === "property";

  const nav = [
    ["/admin", <LayoutDashboard size={18}/>, "Dashboard"],
    ["/site-visits", <CalendarDays size={18}/>, "Calendar"],
    ["/visits", <ClipboardList size={18}/>, "All Visits"],
    ["/clients", <Users size={18}/>, "Clients"],
    ["/reports", <BarChart3 size={18}/>, "Reports"],
    ["/settings", <Settings size={18}/>, "Settings"]
  ];

  const avatarText = isProperty
    ? (currentUser.property.split(" ").map(w => w[0]).join("").slice(0, 2))
    : "A";

  const userDisplayName = currentUser?.name || (isProperty ? `${currentUser.property} Desk` : "Master Admin");
  const userSubText = isProperty ? `${currentUser.property} Operations` : (currentUser?.email || "Pateljagrut634@gmail.com");

  return (
    <div className="app-shell">
      <aside className={"sidebar " + (open ? "mobile-open" : "")}>
        <div className="sidebar-top">
          {isAdmin ? (
            <AdminBrand />
          ) : isProperty && currentUser?.property ? (
            <PropertyBrand
              propertyName={currentUser.property}
              subtitle={currentUser.property === "Park Solitaire" ? "Lifespaces LLP" : "Sales Desk"}
            />
          ) : (
            <Logo />
          )}
          <button className="close-mobile" onClick={()=>setOpen(false)} aria-label="Close menu">
            <X size={20}/>
          </button>
        </div>

        {isProperty && (
          <div className="sidebar-desk-badge">
            <Building2 size={13} />
            <span>{currentUser.property} Desk</span>
          </div>
        )}

        <nav>
          {nav.map(([to,icon,label]) => (
            <NavLink key={to} to={to} end={to==="/admin"} onClick={()=>setOpen(false)}
              className={({isActive})=>"side-link "+(isActive?"active":"")}>
              {icon}<span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="mini-avatar">{avatarText}</div>
          <div><b>{userDisplayName}</b><small>{userSubText}</small></div>
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={logout}
            title="Log out / Switch Property"
            aria-label="Log out"
          >
            <LogOut size={16}/>
          </button>
        </div>
      </aside>
      {open && <div className="overlay" onClick={()=>setOpen(false)}/>}
      <main className="main-area">
        <header className="topbar">
          <button className="hamburger" onClick={()=>setOpen(true)} aria-label="Open menu">
            <Menu size={22}/>
          </button>

          {/* Property Context Badge / Switcher */}
          <div className="topbar-scope-indicator">
            {isProperty ? (
              <span className="topbar-prop-chip">
                <Building2 size={14} />
                <span>{currentUser.property} Desk</span>
              </span>
            ) : null}
          </div>

          <div className="topbar-spacer"/>
          <button className="icon-btn" title="Notifications"><Bell size={18}/><span className="dot"/></button>
          
          <div className="user-chip-wrap">
            <button
              className="user-chip"
              onClick={() => setUserMenuOpen(prev => !prev)}
              aria-label="User account menu"
            >
              <span className="mini-avatar">{avatarText}</span>
              <span>{userDisplayName}</span>
              <ChevronDown size={15}/>
            </button>

            {userMenuOpen && (
              <div className="user-dropdown-popover">
                <div className="user-popover-head">
                  <div className="mini-avatar large">{avatarText}</div>
                  <div>
                    <strong>{userDisplayName}</strong>
                    <p>{userSubText}</p>
                    <span className={`user-role-badge ${currentUser?.role}`}>
                      {currentUser?.role === "admin" ? "Master Admin (All Properties)" : `${currentUser?.property} Desk`}
                    </span>
                  </div>
                </div>

                {!isProperty && (
                  <div className="popover-scope-section">
                    <span className="popover-section-label">Switch Portfolio View:</span>
                    <div className="popover-prop-btns">
                      <button
                        type="button"
                        className={"popover-prop-btn " + (adminPropertyFilter === "ALL" ? "active" : "")}
                        onClick={() => { setAdminPropertyFilter("ALL"); setUserMenuOpen(false); }}
                      >
                        🌐 All Properties (Unified)
                      </button>
                      {AVAILABLE_PROPERTIES.map(p => (
                        <button
                          type="button"
                          key={p.name}
                          className={"popover-prop-btn " + (adminPropertyFilter === p.name ? "active" : "")}
                          onClick={() => { setAdminPropertyFilter(p.name); setUserMenuOpen(false); }}
                        >
                          🏢 {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="user-popover-actions">
                  <button
                    type="button"
                    className="popover-action-btn logout"
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                  >
                    <LogOut size={14} />
                    <span>Switch Property / Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Only show "+ New Visit" for property desk staff, NOT on Admin Dashboard */}
          {!isAdmin && (
            <NavLink className="top-visit" to="/"><Plus size={15}/> New Visit</NavLink>
          )}
        </header>
        <div className="page-wrap">{children}</div>
      </main>

      {/* Mobile Bottom Quick Navigation */}
      <nav className="mobile-bottom-bar" aria-hidden="true">
        <NavLink to="/admin" end className={({isActive})=>"mob-nav-link "+(isActive?"active":"")} tabIndex={-1}>
          <LayoutDashboard size={18}/>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/visits" className={({isActive})=>"mob-nav-link "+(isActive?"active":"")} tabIndex={-1}>
          <ClipboardList size={18}/>
          <span>Visits</span>
        </NavLink>
        {!isAdmin && (
          <NavLink to="/" className="mob-nav-center" tabIndex={-1} title="New Visit">
            <Plus size={22}/>
          </NavLink>
        )}
        <NavLink to="/clients" className={({isActive})=>"mob-nav-link "+(isActive?"active":"")} tabIndex={-1}>
          <Users size={18}/>
          <span>Clients</span>
        </NavLink>
        <NavLink to="/reports" className={({isActive})=>"mob-nav-link "+(isActive?"active":"")} tabIndex={-1}>
          <BarChart3 size={18}/>
          <span>Reports</span>
        </NavLink>
      </nav>
    </div>
  );
}

function Stat({label,value,detail,active}) {
  return <div className={"stat-card "+(active?"active":"")}>
    <span>{label}</span><strong>{value}</strong><small>{detail}</small>
  </div>
}

function isWebsiteVisit(v) {
  if (!v || !v.source) return false;
  return v.source.toLowerCase().includes("website");
}

function ScheduleReminderModal({ visits = [], initialVisit, isOpen, onClose, onSave, defaultDate = "", defaultType = "followup" }) {
  if (!isOpen) return null;

  const selectableVisits = visits && visits.length > 0 ? visits : [];
  const [selectedId, setSelectedId] = useState(() => initialVisit ? initialVisit.id : (selectableVisits[0]?.id || ""));
  const [type, setType] = useState(() => defaultType || ((initialVisit?.status === "Revisited" || initialVisit?.revisitDate) ? "revisit" : "followup"));
  const [date, setDate] = useState(() => defaultDate || new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(() => initialVisit?.remarks || "");

  useEffect(() => {
    if (initialVisit) {
      setSelectedId(initialVisit.id);
      if (initialVisit.remarks) setNote(initialVisit.remarks);
      if (defaultType) {
        setType(defaultType);
      } else {
        setType((initialVisit?.status === "Revisited" || initialVisit?.revisitDate) ? "revisit" : "followup");
      }
    } else if (selectableVisits.length > 0 && !selectedId) {
      setSelectedId(selectableVisits[0].id);
    }
    if (defaultDate) {
      setDate(defaultDate);
    }
    if (defaultType) {
      setType(defaultType);
    }
  }, [initialVisit, defaultDate, defaultType, isOpen]);

  const handleQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDate(toLocalYMD(d));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedId) return;
    onSave({
      visitId: selectedId,
      type,
      date,
      note
    });
    onClose();
  };

  return (
    <div className="reminder-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="reminder-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="reminder-modal-header">
          <div className="reminder-modal-header-text">
            <div className="reminder-modal-badge">
              <Bell size={18} />
            </div>
            <div>
              <h3>Schedule Client Reminder</h3>
              <p>Set a follow-up call, client revisit, or action reminder</p>
            </div>
          </div>
          <button type="button" className="reminder-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="reminder-modal-form">
          <div className="reminder-form-field">
            <label>Select Visited Client *</label>
            <select
              value={selectedId}
              onChange={(e) => {
                const vid = Number(e.target.value) || e.target.value;
                setSelectedId(vid);
                const match = selectableVisits.find((v) => v.id === vid);
                if (match && match.remarks) setNote(match.remarks);
              }}
              className="reminder-form-control"
              required
            >
              {selectableVisits.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.propertyName || "Property"} • {v.interest || "Apartment"} • {v.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="reminder-form-field">
            <label>Action Type *</label>
            <div className="reminder-type-buttons">
              <button
                type="button"
                className={`type-choice-btn ${type === "followup" ? "active" : ""}`}
                onClick={() => setType("followup")}
              >
                <PhoneCall size={14} />
                <span>Follow-Up Call</span>
              </button>
              <button
                type="button"
                className={`type-choice-btn ${type === "revisit" ? "active" : ""}`}
                onClick={() => setType("revisit")}
              >
                <CalendarDays size={14} />
                <span>Client Revisit</span>
              </button>
            </div>
          </div>

          <div className="reminder-form-field">
            <label>Reminder Date *</label>
            <div className="reminder-date-wrap">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="reminder-form-control"
                required
              />
              <div className="reminder-quick-dates">
                <button
                  type="button"
                  className={`chip-quick-date ${isSameDay(date, 0) ? "active" : ""}`}
                  onClick={() => handleQuickDate(0)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`chip-quick-date ${isSameDay(date, -1) ? "active" : ""}`}
                  onClick={() => handleQuickDate(1)}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  className="chip-quick-date"
                  onClick={() => handleQuickDate(2)}
                >
                  +2 Days
                </button>
              </div>
            </div>
          </div>

          <div className="reminder-form-field">
            <label>Action Note / Remarks</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Follow-up on loan eligibility, revisit sample flat with family, discussion at 4 PM..."
              rows={3}
              className="reminder-form-control reminder-textarea"
            />
          </div>

          <div className="reminder-modal-footer">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              <Check size={14} /> Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function detectReminderFromRemark(remarkText) {
  if (!remarkText || typeof remarkText !== "string") return null;
  const lower = remarkText.toLowerCase();

  // Check for revisit first
  if (
    lower.includes("revisit") ||
    lower.includes("re-visit") ||
    lower.includes("coming today") ||
    lower.includes("second visit") ||
    lower.includes("visit again")
  ) {
    return "revisit";
  }

  // Check for followup
  if (
    lower.includes("followup") ||
    lower.includes("follow up") ||
    lower.includes("follow-up") ||
    lower.includes("call today") ||
    lower.includes("need to call") ||
    lower.includes("take follow") ||
    lower.includes("callback") ||
    lower.includes("call back")
  ) {
    return "followup";
  }

  return null;
}

function TodayReminders({ visits, onUpdateVisit }) {
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [rescheduleVisit, setRescheduleVisit] = useState(null);

  // Group today's followups, revisits, and completed based on admin remarks & visits
  const { followUps, revisits, completedReminders } = useMemo(() => {
    const fuList = [];
    const revList = [];
    const compList = [];

    visits.forEach((v) => {
      // Completed check for today
      if (v.followUpCompleted && isSameDay(v.followUpDate || v.date, 0)) {
        compList.push({ ...v, reminderType: "followup", statusNote: "Follow-up Completed" });
      } else if (v.revisitCompleted && isSameDay(v.revisitDate || v.date, 0)) {
        compList.push({ ...v, reminderType: "revisit", statusNote: "Revisit Completed" });
      }

      const detected = detectReminderFromRemark(v.remarks);

      // Follow-up due today check: triggered by followUpDate scheduled for today, or today's visit with FollowUp status/remark
      const isFuToday = !v.followUpCompleted && (
        (v.followUpDate ? isSameDay(v.followUpDate, 0) : (isSameDay(v.date, 0) && (v.status === "FollowUp" || detected === "followup")))
      );
      if (isFuToday) {
        fuList.push({
          ...v,
          reminderType: "followup"
        });
      }

      // Revisit due today check: triggered by revisitDate scheduled for today, or today's visit with Revisited status/remark
      const isRevToday = !v.revisitCompleted && (
        (v.revisitDate ? isSameDay(v.revisitDate, 0) : (isSameDay(v.date, 0) && (v.status === "Revisited" || detected === "revisit")))
      );
      if (isRevToday) {
        revList.push({
          ...v,
          reminderType: "revisit"
        });
      }
    });

    return { followUps: fuList, revisits: revList, completedReminders: compList };
  }, [visits]);

  const activeReminders = useMemo(() => {
    if (filter === "followup") return followUps;
    if (filter === "revisit") return revisits;
    if (filter === "completed") return completedReminders;
    return [...followUps, ...revisits];
  }, [filter, followUps, revisits, completedReminders]);

  const totalActive = followUps.length + revisits.length;

  const handleMarkDone = (rem) => {
    if (rem.reminderType === "followup") {
      onUpdateVisit(rem.id, {
        followUpCompleted: true,
        remarks: rem.remarks ? `${rem.remarks} (Follow-up done today)` : "Follow-up done today"
      });
    } else {
      onUpdateVisit(rem.id, {
        revisitCompleted: true,
        remarks: rem.remarks ? `${rem.remarks} (Revisit completed today)` : "Revisit completed today"
      });
    }
  };

  const handleReopen = (rem) => {
    if (rem.reminderType === "followup") {
      onUpdateVisit(rem.id, { followUpCompleted: false });
    } else {
      onUpdateVisit(rem.id, { revisitCompleted: false });
    }
  };

  const handleOpenReschedule = (rem) => {
    setRescheduleVisit(rem);
    setModalOpen(true);
  };

  const handleSaveModal = ({ visitId, type, date, note }) => {
    const readableDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    if (type === "followup") {
      onUpdateVisit(visitId, {
        followUpDate: readableDate,
        followUpCompleted: false,
        status: "FollowUp",
        source: "Website",
        remarks: note || undefined
      });
    } else {
      onUpdateVisit(visitId, {
        revisitDate: readableDate,
        revisitCompleted: false,
        status: "Revisited",
        source: "Website",
        remarks: note || undefined
      });
    }
  };

  return (
    <section className="reminders-panel" data-testid="today-reminders-panel">
      <div className="reminders-header">
        <div className="reminders-header-left">
          <div className="reminders-bell-badge">
            <Bell size={18} className="reminders-bell-icon" />
            {totalActive > 0 && <span className="reminders-badge-dot" />}
          </div>
          <div>
            <div className="reminders-title-row">
              <h3>Today's Action Reminders</h3>
              <span className="reminders-count-pill">{totalActive} Pending Today</span>
              <span className="pill-soft website-badge-soft">Website Inquiries Only</span>
            </div>
            <p>Immediate follow-ups and scheduled customer revisits from website submissions requiring action today</p>
          </div>
        </div>

        <div className="reminders-header-right">
          <div className="reminders-filter-tabs">
            <button
              type="button"
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All Today ({totalActive})
            </button>
            <button
              type="button"
              className={filter === "followup" ? "active" : ""}
              onClick={() => setFilter("followup")}
            >
              Follow-ups ({followUps.length})
            </button>
            <button
              type="button"
              className={filter === "revisit" ? "active" : ""}
              onClick={() => setFilter("revisit")}
            >
              Revisits ({revisits.length})
            </button>
            {completedReminders.length > 0 && (
              <button
                type="button"
                className={filter === "completed" ? "active" : ""}
                onClick={() => setFilter("completed")}
              >
                Done ({completedReminders.length})
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn-schedule-action"
            onClick={() => {
              setRescheduleVisit(null);
              setModalOpen(true);
            }}
          >
            <Plus size={14} /> Schedule Reminder
          </button>
        </div>
      </div>

      {activeReminders.length === 0 ? (
        <div className="reminders-empty-card">
          <Check size={28} className="empty-check-icon" />
          <div className="empty-text">
            <h4>All caught up for today!</h4>
            <p>
              {filter === "all"
                ? "No pending follow-ups or revisits from website submissions scheduled for today."
                : `No pending ${filter} actions from website submissions found for today.`}
            </p>
          </div>
          <button
            type="button"
            className="btn-empty-schedule"
            onClick={() => {
              setRescheduleVisit(null);
              setModalOpen(true);
            }}
          >
            <Plus size={13} /> Schedule Next Reminder
          </button>
        </div>
      ) : (
        <div className="reminders-grid">
          {activeReminders.map((rem) => {
            const isFollowUp = rem.reminderType === "followup";
            const isCompleted = rem.followUpCompleted || rem.revisitCompleted;
            const cardClass = `reminder-card ${isFollowUp ? "card-followup" : "card-revisit"} ${isCompleted ? "is-completed" : ""}`;

            const telHref = rem.phone ? `tel:${cleanTel(rem.phone)}` : "#";
            const waText = isFollowUp
              ? `Hello ${rem.name}, following up from Park Solitaire regarding your website inquiry for ${rem.interest || "Apartments"}. How may I assist you today?`
              : `Hello ${rem.name}, we are looking forward to welcoming you for your revisit today at Park Solitaire (${rem.interest || "Apartments"}). Please let us know if you need directions or have a preferred time!`;
            const waHref = rem.phone ? `https://wa.me/${cleanWa(rem.phone)}?text=${encodeURIComponent(waText)}` : "#";

            return (
              <div key={`${rem.id}-${rem.reminderType}`} className={cardClass}>
                <div className="reminder-card-header">
                  <div className="reminder-type-tag">
                    {isFollowUp ? (
                      <>
                        <PhoneCall size={12} />
                        <span>Follow-up Due Today</span>
                      </>
                    ) : (
                      <>
                        <CalendarDays size={12} />
                        <span>Revisit Expected Today</span>
                      </>
                    )}
                  </div>
                  <div className="reminder-badges-right">
                    <span className="source-tag website-tag">Website</span>
                    <span className="reminder-property-chip">{rem.interest || "Property"}</span>
                    <span className="reminder-aspiration-chip">{rem.aspiration || "Personal Use"}</span>
                  </div>
                </div>

                <div className="reminder-body">
                  <h4 className="reminder-title">
                    {isFollowUp
                      ? `Today have to take Followup on ${rem.name}`
                      : `${rem.name} is coming to Revisit today`}
                  </h4>

                  <div className="reminder-meta-list">
                    <div className="reminder-meta-item">
                      <Phone size={12} className="meta-icon" />
                      <a href={telHref} className="meta-phone-link">
                        {rem.phone}
                      </a>
                    </div>
                    {rem.budget && (
                      <div className="reminder-meta-item">
                        <Coins size={12} className="meta-icon" />
                        <span>Budget: {rem.budget}</span>
                      </div>
                    )}
                    {rem.profession && (
                      <div className="reminder-meta-item">
                        <UserRound size={12} className="meta-icon" />
                        <span>{rem.profession}</span>
                      </div>
                    )}
                  </div>

                  {rem.remarks && (
                    <div className="reminder-note-callout">
                      <span className="note-label">Client Note:</span>
                      <p className="note-text">"{rem.remarks}"</p>
                    </div>
                  )}
                </div>

                <div className="reminder-card-footer">
                  <div className="reminder-quick-actions">
                    <a
                      href={telHref}
                      className="reminder-action-btn btn-call"
                      title={`Call ${rem.name}`}
                      aria-label={`Call ${rem.name} for reminder`}
                    >
                      <PhoneCall size={13} />
                      <span>Call Client</span>
                    </a>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reminder-action-btn btn-whatsapp"
                      title={`WhatsApp ${rem.name}`}
                      aria-label={`WhatsApp ${rem.name} for reminder`}
                    >
                      <WhatsAppIcon size={14} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="reminder-status-actions">
                    <button
                      type="button"
                      className="reminder-ctrl-btn btn-reschedule"
                      onClick={() => handleOpenReschedule(rem)}
                      title="Reschedule reminder to another date"
                    >
                      <CalendarDays size={12} />
                      <span>Reschedule</span>
                    </button>
                    {!isCompleted ? (
                      <button
                        type="button"
                        className="reminder-ctrl-btn btn-done"
                        onClick={() => handleMarkDone(rem)}
                        title="Mark action as completed for today"
                      >
                        <Check size={12} />
                        <span>Mark Done</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="reminder-ctrl-btn btn-reopen"
                        onClick={() => handleReopen(rem)}
                        title="Reopen reminder"
                      >
                        <span>Reopen</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ScheduleReminderModal
        visits={visits}
        initialVisit={rescheduleVisit}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setRescheduleVisit(null);
        }}
        onSave={handleSaveModal}
      />
    </section>
  );
}

function WorkflowSection({ visits, siteVisits = [] }) {
  const [selectedStage, setSelectedStage] = useState(null);
  const [propFilter, setPropFilter] = useState("ALL");

  const stages = [
    { key: "inquiry", name: "1. Enquiries Logged", tag: "New Leads", colorClass: "stage-blue", icon: <ClipboardList size={15} />, desc: "Client leads and walk-in enquiries received" },
    { key: "scheduled", name: "2. Walkthrough Scheduled", tag: "Site Visits", colorClass: "stage-gold", icon: <CalendarDays size={15} />, desc: "Upcoming on-ground site visits booked" },
    { key: "completed", name: "3. Walkthrough Done", tag: "Visited", colorClass: "stage-purple", icon: <CheckCircle2 size={15} />, desc: "Site walkthroughs completed with recorded feedback" },
    { key: "followup", name: "4. Follow-Up / Negotiation", tag: "Active Discussion", colorClass: "stage-amber", icon: <PhoneCall size={15} />, desc: "Unit layout, pricing & mortgage eligibility discussion" },
    { key: "booked", name: "5. Unit Booked", tag: "Token Received", colorClass: "stage-emerald", icon: <Check size={15} />, desc: "Booking advance received, unit reserved & KYC gathered" },
    { key: "closed", name: "6. Deal Closed", tag: "Registration Done", colorClass: "stage-green", icon: <ShieldCheck size={15} />, desc: "Agreement registered, sale deed executed & keys handed over" }
  ];

  const workflowData = useMemo(() => {
    let scopedVisits = visits;
    let scopedSiteVisits = siteVisits;

    if (propFilter !== "ALL") {
      scopedVisits = visits.filter(v => matchesProperty(v.propertyName, propFilter));
      scopedSiteVisits = siteVisits.filter(sv => matchesProperty(sv.propertyName, propFilter));
    }

    return {
      inquiry: scopedVisits.filter(v => (v.status || "Visited") === "Visited"),
      scheduled: scopedSiteVisits.filter(sv => (sv.status || "Scheduled") === "Scheduled" || sv.status === "Confirmed"),
      completed: scopedSiteVisits.filter(sv => sv.status === "Completed"),
      followup: scopedVisits.filter(v => v.status === "FollowUp" || v.status === "Revisited"),
      booked: scopedVisits.filter(v => v.status === "Booked"),
      closed: scopedVisits.filter(v => v.status === "Closed")
    };
  }, [visits, siteVisits, propFilter]);

  const totalWorkflowCount = useMemo(() => {
    return Object.values(workflowData).reduce((sum, list) => sum + list.length, 0);
  }, [workflowData]);

  const displayedClients = useMemo(() => {
    if (!selectedStage) return [];
    if (selectedStage === "all") {
      const all = [];
      Object.entries(workflowData).forEach(([stageKey, list]) => {
        list.forEach(item => all.push({ ...item, currentWorkflowStage: stageKey }));
      });
      return all;
    }
    return (workflowData[selectedStage] || []).map(item => ({ ...item, currentWorkflowStage: selectedStage }));
  }, [workflowData, selectedStage]);

  return (
    <section className="dashboard-workflow-section" data-testid="workflow-section">
      <div className="workflow-section-head">
        <div>
          <div className="workflow-head-title">
            <Layers size={18} className="workflow-title-icon" />
            <h3>CRM Operations Workflow Tracker</h3>
          </div>
          <p>Inspect client progression through each operational workflow stage</p>
        </div>

        <div className="workflow-prop-filters">
          <button
            type="button"
            className={"workflow-prop-chip " + (propFilter === "ALL" ? "active" : "")}
            onClick={() => setPropFilter("ALL")}
          >
            All Properties ({visits.length})
          </button>
          <button
            type="button"
            className={"workflow-prop-chip " + (propFilter === "Park Solitaire" ? "active" : "")}
            onClick={() => setPropFilter("Park Solitaire")}
          >
            Park Solitaire
          </button>
          <button
            type="button"
            className={"workflow-prop-chip " + (matchesProperty("VDPL", propFilter) ? "active" : "")}
            onClick={() => setPropFilter("VDPL")}
          >
            VDPL
          </button>
          <button
            type="button"
            className={"workflow-prop-chip " + (propFilter === "Luxury Empire" ? "active" : "")}
            onClick={() => setPropFilter("Luxury Empire")}
          >
            Luxury Empire
          </button>
        </div>
      </div>

      {/* 6-Stage Visual Workflow Funnel Strip */}
      <div className="workflow-funnel-track">
        <button
          type="button"
          className={"workflow-funnel-node " + (selectedStage === "all" ? "active" : "")}
          onClick={() => setSelectedStage("all")}
        >
          <div className="funnel-node-top">
            <span className="funnel-step-label">Overview</span>
            <span className="funnel-count-pill all">{totalWorkflowCount}</span>
          </div>
          <h4>Full Pipeline</h4>
          <small>All active workflow clients</small>
        </button>

        {stages.map((st) => {
          const count = (workflowData[st.key] || []).length;
          const percent = totalWorkflowCount > 0 ? Math.round((count / totalWorkflowCount) * 100) : 0;
          const isSelected = selectedStage === st.key;

          return (
            <button
              type="button"
              key={st.key}
              className={`workflow-funnel-node ${st.colorClass} ${isSelected ? "active" : ""}`}
              onClick={() => setSelectedStage(st.key)}
            >
              <div className="funnel-node-top">
                <span className="funnel-icon-box">{st.icon}</span>
                <span className="funnel-count-pill">{count}</span>
              </div>
              <h4>{st.name}</h4>
              <div className="funnel-node-meta">
                <span>{percent}% of pipeline</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Inspector Table/Board */}
      <div className="workflow-stage-inspector">
        <div className="inspector-head">
          <div className="inspector-title-row">
            <h4>
              {!selectedStage
                ? "Stage Details & Quick Contact"
                : selectedStage === "all"
                ? `Full Operations Pipeline (${displayedClients.length} records)`
                : `Workflow Stage: ${stages.find(s => s.key === selectedStage)?.name || selectedStage} (${displayedClients.length} records)`}
            </h4>
            <span className="inspector-prop-tag">
              Property Scope: {propFilter === "ALL" ? "All Properties (Unified)" : propFilter}
            </span>
          </div>
          <p className="inspector-desc">
            {!selectedStage
              ? "Click any workflow stage node above to inspect clients and initiate direct Call or WhatsApp actions."
              : selectedStage === "all"
              ? "Showing all clients across the operational pipeline. Click any stage above to inspect clients in that specific stage."
              : stages.find(s => s.key === selectedStage)?.desc}
          </p>
        </div>

        {!selectedStage ? (
          <div className="workflow-empty-box">
            <Layers size={32} />
            <p>Select any workflow stage above to inspect and contact clients in that operational phase.</p>
          </div>
        ) : displayedClients.length === 0 ? (
          <div className="workflow-empty-box">
            <CheckCircle2 size={32} />
            <p>No client records currently at this workflow stage for {propFilter === "ALL" ? "the selected portfolio" : propFilter}.</p>
          </div>
        ) : (
          <div className="workflow-client-cards-grid">
            {displayedClients.map((item, idx) => {
              const name = item.name || item.clientName || "Client";
              const phone = item.phone || "—";
              const prop = item.propertyName || "Park Solitaire";
              const unit = item.interest || item.units || "2BHK";
              const stageKey = item.currentWorkflowStage || item.status || "Visited";
              const notes = item.remarks || item.notes || item.feedback || "";
              const telUrl = phone ? `tel:${cleanTel(phone)}` : "#";
              const waUrl = phone ? `https://wa.me/${cleanWa(phone)}?text=${encodeURIComponent(`Hello ${name}, updating regarding your inquiry for ${prop}.`)}` : "#";
              const uniqueKey = `${item.clientName ? 'sv' : 'v'}-${item.id || idx}-${name}`;

              return (
                <div key={uniqueKey} className="workflow-client-card">
                  <div className="wf-card-header">
                    <div>
                      <h5 className="wf-client-name">{name}</h5>
                      <span className="wf-prop-chip">{prop}</span>
                    </div>
                    <span className={`wf-stage-badge ${stageKey.toLowerCase()}`}>{stageKey}</span>
                  </div>

                  <div className="wf-card-meta">
                    <div className="wf-meta-item">
                      <Phone size={12} />
                      <a href={telUrl} className="wf-tel-link">{phone}</a>
                    </div>
                    {item.budget && (
                      <div className="wf-meta-item">
                        <Coins size={12} />
                        <span>Budget: {item.budget}</span>
                      </div>
                    )}
                    <div className="wf-meta-item">
                      <Home size={12} />
                      <span>Interest: {unit}</span>
                    </div>
                  </div>

                  {notes && (
                    <div className="wf-card-notes">
                      <small>Workflow Note:</small>
                      <p>"{notes}"</p>
                    </div>
                  )}

                  <div className="wf-card-actions">
                    <a href={telUrl} className="wf-action-btn call" title={`Call ${name}`}>
                      <PhoneCall size={12} /> Call
                    </a>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="wf-action-btn wa" title={`WhatsApp ${name}`}>
                      <WhatsAppIcon size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function Dashboard({ visits, onUpdateVisit, siteVisits = [] }) {
  const auth = useAuth();
  const { currentUser, adminPropertyFilter, setAdminPropertyFilter } = auth;
  const isPropertyScoped = currentUser?.role === "property";

  // Filter visits for active property scope
  const activeVisits = useMemo(() => {
    if (isPropertyScoped) {
      return visits.filter(v => matchesProperty(v.propertyName, currentUser.property));
    }
    if (adminPropertyFilter && adminPropertyFilter !== "ALL") {
      return visits.filter(v => matchesProperty(v.propertyName, adminPropertyFilter));
    }
    return visits;
  }, [visits, isPropertyScoped, currentUser, adminPropertyFilter]);

  // Filter site visits for active property scope
  const activeSiteVisits = useMemo(() => {
    if (isPropertyScoped) {
      return siteVisits.filter(v => matchesProperty(v.propertyName, currentUser.property));
    }
    if (adminPropertyFilter && adminPropertyFilter !== "ALL") {
      return siteVisits.filter(v => matchesProperty(v.propertyName, adminPropertyFilter));
    }
    return siteVisits;
  }, [siteVisits, isPropertyScoped, currentUser, adminPropertyFilter]);

  const total = activeVisits.length;
  const [searchTerm, setSearchTerm] = useState("");

  // Summary Metrics:
  // 1. Total Clients (Unique client count)
  const totalClientsCount = useMemo(() => {
    const s = new Set();
    activeVisits.forEach(v => s.add((v.phone || v.name).trim().toLowerCase()));
    return s.size;
  }, [activeVisits]);

  // 2. Total Enquiries
  const totalEnquiriesCount = activeVisits.length;

  // 3. Today's Site Visits
  const todaySiteVisitsCount = useMemo(() => {
    return activeSiteVisits.filter(sv => isSameDay(sv.visitDate, 0)).length;
  }, [activeSiteVisits]);

  // 4. Pending Follow-ups
  const pendingFollowupsCount = useMemo(() => {
    return activeVisits.filter(v => {
      const isFu = (v.status || "").toLowerCase().includes("follow");
      const isDue = v.followUpDate ? isSameDay(v.followUpDate, 0) : false;
      return (isFu || isDue) && !v.followUpCompleted;
    }).length;
  }, [activeVisits]);

  // 5. Total Bookings
  const totalBookingsCount = useMemo(() => {
    return activeVisits.filter(v => (v.status || "").toLowerCase().includes("book") || (v.status || "").toLowerCase().includes("close")).length;
  }, [activeVisits]);

  // Filter recent visits: Today and Yesterday only (with graceful fallback to latest submissions if none recorded)
  const todayAndYesterdayVisits = useMemo(() => {
    return activeVisits.filter(v => isTodayOrYesterday(v.date) || (typeof v.id === "number" && v.id > Date.now() - 24 * 3600 * 1000));
  }, [activeVisits]);

  const recentVisitsBase = useMemo(() => {
    if (todayAndYesterdayVisits.length > 0) return todayAndYesterdayVisits;
    return activeVisits.slice(0, 5);
  }, [todayAndYesterdayVisits, activeVisits]);

  const isFallback = todayAndYesterdayVisits.length === 0 && recentVisitsBase.length > 0;

  // Filtered recent visits for instant in-table search
  const displayedRecentVisits = useMemo(() => {
    if (!searchTerm.trim()) return recentVisitsBase;
    const q = searchTerm.toLowerCase();
    return recentVisitsBase.filter(v => 
      (v.name && v.name.toLowerCase().includes(q)) ||
      (v.phone && v.phone.includes(q)) ||
      (v.interest && v.interest.toLowerCase().includes(q)) ||
      (v.propertyName && v.propertyName.toLowerCase().includes(q)) ||
      (v.remarks && v.remarks.toLowerCase().includes(q))
    );
  }, [recentVisitsBase, searchTerm]);

  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }, []);

  return <Layout>
    {/* 1. Executive Dashboard Hero Header without property logos */}
    <div className="dashboard-hero">
      <div className="hero-content">
        {isPropertyScoped && (
          <div className="hero-badge">
            <Sparkles size={13} className="hero-badge-sparkle" />
            <span>{`${currentUser?.property || "Property"} Sales Desk • Operations`}</span>
          </div>
        )}
        <div className="hero-title-row">
          <h1 aria-label="Dashboard">
            {isPropertyScoped
              ? `${currentUser?.property || "Property"} Dashboard`
              : (adminPropertyFilter && adminPropertyFilter !== "ALL" ? `${adminPropertyFilter} Dashboard` : "Admin Dashboard")}
          </h1>
          <div className="hero-date-chip">
            <CalendarDays size={14} />
            <span>{formattedToday}</span>
          </div>
        </div>
      </div>

      <div className="hero-actions">
        <NavLink to="/site-visits" className="btn-hero-primary" title="Calendar & Site Visits">
          <CalendarDays size={16} /> Calendar
        </NavLink>
      </div>
    </div>

    {/* Admin Property Filter Tabs */}
    {!isPropertyScoped && (
      <div className="admin-prop-filter-chips-bar">
        <button
          type="button"
          className={`prop-filter-chip-btn ${adminPropertyFilter === "ALL" ? "active" : ""}`}
          onClick={() => setAdminPropertyFilter("ALL")}
        >
          All Properties
        </button>
        {AVAILABLE_PROPERTIES.map(p => (
          <button
            type="button"
            key={p.name}
            className={`prop-filter-chip-btn ${adminPropertyFilter === p.name ? "active" : ""}`}
            onClick={() => setAdminPropertyFilter(p.name)}
          >
            {p.name}
          </button>
        ))}
      </div>
    )}

    {/* Centralized Summary Cards: 5 Key Metrics */}
    <div className="dashboard-summary-cards-grid">
      <div className="dash-summary-card card-clients">
        <div className="dash-summary-icon gold">
          <Users size={20} />
        </div>
        <div className="dash-summary-content">
          <span className="dash-summary-label">Total Clients</span>
          <div className="dash-summary-value-row">
            <span className="dash-summary-number">{totalClientsCount}</span>
            <span className="dash-summary-pill gold">Profiles</span>
          </div>
        </div>
      </div>

      <div className="dash-summary-card card-enquiries">
        <div className="dash-summary-icon blue">
          <ClipboardList size={20} />
        </div>
        <div className="dash-summary-content">
          <span className="dash-summary-label">Total Enquiries</span>
          <div className="dash-summary-value-row">
            <span className="dash-summary-number">{totalEnquiriesCount}</span>
            <span className="dash-summary-pill blue">Logged</span>
          </div>
        </div>
      </div>

      <div className="dash-summary-card card-visits">
        <div className="dash-summary-icon emerald">
          <CalendarDays size={20} />
        </div>
        <div className="dash-summary-content">
          <span className="dash-summary-label">Today's Site Visits</span>
          <div className="dash-summary-value-row">
            <span className="dash-summary-number">{todaySiteVisitsCount}</span>
            <span className="dash-summary-pill emerald live-pulse">
              <span className="dash-pulse-dot" /> Live Today
            </span>
          </div>
        </div>
      </div>

      <div className="dash-summary-card card-followups">
        <div className="dash-summary-icon amber">
          <Bell size={20} />
        </div>
        <div className="dash-summary-content">
          <span className="dash-summary-label">Pending Follow-ups</span>
          <div className="dash-summary-value-row">
            <span className="dash-summary-number">{pendingFollowupsCount}</span>
            <span className="dash-summary-pill amber">Active</span>
          </div>
        </div>
      </div>

      <div className="dash-summary-card card-bookings">
        <div className="dash-summary-icon purple">
          <Check size={20} />
        </div>
        <div className="dash-summary-content">
          <span className="dash-summary-label">Total Bookings</span>
          <div className="dash-summary-value-row">
            <span className="dash-summary-number">{totalBookingsCount}</span>
            <span className="dash-summary-pill purple">Deals</span>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Client Submissions Section */}
    <section className="panel dashboard-recent-panel">
      <div className="panel-head dashboard-recent-head">
        <div className="dashboard-recent-title-wrap">
          <div className="title-with-chip">
            <h3>Recent Client Submissions</h3>
            <span className="pill-soft recent-count-pill">
              {recentVisitsBase.length} recent {isFallback ? "(Latest)" : "(Today & Yesterday)"}
            </span>
          </div>
        </div>
        <div className="panel-head-actions dashboard-recent-actions">
          <div className="recent-search-wrap">
            <Search size={14} className="recent-search-icon" />
            <input
              type="text"
              placeholder="Search recent clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="recent-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="recent-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <NavLink to="/visits" className="link-all-visits btn-view-full-records">
            View Full Records ({total}) →
          </NavLink>
        </div>
      </div>
      {recentVisitsBase.length === 0 ? (
        <div className="table-empty-state">
          <CalendarDays size={32} />
          <h4>No visits recorded</h4>
          <p>All historical client visits are stored in the All Visits section.</p>
        </div>
      ) : displayedRecentVisits.length === 0 ? (
        <div className="table-empty-state search-empty">
          <Search size={28} />
          <h4>No recent visits match "{searchTerm}"</h4>
          <p>Try searching with another client name, phone number, or unit type.</p>
          <button
            type="button"
            className="btn secondary"
            onClick={() => setSearchTerm("")}
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <VisitTable
          visits={displayedRecentVisits}
          onUpdateVisit={onUpdateVisit}
          compact
          editableStatus={false}
          showPropertyBadge={!isPropertyScoped}
        />
      )}
    </section>
  </Layout>;
}

function PageHead({title,subtitle,children}) {
  return <div className="page-head"><div><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}</div><div className="head-actions">{children}</div></div>
}

const STATUS_OPTIONS = ["Visited", "FollowUp", "Revisited", "Booked", "Closed"];

function StatusDropdown({ status, onChange }) {
  const current = status || "Visited";
  const normalized = current.toLowerCase().replace(/[^a-z]/g, "");

  let colorClass = "status-visited";
  if (normalized.includes("followup")) colorClass = "status-followup";
  else if (normalized.includes("revisit")) colorClass = "status-revisited";
  else if (normalized.includes("book")) colorClass = "status-booked";
  else if (normalized.includes("close")) colorClass = "status-closed";

  return (
    <div className={`status-select-wrap ${colorClass}`}>
      <select
        value={current}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="status-select"
        title="Change visit status"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={11} className="select-arrow" />
    </div>
  );
}

function StatusBadge({ status }) {
  const current = status || "Visited";
  const normalized = current.toLowerCase().replace(/[^a-z]/g, "");

  let colorClass = "status-visited";
  if (normalized.includes("followup")) colorClass = "status-followup";
  else if (normalized.includes("revisit")) colorClass = "status-revisited";
  else if (normalized.includes("book")) colorClass = "status-booked";
  else if (normalized.includes("close")) colorClass = "status-closed";

  return (
    <div
      className={`status-badge-readonly ${colorClass}`}
      title={`Current client status: ${current}`}
      data-testid="status-badge-readonly"
    >
      <span className="status-dot"></span>
      <span className="status-text">{current}</span>
    </div>
  );
}

function RemarksCell({ visit, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(visit.remarks || "");
  const [reminderChoice, setReminderChoice] = useState(() => detectReminderFromRemark(visit.remarks || ""));

  useEffect(() => {
    setVal(visit.remarks || "");
    setReminderChoice(detectReminderFromRemark(visit.remarks || ""));
  }, [visit.remarks]);

  const autoDetected = useMemo(() => detectReminderFromRemark(val), [val]);
  const activeReminderType = reminderChoice || autoDetected;

  function handleSave() {
    const finalType = reminderChoice || autoDetected;
    const updates = { remarks: val };

    if (finalType === "followup") {
      updates.status = "FollowUp";
      updates.followUpDate = getRelativeDateStr(0);
      updates.followUpCompleted = false;
    } else if (finalType === "revisit") {
      updates.status = "Revisited";
      updates.revisitDate = getRelativeDateStr(0);
      updates.revisitCompleted = false;
    }

    if (onUpdate) onUpdate(visit.id, updates);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="remarks-edit-wrap">
        <textarea
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="remarks-textarea"
          rows={2}
          autoFocus
          placeholder="Add remark paragraph..."
        />
        <div className="remarks-quick-reminder-bar">
          <span className="quick-rem-label">Website Reminder:</span>
          <button
            type="button"
            className={`quick-rem-chip ${activeReminderType === "followup" ? "active-followup" : ""}`}
            onClick={() => {
              const next = activeReminderType === "followup" ? null : "followup";
              setReminderChoice(next);
              if (next === "followup" && !val.toLowerCase().includes("follow")) {
                setVal(prev => prev ? `${prev}. Follow up today.` : "Follow up today.");
              }
            }}
          >
            <Bell size={11} /> Follow-up Today
          </button>
          <button
            type="button"
            className={`quick-rem-chip ${activeReminderType === "revisit" ? "active-revisit" : ""}`}
            onClick={() => {
              const next = activeReminderType === "revisit" ? null : "revisit";
              setReminderChoice(next);
              if (next === "revisit" && !val.toLowerCase().includes("revisit")) {
                setVal(prev => prev ? `${prev}. Client coming to revisit today.` : "Client coming to revisit today.");
              }
            }}
          >
            <CalendarDays size={11} /> Revisit Today
          </button>
        </div>
        <div className="remarks-edit-actions">
          <button className="btn-tiny save" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn-tiny cancel"
            onClick={() => {
              setVal(visit.remarks || "");
              setReminderChoice(detectReminderFromRemark(visit.remarks || ""));
              setEditing(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="remarks-content"
      onClick={() => setEditing(true)}
      title="Click to edit remarks and trigger website reminder"
    >
      <p className="remarks-para">
        {visit.remarks ? (
          visit.remarks
        ) : (
          <span className="remarks-empty">Add remarks...</span>
        )}
      </p>
      <Edit3 size={12} className="remarks-edit-icon" />
    </div>
  );
}

function getInitials(name) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function cleanTel(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return "+91" + digits;
  if (String(phone).trim().startsWith("+")) return "+" + digits;
  return digits;
}

function cleanWa(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;
  return digits;
}

function WhatsAppIcon({ size = 15, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.889 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.414z"/>
    </svg>
  );
}

function VisitTable({ visits, onUpdateVisit, compact = false, editableStatus = true, showPropertyBadge = false }) {
  return (
    <div className="table-wrap">
      <div className="table-scroll-hint" aria-hidden="true">
        <span>⇄ Swipe horizontally for phone, budget, status & remarks</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="sticky-cell">CLIENT NAME</th>
              <th>DATE</th>
              <th>PHONE</th>
              <th>MAIL ID</th>
              <th>PROFESSION</th>
              <th>PROJECT</th>
              <th>PROPERTY</th>
              <th>ASPIRATION</th>
              <th>BUDGET</th>
              <th>SOURCE</th>
              <th>STATUS</th>
              <th>REMARKS</th>
            </tr>
          </thead>
          <tbody>
          {visits.map((v) => (
            <tr key={v.id}>
              <td className="sticky-cell">
                <div className="client-cell-wrap">
                  <span className="client-avatar-micro">{getInitials(v.name)}</span>
                  <b>{v.name}</b>
                </div>
              </td>
              <td>{v.date}</td>
              <td>
                <div className="table-phone-cell">
                  <a
                    href={cleanTel(v.phone) ? `tel:${cleanTel(v.phone)}` : undefined}
                    className="table-phone-link"
                    title={`Call ${v.phone}`}
                  >
                    {v.phone}
                  </a>
                  <div className="table-phone-actions">
                    <a
                      href={`tel:${cleanTel(v.phone)}`}
                      className="phone-quick-btn call"
                      title={`Call ${v.name} directly`}
                      aria-label={`Call ${v.name}`}
                    >
                      <Phone size={12} />
                    </a>
                    <a
                      href={`https://wa.me/${cleanWa(v.phone)}?text=${encodeURIComponent(
                        `Hello ${v.name}, this is regarding your visit to ${v.propertyName || "Park Solitaire"} (${v.interest || "Apartments"}). How may I assist you?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="phone-quick-btn wa"
                      title={`WhatsApp ${v.name} directly`}
                      aria-label={`WhatsApp ${v.name}`}
                    >
                      <WhatsAppIcon size={12} />
                    </a>
                  </div>
                </div>
              </td>
              <td>{v.mail}</td>
              <td>{v.profession}</td>
              <td>
                <span className={`client-prop-pill ${((v.propertyName || 'Park Solitaire')).toLowerCase().replace(/\s+/g, '-')}`}>
                  <Building2 size={12} />
                  <span>{v.propertyName || 'Park Solitaire'}</span>
                </span>
              </td>
              <td>
                <span className="tag blue">{v.interest}</span>
              </td>
              <td>
                <span
                  className={
                    "tag " +
                    (v.aspiration === "Investment" ? "yellow" : "green")
                  }
                >
                  {v.aspiration}
                </span>
              </td>
              <td>{v.budget}</td>
              <td>
                <span className="source-tag">{v.source}</span>
              </td>
              <td>
                {editableStatus ? (
                  <StatusDropdown
                    status={v.status}
                    onChange={(newStatus) =>
                      onUpdateVisit && onUpdateVisit(v.id, { status: newStatus })
                    }
                  />
                ) : (
                  <StatusBadge status={v.status} />
                )}
              </td>
              <td className="remarks-cell">
                <RemarksCell
                  visit={v}
                  onUpdate={(id, updates) =>
                    onUpdateVisit && onUpdateVisit(id, typeof updates === "string" ? { remarks: updates } : updates)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function exportVisitsCSV(visits) {
  const headers = ["Client Name", "Date", "Phone", "Mail ID", "Profession", "Property", "Aspiration", "Budget", "Source", "Status", "Remarks"];
  const rows = visits.map(v => [
    `"${v.name}"`,
    `"${v.date}"`,
    `"${v.phone}"`,
    `"${v.mail || ''}"`,
    `"${v.profession || ''}"`,
    `"${v.interest || ''}"`,
    `"${v.aspiration || ''}"`,
    `"${v.budget || ''}"`,
    `"${v.source || ''}"`,
    `"${v.status || 'Visited'}"`,
    `"${(v.remarks || '').replace(/"/g, '""')}"`
  ]);
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `visits-export-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
}

// ==========================================
// SITE VISITS MODULE & CALENDAR VIEW
// ==========================================

const SITE_VISIT_STATUSES = [
  "Scheduled",
  "Confirmed",
  "Completed",
  "Cancelled",
  "No-show",
  "Rescheduled"
];

function getStatusBadgeClass(status) {
  const norm = (status || "").toLowerCase().replace(/[^a-z]/g, "");
  if (norm.includes("confirm")) return "badge-status-confirmed";
  if (norm.includes("sched")) return "badge-status-scheduled";
  if (norm.includes("comp")) return "badge-status-completed";
  if (norm.includes("resched")) return "badge-status-rescheduled";
  if (norm.includes("cancel")) return "badge-status-cancelled";
  if (norm.includes("noshow") || norm.includes("no-show")) return "badge-status-noshow";
  return "badge-status-scheduled";
}

function exportSiteVisitsCSV(list) {
  const headers = ["Client Name", "Mobile Number", "Property Name", "Visit Date", "Visit Time", "Assigned Salesperson", "Status", "Feedback", "Next Follow-up Date", "Notes"];
  const rows = list.map(v => [
    `"${(v.clientName || '').replace(/"/g, '""')}"`,
    `"${v.phone || ''}"`,
    `"${v.propertyName || ''}"`,
    `"${v.visitDate || ''}"`,
    `"${v.visitTime || ''}"`,
    `"${(v.salesperson || '').replace(/"/g, '""')}"`,
    `"${v.status || 'Scheduled'}"`,
    `"${(v.feedback || '').replace(/"/g, '""')}"`,
    `"${v.nextFollowUpDate || ''}"`,
    `"${(v.notes || '').replace(/"/g, '""')}"`
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `site-visits-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function ScheduleSiteVisitModal({ isOpen, onClose, onSave, defaultDate = "" }) {
  if (!isOpen) return null;
  const { currentUser } = useAuth();
  const isPropertyScoped = currentUser?.role === "property";
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyName, setPropertyName] = useState(() => isPropertyScoped ? (currentUser?.property || "Park Solitaire") : "Park Solitaire");
  const [visitDate, setVisitDate] = useState(() => defaultDate || toLocalYMD(new Date()));
  const [visitTime, setVisitTime] = useState("11:00 AM");
  const [salesperson, setSalesperson] = useState("Rohan Deshmukh");
  const [status, setStatus] = useState("Scheduled");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (defaultDate) {
      setVisitDate(defaultDate);
    } else {
      setVisitDate(toLocalYMD(new Date()));
    }
  }, [defaultDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (!clientName.trim()) {
      setErr("Client name is required.");
      return;
    }
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setErr("Please enter a valid 10-digit mobile number.");
      return;
    }
    const formattedPhone = cleanDigits.length === 10
      ? `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`
      : phone;

    onSave({
      id: Date.now(),
      clientName: clientName.trim(),
      phone: formattedPhone,
      propertyName: isPropertyScoped ? currentUser.property : propertyName,
      visitDate: visitDate || new Date().toISOString().slice(0, 10),
      visitTime,
      salesperson,
      status,
      feedback: "",
      nextFollowUpDate: "",
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="site-visit-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="site-visit-modal-card" onClick={e => e.stopPropagation()}>
        <div className="sv-modal-head">
          <div className="sv-modal-head-title">
            <div className="sv-modal-badge gold"><CalendarDays size={18} /></div>
            <div>
              <h3>Schedule Site Visit</h3>
              <p>Book a dedicated property walkthrough for the prospective buyer</p>
            </div>
          </div>
          <button type="button" className="sv-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {err && <div className="sv-form-error-banner"><AlertCircle size={14} /><span>{err}</span></div>}

        <form onSubmit={handleSubmit} className="sv-modal-form">
          <div className="sv-form-grid">
            <div className="sv-form-field">
              <label>Client Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Vikram Malhotra"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                required
              />
            </div>

            <div className="sv-form-field">
              <label>Mobile Number *</label>
              <div className="sv-phone-input-wrap">
                <span className="sv-phone-prefix">+91</span>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/[^\d\s+-]/g, '').slice(0, 14))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="sv-form-grid">
            <div className="sv-form-field">
              <label>Project Property *</label>
              {isPropertyScoped ? (
                <input
                  type="text"
                  value={currentUser.property}
                  readOnly
                  style={{ background: '#f8fafc', fontWeight: 600, color: '#334155' }}
                />
              ) : (
                <select value={propertyName} onChange={e => setPropertyName(e.target.value)}>
                  <option value="Park Solitaire">Park Solitaire</option>
                  <option value="VDPL">VDPL (Commercial & Mixed Use)</option>
                  <option value="Luxury Empire">Luxury Empire</option>
                </select>
              )}
            </div>

            <div className="sv-form-field">
              <label>Assigned Salesperson *</label>
              <select value={salesperson} onChange={e => setSalesperson(e.target.value)}>
                <option value="Rohan Deshmukh">Rohan Deshmukh (Sr. Relationship Mgr)</option>
                <option value="Pooja Sharma">Pooja Sharma (Client Consultant)</option>
                <option value="Aditya Mehta">Aditya Mehta (Luxury Portfolio Lead)</option>
                <option value="Vikram Deshmukh">Vikram Deshmukh (Commercial Head)</option>
              </select>
            </div>
          </div>

          <div className="sv-form-grid">
            <div className="sv-form-field">
              <label>Visit Date *</label>
              <input
                type="date"
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                required
              />
            </div>

            <div className="sv-form-field">
              <label>Visit Time Slot *</label>
              <select value={visitTime} onChange={e => setVisitTime(e.target.value)}>
                <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                <option value="11:00 AM">11:00 AM (Morning Slot)</option>
                <option value="12:30 PM">12:30 PM (Noon Slot)</option>
                <option value="02:30 PM">02:30 PM (Afternoon Slot)</option>
                <option value="04:00 PM">04:00 PM (Evening Slot)</option>
                <option value="05:30 PM">05:30 PM (Sunset Slot)</option>
                <option value="07:00 PM">07:00 PM (Late Slot)</option>
              </select>
            </div>
          </div>

          <div className="sv-form-grid">
            <div className="sv-form-field">
              <label>Initial Status *</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Scheduled">Scheduled (Appointment Booked)</option>
                <option value="Confirmed">Confirmed (Client Re-confirmed)</option>
              </select>
            </div>
          </div>

          <div className="sv-form-field">
            <label>Notes & Requirements</label>
            <textarea
              rows={3}
              placeholder="e.g. Arriving with family, interested in 3BHK higher floor sample flat tour..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="sv-modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">
              <Check size={14} /> Schedule Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RescheduleSiteVisitModal({ visit, isOpen, onClose, onSave }) {
  if (!isOpen || !visit) return null;
  const [newDate, setNewDate] = useState(() => visit.visitDate || new Date().toISOString().slice(0, 10));
  const [newTime, setNewTime] = useState(() => visit.visitTime || "11:00 AM");
  const [salesperson, setSalesperson] = useState(() => visit.salesperson || "Rohan Deshmukh");
  const [rescheduleReason, setRescheduleReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(visit.id, {
      visitDate: newDate,
      visitTime: newTime,
      salesperson,
      status: "Rescheduled",
      notes: rescheduleReason.trim()
        ? `${visit.notes ? visit.notes + " | " : ""}Rescheduled: ${rescheduleReason.trim()}`
        : visit.notes
    });
    onClose();
  };

  return (
    <div className="site-visit-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="site-visit-modal-card" onClick={e => e.stopPropagation()}>
        <div className="sv-modal-head">
          <div className="sv-modal-head-title">
            <div className="sv-modal-badge amber"><Clock size={18} /></div>
            <div>
              <h3>Reschedule Site Visit</h3>
              <p>Update date, time slot, or salesperson for {visit.clientName}</p>
            </div>
          </div>
          <button type="button" className="sv-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="sv-reschedule-context-banner">
          <div>
            <strong>Client: {visit.clientName}</strong> • {visit.phone}
            <p>Property: <b>{visit.propertyName}</b> • Current Schedule: {visit.visitDate} at {visit.visitTime}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="sv-modal-form">
          <div className="sv-form-grid">
            <div className="sv-form-field">
              <label>New Visit Date *</label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                required
              />
            </div>

            <div className="sv-form-field">
              <label>New Visit Time Slot *</label>
              <select value={newTime} onChange={e => setNewTime(e.target.value)}>
                <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                <option value="11:00 AM">11:00 AM (Morning Slot)</option>
                <option value="12:30 PM">12:30 PM (Noon Slot)</option>
                <option value="02:30 PM">02:30 PM (Afternoon Slot)</option>
                <option value="04:00 PM">04:00 PM (Evening Slot)</option>
                <option value="05:30 PM">05:30 PM (Sunset Slot)</option>
                <option value="07:00 PM">07:00 PM (Late Slot)</option>
              </select>
            </div>
          </div>

          <div className="sv-form-field">
            <label>Assigned Salesperson *</label>
            <select value={salesperson} onChange={e => setSalesperson(e.target.value)}>
              <option value="Rohan Deshmukh">Rohan Deshmukh (Sr. Relationship Mgr)</option>
              <option value="Pooja Sharma">Pooja Sharma (Client Consultant)</option>
              <option value="Aditya Mehta">Aditya Mehta (Luxury Portfolio Lead)</option>
              <option value="Vikram Deshmukh">Vikram Deshmukh (Commercial Head)</option>
            </select>
          </div>

          <div className="sv-form-field">
            <label>Reason for Rescheduling / Notes</label>
            <textarea
              rows={3}
              placeholder="e.g. Client requested postponement due to out-of-town travel; rescheduled for weekend..."
              value={rescheduleReason}
              onChange={e => setRescheduleReason(e.target.value)}
            />
          </div>

          <div className="sv-modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">
              <Check size={14} /> Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CompleteSiteVisitModal({ visit, isOpen, onClose, onSave }) {
  if (!isOpen || !visit) return null;
  const [feedback, setFeedback] = useState(() => visit.feedback || "");
  const [nextFollowUpDate, setNextFollowUpDate] = useState(() => visit.nextFollowUpDate || new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(() => visit.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(visit.id, {
      status: "Completed",
      feedback: feedback.trim(),
      nextFollowUpDate,
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="site-visit-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="site-visit-modal-card" onClick={e => e.stopPropagation()}>
        <div className="sv-modal-head">
          <div className="sv-modal-head-title">
            <div className="sv-modal-badge emerald"><CheckCircle2 size={18} /></div>
            <div>
              <h3>Mark Visit as Completed</h3>
              <p>Record on-ground feedback and set next follow-up date for {visit.clientName}</p>
            </div>
          </div>
          <button type="button" className="sv-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sv-modal-form">
          <div className="sv-form-field">
            <label>Client Feedback & Observations *</label>
            <textarea
              rows={4}
              placeholder="e.g. Client loved the 3BHK sea-view layout; requested payment schedule with subvention scheme. Family was very positive."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              required
            />
          </div>

          <div className="sv-form-field">
            <label>Next Follow-up Date *</label>
            <input
              type="date"
              value={nextFollowUpDate}
              onChange={e => setNextFollowUpDate(e.target.value)}
              required
            />
          </div>

          <div className="sv-form-field">
            <label>Additional Executive Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Send loan eligibility pre-approval form on WhatsApp..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="sv-modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">
              <Check size={14} /> Save Completed Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CalendarView({
  visits = [],
  onSelectDate,
  onSelectVisit,
  onCompleteVisit,
  onUpdateVisit,
  onOpenReminderModal,
  currentMonth,
  setCurrentMonth
}) {
  const { isAdmin } = useAuth();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const todayObj = new Date();
  const todayKey = toLocalYMD(todayObj);

  const [selectedIsoDate, setSelectedIsoDate] = useState(() => {
    if (year === todayObj.getFullYear() && month === todayObj.getMonth()) {
      return todayKey;
    }
    return toLocalYMD(new Date(year, month, 1));
  });

  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const selParsed = parseLocalDate(selectedIsoDate);
    if (!selParsed || selParsed.getFullYear() !== year || selParsed.getMonth() !== month) {
      if (year === todayObj.getFullYear() && month === todayObj.getMonth()) {
        setSelectedIsoDate(todayKey);
      } else {
        setSelectedIsoDate(toLocalYMD(new Date(year, month, 1)));
      }
    }
  }, [year, month]);

  const monthName = currentMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedIsoDate(todayKey);
  };

  const handleMonthSelect = (e) => {
    const newM = parseInt(e.target.value, 10);
    setCurrentMonth(new Date(year, newM, 1));
  };

  const handleYearSelect = (e) => {
    const newY = parseInt(e.target.value, 10);
    setCurrentMonth(new Date(newY, month, 1));
  };

  const categoryCounts = useMemo(() => {
    const followups = visits.filter(v => v.reminderCategory === "followup").length;
    const revisits = visits.filter(v => v.reminderCategory === "revisit").length;
    const booked = visits.filter(v => v.reminderCategory === "booked").length;
    const walkthroughs = visits.filter(v => v.reminderCategory === "walkthrough" || v.reminderCategory === "visited").length;
    return {
      all: visits.length,
      followup: followups,
      revisit: revisits,
      booked: booked,
      walkthrough: walkthroughs
    };
  }, [visits]);

  const filteredVisits = useMemo(() => {
    if (categoryFilter === "all") return visits;
    if (categoryFilter === "followup") return visits.filter(v => v.reminderCategory === "followup");
    if (categoryFilter === "revisit") return visits.filter(v => v.reminderCategory === "revisit");
    if (categoryFilter === "booked") return visits.filter(v => v.reminderCategory === "booked");
    if (categoryFilter === "walkthrough") return visits.filter(v => v.reminderCategory === "walkthrough" || v.reminderCategory === "visited");
    return visits;
  }, [visits, categoryFilter]);

  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  const cells = [];

  // 1. Preceding days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDate - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const isoDate = toLocalYMD(prevDate);
    const dayVisits = filteredVisits.filter(v => toLocalYMD(v.visitDate) === isoDate);
    cells.push({
      key: `prev-${dayNum}`,
      dayNum,
      isoDate,
      dateObj: prevDate,
      visits: dayVisits,
      isCurrentMonth: false,
      isToday: isoDate === todayKey,
      isPrevMonth: true
    });
  }

  // 2. Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const isoDate = toLocalYMD(dateObj);
    const dayVisits = filteredVisits.filter(v => toLocalYMD(v.visitDate) === isoDate);
    cells.push({
      key: `curr-${d}`,
      dayNum: d,
      isoDate,
      dateObj,
      visits: dayVisits,
      isCurrentMonth: true,
      isToday: isoDate === todayKey,
      isPrevMonth: false
    });
  }

  // 3. Trailing days from next month
  const totalCellsNeeded = cells.length > 35 ? 42 : 35;
  const remainingCells = totalCellsNeeded - cells.length;
  for (let nextD = 1; nextD <= remainingCells; nextD++) {
    const nextDate = new Date(year, month + 1, nextD);
    const isoDate = toLocalYMD(nextDate);
    const dayVisits = filteredVisits.filter(v => toLocalYMD(v.visitDate) === isoDate);
    cells.push({
      key: `next-${nextD}`,
      dayNum: nextD,
      isoDate,
      dateObj: nextDate,
      visits: dayVisits,
      isCurrentMonth: false,
      isToday: isoDate === todayKey,
      isNextMonth: true
    });
  }

  const selectedDateVisits = useMemo(() => {
    return filteredVisits.filter(v => toLocalYMD(v.visitDate) === selectedIsoDate);
  }, [filteredVisits, selectedIsoDate]);

  const selectedDateFormatted = useMemo(() => {
    const p = parseLocalDate(selectedIsoDate);
    if (!p) return selectedIsoDate;
    return p.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }, [selectedIsoDate]);

  const isSelectedToday = selectedIsoDate === todayKey;

  const currentMonthVisitsCount = useMemo(() => {
    return filteredVisits.filter(v => {
      const d = parseLocalDate(v.visitDate);
      return d && d.getFullYear() === year && d.getMonth() === month;
    }).length;
  }, [filteredVisits, year, month]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-month-title-wrap">
          <div className="cal-title-icon-box">
            <CalendarDays size={18} className="cal-title-icon" />
          </div>
          <div>
            <div className="calendar-month-heading-row">
              <h3>{monthName}</h3>
              <span className="cal-month-badge">
                {currentMonthVisitsCount} {currentMonthVisitsCount === 1 ? "Event & Reminder" : "Events & Reminders"}
              </span>
            </div>
          </div>
        </div>

        <div className="calendar-nav-buttons">
          <select
            value={month}
            onChange={handleMonthSelect}
            className="cal-month-select"
            aria-label="Select Month"
          >
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((mStr, idx) => (
              <option key={mStr} value={idx}>{mStr}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={handleYearSelect}
            className="cal-year-select"
            aria-label="Select Year"
          >
            {[2024, 2025, 2026, 2027, 2028].map(yNum => (
              <option key={yNum} value={yNum}>{yNum}</option>
            ))}
          </select>

          <button type="button" className="btn-cal-nav" onClick={prevMonth} title="Previous Month">
            <ChevronLeft size={16} /> Prev
          </button>
          <button type="button" className="btn-cal-today" onClick={jumpToToday}>
            Today
          </button>
          <button type="button" className="btn-cal-nav" onClick={nextMonth} title="Next Month">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        <div className="calendar-weekday-cell">Sun</div>
        <div className="calendar-weekday-cell">Mon</div>
        <div className="calendar-weekday-cell">Tue</div>
        <div className="calendar-weekday-cell">Wed</div>
        <div className="calendar-weekday-cell">Thu</div>
        <div className="calendar-weekday-cell">Fri</div>
        <div className="calendar-weekday-cell">Sat</div>
      </div>

      <div className="calendar-grid">
        {cells.map(cell => {
          const isSelected = cell.isoDate === selectedIsoDate;
          return (
            <div
              key={cell.key}
              className={`cal-day-cell ${cell.isCurrentMonth ? "in-month" : "out-month"} ${cell.isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""} ${cell.visits.length > 0 ? "has-visits" : ""}`}
              onClick={() => setSelectedIsoDate(cell.isoDate)}
            >
              <div className="cal-day-num-wrap">
                <span className={`cal-day-num ${cell.isToday ? "today-badge" : ""}`}>
                  {cell.dayNum}
                </span>
                <div className="cal-day-actions">
                  {cell.visits.length > 0 && (
                    <span className="cal-visit-count-tag" title={`${cell.visits.length} events & reminders`}>
                      {cell.visits.length}
                    </span>
                  )}
                </div>
              </div>

              <div className="cal-chips-list">
                {cell.visits.slice(0, 3).map(v => (
                  <div
                    key={v.id}
                    className={`cal-visit-chip ${v.statusBadgeClass || getStatusBadgeClass(v.status)} ${v.reminderCategory ? `cal-chip-${v.reminderCategory}` : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIsoDate(cell.isoDate);
                      if (v.sourceType === "site-visit" && onSelectVisit) {
                        onSelectVisit(v.sourceSiteVisit || v);
                      }
                    }}
                    title={`${v.displayTitle || v.clientName} (${v.propertyName}) • ${v.visitTime || "Scheduled"} • ${v.status || "Active"}`}
                  >
                    <span className="chip-time">{v.visitTime || "11:00 AM"}</span>
                    <span className="chip-name">{v.displayTitle || v.clientName}</span>
                  </div>
                ))}
                {cell.visits.length > 3 && (
                  <span
                    className="cal-more-visits"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIsoDate(cell.isoDate);
                    }}
                  >
                    +{cell.visits.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="cal-selected-day-panel">
        <div className="cal-day-panel-head">
          <div className="cal-day-panel-title">
            <Clock size={18} className="cal-panel-clock-icon" />
            <div>
              <div className="cal-panel-heading-row">
                <h4>{selectedDateFormatted}</h4>
                {isSelectedToday && <span className="sv-chip-today">TODAY</span>}
                <span className="cal-panel-count-badge">
                  {selectedDateVisits.length} {selectedDateVisits.length === 1 ? "Event & Reminder" : "Events & Reminders"}
                </span>
              </div>
            </div>
          </div>

          <div className="cal-day-panel-actions">
            {!isAdmin && (
              <button
                type="button"
                className="btn primary btn-add-reminder-day"
                onClick={() => onOpenReminderModal && onOpenReminderModal(null, "followup", selectedIsoDate)}
              >
                <Bell size={13} /> Set Client Reminder
              </button>
            )}
          </div>
        </div>

        {selectedDateVisits.length === 0 ? (
          <div className="cal-day-empty-state">
            <CalendarDays size={24} />
            <p>No site visits or client reminders scheduled for this date.</p>
            {!isAdmin && (
              <div className="cal-day-empty-actions">
                <button
                  type="button"
                  className="btn secondary btn-sm"
                  onClick={() => onOpenReminderModal && onOpenReminderModal(null, "followup", selectedIsoDate)}
                >
                  <Bell size={12} /> Set Client Reminder
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="cal-day-visits-grid">
            {selectedDateVisits.map(v => {
              const telUrl = `tel:${cleanTel(v.phone)}`;
              let waText = `Hello ${v.clientName}, looking forward to welcoming you for your site visit at ${v.propertyName}!`;
              if (v.reminderCategory === "followup") {
                waText = `Hello ${v.clientName}, following up regarding your visit to ${v.propertyName}${v.interest ? ` for ${v.interest}` : ""}. How can we assist you with the booking?`;
              } else if (v.reminderCategory === "revisit") {
                waText = `Hello ${v.clientName}, we are looking forward to welcoming you for your re-visit to ${v.propertyName} today. Let us know if you need assistance!`;
              } else if (v.reminderCategory === "booked") {
                waText = `Hello ${v.clientName}, congratulations on your booking at ${v.propertyName}!`;
              } else if (v.reminderCategory === "visited") {
                waText = `Hello ${v.clientName}, thank you for visiting ${v.propertyName}. Please let us know if you would like to schedule a revisit or review unit pricing!`;
              }
              const waUrl = `https://wa.me/${cleanWa(v.phone)}?text=${encodeURIComponent(waText)}`;

              return (
                <div key={v.id} className={`cal-day-visit-card ${v.statusBadgeClass || getStatusBadgeClass(v.status)}`}>
                  <div className="cal-dcard-top">
                    <div className="cal-dcard-time">
                      {v.reminderCategory === "followup" ? <Bell size={13} style={{ color: "#d97706" }} /> :
                       v.reminderCategory === "revisit" ? <CalendarDays size={13} style={{ color: "#0284c7" }} /> :
                       v.reminderCategory === "booked" ? <Check size={13} style={{ color: "#7e22ce" }} /> :
                       v.reminderCategory === "visited" ? <CheckCircle2 size={13} style={{ color: "#059669" }} /> :
                       <Clock size={13} />}
                      <strong>{v.visitTime || "11:00 AM"}</strong>
                    </div>
                    <span className={`sv-status-pill ${v.statusBadgeClass || getStatusBadgeClass(v.status)}`}>
                      {v.reminderCategory === "followup" ? (v.completed ? "Follow-Up Done" : "Follow-Up Due") :
                       v.reminderCategory === "revisit" ? (v.completed ? "Revisit Done" : "Re-visit Scheduled") :
                       v.reminderCategory === "booked" ? "Unit Booked" :
                       v.reminderCategory === "visited" ? "Visited" :
                       (v.status || "Scheduled")}
                    </span>
                  </div>

                  <div className="cal-dcard-body">
                    <h4 className="cal-dcard-client">{v.clientName}</h4>
                    <div className="cal-dcard-meta">
                      <span className="cal-dcard-prop"><Building2 size={12} /> {v.propertyName}</span>
                      {v.interest && <span className="cal-dcard-prop"><Layers size={12} /> {v.interest} {v.budget ? `• ${v.budget}` : ""}</span>}
                      {v.salesperson && <span className="cal-dcard-sales"><UserRound size={12} /> {v.salesperson}</span>}
                    </div>
                    {v.notes && <p className="cal-dcard-notes">"{v.notes}"</p>}
                    {v.feedback && <p className="cal-dcard-feedback"><strong>Feedback:</strong> {v.feedback}</p>}
                  </div>

                  <div className="cal-dcard-actions">
                    <div className="cal-dcard-comms">
                      <a href={telUrl} className="btn-call-mini" title={`Call ${v.clientName}`}>
                        <Phone size={13} /> Call
                      </a>
                      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-wa-mini" title={`WhatsApp ${v.clientName}`}>
                        <WhatsAppIcon size={13} /> WhatsApp
                      </a>
                    </div>
                    <div className="cal-dcard-manage">
                      {v.sourceType === "visited-client" ? (
                        <>
                          {v.reminderCategory === "followup" && (
                            <>
                              {!v.completed ? (
                                <button
                                  type="button"
                                  className="btn-mark-complete-mini"
                                  onClick={() => onUpdateVisit && onUpdateVisit(v.sourceVisit.id, {
                                    followUpCompleted: true,
                                    remarks: v.notes ? `${v.notes} (Follow-up done on ${selectedIsoDate})` : `Follow-up done on ${selectedIsoDate}`
                                  })}
                                  title="Mark follow-up completed"
                                >
                                  <CheckCircle2 size={13} /> Complete
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-reopen-mini"
                                  onClick={() => onUpdateVisit && onUpdateVisit(v.sourceVisit.id, { followUpCompleted: false })}
                                  title="Reopen follow-up"
                                >
                                  Reopen
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn-resched-mini"
                                onClick={() => onOpenReminderModal && onOpenReminderModal(v.sourceVisit, "followup", v.visitDate)}
                                title="Reschedule follow-up"
                              >
                                <Clock size={13} /> Reschedule
                              </button>
                            </>
                          )}

                          {v.reminderCategory === "revisit" && (
                            <>
                              {!v.completed ? (
                                <button
                                  type="button"
                                  className="btn-mark-complete-mini"
                                  onClick={() => onUpdateVisit && onUpdateVisit(v.sourceVisit.id, {
                                    revisitCompleted: true,
                                    remarks: v.notes ? `${v.notes} (Revisit done on ${selectedIsoDate})` : `Revisit done on ${selectedIsoDate}`
                                  })}
                                  title="Mark revisit completed"
                                >
                                  <CheckCircle2 size={13} /> Complete
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-reopen-mini"
                                  onClick={() => onUpdateVisit && onUpdateVisit(v.sourceVisit.id, { revisitCompleted: false })}
                                  title="Reopen revisit"
                                >
                                  Reopen
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn-resched-mini"
                                onClick={() => onOpenReminderModal && onOpenReminderModal(v.sourceVisit, "revisit", v.visitDate)}
                                title="Reschedule revisit"
                              >
                                <Clock size={13} /> Reschedule
                              </button>
                            </>
                          )}

                          {v.reminderCategory === "visited" && (
                            <>
                              {!isAdmin && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-resched-mini"
                                    onClick={() => onOpenReminderModal && onOpenReminderModal(v.sourceVisit, "followup", selectedIsoDate)}
                                    title="Schedule follow-up"
                                  >
                                    <Bell size={11} /> Follow-up
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-resched-mini"
                                    onClick={() => onOpenReminderModal && onOpenReminderModal(v.sourceVisit, "revisit", selectedIsoDate)}
                                    title="Schedule revisit"
                                  >
                                    <CalendarDays size={11} /> Revisit
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                className="btn-mark-complete-mini"
                                onClick={() => onUpdateVisit && onUpdateVisit(v.sourceVisit.id, { status: "Booked" })}
                                title="Mark booked"
                              >
                                <Check size={11} /> Booked
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {v.status !== "Completed" && (
                            <button
                              type="button"
                              className="btn-mark-complete-mini"
                              onClick={() => onCompleteVisit ? onCompleteVisit(v.sourceSiteVisit || v) : (onSelectVisit && onSelectVisit(v.sourceSiteVisit || v))}
                            >
                              <CheckCircle2 size={13} /> Complete
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-resched-mini"
                            onClick={() => onSelectVisit && onSelectVisit(v.sourceSiteVisit || v)}
                          >
                            <Clock size={13} /> Reschedule
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SiteVisits({
  visits = [],
  onUpdateVisit,
  siteVisits = [],
  onAddSiteVisit,
  onUpdateSiteVisit,
  onDeleteSiteVisit
}) {
  const { currentUser, adminPropertyFilter, setAdminPropertyFilter, isAdmin } = useAuth();
  const isPropertyScoped = currentUser?.role === "property";

  const [activeTab, setActiveTab] = useState("calendar");
  const [propertyFilter, setPropertyFilter] = useState("ALL");
  const [q, setQ] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedDateForNew, setSelectedDateForNew] = useState("");
  const [rescheduleVisit, setRescheduleVisit] = useState(null);
  const [completeVisit, setCompleteVisit] = useState(null);

  // Client reminder modal state
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderModalVisit, setReminderModalVisit] = useState(null);
  const [reminderModalType, setReminderModalType] = useState("followup");
  const [reminderModalDate, setReminderModalDate] = useState("");

  const handleOpenReminderModal = (visitObj = null, type = "followup", defaultDateStr = "") => {
    setReminderModalVisit(visitObj);
    setReminderModalType(type);
    setReminderModalDate(defaultDateStr);
    setIsReminderModalOpen(true);
  };

  const handleSaveReminder = ({ visitId, type, date, note }) => {
    const parsed = parseLocalDate(date) || new Date();
    const readableDate = parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    if (type === "followup") {
      onUpdateVisit && onUpdateVisit(visitId, {
        followUpDate: readableDate,
        followUpCompleted: false,
        status: "FollowUp",
        remarks: note || undefined
      });
    } else {
      onUpdateVisit && onUpdateVisit(visitId, {
        revisitDate: readableDate,
        revisitCompleted: false,
        status: "Revisited",
        remarks: note || undefined
      });
    }
  };

  // 1. Scoped Visited Clients
  const scopedVisits = useMemo(() => {
    return visits.filter(v => {
      if (isPropertyScoped && !matchesProperty(v.propertyName, currentUser.property)) return false;
      if (adminPropertyFilter !== "ALL" && !matchesProperty(v.propertyName, adminPropertyFilter)) return false;
      if (propertyFilter !== "ALL" && !matchesProperty(v.propertyName, propertyFilter)) return false;
      if (q.trim()) {
        const query = q.toLowerCase();
        const match = (
          (v.name && v.name.toLowerCase().includes(query)) ||
          (v.phone && v.phone.includes(query)) ||
          (v.propertyName && v.propertyName.toLowerCase().includes(query)) ||
          (v.remarks && v.remarks.toLowerCase().includes(query)) ||
          (v.interest && v.interest.toLowerCase().includes(query))
        );
        if (!match) return false;
      }
      return true;
    });
  }, [visits, isPropertyScoped, currentUser, adminPropertyFilter, propertyFilter, q]);

  // 2. Scoped Site Visits (walkthrough appointments)
  const activeSiteVisits = useMemo(() => {
    return siteVisits.filter(v => {
      if (isPropertyScoped && !matchesProperty(v.propertyName, currentUser.property)) return false;
      if (adminPropertyFilter !== "ALL" && !matchesProperty(v.propertyName, adminPropertyFilter)) return false;
      if (propertyFilter !== "ALL" && !matchesProperty(v.propertyName, propertyFilter)) return false;
      if (q.trim()) {
        const query = q.toLowerCase();
        const match = (
          (v.clientName && v.clientName.toLowerCase().includes(query)) ||
          (v.phone && v.phone.includes(query)) ||
          (v.propertyName && v.propertyName.toLowerCase().includes(query)) ||
          (v.salesperson && v.salesperson.toLowerCase().includes(query)) ||
          (v.notes && v.notes.toLowerCase().includes(query)) ||
          (v.feedback && v.feedback.toLowerCase().includes(query))
        );
        if (!match) return false;
      }
      return true;
    });
  }, [siteVisits, isPropertyScoped, currentUser, adminPropertyFilter, propertyFilter, q]);

  // 3. Unified Calendar Events (Visited clients, follow-up reminders, revisits, booked deals & site walkthroughs)
  const activeCalendarEvents = useMemo(() => {
    const events = [];

    // Process Visited Clients from visits
    scopedVisits.forEach((v) => {
      const vProp = v.propertyName || "Park Solitaire";
      const vDateIso = toLocalYMD(v.date);
      const fuDateIso = v.followUpDate ? toLocalYMD(v.followUpDate) : null;
      const revDateIso = v.revisitDate ? toLocalYMD(v.revisitDate) : null;
      const detectedRem = detectReminderFromRemark(v.remarks);

      // a) Follow-Up Reminder
      const hasFollowUp = Boolean(v.followUpDate) || (v.status || "").toLowerCase().includes("follow") || detectedRem === "followup";
      if (hasFollowUp) {
        const targetDate = fuDateIso || vDateIso;
        if (targetDate) {
          events.push({
            id: `fu-${v.id}`,
            sourceType: "visited-client",
            sourceVisit: v,
            clientName: v.name,
            phone: v.phone,
            propertyName: vProp,
            visitDate: targetDate,
            visitTime: "Follow-Up Reminder",
            reminderCategory: "followup",
            status: v.followUpCompleted ? "Completed" : "Scheduled",
            statusBadgeClass: "status-followup",
            displayTitle: `Follow-Up: ${v.name}`,
            notes: v.remarks,
            interest: v.interest,
            budget: v.budget,
            profession: v.profession,
            salesperson: v.salesperson || "Property Sales Desk",
            completed: Boolean(v.followUpCompleted)
          });
        }
      }

      // b) Re-visit Reminder
      const hasRevisit = Boolean(v.revisitDate) || (v.status || "").toLowerCase().includes("revisit") || detectedRem === "revisit";
      if (hasRevisit) {
        const targetDate = revDateIso || vDateIso;
        if (targetDate) {
          events.push({
            id: `rev-${v.id}`,
            sourceType: "visited-client",
            sourceVisit: v,
            clientName: v.name,
            phone: v.phone,
            propertyName: vProp,
            visitDate: targetDate,
            visitTime: "Client Re-visit",
            reminderCategory: "revisit",
            status: v.revisitCompleted ? "Completed" : "Scheduled",
            statusBadgeClass: "status-revisited",
            displayTitle: `Re-visit: ${v.name}`,
            notes: v.remarks,
            interest: v.interest,
            budget: v.budget,
            profession: v.profession,
            salesperson: v.salesperson || "Property Sales Desk",
            completed: Boolean(v.revisitCompleted)
          });
        }
      }

      // c) Booked Milestone
      const isBooked = (v.status || "").toLowerCase().includes("book") || (v.status || "").toLowerCase().includes("close");
      if (isBooked && vDateIso) {
        events.push({
          id: `book-${v.id}`,
          sourceType: "visited-client",
          sourceVisit: v,
          clientName: v.name,
          phone: v.phone,
          propertyName: vProp,
          visitDate: vDateIso,
          visitTime: "Unit Booked",
          reminderCategory: "booked",
          status: "Booked",
          statusBadgeClass: "status-booked",
          displayTitle: `Booked: ${v.name}`,
          notes: v.remarks,
          interest: v.interest,
          budget: v.budget,
          profession: v.profession,
          salesperson: v.salesperson || "Property Sales Desk",
          completed: true
        });
      }

      // d) Initial Walkthrough / Visit (recorded on date of visit if not already booked)
      if (!isBooked && vDateIso && vDateIso !== fuDateIso && vDateIso !== revDateIso) {
        events.push({
          id: `vis-${v.id}`,
          sourceType: "visited-client",
          sourceVisit: v,
          clientName: v.name,
          phone: v.phone,
          propertyName: vProp,
          visitDate: vDateIso,
          visitTime: "Walkthrough",
          reminderCategory: "visited",
          status: v.status || "Visited",
          statusBadgeClass: "status-visited",
          displayTitle: `Visited: ${v.name}`,
          notes: v.remarks,
          interest: v.interest,
          budget: v.budget,
          profession: v.profession,
          salesperson: v.salesperson || "Property Sales Desk",
          completed: true
        });
      }
    });

    // Process Site Visits (on-ground walkthrough appointments)
    activeSiteVisits.forEach((sv) => {
      const svDate = toLocalYMD(sv.visitDate);
      if (svDate) {
        events.push({
          id: `sv-${sv.id}`,
          sourceType: "site-visit",
          sourceSiteVisit: sv,
          clientName: sv.clientName,
          phone: sv.phone,
          propertyName: sv.propertyName,
          visitDate: svDate,
          visitTime: sv.visitTime || "11:00 AM",
          reminderCategory: "walkthrough",
          status: sv.status || "Scheduled",
          statusBadgeClass: getStatusBadgeClass(sv.status),
          displayTitle: sv.clientName,
          notes: sv.notes,
          feedback: sv.feedback,
          salesperson: sv.salesperson,
          completed: (sv.status || "").toLowerCase() === "completed"
        });
      }
    });

    return events;
  }, [scopedVisits, activeSiteVisits]);

  const upcomingVisits = useMemo(() => {
    return activeSiteVisits
      .filter(v => ["scheduled", "confirmed", "rescheduled"].includes((v.status || "").toLowerCase()))
      .sort((a, b) => {
        const da = parseLocalDate(a.visitDate)?.getTime() || 0;
        const db = parseLocalDate(b.visitDate)?.getTime() || 0;
        return da - db;
      });
  }, [activeSiteVisits]);

  const completedVisits = useMemo(() => {
    return activeSiteVisits
      .filter(v => (v.status || "").toLowerCase() === "completed")
      .sort((a, b) => {
        const da = parseLocalDate(a.visitDate)?.getTime() || 0;
        const db = parseLocalDate(b.visitDate)?.getTime() || 0;
        return db - da;
      });
  }, [activeSiteVisits]);

  const totalCount = activeCalendarEvents.length;
  const todayVisitsCount = activeCalendarEvents.filter(v => isSameDay(v.visitDate, 0)).length;
  const completedCount = activeCalendarEvents.filter(v => v.completed).length;
  const rescheduledCount = activeCalendarEvents.filter(v => (v.status || "").toLowerCase() === "rescheduled" || (v.reminderCategory === "followup" && !v.completed)).length;

  const handleOpenScheduleForDate = (isoDate) => {
    if (isAdmin) return;
    setSelectedDateForNew(isoDate);
    setIsScheduleOpen(true);
  };

  const handleQuickStatusChange = (id, newStatus) => {
    if (newStatus === "Completed") {
      const target = siteVisits.find(v => v.id === id);
      if (target) setCompleteVisit(target);
    } else {
      onUpdateSiteVisit(id, { status: newStatus });
    }
  };

  return (
    <Layout>
      <PageHead
        title="Site Visits"
      >
        <button className="btn secondary" onClick={() => exportSiteVisitsCSV(activeSiteVisits)}>
          <Download size={14} /> Export Visits
        </button>
        {!isAdmin && (
          <button className="btn primary" onClick={() => { setSelectedDateForNew(""); setIsScheduleOpen(true); }}>
            <Plus size={14} /> Schedule Site Visit
          </button>
        )}
      </PageHead>

      <div className="site-visits-metric-cards">
        <div className="sv-metric-card gold">
          <div className="sv-metric-icon"><CalendarDays size={18} /></div>
          <div>
            <span className="sv-metric-num">{totalCount}</span>
            <small>Total Scheduled Visits</small>
          </div>
        </div>

        <div className="sv-metric-card emerald">
          <div className="sv-metric-icon"><Clock size={18} /></div>
          <div>
            <span className="sv-metric-num">{todayVisitsCount}</span>
            <small>Today's Walkthroughs</small>
          </div>
        </div>

        <div className="sv-metric-card purple">
          <div className="sv-metric-icon"><CheckCircle2 size={18} /></div>
          <div>
            <span className="sv-metric-num">{completedCount}</span>
            <small>Completed Visits</small>
          </div>
        </div>

        <div className="sv-metric-card amber">
          <div className="sv-metric-icon"><AlertCircle size={18} /></div>
          <div>
            <span className="sv-metric-num">{rescheduledCount}</span>
            <small>Rescheduled / Pending</small>
          </div>
        </div>
      </div>

      <div className="sv-toolbar">
        {!isPropertyScoped && (
          <div className="sv-property-pills">
            <button
              type="button"
              className={"sv-prop-pill " + (propertyFilter === "ALL" ? "active" : "")}
              onClick={() => setPropertyFilter("ALL")}
            >
              All Properties ({siteVisits.length})
            </button>
            <button
              type="button"
              className={"sv-prop-pill " + (propertyFilter === "Park Solitaire" ? "active" : "")}
              onClick={() => setPropertyFilter("Park Solitaire")}
            >
              Park Solitaire ({siteVisits.filter(v => matchesProperty(v.propertyName, "Park Solitaire")).length})
            </button>
            <button
              type="button"
              className={"sv-prop-pill " + (propertyFilter === "VDPL" ? "active" : "")}
              onClick={() => setPropertyFilter("VDPL")}
            >
              VDPL ({siteVisits.filter(v => matchesProperty(v.propertyName, "VDPL")).length})
            </button>
            <button
              type="button"
              className={"sv-prop-pill " + (propertyFilter === "Luxury Empire" ? "active" : "")}
              onClick={() => setPropertyFilter("Luxury Empire")}
            >
              Luxury Empire ({siteVisits.filter(v => matchesProperty(v.propertyName, "Luxury Empire")).length})
            </button>
          </div>
        )}

        <div className="sv-search-box">
          <Search size={14} className="sv-search-icon" />
          <input
            type="text"
            placeholder="Search visits, salesperson, notes..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          {q && (
            <button type="button" className="sv-search-clear" onClick={() => setQ("")}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="sv-view-tabs">
        <button
          type="button"
          className={"sv-view-tab " + (activeTab === "calendar" ? "active" : "")}
          onClick={() => setActiveTab("calendar")}
        >
          <CalendarDays size={15} />
          <span>Calendar View</span>
        </button>
        <button
          type="button"
          className={"sv-view-tab " + (activeTab === "upcoming" ? "active" : "")}
          onClick={() => setActiveTab("upcoming")}
        >
          <Clock size={15} />
          <span>Upcoming Visits ({upcomingVisits.length})</span>
        </button>
        <button
          type="button"
          className={"sv-view-tab " + (activeTab === "completed" ? "active" : "")}
          onClick={() => setActiveTab("completed")}
        >
          <CheckCircle2 size={15} />
          <span>Completed History ({completedVisits.length})</span>
        </button>
        <button
          type="button"
          className={"sv-view-tab " + (activeTab === "all" ? "active" : "")}
          onClick={() => setActiveTab("all")}
        >
          <ClipboardList size={15} />
          <span>All Visits Table ({activeSiteVisits.length})</span>
        </button>
      </div>

      {activeTab === "calendar" && (
        <CalendarView
          visits={activeCalendarEvents}
          onSelectDate={handleOpenScheduleForDate}
          onSelectVisit={(v) => setRescheduleVisit(v.sourceSiteVisit || v)}
          onCompleteVisit={(v) => setCompleteVisit(v.sourceSiteVisit || v)}
          onUpdateVisit={onUpdateVisit}
          onOpenReminderModal={handleOpenReminderModal}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      )}

      {activeTab === "upcoming" && (
        <div className="sv-upcoming-section">
          {upcomingVisits.length === 0 ? (
            <div className="table-empty-state">
              <CalendarDays size={32} />
              <h4>No upcoming site visits scheduled</h4>
              <p>Schedule a new client walkthrough using the button above or clear your search filters.</p>
            </div>
          ) : (
            <div className="sv-cards-grid">
              {upcomingVisits.map(v => {
                const isToday = isSameDay(v.visitDate, 0);
                const isTom = isSameDay(v.visitDate, -1);
                const telUrl = `tel:${cleanTel(v.phone)}`;
                const waUrl = `https://wa.me/${cleanWa(v.phone)}?text=${encodeURIComponent(`Hello ${v.clientName}, looking forward to welcoming you for your site visit at ${v.propertyName} scheduled on ${v.visitDate} at ${v.visitTime}. Let us know if you need assistance!`)}`;

                return (
                  <div key={v.id} className={`sv-card ${getStatusBadgeClass(v.status)} ${isToday ? "card-today" : ""}`}>
                    <div className="sv-card-top-row">
                      <div className="sv-card-time-badge">
                        <Clock size={13} />
                        <span>{v.visitTime || "11:00 AM"}</span>
                        {isToday && <span className="sv-chip-today">TODAY</span>}
                        {isTom && <span className="sv-chip-tomorrow">TOMORROW</span>}
                      </div>
                      <span className={`sv-status-pill ${getStatusBadgeClass(v.status)}`}>
                        {v.status || "Scheduled"}
                      </span>
                    </div>

                    <div className="sv-card-client-info">
                      <h4 className="sv-card-client-name">{v.clientName}</h4>
                      <div className="sv-card-prop-tag">
                        <Building2 size={12} />
                        <span>{v.propertyName}</span>
                      </div>
                      <div className="sv-card-sales-row">
                        <UserRound size={12} />
                        <span>Salesperson: <b>{v.salesperson}</b></span>
                      </div>
                      <div className="sv-card-date-row">
                        <CalendarDays size={12} />
                        <span>Visit Date: <b>{v.visitDate}</b></span>
                      </div>
                      {v.notes && (
                        <div className="sv-card-note-box">
                          <span className="sv-note-label">Notes:</span>
                          <p>{v.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="sv-card-contact-actions">
                      <a href={telUrl} className="sv-btn-action btn-call" title={`Call ${v.clientName}`}>
                        <PhoneCall size={13} />
                        <span>Call</span>
                      </a>
                      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="sv-btn-action btn-wa" title={`WhatsApp ${v.clientName}`}>
                        <WhatsAppIcon size={14} />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <div className="sv-card-footer-actions">
                      <button
                        type="button"
                        className="sv-btn-ctrl btn-resched"
                        onClick={() => setRescheduleVisit(v)}
                        title="Reschedule visit date/time"
                      >
                        <Clock size={12} />
                        <span>Reschedule</span>
                      </button>

                      {v.status !== "Confirmed" && (
                        <button
                          type="button"
                          className="sv-btn-ctrl btn-confirm"
                          onClick={() => handleQuickStatusChange(v.id, "Confirmed")}
                          title="Confirm visit with client"
                        >
                          <Check size={12} />
                          <span>Confirm</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="sv-btn-ctrl btn-complete"
                        onClick={() => setCompleteVisit(v)}
                        title="Mark visit as completed & record feedback"
                      >
                        <CheckCircle2 size={12} />
                        <span>Complete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "completed" && (
        <div className="sv-completed-section">
          {completedVisits.length === 0 ? (
            <div className="table-empty-state">
              <CheckCircle2 size={32} />
              <h4>No completed visits recorded yet</h4>
              <p>When prospective buyers finish their property walkthrough, mark them completed to log feedback.</p>
            </div>
          ) : (
            <div className="sv-completed-grid">
              {completedVisits.map(v => {
                const telUrl = `tel:${cleanTel(v.phone)}`;
                const waUrl = `https://wa.me/${cleanWa(v.phone)}?text=${encodeURIComponent(`Hello ${v.clientName}, thank you for visiting ${v.propertyName}! Following up on your discussion regarding ${v.propertyName}.`)}`;

                return (
                  <div key={v.id} className="sv-completed-card">
                    <div className="sv-comp-head">
                      <div>
                        <div className="sv-comp-name-row">
                          <h4>{v.clientName}</h4>
                          <span className="sv-prop-badge">{v.propertyName}</span>
                        </div>
                        <span className="sv-comp-meta">
                          Visited on {v.visitDate} • Salesperson: <b>{v.salesperson}</b>
                        </span>
                      </div>
                      <span className="sv-status-pill badge-status-completed">Completed</span>
                    </div>

                    {v.feedback ? (
                      <div className="sv-feedback-callout">
                        <span className="sv-fb-label">Client Feedback & Discussion:</span>
                        <p className="sv-fb-text">"{v.feedback}"</p>
                      </div>
                    ) : (
                      <div className="sv-feedback-callout empty">
                        <span className="sv-fb-label">Feedback:</span>
                        <p className="sv-fb-text">No feedback logged yet.</p>
                      </div>
                    )}

                    {v.nextFollowUpDate && (
                      <div className="sv-next-followup-pill">
                        <CalendarDays size={13} />
                        <span>Next Follow-up Scheduled: <b>{v.nextFollowUpDate}</b></span>
                      </div>
                    )}

                    {v.notes && (
                      <div className="sv-notes-preview">
                        <small>Notes: {v.notes}</small>
                      </div>
                    )}

                    <div className="sv-comp-actions">
                      <a href={telUrl} className="sv-btn-action btn-call" title={`Call ${v.clientName}`}>
                        <PhoneCall size={13} />
                        <span>Call</span>
                      </a>
                      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="sv-btn-action btn-wa" title={`WhatsApp ${v.clientName}`}>
                        <WhatsAppIcon size={14} />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        className="sv-btn-ctrl btn-resched"
                        onClick={() => setCompleteVisit(v)}
                        title="Update visit feedback or next follow-up date"
                      >
                        <Edit3 size={12} />
                        <span>Update Feedback</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "all" && (
        <section className="panel sv-table-panel">
          <div className="table-wrap">
            <table className="visit-table">
              <thead>
                <tr>
                  <th>CLIENT DETAILS</th>
                  <th>PROPERTY</th>
                  <th>VISIT DATE & TIME</th>
                  <th>SALESPERSON</th>
                  <th>STATUS</th>
                  <th>FEEDBACK & NOTES</th>
                  <th>NEXT FOLLOW-UP</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {activeSiteVisits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-cell">
                      No site visits match the current criteria.
                    </td>
                  </tr>
                ) : (
                  activeSiteVisits.map(v => (
                    <tr key={v.id}>
                      <td className="sticky-col">
                        <div className="client-cell-name">
                          <strong>{v.clientName}</strong>
                          <span className="client-cell-phone">{v.phone}</span>
                        </div>
                      </td>
                      <td>
                        <span className="prop-name-tag">{v.propertyName}</span>
                      </td>
                      <td>
                        <div className="sv-td-date">
                          <strong>{v.visitDate}</strong>
                          <small>{v.visitTime || "11:00 AM"}</small>
                        </div>
                      </td>
                      <td>
                        <span className="sv-salesperson-tag">{v.salesperson}</span>
                      </td>
                      <td>
                        <select
                          className={`sv-table-status-select ${getStatusBadgeClass(v.status)}`}
                          value={v.status || "Scheduled"}
                          onChange={(e) => handleQuickStatusChange(v.id, e.target.value)}
                        >
                          {SITE_VISIT_STATUSES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td className="sv-remarks-td">
                        {v.feedback ? (
                          <div className="sv-table-feedback">
                            <b>Feedback:</b> {v.feedback}
                          </div>
                        ) : null}
                        {v.notes ? <div className="sv-table-notes">{v.notes}</div> : null}
                        {!v.feedback && !v.notes && <span className="text-muted">—</span>}
                      </td>
                      <td>
                        {v.nextFollowUpDate ? (
                          <span className="sv-table-fu-date">{v.nextFollowUpDate}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <div className="sv-table-actions">
                          <button
                            type="button"
                            className="btn-tbl-action"
                            onClick={() => setRescheduleVisit(v)}
                            title="Reschedule Visit"
                          >
                            <Clock size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-tbl-action delete"
                            onClick={() => onDeleteSiteVisit && onDeleteSiteVisit(v.id)}
                            title="Delete Visit"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!isAdmin && (
        <ScheduleSiteVisitModal
          isOpen={isScheduleOpen}
          defaultDate={selectedDateForNew}
          onClose={() => setIsScheduleOpen(false)}
          onSave={(data) => {
            onAddSiteVisit(data);
            setIsScheduleOpen(false);
          }}
        />
      )}

      <RescheduleSiteVisitModal
        visit={rescheduleVisit}
        isOpen={Boolean(rescheduleVisit)}
        onClose={() => setRescheduleVisit(null)}
        onSave={(id, updates) => {
          onUpdateSiteVisit(id, updates);
          setRescheduleVisit(null);
        }}
      />

      <CompleteSiteVisitModal
        visit={completeVisit}
        isOpen={Boolean(completeVisit)}
        onClose={() => setCompleteVisit(null)}
        onSave={(id, updates) => {
          onUpdateSiteVisit(id, updates);
          setCompleteVisit(null);
        }}
      />

      {!isAdmin && (
        <ScheduleReminderModal
          visits={scopedVisits}
          initialVisit={reminderModalVisit}
          isOpen={isReminderModalOpen}
          onClose={() => {
            setIsReminderModalOpen(false);
            setReminderModalVisit(null);
          }}
          onSave={handleSaveReminder}
          defaultDate={reminderModalDate}
          defaultType={reminderModalType}
        />
      )}
    </Layout>
  );
}

function AllVisits({ visits, onUpdateVisit }) {
  const auth = useAuth();
  const { currentUser, adminPropertyFilter, setAdminPropertyFilter } = auth;
  const isPropertyScoped = currentUser?.role === "property";

  const activeVisits = useMemo(() => {
    if (isPropertyScoped) {
      return visits.filter(v => matchesProperty(v.propertyName, currentUser.property));
    }
    if (adminPropertyFilter && adminPropertyFilter !== "ALL") {
      return visits.filter(v => matchesProperty(v.propertyName, adminPropertyFilter));
    }
    return visits;
  }, [visits, isPropertyScoped, currentUser, adminPropertyFilter]);

  const total = activeVisits.length;
  const personal = activeVisits.filter(v => v.aspiration === "Personal Use").length;
  const investment = activeVisits.filter(v => v.aspiration === "Investment").length;

  const todayCount = activeVisits.filter(v => isSameDay(v.date, 0)).length;
  const yestCount = activeVisits.filter(v => isSameDay(v.date, 1)).length;

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = [
    "All",
    "Personal Use",
    "Investment",
    "1BHK",
    "2BHK",
    "3BHK"
  ];
  const filtered = activeVisits.filter((v) => {
    const text = Object.values(v).join(" ").toLowerCase();
    const match = text.includes(q.toLowerCase());
    let ok = true;
    if (filter === "Personal Use" || filter === "Investment")
      ok = v.aspiration === filter;
    if (["1BHK", "2BHK", "3BHK"].includes(filter))
      ok = v.interest.includes(filter);
    return match && ok;
  });
  return (
    <Layout>
      <PageHead
        title="All Visits"
        subtitle={isPropertyScoped ? `Complete visit submissions for ${currentUser.property}` : "Complete list of client property visit submissions"}
      >
        <button className="btn secondary" onClick={() => exportVisitsCSV(activeVisits)}>
          <Download size={14} /> Export
        </button>
      </PageHead>
      <div className="stats">
        <Stat label="TOTAL VISITS" value={total} detail="+ 0 this week" active />
        <Stat label="TODAY" value={todayCount} detail={`+ ${yestCount} yesterday`} />
        <Stat label="PERSONAL USE" value={personal} detail={`${Math.round(personal / Math.max(total, 1) * 100)}% of total`} />
        <Stat label="INVESTMENT" value={investment} detail={`${Math.round(investment / Math.max(total, 1) * 100)}% of total`} />
      </div>

      {/* Admin Portfolio Property Filter Bar */}
      {!isPropertyScoped && (
        <div className="all-visits-prop-bar">
          <span className="prop-filter-label"><Layers size={14} /> Property:</span>
          <div className="prop-filter-chips">
            <button
              type="button"
              className={"prop-chip " + (adminPropertyFilter === "ALL" ? "active" : "")}
              onClick={() => setAdminPropertyFilter("ALL")}
            >
              All Properties ({visits.length})
            </button>
            {AVAILABLE_PROPERTIES.map(p => {
              const count = visits.filter(v => matchesProperty(v.propertyName, p.name)).length;
              return (
                <button
                  type="button"
                  key={p.name}
                  className={"prop-chip " + (adminPropertyFilter === p.name ? "active" : "")}
                  onClick={() => setAdminPropertyFilter(p.name)}
                >
                  {p.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="filters">
        <div className="searchbox">
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search client, phone, remarks..."
          />
          {q && (
            <button
              className="clear-search-btn"
              onClick={() => setQ("")}
              title="Clear search"
              type="button"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button className="filter-btn">
          <Filter size={14} /> Filters
        </button>
      </div>
      <div className="filter-pills">
        {filters.map((x) => (
          <button
            key={x}
            className={filter === x ? "selected" : ""}
            onClick={() => setFilter(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>All Client Visits</h3>
          </div>
          <span className="pill-soft">{filtered.length} records</span>
        </div>
        {filtered.length === 0 ? (
          <div className="table-empty-state">
            <Search size={32} />
            <h4>No matching visits found</h4>
            <p>Try clearing your search query or selecting "All" filters.</p>
            <button
              className="btn secondary"
              onClick={() => {
                setQ("");
                setFilter("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <VisitTable
            visits={filtered}
            onUpdateVisit={onUpdateVisit}
            showPropertyBadge={!isPropertyScoped}
          />
        )}
      </section>
    </Layout>
  );
}

function Reports({visits}) {
  const { currentUser, adminPropertyFilter } = useAuth();
  const isPropertyScoped = currentUser?.role === "property";
  const activeVisits = useMemo(() => {
    if (isPropertyScoped) {
      return visits.filter(v => matchesProperty(v.propertyName, currentUser.property));
    }
    if (adminPropertyFilter && adminPropertyFilter !== "ALL") {
      return visits.filter(v => matchesProperty(v.propertyName, adminPropertyFilter));
    }
    return visits;
  }, [visits, isPropertyScoped, currentUser, adminPropertyFilter]);

  const total = activeVisits.length || 1;
  const types = ["1BHK","2BHK","3BHK","SHOP","2BHK Jodi","Office"];
  const counts = types.map(t=>[t, activeVisits.filter(v=>(v.interest || "").includes(t)).length]);
  const max = Math.max(...counts.map(x=>x[1]), 1);
  const sources = ["Walk-in","Channel Partner","Social Media Ad","Existing Customer","Director Reference","Website","Outdoor Banner"];
  return (
    <Layout>
      <PageHead
        title="Reports"
        subtitle={isPropertyScoped ? `Visit analytics & performance for ${currentUser.property}` : "Visit analytics & performance overview across all properties"}
      >
        <button className="select-small">This Month <ChevronDown size={12}/></button>
        <button className="btn primary"><Download size={14}/> Download PDF</button>
      </PageHead>
      <div className="stats four">
        <Stat label="TOTAL VISITS" value={activeVisits.length} detail="+ 18% vs last month"/>
        <Stat label="CONVERSION RATE" value="12.5%" detail="+ 2.1% vs last month"/>
        <Stat label="AVG. BUDGET" value="78 L" detail="Across all visits"/>
        <Stat label="TOP PROPERTY" value="2BHK" detail="38% of visits"/>
      </div>
      <div className="report-grid">
        <section className="panel chart-panel">
          <div className="panel-head"><h3>Visits by Property Type</h3></div>
          <div className="bar-chart">
            {counts.map(([label,n])=>(
              <div className="bar-col" key={label}>
                <span>{n}</span>
                <div className="bar" style={{height:`${Math.max(8,n/max*130)}px`}}></div>
                <small>{label}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h3>How Clients Heard About Us</h3></div>
          <div className="source-bars">
            {sources.map((s,i)=>{
              let n=Math.max(1,Math.round(total*(0.2-i*.018)));
              return (
                <div className="source-row" key={s}>
                  <span>{s}</span>
                  <div><i style={{width:`${Math.min(100,n/Math.max(total,1)*100*3)}%`}}/></div>
                  <b>{Math.round(n/total*100)}%</b>
                </div>
              );
            })}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h3>Interest vs Aspiration</h3></div>
          <SimpleTable rows={counts.slice(0,5).map(([t,n])=>[t,Math.ceil(n*.45),Math.floor(n*.55),n])}/>
        </section>
        <section className="panel">
          <div className="panel-head"><h3>Top Performing Sources</h3></div>
          <SimpleTable rows={sources.slice(0,5).map((s,i)=>[s,Math.max(1,5-i),Math.max(1,3-i),`${Math.max(10,31-i*4)}%`])}/>
        </section>
      </div>
    </Layout>
  );
}

function SimpleTable({rows}) {
 return <div className="simple-table">{rows.map((r,i)=><div className="simple-row" key={i}>{r.map((x,j)=><span key={j} className={j===0?"first":""}>{x}</span>)}</div>)}</div>
}

const initialForm={name:"",phone:"",email:"",date:toLocalYMD(new Date()),address:"",profession:"",property:"",budget:"",aspiration:"Personal Use",source:[],cp:"",remarks:""};

function VisitForm({onAdd}) {
  const navigate = useNavigate();
  const { currentUser, adminPropertyFilter } = useAuth();
  const isPropertyScoped = currentUser?.role === "property";
  const defaultProp = isPropertyScoped && currentUser?.property
    ? currentUser.property
    : (adminPropertyFilter && adminPropertyFilter !== "ALL" ? adminPropertyFilter : "Park Solitaire");
  const [targetProperty, setTargetProperty] = useState(defaultProp);
  const [customOtherTarget, setCustomOtherTarget] = useState("");
  const [form,setForm]=useState(initialForm);
  const [error,setError]=useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedProperty, setSubmittedProperty] = useState("");
  const [submittedClientName, setSubmittedClientName] = useState("");

  useEffect(() => {
    if (isPropertyScoped && currentUser?.property) {
      setTargetProperty(currentUser.property);
    } else if (adminPropertyFilter && adminPropertyFilter !== "ALL") {
      setTargetProperty(adminPropertyFilter);
    }
  }, [isPropertyScoped, currentUser?.property, adminPropertyFilter]);

  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const sources=["Pamphlet","Channel Partner","Social Media Ad","Existing Customer","Director Reference","Outdoor Banner","Website","Walk-in"];
  const toggleSource=s=>set("source",form.source.includes(s)?form.source.filter(x=>x!==s):[...form.source,s]);
  function handlePhoneChange(e) {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length === 12 && val.startsWith("91")) val = val.slice(2);
    else if (val.length === 11 && val.startsWith("0")) val = val.slice(1);
    set("phone", val.slice(0, 10));
  }

  function submit(e){
    e.preventDefault();
    setError("");
    if(!form.name.trim()||!form.phone.trim()||!form.date){
      setError("Please fill all required fields.");
      return;
    }
    const cleanPhone = form.phone.replace(/\D/g, "");
    if(cleanPhone.length !== 10){
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    const assignedProperty = isPropertyScoped && currentUser?.property
      ? currentUser.property
      : (targetProperty === "Other" && customOtherTarget.trim() ? customOtherTarget.trim() : (targetProperty || "Park Solitaire"));
    const newId = Date.now();
    savePropertyToCache(newId, assignedProperty);
    const cleanCpVal = form.cp ? form.cp.replace(/\[PROP:[^\]]+\]/g, "").trim() : "";
    const taggedCp = cleanCpVal ? `${cleanCpVal} [PROP:${assignedProperty}]` : `[PROP:${assignedProperty}]`;

    onAdd({
      ...form,
      id: newId,
      date: (parseLocalDate(form.date) || new Date()).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),
      phone: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
      propertyName: assignedProperty,
      cp: taggedCp,
      interest:form.property||"2BHK",
      budget:form.budget||"—",
      profession:form.profession||"—",
      source:form.source.join(", ")||"Walk-in",
      status:"Visited",
      remarks:form.remarks||""
    });

    setSubmittedProperty(assignedProperty);
    setSubmittedClientName(form.name);
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="form-page">
        <div className="form-top">
          {isPropertyScoped && currentUser?.property ? (
            <PropertyBrand
              propertyName={currentUser.property}
              subtitle={currentUser.property === "Park Solitaire" ? "Lifespaces LLP" : "Visit Desk"}
            />
          ) : (
            <Logo />
          )}
          <div className="form-top-actions">
            <NavLink to="/login" className="form-desk-switch-link" title="Switch Desk / Login">
              <Building2 size={13} />
              <span>Switch Desk</span>
            </NavLink>
            <NavLink to="/admin" className="admin-link">Dashboard</NavLink>
          </div>
        </div>

        <div className="visit-submitted-wrap">
          <div className="visit-submitted-card">
            <div className="visit-submitted-icon-wrap">
              <CheckCircle2 size={34} />
            </div>

            <h2 className="visit-submitted-title">
              Thank you for visiting {submittedProperty}!
            </h2>

            <p className="visit-submitted-desc">
              Your visit details for <strong>{submittedClientName}</strong> have been recorded successfully.
            </p>

            <div className="visit-submitted-actions">
              <button
                type="button"
                className="btn primary"
                onClick={() => navigate("/admin")}
              >
                <LayoutDashboard size={16} /> Go to Dashboard
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setForm(initialForm);
                  setIsSubmitted(false);
                }}
              >
                <Plus size={15} /> New Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-top">
        {isPropertyScoped && currentUser?.property ? (
          <PropertyBrand
            propertyName={currentUser.property}
            subtitle={currentUser.property === "Park Solitaire" ? "Lifespaces LLP" : "Visit Desk"}
          />
        ) : (
          <Logo />
        )}
        <div className="form-top-actions">
          <NavLink to="/login" className="form-desk-switch-link" title="Switch Desk / Login">
            <Building2 size={13} />
            <span>Switch Desk</span>
          </NavLink>
          <NavLink to="/admin" className="admin-link">Dashboard</NavLink>
        </div>
      </div>

      {isPropertyScoped ? (
        <div className="form-property-banner property-desk-mode">
          <div className="form-prop-badge-icon">
            <Building2 size={18} />
          </div>
          <div className="form-prop-desc">
            <div className="form-prop-desk-title">{currentUser.property} — Dedicated Visit Desk</div>
            <span>Walk-in submissions are automatically tagged & routed to {currentUser.property}</span>
          </div>
          <NavLink to="/login" className="form-desk-switch-btn">Switch Desk</NavLink>
        </div>
      ) : (
        <div className="form-property-banner admin-desk-mode">
          <div className="form-prop-badge-icon admin">
            <ShieldCheck size={18} />
          </div>
          <div className="form-prop-desc">
            <div className="form-prop-desk-title">Master Admin — Target Property Assignment</div>
            <div className="form-prop-selector-chips">
              {AVAILABLE_PROPERTIES.map(p => (
                <button
                  type="button"
                  key={p.name}
                  className={`form-prop-chip ${targetProperty === p.name ? "active" : ""}`}
                  onClick={() => setTargetProperty(p.name)}
                >
                  <span>{p.name}</span>
                  <small>{p.category}</small>
                </button>
              ))}
            </div>
            {targetProperty === "Other" && (
              <div style={{ marginTop: "8px" }}>
                <input
                  type="text"
                  value={customOtherTarget}
                  onChange={e => setCustomOtherTarget(e.target.value)}
                  placeholder="Specify custom property name (optional)..."
                  style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", width: "100%", maxWidth: "320px" }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="form-title">
        <h1>Visit Form</h1>
        <p>Please fill in the details below. Fields marked with <b>*</b> are required.</p>
      </div>
      <form className="form-card" onSubmit={submit}>
        <FormSection number="1" title="Client Details">
          <div className="form-grid">
            <Field label="First Name" required><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Enter first name"/></Field>
            <Field label="Date" required><input type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></Field>
            <Field label="Phone No." required>
              <div className="phone-wrap">
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit number"
                />
              </div>
            </Field>
            <Field label="Mail ID"><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="name@example.com"/></Field>
            <Field label="Address" wide><input value={form.address} onChange={e=>set("address",e.target.value)} placeholder="Enter full address"/></Field>
            <Field label="Profession" wide><input value={form.profession} onChange={e=>set("profession",e.target.value)} placeholder="e.g. Business, Service, Doctor..."/></Field>
          </div>
        </FormSection>
        <FormSection number="2" title="Interest & Aspiration">
          <div className="form-grid">
            <Field label="Your Interest">
              <select value={form.property} onChange={e=>set("property",e.target.value)}>
                <option value="">Select interest</option>
                <option>1BHK</option><option>2BHK</option><option>3BHK</option>
                <option>SHOP</option><option>2BHK Jodi</option><option>Rent</option>
                <option>Jodi Shops</option><option>Jodi Office</option><option>Office</option>
              </select>
              <div className="quick-chips">
                {["1BHK", "2BHK", "3BHK", "SHOP", "2BHK Jodi", "Office"].map(opt => (
                  <button
                    type="button"
                    key={opt}
                    className={"quick-chip " + (form.property === opt ? "active" : "")}
                    onClick={() => set("property", opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Budget (₹)">
              <input value={form.budget} onChange={e=>set("budget",e.target.value)} placeholder="e.g. 50 Lakh / 1 Cr"/>
              <div className="quick-chips">
                {["45 Lakh", "60 Lakh", "85 Lakh", "1.2 Cr", "1.8 Cr", "2.5 Cr"].map(b => (
                  <button
                    type="button"
                    key={b}
                    className={"quick-chip " + (form.budget === b ? "active" : "")}
                    onClick={() => set("budget", b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="field full aspiration-container-field">
            <div className="aspiration-header-wrap">
              <label className="aspiration-label-title">
                <Sparkles size={14} className="aspiration-gold-star" />
                <span>Your Aspiration</span>
              </label>
              <span className="aspiration-sub-badge">Select property usage goal</span>
            </div>

            <div className="aspiration-cards-grid">
              {/* Option 1: Personal Use */}
              <div
                className={`aspiration-luxury-card ${form.aspiration === "Personal Use" ? "active" : ""}`}
                onClick={() => set("aspiration", "Personal Use")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    set("aspiration", "Personal Use");
                  }
                }}
              >
                <div className="aspiration-card-top">
                  <div className="aspiration-icon-wrap home-icon-wrap">
                    <Home size={18} />
                  </div>
                  <div className="aspiration-check-ring">
                    <div className="aspiration-inner-dot" />
                  </div>
                </div>
                <div className="aspiration-card-body">
                  <div className="aspiration-card-headline">
                    <h4>Personal Use</h4>
                    <span className="aspiration-pill-tag tag-personal">Own Living</span>
                  </div>
                  <p className="aspiration-card-desc">
                    Own dream home, family residency & luxury living lifestyle
                  </p>
                </div>
                <input
                  type="radio"
                  name="aspiration"
                  value="Personal Use"
                  checked={form.aspiration === "Personal Use"}
                  onChange={() => set("aspiration", "Personal Use")}
                  className="aspiration-hidden-input"
                  aria-label="Personal Use"
                />
              </div>

              {/* Option 2: Investment */}
              <div
                className={`aspiration-luxury-card ${form.aspiration === "Investment" ? "active" : ""}`}
                onClick={() => set("aspiration", "Investment")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    set("aspiration", "Investment");
                  }
                }}
              >
                <div className="aspiration-card-top">
                  <div className="aspiration-icon-wrap invest-icon-wrap">
                    <TrendingUp size={18} />
                  </div>
                  <div className="aspiration-check-ring">
                    <div className="aspiration-inner-dot" />
                  </div>
                </div>
                <div className="aspiration-card-body">
                  <div className="aspiration-card-headline">
                    <h4>Investment</h4>
                    <span className="aspiration-pill-tag tag-invest">ROI & Yield</span>
                  </div>
                  <p className="aspiration-card-desc">
                    Capital growth, high rental returns & wealth asset building
                  </p>
                </div>
                <input
                  type="radio"
                  name="aspiration"
                  value="Investment"
                  checked={form.aspiration === "Investment"}
                  onChange={() => set("aspiration", "Investment")}
                  className="aspiration-hidden-input"
                  aria-label="Investment"
                />
              </div>
            </div>
          </div>
        </FormSection>
        <FormSection number="3" title="How did you Hear About us?">
          <div className="check-grid">{sources.map(s=><label key={s} className="check-pill"><input type="checkbox" checked={form.source.includes(s)} onChange={()=>toggleSource(s)}/><span>{s}</span></label>)}</div>
          <div className="form-grid extra"><Field label="Channel Partner / CP"><input value={form.cp} onChange={e=>set("cp",e.target.value)} placeholder="Optional"/></Field><Field label="Remarks"><input value={form.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Optional"/></Field></div>
        </FormSection>
        {error&&<div className="error-box">{error}</div>}
        <div className="form-actions"><button type="button" className="btn secondary" onClick={()=>setForm(initialForm)}>Clear Form</button><button className="btn primary" type="submit">Submit</button></div>
      </form>
    </div>
  );
}

function FormSection({number,title,children}){return <section className="form-section"><h2><span>{number}</span>{title}</h2>{children}</section>}
function Field({label,required,wide,children}){return <div className={"field "+(wide?"wide":"")}><label>{label}{required&&<b> *</b>}</label>{children}</div>}

function exportClientsCSV(clients) {
  const headers = ["Name", "Profession", "Phone", "Email", "Location", "Interest", "Aspiration", "Budget", "Visits"];
  const rows = clients.map(c => [
    `"${c.name}"`,
    `"${c.profession || ''}"`,
    `"${c.phone || ''}"`,
    `"${c.mail || c.email || ''}"`,
    `"${c.address || c.location || ''}"`,
    `"${c.interest || ''}"`,
    `"${c.aspiration || ''}"`,
    `"${c.budget || ''}"`,
    c.visitsCount || 1
  ]);
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `clients-export-${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const CLIENT_STATUS_FLOW = [
  { key: "Visited", label: "Visited", step: 1 },
  { key: "FollowUp", label: "Follow-Up", step: 2 },
  { key: "Revisited", label: "Re-visited", step: 3 },
  { key: "Booked", label: "Booked", step: 4 },
  { key: "Closed", label: "Closed", step: 5 }
];

function getStatusIndex(status) {
  const norm = (status || "Visited").toLowerCase().replace(/[^a-z]/g, "");
  if (norm.includes("close")) return 4;
  if (norm.includes("book")) return 3;
  if (norm.includes("revisit")) return 2;
  if (norm.includes("follow")) return 1;
  return 0;
}

function ClientStatusFlow({ status, onStatusChange }) {
  const currentIndex = getStatusIndex(status);

  return (
    <div className="client-flow-section" data-testid="client-status-flow">
      <div className="client-flow-header">
        <div className="flow-title-group">
          <span className="flow-title">Status Journey</span>
        </div>
        <span className="flow-step-pill">
          Stage {currentIndex + 1}/5: <b>{CLIENT_STATUS_FLOW[currentIndex].label}</b>
        </span>
      </div>

      <div className="client-flow-track">
        {CLIENT_STATUS_FLOW.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          let stepClass = "flow-step";
          if (isDone) stepClass += " done";
          if (isCurrent) stepClass += " current";
          if (isPending) stepClass += " pending";

          return (
            <div
              key={stage.key}
              className={stepClass}
              onClick={() => onStatusChange && onStatusChange(stage.key)}
              title={onStatusChange ? `Update status to ${stage.label}` : `Status: ${stage.label}`}
              role={onStatusChange ? "button" : undefined}
              tabIndex={onStatusChange ? 0 : undefined}
            >
              <div className="flow-node">
                {isDone ? (
                  <Check size={10} strokeWidth={3} />
                ) : (
                  <span>{stage.step}</span>
                )}
              </div>
              <span className="flow-step-label">{stage.label}</span>
              {idx < CLIENT_STATUS_FLOW.length - 1 && (
                <div className={`flow-bar ${idx < currentIndex ? "filled" : ""}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddClientModal({ isOpen, onClose, onSave, defaultProperty = "Park Solitaire" }) {
  if (!isOpen) return null;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [propertyName, setPropertyName] = useState(defaultProperty);
  const [interest, setInterest] = useState("2BHK");
  const [budget, setBudget] = useState("60 Lakh");
  const [aspiration, setAspiration] = useState("Personal Use");
  const [status, setStatus] = useState("Visited");
  const [remarks, setRemarks] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) {
      setErr("Client name is required.");
      return;
    }
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setErr("Valid 10-digit mobile number is required.");
      return;
    }
    const formattedPhone = cleanDigits.length === 10
      ? `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`
      : phone;

    const assignedProp = propertyName || defaultProperty || "Park Solitaire";
    const newId = Date.now();
    savePropertyToCache(newId, assignedProp);

    onSave({
      id: newId,
      name: name.trim(),
      phone: formattedPhone,
      mail: email.trim(),
      address: address.trim() || "Mumbai",
      profession: profession.trim() || "Client",
      propertyName: assignedProp,
      cp: `[PROP:${assignedProp}]`,
      interest,
      budget,
      aspiration,
      status,
      source: "Direct Entry",
      visitsCount: 1,
      date: getRelativeDateStr(0),
      remarks: remarks.trim()
    });
    onClose();
  };

  return (
    <div className="client-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="client-modal-card" onClick={e => e.stopPropagation()}>
        <div className="client-modal-head">
          <div className="client-modal-head-title">
            <div className="client-modal-badge gold"><Users size={18} /></div>
            <div>
              <h3>Add New Client</h3>
              <p>Register a prospective buyer or investor into the CRM directory</p>
            </div>
          </div>
          <button type="button" className="client-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {err && <div className="client-form-error-banner"><AlertCircle size={14} /><span>{err}</span></div>}

        <form onSubmit={handleSubmit} className="client-modal-form">
          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Client Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kulkarni"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="client-form-field">
              <label>Mobile Number *</label>
              <div className="sv-phone-input-wrap">
                <span className="sv-phone-prefix">+91</span>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/[^\d\s+-]/g, '').slice(0, 14))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="e.g. ramesh@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="client-form-field">
              <label>Profession</label>
              <input
                type="text"
                placeholder="e.g. Business, Doctor, IT Professional"
                value={profession}
                onChange={e => setProfession(e.target.value)}
              />
            </div>
          </div>

          <div className="client-form-field">
            <label>Location / Full Address</label>
            <input
              type="text"
              placeholder="e.g. Andheri West, Mumbai"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Assigned Property *</label>
              <select value={propertyName} onChange={e => setPropertyName(e.target.value)}>
                <option value="Park Solitaire">Park Solitaire</option>
                <option value="VDPL">VDPL (Veena Developer Pvt LTD)</option>
                <option value="Luxury Empire">Luxury Empire</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="client-form-field">
              <label>Unit Interest *</label>
              <select value={interest} onChange={e => setInterest(e.target.value)}>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="2BHK Jodi">2BHK Jodi</option>
                <option value="SHOP">SHOP</option>
                <option value="Office">Office</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Duplex">Duplex</option>
              </select>
            </div>
          </div>

          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Budget</label>
              <input
                type="text"
                placeholder="e.g. 85 Lakh / 1.5 Cr"
                value={budget}
                onChange={e => setBudget(e.target.value)}
              />
            </div>
            <div className="client-form-field">
              <label>Aspiration *</label>
              <select value={aspiration} onChange={e => setAspiration(e.target.value)}>
                <option value="Personal Use">Personal Use (Own Living)</option>
                <option value="Investment">Investment (High ROI & Yield)</option>
              </select>
            </div>
          </div>

          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Pipeline Stage / Status *</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Visited">Visited</option>
                <option value="FollowUp">Follow-Up</option>
                <option value="Revisited">Re-visited</option>
                <option value="Booked">Booked</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="client-form-field">
            <label>Discussion Remarks & Notes</label>
            <textarea
              rows={3}
              placeholder="Record preferences, visit takeaways, financing details..."
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
          </div>

          <div className="client-modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">
              <Check size={14} /> Add Client Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditClientModal({ client, isOpen, onClose, onSave }) {
  if (!isOpen || !client) return null;
  const [name, setName] = useState(() => client.name || "");
  const [phone, setPhone] = useState(() => client.phone || "");
  const [email, setEmail] = useState(() => client.mail || client.email || "");
  const [address, setAddress] = useState(() => client.address || client.location || "");
  const [profession, setProfession] = useState(() => client.profession || "");
  const [propertyName, setPropertyName] = useState(() => client.propertyName || "Park Solitaire");
  const [interest, setInterest] = useState(() => client.interest || "2BHK");
  const [budget, setBudget] = useState(() => client.budget || "");
  const [aspiration, setAspiration] = useState(() => client.aspiration || "Personal Use");
  const [status, setStatus] = useState(() => client.status || "Visited");
  const [remarks, setRemarks] = useState(() => client.remarks || "");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) {
      setErr("Client name is required.");
      return;
    }
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setErr("Valid 10-digit mobile number is required.");
      return;
    }
    const formattedPhone = cleanDigits.length === 10
      ? `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`
      : phone;

    savePropertyToCache(client.id, propertyName);
    onSave(client.id, {
      name: name.trim(),
      phone: formattedPhone,
      mail: email.trim(),
      email: email.trim(),
      address: address.trim(),
      location: address.trim(),
      profession: profession.trim(),
      propertyName,
      cp: client.cp ? `${client.cp.replace(/\[PROP:[^\]]+\]/g, "").trim()} [PROP:${propertyName}]` : `[PROP:${propertyName}]`,
      interest,
      budget,
      aspiration,
      status,
      remarks: remarks.trim()
    });
    onClose();
  };

  return (
    <div className="client-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="client-modal-card" onClick={e => e.stopPropagation()}>
        <div className="client-modal-head">
          <div className="client-modal-head-title">
            <div className="client-modal-badge emerald"><Edit3 size={18} /></div>
            <div>
              <h3>Edit Client Record</h3>
              <p>Update contact information, property interest, and CRM pipeline status</p>
            </div>
          </div>
          <button type="button" className="client-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {err && <div className="client-form-error-banner"><AlertCircle size={14} /><span>{err}</span></div>}

        <form onSubmit={handleSubmit} className="client-modal-form">
          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Client Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="client-form-field">
              <label>Mobile Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="client-form-field">
              <label>Profession</label>
              <input
                type="text"
                value={profession}
                onChange={e => setProfession(e.target.value)}
              />
            </div>
          </div>

          <div className="client-form-field">
            <label>Location / Full Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Assigned Property *</label>
              <select value={propertyName} onChange={e => setPropertyName(e.target.value)}>
                <option value="Park Solitaire">Park Solitaire</option>
                <option value="VDPL">VDPL (Veena Developer Pvt LTD)</option>
                <option value="Luxury Empire">Luxury Empire</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="client-form-field">
              <label>Unit Interest *</label>
              <select value={interest} onChange={e => setInterest(e.target.value)}>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="2BHK Jodi">2BHK Jodi</option>
                <option value="SHOP">SHOP</option>
                <option value="Office">Office</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Duplex">Duplex</option>
              </select>
            </div>
          </div>

          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Budget</label>
              <input
                type="text"
                value={budget}
                onChange={e => setBudget(e.target.value)}
              />
            </div>
            <div className="client-form-field">
              <label>Aspiration *</label>
              <select value={aspiration} onChange={e => setAspiration(e.target.value)}>
                <option value="Personal Use">Personal Use (Own Living)</option>
                <option value="Investment">Investment (High ROI & Yield)</option>
              </select>
            </div>
          </div>

          <div className="client-form-grid">
            <div className="client-form-field">
              <label>Pipeline Stage / Status *</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Visited">Visited</option>
                <option value="FollowUp">Follow-Up</option>
                <option value="Revisited">Re-visited</option>
                <option value="Booked">Booked</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="client-form-field">
            <label>Discussion Remarks & Notes</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
          </div>

          <div className="client-modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">
              <Check size={14} /> Save Client Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClientCard({ client, onEdit }) {
  const initials = getInitials(client.name);
  const location = client.address || client.location || "Mumbai";
  const budgetText = client.budget && !client.budget.toLowerCase().startsWith("budget")
    ? `Budget: ${client.budget}`
    : (client.budget || "Budget: —");

  const interestLower = (client.interest || "").toLowerCase();
  let propClass = "tag-blue";
  if (interestLower.includes("3bhk")) propClass = "tag-purple";
  else if (interestLower.includes("shop")) propClass = "tag-orange";
  else if (interestLower.includes("office")) propClass = "tag-slate";

  const isInvest = client.aspiration === "Investment";

  const telUrl = client.phone ? `tel:${cleanTel(client.phone)}` : "#";
  const waGreeting = encodeURIComponent(
    `Hello ${client.name}, thank you for your inquiry with ${client.propertyName || "Park Solitaire"}. Regarding your requirement for ${client.interest || "our luxury residences"}, how may I assist you today?`
  );
  const waUrl = client.phone ? `https://wa.me/${cleanWa(client.phone)}?text=${waGreeting}` : "#";

  return (
    <div
      className="client-card"
      data-testid={`client-card-${client.id || client.name}`}
    >
      <div className="client-header">
        <div className="client-avatar">{initials}</div>
        <div className="client-header-info">
          <h3>{client.name}</h3>
          <p>{client.profession || "Client"}</p>
        </div>
        <div className="client-header-status">
          <StatusBadge status={client.status || "Visited"} />
          {onEdit && (
            <button
              type="button"
              className="client-btn-edit"
              onClick={() => onEdit(client)}
              title={`Edit ${client.name}'s details`}
              aria-label={`Edit ${client.name}`}
            >
              <Edit3 size={12} />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="client-details">
        <div className="client-row">
          <Phone size={13} className="client-icon icon-phone" />
          <a
            href={telUrl}
            className="client-phone-link"
            title={`Click to call ${client.phone}`}
          >
            {client.phone}
          </a>
        </div>
        <div className="client-row">
          <Mail size={13} className="client-icon icon-mail" />
          <a
            href={client.mail || client.email ? `mailto:${client.mail || client.email}` : undefined}
            className="client-mail-link"
          >
            {client.mail || client.email || "—"}
          </a>
        </div>
        <div className="client-row">
          <MapPin size={13} className="client-icon icon-pin" />
          <span>{location}</span>
        </div>
        <div className="client-row">
          <Coins size={13} className="client-icon icon-budget" />
          <span className="client-budget">{budgetText}</span>
        </div>
      </div>

      {client.remarks && (
        <div className="client-flow-remark">
          <span className="remark-tag">Latest Remark</span>
          <p className="remark-text">"{client.remarks}"</p>
        </div>
      )}

      {/* Direct Contact Actions: Call Client & WhatsApp */}
      <div className="client-contact-actions">
        <a
          href={telUrl}
          className="client-action-btn btn-call"
          title={`Call ${client.name} directly`}
          aria-label={`Call ${client.name}`}
        >
          <PhoneCall size={14} />
          <span>Call Client</span>
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="client-action-btn btn-whatsapp"
          title={`Chat with ${client.name} on WhatsApp`}
          aria-label={`WhatsApp ${client.name}`}
        >
          <WhatsAppIcon size={15} />
          <span>WhatsApp</span>
        </a>
      </div>

      <div className="client-footer">
        <div className="client-badges">
          <span className={`client-prop-mini-chip ${((client.propertyName || "Park Solitaire")).toLowerCase().replace(/\s+/g, "-")}`}>
            <Building2 size={11} style={{ marginRight: "4px", verticalAlign: "middle" }} />
            {client.propertyName || "Park Solitaire"}
          </span>
          <span className={`client-badge ${propClass}`}>{client.interest || "2BHK"}</span>
          <span className={`client-badge ${isInvest ? "tag-yellow" : "tag-green"}`}>
            {client.aspiration || "Personal Use"}
          </span>
        </div>
        <span className="client-visits">
          {client.visitsCount === 1 ? "1 visit" : `${client.visitsCount || 1} visits`}
        </span>
      </div>
    </div>
  );
}

function Clients({ visits, onUpdateVisit, onAddVisit }) {
  const { currentUser, adminPropertyFilter } = useAuth();
  const isPropertyScoped = currentUser?.role === "property";

  const [propFilter, setPropFilter] = useState(isPropertyScoped ? currentUser.property : (adminPropertyFilter || "ALL"));
  const [editingClient, setEditingClient] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    if (adminPropertyFilter && !isPropertyScoped) {
      setPropFilter(adminPropertyFilter);
    }
  }, [adminPropertyFilter, isPropertyScoped]);

  const activeVisits = useMemo(() => {
    if (isPropertyScoped) {
      return visits.filter(v => matchesProperty(v.propertyName, currentUser.property));
    }
    if (propFilter && propFilter !== "ALL") {
      return visits.filter(v => matchesProperty(v.propertyName, propFilter));
    }
    return visits;
  }, [visits, isPropertyScoped, currentUser, propFilter]);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const clients = useMemo(() => {
    const map = new Map();
    activeVisits.forEach(v => {
      const key = (v.phone || v.name).trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          ...v,
          visitsCount: v.visitsCount || 1,
          location: v.address || v.location || "Mumbai",
          history: [{ ...v }]
        });
      } else {
        const existing = map.get(key);
        existing.visitsCount = (existing.visitsCount || 1) + 1;
        // Keep the latest status, remarks, and active visit ID
        if (v.id >= (existing.id || 0)) {
          existing.id = v.id;
          existing.status = v.status || existing.status;
          existing.remarks = v.remarks || existing.remarks;
          existing.date = v.date || existing.date;
          existing.propertyName = v.propertyName || existing.propertyName;
        }
        if (!existing.history.some(h => h.id === v.id)) {
          existing.history.push({ ...v });
        }
        if (v.remarksHistory) {
          existing.remarksHistory = [
            ...(existing.remarksHistory || []),
            ...v.remarksHistory
          ];
        }
      }
    });
    return Array.from(map.values());
  }, [activeVisits]);

  const totalClients = clients.length;
  const personalUse = clients.filter(c => c.aspiration === "Personal Use").length;
  const investors = clients.filter(c => c.aspiration === "Investment").length;
  const newThisWeek = 5;

  const filters = [
    "All",
    "Personal Use",
    "Investment"
  ];

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const query = q.trim().toLowerCase();
      const matchSearch = !query || (
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.phone && c.phone.toLowerCase().includes(query)) ||
        (c.profession && c.profession.toLowerCase().includes(query)) ||
        (c.interest && c.interest.toLowerCase().includes(query)) ||
        (c.address && c.address.toLowerCase().includes(query)) ||
        (c.remarks && c.remarks.toLowerCase().includes(query))
      );

      let matchFilter = true;
      if (filter === "All") {
        matchFilter = true;
      } else if (filter === "Personal Use" || filter === "Investment") {
        matchFilter = c.aspiration === filter;
      }

      return matchSearch && matchFilter;
    });
  }, [clients, q, filter]);

  return (
    <Layout>
      <PageHead
        title="Clients"
        subtitle={isPropertyScoped ? `Client profiles registered for ${currentUser.property} — one-click direct Call and WhatsApp contact` : "All registered client profiles from visit forms — one-click direct Call and WhatsApp contact"}
      >
        <button className="btn secondary" onClick={() => exportClientsCSV(clients)}>
          <Download size={14} /> Export
        </button>
      </PageHead>

      {/* Admin Portfolio Property Filter Bar */}
      {!isPropertyScoped && (
        <div className="clients-prop-filter-bar">
          <span className="prop-filter-label"><Layers size={13} /> Property Filter:</span>
          <div className="prop-filter-chips">
            <button
              type="button"
              className={"prop-chip " + (propFilter === "ALL" ? "active" : "")}
              onClick={() => setPropFilter("ALL")}
            >
              All Properties ({visits.length})
            </button>
            <button
              type="button"
              className={"prop-chip " + (propFilter === "Park Solitaire" ? "active" : "")}
              onClick={() => setPropFilter("Park Solitaire")}
            >
              Park Solitaire ({visits.filter(v => matchesProperty(v.propertyName, "Park Solitaire")).length})
            </button>
            <button
              type="button"
              className={"prop-chip " + (matchesProperty("VDPL", propFilter) ? "active" : "")}
              onClick={() => setPropFilter("VDPL")}
            >
              VDPL ({visits.filter(v => matchesProperty(v.propertyName, "VDPL")).length})
            </button>
            <button
              type="button"
              className={"prop-chip " + (propFilter === "Luxury Empire" ? "active" : "")}
              onClick={() => setPropFilter("Luxury Empire")}
            >
              Luxury Empire ({visits.filter(v => matchesProperty(v.propertyName, "Luxury Empire")).length})
            </button>
          </div>
        </div>
      )}

      <div className="filters">
        <div className="searchbox">
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clients by name, phone, unit..."
          />
          {q && (
            <button
              className="clear-search-btn"
              onClick={() => setQ("")}
              title="Clear search"
              type="button"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="filter-pills">
        {filters.map((x) => {
          let label = x;
          if (x === "All") label = `All (${clients.length})`;
          else if (x === "Personal Use") label = `Personal (${personalUse})`;
          else if (x === "Investment") label = `Investors (${investors})`;

          return (
            <button
              key={x}
              className={filter === x ? "selected" : ""}
              onClick={() => setFilter(x)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filteredClients.length === 0 ? (
        <div className="table-empty-state">
          <Users size={32} />
          <h4>No matching clients found</h4>
          <p>Try searching with another name or phone number, or clear filters.</p>
          <button
            className="btn secondary"
            onClick={() => { setQ(""); setFilter("All"); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="client-grid">
          {filteredClients.map(client => (
            <ClientCard
              key={client.id || client.phone}
              client={client}
              onEdit={(c) => setEditingClient(c)}
              onUpdateVisit={onUpdateVisit}
              onAddVisit={onAddVisit}
            />
          ))}
        </div>
      )}

      <AddClientModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        defaultProperty={propFilter !== "ALL" ? propFilter : "Park Solitaire"}
        onSave={(newClient) => {
          if (onAddVisit) onAddVisit(newClient);
        }}
      />

      <EditClientModal
        client={editingClient}
        isOpen={Boolean(editingClient)}
        onClose={() => setEditingClient(null)}
        onSave={(id, updates) => {
          if (onUpdateVisit) onUpdateVisit(id, updates);
        }}
      />
    </Layout>
  );
}

function Placeholder({title,subtitle}) {
 return <Layout><PageHead title={title} subtitle={subtitle}/><div className="empty-page"><Building2 size={42}/><h2>{title}</h2><p>This module is ready for your next data workflow.</p></div></Layout>
}

function AppContent() {
  const [visits, setVisits] = useVisits();
  const [siteVisits, setSiteVisits] = useSiteVisits();
  const { currentUser, login } = useAuth();

  const addVisit = (v) => {
    const assignedProperty = v.propertyName || (currentUser?.role === "property" ? currentUser.property : "Park Solitaire");
    const visitId = v.id || Date.now();
    savePropertyToCache(visitId, assignedProperty);

    const cleanCpVal = v.cp ? String(v.cp).replace(/\[PROP:[^\]]+\]/g, "").trim() : "";
    const taggedCp = cleanCpVal ? `${cleanCpVal} [PROP:${assignedProperty}]` : `[PROP:${assignedProperty}]`;

    const preparedVisit = {
      ...v,
      id: visitId,
      propertyName: assignedProperty,
      cp: taggedCp,
      remarksHistory: v.remarksHistory || (v.remarks ? [{
        id: Date.now(),
        date: v.date || getRelativeDateStr(0),
        status: v.status || "Visited",
        remarks: v.remarks,
        source: "Visit Form"
      }] : [])
    };
    setVisits((old) => [preparedVisit, ...old]);

    const payload = JSON.stringify(preparedVisit);
    fetch(`${API_BASE}/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Primary failed");
        return res.json();
      })
      .then((json) => {
        if (json && json.data && json.data.id) {
          setVisits((old) => old.map(item => item.id === preparedVisit.id ? {
            ...item,
            ...json.data,
            propertyName: resolvePropertyName(json.data, item) || assignedProperty
          } : item));
        }
      })
      .catch(() => {
        fetch(`${RAILWAY_DIRECT_URL}/visits`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        }).catch(() => {});
      });
  };

  const updateVisit = (id, updates) => {
    let finalUpdates = { ...updates };
    setVisits((old) =>
      old.map((v) => {
        if (v.id !== id) return v;
        let merged = { ...v, ...finalUpdates };
        // If status changed and remarksHistory was not explicitly passed, record this step in history
        if (finalUpdates.status && finalUpdates.status !== v.status && !finalUpdates.remarksHistory) {
          const nextHistory = [
            ...(v.remarksHistory || []),
            {
              id: Date.now(),
              date: getRelativeDateStr(0),
              status: finalUpdates.status,
              remarks: finalUpdates.remarks || `Status updated to ${finalUpdates.status}`,
              source: "Status Update"
            }
          ];
          merged.remarksHistory = nextHistory;
          finalUpdates.remarksHistory = nextHistory;
        }
        return merged;
      })
    );

    const payload = JSON.stringify(finalUpdates);
    fetch(`${API_BASE}/visits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }).catch(() => {
      fetch(`${RAILWAY_DIRECT_URL}/visits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).catch(() => {});
    });
  };

  const addSiteVisit = (sv) => {
    setSiteVisits((old) => [sv, ...old]);
    fetch(`${API_BASE}/site-visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sv)
    })
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        if (json && json.data && json.data.id) {
          setSiteVisits((old) => old.map(item => item.id === sv.id ? { ...item, ...json.data } : item));
        }
      })
      .catch(() => {});
  };

  const updateSiteVisit = (id, updates) => {
    setSiteVisits((old) => old.map(v => v.id === id ? { ...v, ...updates } : v));
    fetch(`${API_BASE}/site-visits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    }).catch(() => {});
  };

  const deleteSiteVisit = (id) => {
    setSiteVisits((old) => old.filter(v => v.id !== id));
    fetch(`${API_BASE}/site-visits/${id}`, {
      method: "DELETE"
    }).catch(() => {});
  };

  if (!currentUser) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <Routes>
      <Route path="/" element={<VisitForm onAdd={addVisit} />} />
      <Route path="/login" element={<LoginScreen onLogin={login} />} />
      <Route
        path="/admin"
        element={<Dashboard visits={visits} onUpdateVisit={updateVisit} siteVisits={siteVisits} onUpdateSiteVisit={updateSiteVisit} />}
      />
      <Route
        path="/site-visits"
        element={
          <SiteVisits
            visits={visits}
            onUpdateVisit={updateVisit}
            siteVisits={siteVisits}
            onAddSiteVisit={addSiteVisit}
            onUpdateSiteVisit={updateSiteVisit}
            onDeleteSiteVisit={deleteSiteVisit}
          />
        }
      />
      <Route
        path="/calendar"
        element={
          <SiteVisits
            visits={visits}
            onUpdateVisit={updateVisit}
            siteVisits={siteVisits}
            onAddSiteVisit={addSiteVisit}
            onUpdateSiteVisit={updateSiteVisit}
            onDeleteSiteVisit={deleteSiteVisit}
          />
        }
      />
      <Route
        path="/visits"
        element={<AllVisits visits={visits} onUpdateVisit={updateVisit} />}
      />
      <Route path="/reports" element={<Reports visits={visits} />} />
      <Route path="/clients" element={<Clients visits={visits} onUpdateVisit={updateVisit} onAddVisit={addVisit} />} />
      <Route
        path="/settings"
        element={<Placeholder title="Settings" subtitle="Application settings" />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}