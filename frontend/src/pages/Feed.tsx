import { useEffect, useState } from "react";
import { getTips } from "../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";

interface Tip {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  attachments?: string[];
  createdAt: string;
  user?: { name: string };
  likes?: string[];
  emojis?: { emoji: string; user?: { name: string } }[];
  comments?: { content: string; user?: { name: string } }[];
  bookmarks?: string[];
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


  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

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

  const bookmarkTip = async (id: string) => {
    await axios.post(
      `http://localhost:5000/api/tip/${id}/bookmark`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTips();
  };

  const addEmoji = async (id: string, emoji: string) => {
    await axios.post(
      `http://localhost:5000/api/tip/${id}/emoji`,
      { emoji },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTips();
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
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-md mx-auto space-y-6">

          <h1 className="text-xl font-semibold text-center">Knowledge Feed</h1>
          {loading && <p className="text-center text-gray-500">Loading...</p>}

          {tips.map(tip => {
            const date = new Date(tip.createdAt);

            return (
              <div
                key={tip._id}
                className="bg-white border rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex justify-between px-4 py-3 text-sm">
                  <span className="font-medium">
                    {tip.user?.name || "Anonymous"}
                  </span>
                  <span className="text-gray-400">
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

                {/* Attachments */}
                {tip.attachments && tip.attachments?.length > 0 && (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="w-full aspect-square bg-black"
                  >
                    {tip.attachments.map((file, i) => (
                      <SwiperSlide key={i}>
                        {/\.(jpg|jpeg|png|gif)$/i.test(file) ? (
                          <img
                            src={`http://localhost:5000${file}`}
                            onClick={() =>
                              setZoomImage(`http://localhost:5000${file}`)
                            }
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <button
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = `http://localhost:5000${file}`;
                                link.download = file.split("/").pop() || "file";
                                link.click();
                              }}
                              className="bg-purple-600 text-white px-4 py-2 rounded"
                            >
                              Download Document
                            </button>
                          </div>
                        )}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
                

                {/* Content */}
                <div className="px-4 py-3">
                  <h2 className="font-semibold">{tip.title}</h2>
                  <p className="text-sm text-gray-700 mt-1">{tip.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tip.tags.map(tag => (
                      <span key={tag} className="text-xs text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 px-4 pb-2 text-sm">
                  <button onClick={() => likeTip(tip._id)}>
                    👍 {tip.likes?.length || 0}
                  </button>

                  <button onClick={() => addEmoji(tip._id, "🔥")}>
                    🔥 {tip.emojis?.length || 0}
                  </button>

                  <button onClick={() => bookmarkTip(tip._id)}>
                    {tip.bookmarks?.includes(userId || "") ? "🔖" : "📑"}
                  </button>

                  <button
  onClick={() => {
    setSelectedTipId(tip._id);
    setShowForward(true);
  }}
>
  📤
</button>

                  <button onClick={() => shareTip(tip._id)}>🔗</button>
               
                </div>

                {/* Comments */}
                {/* Comments Toggle */}
<div className="px-4 pb-3 text-sm">

  {/* Show comments button */}
{tip.comments && tip.comments.length > 0 && (
  <button
    onClick={() =>
      setOpenComments(openComments === tip._id ? null : tip._id)
    }
    className="text-gray-500 mb-2 text-sm"
  >
    {openComments === tip._id
      ? "Hide comments"
      : `View comments (${tip.comments.length})`}
  </button>
)}

{/* Comments List */}
{openComments === tip._id && (
  <div className="space-y-3 mb-2">
    {tip.comments && tip.comments.map((c: any) => (
      <div key={c._id} className="text-sm">
        {/* Comment */}
        <p>
          <span className="font-medium">
            {c.user?.name || "User"}:
          </span>{" "}
          {c.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center gap-3 text-xs text-gray-500 ml-2 mt-1">
          <button onClick={() => setReplyTo(c._id)}>Reply</button>

          <button onClick={() => addCommentEmoji(tip._id, c._id, "❤️")}>
            ❤️ {c.emojis?.length || 0}
          </button>

          <button onClick={() => addCommentEmoji(tip._id, c._id, "🔥")}>
            🔥
          </button>
        </div>

        {/* Replies */}
        {c.replies && c.replies.length > 0 && (
          <div className="ml-6 mt-2 space-y-1">
            {c.replies.map((r: any, idx: number) => (
              <p key={idx} className="text-xs">
                <span className="font-medium">
                  {r.user?.name || "User"}:
                </span>{" "}
                {r.content}
              </p>
            ))}
          </div>
        )}

        {/* Reply Input */}
        {replyTo === c._id && (
          <input
            placeholder="Write a reply..."
            className="ml-6 mt-2 w-full border rounded px-2 py-1 text-xs"
            onKeyDown={e => {
              if (e.key === "Enter") {
                replyToComment(
                  tip._id,
                  c._id,
                  e.currentTarget.value
                );
                e.currentTarget.value = "";
              }
            }}
          />
        )}
      </div>
    ))}
  </div>
)}


  {/* Add Comment Input */}
  <input
  placeholder="Add a comment..."
  className="w-full mt-1 border rounded px-2 py-1 text-sm"
  onKeyDown={e => {
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
