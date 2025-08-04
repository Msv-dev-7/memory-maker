// App.js
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MapView from './pages/MapView';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // added

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // only after auth check
    });
    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>; // prevent early render

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/map" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/map" /> : <Signup />}
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute user={user}>
              <MapView />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/map" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
