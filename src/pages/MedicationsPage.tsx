import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, Plus, Trash2, Bell, AlertCircle, CheckCircle, Pill as Pills } from 'lucide-react';

interface MedicationsPageProps {
  isDarkMode: boolean;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  category: string;
  notes?: string;
  reminder_enabled: boolean;
}

interface MedicationOption {
  id: string;
  name: string;
  category: string;
  default_dosage: string;
  frequency: string;
  notes: string | null;
}

const categories = [
  { value: 'prescription', label: 'Reçeteli İlaçlar' },
  { value: 'vitamin', label: 'Vitaminler' },
  { value: 'supplement', label: 'Takviyeler' },
  { value: 'chronic', label: 'Kronik İlaçlar' },
  { value: 'temporary', label: 'Geçici İlaçlar' }
];

const frequencies = [
  { value: 'daily', label: 'Günde bir kez' },
  { value: 'twice_daily', label: 'Günde iki kez' },
  { value: 'three_times_daily', label: 'Günde üç kez' },
  { value: 'four_times_daily', label: 'Günde dört kez' },
  { value: 'weekly', label: 'Haftada bir kez' },
  { value: 'monthly', label: 'Ayda bir kez' },
  { value: 'as_needed', label: 'Gerektiğinde' }
];

const MedicationsPage: React.FC<MedicationsPageProps> = ({ isDarkMode }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationOptions, setMedicationOptions] = useState<MedicationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('prescription');
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '',
    category: 'prescription',
    notes: '',
    reminder_enabled: true
  });

  useEffect(() => {
    fetchMedications();
    fetchMedicationOptions();
  }, []);

  const fetchMedicationOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('medication_options')
        .select('*')
        .order('name');

      if (error) throw error;
      setMedicationOptions(data || []);
    } catch (err) {
      console.error('İlaç seçenekleri yüklenirken hata:', err);
    }
  };

  const fetchMedications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: true });

      if (error) throw error;
      setMedications(data || []);
    } catch (err) {
      setError('İlaçlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleMedicationSelect = (optionId: string) => {
    const selectedOption = medicationOptions.find(opt => opt.id === optionId);
    if (selectedOption) {
      setNewMedication({
        ...newMedication,
        name: selectedOption.name,
        dosage: selectedOption.default_dosage,
        frequency: selectedOption.frequency,
        notes: selectedOption.notes || '',
        category: selectedOption.category
      });
    }
  };

  const validateMedication = (med: Partial<Medication>) => {
    if (!med.name || med.name.trim().length < 2) {
      return 'İlaç adı en az 2 karakter olmalıdır';
    }
    if (!med.dosage) {
      return 'Doz bilgisi gereklidir';
    }
    if (!med.time) {
      return 'İlaç alma saati gereklidir';
    }
    return null;
  };

  const addMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateMedication(newMedication);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      const { error } = await supabase
        .from('medications')
        .insert([{ ...newMedication, user_id: user.id }]);

      if (error) throw error;
      
      setShowForm(false);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: 'daily',
        time: '',
        category: 'prescription',
        notes: '',
        reminder_enabled: true
      });
      await fetchMedications();
    } catch (err) {
      setError('İlaç eklenirken bir hata oluştu');
    }
  };

  const deleteMedication = async (id: string) => {
    if (!window.confirm('Bu ilacı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    console.log('Deleting medication with ID:', id);
    try {
      const { data, error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      console.log('Medication deleted successfully:', data);
      await fetchMedications();
    } catch (err) {
      console.error('Error in deleteMedication:', err);
      setError('İlaç silinirken bir hata oluştu');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      prescription: 'bg-blue-500',
      vitamin: 'bg-green-500',
      supplement: 'bg-purple-500',
      chronic: 'bg-red-500',
      temporary: 'bg-yellow-500'
    };
    return colors[category as keyof typeof colors] || colors.prescription;
  };

  const filteredMedicationOptions = medicationOptions.filter(
    option => option.category === selectedCategory
  );

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              İlaçlarım
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              İlaçlarınızı takip edin ve zamanında almayı unutmayın
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Yeni İlaç Ekle
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        {showForm && (
          <div className={`mb-8 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className="text-xl font-semibold mb-4">Yeni İlaç Ekle</h2>
            <form onSubmit={addMedication} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">İlaç Seçin</label>
                  <select
                    onChange={(e) => handleMedicationSelect(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    required
                  >
                    <option value="">İlaç seçin</option>
                    {filteredMedicationOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} ({option.default_dosage})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Doz</label>
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    placeholder="Örn: 500mg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Kullanım Sıklığı</label>
                  <select
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    required
                  >
                    {frequencies.map((freq) => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Saat</label>
                  <input
                    type="time"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Notlar</label>
                  <textarea
                    value={newMedication.notes}
                    onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    rows={3}
                    placeholder="Ek bilgiler..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newMedication.reminder_enabled}
                      onChange={(e) => setNewMedication({...newMedication, reminder_enabled: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Hatırlatıcıları etkinleştir</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medications.map((medication) => (
            <div
              key={medication.id}
              className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg relative overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${getCategoryColor(medication.category)}`} />
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{medication.name}</h3>
                  <div className="space-y-2">
                    <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="font-medium mr-2">Doz:</span> {medication.dosage}
                    </p>
                    <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="font-medium mr-2">Sıklık:</span>
                      {frequencies.find(f => f.value === medication.frequency)?.label}
                    </p>
                    <div className="flex items-center mt-2">
                      <Clock size={16} className="text-blue-500 mr-2" />
                      <span>{medication.time}</span>
                    </div>
                  </div>

                  {medication.notes && (
                    <p className={`mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {medication.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  {medication.reminder_enabled && (
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Bell size={16} className="text-blue-500" />
                    </div>
                  )}
                  <button
                    onClick={() => deleteMedication(medication.id)}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-red-700 hover:bg-red-600' 
                        : 'bg-red-100 hover:bg-red-200'
                    }`}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {medications.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className={`inline-block p-4 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} mb-4`}>
              <Pills size={32} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Henüz ilaç eklenmemiş
            </p>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              İlaçlarınızı ekleyerek takip etmeye başlayın
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MedicationsPage;