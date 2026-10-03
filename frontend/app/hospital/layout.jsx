import HospitalSidebar from "@/components/hospital/HospitalSidebar";

export default function HospitalDashboardLayout({ children }) {
  return (
    <div className="lg:flex min-h-screen bg-slate-950">
      <HospitalSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}