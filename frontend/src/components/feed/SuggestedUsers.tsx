import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SuggestedUserSkeleton } from "./SuggestedUserSkeletion";
import { API_URL } from "../../services/api";

export default function SuggestedUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    axios
      .get(`${API_URL}/users/suggested`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      })
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
      
  }, []);

  const followUser = async (id: string) => {
    await axios.post(
      `${API_URL}/users/follow/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // remove from suggestions
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const shouldShowToggle = users.length > 5;

const visibleUsers = shouldShowToggle
  ? showAll
    ? users
    : users.slice(0, 5)
  : users; // <= 6 → show all


  return (
    <div className="space-y-4">
      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <SuggestedUserSkeleton key={i} />
          ))
        : visibleUsers.map(u => (
            <div
              key={u._id}
              className="flex items-center justify-between"
            >
              {/* Avatar + Name */}
              <Link
                to={`/profile/${u._id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={u.avatar || "/avatar-placeholder.png"}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="leading-tight">
                  <p className="text-sm font-medium text-gray-900">
                    {u.username || u.name}
                  </p>

                  {/* Mutual follower */}
                  {u.mutualFollower && (
                    <p className="text-xs text-gray-400">
                      Followed by {u.mutualFollower}
                    </p>
                  )}
                </div>
              </Link>

              {/* Follow / Follow Back */}
              <button
                onClick={() => followUser(u._id)}
                className="text-sm font-semibold text-blue-500 hover:text-blue-600"
              >
                {u.isFollowBack ? "Follow back" : "Follow"}
              </button>
            </div>
          ))}

      {!loading && shouldShowToggle && (
  <button
    onClick={() => setShowAll(prev => !prev)}
    className="text-xs text-gray-400 hover:text-gray-600"
  >
    {showAll ? "Show less" : "Show more"}
  </button>
)}

    </div>
  );
}
