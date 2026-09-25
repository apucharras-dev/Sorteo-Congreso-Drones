import { useRaffle } from '../context/RaffleContext';
import Logo from './Logo';
import { LoadedBanner } from './LoadScreen';
import PrizeCard from './PrizeCard';
import DemoBanner from './DemoBanner';

export default function MainScreen({ onViewList, onHistory, onFullscreen }) {
  const { state, stats } = useRaffle();

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

      <div className="main-screen__toolbar">
        <button
          className="btn btn--ghost btn--small"
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
