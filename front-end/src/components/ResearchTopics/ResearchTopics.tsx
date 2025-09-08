export interface ResearchTopic {
  id?: number;
  name: string;
  topic: string;
  assignedStudentsCount?: number;
}

export default function ResearchTopics({ topics, onDelete }: { topics: ResearchTopic[]; onDelete?: (index:number)=>void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {topics.map((t, idx) => (
        <div key={idx} className="border rounded-lg p-4 shadow-sm bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{t.topic}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Assigned students</div>
              <div className="text-xl font-bold">{t.assignedStudentsCount ?? "—"}</div>
            </div>
          </div>
          {onDelete && (
            <div className="mt-3">
              <button onClick={()=>onDelete(idx)} className="text-red-600 hover:underline text-sm">Remove topic</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}