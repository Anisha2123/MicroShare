import SuggestedUsers from "./SuggestedUsers";
import PopularTips from "./PopularTips";
import ActivityPanel from "./ActivityPanel";
import SavedTipsMini from "./SavedTipsMini";

export default function RightSidebar() {
  return (
    <aside className="hidden xl:block w-80 sticky top-20 h-fit">
      <div className="space-y-6">

        {/* Suggested Users */}
        <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
          <h3 className="text-purple-700 text-sm font-semibold mb-3">
            Suggested Users
          </h3>
          <SuggestedUsers />
        </div>

        {/* Popular Tips */}
        <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
          <h3 className="text-purple-700 text-sm font-semibold mb-3">
            Popular Tips
          </h3>
          <PopularTips />
        </div>

        {/* Activity Panel */}
        <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
          <h3 className="text-purple-700 text-sm font-semibold mb-3">
            Activity
          </h3>
          <ActivityPanel />
        </div>

        {/* Saved Tips */}
        <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
          <h3 className="text-purple-700 text-sm font-semibold mb-3">
            Saved Tips
          </h3>
          <SavedTipsMini />
        </div>

      </div>
    </aside>
  );
}
