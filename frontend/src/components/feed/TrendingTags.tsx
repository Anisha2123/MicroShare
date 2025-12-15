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

  const toggleFollow = (tag: string) => {
    setFollowed(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="trending-tags-container">
      {/* Header */}
      <div className="trending-header">
        {/* <h3>Current Tags</h3> */}
        <div className="range-toggle">
          {["daily", "weekly"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r as any)}
              className={range === r ? "active" : ""}
            >
              {r === "daily" ? "Daily" : "Weekly"}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="tags-loading">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="tag-skeleton" />
          ))}
        </div>
      )}

      {/* Tags */}
      {!loading && (
        <div className="tags-list">
          {tags.length > 0 ? (
            tags.map(tag => (
              <div key={tag._id} className="tag-item">
                <button className="tag-left" onClick={() => onSelect(tag._id)}>
                  <span
                    className={`heat-dot ${
                      tag.count > 20
                        ? "heat-high"
                        : tag.count > 10
                        ? "heat-medium"
                        : "heat-low"
                    }`}
                  />
                  <div className="tag-info">
                    <div className="tag-name-row">
                      <span className="tag-name">#{tag._id}</span>
                      {tag.ai && <span className="ai-badge">AI</span>}
                    </div>
                    <span className="tag-count">{tag.count} mentions</span>
                  </div>
                </button>

                <button
                  className={`follow-btn ${
                    followed.includes(tag._id) ? "following" : ""
                  }`}
                  onClick={() => toggleFollow(tag._id)}
                >
                  {followed.includes(tag._id) ? "Following" : "Follow"}
                </button>
              </div>
            ))
          ) : (
            <p className="no-tags">No trending tags yet</p>
          )}
        </div>
      )}
    </div>
  );
}
