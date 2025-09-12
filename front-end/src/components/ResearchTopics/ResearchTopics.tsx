export interface ResearchTopic {
  id?: number;
  name: string;
  topic: string;
  capacity: number;
  assignedStudentsCount?: number;
}

interface Props {
  topics: ResearchTopic[];
  onDelete?: (index: number) => void;
}

export default function ResearchTopics({ topics, onDelete }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {topics.map((t, idx) => (
        <div key={idx} className="border rounded-lg p-4 shadow bg-white">
          <h3 className="text-lg font-semibold">{t.name}</h3>
          <p className="text-sm text-gray-600">{t.topic}</p>
          <div className="mt-2 flex justify-between text-sm">
            <span>Capacity: {t.capacity}</span>
            <span>Assigned: {t.assignedStudentsCount ?? 0}</span>
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(idx)}
              className="text-red-600 hover:underline text-sm mt-2"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}