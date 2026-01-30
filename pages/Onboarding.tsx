import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from '../components/Icon';
import { CelestIcon } from '../components/CelestIcon';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = React.useState({
    full_name: '',
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthCountry: ''
  });

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({
    full_name: '',
    birthDate: '',
    birthTime: '',
    birthCity: ''
  });

  // Load state from session storage on mount
  React.useEffect(() => {
    const saved = sessionStorage.getItem('onboarding_form');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Save state on change
  const updateFormData = (newData: typeof formData) => {
    setFormData(newData);
    // Clear errors when user types
    setErrors({ full_name: '', birthDate: '', birthTime: '', birthCity: '' });
    sessionStorage.setItem('onboarding_form', JSON.stringify(newData));
  };

  const getSessionId = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('session_id');
  };

  const parseDate = (dateStr: string) => {
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return '1990-01-01'; // Fallback
  };

  // Format Date: DD/MM/YYYY
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 8) value = value.slice(0, 8); // Max 8 digits

    let formatted = '';
    if (value.length > 4) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    } else {
      formatted = value;
    }

    // Explicitly update state
    const newData = { ...formData, birthDate: formatted };
    setFormData(newData);
    sessionStorage.setItem('onboarding_form', JSON.stringify(newData));

    // Clear error if seems valid length
    if (formatted.length === 10) {
      setErrors(prev => ({ ...prev, birthDate: '' }));
    }
  };

  // Format Time: HH:MM
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);

    let formatted = '';
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}:${value.slice(2)}`;
    } else {
      formatted = value;
    }

    const newData = { ...formData, birthTime: formatted };
    setFormData(newData);
    sessionStorage.setItem('onboarding_form', JSON.stringify(newData));

    if (formatted.length === 5) {
      setErrors(prev => ({ ...prev, birthTime: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      full_name: '',
      birthDate: '',
      birthTime: '',
      birthCity: ''
    };
    let isValid = true;

    if (!formData.full_name || formData.full_name.length < 3) {
      newErrors.full_name = 'Nome muito curto.';
      isValid = false;
    }

    if (formData.birthDate.length !== 10) {
      newErrors.birthDate = 'Data incompleta (DD/MM/AAAA).';
      isValid = false;
    } else {
      const [day, month, year] = formData.birthDate.split('/').map(Number);
      if (month > 12 || day > 31) {
        newErrors.birthDate = 'Data inválida.';
        isValid = false;
      }
    }

    if (formData.birthTime.length !== 5) {
      newErrors.birthTime = 'Hora incompleta (HH:MM).';
      isValid = false;
    }

    if (!formData.birthCity || formData.birthCity.length < 3) {
      newErrors.birthCity = 'Cidade obrigatória.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStart = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const sessionId = getSessionId();

    // 🔒 Gating Check / Payment Simulation
    if (!sessionId) {
      // Simulate "Working"
      await new Promise(r => setTimeout(r, 800));

      const confirmBuy = window.confirm("⚠ Acesso Restrito: O Vigor Anual custa R$ 97,00 por ano.\n\nSimular pagamento e desbloquear?");

      if (confirmBuy) {
        sessionStorage.setItem('onboarding_form', JSON.stringify(formData));
        navigate(`/onboarding?session_id=sim_paid_${Date.now()}`);
        setLoading(false);
        return;
      }
      setLoading(false);
      return;
    }

    try {
      const payload = {
        full_name: formData.full_name,
        birth_date: parseDate(formData.birthDate),
        birth_time: formData.birthTime,
        birth_city: formData.birthCity.split(',')[0],
        birth_country: "BR",
        session_id: sessionId
      };

      // Simulate processing delay for UX
      await new Promise(r => setTimeout(r, 1500));

      // OFFLINE MODE: Store locally and proceed without backend
      // Backend API is not available on Vercel static hosting
      const offlineUserId = `demo_${Date.now()}`;

      console.log("Offline Mode: User Created:", offlineUserId);
      localStorage.setItem('celest_user_id', offlineUserId);
      localStorage.setItem('user_birth_data', JSON.stringify(payload));
      sessionStorage.removeItem('onboarding_form');

      // Navigate to loading then dashboard
      navigate(`/loading?user_id=${offlineUserId}`);

    } catch (e) {
      console.error(e);
      alert("Falha ao processar. Tente novamente.");
    } finally {
      setLoading(false);
    }

  };

  // Helper to check validity for visual feedback
  const isValid = (field: string) => {
    if (field === 'full_name') return formData.full_name.length > 2;
    if (field === 'birthDate') return formData.birthDate.length === 10;
    if (field === 'birthTime') return formData.birthTime.length === 5;
    if (field === 'birthCity') return formData.birthCity.length > 2;
    return false;
  };

  const getInputClass = (field: string, hasError: string) => {
    if (hasError) return "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
    if (isValid(field)) return "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
    return "border-white/10 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(0,240,255,0.3)]";
  };

  return (
    <div className="font-display flex flex-col justify-between min-h-screen relative overflow-hidden bg-[#010409]">
      <Helmet>
        <title>Onboarding | Celest AI</title>
        <meta name="description" content="Configure seu perfil astrológico para começar sua jornada." />
      </Helmet>
      {/* ... Background ... */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-15%] w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-cyan-400/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col p-8">
        <header className="flex flex-col items-center pt-8 mb-8">
          {/* Branding */}
          <div className="flex flex-row items-center mb-12 justify-center select-none">
            <div className="group flex items-center gap-2 cursor-pointer no-underline text-white focus:outline-none">
              <div className="relative flex-shrink-0 transition-transform duration-700 hover:rotate-180">
                <CelestIcon size={76} />
              </div>

              <div className="flex flex-col justify-center leading-none select-none">
                <span className="font-sans text-3xl sm:text-4xl font-bold tracking-tight relative top-[-1px] whitespace-nowrap">
                  <span className="font-extrabold bg-gradient-to-r from-white via-[#FFD6BC] to-[#D6582C] bg-clip-text text-transparent">Celest AI</span>
                </span>
              </div>
            </div>
          </div>

          <div className="w-full text-start">
            <h1 className="text-white tracking-tight text-3xl font-bold leading-tight mb-2">
              Sua Origem
            </h1>
            <p className="text-slate-400 text-sm font-normal leading-relaxed max-w-[85%]">
              Para calibrar seus sinais vitais cósmicos.
            </p>
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center py-8 space-y-8">

          {/* Name Input */}
          <div className="group relative">
            <label htmlFor="full_name" className="block text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-2">
              Nome Completo
            </label>
            <div className={`relative flex items-end border-b transition-all duration-300 ${getInputClass('full_name', errors.full_name)}`}>
              <input
                id="full_name"
                className="block w-full border-0 bg-transparent p-0 pb-3 text-white placeholder:text-white/10 focus:ring-0 text-xl font-light outline-none"
                placeholder="Seu Nome"
                value={formData.full_name}
                onChange={(e) => updateFormData({ ...formData, full_name: e.target.value })}
                type="text"
              />
              {isValid('full_name') && !errors.full_name && (
                <Icon name="check_circle" className="text-green-500 absolute right-0 bottom-4 animate-scale-in" />
              )}
            </div>
            {errors.full_name && <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.full_name}</p>}
          </div>

          <div className="group relative">
            <label htmlFor="birthDate" className="block text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-2">
              Data de Nascimento
            </label>
            <div className={`relative flex items-end border-b transition-all duration-300 ${getInputClass('birthDate', errors.birthDate)}`}>
              <input
                id="birthDate"
                className="block w-full border-0 bg-transparent p-0 pb-3 text-white placeholder:text-white/10 focus:ring-0 text-xl font-light outline-none"
                placeholder="DD / MM / AAAA"
                maxLength={10}
                value={formData.birthDate}
                onChange={handleDateChange}
                type="text"
                inputMode="numeric"
              />
              {isValid('birthDate') && !errors.birthDate && (
                <Icon name="check_circle" className="text-green-500 absolute right-0 bottom-4 animate-scale-in" />
              )}
            </div>
            {errors.birthDate ? (
              <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.birthDate}</p>
            ) : (
              <p className="mt-3 text-xs text-slate-500 font-medium tracking-wide">Define a posição solar e lunar.</p>
            )}
          </div>

          <div className="group relative">
            <label htmlFor="birthTime" className="block text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-2">
              Hora Exata
            </label>
            <div className={`relative flex items-center border-b transition-all duration-300 ${getInputClass('birthTime', errors.birthTime)}`}>
              <input
                id="birthTime"
                className="block w-full border-0 bg-transparent p-0 pb-3 pr-10 text-white placeholder:text-white/10 focus:ring-0 text-xl font-light outline-none"
                placeholder="00:00"
                maxLength={5}
                value={formData.birthTime}
                onChange={handleTimeChange}
                type="text"
                inputMode="numeric"
              />
              {isValid('birthTime') && !errors.birthTime ? (
                <Icon name="check_circle" className="text-green-500 absolute right-8 bottom-4 animate-scale-in" />
              ) : (
                <Icon name="schedule" className="absolute right-0 bottom-4 text-slate-600" />
              )}
            </div>
            {errors.birthTime ? (
              <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.birthTime}</p>
            ) : (
              <p className="mt-3 text-xs text-slate-500 font-medium tracking-wide mb-4">Crucial para calcular seu ascendente.</p>
            )}

            {/* Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group/check w-fit">
              <div className="relative w-5 h-5 border border-white/20 rounded-md flex items-center justify-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-full h-full bg-cyan-400 hidden peer-checked:block absolute inset-0 rounded-sm"></div>
                <Icon name="check" className="text-[14px] text-black z-10 hidden peer-checked:block" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Não tenho certeza do horário</span>
            </label>
          </div>

          <div className="group relative">
            <label htmlFor="birthCity" className="block text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-2">
              Local de Nascimento
            </label>
            <div className={`relative flex items-center border-b transition-all duration-300 ${getInputClass('birthCity', errors.birthCity)}`}>
              <input
                id="birthCity"
                className="block w-full border-0 bg-transparent p-0 pb-3 pr-10 text-white placeholder:text-white/10 focus:ring-0 text-xl font-light outline-none"
                placeholder="Cidade / Estado / País"
                value={formData.birthCity}
                onChange={(e) => updateFormData({ ...formData, birthCity: e.target.value })}
                type="text"
              />
              {isValid('birthCity') && !errors.birthCity ? (
                <Icon name="check_circle" className="text-green-500 absolute right-8 bottom-4 animate-scale-in" />
              ) : (
                <Icon name="location_on" className="absolute right-0 bottom-4 text-slate-600" />
              )}
            </div>
            {errors.birthCity ? (
              <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.birthCity}</p>
            ) : (
              <p className="mt-3 text-xs text-slate-500 font-medium tracking-wide">Estabelece as coordenadas do horizonte.</p>
            )}
          </div>
        </main >

        <footer className="mt-auto pb-6">
          <button
            onClick={handleStart}
            disabled={loading}
            className={`w-full h-[64px] rounded-full flex items-center justify-center gap-3 transition-all duration-300 
                ${loading
                ? 'bg-slate-800 cursor-wait scale-[0.98]'
                : 'bg-white/95 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]'
              }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white/70 font-semibold text-sm tracking-widest uppercase">Processando...</span>
              </>
            ) : (
              <>
                <span className="text-black font-bold text-lg tracking-tight">Começar Jornada</span>
                <Icon name="arrow_forward" className="text-black text-2xl" />
              </>
            )}
          </button>

          <div className="mt-8 flex justify-center items-center gap-2.5">
            <div className="p-1 rounded-full bg-white/5">
              <Icon name="lock" className="text-[14px] text-cyan-400/80" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-500">
              Dados Criptografados
            </p>
          </div>
        </footer>
      </div >
    </div >
  );
};

export default Onboarding;