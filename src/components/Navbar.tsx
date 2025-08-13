import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, Activity, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/giris');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <nav className={`fixed w-full z-10 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-2 font-medium text-xl text-blue-600">E-Sağlık</div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200">Ana Sayfa</Link>
              <Link to="/saglik-verilerim" className="px-3 py-2 rounded-md font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200">Sağlık Verilerim</Link>
              <Link to="/saglik-rehberi" className="px-3 py-2 rounded-md font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200">Sağlık Rehberi</Link>
              <Link to="/ilaçlarim" className="px-3 py-2 rounded-md font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200">İlaçlarım</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-200`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/saglik-verilerim"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-gray-800' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-700' : 'bg-blue-100'
                  }`}>
                    <User size={20} className="text-blue-600" />
                  </div>
                  <span className="font-medium">{user.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-red-400' 
                      : 'hover:bg-gray-100 text-red-600'
                  }`}
                >
                  <LogOut size={16} className="mr-3" />
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <Link
                to="/giris"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              >
                Giriş Yap
              </Link>
            )}

            <div className="ml-3 md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-200`}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200">Ana Sayfa</Link>
            <Link to="/saglik-verilerim" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200">Sağlık Verilerim</Link>
            <Link to="/saglik-rehberi" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200">Sağlık Rehberi</Link>
            <Link to="/ilaçlarim" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200">İlaçlarım</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;