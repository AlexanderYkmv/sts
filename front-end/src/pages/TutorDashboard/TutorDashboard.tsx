import { Field, FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import ResearchTopics, { type ResearchTopic } from "../../components/ResearchTopics/ResearchTopics";
import TutorSetupForm from "../../components/TutorSetupForm/TutorSetupForm";

interface TutorProfile {
  tutorId: number | null;
  title: string | null;
  department: string | null;
  officeNumber: number | null;
  profileComplete: boolean;
  role: string;
}

interface StudentThesis {
  studentId: number;
  name: string;
  facultyNumber: string;
  thesisTitle: string;
  thesisFileUrl: string;
  feedback?: string;
  thesisId?: number;
}

type ActiveCard = "menu" | "addTopic" | "shareFeedback" | "manageWork";

export default function TutorDashboard() {
  const [profile, setProfile] = useState<TutorProfile | null | "loading">("loading");
  const [initialTopics, setInitialTopics] = useState<ResearchTopic[]>([]);
  const [students, setStudents] = useState<StudentThesis[]>([]);
  const [activeCard, setActiveCard] = useState<ActiveCard>("menu");
  const [topicsLoading, setTopicsLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    setProfile("loading");
    try {
      const res = await fetch("http://localhost:8080/sts/tutor/me", { credentials: "include" });
      if (res.status === 401) {
        setProfile(null);
        setInitialTopics([]);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch tutor profile");

      const data: TutorProfile = await res.json();
      setProfile(data);

      if (data.profileComplete) {
        setTopicsLoading(true);
        const topicsRes = await fetch("http://localhost:8080/sts/tutor/topics", { credentials: "include" });
        if (topicsRes.ok) {
          const topics: ResearchTopic[] = await topicsRes.json();
          setInitialTopics(topics);
        } else {
          setInitialTopics([]);
        }
        setTopicsLoading(false);
      } else {
        setInitialTopics([]);
      }
    } catch (err) {
      console.error(err);
      setProfile(null);
      setInitialTopics([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8080/sts/tutor/students", { credentials: "include" });
      if (res.ok) {
        const data: StudentThesis[] = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveFeedback = async (thesisId?: number, feedback?: string) => {
    if (!thesisId) return;
    try {
      const res = await fetch(`http://localhost:8080/sts/feedback`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thesisId, content: feedback }),
      });
      if (!res.ok) throw new Error("Failed to save feedback");
      alert("Feedback saved!");
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to save feedback.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeCard === "shareFeedback") fetchStudents();
  }, [activeCard]);

  if (profile === "loading") return <div>Loading profile...</div>;
  if (!profile) return <div>Error loading profile or not logged in.</div>;
  if (!profile.profileComplete) return <TutorSetupForm onComplete={fetchProfile} />;

  return (
    <div className="h-full flex flex-col p-6">
      <header className="py-4">
        <h1 className="text-2xl font-bold text-center">Tutor Dashboard</h1>
      </header>

      {/* Menu */}
      {activeCard === "menu" && (
        <main className="flex-1 flex flex-col items-center overflow-hidden">
          <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-24 justify-items-center w-full max-w-7xl p-4">
            <div
              onClick={() => setActiveCard("addTopic")}
              className="cursor-pointer relative bg-white shadow-lg rounded-xl flex flex-col justify-center items-center text-center hover:shadow-2xl hover:-translate-y-1 transition w-[420px] h-64 p-6"
              style={{
                backgroundImage: "url('/research-topic-logo.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >

              <div className="absolute inset-0 bg-white/60 rounded-xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-semibold mb-3">Add Research Topic</h2>
                <p className="text-lg text-gray-700">Create and manage your research topics.</p>
              </div>
            </div>

            <div
              onClick={() => setActiveCard("shareFeedback")}
              className="cursor-pointer relative bg-white shadow-lg rounded-xl flex flex-col justify-center items-center text-center hover:shadow-2xl hover:-translate-y-1 transition w-[420px] h-64 p-6"
              style={{
                backgroundImage: "url('/feedback-logo.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >

              <div className="absolute inset-0 bg-white/60 rounded-xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-semibold mb-3">Share Feedback</h2>
                <p className="text-lg text-gray-700">Check student theses and provide feedback.</p>
              </div>
            </div>

            <div
              onClick={() => setActiveCard("manageWork")}
              className="cursor-pointer relative bg-white shadow-lg rounded-xl flex flex-col justify-center items-center text-center hover:shadow-2xl hover:-translate-y-1 transition w-[420px] h-64 p-6"
              style={{
                backgroundImage: "url('/manage-my-work.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >

              <div className="absolute inset-0 bg-white/60 rounded-xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-semibold mb-3">Manage My Work</h2>
                <p className="text-lg text-gray-700">View your topics and assigned students.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Add Topic */}
      {activeCard === "addTopic" && (
        <main className="flex-1 overflow-y-auto p-6">
          <button className="text-blue-600 underline mb-4" onClick={() => setActiveCard("menu")}>← Back to menu</button>
          {topicsLoading ? <p className="text-gray-500">Loading research topics...</p> : (
            <Formik
              enableReinitialize
              initialValues={{
                topics: initialTopics,
                newName: "",
                newTopic: "",
                newCapacity: 1,
              }}
              onSubmit={async (values) => {
                try {
                  const payload = values.topics.map(t => ({ name: t.name, topic: t.topic, capacity: t.capacity }));
                  const res = await fetch("http://localhost:8080/sts/tutor/topics", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) throw new Error("Failed to save topics");
                  fetchProfile();
                } catch (err) {
                  console.error(err);
                  alert("Failed to save research topics.");
                }
              }}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <FieldArray name="topics">
                    {({ push, remove }) => (
                      <div>
                        {values.topics.length > 0 && <ResearchTopics topics={values.topics} onDelete={remove} />}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-4 space-y-2">
                          <h3 className="font-semibold">Add New Topic</h3>
                          <div className="grid sm:grid-cols-3 gap-3">
                            <Field name="newName" placeholder="Name" className="border p-2 rounded" />
                            <Field name="newTopic" placeholder="Topic" className="border p-2 rounded" />
                            <Field name="newCapacity" type="number" min={1} placeholder="Capacity" className="border p-2 rounded" />
                          </div>
                          <button
                            type="button"
                            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                            onClick={() => {
                              if (!values.newName || !values.newTopic) return;
                              push({ name: values.newName, topic: values.newTopic, capacity: values.newCapacity });
                              setFieldValue("newName", "");
                              setFieldValue("newTopic", "");
                              setFieldValue("newCapacity", 1);
                            }}
                          >Add</button>
                        </div>
                        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded mt-4" disabled={values.topics.length === 0}>Save All</button>
                      </div>
                    )}
                  </FieldArray>
                </Form>
              )}
            </Formik>
          )}
        </main>
      )}

      {/* Share Feedback */}
      {activeCard === "shareFeedback" && (
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <button className="text-blue-600 underline mb-4" onClick={() => setActiveCard("menu")}>← Back to menu</button>
          {students.length === 0 ? <p>No students assigned yet.</p> : students.map(s => (
            <div key={s.studentId} className="bg-white shadow-md rounded-lg p-4 space-y-2">
              <p><strong>Name:</strong> {s.name}</p>
              <p><strong>Faculty Number:</strong> {s.facultyNumber}</p>
              <p><strong>Thesis Title:</strong> {s.thesisTitle}</p>

              {s.thesisId && (
                <div className="space-y-2">
                  <a
                    href={`http://localhost:8080/sts/thesis/${s.thesisId}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View File
                  </a>

                  {s.thesisFileUrl?.toLowerCase().endsWith(".pdf") && (
                    <iframe
                      src={`http://localhost:8080/sts/thesis/${s.thesisId}/file`}
                      className="w-full h-96 border rounded"
                      title={`Thesis Preview - ${s.name}`}
                    />
                  )}
                </div>
              )}

              <textarea
                className="border w-full p-2 rounded mt-2"
                placeholder="Leave feedback"
                value={s.feedback || ""}
                onChange={e => setStudents(prev => prev.map(st => st.studentId === s.studentId ? { ...st, feedback: e.target.value } : st))}
              />
              <button
                className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                onClick={() => saveFeedback(s.thesisId, s.feedback)}
              >Save Feedback</button>
            </div>
          ))}
        </main>
      )}

      {/* Manage Work */}
      {activeCard === "manageWork" && (
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <button className="text-blue-600 underline mb-4" onClick={() => setActiveCard("menu")}>← Back to menu</button>
          {initialTopics.length === 0 ? <p>No research topics yet.</p> :
            initialTopics.map(t => (
              <div key={t.id} className="bg-white shadow-md rounded-lg p-4 space-y-2">
                <p><strong>Name:</strong> {t.name}</p>
                <p><strong>Topic:</strong> {t.topic}</p>
                <p><strong>Capacity:</strong> {t.capacity}</p>
                <p><strong>Assigned Students:</strong> {t.assignedStudentsCount ?? 0}</p>
              </div>
            ))
          }
        </main>
      )}
    </div>
  );
}