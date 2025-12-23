import { useState, useEffect } from 'react';

/* =======================
   HOME VIEW
======================= */
function HomeView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timezone, setTimezone] = useState('America/Mexico_City');
  const [nextRace, setNextRace] = useState(null);

  // Obtener la próxima carrera desde la API
  useEffect(() => {
    fetch('/api/calendario/proxima')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setNextRace(data);
        }
      })
      .catch(err => {
        console.error('Error al cargar próxima carrera:', err);
        // Datos de respaldo en caso de error
        setNextRace({
          nombreevento: 'Cook Out Clash at Daytona Beach',
          estadio: 'Daytona Beach and Road Course',
          ciudad: 'Daytona Beach',
          estado: 'FL',
          fecha: '2026-01-04',
          hora: '20:00:00',
          zonahoraria: 'MEX',
          numerovueltas: 40,
          distanciamillas: 100
        });
      });
  }, []);

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Actualizar countdown cada segundo
  useEffect(() => {
    if (!nextRace) return;

    const timer = setInterval(() => {
      const raceDateTime = new Date(`${nextRace.fecha}T${nextRace.hora}`);
      const now = new Date();
      const diff = raceDateTime - now;
      
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextRace]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-MX', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatRaceDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!nextRace) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-gray-400">Cargando información de la próxima carrera...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header con sponsor */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold tracking-wider mb-2">NASCAR GAMING SERIES</h1>
        <p className="text-gray-400 text-sm">Sponsored By Alpina</p>
      </div>

      {/* Reloj actual */}
      <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-red-500 text-5xl font-bold font-mono">
              {formatTime(currentTime)}
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {formatDate(currentTime)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-2">Zona Horaria:</p>
            <select 
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="bg-gray-900 text-white border border-red-600 rounded px-3 py-2 text-sm"
            >
              <option value="America/Mexico_City">México (GMT-6)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Europe/London">London (GMT+0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Próxima carrera */}
      <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-6">
        <h2 className="text-yellow-500 text-2xl font-bold mb-6 flex items-center gap-2">
          🏁 PRÓXIMA CARRERA
        </h2>
        
        {/* Countdown */}
        <div className="bg-gray-900 rounded-lg p-8 mb-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-yellow-500 text-5xl font-bold">{countdown.days.toString().padStart(2, '0')}</div>
              <div className="text-gray-400 text-xs mt-2">DÍAS</div>
            </div>
            <div>
              <div className="text-yellow-500 text-5xl font-bold">{countdown.hours.toString().padStart(2, '0')}</div>
              <div className="text-gray-400 text-xs mt-2">HORAS</div>
            </div>
            <div>
              <div className="text-yellow-500 text-5xl font-bold">{countdown.minutes.toString().padStart(2, '0')}</div>
              <div className="text-gray-400 text-xs mt-2">MINUTOS</div>
            </div>
            <div>
              <div className="text-yellow-500 text-5xl font-bold">{countdown.seconds.toString().padStart(2, '0')}</div>
              <div className="text-gray-400 text-xs mt-2">SEGUNDOS</div>
            </div>
          </div>
        </div>

        {/* Detalles de la carrera */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white text-xl font-bold mb-3">{nextRace.nombreevento}</h3>
            <div className="text-pink-500 mb-2">📍 {nextRace.estadio}</div>
            <div className="text-gray-400 text-sm">{nextRace.ciudad}, {nextRace.estado}</div>
          </div>
          <div className="text-right">
            <div className="text-yellow-500 mb-2">📅 {formatRaceDate(nextRace.fecha)}</div>
            <div className="text-gray-300 mb-2">🕐 {nextRace.hora.substring(0, 5)} {nextRace.zonahoraria}</div>
            <div className="text-gray-400 text-sm">🏁 {nextRace.numerovueltas} vueltas • {nextRace.distanciamillas} millas</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-xs">
        <p className="mb-2">NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.</p>
        <p>Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

/* =======================
   RESULTADOS VIEW
======================= */
function ResultadosView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/resultados')
      .then(res => res.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">RESULTADOS</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        {data.length === 0 ? (
          <p className="text-gray-400">No hay resultados disponibles</p>
        ) : (
          data.map(r => (
            <div key={r.id} className="border-b border-gray-700 py-3">
              {r.descripcion}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =======================
   PILOTOS VIEW
======================= */
function PilotosView() {
  const [pilotos, setPilotos] = useState([]);

  useEffect(() => {
    fetch('/api/pilotos')
      .then(res => res.json())
      .then(setPilotos)
      .catch(() => setPilotos([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">PILOTOS</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        {pilotos.length === 0 ? (
          <p className="text-gray-400">No hay pilotos disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pilotos.map(p => (
              <div key={p.id} className="bg-gray-700 rounded-lg p-4">
                <div className="text-xl font-bold">{p.nombre}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =======================
   CAMPEONATO VIEW
======================= */
function CampeonatoView({ subView, setSubView }) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Submenu de Campeonato */}
      <div className="mb-6">
        <button
          onClick={() => setSubView('pilotos')}
          className={`block w-full text-left px-6 py-4 mb-2 rounded-lg font-bold transition-colors ${
            subView === 'pilotos'
              ? 'bg-gray-700 text-white border-l-4 border-blue-500'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          🏁 Campeonato de Pilotos
        </button>
        <button
          onClick={() => setSubView('equipos')}
          className={`block w-full text-left px-6 py-4 mb-2 rounded-lg font-bold transition-colors ${
            subView === 'equipos'
              ? 'bg-gray-700 text-white border-l-4 border-blue-500'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          🏁 Campeonato de Equipos
        </button>
        <button
          onClick={() => setSubView('fabricantes')}
          className={`block w-full text-left px-6 py-4 rounded-lg font-bold transition-colors ${
            subView === 'fabricantes'
              ? 'bg-gray-700 text-white border-l-4 border-blue-500'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          🏭 Campeonato de Fabricantes
        </button>
      </div>

      {/* Contenido según subView */}
      <div className="bg-gray-800 rounded-lg p-6">
        {subView === 'pilotos' && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Campeonato de Pilotos</h2>
            <p className="text-gray-400">Tabla de clasificación de pilotos...</p>
          </div>
        )}
        {subView === 'equipos' && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Campeonato de Equipos</h2>
            <p className="text-gray-400">Tabla de clasificación de equipos...</p>
          </div>
        )}
        {subView === 'fabricantes' && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Campeonato de Fabricantes</h2>
            <p className="text-gray-400">Tabla de clasificación de fabricantes...</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =======================
   CALENDARIO VIEW
======================= */
function CalendarioView() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetch('/api/calendario')
      .then(res => res.json())
      .then(setEventos)
      .catch(() => setEventos([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">CALENDARIO</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        {eventos.length === 0 ? (
          <p className="text-gray-400">No hay eventos programados</p>
        ) : (
          eventos.map(e => (
            <div key={e.id} className="border-b border-gray-700 py-3">
              {e.nombre} - {e.fecha}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =======================
   REGLAMENTO VIEW
======================= */
function ReglamentoView() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">REGLAMENTO</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-300 mb-4">
          Reglamento oficial de NASCAR Gaming Series
        </p>
        <div className="text-gray-400 space-y-2">
          <p>• Normas de conducta en pista</p>
          <p>• Sistema de puntuación</p>
          <p>• Penalizaciones</p>
          <p>• Licencias de conducción</p>
        </div>
      </div>
    </div>
  );
}

/* =======================
   APP
======================= */
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [campeonatoSubView, setCampeonatoSubView] = useState('pilotos');
  const [campeonatoOpen, setCampeonatoOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'resultados':
        return <ResultadosView />;
      case 'pilotos':
        return <PilotosView />;
      case 'campeonato':
        return <CampeonatoView subView={campeonatoSubView} setSubView={setCampeonatoSubView} />;
      case 'calendario':
        return <CalendarioView />;
      case 'reglamento':
        return <ReglamentoView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* NAVBAR SUPERIOR */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-1">
            <button 
              onClick={() => setCurrentView('home')}
              className={`px-8 py-4 font-bold text-sm tracking-wider transition-colors ${
                currentView === 'home' 
                  ? 'bg-gray-800 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              HOME
            </button>
            <button 
              onClick={() => setCurrentView('resultados')}
              className={`px-8 py-4 font-bold text-sm tracking-wider transition-colors ${
                currentView === 'resultados' 
                  ? 'bg-gray-800 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              RESULTADOS
            </button>
            <button 
              onClick={() => setCurrentView('pilotos')}
              className={`px-8 py-4 font-bold text-sm tracking-wider transition-colors ${
                currentView === 'pilotos' 
                  ? 'bg-gray-800 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              PILOTOS
            </button>
          </div>
        </div>
      </nav>

      {/* BOTONES DE ACCIÓN PRINCIPALES */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button 
            onClick={() => setCurrentView('pilotos')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            🏁 PILOTOS
          </button>
          
          <div className="relative">
            <button 
              onClick={() => {
                setCurrentView('campeonato');
                setCampeonatoOpen(!campeonatoOpen);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              🏆 CAMPEONATO ▼
            </button>
            
            {campeonatoOpen && currentView === 'campeonato' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-10">
                <button
                  onClick={() => {
                    setCampeonatoSubView('pilotos');
                    setCampeonatoOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
                >
                  🏁 Campeonato de Pilotos
                </button>
                <button
                  onClick={() => {
                    setCampeonatoSubView('equipos');
                    setCampeonatoOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
                >
                  🏁 Campeonato de Equipos
                </button>
                <button
                  onClick={() => {
                    setCampeonatoSubView('fabricantes');
                    setCampeonatoOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                >
                  🏭 Campeonato de Fabricantes
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setCurrentView('calendario')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            📅 CALENDARIO
          </button>
          <button 
            onClick={() => setCurrentView('reglamento')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            📋 REGLAMENTO
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="px-4 pb-8">
        {renderView()}
      </div>
    </div>
  );
}