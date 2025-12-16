import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [tips, setTips] = useState<any[]>([]);
  const [tab, setTab] = useState<"tips" | "saved">("tips");

  const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId") || "";
const { id } = useParams(); // 🔥 this is userId

console.log(userId)
// console.log(id)
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setProfile(res.data));
  }, []);

  useEffect(() => {
    if (tab === "tips") {
      axios
        .get(`http://localhost:5000/api/users/profile/${userId}/tips`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setTips(res.data));
    }
  }, [tab]);

   useEffect(() => {
    if (tab === "saved") {
      axios
        .get(`http://localhost:5000/api/users/${userId}/saved-tips`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setTips(res.data));
    }
  }, [tab]);

  if (!profile) return null;

  const { user, stats } = profile;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* HEADER */}
      <div className="flex items-center gap-8">

        {/* Avatar */}
        <div className="w-28 h-28 rounded-full bg-purple-100 text-purple-700
                        flex items-center justify-center text-4xl font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{user.bio || "No bio yet"}</p>

          <div className="flex gap-6 mt-4 text-sm">
            <span><b>{stats.tips}</b> tips</span>
            <span><b>{stats.followers}</b> followers</span>
            <span><b>{stats.following}</b> following</span>
          </div>

          <button className="mt-4 px-6 py-1.5 rounded-md border
                             text-sm font-medium hover:bg-gray-50">
            Edit Profile
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex justify-center gap-10 mt-10 border-t pt-4 text-sm">
        <button
          onClick={() => setTab("tips")}
          className={tab === "tips" ? "font-semibold border-b-2 border-purple-600 pb-2" : ""}
        >
          Tips
        </button>
        <button
          onClick={() => setTab("saved")}
          className={tab === "saved" ? "font-semibold border-b-2 border-purple-600 pb-2" : ""}
        >
          Saved
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {tips.map(tip => (
          <div
            key={tip._id}
            className="border rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <h3 className="font-medium text-sm">{tip.title}</h3>
            <p className="text-xs text-gray-600 mt-1 line-clamp-3">
              {tip.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
