// src/components/NotificationCard.js
import React from "react";

function NotificationCard({ message, status }) {
  return (
    <div
      className={`p-4 rounded shadow ${
        status === "unread" ? "bg-yellow-100" : "bg-green-100"
      }`}
    >
      <p>{message}</p>
    </div>
  );
}

export default NotificationCard;
