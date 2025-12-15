import axios from "axios";
import { useEffect, useState } from "react";

export default function SavedTipsMini() {
  const [tips, setTips] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/tip/saved/mini",{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }
    ).then(res => setTips(res.data));
  }, []);

  return (
    <div>
      {/* <h3 className="font-semibold mb-3">Saved</h3> */}
      {tips.map((t: any) => (
        <p key={t._id} className="text-sm">{t.title}</p>
      ))}
    </div>
  );
}
