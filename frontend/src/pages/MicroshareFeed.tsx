import React, { useState, useEffect } from 'react';


useEffect(() => {
fetchTips();
}, [searchQuery, selectedTag]);


const handleLike = async (id: string) => {
try {
await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tips/${id}/like`);
fetchTips();
} catch (err) {
console.error(err);
}
};


return (
<div className="min-h-screen bg-[#0b0d10] text-gray-200">
<Navbar />
<div className="max-w-4xl mx-auto px-6 py-14">
<h1 className="text-3xl font-bold text-white mb-6">Microshare Feed</h1>


<div className="flex flex-col md:flex-row gap-4 mb-8">
<input
type="text"
placeholder="Search tips..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-white/30"
/>
<select
value={selectedTag}
onChange={(e) => setSelectedTag(e.target.value)}
className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-200"
>
<option value="">All Tags</option>
<option value="Trading">Trading</option>
<option value="Investing">Investing</option>
<option value="Stocks">Stocks</option>
</select>
</div>


<div className="space-y-6">
{tips.map((tip) => (
<div key={tip._id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
<p className="text-white mb-2">{tip.content}</p>
<div className="flex flex-wrap gap-2 mb-2">
{tip.tags.map((tag, idx) => (
<span key={idx} className="text-sm bg-white/10 px-2 py-1 rounded-full text-gray-400">
{tag}
</span>
))}
</div>
<button
onClick={() => handleLike(tip._id)}
className="text-sm px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20"
>
❤️ Like ({tip.likes})
</button>
</div>
))}
</div>
</div>
</div>
);
};


export default MicroshareFeed;