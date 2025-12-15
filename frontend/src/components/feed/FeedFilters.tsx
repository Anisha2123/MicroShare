import { Flame, Clock, ThumbsUp, Bookmark } from "lucide-react";

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
    <div className="flex flex-wrap gap-2">
      {filters.map(f => {
        const Icon = f.icon;
        const active = sort === f.key;

        return (
          <button
            key={f.key}
            onClick={() => setSort(f.key)}
            className={`
              flex items-center gap-1.5 px-4 py-2
              rounded-full
              text-sm font-medium
              transition-colors duration-200
              whitespace-nowrap
              border
              ${
                active
                  ? "bg-purple-100 text-purple-700 border-purple-100" // subtle active highlight
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100" // neutral inactive
              }
            `}
          >
            <Icon
              size={16}
              className={active ? "text-purple-500" : "text-gray-400"} // accent icon
            />
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
