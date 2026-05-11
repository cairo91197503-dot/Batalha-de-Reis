import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Shield, Sword, Loader2, Info } from 'lucide-react';
import { signInWithGoogle, auth } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import PrivacyPolicy from './PrivacyPolicy';

interface LoginProps {
  onLogin: (username: string, isGuest?: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Falha ao invocar os exércitos do Google. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    // Armazena o nome pretendido para uso no App.tsx ou fallback
    localStorage.setItem('batlh_pending_username', username);

    try {
      if (navigator.onLine) {
        await signInAnonymously(auth);
        // App.tsx ouvirá o evento e usará o nome se necessário
      } else {
        onLogin(username, true);
      }
    } catch (err) {
      console.warn("Utilizando modo Convidado Local");
      onLogin(username, true);
    } finally {
      // Se não logou no Firebase, onLogin mudou a view. 
      // Se logou, App.tsx mudará a view.
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <div className="relative h-full w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto bg-deep-black">
      {/* Privacy Policy Modal */}
      <PrivacyPolicy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549221542-f8796d849312?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center brightness-[0.2] fixed" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-deep-black" />
      
      {/* Animated Particles (CSS based) - Enhanced */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md text-center py-8"
      >
        <div className="mb-4 sm:mb-8 flex justify-center">
          <div className="relative">
            <Crown className="w-12 h-12 sm:w-20 sm:h-20 text-gold glow-gold" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-3 sm:-inset-4 border border-gold/10 rounded-full"
            />
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black gold-gradient-text uppercase tracking-tighter mb-1 select-none">
          Batalha de Reis
        </h1>
        <p className="text-gold-dark/60 font-serif text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-8 sm:mb-12 select-none">Guerra de Inteligência</p>

        <div className="medieval-panel p-6 sm:p-8 backdrop-blur-xl border-gold/10 shadow-2xl">
          <form onSubmit={handleAnonymousLogin} className="space-y-4 sm:space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Seu Título Real"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
                className="w-full bg-stone-900/50 border border-gold/10 p-3 sm:p-4 pl-10 sm:pl-12 rounded focus:outline-none focus:border-gold/50 text-ice font-serif placeholder:text-stone-700 transition-all disabled:opacity-50 text-sm sm:text-base"
              />
              <Shield className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gold/30 w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !username.trim()}
              className="btn-medieval w-full py-3 sm:py-4 text-sm sm:text-lg flex items-center justify-center gap-2 active:scale-95 group shadow-lg"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                  Entrada Furtiva
                  <Sword size={16} className="opacity-0 group-hover:opacity-100 transition-opacity rotate-45" />
                </>
              )}
            </button>
          </form>

          {error && <p className="mt-4 text-blood text-[10px] font-serif uppercase tracking-[0.2em] leading-tight">{error}</p>}

          <div className="mt-6 sm:mt-8 flex flex-col gap-2 sm:gap-3">
             <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-stone-900/40 border border-white/10 rounded text-[10px] sm:text-xs font-serif uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50 active:scale-95"
             >
                {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3.5 h-3.5 sm:w-4 sm:h-4 grayscale hover:grayscale-0 transition-all" />
                    Legião Google
                  </>
                )}
             </button>

             <button 
               onClick={() => setShowPrivacy(true)}
               className="mt-6 text-[9px] text-ice/30 hover:text-gold/60 transition-colors uppercase tracking-[0.3em] flex items-center justify-center gap-1 mx-auto"
             >
               <Info size={10} />
               Éditos de Privacidade
             </button>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 flex items-center justify-center gap-4 sm:gap-8 opacity-10 select-none">
          <Sword className="w-4 h-4 sm:w-6 sm:h-6 text-gold" />
          <div className="h-px w-12 sm:w-20 bg-gold" />
          <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-gold" />
          <div className="h-px w-12 sm:w-20 bg-gold" />
          <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-gold" />
        </div>
      </motion.div>

      <style>{`
        .firefly {
          position: absolute; 
          width: 2px; 
          height: 2px; 
          background: #D4AF37; 
          border-radius: 50%;
          filter: blur(1px); 
          animation: drift 25s infinite linear;
          pointer-events: none;
        }
        @keyframes drift {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate(100vw, -100vh); opacity: 0; }
        }
        .firefly:nth-child(1) { top: 95%; left: 0; animation-delay: 0s; }
        .firefly:nth-child(2) { top: 80%; left: 15%; animation-delay: 7s; }
        .firefly:nth-child(3) { top: 85%; left: 5%; animation-delay: 14s; }
        .firefly:nth-child(4) { top: 90%; left: 20%; animation-delay: 3s; }
        .firefly:nth-child(5) { top: 75%; left: 8%; animation-delay: 10s; }
      `}</style>
    </div>
  );
}
