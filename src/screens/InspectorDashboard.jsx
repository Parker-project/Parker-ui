import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Eye, Clock, MapPin, Car } from "lucide-react";
import { MOCK_REPORTS } from "../mocks/reports";
import "./InspectorDashboard.css";

export default function InspectorDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [sortKey, setSortKey] = useState("newest");
  const [locationFilter, setLocationFilter] = useState("all");

  const applySortAndFilter = (items) => {
    let list = [...items];

    if (locationFilter !== "all") {
      list = list.filter((r) => r.location.includes(locationFilter));
    }

    switch (sortKey) {
      case "oldest":
        list.sort((a, b) => a.createdAt - b.createdAt);
        break;
      default:
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

  const markAsResolved = (id) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, resolved: true } : report
      )
    );
  };

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
        className="report-card"
        style={{ 
          opacity: report.resolved ? 0.7 : 1,
          borderColor: report.resolved ? 'var(--success)' : 'transparent',
        }}
      >
        <div className="card-header">
          <span style={{ fontWeight: 600, color: 'var(--gray)' }}>#{report.id}</span>
          {report.resolved && (
            <span className="badge">
              <Check size={16} color="var(--success)" /> Resolved
            </span>
          )}
        </div>

        <div className="report-info">
          <div className="info-item">
            <Car size={16} />
            <span>{report.plate}</span>
          </div>
          <div className="info-item">
            <MapPin size={16} />
            <span>{report.location}</span>
          </div>
          <div className="info-item">
            <Clock size={16} />
            <span>{report.createdAt.toLocaleString()}</span>
          </div>
        </div>

        <p style={{ color: 'var(--black)', fontSize: 15, marginTop: 4 }}>
          {report.description}
        </p>

        <div className="btn-row">
          {!report.resolved && (
            <motion.button
              className="primary-btn"
              onClick={() => markAsResolved(report.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check size={16} /> Resolve
            </motion.button>
          )}
          <motion.button
            className="secondary-btn"
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
    <div className="inspector-dashboard">
      <h1>Inspector Dashboard</h1>

      <div className="controls">
        <select 
          className="select"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>

        <select 
          className="select"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="all">All locations</option>
          <option value="Tel Aviv">Tel Aviv</option>
          <option value="Ramat Gan">Ramat Gan</option>
        </select>
      </div>

      <section>
        <h2>
          <Clock size={24} />
          Reports to Handle
        </h2>
        <AnimatePresence>
          {pendingReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </AnimatePresence>
      </section>

      <section className="resolved-section">
        <h2>
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
