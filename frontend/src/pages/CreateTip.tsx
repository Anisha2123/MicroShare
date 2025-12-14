import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTip } from "../services/api";

export default function CreateTip() {
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.content) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      await createTip({
        title: form.title,
        content: form.content,
        tags: form.tags.split(",").map(tag => tag.trim()),
      });
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
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
        Share a Tip
      </h1>
      <p className="mt-2 text-sm text-gray-500 max-w-xl">
        Share concise, practical knowledge that helps others learn faster.
      </p>
    </div>

    {error && (
      <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          placeholder="Short and clear title"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          rows={5}
          placeholder="Write your tip in a few clear sentences"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 resize-none
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          required
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          type="text"
          placeholder="JavaScript, Career, Productivity"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
        />
        <p className="mt-1 text-xs text-gray-400">
          Separate tags with commas
        </p>
      </div>

      {/* Actions */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white
            bg-purple-600 hover:bg-purple-500 transition
            ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Posting..." : "Publish Tip"}
        </button>
      </div>
    </form>
  </div>
</div>


  );
}
