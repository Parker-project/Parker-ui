import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Eye, Clock, MapPin, Car } from "lucide-react";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { colors } from "../constants/styles";

/**
 * InspectorDashboard – shows two lists:
 *  1. Reports to Handle (pending)
 *  2. Handled Reports (resolved)
 *
 *  ▸ Real‑time visual update when a report is marked as resolved
 *  ▸ Simple sort & filter controls
 *  ▸ Uses shared color palette from src/constants/styles.js
 */
export default function InspectorDashboard() {
  const navigate = useNavigate();

  // ────────────────────────────────────────────────────────────────────────────
  //   STATE
  // ────────────────────────────────────────────────────────────────────────────
  const [reports, setReports] = useState([
    {
      id: 1,
      plate: "123-45-678",
      description: "Blocking sidewalk",
      createdAt: new Date("2025-05-01T13:15:00"),
      location: "Hashalom St, Tel‑Aviv",
      resolved: false,
    },
    {
      id: 2,
      plate: "987-65-432",
      description: "Parked in disabled spot",
      createdAt: new Date("2025-05-01T14:30:00"),
      location: "Bialik St, Ramat‑Gan",
      resolved: false,
    },
    {
      id: 3,
      plate: "246-80-135",
      description: "Blocking fire hydrant",
      createdAt: new Date("2025-05-02T08:05:00"),
      location: "Rothschild Blvd, Tel‑Aviv",
      resolved: true,
    },
  ]);

  const [sortKey, setSortKey] = useState("newest");
  const [locationFilter, setLocationFilter] = useState("all");

  // ────────────────────────────────────────────────────────────────────────────
  //   HELPERS
  // ────────────────────────────────────────────────────────────────────────────
  const applySortAndFilter = (items) => {
    let list = [...items];

    if (locationFilter !== "all") {
      list = list.filter((r) => r.location.includes(locationFilter));
    }

    switch (sortKey) {
      case "oldest":
        list.sort((a, b) => a.createdAt - b.createdAt);
        break;
      default: // "newest"
        list.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return list;
  };

  const pendingReports = useMemo(
    () => applySortAndFilter(reports.filter((r) => !r.resolved)),
    [reports, sortKey, locationFilter]
  );
  const resolvedReports = useMemo(
    () => applySortAndFilter(reports.filter((r) => r.resolved)),
    [reports, sortKey, locationFilter]
  );

  // ────────────────────────────────────────────────────────────────────────────
  //   ACTIONS
  // ────────────────────────────────────────────────────────────────────────────
  const markAsResolved = (id) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, resolved: true } : report
      )
    );
  };

  // ────────────────────────────────────────────────────────────────────────────
  //   INLINE STYLES (based on src/constants/styles.js)
  // ────────────────────────────────────────────────────────────────────────────
  const sx = {
    page: {
      backgroundColor: colors.background,
      padding: "24px 20px",
      minHeight: "100vh",
      maxWidth: 960,
      margin: "0 auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    },
    h1: {
      fontSize: 32,
      fontWeight: 700,
      textAlign: "center",
      color: colors.black,
      marginBottom: 32,
    },
    h2: {
      fontSize: 24,
      fontWeight: 600,
      color: colors.black,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      boxShadow: "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)",
      marginBottom: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      transition: "all 0.2s ease",
      border: "1px solid transparent",
      "&:hover": {
        boxShadow: "0 8px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.12)",
        transform: "translateY(-2px)",
      },
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    badge: {
      color: colors.success,
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 14,
      fontWeight: 500,
      padding: "4px 8px",
      backgroundColor: `${colors.success}15`,
      borderRadius: 6,
    },
    btnRow: { 
      display: "flex", 
      gap: 12, 
      marginTop: 12 
    },
    primaryBtn: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: "8px 16px",
      borderRadius: 8,
      border: "none",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 6,
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: `${colors.primary}dd`,
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
    secondaryBtn: {
      backgroundColor: colors.lightGray,
      color: colors.black,
      padding: "8px 16px",
      borderRadius: 8,
      border: "none",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 6,
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: `${colors.lightGray}dd`,
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
    reportInfo: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 12,
      fontSize: 14,
    },
    infoItem: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: colors.gray,
    },
    controls: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
      marginBottom: 32,
      backgroundColor: colors.white,
      padding: 16,
      borderRadius: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    select: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.gray}`,
      borderRadius: 8,
      padding: "8px 12px",
      fontSize: 14,
      width: "100%",
      cursor: "pointer",
      "&:focus": {
        outline: "none",
        borderColor: colors.primary,
      },
    },
  };

  // ────────────────────────────────────────────────────────────────────────────
  //   RENDER
  // ────────────────────────────────────────────────────────────────────────────
  const ReportCard = ({ report }) => (
    <motion.div
      key={report.id}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        style={{ 
          ...sx.card, 
          opacity: report.resolved ? 0.7 : 1,
          borderColor: report.resolved ? colors.success : "transparent",
        }}
      >
        <div style={sx.cardHeader}>
          <span style={{ fontWeight: 600, color: colors.gray }}>#{report.id}</span>
          {report.resolved && (
            <span style={sx.badge}>
              <Check size={16} color={colors.success} /> Resolved
            </span>
          )}
        </div>

        <div style={sx.reportInfo}>
          <div style={sx.infoItem}>
            <Car size={16} />
            <span>{report.plate}</span>
          </div>
          <div style={sx.infoItem}>
            <MapPin size={16} />
            <span>{report.location}</span>
          </div>
          <div style={sx.infoItem}>
            <Clock size={16} />
            <span>{report.createdAt.toLocaleString()}</span>
          </div>
        </div>

        <p style={{ color: colors.black, fontSize: 15, marginTop: 4 }}>
          {report.description}
        </p>

        <div style={sx.btnRow}>
          {!report.resolved && (
            <motion.button
              style={sx.primaryBtn}
              onClick={() => markAsResolved(report.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check size={16} /> Resolve
            </motion.button>
          )}
          <motion.button
            style={sx.secondaryBtn}
            onClick={() => navigate(`/inspector/report/${report.id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={16} /> View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={sx.page}>
      <h1 style={sx.h1}>Inspector Dashboard</h1>

      {/* Controls */}
      <div style={sx.controls}>
        <select 
          style={sx.select}
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>

        <select 
          style={sx.select}
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="all">All locations</option>
          <option value="Tel‑Aviv">Tel‑Aviv</option>
          <option value="Ramat‑Gan">Ramat‑Gan</option>
        </select>
      </div>

      {/* Pending Reports */}
      <section>
        <h2 style={sx.h2}>
          <Clock size={24} />
          Reports to Handle
        </h2>
        <AnimatePresence>
          {pendingReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </AnimatePresence>
      </section>

      {/* Resolved Reports */}
      <section style={{ marginTop: 40 }}>
        <h2 style={sx.h2}>
          <Check size={24} />
          Handled Reports
        </h2>
        <AnimatePresence>
          {resolvedReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </AnimatePresence>
      </section>
    </div>
  );
}
