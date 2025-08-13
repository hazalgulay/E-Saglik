import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  isDarkMode: boolean;
}

const Hero: React.FC<HeroProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/saglik-verilerim');
    } else {
      navigate('/giris');
    }
  };

  return (
    <div className={`pt-24 pb-12 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sağlığınızı</span>
              <br />
              <span className="text-blue-600">Takip Edin</span>
            </h1>
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Sağlık verilerinizi takip edin, ilaçlarınızı düzenli kullanın ve uyku kalitenizi iyileştirin.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 font-medium transition-colors duration-200 flex items-center justify-center"
              >
                {user ? 'Sağlık Verilerim' : 'Başlayın'}
                <ArrowRight size={18} className="ml-2" />
              </button>
              <button 
                onClick={() => navigate('/saglik-rehberi')}
                className={`rounded-full px-8 py-3 font-medium transition-colors duration-200 flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Daha Fazla Bilgi
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className={`rounded-2xl shadow-2xl overflow-hidden transition-transform duration-500 hover:scale-105 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white px-6 py-4`}>
                <h2 className="text-xl font-bold">Sağlık Takibi</h2>
                <p className="text-sm opacity-80">Günlük sağlık verileriniz</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} ${isDarkMode ? 'text-white' : 'text-blue-800'}`}>
                    <p className="text-sm opacity-70">Tansiyon</p>
                    <p className="text-2xl font-bold">120/80</p>
                  </div>
                  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} ${isDarkMode ? 'text-white' : 'text-red-800'}`}>
                    <p className="text-sm opacity-70">Nabız</p>
                    <p className="text-2xl font-bold">98 <span className="text-sm opacity-70">bpm</span></p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-teal-50'} ${isDarkMode ? 'text-white' : 'text-teal-800'}`}>
                    <p className="text-sm opacity-70">Oksijen Seviyesi</p>
                    <p className="text-2xl font-bold">96%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'} ${isDarkMode ? 'text-white' : 'text-purple-800'}`}>
                    <p className="text-sm opacity-70">Uyku</p>
                    <p className="text-2xl font-bold">7s 30dk</p>
                  </div>
                  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-amber-50'} ${isDarkMode ? 'text-white' : 'text-amber-800'}`}>
                    <p className="text-sm opacity-70">Sonraki İlaç</p>
                    <p className="text-2xl font-bold">14:30</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-blue-500 bg-opacity-20 z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-teal-500 bg-opacity-10 z-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;