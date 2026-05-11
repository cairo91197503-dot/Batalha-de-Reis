/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Tutorial from './components/Tutorial';
import Login from './components/Login';
import Lobby from './components/Lobby';
import BotSelection from './components/BotSelection';
import Game from './components/Game';
import { AppView, UserProfile, BotDifficulty } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function App() {
  const [view, setView] = useState<AppView>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<BotDifficulty>('beginner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Inicialização lenta - verificando cache local...");
        const savedGuest = localStorage.getItem('batlh_guest_profile');
        if (savedGuest) {
          try {
            setUser(JSON.parse(savedGuest));
            setView('lobby');
          } catch (e) {
            console.error("Erro ao carregar perfil convidado", e);
          }
        }
        setLoading(false);
      }
    }, 4500);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Clear guest cache if logging in with real account
          localStorage.removeItem('batlh_guest_profile');
          
          const userPath = `users/${firebaseUser.uid}`;
          const userRef = doc(db, userPath);
          let userSnap;
          
          try {
            userSnap = await getDoc(userRef);
          } catch (error) {
            console.warn("Erro ao buscar perfil remoto, tentando modo offline");
          }
          
          if (userSnap && userSnap.exists()) {
            setUser(userSnap.data() as UserProfile);
          } else {
            const pendingName = localStorage.getItem('batlh_pending_username');
            const newProfile: UserProfile = {
              name: pendingName || firebaseUser.displayName || 'Comandante',
              level: 1,
              elo: 400
            };
            try {
              if (navigator.onLine) {
                await setDoc(userRef, newProfile);
              }
            } catch (error) {
              console.error("Erro ao salvar perfil, mantendo local");
            }
            setUser(newProfile);
          }
          localStorage.removeItem('batlh_pending_username');
          setView('lobby');
        } else {
          // If no firebase user, check local guest
          const savedGuest = localStorage.getItem('batlh_guest_profile');
          if (savedGuest) {
            setUser(JSON.parse(savedGuest));
            setView('lobby');
          } else {
            setUser(null);
            setView('login');
          }
        }
      } catch (err) {
        console.error("Erro crítico na inicialização:", err);
        setView('login');
      } finally {
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Handle Login
  const onLogin = (username: string, isGuest: boolean = false) => {
    if (isGuest) {
      const guestProfile: UserProfile = {
        name: username,
        level: 1,
        elo: 400,
        isGuest: true
      };
      setUser(guestProfile);
      localStorage.setItem('batlh_guest_profile', JSON.stringify(guestProfile));
      setView('lobby');
    }
  };

  const startTutorial = () => setView('tutorial');
  const selectBot = () => setView('bot-selection');
  const startGame = (diff: BotDifficulty) => {
    setSelectedDifficulty(diff);
    setView('game');
  };
  const goBackToLobby = () => setView('lobby');
  const onLogout = async () => {
    await auth.signOut();
    setUser(null);
    setView('login');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-deep-black z-[100] fixed inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 border-b-2 border-gold rounded-full animate-spin mb-8" />
          <h2 className="font-serif text-2xl gold-gradient-text tracking-[0.3em] uppercase">Invocando o Reino</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-deep-black overflow-hidden selection:bg-gold/30 text-ice font-sans antialiased relative">
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login onLogin={onLogin} />
          </motion.div>
        )}
        {view === 'lobby' && (
          <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Lobby 
              user={user!} 
              onStartTutorial={startTutorial} 
              onSelectBot={selectBot} 
              onLogout={onLogout}
            />
          </motion.div>
        )}
        {view === 'tutorial' && (
          <motion.div key="tutorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Tutorial onComplete={goBackToLobby} />
          </motion.div>
        )}
        {view === 'bot-selection' && (
          <motion.div key="bot-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BotSelection onSelect={startGame} onBack={goBackToLobby} />
          </motion.div>
        )}
        {view === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Game difficulty={selectedDifficulty} onBack={goBackToLobby} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
