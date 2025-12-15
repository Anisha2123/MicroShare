import axios from "axios";
import { useEffect, useState } from "react";

export default function ActivityPanel() {
  const [activity, setActivity] = useState([]);
    const token = localStorage.getItem("token");
    
  useEffect(() => {
    axios.get("http://localhost:5000/api/activity",{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    }).then(res => setActivity(res.data));
  }, []);

  return (
    <div>
      <h3 className="font-semibold mb-3">Recent Activity</h3>
      {activity.map((a: any) => (
        <p key={a._id} className="text-sm">
          {a.actor?.name} {a.type} your tip
        </p>
      ))}
    </div>
  );
}
