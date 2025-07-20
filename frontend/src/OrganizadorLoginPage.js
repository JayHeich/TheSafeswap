import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import festasJson from './festas.json';

export default function OrganizadorLoginPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [codigoFesta, setCodigoFesta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase(); // Converter para maiúsculo
    setCodigoFesta(value);
    // Limpar erro quando o usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validação básica
    if (!codigoFesta) {
      setError('Por favor, insira o código da festa');
      setIsLoading(false);
      return;
    }

    // Validação de formato (exemplo: mínimo de 4 caracteres)
    if (codigoFesta.length < 4) {
      setError('Código deve ter pelo menos 4 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      // Simular delay de verificação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar a festa pelo código no festas.json
      const festaEncontrada = festasJson.find(festa => 
        festa.codigoOrganizador === codigoFesta
      );

      if (festaEncontrada) {
        console.log('Login bem-sucedido para:', festaEncontrada.nome);
        
        // Salvar dados da sessão no localStorage
        localStorage.setItem('organizador_logado', JSON.stringify({
          festa: festaEncontrada,
          timestamp: new Date().getTime()
        }));
        
        // 🎯 CORREÇÃO: Redirecionar para validação de QR codes usando o ID da festa
        navigate(`/organizador/validar/${festaEncontrada.id}`, {
          state: { festa: festaEncontrada }
        });
      } else {
        setError('Código da festa inválido. Verifique e tente novamente.');
      }
      
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro ao validar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para preencher código automaticamente (apenas para demonstração)
  const preencherCodigo = (codigo) => {
    setCodigoFesta(codigo);
    setError('');
  };

  // Extrair códigos válidos do JSON para exibir como exemplo
  const codigosValidos = festasJson.map(festa => festa.codigoOrganizador);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white flex flex-col relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-96 h-96 rounded-full bg-teal-400 opacity-5 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 rounded-full bg-cyan-500 opacity-5 blur-[100px]"></div>
        <div className="absolute bottom-[30%] left-[20%] w-72 h-72 rounded-full bg-emerald-600 opacity-3 blur-[80px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 md:px-12 lg:px-16 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group"
        >
          <img
            src="/logo.png.jpg"
            alt="Safeswap Logo"
            className="h-10 w-10 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
            Safeswap
          </span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white transition-colors flex items-center group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Voltar ao início</span>
        </button>
      </header>

      {/* Conteúdo principal */}
      <div className={`flex-grow flex items-center justify-center px-6 md:px-12 py-12 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="w-full max-w-md">
          {/* Card principal */}
          <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-2xl border border-[#3ddad7]/10 shadow-xl p-8">
            {/* Ícone e título */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                  Área do Organizador
                </span>
              </h1>
              <p className="text-gray-300">Insira o código da sua festa para acessar o painel</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo do Código da Festa */}
              <div>
                <label htmlFor="codigoFesta" className="block text-sm font-medium text-gray-300 mb-2">
                  Código da Festa
                </label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2m8 0V7a2 2 0 00-2-2M9 7a2 2 0 012-2m0 0V3a1 1 0 011-1h4a1 1 0 011 1v2m-6 0h6" />
                  </svg>
                  <input
                    type="text"
                    id="codigoFesta"
                    name="codigoFesta"
                    value={codigoFesta}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-4 bg-[#0f172a]/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white placeholder-gray-400 transition-all duration-300 text-center text-lg font-mono tracking-wider"
                    placeholder="Ex: SARALINA2025"
                    required
                    autoComplete="off"
                    maxLength="20"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Digite o código fornecido pela equipe Safeswap
                </p>
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              {/* Botão de acesso */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg shadow-md flex items-center justify-center text-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validando código...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Acessar Validador de QR
                  </>
                )}
              </button>
            </form>

            {/* Códigos de exemplo para teste */}
            <div className="mt-6 p-4 bg-[#0f172a]/60 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 text-center mb-3">💡 Códigos disponíveis para teste:</p>
              <div className="grid grid-cols-2 gap-2">
                {festasJson.map((festa) => (
                  <button
                    key={festa.codigoOrganizador}
                    type="button"
                    onClick={() => preencherCodigo(festa.codigoOrganizador)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-2 rounded transition-colors text-center"
                    title={`Festa: ${festa.nome}`}
                  >
                    <div className="font-mono">{festa.codigoOrganizador}</div>
                    <div className="text-xs text-gray-400 mt-1">{festa.nome}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Clique em um código para preencher automaticamente
              </p>
            </div>
          </div>

          {/* Informações de contato */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Não tem o código? Entre em contato conosco
            </p>
            <div className="flex justify-center space-x-6">
              <a 
                href="mailto:organizadores@safeswapbr.com" 
                className="text-teal-400 hover:text-teal-300 text-sm transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                E-mail
              </a>
              <a 
                href="https://wa.me/5511933478389" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 text-sm transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-xs text-gray-500 text-center py-4">
        © {new Date().getFullYear()} Safeswap. Todos os direitos reservados.
      </footer>
    </div>
  );
}