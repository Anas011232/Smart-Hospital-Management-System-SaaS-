import HospitalNavbar from "@/components/HospitalNavbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 font-sans">
      <HospitalNavbar />
      <main className="animate-fadeIn">
        {children}
      </main>
    </div>
  );
}