import { useEffect, useState } from "react";
import ThesisReviewPanel from "../../components/ThesisReviewPanel/ThesisReviewPanel";
import ThesisTable from "../../components/ThesisTable/ThesisTable";

export type User = {
  userId: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
};

export type Thesis = {
  student: any;
  id: number;
  title: string;
  major?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  studentName?: string;
  approvedBy?: { firstName?: string; lastName?: string; id?: number };
};

export default function ViceDeanDashboard() {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Thesis | null>(null);
  const [me, setMe] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    try {
      const res = await fetch("http://localhost:8080/sts/auth/me", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Not logged in");
      const data = await res.json();
      setMe(data);
    } catch (err) {
      console.error(err);
      setMe(null);
    }
  };

  const fetchTheses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/sts/vice-dean/theses", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch theses");
      const data: Thesis[] = await res.json();
      setTheses(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error fetching theses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    fetchTheses();
  }, []);

  const refresh = async () => {
    await fetchTheses();
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black-700 text-center">Vice Dean Dashboard</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <strong>All submitted theses</strong>
        </div>

        {loading ? (
          <div className="p-6">Loading theses...</div>
        ) : (
          <ThesisTable theses={theses} onSelect={(t) => setSelected(t)} onRefresh={fetchTheses} />
        )}
      </div>

      {selected && me && (
        <ThesisReviewPanel
          thesis={selected}
          viceDean={me}
          onClose={() => setSelected(null)}
          onReviewed={refresh}
        />
      )}
    </div>
  );
}