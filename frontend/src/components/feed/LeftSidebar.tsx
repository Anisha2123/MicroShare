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
          border-r border-purple-100
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-auto
          pt-16 lg:pt-0
          px-4 lg:px-0
        `}
      >
        {/* Close Button (mobile only) */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-purple-100"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="space-y-6 ">
          {/* User Card */}
          {/* <div className="bg-white rounded-2xl border border-purple-100 shadow-sm">
            <UserCard />
          </div> */}

          {/* Feed Filters */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-purple-700 mb-3">
              Feed Preferences
            </h3>
            <FeedFilters sort={sort} setSort={setSort} />
          </div>

          {/* Trending Tags */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-purple-700 mb-3">
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
