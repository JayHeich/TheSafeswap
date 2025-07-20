// src/FestasPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import festasJson from './festas.json';

export default function FestasPage() {
  const [festas, setFestas] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarFiltroPreco, setMostrarFiltroPreco] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [filtroPrecoModificado, setFiltroPrecoModificado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Adicionar propriedades de preço mínimo e máximo para cada festa
    const festasComPrecos = festasJson.map(festa => {
      const precos = Object.values(festa.categorias || {});
      return {
        ...festa,
        preco_min: precos.length > 0 ? Math.min(...precos) : 0,
        preco_max: precos.length > 0 ? Math.max(...precos) : 0
      };
    });

    const ordenadas = [...festasComPrecos].sort(
      (a, b) => new Date(a.data) - new Date(b.data)
    );
    
    // Encontrar o maior preço disponível entre todos os ingressos
    const maiorPreco = ordenadas.reduce((max, festa) => {
      return Math.max(max, festa.preco_max || 0);
    }, 0);
    
    setMaxPrice(maiorPreco);
    setPriceRange([0, maiorPreco]); // Inicializar com o range completo
    setFestas(ordenadas);
  }, []);

  const festasFiltradas = festas
    .filter((f) =>
      dataSelecionada ? f.data === dataSelecionada.toISOString().split('T')[0] : true
    )
    .filter((f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((f) => {
      // Se o filtro não foi modificado, não aplicar filtro de preço
      if (!filtroPrecoModificado) {
        return true;
      }
      return f.preco_min <= priceRange[1] && f.preco_max >= priceRange[0];
    });

  const displayDate = (iso) => {
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  };
  
  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    const newValue = parseInt(e.target.value);
    
    // Garantir que o preço mínimo não seja maior que o preço máximo
    // E que o preço máximo não seja menor que o preço mínimo
    if (index === 0) { // Preço mínimo
      newRange[index] = Math.min(newValue, priceRange[1]);
    } else { // Preço máximo
      newRange[index] = Math.max(newValue, priceRange[0]);
    }
    
    setPriceRange(newRange);
    setFiltroPrecoModificado(true); // Marcar que o usuário mexeu no filtro
  };
  
  const limparFiltros = () => {
    setDataSelecionada(null);
    setPriceRange([0, maxPrice]);
    setSearchTerm('');
    setFiltroPrecoModificado(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white p-6 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="flex items-center space-x-4 mb-4 md:mb-0">
          <span
            className="text-3xl cursor-pointer hover:text-teal-300"
            onClick={() => navigate('/')}
          >
            ←
          </span>
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
            Festas Disponíveis
          </span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="🔍 Pesquisar festa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-white bg-opacity-10 placeholder-gray-400 text-white px-4 py-2 rounded-full focus:outline-none"
          />
          <div className="flex gap-2">
            <button 
              onClick={() => setMostrarFiltroPreco(!mostrarFiltroPreco)} 
              className="bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-2 rounded-full text-sm transition flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filtro de Preço
            </button>
            
            {(dataSelecionada || filtroPrecoModificado || searchTerm) && (
              <button 
                onClick={limparFiltros}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-full text-sm flex items-center gap-1 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpar
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar com Calendário e Filtros */}
        <div className="lg:col-span-1">  
          {/* Calendário */}
          <div className="p-4 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">📅 Calendário</h2>
              <button
                onClick={() => setMostrarCalendario(!mostrarCalendario)}
                className="text-sm text-teal-400 hover:text-teal-300"
              >
                {mostrarCalendario ? 'Esconder' : 'Mostrar'}
              </button>
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${mostrarCalendario ? 'max-h-[26rem] opacity-100' : 'max-h-0 opacity-0'}`}>
              <Calendar
                onChange={setDataSelecionada}
                value={dataSelecionada}
                className="text-gray-200"
                nextLabel={<span className="calendar-nav">›</span>}
                prevLabel={<span className="calendar-nav">‹</span>}
                tileClassName={({ date, view }) =>
                  view === 'month' && festas.some(f => f.data === date.toISOString().split('T')[0])
                    ? 'event-day'
                    : undefined
                }
                formatMonthYear={(locale, date) => (
                  <span className="text-teal-400 font-semibold">
                    {date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                )}
              />
            </div>
            
            {dataSelecionada && (
              <button
                onClick={() => setDataSelecionada(null)}
                className="mt-3 text-sm underline text-teal-400"
              >
                Ver todas as festas
              </button>
            )}
          </div>
          
          {/* Filtro de preço */}
          <div className="p-4 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filtro de Preço</h2>
              <button
                onClick={() => setMostrarFiltroPreco(!mostrarFiltroPreco)}
                className="text-sm text-teal-400 hover:text-teal-300"
              >
                {mostrarFiltroPreco ? 'Esconder' : 'Mostrar'}
              </button>
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${mostrarFiltroPreco ? 'max-h-[20rem] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Preço Mínimo:</span>
                  <span className="text-teal-400 font-medium">R$ {priceRange[0]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={maxPrice} 
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Preço Máximo:</span>
                  <span className="text-teal-400 font-medium">R$ {priceRange[1]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={maxPrice} 
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="mt-4 p-3 bg-[#0f172a]/60 rounded-xl text-sm">
                <p className="text-center text-gray-300">Mostrando eventos com preços entre:</p>
                <p className="text-center text-teal-400 font-bold mt-1">R$ {priceRange[0]} e R$ {priceRange[1]}</p>
              </div>
            </div>
          </div>
          
          {/* Status de filtros - visível apenas em desktop */}
          <div className="hidden lg:block p-4 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Filtros Ativos</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Data:</span>
                <span className="text-white">{dataSelecionada ? dataSelecionada.toLocaleDateString() : 'Todas'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Preço:</span>
                <span className="text-white">{filtroPrecoModificado ? `R$ ${priceRange[0]} - R$ ${priceRange[1]}` : 'Todos'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Busca:</span>
                <span className="text-white">{searchTerm || 'Nenhuma'}</span>
              </div>
              
              <div className="pt-3 border-t border-white border-opacity-10">
                <div className="flex justify-between">
                  <span className="text-gray-300">Eventos Encontrados:</span>
                  <span className="text-teal-400 font-bold">{festasFiltradas.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Festas Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {festasFiltradas.length === 0 ? (
            <div className="text-center text-gray-400 col-span-full pt-10 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-semibold mb-2">Nenhuma festa encontrada</p>
              <p className="text-gray-400 mb-4">Tente ajustar seus filtros para ver mais resultados.</p>
              <button 
                onClick={limparFiltros}
                className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 px-4 py-2 rounded-full text-sm transition"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            festasFiltradas.map((f) => (
              <div
                key={f.nome}
                className="bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
              >
                {f.imagem && (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                    <img
                      src={f.imagem}
                      alt={f.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
                    {f.nome}
                  </h3>
                  <span className="text-sm inline-block bg-teal-600/30 text-teal-300 px-3 py-1 rounded-full">
                    {displayDate(f.data)}
                  </span>
                  {f.descricao && (
                    <p className="text-gray-200 text-sm line-clamp-3">
                      {f.descricao}
                    </p>
                  )}
                  <button
                    onClick={() => navigate('/evento', { state: { festa: f } })}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-gray-900 font-bold rounded-full hover:opacity-90 transition"
                  >
                    🎫 Ver Detalhes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notificação de resultados filtrados */}
      {(dataSelecionada || filtroPrecoModificado || searchTerm) && festasFiltradas.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2">
          <span className="text-sm font-medium">Exibindo {festasFiltradas.length} evento{festasFiltradas.length !== 1 ? 's' : ''}</span>
          <button 
            onClick={limparFiltros}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition"
          >
            Limpar
          </button>
        </div>
      )}

      {/* Calendar Custom Styles */}
      <style jsx>{`
  /* Calendar Container Animations */
  .calendar-container {
    position: relative;
    overflow: hidden;
  }
  
  .calendar-container::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(45, 212, 191, 0.1) 0%, transparent 70%);
    animation: pulse 6s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.5; }
  }
  
  /* Calendar Wrapper */
  .calendar-wrapper {
    background: rgba(15, 23, 42, 0.6);
    border-radius: 1.5rem;
    padding: 1rem;
    border: 1px solid rgba(45, 212, 191, 0.2);
    box-shadow: 
      0 0 20px rgba(45, 212, 191, 0.1),
      inset 0 0 20px rgba(15, 23, 42, 0.5);
  }
  
  /* React Calendar Overrides */
  .react-calendar {
    width: 100%;
    background: transparent;
    border: none;
    font-family: inherit;
    color: #e2e8f0;
  }
  
  /* Navigation */
  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
  
  .react-calendar__navigation button {
    background: transparent;
    border: none;
    color: #e2e8f0;
    font-size: 1rem;
    padding: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background: transparent;
  }
  
  .react-calendar__navigation button:disabled {
    color: #475569;
  }
  
  /* Month Year Label */
  .react-calendar__navigation__label__labelText {
    font-size: 1.125rem;
    font-weight: 600;
    background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: capitalize;
  }
  
  /* Navigation Buttons */
  .react-calendar__navigation__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, rgba(45, 212, 191, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%);
    color: #2dd4bf;
    font-size: 1.5rem;
    font-weight: 300;
    transition: all 0.3s ease;
    border: 1px solid rgba(45, 212, 191, 0.3);
  }
  
  .react-calendar__navigation__arrow:hover {
    background: linear-gradient(135deg, rgba(45, 212, 191, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%);
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(45, 212, 191, 0.4);
  }
  
  /* Weekdays */
  .react-calendar__month-view__weekdays {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    border-bottom: 1px solid rgba(45, 212, 191, 0.1);
    padding-bottom: 0.75rem;
    margin-bottom: 0.5rem;
  }
  
  .react-calendar__month-view__weekdays__weekday {
    text-align: center;
    padding: 0.25rem;
  }
  
  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }
  
  /* Days Grid */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
  }
  
  /* Tiles */
  .react-calendar__tile {
    aspect-ratio: 1;
    background: rgba(30, 41, 59, 0.3);
    border: 1px solid transparent;
    border-radius: 0.75rem;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .react-calendar__tile:enabled:hover {
    background: rgba(45, 212, 191, 0.15);
    border-color: rgba(45, 212, 191, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45, 212, 191, 0.2);
  }
  
  .react-calendar__tile:enabled:focus {
    background: rgba(45, 212, 191, 0.2);
    border-color: rgba(45, 212, 191, 0.4);
    outline: none;
  }
  
  /* Today */
  .react-calendar__tile--now {
    background: rgba(99, 102, 241, 0.15) !important;
    border-color: rgba(99, 102, 241, 0.4) !important;
    color: #a5b4fc !important;
    font-weight: 600 !important;
  }
  
  .react-calendar__tile--now::before {
    content: '';
    position: absolute;
    top: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
    background: #6366f1;
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(99, 102, 241, 0.6);
  }
  
  /* Active/Selected Date */
  .react-calendar__tile--active {
    background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%) !important;
    color: #0f172a !important;
    font-weight: 600 !important;
    border-color: transparent !important;
    box-shadow: 
      0 0 20px rgba(45, 212, 191, 0.4),
      inset 0 0 10px rgba(255, 255, 255, 0.2);
  }
  
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%) !important;
    transform: scale(1.05);
  }
  
  /* Event Day */
  .event-day {
    background: rgba(45, 212, 191, 0.1) !important;
    border-color: rgba(45, 212, 191, 0.2) !important;
  }
  
  .event-day::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%);
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(45, 212, 191, 0.6);
    animation: eventPulse 2s ease-in-out infinite;
  }
  
  @keyframes eventPulse {
    0%, 100% { 
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
    50% { 
      transform: translateX(-50%) scale(1.2);
      opacity: 0.8;
    }
  }
  
  /* Neighboring Month Days */
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #475569 !important;
    opacity: 0.5;
  }
  
  /* Weekend Days */
  .react-calendar__month-view__days__day--weekend {
    color: #fbbf24;
  }
  
  /* Enhanced Price Range Sliders */
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%);
    cursor: pointer;
    border: 3px solid #0f172a;
    box-shadow: 
      0 0 10px rgba(45, 212, 191, 0.4),
      0 2px 5px rgba(0,0,0,0.3);
    transition: all 0.2s ease;
  }
  
  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 
      0 0 20px rgba(45, 212, 191, 0.6),
      0 2px 8px rgba(0,0,0,0.4);
  }
  
  input[type=range]::-moz-range-thumb {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%);
    cursor: pointer;
    border: 3px solid #0f172a;
    box-shadow: 
      0 0 10px rgba(45, 212, 191, 0.4),
      0 2px 5px rgba(0,0,0,0.3);
    transition: all 0.2s ease;
  }
  
  input[type=range]::-moz-range-thumb:hover {
    transform: scale(1.15);
    box-shadow: 
      0 0 20px rgba(45, 212, 191, 0.6),
      0 2px 8px rgba(0,0,0,0.4);
  }
  
  input[type=range] {
    -webkit-appearance: none;
    height: 10px;
    border-radius: 5px;
    background: #334155;
    outline: none;
    padding: 0;
    margin: 0;
    position: relative;
  }
  
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    border-radius: 5px;
    background: inherit;
  }
  
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    border-radius: 5px;
    background: inherit;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 640px) {
    .react-calendar__tile {
      font-size: 0.75rem;
    }
    
    .react-calendar__navigation__label__labelText {
      font-size: 1rem;
    }
    
    .react-calendar__navigation__arrow {
      width: 2rem;
      height: 2rem;
      font-size: 1.25rem;
    }
  }
`}</style>
    </div>
  );
}