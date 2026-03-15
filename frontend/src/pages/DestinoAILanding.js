import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  GraduationCap, 
  Globe2, 
  Calculator,
  FileCheck,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';

// DestinoAI Logo URL
const DESTINOAI_LOGO = "https://customer-assets.emergentagent.com/job_871dbea6-6289-44ca-b76c-a0b66a131e4c/artifacts/bh5v4fon_WhatsApp%20Image%202026-03-14%20at%2009.24.22.jpeg";

const features = [
  {
    icon: Globe2,
    title: "Recomendação de Destinos",
    description: "IA analisa seu perfil e sugere os melhores países para você"
  },
  {
    icon: GraduationCap,
    title: "Escolas Parceiras",
    description: "Acesso a centenas de escolas verificadas em todo o mundo"
  },
  {
    icon: Calculator,
    title: "Calculadora de Custos",
    description: "Estimativa completa de investimento para seu intercâmbio"
  },
  {
    icon: FileCheck,
    title: "Checklist de Documentos",
    description: "Lista personalizada de tudo que você precisa"
  }
];

const benefits = [
  "Atendimento 24/7 com inteligência artificial",
  "Respostas personalizadas para seu perfil",
  "Informações atualizadas sobre vistos e custos",
  "Plano de intercâmbio completo em PDF",
  "Suporte em Português, Inglês e Espanhol"
];

const destinations = [
  { country: "Irlanda", flag: "🇮🇪", highlight: "Trabalho + Estudo" },
  { country: "Malta", flag: "🇲🇹", highlight: "Custo Acessível" },
  { country: "Canadá", flag: "🇨🇦", highlight: "Imigração" },
  { country: "Austrália", flag: "🇦🇺", highlight: "Qualidade de Vida" },
];

export const DestinoAILanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-white/70 hover:text-white flex items-center gap-2 text-sm">
            ← Voltar para STUFF
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/destinoai/chat" 
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Iniciar Chat
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-4 py-20 relative">
          <div className="text-center">
            <div 
              className="w-48 h-48 mx-auto mb-8 flex items-center justify-center rounded-2xl"
              style={{ backgroundColor: '#1a3d5c' }}
            >
              <img 
                src={DESTINOAI_LOGO} 
                alt="DestinoAI" 
                className="w-full h-full object-contain rounded-2xl"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Seu Intercâmbio
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Planejado por IA
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Converse com nossa inteligência artificial especialista em intercâmbio. 
              Receba um plano completo e personalizado em minutos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/destinoai/chat" 
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30"
                data-testid="start-chat-btn"
              >
                <Sparkles className="w-5 h-5" />
                Começar Agora - Grátis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Respostas em segundos</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>+1000 estudantes atendidos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>4.9/5 avaliação</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 bg-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Destinos Disponíveis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-all"
              >
                <span className="text-4xl mb-3 block">{dest.flag}</span>
                <h3 className="text-white font-bold">{dest.country}</h3>
                <p className="text-emerald-400 text-sm mt-1">{dest.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            O que o DestinoAI faz por você
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
            Nossa IA foi treinada com dados reais de intercâmbio para te dar as melhores recomendações
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Por que usar o DestinoAI?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center">
                <Plane className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Pronto para começar?</h3>
                <p className="text-slate-400 mb-6">
                  Em 5 minutos você terá seu plano de intercâmbio personalizado
                </p>
                <Link 
                  to="/destinoai/chat" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar com DestinoAI
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div 
            className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden opacity-60"
            style={{ backgroundColor: '#1a3d5c' }}
          >
            <img 
              src={DESTINOAI_LOGO} 
              alt="DestinoAI" 
              className="w-full h-full object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
          <p className="text-slate-500 text-sm">
            DestinoAI © 2026 - Seu Intercâmbio Inteligente
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Powered by GPT-4o • Uma solução STUFF Intercâmbio
          </p>
        </div>
      </footer>
    </div>
  );
};
