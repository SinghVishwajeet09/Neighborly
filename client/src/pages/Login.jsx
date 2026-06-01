import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", {
      phone: phone.trim(),
      password: password.trim()
    });

    localStorage.setItem("token", res.data.token);
    alert("Login successful");
    navigate("/dashboard");
  } catch (err) {
    alert(err.response?.data?.message || "Invalid credentials");
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Neighborly Login
        </h2>

        <input
          type="text"
          placeholder="Phone"
          className="w-full p-2 border rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
