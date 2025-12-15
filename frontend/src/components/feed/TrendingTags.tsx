import { useEffect, useState } from "react";
import axios from "axios";

type Tag = {
  _id: string;
  count: number;
  ai?: boolean;
};

export default function TrendingTags({ onSelect }: any) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"daily" | "weekly">("daily");
  const [followed, setFollowed] = useState<string[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/tip/trending/tags?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setTags(res.data))
      .finally(() => setLoading(false));
  }, [range]);

  /* 🔥 Heat Color */
  const heatColor = (count: number) => {
    if (count > 20) return "bg-purple-600";
    if (count > 10) return "bg-purple-400";
    return "bg-purple-200";
  };

  const toggleFollow = (tag: string) => {
    setFollowed(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-sm border border-purple-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-purple-700 tracking-wide">
          Trending Tags
        </h3>

        {/* Toggle */}
        <div className="flex bg-purple-50 rounded-lg p-1 text-xs">
          {["daily", "weekly"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r as any)}
              className={`px-3 py-1 rounded-md transition
                ${
                  range === r
                    ? "bg-purple-600 text-white"
                    : "text-purple-600 hover:bg-purple-100"
                }`}
            >
              {r === "daily" ? "Daily" : "Weekly"}
            </button>
          ))}
        </div>
      </div>

      {/* Skeleton Loader */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-8 rounded-lg bg-purple-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Tags */}
      {!loading && (
        <div className="space-y-2">
          {tags.map((tag, index) => (
            <div
              key={tag._id}
              className="group flex items-center justify-between px-3 py-2 rounded-xl
                         hover:bg-purple-50 transition"
            >
              {/* Left */}
              <button
                onClick={() => onSelect(tag._id)}
                className="flex items-center gap-3 text-left"
              >
                {/* Heat Dot */}
                <span
                  className={`w-2.5 h-2.5 rounded-full ${heatColor(
                    tag.count
                  )}`}
                />

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                      #{tag._id}
                    </span>

                    {/* AI Badge */}
                    {tag.ai && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full
                                       bg-purple-100 text-purple-600 font-semibold">
                        AI
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-gray-400">
                    {tag.count} mentions
                  </span>
                </div>
              </button>

              {/* Follow */}
              <button
                onClick={() => toggleFollow(tag._id)}
                className={`text-xs font-medium px-3 py-1 rounded-full transition
                  ${
                    followed.includes(tag._id)
                      ? "bg-purple-600 text-white"
                      : "border border-purple-300 text-purple-600 hover:bg-purple-100"
                  }`}
              >
                {followed.includes(tag._id) ? "Following" : "Follow"}
              </button>
            </div>
          ))}

          {tags.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No trending tags yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
