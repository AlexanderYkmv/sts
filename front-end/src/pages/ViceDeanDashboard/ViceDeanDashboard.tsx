export default function ViceDeanDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-purple-700 text-center">🏛️ Vice Dean Dashboard</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-700">Welcome, Vice Dean! Here you can:</p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Approve submitted theses</li>
          <li>Oversee tutor activities</li>
          <li>Manage research topics</li>
        </ul>
      </div>
    </div>
  );
}