// src/Pagamento.js
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const price = searchParams.get('valor');
  const paymentMethod = searchParams.get('metodo'); // Pega o método de pagamento da URL
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar se um método de pagamento foi recebido
    if (paymentMethod) {
      // Simulação de carregamento inicial
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [paymentMethod]);

  const formatPrice = (value) => {
    if (!value) return 'R$ 0,00';
    return parseFloat(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Se não tiver valor ou método de pagamento, exibe erro
  if (!price || !paymentMethod) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white font-sans flex flex-col">
        {/* Header */}
        <header className="w-full p-4 md:p-6 shadow-lg bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur-sm opacity-50"></div>
                <img src="/logo.png.jpg" alt="logo" className="h-10 w-10 rounded-xl relative z-10" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Safeswap
              </h1>
            </div>
            <p className="text-sm text-gray-400 font-medium hidden sm:block">Seguro e rápido</p>
          </div>
        </header>

        {/* Conteúdo de erro */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <div className="bg-red-500/20 p-6 rounded-2xl border border-red-500/30 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Link inválido</h2>
            <p className="text-gray-300 mb-4">Faltam informações necessárias na URL.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300 text-white py-2 px-4 rounded-lg"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-gray-500 text-sm mt-auto">
          <p>© 2025 Safeswap • Todos os direitos reservados</p>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white font-sans flex flex-col">
      {/* Header com logo no canto esquerdo */}
      <header className="w-full p-4 md:p-6 shadow-lg bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-sm opacity-50"></div>
              <img src="/logo.png.jpg" alt="logo" className="h-10 w-10 rounded-xl relative z-10" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Safeswap
            </h1>
          </div>
          <p className="text-sm text-gray-400 font-medium hidden sm:block">Seguro e rápido</p>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-4xl mx-auto w-full">
        <div className="w-full bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700">
          {/* Botão Voltar */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-gray-400 hover:text-teal-400 mb-6 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2 transform transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Voltar</span>
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Finalize sua compra</h1>
            <p className="text-gray-400">
              {paymentMethod === 'pix' ? 'Pague com PIX' : 'Pague com Cartão de Crédito'}
            </p>
          </div>

          {/* Sumário da compra */}
          <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Total a pagar</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {formatPrice(price)}
                </p>
              </div>
              <div className="bg-green-500/20 px-4 py-2 rounded-lg">
                <p className="text-green-400 font-medium">Operação segura</p>
              </div>
            </div>
          </div>

          {/* Opção de pagamento selecionada */}
          <div className="grid gap-6">
            {/* QR Code para Pix - Mostrado apenas se o método for pix */}
            {paymentMethod === 'pix' && (
              <div className="relative p-6 rounded-2xl transition-all duration-300 border-2 border-blue-500 bg-gray-800/70 shadow-lg shadow-blue-500/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-xl">Pix</h3>
                    <p className="text-gray-400 text-sm">Aprovação imediata</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-400 to-blue-500 h-10 w-10 rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 flex flex-col items-center">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-48 w-48">
                      <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-4 text-gray-600">Gerando QR Code...</p>
                    </div>
                  ) : (
                    <>
                      <img
                        src="/pix_qrcode.png"
                        alt="QR Code Pix"
                        className="w-48 h-48 object-contain mb-2"
                      />
                      <p className="text-gray-800 text-sm font-medium">Escaneie com seu app de banco</p>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                    Copiar código Pix
                  </button>
                </div>
              </div>
            )}

            {/* Pagamento por cartão - Mostrado apenas se o método for cartao */}
            {paymentMethod === 'cartao' && (
              <div className="relative p-6 rounded-2xl transition-all duration-300 border-2 border-blue-500 bg-gray-800/70 shadow-lg shadow-blue-500/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-xl">Cartão de Crédito</h3>
                    <p className="text-gray-400 text-sm">Parcele em até 12x</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-pink-500 h-10 w-10 rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                </div>

                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl text-gray-800">
                    <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-gray-600">Carregando gateway de pagamento...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center text-gray-800 h-64">
                    <div className="mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    </div>
                    
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 font-medium flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                      Pagar com cartão
                    </button>

                    <p className="mt-6 text-sm text-gray-500">Ambiente seguro e criptografado</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Informações de segurança */}
          <div className="mt-8 p-4 border border-gray-700 rounded-lg bg-gray-900/30">
            <div className="flex items-center gap-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-sm">Pagamento 100% seguro com criptografia avançada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-sm mt-auto">
        <p>© 2025 Safeswap • Todos os direitos reservados</p>
      </footer>
    </main>
  );
}