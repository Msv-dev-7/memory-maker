import React, { useState, useEffect } from "react";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const AddMembers = ({ groupId }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const userList = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== currentUser.uid) {
          userList.push({ uid: doc.id, ...doc.data() });
        }
      });
      setUsers(userList);
    };
    fetchUsers();
  }, [currentUser.uid]);

  const sendInvite = async (toUser) => {
    await addDoc(collection(db, "invitations"), {
      from: currentUser.uid,
      to: toUser.uid,
      groupId,
      status: "pending",
      timestamp: new Date(),
    });
    alert(`Invitation sent to ${toUser.username || toUser.email}`);
  };

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    (user.username || user.email || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px" }}>
        Add Members
      </h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by username"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          border: "1px solid #ccc",
          padding: "8px",
          marginBottom: "20px",
          width: "100%",
          borderRadius: "5px",
        }}
      />

      {/* Display filtered users */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {filteredUsers.length === 0 && search !== "" && (
          <li style={{ color: "gray" }}>No users found</li>
        )}
        {filteredUsers.map((user) => (
          <li
            key={user.uid}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "#fafafa",
            }}
          >
            <span style={{ fontWeight: "500" }}>
              {user.username || user.email}
            </span>
            <button
              onClick={() => sendInvite(user)}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Invite
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddMembers;
 