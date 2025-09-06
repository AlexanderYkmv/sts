import { useEffect, useState } from "react";
import StudentSetupForm from "../../components/StudentSetupForm/StudentSetupForm";

interface StudentProfile {
  studentId: number;
  major: string | null;
  facultyNumber: string | null;
  profileComplete: boolean;
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null | "loading">("loading");

  const fetchProfile = async () => {
    setProfile("loading");
    try {
      const res = await fetch("http://localhost:8080/sts/student/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error(err);
      setProfile(null);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (profile === "loading") return <div>Loading profile...</div>;
  if (!profile) return <div>Error loading profile.</div>;

  if (!profile.profileComplete) {
    return <StudentSetupForm onComplete={fetchProfile} />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p><strong>Major:</strong> {profile.major}</p>
        <p><strong>Faculty Number:</strong> {profile.facultyNumber}</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Thesis</h2>
        <p>No thesis assigned yet.</p>
      </div>
    </div>
  );
}