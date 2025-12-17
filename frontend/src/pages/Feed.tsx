import { useEffect, useState, useRef } from "react";
import { getTips } from "../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import LeftSidebar from "../components/feed/LeftSidebar";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import RightSidebar from "../components/feed/RightSidebar";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import "../App.css"

interface Tip {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  attachments?: string[];
  createdAt: string;
  user?: { name: string };
  likes?: string[];
  // emojis?: { emoji: string; user?: { name: string } }[];
  comments: { content: string; user?: { name: string } }[];
  bookmarks: string[];
}

export default function Feed() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [showForward, setShowForward] = useState(false);
const [selectedTipId, setSelectedTipId] = useState<string | null>(null);
const [users, setUsers] = useState<any[]>([]);
const [openComments, setOpenComments] = useState<string | null>(null);
const [replyTo, setReplyTo] = useState<string | null>(null);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
 const [sort, setSort] = useState("latest");
  const [tag, setTag] = useState<string | null>(null);
const [expanded, setExpanded] = useState<Record<string, boolean>>({});
const [heartAnim, setHeartAnim] = useState<string | null>(null);
const lastTap = useRef<Record<string, number>>({});
const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});


  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId") ?? "";

  const fetchTips = async () => {
    const res = await getTips();
    setTips(res.data);

    
  };
  useEffect(() => {
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      fetchTips();
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [page, hasMore]);


  useEffect(() => {
    fetchTips().finally(() => setLoading(false));
  }, []);

  /* ---------- ACTIONS ---------- */

  const likeTip = async (id: string) => {
    await axios.post(
      `http://localhost:5000/api/tip/${id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTips();
  };
  const handleDoubleTap = (tipId: string) => {
  const now = Date.now();
  const last = lastTap.current[tipId] || 0;

  if (now - last < 300) {
    // DOUBLE TAP DETECTED
    likeTip(tipId); // 🔥 backend untouched
    setHeartAnim(tipId);

    setTimeout(() => setHeartAnim(null), 800);
  }

  lastTap.current[tipId] = now;
};

  
  const bookmarkTip = async (tipId: string) => {
  setTips((prev: Tip[]) =>
    prev.map((tip) => {
      if (tip._id !== tipId) return tip;

      const bookmarks = tip.bookmarks ?? []; // ✅ normalize

      const isBookmarked = bookmarks.some(
        (id) => id.toString() === userId
      );

      return {
        ...tip,
        bookmarks: isBookmarked
          ? bookmarks.filter((id) => id !== userId)
          : [...bookmarks, userId],
      };
    })
  );

  try {
    await axios.post(
      `http://localhost:5000/api/tip/${tipId}/bookmark`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch {
    fetchTips(); // rollback on failure
  }
};





  const addComment = async (id: string, content: string) => {
    if (!content.trim()) return;
    await axios.post(
      `http://localhost:5000/api/tip/${id}/comment`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTips();
  };

  const shareTip = async (tipId: string) => {
  const res = await axios.post(
    `http://localhost:5000/api/tip/${tipId}/share`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  navigator.clipboard.writeText(res.data.url);
  alert("Link copied to clipboard!");
};

const forwardTip = async (tipId: string, receiverId: string) => {
  await axios.post(
    `http://localhost:5000/api/tip/${tipId}/forward`,
    { receiverId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  alert("Tip forwarded!");
};

const addCommentEmoji = async (
  tipId: string,
  commentId: string,
  emoji: string
) => {
  await axios.post(
    `http://localhost:5000/api/tip/${tipId}/comment/${commentId}/emoji`,
    { emoji },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  fetchTips();
};

const replyToComment = async (
  tipId: string,
  commentId: string,
  content: string
) => {
  if (!content.trim()) return;

  await axios.post(
    `http://localhost:5000/api/tip/${tipId}/comment/${commentId}/reply`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  setReplyTo(null);
  fetchTips();
};




  /* ---------- UI ---------- */

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-0">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="col-span-3 hidden lg:block sticky top-14 h-fit ">
          <LeftSidebar sort={sort} setSort={setSort} setTag={setTag} />
        </aside>

        {/* FEED */}
        {/* FEED */}
<main className="col-span-12 lg:col-span-6">
  <div className="flex flex-col items-center space-y-6">
    {loading && <p className="text-gray-500 text-center">Loading...</p>}

    {tips.map((tip) => {
      const date = new Date(tip.createdAt);
      
      const isBookmarked = tip.bookmarks?.some(
    (id: string) => id.toString() === userId
     
  );
  
      return (
        <div
          key={tip._id}
          className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
  {/* Left: Avatar + Name */}
  <div className="flex items-center gap-3">
    {/* Avatar */}
    <div
      className="
        w-9 h-9
        rounded-full
        bg-gradient-to-tr from-purple-500 to-purple-400
        flex items-center justify-center
        text-white text-sm font-semibold
        select-none
      "
    >
      {tip.user?.name?.charAt(0).toUpperCase() || "A"}
    </div>

    {/* Name + Time */}
    <div className="flex flex-col leading-tight">
      <span className="text-sm font-medium text-gray-900">
        {tip.user?.name || "Anonymous"}
      </span>

      <span className="text-[11px] text-gray-400">
        {date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })}{" "}
        •{" "}
        {date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  </div>

  {/* Right: More (⋯) */}
  <button
    className="text-gray-400 hover:text-gray-600 transition"
    aria-label="More options"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  </button>
</div>


          {/* Attachments */}
          {/* Attachments – Instagram-style */}
{tip.attachments && tip.attachments.length > 0 && (
  <Swiper
    modules={[Navigation, Pagination]}
    navigation
    pagination={{ clickable: true }}
    className="w-full aspect-square rounded-t-2xl overflow-hidden bg-gray-100"
  >
    {tip.attachments.map((file, i) => (
      <SwiperSlide key={i} className="relative">
        {/\.(jpg|jpeg|png|gif)$/i.test(file) ? (
          <>
            <img
  src={`http://localhost:5000${file}`}
  onClick={() => handleDoubleTap(tip._id)}
  className="w-full h-full object-cover cursor-pointer select-none"
/>

{/* ❤️ Heart Animation Overlay */}
{heartAnim === tip._id && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <Heart
      size={90}
      className="text-white drop-shadow-lg animate-heart"
      fill="white"
    />
  </div>
)}

            {/* Overlay for multiple images */}
            {tip.attachments &&tip.attachments.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded">
                {i + 1} / {tip.attachments && tip.attachments.length}
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = `http://localhost:5000${file}`;
                link.download = file.split("/").pop() || "file";
                link.click();
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700 transition"
            >
              Download
            </button>
          </div>
        )}
      </SwiperSlide>
    ))}
  </Swiper>
)}
{/* ================= ACTION BAR ================= */}
<div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
  {/* Left Actions */}
  <div className="flex items-center gap-5">
    <button
      onClick={() => likeTip(tip._id)}
      className="hover:text-purple-600 transition"
    >
      <Heart
        size={22}
        className={
          tip.likes?.includes(userId || "")
            ? "fill-purple-600 text-purple-600"
            : "text-gray-700"
        }
      />
    </button>

    <button
      onClick={() =>
        setOpenComments(openComments === tip._id ? null : tip._id)
      }
      className="hover:text-purple-600 transition"
    >
      <MessageCircle size={22} className="text-gray-700" />
    </button>

    <button
      onClick={() => shareTip(tip._id)}
      className="hover:text-purple-600 transition"
    >
      <Share2 size={22} className="text-gray-700" />
    </button>
  </div>

  {/* Right Actions */}
  <div className="flex items-center gap-4">
    <button
      onClick={() => bookmarkTip(tip._id)}
      className="hover:text-purple-600 transition"
    >
      <Bookmark
  size={22}
  className={
    isBookmarked
      ? "fill-purple-600 text-purple-600"
      : "text-gray-700"
  }
/>

    </button>

    <button
      onClick={() => {
        setSelectedTipId(tip._id);
        setShowForward(true);
      }}
      className="hover:text-gray-900 transition"
    >
      <MoreHorizontal size={22} className="text-gray-700" />
    </button>
  </div>
</div>

{/* Like count (Instagram style) */}
<div className="px-4 pb-2 text-sm font-medium text-gray-900">
  {tip.likes?.length || 0} likes
</div>

        
{/* ================= CONTENT ================= */}
<div className="px-4 pt-3 pb-2 text-sm text-gray-900">

  {/* Title (acts like username) */}
  <span className="font-semibold mr-1">
    {tip.title}
  </span>

  {/* Caption + Tags */}
  <span
    className={`inline ${
      !expanded[tip._id] ? "line-clamp-4" : ""
    } leading-snug`}
  >
    {tip.content}

    {tip.tags.length > 0 && (
      <span className="ml-1">
        {tip.tags.map(tag => (
          <button
            key={tag}
            onClick={() => setTag(tag)}
            className="text-purple-600 hover:text-purple-700 ml-1"
          >
            #{tag}
          </button>
        ))}
      </span>
    )}
  </span>

  {/* More / Less */}
  {(tip.content.length > 120 || tip.tags.length > 0) && (
    <button
      onClick={() =>
        setExpanded(prev => ({
          ...prev,
          [tip._id]: !prev[tip._id],
        }))
      }
      className="block text-gray-400 hover:text-gray-600 mt-0.5"
    >
      {expanded[tip._id] ? "less" : "more"}
    </button>
  )}
</div>

{/* COMMENTS */}
<div className="px-4 pb-3 text-sm">

  {/* View all comments */}
  {tip.comments?.length > 0 && (
    <button
      onClick={() =>
        setOpenComments(openComments === tip._id ? null : tip._id)
      }
      className="text-gray-500 text-sm mb-1 hover:text-gray-700"
    >
      {openComments === tip._id
        ? "Hide comments"
        : `View all ${tip.comments.length} comments`}
    </button>
  )}

  {/* Comments */}
  {openComments === tip._id && (
    <div className="space-y-2 mt-1">
      {tip.comments.map((c: any) => {
        const repliesOpen = openReplies[c._id];

        return (
          <div key={c._id} className="leading-snug">

            {/* Comment */}
            <p className="text-sm text-gray-900">
              <span className="font-medium mr-1">
                {c.user?.name || "user"}
              </span>
              {c.content}
            </p>

            {/* Meta row (8h · likes · Reply) */}
            <div className="flex items-center gap-4 text-xs text-gray-400 ml-1 mt-0.5">
              <span>0h</span>

              <button
                onClick={() => addCommentEmoji(tip._id, c._id, "❤️")}
                className="hover:text-gray-600"
              >
                {c.emojis?.length || 1} likes
              </button>

              <button
                onClick={() => setReplyTo(c._id)}
                className="hover:text-gray-600"
              >
                Reply
              </button>
            </div>

            {/* View replies */}
            {c.replies?.length > 0 && (
              <button
                onClick={() =>
                  setOpenReplies(prev => ({
                    ...prev,
                    [c._id]: !prev[c._id],
                  }))
                }
                className="text-xs text-gray-500 mt-1 ml-1 hover:text-gray-700"
              >
                {repliesOpen
                  ? "Hide replies"
                  : `View replies (${c.replies.length})`}
              </button>
            )}

            {/* Replies */}
            {repliesOpen && c.replies?.length > 0 && (
              <div className="ml-4 mt-1 space-y-1">
                {c.replies.map((r: any, idx: number) => (
                  <p key={idx} className="text-xs text-gray-800">
                    <span className="font-medium mr-1">
                      {r.user?.name || "user"}
                    </span>
                    {r.content}
                  </p>
                ))}
              </div>
            )}

            {/* Reply input */}
            {replyTo === c._id && (
              <input
                placeholder="Reply..."
                className="
                  ml-4 mt-1 w-full
                  text-xs
                  border-none
                  bg-transparent
                  focus:outline-none
                  placeholder-gray-400
                "
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    replyToComment(tip._id, c._id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  )}

  {/* Add comment */}
  <input
    placeholder="Add a comment…"
    className="
      w-full mt-2
      text-sm
      border-none
      bg-transparent
      focus:outline-none
      placeholder-gray-400
    "
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        addComment(tip._id, e.currentTarget.value);
        e.currentTarget.value = "";
        setOpenComments(tip._id);
      }
    }}
  />
</div>


        </div>
      );
    })}
  </div>
</main>


        {/* RIGHT SIDEBAR (next step) */}
        <aside className="col-span-3 hidden lg:block sticky top-14 h-fit ">
          {/* Coming next */}
          <RightSidebar />
        </aside>

      </div>
        
      </div>

      {/* Image Zoom */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setZoomImage(null)}
        >
          <img src={zoomImage} className="max-w-full max-h-full" />
        </div>
      )}
      
       {/* ✅ FORWARD MODAL — PUT HERE */}
      {showForward && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-80 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Forward Tip</h3>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users.map(u => (
                <button
                  key={u._id}
                  onClick={() => {
                    forwardTip(selectedTipId!, u._id);
                    setShowForward(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
                >
                  {u.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowForward(false)}
              className="mt-3 w-full text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
