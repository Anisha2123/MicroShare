import { Link } from "react-router-dom";

export default function Row({
  user,
  linkTo,
  actionLabel,
  onAction,
}: any) {
  return (
    <div className="flex items-center justify-between py-2">
      
      {/* LEFT → clickable profile */}
      <Link
        to={linkTo}
        className="flex items-center gap-3"
      >
        <img
          src={user.avatar || "/avatar-placeholder.png"}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="leading-tight">
          <p className="text-sm font-medium text-gray-900">
            {user.username || user.name}
          </p>
        </div>
      </Link>

      {/* RIGHT → action button */}
      {actionLabel && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 prevent navigation
            onAction();
          }}
          className="text-sm font-semibold text-red-500 hover:text-red-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
