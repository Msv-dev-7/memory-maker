import React, { useEffect, useState } from "react";
import './SidebarDashboard.css';
import { FaImages, FaUserCircle, FaEnvelopeOpenText, FaCamera, FaRobot } from "react-icons/fa";
import { getAuth } from "firebase/auth";

const SidebarDashboard = ({ onMenuSelect }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      if (user.displayName) {
        setDisplayName(user.displayName);
      } else {
        setDisplayName(user.email);
      }
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sidebar">
      <div className="profile-section">
        <label htmlFor="upload-profile" className="upload-label">
          {profilePic ? (
            <img src={profilePic} alt="User" className="profile-pic" />
          ) : (
            <FaUserCircle className="default-icon" />
          )}
          <FaCamera className="camera-icon" />
        </label>
        <input
          type="file"
          id="upload-profile"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <h3>{displayName}</h3>
      </div>

      <div className="nav-section">
        <div className="nav-item" onClick={() => onMenuSelect('memories')}>
          <FaImages className="icon" />
          <span>View Memories</span>
        </div>
        <div className="nav-item" onClick={() => onMenuSelect('addMembers')}>
          <FaEnvelopeOpenText className="icon" />
          <span>Add Members</span>
        </div>
        <div className="nav-item" onClick={() => onMenuSelect('invitations')}>
          <FaEnvelopeOpenText className="icon" />
          <span>View Invitations</span>
        </div>

        {/* NEW AI Suggestions button */}
        <div className="nav-item" onClick={() => onMenuSelect('aiSuggestions')}>
          <FaRobot className="icon" />
          <span>AI Suggestions</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarDashboard;
