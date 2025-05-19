// src/FestaDetailPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FestaDetailPage() {
  const navigate = useNavigate();
  const { state: { festa } = {} } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isDressCodeOpen, setIsDressCodeOpen] = useState(false);
  const [isLineUpOpen, setIsLineUpOpen] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100);
    window.scrollTo(0, 0);
  }, []);

  if (!festa) {
    navigate('/', { replace: true });
    return null;
  }

  const displayDate = (iso) => {
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  };

  // Create Google Maps URL with custom styling for a cleaner look
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(festa.endereco)}&z=15&output=embed`;

  // Verificar se existem informações de line-up e dress code
  const hasLineUp = festa.lineup && festa.lineup.length > 0;
  const hasDressCode = festa.dressCode && festa.dressCode.length > 0;

  // Para debug
  console.log("Festa lineup recebido:", festa.lineup);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white font-sans">
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-32 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-lg text-gray-300 hover:text-teal-300 mb-8 transition-all duration-300"
        >
          <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span className="ml-2">Voltar</span>
        </button>

        {/* Card principal do evento */}
        <div className="bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl mb-8 border border-[#334155]/30">
          {/* Imagem + Badges */}
          {festa.imagem && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60 z-10"></div>
              <img
                src={festa.imagem}
                alt={festa.nome}
                className="w-full h-96 sm:h-[28rem] object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="flex flex-wrap gap-3">
                  <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2 border border-white/10">
                    <span className="text-teal-400">📅</span>
                    <span className="font-medium">{displayDate(festa.data)}</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2 border border-white/10">
                    <span className="text-teal-400">📍</span>
                    <span className="font-medium">{festa.local}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="p-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 mb-8">
              {festa.nome}
            </h1>
            
            {/* Descrição */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-teal-400 mb-4 flex items-center">
                <div className="h-5 w-1 bg-teal-400 rounded-full mr-3"></div>
                Sobre o Evento
              </h2>
              <div className="bg-[#0f172a]/60 rounded-xl p-6 border border-[#334155]/20">
                <p className="text-gray-200 leading-relaxed">{festa.descricao}</p>
              </div>
            </div>

            {/* Localização */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-teal-400 mb-4 flex items-center">
                <div className="h-5 w-1 bg-teal-400 rounded-full mr-3"></div>
                Localização
              </h2>
              
              {/* Endereço */}
              <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-[#334155]/20 flex items-center mb-4">
                <div className="bg-teal-500/10 rounded-full p-2 mr-3">
                  <span className="text-teal-400 text-lg">📌</span>
                </div>
                <div className="font-medium text-gray-300">
                  {festa.endereco}
                </div>
              </div>
              
              {/* Mapa */}
              <div className="relative overflow-hidden rounded-xl border border-[#334155]/20 shadow-lg transition-all duration-300 transform hover:shadow-teal-400/10">
                {/* Overlay de carregamento */}
                <div className={`absolute inset-0 bg-[#0f172a]/70 backdrop-blur-sm flex items-center justify-center z-20 transition-opacity duration-500 ${isMapLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <div className="w-8 h-8 border-3 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                {/* Container do mapa */}
                <div className="w-full h-56 sm:h-64 overflow-hidden">
                  <iframe
                    title="Localização do evento"
                    src={mapSrc}
                    className="w-full h-full bg-[#0f172a]"
                    allowFullScreen
                    loading="lazy"
                    onLoad={() => setIsMapLoaded(true)}
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                
                {/* Botão para abrir no Google Maps */}
                <a 
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(festa.endereco)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 z-30 bg-black/70 backdrop-blur-sm hover:bg-teal-500/20 text-white text-sm px-3 py-1.5 rounded-full transition-all duration-300 flex items-center space-x-1 border border-white/10"
                >
                  <span>Abrir no Maps</span>
                  <span className="text-xs ml-1">↗</span>
                </a>
              </div>
            </div>
            
            {/* Ingressos */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-teal-400 mb-4 flex items-center">
                <div className="h-5 w-1 bg-teal-400 rounded-full mr-3"></div>
                Categorias de Ingressos
              </h2>
              <div className="space-y-3">
                {Object.entries(festa.categorias).map(([cat, preco], idx) => (
                  <div
                    key={cat}
                    className="bg-gradient-to-r from-[#1e293b]/40 to-[#0f172a]/40 rounded-xl p-4 border border-[#334155]/20 transition-all duration-300 hover:border-teal-500/30"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-teal-400 text-lg mr-3">🎟️</span>
                        <span className="text-lg">{cat}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-lg bg-teal-400/20 px-4 py-1 rounded-lg">
                          R$ {preco}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Line-Up - seção colapsável */}
            <div className="mb-8">
              <button 
                className="w-full flex justify-between items-center bg-gradient-to-r from-[#1e293b]/60 to-[#0f172a]/60 rounded-xl p-4 border border-[#334155]/30 transition-all duration-300 hover:border-teal-500/30"
                onClick={() => setIsLineUpOpen(!isLineUpOpen)}
              >
                <div className="flex items-center">
                  <div className="bg-teal-500/10 rounded-full p-2 mr-3">
                    <span className="text-teal-400 text-lg">🎵</span>
                  </div>
                  <h2 className="text-xl font-semibold">Line-Up</h2>
                </div>
                <div className={`transition-transform duration-300 ${isLineUpOpen ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </button>
              
              {/* Conteúdo Colapsável do Line-Up */}
              <div className={`overflow-hidden transition-all duration-500 ${isLineUpOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[#0f172a]/60 rounded-xl p-6 border border-[#334155]/20">
                  {hasLineUp ? (
                    <>
                      <p className="text-gray-200 leading-relaxed mb-6">
                        Confira as atrações confirmadas para este evento:
                      </p>
                      
                      <div className="space-y-3">                  
                        {/* Atrações do JSON */}
                        {festa.lineup.map((artista, index) => (
                          <div key={index} className="flex items-center bg-[#1e293b]/40 p-4 rounded-xl border border-[#334155]/20 hover:border-teal-500/20 transition-all duration-300">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-white">{artista.nome}</h3>
                              <div className="flex items-center text-gray-400 mt-1">
                                <span className="text-teal-400 mr-2">⏰</span>
                                <span>{artista.horario}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="text-teal-400 text-4xl mb-4">🎵</div>
                      <p className="text-gray-300 text-center text-lg">Informações indisponíveis</p>
                      <p className="text-gray-400 text-center mt-2">O line-up deste evento ainda não foi divulgado.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Dress Code - seção colapsável */}
            <div className="mb-8">
              <button 
                className="w-full flex justify-between items-center bg-gradient-to-r from-[#1e293b]/60 to-[#0f172a]/60 rounded-xl p-4 border border-[#334155]/30 transition-all duration-300 hover:border-teal-500/30"
                onClick={() => setIsDressCodeOpen(!isDressCodeOpen)}
              >
                <div className="flex items-center">
                  <div className="bg-teal-500/10 rounded-full p-2 mr-3">
                    <span className="text-teal-400 text-lg">👗</span>
                  </div>
                  <h2 className="text-xl font-semibold">Dress Code</h2>
                </div>
                <div className={`transition-transform duration-300 ${isDressCodeOpen ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </button>
              
              {/* Conteúdo Colapsável */}
              <div className={`overflow-hidden transition-all duration-500 ${isDressCodeOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[#0f172a]/60 rounded-xl p-6 border border-[#334155]/20">
                  {hasDressCode ? (
                    <>
                      <p className="text-gray-200 leading-relaxed mb-6">
                        Sugerimos trajes elegantes para aproveitar ao máximo a experiência do evento.
                        Confira algumas inspirações para o seu look:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {festa.dressCode.map((item, index) => (
                          <div key={index} className="bg-[#1e293b]/40 rounded-xl overflow-hidden border border-[#334155]/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-400/5">
                            <img 
                              src={item.src} 
                              alt={item.desc} 
                              className="w-full h-48 object-cover" 
                            />
                            <div className="p-3 text-center">
                              <p className="text-gray-300">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="text-teal-400 text-4xl mb-4">👗</div>
                      <p className="text-gray-300 text-center text-lg">Informações indisponíveis</p>
                      <p className="text-gray-400 text-center mt-2">O dress code deste evento ainda não foi divulgado.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de compra fixo */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-[#0f172a]/90 backdrop-blur-md border-t border-[#334155]/50 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/checkout', { state: { festa } })}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-teal-400/30 hover:-translate-y-1 flex items-center justify-center"
          >
            <span className="mr-2">🎫</span> Comprar Ingresso
          </button>
        </div>
      </div>

      {/* Decoração de fundo */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-[-10%] w-80 h-80 bg-teal-400 rounded-full filter blur-[100px] opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-cyan-500 rounded-full filter blur-[100px] opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Estilos adicionais */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.15; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }
      `}</style>
    </div>
  );
}