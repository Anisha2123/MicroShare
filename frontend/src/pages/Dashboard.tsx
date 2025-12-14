import { useEffect, useState } from "react";
import { fetchDashboard } from "../services/api";

export default function Dashboard() {
  const [tips, setTips] = useState<any[]>([]);
  const [stats, setStats] = useState({ tipsCreated: 0, tipsSaved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const res = await fetchDashboard();
      setStats(res.data.stats);
      setTips(res.data.tips);
      setLoading(false);
    };
    loadDashboard();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Your Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Tips Created" value={stats.tipsCreated} />
        <StatCard label="Tips Saved" value={stats.tipsSaved} />
      </div>

      {/* Tips */}
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Your Tips
      </h2>

      {tips.length === 0 ? (
        <p className="text-gray-500">You haven’t shared any tips yet.</p>
      ) : (
        <div className="space-y-4">
          {tips.map(tip => (
            <div
              key={tip._id}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <h3 className="font-medium text-gray-900">
                {tip.title}
              </h3>

              <p className="text-sm text-gray-700 mt-1">
                {tip.content}
              </p>

              <div className="flex flex-wrap justify-between mt-4 text-xs text-gray-400">
                <div className="flex gap-2">
                  {tip.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-100 px-2 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <span>
                  {new Date(tip.createdAt).toLocaleDateString()} •{" "}
                  {new Date(tip.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Stat Card */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}
