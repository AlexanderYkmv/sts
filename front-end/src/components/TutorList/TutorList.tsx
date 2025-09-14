import { useEffect, useState } from "react";

export interface ResearchTopic {
    id: number;
    name: string;
    topic: string;
    capacity: number;
    assignedStudentsCount?: number;
}

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
    const [joinedTopicId, setJoinedTopicId] = useState<number | null>(null); // track joined topic

    const fetchTutorsAndStudent = async () => {
        setTutors("loading");
        try {
            // Fetch tutors
            const tutorsRes = await fetch("http://localhost:8080/sts/tutor/all", { credentials: "include" });
            if (!tutorsRes.ok) throw new Error("Failed to fetch tutors");
            const tutorsData: TutorWithTopics[] = await tutorsRes.json();

            // Fetch current student info
            const studentRes = await fetch("http://localhost:8080/sts/student/me", { credentials: "include" });
            if (!studentRes.ok) throw new Error("Failed to fetch student");
            const studentData = await studentRes.json();

            setTutors(tutorsData);
            if (studentData.researchTopicId) {
                setJoinedTopicId(studentData.researchTopicId);
            }
        } catch (err) {
            console.error(err);
            setTutors([]);
        }
    };

    const handleJoin = async (topicId: number) => {
        try {
            const res = await fetch(`http://localhost:8080/sts/student/enroll/${topicId}`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                const errMsg = await res.text();
                alert(errMsg);
                return;
            }

            await res.json();

            // Update local state immediately
            setTutors((prev) => {
                if (prev === "loading") return prev;
                return prev.map((tutor) => ({
                    ...tutor,
                    topics: tutor.topics.map((topic) =>
                        topic.id === topicId
                            ? { ...topic, assignedStudentsCount: (topic.assignedStudentsCount ?? 0) + 1 }
                            : topic
                    ),
                }));
            });

            setJoinedTopicId(topicId);
        } catch (err) {
            console.error(err);
            alert("Could not join this topic.");
        }
    };

    useEffect(() => {
        fetchTutorsAndStudent();
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
                            const full =
                                topic.assignedStudentsCount !== undefined &&
                                topic.assignedStudentsCount >= topic.capacity;

                            const joined = joinedTopicId === topic.id;

                            return (
                                <div
                                    key={topic.id}
                                    className={`border rounded-lg p-3 shadow ${joined
                                        ? "bg-green-400" // background green, keep text colors normal
                                        : full
                                            ? "bg-gray-200 text-gray-500"
                                            : "bg-white"
                                        } transition-colors duration-300`}
                                >
                                    <h4 className="font-semibold">{topic.name}</h4>
                                    <p className="text-sm">{topic.topic}</p>
                                    <p className="text-sm">
                                        Capacity: {topic.capacity} | Assigned: {topic.assignedStudentsCount ?? 0}
                                    </p>

                                    {!full && !joined && (
                                        <button
                                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                            onClick={() => handleJoin(topic.id)}
                                        >
                                            Join
                                        </button>
                                    )}

                                    {joined && (
                                        <p className="mt-2 font-semibold text-center">Joined</p>
                                    )}

                                    {full && !joined && (
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