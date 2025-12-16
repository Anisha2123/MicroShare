import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import {
  getFollowers,
  getFollowing,
  updateBio,
  unfollowUser,
  removeFollower,
} from "../services/api";
import LeftSidebar from "../components/feed/LeftSidebar";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [tips, setTips] = useState<any[]>([]);
  const [tab, setTab] = useState<"tips" | "saved">("tips");
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [editing, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId") || "";


  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setProfile(res.data);
        setBio(res.data.user.bio || "");
      });
  }, [userId]);

  /* ================= FETCH TIPS ================= */
  useEffect(() => {
    if (tab === "tips") {
      axios
        .get(`http://localhost:5000/api/users/profile/${userId}/tips`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setTips(res.data));
    }

    if (tab === "saved") {
      axios
        .get(`http://localhost:5000/api/users/${userId}/saved-tips`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setTips(res.data));
    }
  }, [tab, userId]);

  /* ================= AVATAR UPLOAD ================= */
  const uploadAvatar = async (e: any) => {
    const fd = new FormData();
    fd.append("avatar", e.target.files[0]);

    const res = await axios.patch("http://localhost:5000/api/users/avatar", fd, {
      headers: { Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data", },
      
    });
    // 🔥 THIS IS THE FIX
  setProfile((prev: any) => ({
    ...prev,
    user: {
      ...prev.user,
      avatar: res.data.avatar,
    },
  }));
    console.log("Avatar from API:", res.data.avatar);

    // window.location.reload();
  };

  /* ================= FOLLOWERS / FOLLOWING ================= */
  const fetchFollowers = async () => {
    const res = await getFollowers(userId);
    setFollowers(res.data);
    setShowFollowers(true);
  };

  const fetchFollowing = async () => {
    const res = await getFollowing(userId);
    setFollowing(res.data);
    setShowFollowing(true);
  };

  const handleUnfollow = async (id: string) => {
    if (!window.confirm("Unfollow this user?")) return;
    await unfollowUser(id);
    fetchFollowing();
    // Refresh profile
  const res = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  setProfile(res.data);
  };

  const handleRemoveFollower = async (id: string) => {
    if (!window.confirm("Remove this follower?")) return;
    await removeFollower(id);
    fetchFollowers();
    // Refresh profile
  const res = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  setProfile(res.data);
  };

  const handleUpdateProfile = async () => {
  await updateBio(bio);
  setEditingBio(false);

  // Refresh profile
  const res = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  setProfile(res.data);
};

  



  if (!profile) return null;

  const { user, stats } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

<div className="bg-gray-50 max-w-5xl mx-auto px-6 py-12">
  <div className="
    bg-white/70
    backdrop-blur-xl
    rounded-3xl
    border border-gray-200/60
    px-8 py-10
    md:px-12
  ">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">

        {/* Avatar */}
        <div className="relative group">
  <img
    src={
      user.avatar
        ? `http://localhost:5000/${user.avatar}?t=${Date.now()}`
        : "/avatar-placeholder.png"
    }
    className="w-28 h-28 rounded-full object-cover border shadow-sm"
  />

  <input
    type="file"
    hidden
    ref={fileRef}
    onChange={uploadAvatar}
  />

  <button
    onClick={() => fileRef.current?.click()}
    className="
      absolute inset-0 rounded-full bg-black/40 text-white text-xs
      opacity-0 group-hover:opacity-100 transition
      flex items-center justify-center
    "
  >
    Change photo
  </button>
</div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{user.name}</h2>

          {!editing ? (
            <p className="text-sm text-gray-500 mt-1">
              {user.bio || "No bio yet"}
            </p>
          ) : (
            <div className="mt-2">
              <textarea
  value={bio}
  onChange={e => setBio(e.target.value)}
  rows={3}
  placeholder="Tell people about yourself…"
  className="
    w-full max-w-sm
    bg-gray-50
    border border-gray-200
    rounded-xl
    px-4 py-3
    text-sm text-gray-800
    placeholder-gray-400
    focus:outline-none
    focus:bg-white
    focus:border-purple-500
    focus:ring-2 focus:ring-purple-500/20
    transition
  "
/>

            </div>
          )}
{editing ? (
  <div className="flex gap-3 mt-3">
    <button
      onClick={handleUpdateProfile}
      className="px-4 py-1.5 bg-purple-600 text-white rounded-md text-sm"
    >
      Update
    </button>

    <button
      onClick={() => setEditingBio(false)}
      className="px-4 py-1.5 border rounded-md text-sm"
    >
      Cancel
    </button>
  </div>
) : (
  <button
    onClick={() => setEditingBio(true)}
    className="mt-2 px-4 py-1.5 border rounded-full text-sm hover:bg-gray-50"
  >
    Edit Profile
  </button>
)}

 {/* ========= stats =============== */}
          <div className="flex gap-8 mt-6 text-sm">
  <div className="text-center">
    <p className="font-semibold">{stats.tips}</p>
    <p className="text-gray-500">Tips</p>
  </div>

  <div
    onClick={fetchFollowers}
    className="text-center cursor-pointer hover:opacity-80"
  >
    <p className="font-semibold">{stats.followers}</p>
    <p className="text-gray-500">Followers</p>
  </div>

  <div
    onClick={fetchFollowing}
    className="text-center cursor-pointer hover:opacity-80"
  >
    <p className="font-semibold">{stats.following}</p>
    <p className="text-gray-500">Following</p>
  </div>
</div>  
        </div>
      </div>
<div className="mt-10 border-t border-gray-200/70" />

      {/* ================= TABS ================= */}
      <div className="flex justify-center gap-10 mt-5 pt-4 text-sm">
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

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8
      ">
  {tips.map(tip => (
    <div
      key={tip._id}
      className="
        bg-white/70
    backdrop-blur-xl
    rounded-3xl
    border border-gray-200/60
    px-8 py-10
    md:px-12
        
      "
    >
      <h3 className="font-medium text-sm mb-1">
        {tip.title}
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {tip.content}
      </p>
    </div>
  ))}
</div>


      {/* ================= FOLLOWERS MODAL ================= */}
      {showFollowers && (
        <Modal title="Followers" onClose={() => setShowFollowers(false)}>
          {followers.map(u => (
            <Row
              key={u._id}
              user={u}
              actionLabel="Remove"
              onAction={() => handleRemoveFollower(u._id)}
            />
          ))}
        </Modal>
      )}

      {/* ================= FOLLOWING MODAL ================= */}
      {showFollowing && (
        <Modal title="Following" onClose={() => setShowFollowing(false)}>
          {following.map(u => (
            <Row
              key={u._id}
              user={u}
              actionLabel="Unfollow"
              onAction={() => handleUnfollow(u._id)}
            />
          ))}
        </Modal>
      )}
      </div>
    </div>
   </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-80 rounded-xl p-4">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({ user, actionLabel, onAction }: any) {
  return (
    <div className="flex justify-between items-center py-2">
      <span>{user.name}</span>
      <button
        onClick={onAction}
        className="text-sm text-purple-600"
      >
        {actionLabel}
      </button>
    </div>
  );
}
