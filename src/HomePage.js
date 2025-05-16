import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
          {/* Logo */}
          <img
            src="/logo.png.jpg"
            alt="Safeswap Logo"
            className="h-24 w-24 rounded-2xl shadow-lg"
          />

          {/* Nome da plataforma com texto gradiente */}
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
            Safeswap
          </h1>

          {/* Botão principal de compra */}
          <button
            onClick={() => navigate('/festas')}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-4 rounded-xl text-xl font-bold transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Comprar ingressos
          </button>

          {/* Link secundário para revenda, menos destacado */}
          <div className="mt-2">
            <button
              onClick={() => navigate('/revenda')}
              className="text-[#3ddad7] hover:text-[#67e8f9] text-base transition mt-2 flex items-center gap-1"
            >
              <span>Intermediação de revendas</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer com informações de contato */}
      <footer className="text-sm text-center text-[#94a3b8] border-t border-[#1e293b] py-4">
        <p>Email: <a href="mailto:ajuda@safeswapbr.com" className="text-[#3ddad7] hover:underline">ajuda@safeswapbr.com</a></p>
        <p>WhatsApp: <a href="https://wa.me/5511933478389" target="_blank" rel="noopener noreferrer" className="text-[#3ddad7] hover:underline">(11) 93347-8389</a></p>
        <p>Instagram: <a href="https://instagram.com/safeswap_" target="_blank" rel="noopener noreferrer" className="text-[#3ddad7] hover:underline">@safeswap_</a></p>
      </footer>
    </main>
  );
}