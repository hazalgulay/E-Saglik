import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HealthDataPage from './pages/HealthDataPage';
import HealthGuidePage from './pages/HealthGuidePage';
import MedicationsPage from './pages/MedicationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/giris" />;
};

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <Routes>
        <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
        <Route path="/giris" element={<LoginPage isDarkMode={isDarkMode} />} />
        <Route path="/kayit" element={<RegisterPage isDarkMode={isDarkMode} />} />
        <Route path="/saglik-verilerim" element={
          <PrivateRoute>
            <HealthDataPage isDarkMode={isDarkMode} />
          </PrivateRoute>
        } />
        <Route path="/saglik-rehberi" element={
          <PrivateRoute>
            <HealthGuidePage isDarkMode={isDarkMode} />
          </PrivateRoute>
        } />
        <Route path="/ilaçlarim" element={
          <PrivateRoute>
            <MedicationsPage isDarkMode={isDarkMode} />
          </PrivateRoute>
        } />
      </Routes>
      
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;