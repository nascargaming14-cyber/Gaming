import { useState, useEffect } from 'react';

/* =======================
   HOME VIEW
======================= */
function HomeView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timezone, setTimezone] = useState('Mexico');
  const [nextRace, setNextRace] = useState(null);

  const timezones = {
    'Mexico': { offset: -6, display: 'México (GMT-6)' },
    'CostaRica': { offset: -6, display: 'Costa Rica (GMT-6)' },
    'Salvador': { offset: -6, display: 'El Salvador (GMT-6)' },
    'Colombia': { offset: -5, display: 'Colombia (GMT-5)' },
    'Argentina': { offset: -3, display: 'Argentina (GMT-3)' }
  };

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
    return date.toLocaleDateString('es-ES', { 
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
      <div className="text-center py-12">
        <div className="text-gray-400">Cargando información de la próxima carrera...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header con sponsor */}
      <div className="text-left mb-4">
        <h1 className="text-4xl font-bold mb-1">NASCAR GAMING SERIES</h1>
        <p className="text-gray-400 text-xs">Sponsored By Alpina</p>
      </div>

      {/* Reloj y Zona Horaria en línea */}
      <div className="mb-2">
        <div className="text-white text-lg font-bold mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-gray-400 text-xs mb-2">
          {formatDate(currentTime)}
        </div>
        <div className="text-xs text-gray-400 mb-1">Zona Horaria:</div>
        <select 
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-xs"
        >
          <option value="Mexico">{timezones.Mexico.display}</option>
          <option value="CostaRica">{timezones.CostaRica.display}</option>
          <option value="Salvador">{timezones.Salvador.display}</option>
          <option value="Colombia">{timezones.Colombia.display}</option>
          <option value="Argentina">{timezones.Argentina.display}</option>
        </select>
      </div>

      {/* Próxima carrera */}
      <div className="mb-4">
        <h2 className="text-white text-base font-bold mb-2">
          🏁 PRÓXIMA CARRERA
        </h2>
        
        {/* Countdown compacto */}
        <div className="mb-3">
          <div className="text-white text-sm mb-1">{countdown.days}</div>
          <div className="text-gray-500 text-xs mb-2">DÍAS</div>
          
          <div className="text-white text-sm mb-1">{countdown.hours.toString().padStart(2, '0')}</div>
          <div className="text-gray-500 text-xs mb-2">HORAS</div>
          
          <div className="text-white text-sm mb-1">{countdown.minutes.toString().padStart(2, '0')}</div>
          <div className="text-gray-500 text-xs mb-2">MINUTOS</div>
          
          <div className="text-white text-sm mb-1">{countdown.seconds.toString().padStart(2, '0')}</div>
          <div className="text-gray-500 text-xs">SEGUNDOS</div>
        </div>

        {/* Detalles de la carrera */}
        <div>
          <h3 className="text-white text-base font-bold mb-2">{nextRace.nombreevento}</h3>
          <div className="text-pink-400 text-xs mb-1">
            📍 {nextRace.estadio}
          </div>
          <div className="text-gray-400 text-xs mb-2">{nextRace.ciudad}, {nextRace.estado}</div>
          <div className="text-blue-400 text-xs mb-1">📅 {formatRaceDate(nextRace.fecha)}</div>
          <div className="text-gray-300 text-xs mb-1">🕐 {nextRace.hora.substring(0, 5)} {nextRace.zonahoraria}</div>
          <div className="text-gray-400 text-xs">🏁 {nextRace.numerovueltas} vueltas • {nextRace.distanciamillas} millas</div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-gray-500 text-xs leading-relaxed">
        <p className="mb-1">NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.</p>
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
      <h2 className="text-2xl font-bold mb-4">RESULTADOS</h2>
      <div className="bg-gray-800 rounded-lg p-4">
        {data.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay resultados disponibles</p>
        ) : (
          data.map(r => (
            <div key={r.id} className="border-b border-gray-700 py-2 text-sm">
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pilotos')
      .then(res => res.json())
      .then(data => {
        setPilotos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-gray-400 text-lg">Cargando pilotos...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          🏎 Pilotos NASCAR Gaming Series — Lista de Entradas — Tiempo Completo
        </h1>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded"
        >
          ← Regresar al inicio
        </button>
      </div>

      {/* CONTENEDOR TABLA */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-bold">NÚMERO</th>
                <th className="px-4 py-3 text-left font-bold">NOMBRE</th>
                <th className="px-4 py-3 text-left font-bold">APELLIDO</th>
                <th className="px-4 py-3 text-left font-bold">FECHA NACIMIENTO</th>
                <th className="px-4 py-3 text-left font-bold">LUGAR ORIGEN</th>
                <th className="px-4 py-3 text-left font-bold">JEFE EQUIPO</th>
                <th className="px-4 py-3 text-left font-bold">EQUIPO</th>
                <th className="px-4 py-3 text-left font-bold">CATEGORÍA</th>
                <th className="px-4 py-3 text-left font-bold">MARCA VEHÍCULO</th>
              </tr>
            </thead>

            <tbody>
              {pilotos.map((p, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                      {p.numero}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3">{p.apellido}</td>
                  <td className="px-4 py-3">
                    {new Date(p.fechanacimiento).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-4 py-3">{p.lugarorigen}</td>
                  <td className="px-4 py-3">{p.jefeequipo}</td>
                  <td className="px-4 py-3">{p.equipo}</td>
                  <td className="px-4 py-3">{p.categoria}</td>
                  <td className="px-4 py-3 font-semibold">{p.marcavehiculo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026 NASCAR Gaming Series • Datos oficiales de pilotos
      </div>
    </div>
  );
}

/* ======================================================
   TABLA CAMPEONATO PILOTOS
====================================================== */
function CampeonatoPilotosTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campeonato/pilotos')
      .then(res => res.json())
      .then(rows => {
        setData(rows);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-gray-400 text-lg">
          Cargando clasificación...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-3 py-3">POS</th>
              <th className="px-3 py-3">NO</th>
              <th className="px-3 py-3 text-left">DRIVER</th>
              <th className="px-3 py-3">MFR</th>
              <th className="px-3 py-3">POINTS (STAGE)</th>
              <th className="px-3 py-3">BEHIND</th>
              <th className="px-3 py-3">STARTS</th>
              <th className="px-3 py-3">WINS</th>
              <th className="px-3 py-3">TOP 5s</th>
              <th className="px-3 py-3">TOP 10s</th>
              <th className="px-3 py-3">DNFs</th>
              <th className="px-3 py-3">LAPS LED</th>
              <th className="px-3 py-3">PLAYOFF POINTS</th>
              <th className="px-3 py-3">AVG START</th>
              <th className="px-3 py-3">AVG FINISH</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index === 0
                    ? 'bg-yellow-100 font-bold'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-3 py-3">{p.pos}</td>
                <td className="px-3 py-3">{p.no}</td>
                <td className="px-3 py-3 text-left">{p.driver}</td>
                <td className="px-3 py-3">{p.mfr}</td>
                <td className="px-3 py-3 font-semibold">
                  {p.totalpoints}
                </td>
                <td
                  className={`px-3 py-3 font-bold ${
                    p.behind === 'LIDER'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {p.behind}
                </td>
                <td className="px-3 py-3">{p.starts}</td>
                <td className="px-3 py-3 text-green-600 font-bold">
                  {p.wins}
                </td>
                <td className="px-3 py-3">{p.top5s}</td>
                <td className="px-3 py-3">{p.top10s}</td>
                <td className="px-3 py-3 text-red-600">
                  {p.dnfs}
                </td>
                <td className="px-3 py-3">{p.lapsled}</td>
                <td className="px-3 py-3 font-bold">
                  {p.playoffpoints}
                </td>
                <td className="px-3 py-3 text-purple-600">
                  {p.avgstart}
                </td>
                <td className="px-3 py-3 text-purple-600">
                  {p.avgfinish}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================================================
   TABLA CAMPEONATO FABRICANTES
====================================================== */
function CampeonatoFabricantesTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campeonato/fabricantes')
      .then(res => res.json())
      .then(rows => {
        setData(rows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-gray-400 text-lg">
          Cargando clasificación de fabricantes...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-center">POS</th>
              <th className="px-4 py-3 text-left">MANUFACTURER</th>
              <th className="px-4 py-3 text-center">POINTS</th>
              <th className="px-4 py-3 text-center">BEHIND</th>
              <th className="px-4 py-3 text-center">WINS</th>
            </tr>
          </thead>

          <tbody>
            {data.map((f, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index === 0
                    ? 'bg-yellow-100 font-bold'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 text-center">{f.pos}</td>
                <td className="px-4 py-3 text-left font-semibold">{f.manufacturer}</td>
                <td className="px-4 py-3 text-center font-bold text-blue-600">
                  {f.points}
                </td>
                <td
                  className={`px-4 py-3 text-center font-bold ${
                    f.behind === 'LIDER'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {f.behind}
                </td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">
                  {f.wins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ================================
   CAMPEONATO VIEW (PRINCIPAL)
================================ */
function CampeonatoView() {
  const [subView, setSubView] = useState('pilotos');

  return (
    <div className="max-w-7xl mx-auto px-4">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          📊 Clasificación NASCAR Gaming Series
        </h1>

        <button
          onClick={() => window.location.reload()}
          className="mt-3 sm:mt-0 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded"
        >
          ← Regresar al inicio
        </button>
      </div>

      {/* SUBMENU */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSubView('pilotos')}
          className={`px-4 py-2 rounded font-semibold text-sm ${
            subView === 'pilotos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Pilotos
        </button>

        <button
          onClick={() => setSubView('equipos')}
          className={`px-4 py-2 rounded font-semibold text-sm ${
            subView === 'equipos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Equipos
        </button>

        <button
          onClick={() => setSubView('fabricantes')}
          className={`px-4 py-2 rounded font-semibold text-sm ${
            subView === 'fabricantes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Fabricantes
        </button>
      </div>

      {/* CONTENIDO */}
      {subView === 'pilotos' && <CampeonatoPilotosTable />}

      {subView === 'equipos' && (
        <div className="text-gray-400 text-sm">
          Clasificación de equipos (pendiente de implementación).
        </div>
      )}
      {/* CONTENIDO */}
      {subView === 'pilotos' && <CampeonatoPilotosTable />}

      {subView === 'equipos' && (
        <div className="text-gray-400 text-sm">
          Clasificación de equipos (pendiente de implementación).
        </div>
      )}

      {subView === 'fabricantes' && <CampeonatoFabricantesTable />}
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
    <div>
      <h2 className="text-2xl font-bold mb-4">CALENDARIO</h2>
      <div className="bg-gray-800 rounded-lg p-4">
        {eventos.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay eventos programados</p>
        ) : (
          eventos.map(e => (
            <div key={e.id} className="border-b border-gray-700 py-2 text-sm">
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
    <div>
      <h2 className="text-2xl font-bold mb-4">REGLAMENTO</h2>
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-gray-300 mb-3 text-sm">
          Reglamento oficial de NASCAR Gaming Series
        </p>
        <div className="text-gray-400 space-y-1 text-xs">
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
   APP PRINCIPAL
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
        return <CampeonatoView />;
      case 'calendario':
        return <CalendarioView />;
      case 'reglamento':
        return <ReglamentoView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* NAVBAR SUPERIOR */}
      <nav className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentView('home')}
            className={`px-3 py-1 font-bold text-xs transition-colors ${
              currentView === 'home' 
                ? 'text-white underline' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            HOME
          </button>
          <button 
            onClick={() => setCurrentView('resultados')}
            className={`px-3 py-1 font-bold text-xs transition-colors ${
              currentView === 'resultados' 
                ? 'text-white underline' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            RESULTADOS
          </button>
          <button 
            onClick={() => setCurrentView('pilotos')}
            className={`px-3 py-1 font-bold text-xs transition-colors ${
              currentView === 'pilotos' 
                ? 'text-white underline' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PILOTOS
          </button>
        </div>
      </nav>

      {/* BOTONES DE ACCIÓN PRINCIPALES */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setCurrentView('pilotos')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
          >
            🏎 PILOTOS
          </button>
          
          <div className="relative">
            <button 
              onClick={() => {
                setCurrentView('campeonato');
                setCampeonatoOpen(!campeonatoOpen);
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
            >
              🏆 CAMPEONATO ▼
            </button>
            
            {campeonatoOpen && currentView === 'campeonato' && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded shadow-lg border border-gray-700 overflow-hidden z-10 min-w-max">
                <button
                  onClick={() => {
                    setCampeonatoSubView('pilotos');
                    setCampeonatoOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors border-b border-gray-700 text-xs"
                >
                  🏎 Campeonato de Pilotos
                </button>
                <button
                  onClick={() => {
                    setCampeonatoSubView('equipos');
                    setCampeonatoOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors border-b border-gray-700 text-xs"
                >
                  👥 Campeonato de Equipos
                </button>
                <button
                  onClick={() => {
                    setCampeonatoSubView('fabricantes');
                    setCampeonatoOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors text-xs"
                >
                  🏭 Campeonato de Fabricantes
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setCurrentView('calendario')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
          >
            📅 CALENDARIO
          </button>
          <button 
            onClick={() => setCurrentView('reglamento')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
          >
            📋 REGLAMENTO
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="p-4">
        {renderView()}
      </div>
    </div>
  );
}