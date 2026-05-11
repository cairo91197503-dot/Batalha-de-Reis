import React from 'react';
import { motion } from 'motion/react';
import { X, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="medieval-panel w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gold-dark hover:text-gold z-50"
        >
          <X size={24} />
        </button>

        <div className="p-8 border-b border-gold/10 flex items-center gap-4">
           <Shield className="text-gold w-8 h-8" />
           <h2 className="font-serif text-2xl gold-gradient-text uppercase tracking-widest">Édito de Privacidade</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8 font-serif text-ice/70 leading-relaxed custom-scrollbar text-sm space-y-6">
          <section>
            <h3 className="text-gold font-bold uppercase tracking-widest mb-2">1. Coleta de Honra</h3>
            <p>A Batalha de Reis respeita o anonimato de seus cavaleiros. Dados como nome real e localização nunca são coletados sem seu consentimento explícito através do Google Auth.</p>
          </section>

          <section>
            <h3 className="text-gold font-bold uppercase tracking-widest mb-2">2. Memória do Reino</h3>
            <p>Seus dados de jogo (ELO, Nível e Vitórias) são armazenados nos pergaminhos digitais do Firebase para garantir que sua glória seja preservada através dos tempos e dispositivos.</p>
          </section>

          <section>
            <h3 className="text-gold font-bold uppercase tracking-widest mb-2">3. Modo Furtivo</h3>
            <p>Ao entrar anonimamente, seus dados são armazenados localmente e vinculados temporariamente ao seu dispositivo. Não compartilhamos informações com reinos estrangeiros ou mercadores de dados.</p>
          </section>

          <section>
            <h3 className="text-gold font-bold uppercase tracking-widest mb-2">4. Segurança de Muralha</h3>
            <p>Utilizamos os protocolos de segurança do Google Cloud para proteger suas informações contra invasores e ataques de força bruta.</p>
          </section>
          
          <div className="pt-8 text-center opacity-30 text-[10px] uppercase tracking-[0.4em]">
             Selado pelo Conselho de Batalha de Reis • 2026
          </div>
        </div>
      </motion.div>
    </div>
  );
}
