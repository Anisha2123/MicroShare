import { Flame, Clock, ThumbsUp, Bookmark } from "lucide-react";
import "../../App.css"
const filters = [
  { key: "latest", label: "Latest", icon: Clock },
  { key: "popular", label: "Most Liked", icon: ThumbsUp },
  { key: "trending", label: "Trending", icon: Flame },
  { key: "saved", label: "Saved", icon: Bookmark },
];

export default function FeedFilters({
  sort,
  setSort,
}: {
  sort: string;
  setSort: (v: string) => void;
}) {
  return (
    <div className="feed-filters">
      {filters.map(f => {
        const Icon = f.icon;
        const active = sort === f.key;

        return (
          <button
            key={f.key}
            className={`filter-btn ${active ? "active" : ""}`}
            onClick={() => setSort(f.key)}
          >
            <Icon className="filter-icon" />
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
