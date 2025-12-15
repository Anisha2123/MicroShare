import axios from "axios";
import { useEffect, useState } from "react";

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

  axios.get("http://localhost:5000/api/users/suggested",{
    headers:{
        Authorization:`Bearer ${token}`,
    },
  })
    .then(res => { 
      console.log("Suggested Users API:", res.data);
      setUsers(res.data);
    })
    .catch(err => {
        console.log("Suggested users error:", err.response?.data);
    })
    
}, []);


  const follow = (id: string) =>
    axios.post(`http://localhost:5000/api/users/${id}/follow`);

  return (
    <div>
      {/* <h3 className="font-semibold mb-3">Suggested Users</h3> */}
      {users.map((u: any) => (
        <div key={u._id} className="flex justify-between mb-2">
          <span>{u.name}</span>
          <button
            onClick={() => follow(u._id)}
            className="text-blue-500"
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}
