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
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const ordenadas = [...festasJson].sort(
      (a, b) => new Date(a.data) - new Date(b.data)
    );
    setFestas(ordenadas);
  }, []);

  const festasFiltradas = festas
    .filter((f) =>
      dataSelecionada ? f.data === dataSelecionada.toISOString().split('T')[0] : true
    )
    .filter((f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const displayDate = (iso) => {
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="flex items-center space-x-4 mb-4 md:mb-0">
          <span
            className="text-3xl cursor-pointer hover:text-indigo-300"
            onClick={() => navigate('/')}
          >
            ←
          </span>
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-300">
            Festas Disponíveis
          </span>
        </h1>
        <input
          type="text"
          placeholder="🔍 Pesquisar festa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 bg-white bg-opacity-10 placeholder-gray-400 text-white px-4 py-2 rounded-full focus:outline-none"
        />
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Section */}
        <div className={`lg:col-span-1 ${!mostrarCalendario && 'hidden lg:block'}`}>  
          <div className="p-4 bg-white bg-opacity-5 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Calendário de festas</h2>
              <button
                onClick={() => setMostrarCalendario(!mostrarCalendario)}
                className="text-sm text-indigo-300 hover:text-indigo-100"
              >
                {mostrarCalendario ? 'Esconder' : 'Mostrar'}
              </button>
            </div>
            {mostrarCalendario && (
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
                  <span className="text-indigo-300 font-semibold">
                    {date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                )}
              />
            )}
            {dataSelecionada && (
              <button
                onClick={() => setDataSelecionada(null)}
                className="mt-3 text-sm underline text-indigo-300"
              >
                Ver todas as festas
              </button>
            )}
          </div>
        </div>

        {/* Festas Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {festasFiltradas.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full pt-10">
              Nenhuma festa encontrada.
            </p>
          ) : (
            festasFiltradas.map((f) => (
              <div
                key={f.nome}
                className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
              >
                {f.imagem && (
                  <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                    <img
                      src={f.imagem}
                      alt={f.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-teal-200">
                    {f.nome}
                  </h3>
                  <span className="text-sm inline-block bg-indigo-600 bg-opacity-30 text-indigo-200 px-3 py-1 rounded-full">
                    {displayDate(f.data)}
                  </span>
                  {f.descricao && (
                    <p className="text-gray-200 text-sm line-clamp-3">
                      {f.descricao}
                    </p>
                  )}
                  <button
                    onClick={() => navigate('/evento', { state: { festa: f } })}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-indigo-400 to-teal-300 text-gray-900 font-bold rounded-full hover:opacity-90 transition"
                  >
                    🎫 Ver Detalhes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Calendar Custom Styles */}
      <style jsx>{`
        .react-calendar {
          background: transparent;
          border: none;
          font-family: inherit;
        }
        .react-calendar__navigation {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .calendar-nav {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
          border-radius: 9999px;
          background: rgba(61, 218, 215, 0.2);
          color: #0f172a;
          cursor: pointer;
          font-size: 1.25rem;
        }
        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #94a3b8;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 0.5rem;
        }
        .react-calendar__tile {
          padding: 0.5rem 0;
          border-radius: 0.5rem;
        }
        .react-calendar__tile:hover {
          background: rgba(61, 218, 215, 0.1);
        }
        .react-calendar__tile--now {
          border: 2px solid #3ddad7 !important;
          background: transparent !important;
          color: #3ddad7 !important;
        }
        .react-calendar__tile--active {
          background: #3ddad7 !important;
          color: #0f172a !important;
        }
        .event-day {
          position: relative;
        }
        .event-day::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #3ddad7;
          border-radius: 50%;
        }
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
