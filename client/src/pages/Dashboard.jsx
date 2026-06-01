import { useState, useEffect } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const res = await API.get(
        "/request/all?lat=28.6139&lon=77.2090",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        "/request/create",
        {
          title,
          description,
          latitude: 28.6139,
          longitude: 77.2090,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");
      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await API.post(
        "/request/accept",
        { requestId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Neighborly Dashboard 🚀
      </h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded-xl shadow mb-6 space-y-3"
      >
        <h2 className="text-xl font-semibold">Create Help Request</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nearby Requests</h2>

        {requests.length === 0 && (
          <p className="text-gray-500">No nearby requests</p>
        )}

        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2">
  <h3 className="font-bold">{req.title}</h3>

  <span className={`text-xs px-2 py-1 rounded-full 
    ${req.status === "open" ? "bg-green-100 text-green-600" :
      req.status === "accepted" ? "bg-yellow-100 text-yellow-600" :
      "bg-blue-100 text-blue-600"}`}>
    {req.status}
  </span>
</div>
              <p className="text-sm text-gray-600">
                {req.description}
              </p>
              <p className="text-xs text-gray-400">
                by {req.name}
              </p>
            </div>

            {req.status === "open" && (
  <button
    onClick={() => handleAccept(req.id)}
    className="bg-green-600 text-white px-3 py-1 rounded"
  >
    Accept
  </button>
)}
          </div>
        ))}
      </div>
    </div>
  );
}