import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { sendChatMessage } from '../api/endpoints/chat';

export default function ChatBot() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sugerencias según rol
  const getSuggestions = () => {
    if (!user) return [];
    if (user.role === 'CLIENT') {
      return [
        { label: '🚗 Mis vehículos', prompt: 'Ver mis vehículos' },
        { label: '💰 Mis gastos', prompt: 'Ver mis gastos acumulados' },
        { label: '📅 Próximos servicios', prompt: '¿Cuáles son mis próximos servicios programados?' }
      ];
    } else {
      return [
        { label: '📊 Estadísticas del taller', prompt: 'Muéstrame las estadísticas globales del taller' },
        { label: '⚠️ Alertas preventivas', prompt: 'Ver alertas preventivas activas' },
        { label: '👨‍🔧 Rendimiento de mecánicos', prompt: 'Ver rendimiento de los mecánicos' },
        { label: '📈 Ingresos mensuales', prompt: 'Muéstrame el historial de ingresos mensuales' }
      ];
    }
  };

  // Cargar saludo inicial al abrir el chat por primera vez
  useEffect(() => {
    if (!user) return;
    if (isOpen && messages.length === 0) {
      const saludo = user.role === 'CLIENT'
        ? `¡Hola, ${user.name}! 🚗 Soy tu Asistente Automotriz. ¿En qué te puedo ayudar hoy? Puedes consultar tus vehículos, próximos servicios o el historial de gastos.`
        : `¡Hola, ${user.name}! 🛠️ Asistente de Gestión del Taller activo. ¿Qué información deseas consultar? (Estadísticas, alertas, mecánicos, ingresos).`;
      setMessages([{ role: 'model', text: saludo }]);
    }
  }, [isOpen, messages.length, user]);



  // Scroll automático hacia abajo al recibir un mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const prompt = textToSend || input.trim();
    if (!prompt) return;

    // Agregar mensaje del usuario a la lista
    const newMessages = [...messages, { role: 'user', text: prompt }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Filtrar el historial para que solo contenga { role, text }
      const historyPayload = newMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await sendChatMessage(prompt, historyPayload);
      setMessages([...newMessages, { role: 'model', text: res.data.text }]);
    } catch (error) {
      console.error('Error al enviar el mensaje de chat:', error);
      setMessages([
        ...newMessages,
        { role: 'model', text: '⚠️ Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Convertir texto plano con Markdown básico a elementos React de forma simple
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    // Dividir en líneas
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Títulos Markdown (### Titulo o ## Titulo)
      if (line.startsWith('### ')) {
        return <h4 key={index} className="font-bold text-slate-800 text-sm mt-3 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={index} className="font-bold text-slate-800 text-base mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      
      // Listas
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = formatBoldText(line.substring(2));
        return (
          <div key={index} className="flex items-start ml-2 my-0.5 text-xs text-slate-700">
            <span className="mr-1.5 text-sky-500">•</span>
            <span>{content}</span>
          </div>
        );
      }

      // Líneas vacías
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }

      // Línea común
      return <p key={index} className="text-xs text-slate-700 leading-relaxed my-1">{formatBoldText(line)}</p>;
    });
  };

  // Reemplazar texto entre ** con negrita
  const formatBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Burbuja flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="flex flex-col w-[360px] h-[500px] md:w-[400px] md:h-[550px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Asistente Automotriz</h3>
                <span className="text-[10px] text-slate-400 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                  Conectado • {user.role}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  
                  {/* Icono de Avatar */}
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full text-white flex-shrink-0 ${
                    m.role === 'user' ? 'bg-sky-600' : 'bg-slate-700'
                  }`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Burbuja de texto */}
                  <div className={`p-3 rounded-2xl text-slate-800 text-xs shadow-sm ${
                    m.role === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 rounded-tl-none'
                  }`}>
                    {m.role === 'user' ? (
                      <p className="leading-relaxed">{m.text}</p>
                    ) : (
                      renderFormattedText(m.text)
                    )}
                  </div>

                </div>
              </div>
            ))}

            {/* Cargando respuesta */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-700 text-white flex-shrink-0">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 rounded-tl-none text-slate-500 flex items-center space-x-1.5">
                    <Loader className="w-4 h-4 animate-spin text-sky-500" />
                    <span className="text-xs">Buscando datos en tiempo real...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias de chips */}
          {messages.length <= 2 && !loading && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5">
              {getSuggestions().map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.prompt)}
                  className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 hover:border-sky-500 hover:bg-sky-50/30 text-slate-600 hover:text-sky-600 rounded-full transition-all duration-200"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input de envío */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Haz una pregunta sobre el taller..."
              disabled={loading}
              className="flex-1 px-3.5 py-2 border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none text-xs transition-colors duration-200 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-colors duration-200 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
