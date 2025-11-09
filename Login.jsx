import React, { useState } from "react";

function Login({ onLogin }) {
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uid || !name) {
      setError("Please enter both UID and Name");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/login", {   //check beacuse this could lead to error//
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Stores JWT token 
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ uid, name }));

      // Notify parent that login succeeded
      onLogin({ uid, name });
    } catch (err) {
      console.error(err);
      setError("Error connecting to backend");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login to Dashboard
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter UID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
