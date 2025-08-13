import React from 'react';
import { Activity, Clock, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDarkMode: boolean;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, isDarkMode, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 ease-in-out hover:shadow-2xl 
        ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white/90 hover:bg-white'} 
        transform hover:-translate-y-2 cursor-pointer backdrop-blur-sm`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-8">
        <div className={`inline-block p-4 rounded-xl mb-6 transition-all duration-500 group-hover:scale-110
          ${isDarkMode ? 'bg-blue-900/30 group-hover:bg-blue-900/50' : 'bg-blue-100 group-hover:bg-blue-200'}`}
        >
          {icon}
        </div>
        
        <h3 className={`text-xl font-bold mb-3 transition-colors duration-300
          ${isDarkMode ? 'text-white group-hover:text-blue-300' : 'text-gray-800 group-hover:text-blue-700'}`}
        >
          {title}
        </h3>
        
        <p className={`transition-colors duration-300
          ${isDarkMode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-800'}`}
        >
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
};

interface FeatureCardsProps {
  isDarkMode: boolean;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Activity size={28} className="text-blue-600 transition-transform duration-500 group-hover:rotate-12" />,
      title: "Kapsamlı Sağlık Takibi",
      description: "Tansiyon, nabız, oksijen seviyesi gibi önemli sağlık verilerinizi kolayca kaydedin ve takip edin.",
      path: "/saglik-verilerim"
    },
    {
      icon: <Clock size={28} className="text-blue-600 transition-transform duration-500 group-hover:rotate-12" />,
      title: "İlaç Hatırlatmaları",
      description: "İlaçlarınızı zamanında almanız için akıllı hatırlatma sistemi ile düzenli takip.",
      path: "/ilaçlarim"
    },
    {
      icon: <Moon size={28} className="text-blue-600 transition-transform duration-500 group-hover:rotate-12" />,
      title: "Uyku Analizi",
      description: "Uyku düzeninizi takip edin, uyku kalitenizi artırın ve daha dinç bir güne başlayın.",
      path: "/saglik-verilerim"
    }
  ];

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Sağlığınızı Takip Etmenin En Kolay Yolu
        </h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto text-lg`}>
          Platformumuz sağlık takibini basit ve etkili hale getirir
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isDarkMode={isDarkMode}
            onClick={() => navigate(feature.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;