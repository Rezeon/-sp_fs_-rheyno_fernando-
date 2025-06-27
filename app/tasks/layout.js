import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav className="p-4 shadow bg-white flex justify-between mb-4">
        <Link className="text-xl font-bold" href={`/dashboard`}>Project App</Link>
        <LogoutButton />
      </nav>
      <main>{children}</main>
    </div>
  );
}
