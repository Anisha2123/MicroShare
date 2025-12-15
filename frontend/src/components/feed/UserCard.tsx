import { useEffect, useState } from "react";
import axios from "axios";

export default function UserCard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => setUser(res.data));
  }, []);

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="font-semibold text-lg">{user.name}</div>
      <p className="text-xs text-gray-500">{user.email}</p>

      <div className="flex justify-between mt-4 text-sm">
        <div>
          <p className="font-medium">{user.tipsCount}</p>
          <p className="text-gray-500">Tips</p>
        </div>
        <div>
          <p className="font-medium">{user.bookmarksCount}</p>
          <p className="text-gray-500">Saved</p>
        </div>
      </div>
    </div>
  );
}
