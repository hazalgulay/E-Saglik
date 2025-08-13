import React from 'react';

interface TestimonialProps {
  initials: string;
  name: string;
  text: string;
  isDarkMode: boolean;
}

const Testimonial: React.FC<TestimonialProps> = ({ initials, name, text, isDarkMode }) => {
  return (
    <div className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${isDarkMode ? 'bg-blue-700' : 'bg-blue-600'}`}>
          {initials}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex my-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

interface TestimonialsProps {
  isDarkMode: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({ isDarkMode }) => {
  const testimonials = [
    {
      initials: "AY",
      name: "Ayşe Yılmaz",
      text: "İlaç takibi artık çok daha kolay. Uygulama sayesinde hiç ilaç dozumu kaçırmıyorum ve sağlık verilerimi düzenli olarak takip edebiliyorum."
    },
    {
      initials: "MK",
      name: "Mehmet Kaya",
      text: "Uyku takibi özelliği sayesinde uyku düzenimi iyileştirdim. Sağlık verilerimi grafiklerle görebilmek çok faydalı."
    },
    {
      initials: "ZD",
      name: "Zeynep Demir",
      text: "Tüm sağlık verilerimi tek bir yerden takip edebilmek harika. Kullanımı çok kolay ve pratik bir uygulama."
    }
  ];

  return (
    <div className="py-10">
      <div className="text-center mb-10">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Kullanıcı Deneyimleri
        </h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
          E-Sağlık kullanıcılarının deneyimlerini görün
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Testimonial
            key={index}
            initials={testimonial.initials}
            name={testimonial.name}
            text={testimonial.text}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;