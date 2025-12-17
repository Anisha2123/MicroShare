import SuggestedUsers from "./SuggestedUsers";
import { useState } from "react";
// import PopularTips from "./PopularTips";
import ActivityPanel from "./ActivityPanel";
import SavedTipsMini from "./SavedTipsMini";
import TrendingTags from "./TrendingTags";
import FeedFilters from "./FeedFilters";

export default function RightSidebar({ 
  sort,
    setSort,
    setTag,
  }: {
    sort: string;
    setSort: (v: string) => void;
    setTag: (v: string) => void;
  }) {
    const [open, setOpen] = useState(false);
  return (
  <aside
    className="
      hidden xl:flex
      w-80
      sticky top-14
      h-[calc(100vh-3.5rem)]
      py-6 px-4
      bg-white
      rounded-2xl
      flex-col
    "
  >
    {/* 🔝 TOP */}
    <div className="space-y-6">
      <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
        <h3 className="text-purple-700 text-sm font-semibold mb-3">
          Suggested Users
        </h3>
        <SuggestedUsers />
      </div>
    </div>

    {/* 🔽 BOTTOM */}
    <div className="mt-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Feed Preferences
        </h3>
        <FeedFilters sort={sort} setSort={setSort} />
      </div>
    </div>
  </aside>
);

}
