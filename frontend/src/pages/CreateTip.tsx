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

  // ✅ CHECK: At least 1 image is required
  const imageFiles = attachments.filter(file =>
    file.type.startsWith("image/")
  );

  if (imageFiles.length === 0) {
    setError("Please upload at least one image to publish the Tip");
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
  <div className="w-full max-w-100">

    {/* Card */}
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-900">
          Share a Tip
        </h1>

        <button
          type="submit"
          form="tipForm"
          disabled={loading}
          className="
            px-4 py-1.5 rounded-md text-sm font-medium
            bg-purple-600 text-white
            hover:bg-purple-500
            disabled:opacity-60
          "
        >
          {loading ? "Posting…" : "Publish"}
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* Form */}
      <form id="tipForm" onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

        {/* Author Row */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">
            A
          </div>
          <span className="text-sm font-medium text-gray-900">
            Share something valuable
          </span>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Tip title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="
            w-full text-lg font-medium text-gray-900
            placeholder-gray-400
            border-none focus:outline-none
          "
        />

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Content */}
        <textarea
          rows={5}
          maxLength={MAX_CHARS}
          placeholder="Explain the tip clearly and concisely…"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          className="
            w-full resize-none text-sm text-gray-800
            placeholder-gray-400
            border-none focus:outline-none leading-relaxed
          "
        />

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="
                  flex items-center justify-between
                  bg-gray-50 border border-gray-200
                  rounded-lg px-4 py-2 text-sm
                "
              >
                <span className="truncate max-w-[240px]">
                  {file.name}
                </span>

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
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
          className="
            w-full text-sm text-gray-800
            placeholder-gray-400
            border border-gray-200 rounded-lg
            px-3 py-2 focus:ring-1 focus:ring-purple-500
          "
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">

          {/* Tools */}
          <div className="flex items-center gap-4 text-gray-500">
            <button type="button" onClick={() => addEmoji("😊")}>
              <Smile size={18} />
            </button>

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

          {/* Counter */}
          <span className="text-xs text-gray-400">
            {form.content.length}/{MAX_CHARS}
          </span>
        </div>
      </form>
    </div>
  </div>
</div>



  );
}
