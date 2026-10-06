"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import OverviewTab from "./components/OverviewTab";
import HospitalsTab from "./components/HospitalsTab";
import DoctorsTab from "./components/DoctorsTab";
import PatientsTab from "./components/PatientsTab";
import SubscriptionsTab from "./components/SubscriptionsTab";
import EditSubscriptionModal from "./modal/EditSubscriptionModal";
import RevenueCalculatorModal from "./modal/RevenueCalculatorModal";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [allHospitalsList, setAllHospitalsList] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // Loading & Action states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTab, setLoadingTab] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Pagination & Filter states for Hospitals
  const [hospitalPage, setHospitalPage] = useState(1);
  const [hospitalTotalCount, setHospitalTotalCount] = useState(0);
  const [hospitalTotalPages, setHospitalTotalPages] = useState(1);
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [hospitalStatusFilter, setHospitalStatusFilter] = useState("all");
  const [hospitalPlanFilter, setHospitalPlanFilter] = useState("all");

  // Pagination & Filter states for Doctors
  const [doctorPage, setDoctorPage] = useState(1);
  const [doctorTotalCount, setDoctorTotalCount] = useState(0);
  const [doctorTotalPages, setDoctorTotalPages] = useState(1);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorSpecFilter, setDoctorSpecFilter] = useState("all");
  const [doctorHospitalFilter, setDoctorHospitalFilter] = useState("all");

  // Pagination & Filter states for Patients
  const [patientPage, setPatientPage] = useState(1);
  const [patientTotalCount, setPatientTotalCount] = useState(0);
  const [patientTotalPages, setPatientTotalPages] = useState(1);
  const [patientSearch, setPatientSearch] = useState("");

  // Subscription Edit & Revenue Calculator Modal states
  const [editingHospital, setEditingHospital] = useState(null);
  const [showRevenueCalculatorModal, setShowRevenueCalculatorModal] = useState(false);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Hospitals list for Doctor Filter Dropdown
  const fetchAllHospitalsList = useCallback(async () => {
    try {
      const res = await api.get("/admin/hospitals", { params: { limit: 100 } });
      if (res.data.success) {
        setAllHospitalsList(res.data.hospitals || []);
      }
    } catch (err) {
      console.warn("Fetch hospitals list error:", err);
    }
  }, []);

  // 1. Fetch Overview Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await api.get("/admin/stats");
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn("Fetch stats error:", err?.response?.data?.message || err.message);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // 2. Fetch Hospitals Data
  const fetchHospitals = useCallback(async () => {
    try {
      setLoadingTab(true);
      const params = {
        page: hospitalPage,
        limit: 10,
        search: hospitalSearch,
        status: hospitalStatusFilter,
        plan: hospitalPlanFilter,
      };
      const res = await api.get("/admin/hospitals", { params });
      if (res.data.success) {
        setHospitals(res.data.hospitals || []);
        setHospitalTotalCount(res.data.totalCount || 0);
        setHospitalTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.warn("Fetch hospitals error:", err?.response?.data?.message || err.message);
    } finally {
      setLoadingTab(false);
    }
  }, [hospitalPage, hospitalSearch, hospitalStatusFilter, hospitalPlanFilter]);

  // 3. Fetch Doctors Data (Supports Specialization + Hospital/Medical wise filter)
  const fetchDoctors = useCallback(async () => {
    try {
      setLoadingTab(true);
      const params = {
        page: doctorPage,
        limit: 10,
        search: doctorSearch,
        specialization: doctorSpecFilter,
      };
      if (doctorHospitalFilter && doctorHospitalFilter !== "all") {
        params.hospitalId = doctorHospitalFilter;
      }
      const res = await api.get("/admin/doctors", { params });
      if (res.data.success) {
        setDoctors(res.data.doctors || []);
        setDoctorTotalCount(res.data.totalCount || 0);
        setDoctorTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.warn("Fetch doctors error:", err?.response?.data?.message || err.message);
    } finally {
      setLoadingTab(false);
    }
  }, [doctorPage, doctorSearch, doctorSpecFilter, doctorHospitalFilter]);

  // 4. Fetch Patients Data
  const fetchPatients = useCallback(async () => {
    try {
      setLoadingTab(true);
      const params = {
        page: patientPage,
        limit: 10,
        search: patientSearch,
      };
      const res = await api.get("/admin/patients", { params });
      if (res.data.success) {
        setPatients(res.data.patients || []);
        setPatientTotalCount(res.data.totalCount || 0);
        setPatientTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.warn("Fetch patients error:", err?.response?.data?.message || err.message);
    } finally {
      setLoadingTab(false);
    }
  }, [patientPage, patientSearch]);

  // Initial Auth Check & Data Load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchStats();
    fetchAllHospitalsList();
  }, [fetchStats, fetchAllHospitalsList, router]);

  // Tab change & filter updates trigger fetching
  useEffect(() => {
    if (activeTab === "hospitals" || activeTab === "overview" || activeTab === "subscriptions") {
      fetchHospitals();
    }
    if (activeTab === "doctors") {
      fetchDoctors();
    }
    if (activeTab === "patients") {
      fetchPatients();
    }
  }, [activeTab, fetchHospitals, fetchDoctors, fetchPatients]);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchStats(),
      fetchAllHospitalsList(),
      activeTab === "hospitals" && fetchHospitals(),
      activeTab === "doctors" && fetchDoctors(),
      activeTab === "patients" && fetchPatients(),
    ]);
    setIsRefreshing(false);
    showToast("Dashboard data updated", "info");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    router.push("/login");
  };

  // Hospital Actions
  const handleVerifyHospital = async (id, isVerified) => {
    try {
      const res = await api.patch(`/admin/hospitals/${id}/verify`, { isVerified });
      if (res.data.success) {
        showToast(res.data.message);
        fetchHospitals();
        fetchStats();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to verify hospital", "error");
    }
  };

  const handleBlockHospital = async (id, isBlocked) => {
    try {
      const res = await api.patch(`/admin/hospitals/${id}/block`, { isBlocked });
      if (res.data.success) {
        showToast(res.data.message);
        fetchHospitals();
        fetchStats();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to toggle block status", "error");
    }
  };

  const handleSaveSubscription = async (id, payload) => {
    try {
      const res = await api.patch(`/admin/hospitals/${id}/subscription`, payload);
      if (res.data.success) {
        showToast(res.data.message);
        setEditingHospital(null);
        fetchHospitals();
        fetchStats();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update subscription", "error");
    }
  };

  const handleDeleteHospital = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? All associated doctors and appointments will be permanently removed.`)) {
      return;
    }
    try {
      const res = await api.delete(`/admin/hospitals/${id}`);
      if (res.data.success) {
        showToast(res.data.message);
        fetchHospitals();
        fetchStats();
        fetchAllHospitalsList();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete hospital", "error");
    }
  };

  // Doctor Actions
  const handleVerifyDoctor = async (id, isVerified) => {
    try {
      const res = await api.patch(`/admin/doctors/${id}/verify`, { isVerified });
      if (res.data.success) {
        showToast(res.data.message);
        fetchDoctors();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to verify doctor", "error");
    }
  };

  const handleBlockDoctor = async (id, isActive) => {
    try {
      const res = await api.patch(`/admin/doctors/${id}/block`, { isActive });
      if (res.data.success) {
        showToast(res.data.message);
        fetchDoctors();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update doctor status", "error");
    }
  };

  // Patient Actions
  const handleDeletePatient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove patient "${name || 'this patient'}"? This will permanently delete the patient from the database and prevent login.`)) {
      return;
    }
    try {
      const res = await api.delete(`/admin/patients/${id}`);
      if (res.data.success) {
        showToast(res.data.message);
        fetchPatients();
        fetchStats();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to remove patient", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Background Decorative Ambient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Top Header */}
      <AdminHeader
        activeTab={activeTab}
        onRefresh={handleRefreshAll}
        isRefreshing={isRefreshing}
        collapsed={sidebarCollapsed}
      />

      {/* Main Workspace */}
      <main
        className={`relative z-10 pt-28 pb-12 px-6 transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-24 right-8 z-50 animate-bounce">
            <div
              className={`px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl font-bold text-xs flex items-center gap-2 ${
                toastMessage.type === "error"
                  ? "bg-red-500/20 text-red-300 border-red-500/40"
                  : toastMessage.type === "info"
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}
            >
              <span>{toastMessage.msg}</span>
            </div>
          </div>
        )}

        {/* Tab Content Router */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            onNavigate={setActiveTab}
            onVerifyHospital={handleVerifyHospital}
            onBlockHospital={handleBlockHospital}
            onOpenRevenueCalculator={() => setShowRevenueCalculatorModal(true)}
          />
        )}

        {activeTab === "hospitals" && (
          <HospitalsTab
            hospitals={hospitals}
            totalCount={hospitalTotalCount}
            page={hospitalPage}
            totalPages={hospitalTotalPages}
            onPageChange={setHospitalPage}
            searchQuery={hospitalSearch}
            setSearchQuery={setHospitalSearch}
            statusFilter={hospitalStatusFilter}
            setStatusFilter={setHospitalStatusFilter}
            planFilter={hospitalPlanFilter}
            setPlanFilter={setHospitalPlanFilter}
            onVerifyHospital={handleVerifyHospital}
            onBlockHospital={handleBlockHospital}
            onEditSubscription={(h) => setEditingHospital(h)}
            onDeleteHospital={handleDeleteHospital}
            loading={loadingTab}
          />
        )}

        {activeTab === "doctors" && (
          <DoctorsTab
            doctors={doctors}
            totalCount={doctorTotalCount}
            page={doctorPage}
            totalPages={doctorTotalPages}
            onPageChange={setDoctorPage}
            searchQuery={doctorSearch}
            setSearchQuery={setDoctorSearch}
            specializationFilter={doctorSpecFilter}
            setSpecializationFilter={setDoctorSpecFilter}
            hospitalFilter={doctorHospitalFilter}
            setHospitalFilter={setDoctorHospitalFilter}
            hospitalsList={allHospitalsList}
            onVerifyDoctor={handleVerifyDoctor}
            onBlockDoctor={handleBlockDoctor}
            loading={loadingTab}
          />
        )}

        {activeTab === "patients" && (
          <PatientsTab
            patients={patients}
            totalCount={patientTotalCount}
            page={patientPage}
            totalPages={patientTotalPages}
            onPageChange={setPatientPage}
            searchQuery={patientSearch}
            setSearchQuery={setPatientSearch}
            onDeletePatient={handleDeletePatient}
            loading={loadingTab}
          />
        )}

        {activeTab === "subscriptions" && (
          <SubscriptionsTab
            stats={stats}
            hospitals={hospitals}
            onEditSubscription={(h) => setEditingHospital(h)}
            onOpenRevenueCalculator={() => setShowRevenueCalculatorModal(true)}
          />
        )}
      </main>

      {/* Subscription Edit Modal Drawer */}
      {editingHospital && (
        <EditSubscriptionModal
          hospital={editingHospital}
          onClose={() => setEditingHospital(null)}
          onSave={handleSaveSubscription}
        />
      )}

      {/* Revenue Calculator Modal */}
      {showRevenueCalculatorModal && (
        <RevenueCalculatorModal
          onClose={() => setShowRevenueCalculatorModal(false)}
        />
      )}
    </div>
  );
}