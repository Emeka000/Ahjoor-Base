import DashboardLayout from "@/components/dashboard-layout"

export default function InvestmentsPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-white text-3xl font-bold mb-4">Investments</h1>
        <p className="text-gray-400">Track your investment portfolio and performance.</p>
      </div>
    </DashboardLayout>
  )
}
