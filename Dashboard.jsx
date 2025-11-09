import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function Dashboard({ user }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    //Connecting to Socket.IO//
    const socket = io("http://localhost:4000", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log(" Connected to Socket.IO backend");
    });

    socket.on("dashboardData", (data) => {
      setActiveUsers((prev) => [...prev.slice(-9), data.activeUsers]);
      setMemoryUsage((prev) => [...prev.slice(-9), data.memoryUsage]);
    });

    socket.on("disconnect", () => {
      console.log(" backend ke toh Lag gaye");
    });

    return () => socket.disconnect();
  }, []);

  const chartData = (label, data, color) => ({
    labels: data.map((_, i) => i + 1),
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color + "33",
      },
    ],
  });
  // He5re in the Return styles are present//
  return (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    {/* Header */}
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <button
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.reload();
        }}
        className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
    </header>

    {/* Charts Section */}
    <div className="grid grid-cols-2 gap-8 mb-10">
      <div className="bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Active Users</h2>
        <Line data={chartData("Active Users", activeUsers, "#3b82f6")} />
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Memory Usage (MB)</h2>
        <Line data={chartData("Memory Usage (MB)", memoryUsage, "#ef4444")} />
      </div>
    </div>

    {/* User Info Section */}
    <div className="text-center mt-6 bg-gray-800 py-4 rounded-xl shadow-md">
      <p className="text-lg">
        <span className="font-semibold text-blue-400">User Name:</span> {user.name}
      </p>
      <p className="text-lg">
        <span className="font-semibold text-green-400">User ID:</span> {user.uid}
      </p>
    </div>
  </div>
);
}

export default Dashboard;