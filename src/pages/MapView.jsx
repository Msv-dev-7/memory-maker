import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import SidebarDashboard from '../components/SidebarDashboard';
import GroupFeed from '../components/GroupFeed';
import AddMembers from '../components/AddMembers';
import InvitationsList from '../components/InvitationsList';
import { MapContainer, TileLayer } from 'react-leaflet';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('memories'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResult, setAiResult] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const fetchAISuggestions = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setAiResult([]);

    try {
      const res = await fetch(
        `http://localhost:5000/ai-suggestions?q=${encodeURIComponent(searchQuery)}`, 
        { method: 'GET' }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await res.json();
      setAiResult(data); // data is an array
    } catch (err) {
      console.error(err);
      alert('Error fetching AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <PanelGroup direction="horizontal">
        
        {/* LEFT PANEL */}
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <SidebarDashboard onMenuSelect={setActivePanel} />
        </Panel>

        <PanelResizeHandle style={{ width: '6px', background: '#ccc', cursor: 'col-resize' }} />

        {/* MIDDLE PANEL */}
        <Panel defaultSize={50} minSize={30}>
          <div style={{ padding: '20px', overflowY: 'auto', height: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ff5c5c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#ff1c1c')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#ff5c5c')}
              >
                🔒 Logout
              </button>
            </div>

            {activePanel === 'memories' && <GroupFeed />}
            {activePanel === 'addMembers' && <AddMembers groupId="defaultGroup" />}
            {activePanel === 'invitations' && <InvitationsList />}

            {/* AI Suggestions Panel */}
            {activePanel === 'aiSuggestions' && (
              <div>
                <h2>AI Suggestions</h2>
                <input
                  type="text"
                  placeholder="Type a place (e.g., Chennai)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '70%', padding: '10px', marginRight: '10px' }}
                />
                <button onClick={fetchAISuggestions} style={{ padding: '10px' }}>
                  Search
                </button>

                {loading && <p>Loading...</p>}

                {aiResult.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h3>YouTube Suggestions:</h3>
                    <ul>
                      {aiResult.map((item, index) => (
                        <li key={index}>
                          <a href={item.link} target="_blank" rel="noreferrer">
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

          </div>
        </Panel>

        <PanelResizeHandle style={{ width: '6px', background: '#ccc', cursor: 'col-resize' }} />

        {/* RIGHT PANEL */}
        <Panel defaultSize={30} minSize={20}>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={4}
            style={{ height: '100vh', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default MapView;
