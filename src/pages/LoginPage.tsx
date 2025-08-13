import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  isDarkMode: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      navigate('/saglik-verilerim');
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-white">
      <div className="max-w-md mx-auto">
        <div className={`bg-white p-8 rounded-lg shadow-lg transition-all duration-300`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900">
              Hoş Geldiniz
            </h2>
            <p className="mt-2 text-blue-600">
              Sağlığınızı takip etmeye devam edin
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-900">
                E-posta Adresi
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-colors duration-200 bg-blue-50 border-blue-200 text-blue-900 focus:border-blue-500 border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-blue-900">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition-colors duration-200 bg-blue-50 border-blue-200 text-blue-900 focus:border-blue-500 border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-blue-900">
                  Beni hatırla
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Şifremi unuttum
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                loading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
              } text-white`}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="mt-6 text-center text-blue-900">
            Hesabınız yok mu?{' '}
            <Link 
              to="/kayit" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;