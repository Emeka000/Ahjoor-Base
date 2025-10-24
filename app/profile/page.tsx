import DashboardLayout from "@/components/dashboard-layout"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-white text-3xl font-bold mb-4">Profile</h1>
        <p className="text-gray-400">Manage your profile settings and information.</p>
      </div>
    </DashboardLayout>
  )
}
