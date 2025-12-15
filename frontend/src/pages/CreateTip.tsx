import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createTip } from "../services/api";
import { Smile, Image, Paperclip, X } from "lucide-react";

const MAX_CHARS = 500;

export default function CreateTip() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    visibility: "public",
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const tagsArray = form.tags
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
     const files = Array.from(e.target.files);

  setAttachments(prev => [...prev, ...files]);

   // reset input so same file can be re-selected
  e.target.value = "";

  };
   
  
  const addEmoji = (emoji: string) => {
    setForm(prev => ({ ...prev, content: prev.content + emoji }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.content) {
      setError("Title and content are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("visibility", form.visibility);
    tagsArray.forEach(tag => formData.append("tags[]", tag));

    attachments.forEach(file => {
  formData.append("attachments", file);
});


    setLoading(true);
    try {
      await createTip(formData);
      navigate("/feed");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create tip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 px-6 sm:px-10 py-8">

        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Share a Tip
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          {/* Content */}
          <div className="border rounded-xl px-4 py-3">
            <textarea
              rows={5}
              maxLength={MAX_CHARS}
              placeholder="Write something valuable..."
              className="w-full resize-none text-sm focus:outline-none"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
            />

            {/* Toolbar */}
            <div className="mt-3 flex items-center justify-between text-gray-400">
              <div className="flex gap-4">
                {/* Emoji */}
                <button type="button" onClick={() => addEmoji("😊")}>
                  <Smile size={18} />
                </button>

                {/* Image / Doc */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={18} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>

              <span className="text-xs">
                {form.content.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Attachments Preview */}
{attachments.length > 0 && (
  <div className="space-y-2">
    {attachments.map((file, index) => (
      <div
        key={index}
        className="flex items-center justify-between border rounded-lg px-4 py-2 text-sm bg-gray-50"
      >
        <div className="flex items-center gap-2 truncate">
          {file.type.startsWith("image") ? "🖼️" : "📎"}
          <span className="truncate max-w-[220px]">
            {file.name}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            setAttachments(prev =>
              prev.filter((_, i) => i !== index)
            )
          }
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
)}


          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full border rounded-lg px-4 py-2.5 text-sm"
            value={form.tags}
            onChange={e => setForm({ ...form, tags: e.target.value })}
          />

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-lg text-sm"
            >
              {loading ? "Posting..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
