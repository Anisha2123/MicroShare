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
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-8">

        {/* Avatar */}
        <div className="relative">
  <img
  src={
    user.avatar
      ? `http://localhost:5000/${user.avatar}?t=${Date.now()}`
      : "/avatar-placeholder.png"
  }
  className="w-28 h-28 rounded-full object-cover border"
/>


  <input
    type="file"
    hidden
    ref={fileRef}
    onChange={uploadAvatar}
  />

  <button
    onClick={() => fileRef.current?.click()}
    className="absolute bottom-0 right-0 bg-white text-xs px-2 py-1 rounded-full border shadow"
  >
    Edit
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
                className="w-full border rounded-lg p-2 text-sm"
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
    className="mt-4 px-6 py-1.5 rounded-md border text-sm"
  >
    Edit Profile
  </button>
)}

          <div className="flex gap-6 mt-4 text-sm">
            <span><b>{stats.tips}</b> tips</span>

            <span
              onClick={fetchFollowers}
              className="cursor-pointer hover:underline"
            >
              <b>{stats.followers}</b> followers
            </span>

            <span
              onClick={fetchFollowing}
              className="cursor-pointer hover:underline"
            >
              <b>{stats.following}</b> following
            </span>
          </div>

          {/* <button
            onClick={() => setEditingBio(true)}
            className="mt-4 px-6 py-1.5 rounded-md border text-sm"
          >
            Edit Profile
          </button> */}
        </div>
      </div>

      {/* ================= TABS ================= */}
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

      {/* ================= GRID ================= */}
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
