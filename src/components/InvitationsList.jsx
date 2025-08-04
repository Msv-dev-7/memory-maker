import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const InvitationsList = () => {
  const [invitations, setInvitations] = useState([]);
  const [senders, setSenders] = useState({}); // cache for sender names

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Query invitations where "to" is current user UID
    const q = query(
      collection(db, "invitations"),
      where("to", "==", user.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const invs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Create a fresh cache of senders to avoid duplicates
      const updatedSenders = { ...senders };

      // Fetch usernames/emails for each sender (from)
      for (const inv of invs) {
        if (!updatedSenders[inv.from]) {
          try {
            const userDoc = await getDoc(doc(db, "users", inv.from));
            if (userDoc.exists()) {
              updatedSenders[inv.from] =
                userDoc.data().username || userDoc.data().email;
            } else {
              updatedSenders[inv.from] = "Unknown User";
            }
          } catch (err) {
            console.error("Error fetching sender info:", err);
          }
        }
      }

      setSenders(updatedSenders);
      setInvitations(invs);
    });

    return () => unsubscribe();
  }, []); // runs once when component mounts

  const acceptInvite = async (id) => {
    try {
      await updateDoc(doc(db, "invitations", id), { status: "accepted" });
      alert("Invitation accepted!");
    } catch (err) {
      console.error("Error accepting invitation:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        Pending Invitations
      </h2>

      {invitations.length === 0 ? (
        <p>No invitations</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {invitations.map((inv) => (
            <li
              key={inv.id}
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
              <span>
                {senders[inv.from] || inv.from} wants to connect!
              </span>
              <button
                onClick={() => acceptInvite(inv.id)}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvitationsList;
