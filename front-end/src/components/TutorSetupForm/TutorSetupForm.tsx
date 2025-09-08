import { useState } from "react";

interface Props {
  onComplete: () => void;
}

export default function TutorSetupForm({ onComplete }: Props) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [officeNumber, setOfficeNumber] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/sts/tutor/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          department,
          officeNumber,
          accessCode,
          topics: [],
        }),
      });

      if (res.ok) {
        onComplete();
      } else {
        const msg = await res.text();
        alert(msg || "Failed to save tutor profile");
      }
    } catch (err) {
      console.error("Setup error:", err);
      alert("Network error while saving tutor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Complete Your Tutor Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="Office Number"
          value={officeNumber}
          onChange={(e) => setOfficeNumber(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
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