import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, 
  GraduationCap, 
  Globe2, 
  MessageCircle,
  RefreshCw,
  MapPin,
  DollarSign,
  FileCheck,
  Calendar,
  ArrowLeft,
  Languages,
  FileDown,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations, languageNames, languageFlags } from '../translations/destinoai';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// DestinoAI Logo URL
const DESTINOAI_LOGO = "https://customer-assets.emergentagent.com/job_871dbea6-6289-44ca-b76c-a0b66a131e4c/artifacts/bh5v4fon_WhatsApp%20Image%202026-03-14%20at%2009.24.22.jpeg";

// Message component
const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
      isUser 
        ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-br-md' 
        : 'bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-100'
    }`}>
      {!isUser && (
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
          <img src={DESTINOAI_LOGO} alt="DestinoAI" className="w-6 h-6 object-contain" />
          <span className="text-xs font-semibold text-emerald-600">DestinoAI</span>
        </div>
      )}
      <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
      <p className={`text-xs mt-2 ${isUser ? 'text-sky-100' : 'text-slate-400'}`}>
        {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
);

// Typing indicator
const TypingIndicator = () => (
  <div className="flex justify-start animate-fade-in">
    <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <img src={DESTINOAI_LOGO} alt="DestinoAI" className="w-6 h-6 object-contain" />
        <span className="text-xs font-semibold text-emerald-600">DestinoAI</span>
      </div>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  </div>
);

// Language Selector Component
const LanguageSelector = ({ currentLang, onChangeLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
        data-testid="language-selector"
      >
        <Languages className="w-4 h-4" />
        <span>{languageFlags[currentLang]}</span>
        <span className="hidden sm:inline">{languageNames[currentLang]}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-50 min-w-[150px]">
          {Object.keys(languageNames).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                onChangeLang(lang);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                currentLang === lang ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
              data-testid={`lang-${lang}`}
            >
              <span className="text-lg">{languageFlags[lang]}</span>
              <span className="font-medium">{languageNames[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// PDF Modal Component
const PDFModal = ({ isOpen, onClose, onGenerate, t, isGenerating }) => {
  const [name, setName] = useState('');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <FileDown className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">{t.downloadPdf}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <p className="text-slate-600 mb-4">{t.enterName}</p>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="João Silva"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all mb-4"
          data-testid="pdf-name-input"
        />
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={() => onGenerate(name || 'Estudante')}
            disabled={isGenerating}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            data-testid="pdf-generate-btn"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t.downloadingPdf}
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                {t.generate}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App
export const DestinoAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [language, setLanguage] = useState('pt');
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get translations for current language
  const t = translations[language];

  // Suggestions with icons
  const SUGGESTIONS = [
    { icon: GraduationCap, text: t.suggestion1, color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
    { icon: DollarSign, text: t.suggestion2, color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
    { icon: MapPin, text: t.suggestion3, color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { icon: FileCheck, text: t.suggestion4, color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate PDF
  const handleGeneratePDF = async (studentName) => {
    if (!sessionId) return;
    
    setIsGeneratingPDF(true);
    try {
      const response = await axios.post(
        `${API}/destinoai/generate-pdf`,
        {
          session_id: sessionId,
          student_name: studentName,
          language: language
        },
        {
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `plano_intercambio_${sessionId.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setShowPDFModal(false);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Send message
  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    setShowWelcome(false);
    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/destinoai/chat`, {
        session_id: sessionId,
        message: text,
        language: language
      });

      if (!sessionId) {
        setSessionId(response.data.session_id);
      }

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: language === 'en' 
          ? 'Sorry, I had a problem processing your message. Please try again.'
          : language === 'es'
          ? 'Lo siento, tuve un problema al procesar tu mensaje. Por favor, inténtalo de nuevo.'
          : 'Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Handle suggestion click
  const handleSuggestion = (text) => {
    sendMessage(text);
  };

  // New chat
  const startNewChat = async () => {
    if (sessionId) {
      try {
        await axios.delete(`${API}/destinoai/chat/${sessionId}`);
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
    setMessages([]);
    setSessionId(null);
    setShowWelcome(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-violet-900 flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div 
              className="h-12 w-12 rounded-lg overflow-hidden"
              style={{ backgroundColor: 'rgb(15, 75, 115)' }}
            >
              <img 
                src={DESTINOAI_LOGO} 
                alt="DestinoAI" 
                className="h-full w-full object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSelector currentLang={language} onChangeLang={setLanguage} />
            
            {messages.length > 0 && (
              <>
                <button
                  onClick={() => setShowPDFModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-sm transition-all"
                  data-testid="download-pdf-btn"
                >
                  <FileDown className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.downloadPdf}</span>
                </button>
                
                <button
                  onClick={startNewChat}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
                  data-testid="new-chat-btn"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.newChat}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col p-4">
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Welcome Screen */}
            {showWelcome && messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center py-8">
                <img 
                  src={DESTINOAI_LOGO} 
                  alt="DestinoAI" 
                  className="w-48 h-auto object-contain mb-6"
                  style={{ mixBlendMode: 'multiply' }}
                />
                
                <p className="text-slate-500 text-center max-w-md mb-8">
                  {t.welcomeText}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg px-4">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestion(suggestion.text)}
                      className={`flex items-center gap-3 p-3 rounded-xl ${suggestion.color} transition-all text-left group`}
                      data-testid={`suggestion-${index}`}
                    >
                      <suggestion.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{t.feature1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{t.feature2}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileCheck className="w-3 h-3" />
                    <span>{t.feature3}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message} 
                isUser={message.role === 'user'} 
              />
            ))}
            
            {/* Typing Indicator */}
            {isLoading && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-slate-700 placeholder:text-slate-400 disabled:bg-slate-100"
                  data-testid="chat-input"
                />
                <MessageCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-500/30"
                data-testid="send-btn"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">{t.send}</span>
              </button>
            </form>
            <p className="text-center text-xs text-slate-400 mt-3">
              {t.powered}
            </p>
          </div>
        </div>
      </main>
      
      {/* PDF Modal */}
      <PDFModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        onGenerate={handleGeneratePDF}
        t={t}
        isGenerating={isGeneratingPDF}
      />
    </div>
  );
};
