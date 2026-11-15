import React, { useState } from 'react';
import { POKEMON } from '../pokemonList';
import { getNextEvolutions } from '../evolutions';
import { slotOf, originalIdOf, originalNameOf } from '../soullinkRules';

const PLAYERS = [
  { key: 'player1', label: 'Spieler 1' },
  { key: 'player2', label: 'Spieler 2' },
  { key: 'player3', label: 'Spieler 3' }
];

const nameOf = (id) => POKEMON.find(p => p.id === id)?.name || `#${id}`;

const LinkList = ({ links, onDeleteClick, isLoading, onToggleActive, onEvolve }) => {
  // Offene Auswahl bei verzweigten Entwicklungen: { timestamp, key }
  const [branchChoice, setBranchChoice] = useState(null);

  if (links.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h2>Aktive Soullinks</h2>
        <p>Noch keine Soullinks vorhanden.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={styles.title}>
        Soullinks ({links.length})
      </h2>
      
      <div style={styles.grid}>
        {links.map((link, index) => (
          <div key={index} style={{
            ...styles.card,
            opacity: link.active === false ? 0.7 : 1,
            backgroundColor: link.active === false ? '#f5f5f5' : 'white'
          }}>
            {/* Aktiv/Inaktiv Toggle mit Haken/Kreuz */}
            <button
              onClick={() => onToggleActive(link)}
              style={styles.activeToggle}
              title={link.active ? 'Als inaktiv markieren' : 'Als aktiv markieren'}
            >
              {link.active ? '✅' : '❌'}
            </button>

            {/* Pokémon der Spieler */}
            <div style={styles.pokemonList}>
              {PLAYERS.map(({ key, label }) => {
                const p = link[slotOf(key)];
                if (!p) return null;
                const nextEvos = getNextEvolutions(p.id);
                const evolved = originalIdOf(p) !== p.id;
                const choosing = branchChoice?.timestamp === link.timestamp && branchChoice?.key === key;

                const handleEvolve = () => {
                  if (nextEvos.length === 1) {
                    onEvolve(link, key, nextEvos[0]);
                  } else {
                    setBranchChoice(choosing ? null : { timestamp: link.timestamp, key });
                  }
                };

                return (
                  <div key={key}>
                    <div style={styles.pokemonRow}>
                      <span style={styles.playerLabel}>{label}</span>
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} 
                        width={30} 
                        height={30}
                        alt={p.name}
                        style={styles.pokemonSprite}
                      />
                      <div style={styles.nameBlock}>
                        <span style={styles.pokemonName}>{p.name}</span>
                        {evolved && (
                          <span style={styles.originalName}>Gefangen als {originalNameOf(p)}</span>
                        )}
                      </div>
                      <button
                        onClick={handleEvolve}
                        disabled={isLoading || nextEvos.length === 0}
                        style={{
                          ...styles.evolveButton,
                          ...(nextEvos.length === 0 ? styles.evolveButtonDisabled : {})
                        }}
                        title={nextEvos.length === 0
                          ? 'Keine weitere Entwicklung'
                          : `Entwickeln zu ${nextEvos.map(nameOf).join(' / ')}`}
                      >
                        Entwicklung
                      </button>
                    </div>

                    {/* Auswahl bei verzweigten Entwicklungen (z.B. Evoli) */}
                    {choosing && (
                      <div style={styles.branchChoice}>
                        {nextEvos.map((id) => (
                          <button
                            key={id}
                            style={styles.branchButton}
                            disabled={isLoading}
                            onClick={() => {
                              setBranchChoice(null);
                              onEvolve(link, key, id);
                            }}
                          >
                            <img
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                              width={24}
                              height={24}
                              alt={nameOf(id)}
                              style={styles.pokemonSprite}
                            />
                            {nameOf(id)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Original-Link (wie gefangen) */}
            {PLAYERS.some(({ key }) => link[slotOf(key)] && originalIdOf(link[slotOf(key)]) !== link[slotOf(key)].id) && (
              <div style={styles.originalLink}>
                Original-Link: {PLAYERS.map(({ key }) => link[slotOf(key)] ? originalNameOf(link[slotOf(key)]) : '–').join(', ')}
              </div>
            )}

            {/* Route und Löschen */}
            <div style={styles.footer}>
              <div style={styles.routeInfo}>
                <span style={styles.routeBadge}>📍 {link.route}</span>
                {link.timestamp && (
                  <span style={styles.date}>
                    {new Date(link.timestamp).toLocaleDateString('de-DE')}
                  </span>
                )}
              </div>
             <button
              onClick={() => onDeleteClick(link)}
              disabled={isLoading}
              style={styles.deleteButton}
              title="Soullink löschen"
            >
              ×
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  title: {
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #4CAF50',
    paddingBottom: '10px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px'
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'relative',
    transition: 'all 0.3s'
  },
  activeToggle: {
    position: 'absolute',
    top: '10px',
    right: '45px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
    zIndex: 2
  },
  pokemonList: {
    marginTop: '30px',
    marginBottom: '15px'
  },
  pokemonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
    padding: '5px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px'
  },
  playerLabel: {
    fontWeight: 'bold',
    color: '#4CAF50',
    minWidth: '70px',
    fontSize: '13px'
  },
  pokemonSprite: {
    imageRendering: 'pixelated'
  },
  pokemonName: {
    color: '#333',
    fontSize: '13px'
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textAlign: 'left'
  },
  originalName: {
    fontSize: '10px',
    color: '#888',
    fontStyle: 'italic'
  },
  evolveButton: {
    backgroundColor: '#7E57C2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  evolveButtonDisabled: {
    backgroundColor: '#cccccc',
    color: '#888',
    cursor: 'not-allowed'
  },
  branchChoice: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    margin: '-4px 0 8px 0',
    padding: '6px',
    backgroundColor: '#ede7f6',
    borderRadius: '4px'
  },
  branchButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'white',
    border: '1px solid #7E57C2',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '11px',
    cursor: 'pointer'
  },
  originalLink: {
    fontSize: '11px',
    color: '#666',
    backgroundColor: '#fafafa',
    border: '1px dashed #ddd',
    borderRadius: '4px',
    padding: '5px 8px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #eee'
  },
  routeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  routeBadge: {
    backgroundColor: '#ff9800',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    display: 'inline-block',
    width: 'fit-content'
  },
  date: {
    fontSize: '10px',
    color: '#999'
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: '#cc0000'
    }
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    color: '#666'
  }
};

export default LinkList;