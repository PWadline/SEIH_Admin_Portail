import { useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './loginFlip.css';
import seihLogo from '../assets/Logo_seih.png';
import logo from '../assets/logo.png';
import { seihFetch } from "../services/seihApi";
import { setTokenCookie, setRefreshCookie, getTokenCookie } from '../auth/tokenCookie';

const BASE = String(import.meta.env.VITE_BASE_API_URL || '').trim().replace(/\/$/, '');
const LOGIN_URL = `${BASE}/seih/identity/user/loginseih`;

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('auth') === 'true') {
      navigate('/overview', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = useCallback(() => {
    if (!username && !password) return "Veuillez entrer vos identifiants.";
    if (!username) return "Veuillez entrer votre nom d'utilisateur.";
    if (!password) return "Veuillez entrer votre mot de passe.";
    return '';
  }, [username, password]);

  const handleLogin = useCallback(async () => {
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    setError('');

    try {
      const res = await seihFetch("/seih/identity/user/loginseih", {
        method: "POST",
        body: { username, password },
      });

      if (!res.ok) {
        setLoading(false);
        return setError(`Erreur serveur (${res.status})`);
      }

      const data = await res.json();

      if (!data?.isOk) {
        const msg =
          Array.isArray(data?.errorMessages) && data.errorMessages[0]
            ? data.errorMessages[0]
            : "Nom d'utilisateur ou mot de passe incorrect.";
        setLoading(false);
        return setError(msg);
      }

      const { result } = data || {};

      if (result?.token) {

        sessionStorage.setItem(
          "token",
          result.token
        );

        setTokenCookie(result.token, 1);
      }

      if (result?.refreshToken) {
        setRefreshCookie(result.refreshToken, 7);
      }

      sessionStorage.setItem('auth', 'true');

      if (result?.userRoles) {
        sessionStorage.setItem('roles', JSON.stringify(result.userRoles));
      }

      if (result?.email) {
        sessionStorage.setItem('email', result.email);
      }
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          firstName: result.firstName,
          lastName: result.lastName,
          roles: result.userRoles,
        }),
      );
      try {
  await fetch(
    "http://localhost:5258/api/admin/transfers/sync/all-transfers",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${result.token}`,
      },
    },
  );

  console.log(
    "Synchronisation des transferts lancée ✅",
  );
} catch (syncError) {
  console.error(
    "Erreur sync transferts",
    syncError,
  );
}

      setLoading(false);

      if (result?.isNewPasswordRequired) {
        return navigate('/overview');
      }

      navigate('/overview');

    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Impossible de joindre le serveur.");
    }
  }, [username, password, navigate, validate]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) handleLogin();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e293b] to-[#475569] dark:from-white dark:to-[#7F9AE5]/80">
      <div className="w-full bg-white/50 shadow-md px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
  src={logo}
  alt="SEIH Logo"
  className="h-20 w-auto object-contain"
/>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center h-screen w-screen px-4" onKeyDown={onKeyDown}>
        {/* Mobile / Tablet : Carte rotative */}
        <div className="lg:hidden w-80 h-96 relative card-flip-container">
          <div className={`card-flip-inner ${isFlipped ? 'flipped' : ''}`}>
            {/* Face avant - Login */}
            <div className="card-face card-face-front bg-white p-6 rounded-2xl shadow-custom-white flex flex-col justify-center items-center">
              <div className="absolute top-3 left-3">
                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 shadow hover:bg-gray-300 transition duration-200"
                >
                  <RotateCcw className="w-5 h-5 mx-auto" />
                </button>
              </div>

              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-inner-avatar mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 19.5v-1.125A2.625 2.625 0 0013.875 15.75h-3.75A2.625 2.625 0 007.5 18.375V19.5m9-10.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>

              <div className="w-full mb-4">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#425CA3] caret-black text-black"
                  autoComplete="username"
                />
              </div>

              <div className="w-full mb-4 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#425CA3] caret-black text-black"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <Eye className="w-6 h-6 text-gray-500" /> : <EyeOff className="w-6 h-6 text-gray-500" />}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full p-3 rounded-md transition duration-200 shadow-inner-card text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#425CA3] hover:bg-[#2e3f7c]'}`}
              >
                {loading ? 'Connexion…' : 'Connexion'}
              </button>

              <p className="mt-3 text-sm text-gray-500">
                Mot de passe oublié ? <a href="/support" className="text-[#425CA3] underline">Contacter le support</a>
              </p>
            </div>

            <div className="card-face card-face-back bg-[#425CA3] text-white p-6 rounded-2xl shadow-custom-white flex flex-col justify-center items-center text-center">
              <div className="absolute top-3 left-3">
                <button
                  type="button"
                  onClick={() => setIsFlipped(false)}
                  className="w-8 h-8 rounded-full bg-white text-gray-800 shadow hover:bg-gray-100 transition duration-200"
                >
                  <RotateCcw className="w-5 h-5 mx-auto" />
                </button>
              </div>
              <img src={seihLogo} alt="Logo SEIH" className="w-32 h-auto mb-8" />
              <p className="text-sm leading-5">
                Cette plateforme permet de gérer et superviser les établissements de santé intégrés au réseau SEIH, tout en facilitant la synchronisation des données, la sécurisation des échanges et l’administration centralisée des hôpitaux participants.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-row gap-6">
          <div className="w-80 h-96 bg-[#425CA3] p-6 rounded-2xl shadow-custom-white text-white flex flex-col justify-center items-center">
            <img src={seihLogo} alt="Logo SEIH" className="w-32 h-auto mb-8" />
            <p className="text-sm leading-5 text-center">
              Cette plateforme permet de gérer et superviser les établissements de santé intégrés au réseau SEIH, tout en facilitant la synchronisation des données, la sécurisation des échanges et l’administration centralisée des hôpitaux participants.
            </p>
          </div>

          <div className="w-80 h-96 bg-white p-6 rounded-2xl shadow-custom-white flex flex-col justify-center items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-inner-avatar mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 19.5v-1.125A2.625 2.625 0 0013.875 15.75h-3.75A2.625 2.625 0 007.5 18.375V19.5m9-10.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </div>

            <div className="w-full mb-4">
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#425CA3] caret-black text-black"
                autoComplete="username"
              />
            </div>

            <div className="w-full mb-4 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#425CA3] caret-black text-black"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <Eye className="w-6 h-6 text-gray-500" /> : <EyeOff className="w-6 h-6 text-gray-500" />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full p-3 rounded-md transition duration-200 shadow-inner-card text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#425CA3] hover:bg-[#2e3f7c]'}`}
            >
              {loading ? 'Connexion…' : 'Connexion'}
            </button>

            <p className="mt-3 text-sm text-gray-500">
              Mot de passe oublié ? <a href="/support" className="text-[#425CA3] underline">Contacter le support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

