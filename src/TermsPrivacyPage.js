import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsPrivacyPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('terms');
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const Accordion = ({ id, title, children, defaultOpen = false }) => {
    const isOpen = expandedSections[id] !== undefined ? expandedSections[id] : defaultOpen;
    
    return (
      <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl overflow-hidden border border-[#3ddad7]/10 shadow-lg transition-all duration-300 hover:shadow-xl mb-6">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex justify-between items-center p-6 text-white hover:bg-[#3ddad7]/10 focus:outline-none focus:ring-2 focus:ring-[#3ddad7] transition-all duration-300"
        >
          <span className="text-lg font-medium text-left">{title}</span>
          <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 bg-[#0f172a]/80 text-gray-300 border-t border-[#3ddad7]/10">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const TermsContent = () => (
    <div className="space-y-6">
      <Accordion id="terms-1" title="1. Aceitação dos Termos" defaultOpen={true}>
        <div className="space-y-4">
          <p>
            Ao acessar e utilizar a plataforma SafeSwap, você concorda em cumprir e ficar vinculado aos presentes Termos de Uso. 
            Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
          </p>
          <p>
            A SafeSwap é uma plataforma de intermediação para compra e venda de ingressos para eventos, 
            comprometida em oferecer transações seguras e confiáveis para todos os usuários.
          </p>
        </div>
      </Accordion>

      <Accordion id="terms-2" title="2. Definições">
        <div className="space-y-4">
          <p><strong className="text-teal-400">Plataforma:</strong> Website e aplicações da SafeSwap</p>
          <p><strong className="text-teal-400">Usuário:</strong> Qualquer pessoa que acesse ou utilize a plataforma</p>
          <p><strong className="text-teal-400">Comprador:</strong> Usuário que adquire ingressos através da plataforma</p>
          <p><strong className="text-teal-400">Vendedor:</strong> Usuário que disponibiliza ingressos para venda</p>
          <p><strong className="text-teal-400">Organizador:</strong> Responsável pelo evento e emissão original dos ingressos</p>
          <p><strong className="text-teal-400">Serviços:</strong> Todas as funcionalidades oferecidas pela SafeSwap</p>
        </div>
      </Accordion>

      <Accordion id="terms-3" title="3. Elegibilidade e Cadastro">
        <div className="space-y-4">
          <p>
            <strong>3.1.</strong> Para utilizar nossos serviços, você deve ser maior de 18 anos ou ter autorização de um responsável legal.
          </p>
          <p>
            <strong>3.2.</strong> Você deve fornecer informações precisas, atuais e completas durante o processo de cadastro.
          </p>
          <p>
            <strong>3.3.</strong> É de sua responsabilidade manter a confidencialidade de suas credenciais de acesso.
          </p>
          <p>
            <strong>3.4.</strong> Você é totalmente responsável por todas as atividades realizadas em sua conta.
          </p>
        </div>
      </Accordion>

      <Accordion id="terms-4" title="4. Serviços Oferecidos">
        <div className="space-y-4">
          <p>
            <strong>4.1. Venda Direta:</strong> Comercialização de ingressos originais em parceria com organizadores de eventos.
          </p>
          <p>
            <strong>4.2. Intermediação de Revenda:</strong> Facilitação segura de transações entre vendedores e compradores de ingressos.
          </p>
          <p>
            <strong>4.3. Processamento de Pagamentos:</strong> Integração com sistemas de pagamento seguros (PIX, cartões de crédito/débito).
          </p>
          <p>
            <strong>4.4. Entrega Digital:</strong> Envio de ingressos via e-mail ou WhatsApp após confirmação do pagamento.
          </p>
        </div>
      </Accordion>

      <Accordion id="terms-5" title="5. Taxas e Pagamentos">
        <div className="space-y-4">
          <p>
            <strong>5.1.</strong> A SafeSwap cobra uma taxa de processamento sobre cada transação:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-teal-400">PIX:</strong> 5% do valor da transação</li>
            <li><strong className="text-teal-400">Cartão de Crédito/Débito:</strong> 8% do valor da transação</li>
          </ul>
          <p>
            <strong>5.2.</strong> As taxas são cobradas do comprador e claramente informadas antes da finalização da compra.
          </p>
          <p>
            <strong>5.3.</strong> Não cobramos taxa de saque para organizadores de eventos.
          </p>
          <p>
            <strong>5.4.</strong> Todos os pagamentos são processados através de parceiros certificados em segurança.
          </p>
        </div>
      </Accordion>

      <Accordion id="terms-6" title="6. Responsabilidades do Usuário">
        <div className="space-y-4">
          <p>
            <strong>6.1.</strong> Fornecer informações verdadeiras e atualizadas.
          </p>
          <p>
            <strong>6.2.</strong> Não utilizar a plataforma para atividades ilegais ou fraudulentas.
          </p>
          <p>
            <strong>6.3.</strong> Respeitar os direitos de propriedade intelectual.
          </p>
          <p>
            <strong>6.4.</strong> Não revender ingressos por valores abusivos ou superiores ao permitido por lei.
          </p>
          <p>
            <strong>6.5.</strong> Manter a segurança de suas credenciais de acesso.
          </p>
        </div>
      </Accordion>

      <Accordion id="terms-7" title="7. Política de Cancelamento e Reembolso">
        <div className="space-y-4">
          <p>
            <strong>7.1.</strong> Cancelamentos de eventos pelos organizadores resultam em reembolso integral.
          </p>
          <p>
            <strong>7.2.</strong> Cancelamentos por parte do comprador seguem as políticas específicas de cada evento.
          </p>
          <p>
            <strong>7.3.</strong> Em caso de ingressos fraudulentos, garantimos reembolso integral ao comprador.
          </p>
          <p>
            <strong>7.4.</strong> Reembolsos são processados no prazo de até 10 dias úteis.
          </p>
        </div>
      </Accordion>

      <Accordion id="terms-8" title="8. Limitação de Responsabilidade">
        <div className="space-y-4">
          <p>
            <strong>8.1.</strong> A SafeSwap atua como intermediadora e não é responsável pela realização dos eventos.
          </p>
          <p>
            <strong>8.2.</strong> Não nos responsabilizamos por mudanças de data, local ou cancelamento de eventos pelos organizadores.
          </p>
          <p>
            <strong>8.3.</strong> Nossa responsabilidade limita-se ao valor pago pelo ingresso mais taxas aplicáveis.
          </p>
          <p>
            <strong>8.4.</strong> Não garantimos disponibilidade contínua da plataforma.
          </p>
        </div>
      </Accordion>

      <Accordion id="terms-9" title="9. Propriedade Intelectual">
        <div className="space-y-4">
          <p>
            <strong>9.1.</strong> Todo conteúdo da plataforma SafeSwap é protegido por direitos autorais.
          </p>
          <p>
            <strong>9.2.</strong> É proibida a reprodução, distribuição ou modificação sem autorização expressa.
          </p>
          <p>
            <strong>9.3.</strong> Marcas, logos e nomes comerciais são propriedade de seus respectivos donos.
          </p>
        </div>
      </Accordion>

      <Accordion id="terms-10" title="10. Modificações nos Termos">
        <div className="space-y-4">
          <p>
            <strong>10.1.</strong> A SafeSwap reserva-se o direito de modificar estes termos a qualquer momento.
          </p>
          <p>
            <strong>10.2.</strong> Alterações serão comunicadas através da plataforma ou por e-mail.
          </p>
          <p>
            <strong>10.3.</strong> O uso continuado após as modificações constitui aceitação dos novos termos.
          </p>
        </div>
      </Accordion>

      <Accordion id="terms-11" title="11. Lei Aplicável e Foro">
        <div className="space-y-4">
          <p>
            <strong>11.1.</strong> Estes termos são regidos pela legislação brasileira.
          </p>
          <p>
            <strong>11.2.</strong> Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias.
          </p>
        </div>
      </Accordion>

      <div className="mt-12 p-6 bg-[#1e293b]/50 rounded-xl border border-[#3ddad7]/10">
        <p className="text-sm text-gray-400">
          <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Para dúvidas sobre estes termos, entre em contato: 
          <a href="mailto:juridico@safeswapbr.com" className="text-teal-400 hover:underline ml-1">juridico@safeswapbr.com</a>
        </p>
      </div>
    </div>
  );

  const PrivacyContent = () => (
    <div className="space-y-6">
      <Accordion id="privacy-1" title="1. Informações que Coletamos" defaultOpen={true}>
        <div className="space-y-4">
          <p><strong className="text-teal-400">1.1. Dados Pessoais:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Nome completo</li>
            <li>E-mail</li>
            <li>Número de telefone/WhatsApp</li>
            <li>CPF (quando necessário)</li>
            <li>Data de nascimento</li>
          </ul>
          
          <p><strong className="text-teal-400">1.2. Dados de Pagamento:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Informações de cartão de crédito/débito (processadas por parceiros seguros)</li>
            <li>Dados bancários para PIX</li>
            <li>Histórico de transações</li>
          </ul>
          
          <p><strong className="text-teal-400">1.3. Dados de Navegação:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Endereço IP</li>
            <li>Tipo de dispositivo e navegador</li>
            <li>Páginas visitadas e tempo de navegação</li>
            <li>Cookies e tecnologias similares</li>
          </ul>
        </div>
      </Accordion>

      <Accordion id="privacy-2" title="2. Como Utilizamos suas Informações">
        <div className="space-y-4">
          <p><strong className="text-teal-400">2.1. Prestação de Serviços:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Processamento de pagamentos</li>
            <li>Entrega de ingressos</li>
            <li>Comunicação sobre transações</li>
            <li>Suporte ao cliente</li>
          </ul>
          
          <p><strong className="text-teal-400">2.2. Segurança e Prevenção à Fraude:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Verificação de identidade</li>
            <li>Monitoramento de atividades suspeitas</li>
            <li>Proteção contra fraudes</li>
          </ul>
          
          <p><strong className="text-teal-400">2.3. Melhoria dos Serviços:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Análise de uso da plataforma</li>
            <li>Desenvolvimento de novos recursos</li>
            <li>Personalização da experiência</li>
          </ul>
        </div>
      </Accordion>

      <Accordion id="privacy-3" title="3. Compartilhamento de Informações">
        <div className="space-y-4">
          <p>
            <strong>3.1.</strong> Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.
          </p>
          <p><strong className="text-teal-400">3.2. Compartilhamos dados apenas quando:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Necessário para processar pagamentos (com nossos parceiros certificados)</li>
            <li>Exigido por lei ou ordem judicial</li>
            <li>Para proteger direitos, propriedade ou segurança</li>
            <li>Com seu consentimento explícito</li>
          </ul>
          <p><strong className="text-teal-400">3.3. Parceiros de Pagamento:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Mercado Pago (processamento de pagamentos)</li>
            <li>Bancos e instituições financeiras</li>
          </ul>
        </div>
      </Accordion>

      <Accordion id="privacy-4" title="4. Segurança dos Dados">
        <div className="space-y-4">
          <p>
            <strong>4.1.</strong> Utilizamos medidas técnicas e organizacionais adequadas para proteger seus dados.
          </p>
          <p><strong className="text-teal-400">4.2. Medidas de Segurança:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Criptografia SSL/TLS para transmissão de dados</li>
            <li>Armazenamento seguro em servidores protegidos</li>
            <li>Acesso restrito apenas a funcionários autorizados</li>
            <li>Monitoramento contínuo de segurança</li>
            <li>Backups regulares e seguros</li>
          </ul>
          <p>
            <strong>4.3.</strong> Apesar de nossos esforços, nenhum método de transmissão ou armazenamento é 100% seguro.
          </p>
        </div>
      </Accordion>

      <Accordion id="privacy-5" title="5. Seus Direitos (LGPD)">
        <div className="space-y-4">
          <p>Conforme a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:</p>
          <p><strong className="text-teal-400">5.1. Acesso:</strong> Solicitar informações sobre como tratamos seus dados</p>
          <p><strong className="text-teal-400">5.2. Correção:</strong> Solicitar correção de dados incompletos ou inexatos</p>
          <p><strong className="text-teal-400">5.3. Exclusão:</strong> Solicitar eliminação de dados desnecessários</p>
          <p><strong className="text-teal-400">5.4. Portabilidade:</strong> Solicitar transferência dos dados para outro fornecedor</p>
          <p><strong className="text-teal-400">5.5. Oposição:</strong> Opor-se ao tratamento de dados</p>
          <p><strong className="text-teal-400">5.6. Revogação:</strong> Revogar consentimento a qualquer momento</p>
          
          <div className="mt-4 p-4 bg-[#0f172a]/60 rounded-lg border border-[#3ddad7]/10">
            <p className="text-sm">
              <strong>Para exercer seus direitos, entre em contato:</strong><br/>
              E-mail: <a href="mailto:privacidade@safeswapbr.com" className="text-teal-400 hover:underline">privacidade@safeswapbr.com</a><br/>
              WhatsApp: <a href="https://wa.me/5511933478389" className="text-teal-400 hover:underline">(11) 93347-8389</a>
            </p>
          </div>
        </div>
      </Accordion>

      <Accordion id="privacy-6" title="6. Cookies e Tecnologias Similares">
        <div className="space-y-4">
          <p>
            <strong>6.1.</strong> Utilizamos cookies para melhorar sua experiência na plataforma.
          </p>
          <p><strong className="text-teal-400">6.2. Tipos de Cookies:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Essenciais:</strong> Necessários para funcionamento básico</li>
            <li><strong>Funcionais:</strong> Lembram suas preferências</li>
            <li><strong>Analíticos:</strong> Ajudam a entender como você usa o site</li>
            <li><strong>Marketing:</strong> Personalizam anúncios (apenas com seu consentimento)</li>
          </ul>
          <p>
            <strong>6.3.</strong> Você pode gerenciar cookies através das configurações do seu navegador.
          </p>
        </div>
      </Accordion>

      <Accordion id="privacy-7" title="7. Retenção de Dados">
        <div className="space-y-4">
          <p>
            <strong>7.1.</strong> Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política.
          </p>
          <p><strong className="text-teal-400">7.2. Prazos de Retenção:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Dados de transação:</strong> 5 anos (obrigação legal)</li>
            <li><strong>Dados de cadastro:</strong> Enquanto a conta estiver ativa</li>
            <li><strong>Dados de navegação:</strong> 12 meses</li>
            <li><strong>Comunicações:</strong> 3 anos</li>
          </ul>
          <p>
            <strong>7.3.</strong> Após os prazos, os dados são excluídos de forma segura.
          </p>
        </div>
      </Accordion>

      <Accordion id="privacy-8" title="8. Transferência Internacional">
        <div className="space-y-4">
          <p>
            <strong>8.1.</strong> Seus dados são processados principalmente no Brasil.
          </p>
          <p>
            <strong>8.2.</strong> Quando necessário transferir dados para outros países, garantimos proteção adequada.
          </p>
          <p>
            <strong>8.3.</strong> Parceiros internacionais devem seguir padrões de proteção equivalentes à LGPD.
          </p>
        </div>
      </Accordion>

      <Accordion id="privacy-9" title="9. Menores de Idade">
        <div className="space-y-4">
          <p>
            <strong>9.1.</strong> Nossos serviços são destinados a maiores de 18 anos.
          </p>
          <p>
            <strong>9.2.</strong> Não coletamos intencionalmente dados de menores de 18 anos.
          </p>
          <p>
            <strong>9.3.</strong> Se identificarmos dados de menores, eles serão excluídos imediatamente.
          </p>
        </div>
      </Accordion>

      <Accordion id="privacy-10" title="10. Alterações nesta Política">
        <div className="space-y-4">
          <p>
            <strong>10.1.</strong> Esta política pode ser atualizada periodicamente.
          </p>
          <p>
            <strong>10.2.</strong> Alterações significativas serão comunicadas por e-mail ou notificação na plataforma.
          </p>
          <p>
            <strong>10.3.</strong> A data da última atualização sempre será indicada.
          </p>
        </div>
      </Accordion>

      <div className="mt-12 p-6 bg-[#1e293b]/50 rounded-xl border border-[#3ddad7]/10">
        <p className="text-sm text-gray-400">
          <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          <strong>Encarregado de Proteção de Dados (DPO):</strong><br/>
          E-mail: <a href="mailto:dpo@safeswapbr.com" className="text-teal-400 hover:underline">dpo@safeswapbr.com</a>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white flex flex-col relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-96 h-96 rounded-full bg-teal-400 opacity-5 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 rounded-full bg-cyan-500 opacity-5 blur-[100px]"></div>
        <div className="absolute bottom-[30%] left-[20%] w-72 h-72 rounded-full bg-emerald-600 opacity-3 blur-[80px]"></div>
      </div>

      {/* Conteúdo principal */}
      <div className={`flex-grow flex flex-col items-center px-6 md:px-12 py-12 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        {/* Botão de volta */}
        <div className="w-full max-w-6xl mx-auto mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-lg font-medium">Voltar</span>
          </button>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png.jpg"
                alt="Safeswap Logo"
                className="h-16 w-16 rounded-xl shadow-lg"
              />
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                SafeSwap
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                Termos & Privacidade
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full mb-4"></div>
            <p className="text-gray-300 text-center max-w-2xl">
              Conheça nossos termos de uso e como protegemos sua privacidade
            </p>
          </div>

          {/* Tabs de navegação */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-xl bg-[#1e293b]/50 backdrop-blur-sm border border-[#3ddad7]/10">
              <button
                className={`py-3 px-8 rounded-lg font-medium transition-all duration-300 ${activeTab === 'terms' 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-[#3ddad7]/10'}`}
                onClick={() => setActiveTab('terms')}
              >
                📋 Termos de Uso
              </button>
              <button
                className={`py-3 px-8 rounded-lg font-medium transition-all duration-300 ${activeTab === 'privacy' 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-[#3ddad7]/10'}`}
                onClick={() => setActiveTab('privacy')}
              >
                🔒 Política de Privacidade
              </button>
            </div>
          </div>

          {/* Conteúdo das abas */}
          <div className="bg-[#1e293b]/30 backdrop-blur-md rounded-2xl border border-[#3ddad7]/10 shadow-xl p-8 md:p-10">
            {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
          </div>

          {/* Informações de contato */}
          <div className="mt-12 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl border border-[#3ddad7]/10 p-8">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-6 text-center">
              Precisa de Ajuda?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-[#0f172a]/60 rounded-xl p-6 border border-[#3ddad7]/10">
                <div className="text-3xl mb-3">📧</div>
                <h4 className="font-semibold text-white mb-2">E-mail Geral</h4>
                <a href="mailto:contato@safeswapbr.com" className="text-teal-400 hover:underline text-sm">
                  contato@safeswapbr.com
                </a>
              </div>
              
              <div className="bg-[#0f172a]/60 rounded-xl p-6 border border-[#3ddad7]/10">
                <div className="text-3xl mb-3">⚖️</div>
                <h4 className="font-semibold text-white mb-2">Questões Jurídicas</h4>
                <a href="mailto:juridico@safeswapbr.com" className="text-teal-400 hover:underline text-sm">
                  juridico@safeswapbr.com
                </a>
              </div>
              
              <div className="bg-[#0f172a]/60 rounded-xl p-6 border border-[#3ddad7]/10">
                <div className="text-3xl mb-3">🔐</div>
                <h4 className="font-semibold text-white mb-2">Proteção de Dados</h4>
                <a href="mailto:privacidade@safeswapbr.com" className="text-teal-400 hover:underline text-sm">
                  privacidade@safeswapbr.com
                </a>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="https://wa.me/5511933478389" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-6 py-3 rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                WhatsApp: (11) 93347-8389
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-sm text-[#94a3b8] border-t border-[#1e293b] py-6 px-4 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} SafeSwap. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}