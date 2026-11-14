import React from 'react';

const TeamHeader = ({ team }) => {
  const getGifUrl = (pokemonId) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;
  };

  // NEU: Funktion zum Öffnen von Bisafans
  const openBisafans = (pokemonId) => {
    const formattedId = pokemonId.toString().padStart(3, '0');
    window.open(`https://www.bisafans.de/pokedex/${formattedId}.php`, '_blank');
  };

  // Sammle alle aktiven Pokémon aus Links mit active=true
  const getActivePokemonForPlayer = (playerKey) => {
    if (!team.links) return [];
    
    const activePokemon = [];
    team.links.forEach(link => {
      if (link.active !== false) {
        if (playerKey === 'player1' && link.pokemon1) {
          activePokemon.push(link.pokemon1);
        } else if (playerKey === 'player2' && link.pokemon2) {
          activePokemon.push(link.pokemon2);
        } else if (playerKey === 'player3' && link.pokemon3) {
          activePokemon.push(link.pokemon3);
        }
      }
    });
    return activePokemon.slice(0, 6);
  };

  const activePlayer1 = getActivePokemonForPlayer('player1');
  const activePlayer2 = getActivePokemonForPlayer('player2');
  const activePlayer3 = getActivePokemonForPlayer('player3');

  // Verluste pro Spieler zählen
  const getLostCount = (playerKey) => {
    if (!team.deletedLinks) return 0;
    return team.deletedLinks.filter(link => link.lostBy === playerKey).length;
  };

  return (
    <div style={styles.container}>
      <div style={styles.teamSection}>
        {/* Spieler 1 */}
        <div style={styles.playerColumn}>
          <h4 style={styles.playerTitle}>Timo (aktiv)</h4>
          <div style={styles.pokemonGrid}>
            {activePlayer1.map((pokemon, index) => (
              <div 
                key={index} 
                style={styles.pokemonCard}
                onClick={() => openBisafans(pokemon.id)}  // <-- NEU: Klick öffnet Bisafans
                title={`${pokemon.name} auf Bisafans ansehen`}
              >
                <img 
                  src={getGifUrl(pokemon.id)}
                  alt={pokemon.name}
                  style={styles.pokemonGif}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  }}
                />
              </div>
            ))}
            {[...Array(6 - activePlayer1.length)].map((_, i) => (
              <div key={`empty-${i}`} style={styles.emptySlot}>
                <span style={styles.emptySlotText}>?</span>
              </div>
            ))}
          </div>
          <div style={styles.counter}>
            {activePlayer1.length}/6 aktiv
            {getLostCount('player1') > 0 && (
              <span style={styles.lostBadge}> 💀 {getLostCount('player1')}</span>
            )}
          </div>
        </div>

        {/* Spieler 2 - gleiche Änderung */}
        <div style={styles.playerColumn}>
          <h4 style={styles.playerTitle}>Basti (aktiv)</h4>
          <div style={styles.pokemonGrid}>
            {activePlayer2.map((pokemon, index) => (
              <div 
                key={index} 
                style={styles.pokemonCard}
                onClick={() => openBisafans(pokemon.id)}
                title={`${pokemon.name} auf Bisafans ansehen`}
              >
                <img 
                  src={getGifUrl(pokemon.id)}
                  alt={pokemon.name}
                  style={styles.pokemonGif}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  }}
                />
              </div>
            ))}
            {[...Array(6 - activePlayer2.length)].map((_, i) => (
              <div key={`empty-${i}`} style={styles.emptySlot}>
                <span style={styles.emptySlotText}>?</span>
              </div>
            ))}
          </div>
          <div style={styles.counter}>
            {activePlayer2.length}/6 aktiv
            {getLostCount('player2') > 0 && (
              <span style={styles.lostBadge}> 💀 {getLostCount('player2')}</span>
            )}
          </div>
        </div>

        {/* Spieler 3 - gleiche Änderung */}
        <div style={styles.playerColumn}>
          <h4 style={styles.playerTitle}>Milian (aktiv)</h4>
          <div style={styles.pokemonGrid}>
            {activePlayer3.map((pokemon, index) => (
              <div 
                key={index} 
                style={styles.pokemonCard}
                onClick={() => openBisafans(pokemon.id)}
                title={`${pokemon.name} auf Bisafans ansehen`}
              >
                <img 
                  src={getGifUrl(pokemon.id)}
                  alt={pokemon.name}
                  style={styles.pokemonGif}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  }}
                />
              </div>
            ))}
            {[...Array(6 - activePlayer3.length)].map((_, i) => (
              <div key={`empty-${i}`} style={styles.emptySlot}>
                <span style={styles.emptySlotText}>?</span>
              </div>
            ))}
          </div>
          <div style={styles.counter}>
            {activePlayer3.length}/6 aktiv
            {getLostCount('player3') > 0 && (
              <span style={styles.lostBadge}> 💀 {getLostCount('player3')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0'
  },
  teamSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '10px'
  },
  playerColumn: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  playerTitle: {
    margin: '0 0 10px 0',
    color: '#4CAF50',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  pokemonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '5px',
    marginBottom: '8px'
  },
  pokemonCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    padding: '5px',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',  // <-- Zeigt an, dass es klickbar ist
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }
  },
  pokemonGif: {
    width: '40px',
    height: '40px',
    objectFit: 'contain',
    imageRendering: 'pixelated'
  },
  emptySlot: {
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    padding: '5px',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5
  },
  emptySlotText: {
    color: '#999',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  counter: {
    fontSize: '12px',
    color: '#666',
    fontWeight: 'bold'
  },
  lostBadge: {
    color: '#ff4444',
    fontSize: '11px',
    marginLeft: '5px'
  }
};

export default TeamHeader;