// src/FestaDetailPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FestaDetailPage() {
  const navigate = useNavigate();
  const { state: { festa } = {} } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white font-sans px-4 sm:px-8 py-12 pb-24">
      <div className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-lg text-gray-300 hover:text-teal-300 mb-8 transition-all duration-300"
        >
          <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span className="ml-2">Voltar</span>
        </button>

        {/* Card do Evento */}
        <div className="bg-[#1e293b]/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl mb-8">
          {/* Imagem + Badges */}
          {festa.imagem && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60 z-10"></div>
              <img
                src={festa.imagem}
                alt={festa.nome}
                className="w-full h-96 sm:h-[28rem] object-cover transition-transform duration-3000 hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4 z-20">
                <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <span className="text-teal-400">📅</span>
                  <span className="font-medium">{displayDate(festa.data)}</span>
                </div>
                <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <span className="text-teal-400">📍</span>
                  <span className="font-medium">{festa.local}</span>
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="p-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 mb-6">
              {festa.nome}
            </h1>
            
            {/* Descrição */}
            <div className="bg-[#0f172a]/60 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-teal-400 mb-3">Sobre o Evento</h2>
              <p className="text-gray-200 leading-relaxed">{festa.descricao}</p>
            </div>
            
            {/* Mapa com design limpo e profissional */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-teal-400 flex items-center mb-4">
                <span className="mr-2">🗺️</span> Localização
              </h2>
              
              {/* Card com endereço estilizado */}
              <div className="bg-gradient-to-r from-[#1e293b]/40 to-[#0f172a]/60 backdrop-blur-sm p-4 rounded-t-xl border-t border-l border-r border-[#1e293b]/50 flex items-center space-x-3">
                <div className="bg-teal-500/10 rounded-full p-2 flex-shrink-0">
                  <span className="text-teal-400 text-lg">📌</span>
                </div>
                <div className="font-medium text-gray-300 tracking-wide">
                  {festa.endereco}
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-b-xl border border-[#1e293b] shadow-md shadow-black/20 transition-all duration-300 transform hover:shadow-teal-400/10 hover:scale-[1.005]">
                {/* Overlay de carregamento */}
                <div className={`absolute inset-0 bg-[#0f172a] bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-20 transition-opacity duration-500 ${isMapLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <div className="animate-pulse text-teal-400">Carregando mapa...</div>
                </div>
                
                {/* Container do mapa com altura intermediária */}
                <div className="w-full h-52 sm:h-56 md:h-60 overflow-hidden">
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
                  className="absolute bottom-3 right-3 z-30 bg-black bg-opacity-70 backdrop-blur-sm hover:bg-opacity-90 text-white text-xs px-3 py-1.5 rounded-full transition-all duration-300 flex items-center space-x-1 hover:bg-teal-900"
                >
                  <span>Abrir no Maps</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-teal-400">
                <span className="mr-2">🎟️</span> Categorias de Ingressos
              </h2>
              <div className="bg-[#0f172a]/60 rounded-xl p-2">
                {Object.entries(festa.categorias).map(([cat, preco], idx) => (
                  <div
                    key={cat}
                    className={`flex justify-between items-center p-4 rounded-lg ${
                      idx % 2 === 0 ? 'bg-[#1e293b]/50' : ''
                    }`}
                  >
                    <span className="text-lg">{cat}</span>
                    <span className="font-bold text-lg bg-teal-400/30 px-4 py-1 rounded-lg">
                      R$ {preco}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de compra fixo */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-[#0f172a]/80 backdrop-blur-md border-t border-[#1e293b]/50 shadow-xl transition-all duration-300">
        <div className="max-w-screen-xl mx-auto">
          <button
            onClick={() => navigate('/checkout', { state: { festa } })}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-gray-900 font-bold text-lg rounded-xl shadow-xl transition-all duration-300 hover:shadow-teal-400/30 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center"
          >
            <span className="mr-2">🎫</span> Comprar Ingresso
          </button>
        </div>
      </div>

      {/* Decoração de fundo */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-[-10%] w-80 h-80 bg-teal-400 rounded-full filter blur-[100px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-cyan-500 rounded-full filter blur-[100px] opacity-10"></div>
      </div>
    </div>
  );
}