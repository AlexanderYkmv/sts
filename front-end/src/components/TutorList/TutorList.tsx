import { useEffect, useState } from "react";
import type { ResearchTopic } from "../ResearchTopics/ResearchTopics";

export interface TutorWithTopics {
    tutorId: number;
    title: string | null;
    department: string | null;
    officeNumber: number | null;
    topics: ResearchTopic[];
}

interface Props {
    studentId: number;
}

export default function TutorList({ studentId }: Props) {
    const [tutors, setTutors] = useState<TutorWithTopics[] | "loading">("loading");

    const fetchTutors = async () => {
        setTutors("loading");
        try {
            const res = await fetch("http://localhost:8080/sts/tutor/all", { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch tutors");

            const data: TutorWithTopics[] = await res.json();
            setTutors(data);
        } catch (err) {
            console.error(err);
            setTutors([]);
        }
    };

    useEffect(() => {
        fetchTutors();
    }, []);

    if (tutors === "loading") return <p>Loading tutors...</p>;
    if (tutors.length === 0) return <p>No tutors available.</p>;

    return (
        <div className="space-y-6">
            {tutors.map((tutor) => (
                <div key={tutor.tutorId} className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-bold">{tutor.title ?? "-"}</h2>
                    <p><strong>Department:</strong> {tutor.department ?? "-"}</p>
                    <p><strong>Office:</strong> {tutor.officeNumber ?? "-"}</p>

                    <h3 className="mt-2 font-semibold">Research Topics</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mt-2">
                        {tutor.topics.map((topic) => {
                            const full = topic.assignedStudentsCount && topic.assignedStudentsCount >= topic.capacity;
                            return (
                                <div
                                    key={topic.id}
                                    className={`border rounded-lg p-3 shadow ${full ? "bg-gray-200 text-gray-500" : "bg-white"}`}
                                >
                                    <h4 className="font-semibold">{topic.name}</h4>
                                    <p className="text-sm">{topic.topic}</p>
                                    <p className="text-sm">
                                        Capacity: {topic.capacity} | Assigned: {topic.assignedStudentsCount ?? 0}
                                    </p>
                                    {!full && (
                                        <button
                                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                            onClick={() => alert(`You can join this topic: ${topic.name}`)}
                                        >
                                            Join
                                        </button>
                                    )}
                                    {full && (
                                        <p className="mt-2 text-red-500 text-sm font-semibold">Full</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}