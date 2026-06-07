// অবশ্যই নিশ্চিত করুন ইমপোর্ট পাথটি আপনার ফোল্ডার স্ট্রাকচারের সাথে মিলছে
import DoctorSidebar from "../../components/doctor/DoctorSidebar.jsx"; 

export default function DoctorDashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}