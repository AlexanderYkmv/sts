import { useState } from "react";

interface Props {
  onComplete: () => void;
}

export default function StudentSetupForm({ onComplete }: Props) {
  const [facultyNumber, setFacultyNumber] = useState("");
  const [major, setMajor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/sts/student/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          facultyNumber,
          major,
          tutorId: null, // always include
        }),
      });

      if (res.ok) {
        onComplete();
      } else {
        const msg = await res.text();
        alert(msg || "Failed to save profile");
      }
    } catch (err) {
      console.error("Setup error:", err);
      alert("Network error while saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Faculty Number"
          value={facultyNumber}
          onChange={(e) => setFacultyNumber(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-3"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white rounded-lg p-3">
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}