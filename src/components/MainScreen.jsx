import { useState } from 'react';
import { useRaffle } from '../context/RaffleContext';
import Logo from './Logo';
import { LoadedBanner } from './LoadScreen';
import ExcelLoadButton from './ExcelLoadButton';
import PrizeCard from './PrizeCard';
import DemoBanner from './DemoBanner';

export default function MainScreen({ onViewList, onHistory, onFullscreen }) {
  const { state, stats } = useRaffle();
  const [listNotice, setListNotice] = useState(null);

  return (
    <div className="main-screen">
      {state.demoMode && <DemoBanner />}

      <header className="main-screen__header">
        <Logo size="medium" />
        <p className="hero-subtitle hero-subtitle--compact">Tucumán, Argentina</p>
        <h1 className="hero-heading hero-heading--compact">
          <span className="hero-heading__sorteo">Sorteo</span>
          <span className="hero-heading__oficial">Oficial</span>
        </h1>
      </header>

      <LoadedBanner count={stats.total} onViewList={onViewList} />

      <div className="main-screen__prizes">
        {state.premios.map((premio) => (
          <PrizeCard key={premio.id} premio={premio} />
        ))}
      </div>

      {state.importWarnings?.length > 0 && (
        <div className="main-screen__notices">
          {state.importWarnings.map((msg) => (
            <div key={msg} className="alert alert--warning main-screen__notice">
              {msg}
            </div>
          ))}
        </div>
      )}

      {listNotice && <div className="alert alert--success main-screen__notice">{listNotice}</div>}

      <div className="main-screen__toolbar">
        <ExcelLoadButton
          className="btn btn--secondary btn--small"
          label="Cargar otro Excel"
          onLoaded={({ count }) => {
            setListNotice(`Listado actualizado: ${count} participante(s).`);
          }}
        />
        <button
          className="btn btn--ghost btn--small"
          type="button"
          onClick={onViewList}
          title="Ver participantes"
        >
          Participantes →
        </button>
        <button
          className="btn btn--ghost btn--small"
          type="button"
          onClick={onHistory}
          title="Historial"
        >
          Historial →
        </button>
        <button
          className="btn btn--ghost btn--small toolbar-btn--fullscreen"
          onClick={onFullscreen}
          title="Pantalla completa"
        >
          Pantalla completa →
        </button>
      </div>
    </div>
  );
}
