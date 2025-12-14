import { useEffect, useState } from "react";
import { getTips } from "../services/api";

interface Tip {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export default function Feed() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await getTips();
        setTips(res.data);
      } catch (err) {
        console.error("Failed to load tips");
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Knowledge Feed
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Discover short, practical tips shared by the community
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-sm text-gray-500">Loading tips...</p>
        )}

        {/* Empty State */}
        {!loading && tips.length === 0 && (
          <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-6 py-8">
            No tips yet. Be the first to share knowledge.
          </div>
        )}

        {/* Tips List */}
        <div className="space-y-4">
  {tips.map(tip => {
    const date = new Date(tip.createdAt);

    return (
      <div
        key={tip._id}
        className="bg-white border border-gray-200 rounded-xl px-6 py-5
                   hover:border-gray-300 transition"
      >
        {/* Title */}
        <h2 className="text-lg font-medium text-gray-900 mb-1">
          {tip.title}
        </h2>

        {/* Content */}
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {tip.content}
        </p>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tip.tags?.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 rounded-md bg-gray-100 text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Date + Time */}
          <span className="whitespace-nowrap">
            {date.toLocaleDateString()} •{" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    );
  })}
</div>

      </div>
    </div>
  );
}
