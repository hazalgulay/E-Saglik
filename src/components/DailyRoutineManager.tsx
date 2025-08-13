import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface DailyRoutineManagerProps {
  isDarkMode: boolean;
}

interface Routine {
  id: string;
  time: string;
  activity: string;
  category: string;
  is_completed: boolean;
}

const categories = [
  { 
    value: 'exercise', 
    label: 'Egzersiz',
    activities: [
      'Sabah yürüyüşü (30 dakika)',
      'Yoga ve esneme (20 dakika)',
      'Kardiyo egzersizi (45 dakika)',
      'Kuvvet antrenmanı (40 dakika)',
      'Akşam yürüyüşü (30 dakika)'
    ]
  },
  { 
    value: 'nutrition', 
    label: 'Beslenme',
    activities: [
      'Kahvaltı (Protein ağırlıklı)',
      'Ara öğün (Meyve ve kuruyemiş)',
      'Öğle yemeği (Sebze ağırlıklı)',
      'İkindi ara öğünü (Yoğurt ve meyve)',
      'Akşam yemeği (Hafif protein)'
    ]
  },
  { 
    value: 'water', 
    label: 'Su',
    activities: [
      'Sabah 2 bardak su',
      'Öğleden önce 3 bardak su',
      'Öğle yemeği sonrası 2 bardak su',
      'İkindi 2 bardak su',
      'Akşam 1 bardak su'
    ]
  },
  { 
    value: 'sleep', 
    label: 'Uyku',
    activities: [
      'Akşam rutini başlangıcı',
      'Elektronik cihazları kapatma',
      'Hafif egzersiz ve esneme',
      'Meditasyon ve nefes egzersizi',
      'Uyku saati'
    ]
  },
  { 
    value: 'medication', 
    label: 'İlaç',
    activities: [
      'Sabah vitamin takviyesi',
      'Öğle ilaç dozları',
      'Akşam vitamin takviyesi',
      'Gece ilaç dozları',
      'Haftalık ilaç organizasyonu'
    ]
  }
];

const DailyRoutineManager: React.FC<DailyRoutineManagerProps> = ({ isDarkMode }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [newRoutine, setNewRoutine] = useState({
    time: '',
    activity: '',
    category: 'exercise'
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchRoutines();
    }
  }, [isAuthenticated, userId]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        navigate('/login');
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      setIsAuthenticated(false);
      setUserId(null);
    }
  };

  const fetchRoutines = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('daily_routines')
        .select('*')
        .eq('user_id', userId)
        .order('time', { ascending: true });

      if (error) throw error;
      setRoutines(data || []);
    } catch (err) {
      setError('Rutinler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('daily_routines')
        .insert([{
          ...newRoutine,
          user_id: userId
        }]);

      if (error) throw error;
      
      setShowForm(false);
      setNewRoutine({ time: '', activity: '', category: 'exercise' });
      await fetchRoutines();
    } catch (err) {
      setError('Rutin eklenirken bir hata oluştu');
    }
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('daily_routines')
        .update({ is_completed: !currentStatus })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      await fetchRoutines();
    } catch (err) {
      setError('Rutin güncellenirken bir hata oluştu');
    }
  };

  const deleteRoutine = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('daily_routines')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      await fetchRoutines();
    } catch (err) {
      setError('Rutin silinirken bir hata oluştu');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      exercise: 'bg-blue-500',
      nutrition: 'bg-green-500',
      water: 'bg-cyan-500',
      sleep: 'bg-purple-500',
      medication: 'bg-red-500'
    };
    return colors[category as keyof typeof colors] || colors.exercise;
  };

  const getActivitiesForCategory = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.activities || [];
  };

  if (!isAuthenticated) {
    return (
      <div className={`rounded-lg shadow-lg p-6 text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <p className="text-lg mb-4">Bu içeriği görüntülemek için giriş yapmanız gerekmektedir.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Giriş Yap
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`px-6 py-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-t-lg flex justify-between items-center`}>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Günlük Rutinlerim
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          <Plus size={18} className="mr-2" />
          Yeni Rutin Ekle
        </button>
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={addRoutine} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Saat
                </label>
                <input
                  type="time"
                  value={newRoutine.time}
                  onChange={(e) => setNewRoutine({...newRoutine, time: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Kategori
                </label>
                <select
                  value={newRoutine.category}
                  onChange={(e) => setNewRoutine({...newRoutine, category: e.target.value, activity: ''})}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Aktivite
                </label>
                <select
                  value={newRoutine.activity}
                  onChange={(e) => setNewRoutine({...newRoutine, activity: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  required
                >
                  <option value="">Aktivite seçin</option>
                  {getActivitiesForCategory(newRoutine.category).map((activity) => (
                    <option key={activity} value={activity}>
                      {activity}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6">
        {loading ? (
          <div className="text-center py-4">Yükleniyor...</div>
        ) : routines.length === 0 ? (
          <div className="text-center py-4">
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Henüz rutin eklenmemiş
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                } ${routine.is_completed ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-12 rounded-full ${getCategoryColor(routine.category)}`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {routine.time}
                      </span>
                    </div>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${
                      routine.is_completed ? 'line-through' : ''
                    }`}>
                      {routine.activity}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleComplete(routine.id, routine.is_completed)}
                    className={`p-2 rounded-lg transition-colors ${
                      routine.is_completed
                        ? 'bg-green-500 text-white'
                        : isDarkMode
                          ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                        : 'bg-gray-200 text-red-500 hover:bg-gray-300'
                    }`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyRoutineManager;