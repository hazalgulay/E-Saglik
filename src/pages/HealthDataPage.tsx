import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import HealthMetrics from '../components/HealthMetrics';
import { Activity, Droplets, Moon } from 'lucide-react';

interface HealthDataPageProps {
  isDarkMode: boolean;
}

interface HealthMetric {
  id: string;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  oxygen_level: number;
  created_at: string;
}

interface WaterIntake {
  id: string;
  amount_ml: number;
  created_at: string;
}

interface SleepQuality {
  id: string;
  duration_minutes: number;
  quality_rating: number;
  created_at: string;
}

const HealthDataPage: React.FC<HealthDataPageProps> = ({ isDarkMode }) => {
  const [metrics, setMetrics] = useState<HealthMetric | null>(null);
  const [waterIntake, setWaterIntake] = useState<WaterIntake | null>(null);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      // Fetch latest health metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (metricsError) throw metricsError;
      if (metricsData && metricsData.length > 0) {
        setMetrics(metricsData[0]);
      }

      // Fetch latest water intake
      const { data: waterData, error: waterError } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (waterError) throw waterError;
      if (waterData && waterData.length > 0) {
        setWaterIntake(waterData[0]);
      }

      // Fetch latest sleep quality
      const { data: sleepData, error: sleepError } = await supabase
        .from('sleep_quality')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (sleepError) throw sleepError;
      if (sleepData && sleepData.length > 0) {
        setSleepQuality(sleepData[0]);
      }
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addHealthMetrics = async (newMetrics: Partial<HealthMetric>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      const { error } = await supabase
        .from('health_metrics')
        .insert([{ ...newMetrics, user_id: user.id }]);

      if (error) throw error;
      await fetchLatestData();
    } catch (err) {
      setError('Veriler kaydedilirken bir hata oluştu');
    }
  };

  const addWaterIntake = async (amount: number) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      const { error } = await supabase
        .from('water_intake')
        .insert([{ amount_ml: amount, user_id: user.id }]);

      if (error) throw error;
      await fetchLatestData();
    } catch (err) {
      setError('Su tüketimi kaydedilirken bir hata oluştu');
    }
  };

  const addSleepQuality = async (duration: number, quality: number) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      const { error } = await supabase
        .from('sleep_quality')
        .insert([{
          duration_minutes: duration,
          quality_rating: quality,
          user_id: user.id
        }]);

      if (error) throw error;
      await fetchLatestData();
    } catch (err) {
      setError('Uyku verisi kaydedilirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 flex justify-center items-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Sağlık Verilerim
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <HealthMetrics 
            isDarkMode={isDarkMode} 
            metrics={metrics}
            onAddMetrics={addHealthMetrics}
            onAddWaterIntake={addWaterIntake}
            onAddSleepQuality={addSleepQuality}
          />

          {/* Su Tüketimi Kartı */}
          <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-5 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white flex justify-between items-center`}>
              <div>
                <h2 className="text-xl font-bold">Su Tüketimi</h2>
                <p className="text-sm opacity-80">Günlük su tüketiminiz</p>
              </div>
            </div>
            <div className="p-6">
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Günlük Tüketim
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      {waterIntake ? `${waterIntake.amount_ml} ml` : '0 ml'}
                    </p>
                  </div>
                  <Droplets size={40} className="text-blue-500" />
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${Math.min((waterIntake?.amount_ml || 0) / 2500 * 100, 100)}%` }}
                    />
                  </div>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Günlük hedef: 2500 ml
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Uyku Takibi Kartı */}
          <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-5 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white flex justify-between items-center`}>
              <div>
                <h2 className="text-xl font-bold">Uyku Takibi</h2>
                <p className="text-sm opacity-80">Uyku süreniz ve kalitesi</p>
              </div>
            </div>
            <div className="p-6">
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Son Uyku Süresi
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      {sleepQuality ? `${Math.floor(sleepQuality.duration_minutes / 60)}s ${sleepQuality.duration_minutes % 60}dk` : '-'}
                    </p>
                  </div>
                  <Moon size={40} className="text-purple-500" />
                </div>
                <div className="mt-4">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Uyku Kalitesi
                  </p>
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          star <= (sleepQuality?.quality_rating || 0)
                            ? 'bg-purple-500 text-white'
                            : isDarkMode
                              ? 'bg-gray-600'
                              : 'bg-gray-200'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HealthDataPage;