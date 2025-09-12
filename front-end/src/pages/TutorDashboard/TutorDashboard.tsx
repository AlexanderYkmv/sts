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

interface FormValues {
  topics: ResearchTopic[];
  newName: string;
  newTopic: string;
  newCapacity: number;
}

export default function TutorDashboard() {
  const [profile, setProfile] = useState<TutorProfile | null | "loading">("loading");
  const [initialTopics, setInitialTopics] = useState<ResearchTopic[]>([]);

  const fetchProfile = async () => {
    setProfile("loading");
    try {
      const res = await fetch("http://localhost:8080/sts/tutor/me", {
        credentials: "include",
      });

      if (res.status === 401) {
        setProfile(null);
        setInitialTopics([]);
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch tutor profile");

      const data: TutorProfile = await res.json();
      setProfile(data);

      if (data.profileComplete) {
        const topicsRes = await fetch("http://localhost:8080/sts/tutor/topics", {
          credentials: "include",
        });

        if (topicsRes.ok) {
          const topics: ResearchTopic[] = await topicsRes.json();
          setInitialTopics(topics);
        } else {
          setInitialTopics([]);
        }
      } else {
        setInitialTopics([]);
      }
    } catch (err) {
      console.error(err);
      setProfile(null);
      setInitialTopics([]);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (profile === "loading") return <div>Loading profile...</div>;
  if (!profile) return <div>Error loading profile or not logged in.</div>;
  if (!profile.profileComplete) return <TutorSetupForm onComplete={fetchProfile} />;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Tutor Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-4">
        <p><strong>Title:</strong> {profile.title ?? "-"}</p>
        <p><strong>Department:</strong> {profile.department ?? "-"}</p>
        <p><strong>Office:</strong> {profile.officeNumber ?? "-"}</p>
      </div>

      <Formik<FormValues>
        enableReinitialize
        initialValues={{
          topics: initialTopics,
          newName: "",
          newTopic: "",
          newCapacity: 1,
        }}
        onSubmit={async (values) => {
          try {
            const payload = values.topics.map(t => ({
              name: t.name,
              topic: t.topic,
              capacity: t.capacity,
            }));

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
                    >
                      Add
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="bg-green-500 text-white px-3 py-1 rounded mt-4"
                    disabled={values.topics.length === 0}
                  >
                    Save All
                  </button>
                </div>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  );
}