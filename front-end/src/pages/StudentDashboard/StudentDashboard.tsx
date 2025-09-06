import { useEffect, useState } from "react";
import StudentSetupForm from "../../components/StudentSetupForm/StudentSetupForm";
import ThesisStatus from "../../components/ThesisStatus/ThesisStatus";
import ThesisUploadForm from "../../components/ThesisUploadForm/ThesisUploadForm";

interface StudentProfile {
  studentId: number;
  major: string | null;
  facultyNumber: string | null;
  profileComplete: boolean;
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null | "loading">("loading");
  const [uploadedThesis, setUploadedThesis] = useState<any | null>(null);

  const fetchProfile = async () => {
    setProfile("loading");
    try {
      const res = await fetch("http://localhost:8080/sts/student/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch student profile");

      const data: StudentProfile = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setProfile(null);
    }
  };

  // ✅ Fetch fresh thesis after upload
  const handleUploadSuccess = async (thesis: any) => {
    if (!profile || profile === "loading") return; // ✅ narrow type
    try {
      const res = await fetch(
        `http://localhost:8080/sts/thesis/student/${profile.studentId}`,
        { credentials: "include", cache: "no-store" }
      );
      const latestThesis = res.ok ? await res.json() : thesis;
      setUploadedThesis(latestThesis);
    } catch (err) {
      console.error("Error refreshing thesis after upload:", err);
      setUploadedThesis(thesis);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
        <ThesisUploadForm
          studentId={profile.studentId}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>

      <div className="mt-6">
        <ThesisStatus
          studentId={profile.studentId}
          initialThesis={uploadedThesis}
        />
      </div>
    </div>
  );
}