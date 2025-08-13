import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  isDarkMode: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick, isDarkMode }) => {
  return (
    <div className={`mb-4 rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-all duration-300`}>
      <button
        className={`w-full text-left p-5 flex justify-between items-center focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
        onClick={onClick}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className={`p-5 pt-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {answer}
        </div>
      </div>
    </div>
  );
};

interface FAQProps {
  isDarkMode: boolean;
}

const FAQ: React.FC<FAQProps> = ({ isDarkMode }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    {
      question: "Verilerim güvende mi?",
      answer: "Evet, tüm sağlık verileriniz en yüksek güvenlik standartlarıyla korunmaktadır. Verileriniz şifrelenerek saklanır ve sadece sizin erişiminize açıktır."
    },
    {
      question: "Uygulamayı nasıl kullanmaya başlayabilirim?",
      answer: "App Store veya Google Play'den uygulamayı indirip ücretsiz bir hesap oluşturarak hemen kullanmaya başlayabilirsiniz."
    },
    {
      question: "Hangi sağlık verilerini takip edebilirim?",
      answer: "Tansiyon, nabız, oksijen seviyesi, uyku düzeni, ilaç kullanımı gibi birçok sağlık verisini kolayca takip edebilirsiniz."
    },
    {
      question: "Diğer sağlık cihazlarıyla senkronize edebilir miyim?",
      answer: "Evet, uygulamamız birçok popüler sağlık ve fitness cihazıyla senkronize olabilir ve sağlık verilerinizi otomatik olarak içe aktarabilir."
    },
    {
      question: "Ücretli mi?",
      answer: "Temel özellikleri ücretsiz olarak sunuyoruz. Gelişmiş analitik ve kişiselleştirilmiş öneriler için premium sürümümüz mevcuttur."
    }
  ];

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-10">
      <div className="text-center mb-10">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Sıkça Sorulan Sorular
        </h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
          E-Sağlık platformu hakkında sık sorulan soruların cevapları
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => toggleOpen(index)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;