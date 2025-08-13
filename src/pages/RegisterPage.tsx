import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

interface RegisterPageProps {
  isDarkMode: boolean;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const validatePassword = (pass: string) => {
    const criteria = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass),
    };
    return criteria;
  };

  const passwordCriteria = validatePassword(password);
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError('Lütfen tüm şifre kriterlerini karşılayın');
      return;
    }

    if (!passwordsMatch) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp(email, password);
      navigate('/saglik-verilerim');
    } catch (err) {
      setError('Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ${met ? 'text-green-500' : 'text-red-500'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-white">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900">
              Hesap Oluştur
            </h2>
            <p className="mt-2 text-blue-600">
              Sağlığınızı takip etmeye başlayın
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

            <div>
              <label className="block text-sm font-medium mb-2 text-blue-900">
                Şifre Tekrar
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition-colors duration-200 bg-blue-50 border-blue-200 text-blue-900 focus:border-blue-500 border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50/80 backdrop-blur-sm">
              <h3 className="text-sm font-medium mb-2 text-blue-900">
                Şifre gereksinimleri:
              </h3>
              <div className="space-y-2">
                <CriteriaItem met={passwordCriteria.length} text="En az 8 karakter" />
                <CriteriaItem met={passwordCriteria.uppercase} text="En az 1 büyük harf" />
                <CriteriaItem met={passwordCriteria.lowercase} text="En az 1 küçük harf" />
                <CriteriaItem met={passwordCriteria.number} text="En az 1 rakam" />
                <CriteriaItem met={passwordCriteria.special} text="En az 1 özel karakter (!@#$%^&*)" />
                <CriteriaItem met={passwordsMatch} text="Şifreler eşleşmeli" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid || !passwordsMatch}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                loading || !isPasswordValid || !passwordsMatch
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
              } text-white`}
            >
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <p className="mt-6 text-center text-blue-900">
            Zaten hesabınız var mı?{' '}
            <Link 
              to="/giris" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;