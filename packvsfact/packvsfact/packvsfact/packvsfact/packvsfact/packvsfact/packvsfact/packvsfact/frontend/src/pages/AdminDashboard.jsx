import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, AlertTriangle, RefreshCw, CheckCircle2, XCircle, Activity, FileText, Database } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activeAlertPopup, setActiveAlertPopup] = useState(null);
  const [training, setTraining] = useState(false);
  const [trainSummary, setTrainSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOverview();
      setOverview(data);

      const demandRes = await api.getDemandAlerts();
      setAlerts(demandRes.alerts || []);

      if (demandRes.alerts && demandRes.alerts.length > 0) {
        setActiveAlertPopup(demandRes.alerts[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrainModels = async () => {
    setTraining(true);
    try {
      const res = await api.retrainMLModels();
      setTrainSummary(res.summary);
      fetchAdminData();
    } catch (err) {
      alert('ML Model retraining error.');
    } finally {
      setTraining(false);
    }
  };

  const handleApprove = async (pid) => {
    try {
      await api.approveVerification(pid);
      fetchAdminData();
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleReject = async (pid) => {
    try {
      await api.rejectVerification(pid);
      fetchAdminData();
    } catch (err) {
      alert('Rejection failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const metrics = overview?.metrics || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <Settings className="w-4 h-4" />
              <span>Senior Admin & ML Operations Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Admin & Governance Dashboard
            </h1>
          </div>

          <button
            onClick={handleRetrainModels}
            disabled={training}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${training ? 'animate-spin' : ''}`} />
            <span>{training ? 'Retraining ML Models...' : 'Retrain All 6 ML Models'}</span>
          </button>
        </div>

        {/* Real-Time Demand Surge Anomaly Popup */}
        {activeAlertPopup && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 flex items-start justify-between shadow-xl animate-bounce">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-300">DEMAND ANOMALY DETECTED</h3>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  Category <span className="font-bold text-amber-100">{activeAlertPopup.category}</span> scan activity increased <span className="font-bold text-amber-100">+70%</span> above baseline.
                </p>
                <p className="text-[10px] text-amber-400/80 mt-1">PackVsFact Activity Anomaly Alert • {activeAlertPopup.timestamp}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveAlertPopup(null)}
              className="px-3 py-1 rounded bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
            >
              Acknowledge
            </button>
          </div>
        )}

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Products</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-100">{metrics.total_products}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Verified Products</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{metrics.verified_products}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Pending Verification</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{metrics.pending_verification}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Demand Surge Alerts</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-400">{metrics.demand_alerts_active}</span>
          </div>
        </div>

        {/* Model Training Summary Box */}
        {trainSummary && (
          <div className="mb-8 p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/40">
            <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>ML Models Retrained & Activated Successfully</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">NOVA Classifier Accuracy</span>
                <span className="font-bold text-emerald-400">{trainSummary.models?.nova_classifier?.accuracy * 100}%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Food Health Recommender R2</span>
                <span className="font-bold text-emerald-400">{trainSummary.models?.food_health_recommender?.r2_score}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Alternative Ranker R2</span>
                <span className="font-bold text-emerald-400">{trainSummary.models?.alternative_ranking_model?.r2_score}</span>
              </div>
            </div>
          </div>
        )}

        {/* Verification Workflow & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verification Workflow List */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Product Verification Queue</span>
            </h3>

            <div className="space-y-3">
              {[1, 2].map((pid) => (
                <div key={pid} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">User Submitted Product #{pid}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Status: SUBMITTED • Awaiting Admin Evidence Approval</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApprove(pid)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(pid)}
                      className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 font-bold text-xs border border-rose-500/40 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>System Health & Privacy</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-bold text-emerald-400">SQLite / PostgreSQL</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Local OCR Engine</span>
                <span className="font-bold text-emerald-400">Tesseract + OpenCV</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Multilingual Assistant</span>
                <span className="font-bold text-emerald-400">10 Indian Languages</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Paid API Dependencies</span>
                <span className="font-bold text-emerald-400">NONE (100% Local)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
