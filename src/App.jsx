import { useState, useEffect } from 'react';

/* =======================
   HOME VIEW
======================= */
function HomeView() {
  return (
    <div>
      <h1>NASCAR GAMING SERIES</h1>
      <p>Bienvenido al sistema oficial.</p>
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
    <div style={{ background: '#111', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setCurrentView('home')}>HOME</button>
        <button onClick={() => setCurrentView('resultados')}>RESULTADOS</button>
        <button onClick={() => setCurrentView('pilotos')}>PILOTOS</button>
      </nav>
      {renderView()}
    </div>
  );
}
