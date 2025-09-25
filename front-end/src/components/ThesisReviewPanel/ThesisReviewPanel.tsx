import { useState } from "react";
import type { Thesis, User } from "../../pages/ViceDeanDashboard/ViceDeanDashboard";

type Props = {
    thesis: Thesis;
    viceDean: User;
    onClose: () => void;
    onReviewed: () => void;
};

export default function ThesisReviewPanel({ thesis, viceDean, onClose, onReviewed }: Props) {
    const [status, setStatus] = useState<"APPROVED" | "REJECTED">(
        thesis.status === "APPROVED" || thesis.status === "REJECTED" ? thesis.status : "APPROVED"
    );
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitReview = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1️⃣ Submit thesis decision
            const res = await fetch("http://localhost:8080/sts/vice-dean/thesis/decision", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    thesisId: thesis.id,
                    viceDeanId: viceDean.userId,
                    status,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Failed to submit review");
            }

            // 2️⃣ Submit feedback if exists
            if (feedback.trim()) {
                const fbRes = await fetch("http://localhost:8080/sts/feedback", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ thesisId: thesis.id, content: feedback }),
                });

                if (!fbRes.ok) {
                    const msg = await fbRes.text();
                    throw new Error(msg || "Failed to submit feedback");
                }
            }

            onReviewed();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 space-y-4">
                <h2 className="text-xl font-bold text-purple-700">Review Thesis</h2>
                <p>
                    <strong>Student:</strong> {thesis.student?.firstName} {thesis.student?.lastName}
                </p>
                <p>
                    <strong>Title:</strong> {thesis.title}
                </p>
                <p>
                    <strong>Major:</strong> {thesis.major || "—"}
                </p>

                <div>
                    <label className="font-semibold">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as "APPROVED" | "REJECTED")}
                        className="border rounded p-2 w-full mt-1"
                    >
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>
                </div>

                <div>
                    <label className="font-semibold">Feedback (optional)</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="border rounded p-2 w-full mt-1"
                        rows={4}
                        placeholder="Add feedback for the student..."
                    />
                </div>

                {error && <div className="text-red-600">{error}</div>}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submitReview}
                        className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}