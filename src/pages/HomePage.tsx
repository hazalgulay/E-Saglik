import React from 'react';
import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

interface HomePageProps {
  isDarkMode: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isDarkMode }) => {
  return (
    <main>
      <Hero isDarkMode={isDarkMode} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FeatureCards isDarkMode={isDarkMode} />
        <Testimonials isDarkMode={isDarkMode} />
        <FAQ isDarkMode={isDarkMode} />
      </div>
    </main>
  );
};

export default HomePage;