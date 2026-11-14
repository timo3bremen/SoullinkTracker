import React from 'react';

const LinkList = ({ links, onDeleteClick, isLoading, onToggleActive }) => {
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
              <div style={styles.pokemonRow}>
                <span style={styles.playerLabel}>Spieler 1</span>
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${link.pokemon1?.id}.png`} 
                  width={30} 
                  height={30}
                  alt={link.pokemon1?.name}
                  style={styles.pokemonSprite}
                />
                <span style={styles.pokemonName}>
                  {link.pokemon1?.name}
                </span>
              </div>
              
              <div style={styles.pokemonRow}>
                <span style={styles.playerLabel}>Spieler 2</span>
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${link.pokemon2?.id}.png`} 
                  width={30} 
                  height={30}
                  alt={link.pokemon2?.name}
                  style={styles.pokemonSprite}
                />
                <span style={styles.pokemonName}>
                  {link.pokemon2?.name}
                </span>
              </div>
              
              <div style={styles.pokemonRow}>
                <span style={styles.playerLabel}>Spieler 3</span>
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${link.pokemon3?.id}.png`} 
                  width={30} 
                  height={30}
                  alt={link.pokemon3?.name}
                  style={styles.pokemonSprite}
                />
                <span style={styles.pokemonName}>
                  {link.pokemon3?.name}
                </span>
              </div>
            </div>

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