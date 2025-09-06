import { useEffect, useState } from "react";

type Props = {
  studentId: number;
};

type Thesis = {
  id: number;
  title: string;
  major: string;
  status: string;
  fileName: string;
  approvedBy?: { id: number; firstName: string; lastName: string };
};

type Feedback = {
  id: number;
  content: string;
  createdAt: string;
  author: { firstName: string; lastName: string };
};

export default function ThesisStatus({ studentId }: Props) {
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThesis = async () => {
      try {
        const res = await fetch(`http://localhost:8080/sts/thesis/student/${studentId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setThesis(data);

          // Fetch feedback list for this thesis
          const feedbackRes = await fetch(
            `http://localhost:8080/sts/feedback/thesis/${data.id}`,
            { credentials: "include" }
          );
          if (feedbackRes.ok) {
            const feedbackData = await feedbackRes.json();
            setFeedback(feedbackData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchThesis();
  }, [studentId]);

  if (loading) return <p>Loading...</p>;

  if (!thesis)
    return <p className="text-gray-600">No thesis uploaded yet.</p>;

  return (
    <div className="space-y-4">
      <div>
        <p><strong>Title:</strong> {thesis.title}</p>
        <p><strong>Major:</strong> {thesis.major}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              thesis.status === "APPROVED"
                ? "text-green-600"
                : thesis.status === "PENDING"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {thesis.status}
          </span>
        </p>
        {thesis.approvedBy && (
          <p>
            <strong>Reviewed by:</strong>{" "}
            {thesis.approvedBy.firstName} {thesis.approvedBy.lastName}
          </p>
        )}
        <a
          href={`http://localhost:8080/sts/thesis/${thesis.id}/file`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Thesis File
        </a>
      </div>

      {/* Feedback Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Feedback</h3>
        {feedback.length === 0 ? (
          <p className="text-gray-600">No feedback yet.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {feedback.map((f) => (
              <li key={f.id}>
                <p>{f.content}</p>
                <p className="text-sm text-gray-500">
                  – {f.author.firstName} {f.author.lastName},{" "}
                  {new Date(f.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}