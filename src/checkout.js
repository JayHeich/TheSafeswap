import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const festa = state?.festa;

  if (!festa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-teal-400">Nenhuma festa selecionada</h2>
          <p className="text-gray-300 mb-6">Por favor, retorne à página anterior e selecione uma festa para comprar ingressos.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="w-full py-3 bg-teal-500 text-white font-medium rounded-md transition-all hover:bg-teal-400 focus:ring-2 focus:ring-teal-300 focus:ring-opacity-50 flex justify-center items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Voltar para seleção
          </button>
        </div>
      </div>
    );
  }

  const categorias = festa.categorias;
  const [quantidades, setQuantidades] = useState(
    Object.fromEntries(Object.keys(categorias).map(cat => [cat, 0]))
  );

  const handleQuantityChange = (cat, increment) => {
    const currentValue = quantidades[cat];
    const newValue = increment 
      ? Math.min(2, currentValue + 1) 
      : Math.max(0, currentValue - 1);
    setQuantidades(prev => ({ ...prev, [cat]: newValue }));
  };

  const subtotal = Object.entries(quantidades)
    .reduce((sum, [cat, qty]) => sum + qty * categorias[cat], 0);
  const taxa = subtotal * 0.05;
  const total = subtotal + taxa;

  const handleFinalize = () => {
    navigate('/confirmar', { state: { festaName: festa.nome, items: quantidades, total } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-white transition-colors flex items-center group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Voltar</span>
          </button>
          <span className="text-xs bg-teal-500 text-white px-3 py-1 rounded-full">Checkout</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{festa.nome}</h1>
          <p className="text-gray-400">Selecione seus ingressos</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-300 mb-4">Ingressos disponíveis</h2>

            <div className="space-y-6">
              {Object.entries(categorias).map(([cat, preco]) => (
                <div key={cat} className="flex justify-between items-center pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                  <div>
                    <h3 className="text-lg font-medium">{cat}</h3>
                    <p className="text-teal-400 font-bold">
                      R$ {preco.toFixed(2)} <span className="text-xs text-gray-400">+ taxa</span>
                    </p>
                  </div>

                  <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => handleQuantityChange(cat, false)}
                      className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>

                    <div className="w-10 flex items-center justify-center font-medium">
                      {quantidades[cat]}
                    </div>

                    <button 
                      onClick={() => handleQuantityChange(cat, true)}
                      className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-750 border-t border-gray-700 p-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-base text-gray-300">Subtotal</span>
              <span className="text-base font-semibold text-white">R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Taxa de processamento (5%)</span>
              <span className="text-sm font-medium text-white">R$ {taxa.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2">
              <span className="text-lg font-medium text-gray-300">Total</span>
              <span className="text-xl font-bold text-white">R$ {total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleFinalize}
              disabled={total === 0}
              className="w-full mt-4 py-4 bg-teal-500 text-white font-medium rounded-lg transition-all hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {total === 0 ? 'Selecione pelo menos um ingresso' : 'Finalizar Compra'}
              {total > 0 && (
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Ao finalizar a compra você concorda com nossos termos e condições
        </p>
      </div>
    </div>
  );
}
