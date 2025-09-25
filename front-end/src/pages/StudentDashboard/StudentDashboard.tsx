import { useEffect, useState } from "react";
import StudentSetupForm from "../../components/StudentSetupForm/StudentSetupForm";
import ThesisStatus from "../../components/ThesisStatus/ThesisStatus";
import ThesisUploadForm from "../../components/ThesisUploadForm/ThesisUploadForm";
import TutorList from "../../components/TutorList/TutorList";

interface StudentProfile {
  studentId: number;
  major: string | null;
  facultyNumber: string | null;
  profileComplete: boolean;
  researchTopicId: number | null;
}

interface ResearchTopic {
  topicDesc: string;
  id: number;
  name: string;
  capacity: number;
  assignedStudentsCount?: number;
}

type ActiveCard = "menu" | "submitWork" | "findTutor" | "viewProfile";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null | "loading">("loading");
  const [uploadedThesis, setUploadedThesis] = useState<any | null>(null);
  const [activeCard, setActiveCard] = useState<ActiveCard>("menu");
  const [enrolledTopic, setEnrolledTopic] = useState<ResearchTopic | null>(null);
  const [topicLoading, setTopicLoading] = useState<boolean>(false);

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

  const handleUploadSuccess = async (thesis: any) => {
    if (!profile || profile === "loading") return;
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
    if (activeCard !== "viewProfile" || !profile || profile === "loading") {
      setEnrolledTopic(null);
      return;
    }

    if (profile.researchTopicId != null) {
      setTopicLoading(true);
      const fetchTopic = async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/sts/research-topic/${profile.researchTopicId}`,
            { credentials: "include", cache: "no-store" }
          );
          if (!res.ok) throw new Error("Topic not found");
          const topicData: ResearchTopic = await res.json();
          setEnrolledTopic(topicData);
        } catch (err) {
          console.error("Failed to fetch topic:", err);
          setEnrolledTopic(null);
        } finally {
          setTopicLoading(false);
        }
      };
      fetchTopic();
    } else {
      setEnrolledTopic(null);
    }
  }, [activeCard, profile]);

  useEffect(() => {
    fetchProfile();
  }, []);

  if (profile === "loading") return <div>Loading profile...</div>;
  if (!profile) return <div>Error loading profile.</div>;
  if (!profile.profileComplete) return <StudentSetupForm onComplete={fetchProfile} />;

  return (
    <div className="h-full flex flex-col">
      <header className="py-4">
        <h1 className="text-2xl font-bold text-center">Student Dashboard</h1>
      </header>

      {activeCard === "menu" && (
        <main className="flex-1 flex flex-col justify-center items-center overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center w-full max-w-6xl p-4">
            <div
              onClick={() => setActiveCard("submitWork")}
              className="cursor-pointer bg-white shadow-lg rounded-xl flex flex-col justify-center items-center text-center hover:shadow-2xl hover:-translate-y-1 transition w-64 h-64 p-6"
            >
              <h2 className="text-xl font-semibold mb-3">Submit Your Work</h2>
              <p className="text-gray-600 text-sm">Upload your thesis and track its status.</p>
            </div>

            <div
              onClick={() => setActiveCard("findTutor")}
              className="cursor-pointer bg-white shadow-lg rounded-xl flex flex-col justify-center items-center text-center hover:shadow-2xl hover:-translate-y-1 transition w-64 h-64 p-6"
            >
              <h2 className="text-xl font-semibold mb-3">Find a Tutor</h2>
              <p className="text-gray-600 text-sm">Browse tutors and available research topics.</p>
            </div>

            <div
              onClick={() => setActiveCard("viewProfile")}
              className="cursor-pointer bg-white shadow-lg rounded-xl flex flex-col justify-center items-center text-center hover:shadow-2xl hover:-translate-y-1 transition w-64 h-64 p-6"
            >
              <h2 className="text-xl font-semibold mb-3">View Profile</h2>
              <p className="text-gray-600 text-sm">See your student details, thesis, and feedback.</p>
            </div>
          </div>
        </main>
      )}

      {activeCard === "submitWork" && (
        <main className="flex-1 overflow-y-auto p-6">
          <button className="text-blue-600 underline mb-4" onClick={() => setActiveCard("menu")}>
            ← Back to menu
          </button>
          <ThesisUploadForm studentId={profile.studentId} onUploadSuccess={handleUploadSuccess} />
          <ThesisStatus studentId={profile.studentId} initialThesis={uploadedThesis} />
        </main>
      )}

      {activeCard === "findTutor" && (
        <main className="flex-1 overflow-y-auto p-6">
          <button className="text-blue-600 underline mb-4" onClick={() => setActiveCard("menu")}>
            ← Back to menu
          </button>
          <TutorList studentId={profile.studentId} />
        </main>
      )}

      {activeCard === "viewProfile" && (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <button className="text-blue-600 underline" onClick={() => setActiveCard("menu")}>
            ← Back to menu
          </button>

          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mx-auto">
            <p><strong>Major:</strong> {profile.major}</p>
            <p><strong>Faculty Number:</strong> {profile.facultyNumber}</p>
          </div>

          {topicLoading ? (
            <p className="text-center text-gray-500">Loading research topic...</p>
          ) : enrolledTopic ? (
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold mb-2">Enrolled Research Topic</h3>
              <p><strong>Name:</strong> {enrolledTopic.name}</p>
              <p><strong>Description:</strong> {enrolledTopic.topicDesc}</p>
              <p><strong>Capacity:</strong> {enrolledTopic.capacity}</p>
              <p><strong>Assigned:</strong> {enrolledTopic.assignedStudentsCount}</p>
            </div>
          ) : (
            <p className="text-center text-gray-500">No research topic assigned yet.</p>
          )}

          <div className="w-full max-w-3xl mx-auto">
            <ThesisStatus studentId={profile.studentId} initialThesis={uploadedThesis} />
          </div>
        </main>
      )}
    </div>
  );
}