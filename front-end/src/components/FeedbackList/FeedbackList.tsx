import { useEffect, useState } from "react";

type FeedbackDto = {
    id: number;
    content: string;
    createdAt: string;
    author: { firstName?: string; lastName?: string };
};

export default function FeedbackList({ thesisId, reloadKey = 0 }: { thesisId: number; reloadKey?: number; }) {
    const [items, setItems] = useState<FeedbackDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchFeedback = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/sts/feedback/thesis/${thesisId}`, {
                    credentials: "include",
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to fetch feedback");
                const data: FeedbackDto[] = await res.json();
                if (!cancelled) setItems(data);
            } catch (err) {
                console.error(err);
                if (!cancelled) setItems([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchFeedback();
        return () => {
            cancelled = true;
        };
    }, [thesisId, reloadKey]);

    if (loading) return <div className="text-sm text-gray-500">Loading feedback...</div>;
    if (items.length === 0) return <div className="text-sm text-gray-500">No feedback yet.</div>;

    return (
        <ul className="space-y-3">
            {items.map((f) => (
                <li key={f.id} className="bg-gray-50 p-2 rounded">
                    <p className="text-sm">{f.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        – {f.author?.firstName || ""} {f.author?.lastName || ""}, {new Date(f.createdAt).toLocaleString()}
                    </p>
                </li>
            ))}
        </ul>
    );
}