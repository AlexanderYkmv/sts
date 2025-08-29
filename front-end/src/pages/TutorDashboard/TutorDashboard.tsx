export default function TutorDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-green-700 text-center">📘 Tutor Dashboard</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-700">Welcome, Tutor! Here you can:</p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Review student theses</li>
          <li>Give feedback</li>
          <li>Track thesis progress</li>
        </ul>
      </div>
    </div>
  );
}