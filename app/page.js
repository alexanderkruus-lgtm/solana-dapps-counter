"use client";

import { useState } from "react";
import Counter from "../src/components/Counter";
import "../src/App.css";

export default function Home() {
  const [count, setCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  const handleIncrement = () => {
    setCount(count + 1);
    setLastUpdate(new Date().toLocaleString());
  };

  const handleDecrement = () => {
    setCount(count - 1);
    setLastUpdate(new Date().toLocaleString());
  };

  return (
    <div className="main-container">
      <div className="card">
        <Counter count={count} lastUpdate={lastUpdate} />
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleIncrement}>Increment</button>
          <button onClick={handleDecrement}>Decrement</button>
        </div>
      </div>
    </div>
  );
}
