import { useState } from 'react';

/* =========================
   HOME VIEW
========================= */
function HomeView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>NASCAR GAMING SERIES</h1>
      <p>HOME VIEW</p>
    </div>
  );
}

/* =========================
   HOME VIEW DOS
========================= */
function HomeViewDos() {
  return (
    <div style={{ padding: 40 }}>
      <h1>HOME VIEW DOS</h1>
    </div>
  );
}

/* =========================
   RESULTADOS VIEW
========================= */
function ResultadosView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>RESULTADOS VIEW</h1>
    </div>
  );
}

/* =========================
   CAMPEONATO FABRICANTES VIEW
========================= */
function CampeonatoFabricantesView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>CAMPEONATO DE FABRICANTES</h1>
    </div>
  );
}

/* =========================
   CAMPEONATO EQUIPOS VIEW
========================= */
function CampeonatoEquiposView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>CAMPEONATO DE EQUIPOS</h1>
    </div>
  );
}

/* =========================
   CALENDARIO VIEW
========================= */
function CalendarioView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>CALENDARIO VIEW</h1>
    </div>
  );
}

/* =========================
   REGLAMENTO VIEW
========================= */
function ReglamentoView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>REGLAMENTO VIEW</h1>
    </div>
  );
}

/* =========================
   ESTADISTICAS VIEW
========================= */
function EstadisticasView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>ESTADISTICAS VIEW</h1>
    </div>
  );
}

/* =========================
   DESCARGAS VIEW
========================= */
function DescargasView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>DESCARGAS VIEW</h1>
    </div>
  );
}

/* =========================
   LICENCIAS VIEW
========================= */
function LicenciasView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>LICENCIAS VIEW</h1>
    </div>
  );
}

/* =========================
   PILOTOS VIEW
========================= */
function PilotosView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>PILOTOS VIEW</h1>
    </div>
  );
}

/* =========================
   APP
========================= */
export default function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'home2':
        return <HomeViewDos />;
      case 'resultados':
        return <ResultadosView />;
      case 'campeonato-fabricantes':
        return <CampeonatoFabricantesView />;
      case 'campeonato-equipos':
        return <CampeonatoEquiposView />;
      case 'calendario':
        return <CalendarioView />;
      case 'reglamento':
        return <ReglamentoView />;
      case 'estadisticas':
        return <EstadisticasView />;
      case 'descargas':
        return <DescargasView />;
      case 'licencias':
        return <LicenciasView />;
      case 'pilotos':
        return <PilotosView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff' }}>
      <nav style={{ padding: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => setCurrentView('home')}>HOME</button>
        <button onClick={() => setCurrentView('home2')}>HOME 2</button>
        <button onClick={() => setCurrentView('resultados')}>RESULTADOS</button>
        <button onClick={() => setCurrentView('campeonato-fabricantes')}>FABRICANTES</button>
        <button onClick={() => setCurrentView('campeonato-equipos')}>EQUIPOS</button>
        <button onClick={() => setCurrentView('calendario')}>CALENDARIO</button>
        <button onClick={() => setCurrentView('reglamento')}>REGLAMENTO</button>
        <button onClick={() => setCurrentView('estadisticas')}>ESTADISTICAS</button>
        <button onClick={() => setCurrentView('descargas')}>DESCARGAS</button>
        <button onClick={() => setCurrentView('licencias')}>LICENCIAS</button>
        <button onClick={() => setCurrentView('pilotos')}>PILOTOS</button>
      </nav>

      {renderView()}
    </div>
  );
}
