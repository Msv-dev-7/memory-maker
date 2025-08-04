// src/components/MapPanel.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapPanel.css';

// Fix marker icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapPanel = () => {
  return (
    <div className="map-panel">
      <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[20.5937, 78.9629]}>
          <Popup>Your memory location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPanel;
