import { useEffect, useState } from "react";

type Props = {
  studentId: number;
  initialThesis?: any | null;
};

type Feedback = {
  id: number;
  content: string;
  createdAt: string;
  author: { firstName: string; lastName: string };
};

export default function ThesisStatus({ studentId, initialThesis }: Props) {
  const [thesis, setThesis] = useState<any | null>(initialThesis || null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(!initialThesis);

  // ✅ Keep thesis in sync when parent passes a new one
  useEffect(() => {
    if (initialThesis) {
      setThesis(initialThesis);
      setLoading(false);
    }
  }, [initialThesis]);

  // ✅ Fetch thesis + feedback if no initialThesis is given
  useEffect(() => {
    if (initialThesis) return; // skip fetching if already provided

    const fetchThesisAndFeedback = async () => {
      setLoading(true);
      try {
        const thesisRes = await fetch(
          `http://localhost:8080/sts/thesis/student/${studentId}`,
          { credentials: "include", cache: "no-store" }
        );

        if (!thesisRes.ok) {
          setThesis(null);
          setFeedback([]);
          return;
        }

        const thesisData = await thesisRes.json();
        setThesis(thesisData);

        if (thesisData?.id) {
          const feedbackRes = await fetch(
            `http://localhost:8080/sts/feedback/thesis/${thesisData.id}`,
            { credentials: "include", cache: "no-store" }
          );
          const feedbackData: Feedback[] = feedbackRes.ok
            ? await feedbackRes.json()
            : [];
          setFeedback(feedbackData);
        } else {
          setFeedback([]);
        }
      } catch (err) {
        console.error("Error fetching thesis:", err);
        setThesis(null);
        setFeedback([]);
      } finally {
        setLoading(false);
      }
    };

    fetchThesisAndFeedback();
  }, [studentId, initialThesis]);

  if (loading) return <p>Loading...</p>;
  if (!thesis) return <p className="text-gray-600">No thesis uploaded yet.</p>;

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-white shadow-md">
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