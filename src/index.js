// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './HomePage';
import RevendaPage from './RevendaPage';
import FestasPage from './FestasPage';
import FestaDetailPage from './FestasDetailPage';
import ConfirmPage from './ConfirmPage';
import Pagamento from './pagamento';
import Checkout from './checkout';
import DadosPage from './dados';
import AboutPage from './AboutPage';
import FAQPage from './FAQPage';
import TermsPrivacyPage from './TermsPrivacyPage'; // 🆕 NOVO: Importar página de termos
import OrganizadorLoginPage from './OrganizadorLoginPage';
import QRValidatorPage from './QRValidatorPage';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function Cancelado() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Operação cancelada</h1>
        <p className="text-gray-400">Você recusou a transação.</p>
      </div>
    </main>
  );
}

function Aguardando() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Aguardando pagamento do outro usuário
        </h1>
        <p className="text-gray-400">
          Você será notificado quando o pagamento for concluído.
        </p>
      </div>
    </main>
  );
}

// Dashboard do organizador
function OrganizadorDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-2xl border border-[#3ddad7]/10 shadow-xl p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
              Dashboard do Organizador
            </span>
          </h1>
          <p className="text-gray-300 mb-6">
            Painel de controle em desenvolvimento...
          </p>
          <div className="bg-[#0f172a]/60 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">Em breve você poderá:</p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• Criar e gerenciar eventos</li>
              <li>• Acompanhar vendas em tempo real</li>
              <li>• Visualizar relatórios detalhados</li>
              <li>• Configurar categorias de ingressos</li>
            </ul>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '#/organizador/login'}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold rounded-lg transition-all duration-300"
            >
              Voltar ao Login
            </button>
            <button 
              onClick={() => window.location.href = '#/'}
              className="w-full py-3 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 font-medium rounded-lg transition-all duration-300"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// Adicionar tratamento de erros
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-red-500">Oops! Algo deu errado</h1>
            <p className="text-gray-400 mb-4">Ocorreu um erro ao carregar a página.</p>
            <pre className="bg-gray-800 p-4 rounded text-xs text-left overflow-auto mb-4">
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Rotas principais */}
          <Route path="/" element={<HomePage />} />
          <Route path="/festas" element={<FestasPage />} />
          <Route path="/evento" element={<FestaDetailPage />} />
          <Route path="/revenda" element={<RevendaPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmar" element={<ConfirmPage />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/dados" element={<DadosPage />} />
          <Route path="/cancelado" element={<Cancelado />} />
          <Route path="/aguardando" element={<Aguardando />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          
          {/* 🆕 NOVA: Rota para Termos de Uso e Política de Privacidade */}
          <Route path="/terms-privacy" element={<TermsPrivacyPage />} />
          
          {/* Rotas do organizador */}
          <Route path="/organizador/login" element={<OrganizadorLoginPage />} />
          <Route path="/organizador/dashboard" element={<OrganizadorDashboard />} />
          <Route path="/organizador/validar/:festaId" element={<QRValidatorPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);