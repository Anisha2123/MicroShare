export function SuggestedUserSkeleton() {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="space-y-1">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-2 w-16 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-3 w-12 bg-gray-200 rounded" />
    </div>
  );
}
