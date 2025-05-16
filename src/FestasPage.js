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

  const dateToStr = (date) => date.toISOString().split('T')[0];

  useEffect(() => {
    const ordenadas = [...festasJson].sort(
      (a, b) => new Date(a.data) - new Date(b.data)
    );
    setFestas(ordenadas);
  }, []);

  const handleDateChange = (date) => {
    setDataSelecionada(date);
  };

  const festasFiltradas = festas
    .filter((f) =>
      dataSelecionada ? f.data === dateToStr(dataSelecionada) : true
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
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="flex items-center space-x-4 mb-4 md:mb-0">
          <span
            className="text-3xl cursor-pointer hover:underline"
            onClick={() => navigate('/')}
          >
            ←
          </span>
          <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-300">
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

      {/* Main layout: Calendar + Festas */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Section */}
        <div className={`lg:col-span-1 ${!mostrarCalendario && 'hidden lg:block'}`}>  
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Calendário de festas</h2>
              <button
                onClick={() => setMostrarCalendario(!mostrarCalendario)}
                className="text-sm underline"
              >
                {mostrarCalendario ? 'Esconder' : 'Mostrar'}
              </button>
            </div>
            {mostrarCalendario && (
              <Calendar
                onChange={handleDateChange}
                value={dataSelecionada}
                className="react-calendar-clean"
                tileClassName={({ date }) =>
                  festas.some(f => f.data === dateToStr(date))
                    ? 'highlight-date'
                    : null
                }
              />
            )}
            {dataSelecionada && (
              <button
                onClick={() => setDataSelecionada(null)}
                className="mt-3 text-sm underline"
              >
                Ver todas as festas
              </button>
            )}
          </div>
        </div>

        {/* Festas Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {festasFiltradas.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full pt-10">Nenhuma festa encontrada.</p>
          ) : (
            festasFiltradas.map((f) => (
              <div
                key={f.nome}
                className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition cursor-pointer"
                onClick={() => navigate('/checkout', { state: { festa: f } })}
              >
                {f.imagem && (
                  <div className="h-48 w-full">
                    <img
                      src={f.imagem}
                      alt={f.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-teal-200">
                    {f.nome}
                  </h3>
                  <span className="text-sm bg-gradient-to-r from-[#3ddad7] to-[#58e6dc] text-[#0f172a] px-3 py-1 rounded-full font-bold">
                    {displayDate(f.data)}
                  </span>
                  {f.descricao && (
                    <p className="text-gray-200 text-sm line-clamp-3">
                      {f.descricao}
                    </p>
                  )}
                  <button
                    className="w-full mt-4 bg-gradient-to-r from-indigo-400 to-teal-300 text-[#0f172a] font-bold py-2 rounded-full"
                  >
                    🎫 Comprar Ingresso
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .react-calendar-clean {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 1rem;
          padding: 0;
        }
        .react-calendar-clean .react-calendar__tile {
          padding: 0.75rem 0;
          border-radius: 0.5rem;
          transition: background 0.2s ease;
        }
        .react-calendar-clean .react-calendar__tile--now {
          background: rgba(61, 218, 215, 0.2);
        }
        .react-calendar-clean .react-calendar__tile--active {
          background: #3ddad7 !important;
          color: #0f172a !important;
        }
        .highlight-date {
          background-color: #3ddad7 !important;
          color: #0f172a !important;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
