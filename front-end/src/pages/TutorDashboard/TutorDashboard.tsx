import { useEffect, useState } from "react";
import ResearchTopics, { type ResearchTopic } from "../../components/ResearchTopics/ResearchTopics";
import TutorSetupForm from "../../components/TutorSetupForm/TutorSetupForm";

interface TutorProfile {
  tutorId: number | null;
  title: string | null;
  department: string | null;
  officeNumber: string | null;
  profileComplete: boolean;
}

export default function TutorDashboard() {
  const [profile, setProfile] = useState<TutorProfile | null | "loading">("loading");
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [newTopic, setNewTopic] = useState<{ name: string; topic: string }>({ name: "", topic: "" });

  const fetchProfile = async () => {
    setProfile("loading");
    try {
      const res = await fetch("http://localhost:8080/sts/tutor/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch tutor profile");
      const data: TutorProfile = await res.json();
      setProfile(data);

      // Only fetch topics if tutorId exists
      if (data.tutorId) {
        const topicsRes = await fetch(`http://localhost:8080/sts/tutor/${data.tutorId}/topics`, {
          credentials: "include",
        });
        if (!topicsRes.ok) throw new Error("Failed to fetch research topics");
        const topicsData: ResearchTopic[] = await topicsRes.json();
        setTopics(topicsData);
      } else {
        setTopics([]);
      }
    } catch (err) {
      console.error(err);
      setProfile(null);
      setTopics([]);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const addTopic = () => {
    if (!newTopic.name || !newTopic.topic) return;
    setTopics([...topics, { ...newTopic }]);
    setNewTopic({ name: "", topic: "" });
  };

  const saveTopics = async () => {
    // Type narrowing: ensure profile is loaded and has tutorId
    if (profile === "loading" || !profile || !profile.tutorId) return;

    try {
      const res = await fetch("http://localhost:8080/sts/tutor/setup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessCode: "TUTOR_ACCESS_CODE", // replace with actual code management
          title: profile.title ?? "",
          department: profile.department ?? "",
          officeNumber: profile.officeNumber ?? "",
          topics: topics.map(t => ({ name: t.name, topic: t.topic })),
        }),
      });

      if (!res.ok) throw new Error("Failed to save topics");

      // Refresh profile and topics after saving
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  // Loading & error states
  if (profile === "loading") return <div>Loading profile...</div>;
  if (!profile) return <div>Error loading profile.</div>;

  // Show setup form if profile incomplete
  if (!profile.profileComplete) return <TutorSetupForm onComplete={fetchProfile} />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Tutor Dashboard</h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-2">
        <p><strong>Title:</strong> {profile.title}</p>
        <p><strong>Department:</strong> {profile.department}</p>
        <p><strong>Office:</strong> {profile.officeNumber}</p>
      </div>

      <h2 className="text-xl font-semibold">Research Topics</h2>
      {topics.length > 0 ? (
        <ResearchTopics
          topics={topics}
          onDelete={(i) => setTopics(topics.filter((_, idx) => idx !== i))}
        />
      ) : (
        <div className="text-gray-500">No research topics assigned yet.</div>
      )}

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold">Add New Topic</h3>
        <input
          type="text"
          placeholder="Name"
          className="border p-1 rounded w-full"
          value={newTopic.name}
          onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Topic"
          className="border p-1 rounded w-full"
          value={newTopic.topic}
          onChange={(e) => setNewTopic({ ...newTopic, topic: e.target.value })}
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={addTopic}>
            Add Topic
          </button>
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={saveTopics}>
            Save All
          </button>
        </div>
      </div>
    </div>
  );
}