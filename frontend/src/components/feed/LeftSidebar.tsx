import { useState } from "react";
import UserCard from "./UserCard";
import TrendingTags from "./TrendingTags";
import FeedFilters from "./FeedFilters";
import { Menu, X } from "lucide-react";

export default function LeftSidebar({  sort,
  setSort,
  setTag,
}: {
  sort: string;
  setSort: (v: string) => void;
  setTag: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
   
  return (
    <>
  {/* ================= SLIDE-IN SIDEBAR ================= */}
  <aside
    className={`
    fixed top-0 left-0 z-[70]
    h-full w-72
    bg-white
    border-r border-gray-200
    transform transition-transform duration-300 ease-out
    ${open ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:static
    lg:h-screen lg:flex lg:flex-col
    px-3 pt-6
    rounded-r-2xl
    shadow-sm
  `}
  >
    {/* Close Button (mobile only) */}
    <button
      onClick={() => setOpen(false)}
      className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-purple-100 transition"
    >
      <X className="w-5 h-5 text-gray-700" />
    </button>

    <div className="flex-1 flex flex-col gap-6 mt-0 lg:mt-0">
      {/* Feed Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Feed Preferences
        </h3>
        <FeedFilters sort={sort} setSort={setSort} />
      </div>

      {/* Trending Tags */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Trending Tags
        </h3>
        <TrendingTags
          onSelect={(tag: string) => {
            setTag(tag);
            setOpen(false); // close drawer on select
          }}
        />
      </div>
    </div>
  </aside>
</>

  );
}
