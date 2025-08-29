export default function StudentDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blue-700 text-center">🎓 Student Dashboard</h1>
      
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-700">Welcome, Student! Here you can:</p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Submit your thesis</li>
          <li>Track submission status</li>
          <li>View tutor feedback</li>
        </ul>
      </div>
    </div>
  );
}