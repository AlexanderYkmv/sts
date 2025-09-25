import type { Thesis } from "../../pages/ViceDeanDashboard/ViceDeanDashboard";

type Props = {
    theses: Thesis[];
    onSelect: (t: Thesis) => void;
    onRefresh?: () => void;
};

export default function ThesisTable({ theses, onSelect, onRefresh }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3">Student</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Major</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {theses.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-6 text-center text-gray-600">
                                No theses found.
                            </td>
                        </tr>
                    )}

                    {theses.map((t) => (
                        <tr key={t.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{t.studentName || "—"}</td>
                            <td className="p-3">{t.title}</td>
                            <td className="p-3">{t.major || "—"}</td>
                            <td className="p-3">
                                <span
                                    className={
                                        t.status === "APPROVED"
                                            ? "text-green-600"
                                            : t.status === "PENDING"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                    }
                                >
                                    {t.status}
                                </span>
                            </td>
                            <td className="p-3 flex gap-3">
                                <button
                                    className="text-blue-600 underline"
                                    onClick={() =>
                                        window.open(`http://localhost:8080/sts/thesis/${t.id}/file`, "_blank")
                                    }
                                >
                                    View File
                                </button>

                                <button className="text-purple-700 underline" onClick={() => onSelect(t)}>
                                    Review
                                </button>

                                <button
                                    className="text-sm bg-gray-100 px-2 py-1 rounded"
                                    onClick={() => onRefresh?.()}
                                >
                                    Refresh
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}