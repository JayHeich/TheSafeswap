import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import festasJson from './festas.json';

export default function QRValidatorPage() {
  const navigate = useNavigate();
  const { festaId } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [festa, setFesta] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [manualSerial, setManualSerial] = useState('');
  const [scanMode, setScanMode] = useState('camera'); // 'camera' ou 'manual'
  const [validatedTickets] = useState(new Set()); // Armazenar ingressos já validados
  const [scanCount, setScanCount] = useState(0);

  // Dados simulados de ingressos válidos (em produção, viria do backend)
  const [ticketsDatabase] = useState([
    { serial: 'SAFE-001-SARALINA', eventCode: 'SARALINA2025', ticketType: 'Masculino', used: false },
    { serial: 'SAFE-002-SARALINA', eventCode: 'SARALINA2025', ticketType: 'Feminino', used: false },
    { serial: 'SAFE-003-BIXOS', eventCode: 'BIXOS2025', ticketType: 'Pista Masculino', used: false },
    { serial: 'SAFE-004-BIXOS', eventCode: 'BIXOS2025', ticketType: 'Pista Feminino', used: false },
    { serial: 'SAFE-005-COLLIDED', eventCode: 'COLLIDED2025', ticketType: 'Pista', used: false },
    { serial: 'SAFE-006-COLLIDED', eventCode: 'COLLIDED2025', ticketType: 'VIP', used: false },
    { serial: 'SAFE-007-KEINEMUSIK', eventCode: 'KEINEMUSIK2025', ticketType: 'Pista', used: false },
    { serial: 'SAFE-008-KEINEMUSIK', eventCode: 'KEINEMUSIK2025', ticketType: 'Camarote', used: false },
    { serial: 'SAFE-009-KEINEMUSIK', eventCode: 'KEINEMUSIK2025', ticketType: 'Backstage', used: false },
  ]);

  useEffect(() => {
    // Buscar festa por nome (já que o JSON original não tem ID)
    const festaEncontrada = festasJson.find(f => f.nome.toLowerCase().replace(/\s+/g, '') === festaId?.toLowerCase());
    if (festaEncontrada) {
      // Adicionar um código de organizador baseado no nome da festa
      const codigoOrganizador = festaEncontrada.nome.toUpperCase().replace(/\s+/g, '') + '2025';
      setFesta({
        ...festaEncontrada,
        id: festaId,
        codigoOrganizador: codigoOrganizador
      });
    } else {
      navigate('/organizador/login');
    }
  }, [festaId, navigate]);

  // Função para iniciar a câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Câmera traseira
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Erro ao acessar a câmera. Tente usar a validação manual.');
    }
  };

  // Função para parar a câmera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Simulação de scan de QR code (em produção, usaria uma biblioteca real)
  const simulateQRScan = () => {
    // Simular diferentes tipos de QR codes para teste
    const testSerials = [
      'SAFE-001-SARALINA',
      'SAFE-002-SARALINA', 
      'SAFE-003-BIXOS',
      'SAFE-999-INVALID', // Serial inválido
      'SAFE-001-SARALINA', // Já usado (se scaneado novamente)
    ];
    
    const randomSerial = testSerials[Math.floor(Math.random() * testSerials.length)];
    validateTicket(randomSerial);
  };

  // Função de validação baseada na lógica fornecida
  const validateTicket = (serial) => {
    console.log('Validando serial:', serial);
    
    // Buscar o ingresso na base de dados simulada
    const ticketIndex = ticketsDatabase.findIndex(ticket => ticket.serial === serial);
    const ticket = ticketsDatabase[ticketIndex];
    
    if (!ticket) {
      setValidationResult({
        valid: false,
        reason: 'Número de série não encontrado.',
        serial: serial,
        timestamp: new Date()
      });
      return;
    }

    // Verificar se o código do evento está correto
    if (ticket.eventCode !== festa.codigoOrganizador) {
      setValidationResult({
        valid: false,
        reason: 'Código de evento incorreto.',
        serial: serial,
        eventCode: ticket.eventCode,
        expectedEventCode: festa.codigoOrganizador,
        timestamp: new Date()
      });
      return;
    }

    // Verificar se o tipo de ingresso é válido para este evento
    const validTicketTypes = Object.keys(festa.categorias);
    if (!validTicketTypes.includes(ticket.ticketType)) {
      setValidationResult({
        valid: false,
        reason: 'Tipo de ingresso incorreto.',
        serial: serial,
        ticketType: ticket.ticketType,
        timestamp: new Date()
      });
      return;
    }

    // Verificar se já foi usado
    if (ticket.used || validatedTickets.has(serial)) {
      setValidationResult({
        valid: false,
        reason: 'Ingresso já foi utilizado.',
        serial: serial,
        timestamp: new Date()
      });
      return;
    }

    // Marcar como usado
    ticketsDatabase[ticketIndex].used = true;
    validatedTickets.add(serial);
    setScanCount(prev => prev + 1);
    
    setValidationResult({
      valid: true,
      message: 'Ingresso validado com sucesso!',
      serial: serial,
      ticketType: ticket.ticketType,
      eventCode: ticket.eventCode,
      timestamp: new Date()
    });
  };

  // Validação manual
  const handleManualValidation = (e) => {
    e.preventDefault();
    if (manualSerial.trim()) {
      validateTicket(manualSerial.trim().toUpperCase());
      setManualSerial('');
    }
  };

  // Limpar resultado
  const clearResult = () => {
    setValidationResult(null);
  };

  if (!festa) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white">
      {/* Header */}
      <header className="bg-[#1e293b]/80 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/organizador/login')}
                className="text-gray-400 hover:text-white transition-colors flex items-center group"
              >
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Voltar ao Login</span>
              </button>
            </div>
            
            <div className="text-right">
              <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                Validador de Ingressos
              </h1>
              <p className="text-sm text-gray-400">{festa.nome}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border border-teal-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ingressos Validados</p>
                <p className="text-3xl font-bold text-white">{scanCount}</p>
              </div>
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border border-blue-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Evento</p>
                <p className="text-lg font-bold text-white">{festa.nome}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border border-purple-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-lg font-bold text-green-400">Online</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Modo de Scan */}
        <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Método de Validação</h3>
          
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setScanMode('camera')}
              className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                scanMode === 'camera'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Câmera</span>
              </div>
            </button>
            
            <button
              onClick={() => setScanMode('manual')}
              className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                scanMode === 'manual'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Manual</span>
              </div>
            </button>
          </div>

          {/* Interface da Câmera */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Overlay de scanning */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-teal-400 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-teal-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-teal-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-teal-400"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                {!isScanning ? (
                  <button
                    onClick={startCamera}
                    className="flex-1 bg-teal-500 hover:bg-teal-400 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Iniciar Câmera</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={simulateQRScan}
                      className="flex-1 bg-green-500 hover:bg-green-400 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4m6-11h2M6 4h2m3 0h.01M6 4H4m2 0v1M6 4v4m6-4v4m0-4h4.01M18 7v3m-2 4h2m-6 0h2m4-4h2m-6 0h2m0 0h2m-2 0h2" />
                      </svg>
                      <span>Simular Scan</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-red-500 hover:bg-red-400 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      <span>Parar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Interface Manual */}
          {scanMode === 'manual' && (
            <form onSubmit={handleManualValidation} className="space-y-4">
              <div>
                <label htmlFor="serial" className="block text-sm font-medium text-gray-300 mb-2">
                  Número de Série do Ingresso
                </label>
                <input
                  type="text"
                  id="serial"
                  value={manualSerial}
                  onChange={(e) => setManualSerial(e.target.value)}
                  placeholder="Ex: SAFE-001-SARALINA"
                  className="w-full px-4 py-3 bg-[#0f172a]/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white placeholder-gray-400"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-400 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Validar Ingresso</span>
              </button>

              {/* Códigos de teste */}
              <div className="mt-6 p-4 bg-[#0f172a]/60 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 text-center mb-3">💡 Códigos para teste:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['SAFE-001-SARALINA', 'SAFE-002-SARALINA', 'SAFE-003-BIXOS', 'SAFE-999-INVALID'].map((serial) => (
                    <button
                      key={serial}
                      type="button"
                      onClick={() => setManualSerial(serial)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-2 rounded transition-colors text-center font-mono"
                    >
                      {serial}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Resultado da Validação */}
        {validationResult && (
          <div className={`bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border ${
            validationResult.valid ? 'border-green-400/50' : 'border-red-400/50'
          } mb-8`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  validationResult.valid ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {validationResult.valid ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${
                    validationResult.valid ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {validationResult.valid ? '✅ Ingresso Válido' : '❌ Ingresso Inválido'}
                  </h3>
                  
                  <p className="text-gray-300 mt-1">
                    {validationResult.valid ? validationResult.message : validationResult.reason}
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Serial:</span>
                        <span className="ml-2 font-mono text-white">{validationResult.serial}</span>
                      </div>
                      {validationResult.ticketType && (
                        <div>
                          <span className="text-gray-400">Tipo:</span>
                          <span className="ml-2 text-white">{validationResult.ticketType}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Horário:</span>
                        <span className="ml-2 text-white">{validationResult.timestamp.toLocaleTimeString()}</span>
                      </div>
                      {validationResult.eventCode && (
                        <div>
                          <span className="text-gray-400">Evento:</span>
                          <span className="ml-2 text-white font-mono">{validationResult.eventCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={clearResult}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}