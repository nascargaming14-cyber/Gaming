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

      {/* Botones de navegación principales */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors">
          🏁 PILOTOS
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors">
          🏆 CAMPEONATO ▼
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors">
          📅 CALENDARIO
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition-colors">
          📋 REGLAMENTO
        </button>
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
    <div>
      <h2>RESULTADOS</h2>
      {data.map(r => (
        <div key={r.id}>{r.descripcion}</div>
      ))}
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
    <div>
      <h2>PILOTOS</h2>
      {pilotos.map(p => (
        <div key={p.id}>{p.nombre}</div>
      ))}
    </div>
  );
}

/* =======================
   APP
======================= */
export default function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'resultados':
        return <ResultadosView />;
      case 'pilotos':
        return <PilotosView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen p-8">
      <nav className="mb-8 flex gap-4 max-w-6xl mx-auto">
        <button 
          onClick={() => setCurrentView('home')}
          className={`px-6 py-2 rounded-lg font-bold transition-colors ${
            currentView === 'home' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          HOME
        </button>
        <button 
          onClick={() => setCurrentView('resultados')}
          className={`px-6 py-2 rounded-lg font-bold transition-colors ${
            currentView === 'resultados' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          RESULTADOS
        </button>
        <button 
          onClick={() => setCurrentView('pilotos')}
          className={`px-6 py-2 rounded-lg font-bold transition-colors ${
            currentView === 'pilotos' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          PILOTOS
        </button>
      </nav>
      {renderView()}
    </div>
  );
}