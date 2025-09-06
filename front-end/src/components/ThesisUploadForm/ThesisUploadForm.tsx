import { useState } from "react";

type Props = {
  studentId: number;
};

export default function ThesisUploadForm({ studentId }: Props) {
  const [title, setTitle] = useState("");
  const [major, setMajor] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("studentId", studentId.toString());
    formData.append("title", title);
    formData.append("major", major);
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/sts/thesis/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        alert("Thesis uploaded successfully!");
        setTitle("");
        setMajor("");
        setFile(null);
      } else {
        const msg = await res.text();
        alert(msg || "Failed to upload thesis");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Thesis Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded-lg"
        required
      />

      <input
        type="text"
        placeholder="Major"
        value={major}
        onChange={(e) => setMajor(e.target.value)}
        className="border p-2 rounded-lg"
        required
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded-lg"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload Thesis"}
      </button>
    </form>
  );
}