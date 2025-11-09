import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
  localStorage.removeItem("user"); // 👈 always clear during dev
}, []);


  return (
    <div className="App">
      {user ? <Dashboard user={user} /> : <Login onLogin={setUser} />}
    </div>
  );
}

export default App;
