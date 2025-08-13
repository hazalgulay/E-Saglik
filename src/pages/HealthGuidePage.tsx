import React, { useState } from 'react';
import { Book, Heart, Brain, Apple, Activity, Moon, Sun, Droplets, Dumbbell, Utensils, Pill as Pills, Cigarette } from 'lucide-react';
import DailyRoutineManager from '../components/DailyRoutineManager';

interface HealthGuidePageProps {
  isDarkMode: boolean;
}

interface GuideSection {
  icon: React.ReactNode;
  title: string;
  content: string;
  tips: string[];
  recommendations?: string[];
}

const HealthGuidePage: React.FC<HealthGuidePageProps> = ({ isDarkMode }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const guides: GuideSection[] = [
    {
      icon: <Heart className="text-red-500" size={24} />,
      title: 'Kalp Sağlığı',
      content: 'Kalp sağlığı, genel sağlığınızın temelidir. Düzenli egzersiz, sağlıklı beslenme ve stres yönetimi ile kalbinizi koruyabilirsiniz.',
      tips: [
        'Günde en az 30 dakika orta yoğunlukta egzersiz yapın',
        'Tuz tüketimini sınırlayın (günde 5g\'dan az)',
        'Omega-3 açısından zengin besinler tüketin',
        'Düzenli tansiyon kontrolü yaptırın',
        'Stresi azaltmak için meditasyon yapın'
      ],
      recommendations: [
        'Hedef nabız: 60-100 atım/dakika',
        'Hedef tansiyon: 120/80 mmHg',
        'Günlük yürüyüş hedefi: 10,000 adım'
      ]
    },
    {
      icon: <Brain className="text-purple-500" size={24} />,
      title: 'Zihinsel Sağlık',
      content: 'Zihinsel sağlık, genel sağlığımızın önemli bir parçasıdır. Düzenli uyku, sosyal aktiviteler ve hobiler zihinsel sağlığınızı destekler.',
      tips: [
        'Düzenli uyku düzeni oluşturun',
        'Günlük meditasyon yapın',
        'Sosyal ilişkilerinizi güçlendirin',
        'Yeni hobiler edinin',
        'Profesyonel destek almaktan çekinmeyin'
      ],
      recommendations: [
        'Günlük uyku hedefi: 7-9 saat',
        'Günlük meditasyon: 10-20 dakika',
        'Haftalık sosyal aktivite: En az 2 kez'
      ]
    },
    {
      icon: <Utensils className="text-green-500" size={24} />,
      title: 'Beslenme',
      content: 'Dengeli beslenme, sağlıklı bir yaşamın temelidir. Protein, vitamin ve mineraller açısından zengin bir diyet oluşturun.',
      tips: [
        'Günde 5 porsiyon sebze ve meyve tüketin',
        'İşlenmiş gıdalardan kaçının',
        'Protein kaynaklarını çeşitlendirin',
        'Tam tahıllı ürünleri tercih edin',
        'Yeterli su tüketin (günde 2-3 litre)'
      ],
      recommendations: [
        'Günlük kalori ihtiyacı: 2000-2500 kcal',
        'Protein ihtiyacı: Vücut ağırlığı başına 0.8-1g',
        'Su tüketimi: 8-10 bardak/gün'
      ]
    },
    {
      icon: <Dumbbell className="text-blue-500" size={24} />,
      title: 'Fiziksel Aktivite',
      content: 'Düzenli fiziksel aktivite, sağlıklı bir yaşam için vazgeçilmezdir. Kardiyo ve kuvvet egzersizlerini dengeli bir şekilde yapın.',
      tips: [
        'Haftada en az 150 dakika orta şiddette egzersiz yapın',
        'Kuvvet antrenmanlarını haftada 2-3 kez yapın',
        'Esneme egzersizlerini ihmal etmeyin',
        'Aktivite çeşitliliği sağlayın',
        'Yavaş başlayıp kademeli olarak artırın'
      ],
      recommendations: [
        'Günlük adım hedefi: 10,000 adım',
        'Haftalık egzersiz: 150-300 dakika',
        'Dinlenme günleri: Haftada 1-2 gün'
      ]
    }
  ];

  return (
    <main className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Sağlık Rehberi
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sağlıklı bir yaşam için kapsamlı rehberiniz
          </p>
        </div>

        <div className="mb-12">
          <DailyRoutineManager isDarkMode={isDarkMode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {guides.map((guide, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer`}
              onClick={() => setActiveSection(activeSection === guide.title ? null : guide.title)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  {guide.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {guide.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    {guide.content}
                  </p>
                  
                  {activeSection === guide.title && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Öneriler
                        </h4>
                        <ul className={`list-disc pl-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                          {guide.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {guide.recommendations && (
                        <div>
                          <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Hedefler
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {guide.recommendations.map((rec, i) => (
                              <div
                                key={i}
                                className={`p-2 rounded ${
                                  isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HealthGuidePage;