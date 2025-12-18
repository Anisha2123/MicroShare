import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../services/api";
export default function PopularTips() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/tip/popular`).then(res => setTips(res.data));
  }, []);

  return (
    <div>
      {/* <h3 className="font-semibold mb-3">Popular Tips</h3> */}
      {tips.map((t: any) => (
        <div key={t._id} className="text-sm mb-2">
          {t.title}
        </div>
      ))}
    </div>
  );
}
