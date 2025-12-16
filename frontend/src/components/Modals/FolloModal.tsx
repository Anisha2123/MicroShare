function FollowModal({ title, users, actionLabel, onAction, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-80 rounded-xl p-4">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {users.map((u: any) => (
          <div key={u._id} className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                {u.name[0]}
              </div>
              <span className="text-sm">{u.name}</span>
            </div>

            <button
              onClick={() => onAction(u._id)}
              className="text-sm text-red-500"
            >
              {actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
