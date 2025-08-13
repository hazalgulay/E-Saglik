import React, { useState } from 'react';
import { Activity, AlertCircle, Droplets, Moon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  normalRange?: string;
  isOutOfRange?: boolean;
}

interface HealthMetricsProps {
  isDarkMode: boolean;
  metrics: any;
  onAddMetrics: (metrics: any) => void;
  onAddWaterIntake: (amount: number) => void;
  onAddSleepQuality: (duration: number, quality: number) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  bgColor, 
  textColor,
  normalRange,
  isOutOfRange 
}) => {
  return (
    <div className={`${bgColor} ${textColor} rounded-lg p-6 shadow-md transition-transform duration-300 hover:scale-105 relative overflow-hidden`}>
      {isOutOfRange && (
        <div className="absolute top-2 right-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium opacity-80">{title}</h3>
          <div className="flex items-end mt-1">
            <span className="text-3xl font-bold">{value}</span>
            {unit && <span className="ml-1 text-sm opacity-80">{unit}</span>}
          </div>
          {normalRange && (
            <p className="text-xs mt-2 opacity-70">
              Normal aralık: {normalRange}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-white bg-opacity-20`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const HealthMetrics: React.FC<HealthMetricsProps> = ({ isDarkMode, metrics, onAddMetrics, onAddWaterIntake, onAddSleepQuality }) => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'health' | 'water' | 'sleep'>('health');
  const [formError, setFormError] = useState<string | null>(null);
  const [newMetrics, setNewMetrics] = useState({
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    oxygen_level: ''
  });
  const [waterAmount, setWaterAmount] = useState('');
  const [sleepData, setSleepData] = useState({
    duration: '',
    quality: '5'
  });

  const validateMetrics = (metrics: any) => {
    const systolic = parseInt(metrics.blood_pressure_systolic);
    const diastolic = parseInt(metrics.blood_pressure_diastolic);
    const heartRate = parseInt(metrics.heart_rate);
    const oxygenLevel = parseInt(metrics.oxygen_level);

    if (systolic < 70 || systolic > 200) {
      return 'Sistolik tansiyon 70-200 mmHg arasında olmalıdır';
    }
    if (diastolic < 40 || diastolic > 130) {
      return 'Diastolik tansiyon 40-130 mmHg arasında olmalıdır';
    }
    if (heartRate < 40 || heartRate > 200) {
      return 'Nabız 40-200 atım/dakika arasında olmalıdır';
    }
    if (oxygenLevel < 80 || oxygenLevel > 100) {
      return 'Oksijen seviyesi 80-100% arasında olmalıdır';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formType === 'health') {
      const error = validateMetrics(newMetrics);
      if (error) {
        setFormError(error);
        return;
      }
      setFormError(null);
      onAddMetrics(newMetrics);
      setNewMetrics({
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        heart_rate: '',
        oxygen_level: ''
      });
    } else if (formType === 'water') {
      const amount = parseInt(waterAmount);
      if (amount < 0 || amount > 5000) {
        setFormError('Su miktarı 0-5000 ml arasında olmalıdır');
        return;
      }
      setFormError(null);
      onAddWaterIntake(amount);
      setWaterAmount('');
    } else if (formType === 'sleep') {
      const duration = parseInt(sleepData.duration);
      const quality = parseInt(sleepData.quality);
      if (duration < 0 || duration > 1440) {
        setFormError('Uyku süresi 0-1440 dakika arasında olmalıdır');
        return;
      }
      if (quality < 1 || quality > 5) {
        setFormError('Uyku kalitesi 1-5 arasında olmalıdır');
        return;
      }
      setFormError(null);
      onAddSleepQuality(duration, quality);
      setSleepData({ duration: '', quality: '5' });
    }
    
    setShowForm(false);
  };

  const isOutOfRange = {
    bloodPressure: metrics && (
      parseInt(metrics.blood_pressure_systolic) > 140 ||
      parseInt(metrics.blood_pressure_systolic) < 90 ||
      parseInt(metrics.blood_pressure_diastolic) > 90 ||
      parseInt(metrics.blood_pressure_diastolic) < 60
    ),
    heartRate: metrics && (
      parseInt(metrics.heart_rate) < 60 ||
      parseInt(metrics.heart_rate) > 100
    ),
    oxygenLevel: metrics && (
      parseInt(metrics.oxygen_level) < 95
    )
  };

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
      <div className={`px-6 py-5 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white flex justify-between items-center`}>
        <div>
          <h2 className="text-xl font-bold">Sağlık Verileri</h2>
          <p className="text-sm opacity-80">Günlük sağlık istatistikleriniz</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setFormType('health');
              setShowForm(true);
            }}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center font-medium"
          >
            <Activity size={18} className="mr-2" />
            Yeni Ölçüm
          </button>
          <button
            onClick={() => {
              setFormType('water');
              setShowForm(true);
            }}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center font-medium"
          >
            <Droplets size={18} className="mr-2" />
            Su Ekle
          </button>
          <button
            onClick={() => {
              setFormType('sleep');
              setShowForm(true);
            }}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center font-medium"
          >
            <Moon size={18} className="mr-2" />
            Uyku Ekle
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="p-6 border-b">
          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {formError}
              </div>
            )}
            
            {formType === 'health' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tansiyon (Sistolik)
                    <span className="text-xs text-gray-500 ml-2">Normal: 90-140 mmHg</span>
                  </label>
                  <input
                    type="number"
                    value={newMetrics.blood_pressure_systolic}
                    onChange={(e) => setNewMetrics({...newMetrics, blood_pressure_systolic: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } border focus:ring-2 focus:ring-blue-500`}
                    required
                    min="70"
                    max="200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tansiyon (Diastolik)
                    <span className="text-xs text-gray-500 ml-2">Normal: 60-90 mmHg</span>
                  </label>
                  <input
                    type="number"
                    value={newMetrics.blood_pressure_diastolic}
                    onChange={(e) => setNewMetrics({...newMetrics, blood_pressure_diastolic: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } border focus:ring-2 focus:ring-blue-500`}
                    required
                    min="40"
                    max="130"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nabız
                    <span className="text-xs text-gray-500 ml-2">Normal: 60-100 atım/dk</span>
                  </label>
                  <input
                    type="number"
                    value={newMetrics.heart_rate}
                    onChange={(e) => setNewMetrics({...newMetrics, heart_rate: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } border focus:ring-2 focus:ring-blue-500`}
                    required
                    min="40"
                    max="200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Oksijen Seviyesi
                    <span className="text-xs text-gray-500 ml-2">Normal: ≥95%</span>
                  </label>
                  <input
                    type="number"
                    value={newMetrics.oxygen_level}
                    onChange={(e) => setNewMetrics({...newMetrics, oxygen_level: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } border focus:ring-2 focus:ring-blue-500`}
                    required
                    min="80"
                    max="100"
                  />
                </div>
              </div>
            )}

            {formType === 'water' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Su Miktarı (ml)
                  <span className="text-xs text-gray-500 ml-2">Önerilen: 2000-3000 ml/gün</span>
                </label>
                <input
                  type="number"
                  value={waterAmount}
                  onChange={(e) => setWaterAmount(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-blue-500`}
                  required
                  min="0"
                  max="5000"
                  placeholder="Örn: 250"
                />
              </div>
            )}

            {formType === 'sleep' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Uyku Süresi (dakika)
                    <span className="text-xs text-gray-500 ml-2">Önerilen: 420-480 dakika (7-8 saat)</span>
                  </label>
                  <input
                    type="number"
                    value={sleepData.duration}
                    onChange={(e) => setSleepData({...sleepData, duration: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } border focus:ring-2 focus:ring-blue-500`}
                    required
                    min="0"
                    max="1440"
                    placeholder="Örn: 420"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Uyku Kalitesi
                    <span className="text-xs text-gray-500 ml-2">1: Çok Kötü, 5: Çok İyi</span>
                  </label>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setSleepData({...sleepData, quality: rating.toString()})}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          parseInt(sleepData.quality) >= rating
                            ? 'bg-blue-500 text-white'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                İptal
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Tansiyon"
          value={metrics ? `${metrics.blood_pressure_systolic}/${metrics.blood_pressure_diastolic}` : '-/-'}
          unit="mmHg"
          icon={<Activity size={24} className="text-blue-600" />}
          bgColor={isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}
          textColor={isDarkMode ? 'text-white' : 'text-blue-800'}
          normalRange="90-140/60-90"
          isOutOfRange={isOutOfRange.bloodPressure}
        />
        
        <MetricCard
          title="Nabız"
          value={metrics ? metrics.heart_rate : '-'}
          unit="atım/dk"
          icon={<Activity size={24} className="text-red-600" />}
          bgColor={isDarkMode ? 'bg-gray-700' : 'bg-red-50'}
          textColor={isDarkMode ? 'text-white' : 'text-red-800'}
          normalRange="60-100"
          isOutOfRange={isOutOfRange.heartRate}
        />
        
        <MetricCard
          title="Oksijen Seviyesi"
          value={metrics ? metrics.oxygen_level : '-'}
          unit="%"
          icon={<Activity size={24} className="text-teal-600" />}
          bgColor={isDarkMode ? 'bg-gray-700' : 'bg-teal-50'}
          textColor={isDarkMode ? 'text-white' : 'text-teal-800'}
          normalRange="≥95"
          isOutOfRange={isOutOfRange.oxygenLevel}
        />
      </div>
    </div>
  );
};

export default HealthMetrics;