import React, { useMemo } from "react";
import { POKEMON } from "../pokemonList";
import Select from 'react-select';

// Individuelle Optionen mit Bild
const pokemonOptions = POKEMON.map(p => ({
  value: p.id,
  label: `#${p.id.toString().padStart(3, '0')} - ${p.name}`,
  // Bild-URL für die Anzeige
  image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`
}));

// Benutzerdefinierte Formatierung für die Optionen (mit Warnhinweis)
const formatOptionLabel = ({ label, image, warnings }, { context }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img 
      src={image} 
      alt={label} 
      width={30} 
      height={30}
      style={{ imageRendering: 'pixelated', opacity: warnings?.length ? 0.6 : 1 }}
    />
    <div style={{ textAlign: 'left' }}>
      <span>{warnings?.length ? '⚠️ ' : ''}{label}</span>
      {context === 'menu' && warnings?.length > 0 && (
        <div style={{ fontSize: '11px', color: '#e65100' }}>{warnings[0]}</div>
      )}
    </div>
  </div>
);

export default function PlayerBox({ 
  playerKey, 
  teamPokemon = [], 
  selected, 
  onSelect, 
  onRemove,
  onEdit,
  onLevelChange,
  getWarnings = () => []
}) {
  // Optionen inkl. Warnungen (verbrauchte Pokémon / eigene Entwicklungslinie)
  const optionsWithWarnings = useMemo(
    () => pokemonOptions.map(o => ({ ...o, warnings: getWarnings(o.value) })),
    [getWarnings]
  );
  const selectedWarnings = selected ? getWarnings(selected.id) : [];

  const currentValue = selected ? {
    value: selected.id,
    label: `#${selected.id.toString().padStart(3, '0')} - ${selected.name}`,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected.id}.png`
  } : null;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{playerKey}</h2>
      
      {/* Team anzeigen */}
      <div style={styles.teamSection}>
        <h3 style={styles.sectionTitle}>
          Team ({teamPokemon.length} Pokémon)
        </h3>
        {teamPokemon.map((pokemon, index) => (
          <div key={index} style={styles.pokemonRow}>
            <div style={styles.pokemonInfo}>
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={pokemon.name}
                width={40}
                height={40}
                style={{ imageRendering: 'pixelated' }}
              />
              <div style={styles.pokemonDetails}>
                <div style={styles.pokemonName}>
                  <span style={styles.pokemonIndex}>{index + 1}.</span>
                  #{pokemon.id.toString().padStart(3, '0')} - {pokemon.name}
                </div>
              </div>
            </div>
            <div style={styles.buttonGroup}>
              {/* NEU: Info-Button */}
              <button 
                onClick={() => {
                  // ID auf 3 Stellen formatieren (6 -> 006, 25 -> 025, 150 -> 150)
                  const formattedId = pokemon.id.toString().padStart(3, '0');
                  window.open(`https://www.bisafans.de/pokedex/${formattedId}.php#attacken`, '_blank');
                }}
                style={styles.infoButton}
                title="Auf Bisafans ansehen"
              >
                ℹ️
              </button>
              <button 
                onClick={() => onEdit(index, pokemon)}
                style={styles.editButton}
                title="Pokémon entwickeln"
              >
                ✎
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* React-Select mit Bildern */}
      <div style={styles.selectionSection}>
        <h3 style={styles.sectionTitle}>
          Neues Pokémon für Link:
        </h3>
        <Select
          options={optionsWithWarnings}
          value={currentValue}
          onChange={(option) => {
            if (option && onSelect) {
              const pokemon = POKEMON.find(p => p.id === option.value);
              onSelect({ 
                id: pokemon.id, 
                name: pokemon.name,
                level: 1 
              });
            }
          }}
          formatOptionLabel={formatOptionLabel}
          placeholder="-- Pokémon suchen oder wählen --"
          isSearchable={true}
          styles={{
            control: (base) => ({
              ...base,
              marginBottom: '15px',
              borderRadius: '8px',
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              maxHeight: '400px',
              overflow: 'hidden'
            }),
            menuList: (base) => ({
              ...base,
              maxHeight: '350px',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }),
            option: (base, { isFocused, isSelected, data }) => ({
              ...base,
              backgroundColor: isSelected ? '#4CAF50'
                : data.warnings?.length ? (isFocused ? '#ffe0b2' : '#fff3e0')
                : isFocused ? '#f0f0f0' : 'white',
              color: isSelected ? 'white' : 'black',
              cursor: 'pointer',
              padding: '8px 12px',
              '&:active': {
                backgroundColor: isSelected ? '#45a049' : '#e0e0e0',
              },
            }),
          }}
        />

        {selected && (
          <div style={styles.selectedPreview}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected.id}.png`}
              alt={selected.name}
              width={80}
              height={80}
              style={{ 
                ...styles.selectedImage,
                imageRendering: 'pixelated'
              }}
            />
            <div style={styles.selectedName}>
              #{selected.id.toString().padStart(3, '0')} - {selected.name} ausgewählt
            </div>
          </div>
        )}

        {selectedWarnings.length > 0 && (
          <div style={styles.warningBox}>
            <strong>⚠️ Achtung – Pokémon bereits verbraucht:</strong>
            <ul style={styles.warningList}>
              {selectedWarnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles (bleiben gleich, nur imageRendering hinzugefügt)
const styles = {
  container: {
    textAlign: "center",
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    padding: "20px",
    minWidth: "280px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
  },
  title: {
    marginTop: 0,
    color: "#333",
    borderBottom: "2px solid #4CAF50",
    paddingBottom: "10px"
  },
  teamSection: {
    marginBottom: "20px"
  },
  sectionTitle: {
    margin: "10px 0",
    color: "#666",
    fontSize: "16px"
  },
  pokemonRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
    padding: "8px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px"
  },
  pokemonInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1
  },
  pokemonDetails: {
    textAlign: "left"
  },
  pokemonName: {
    fontWeight: "bold",
    color: "#333"
  },
  pokemonIndex: {
    display: "inline-block",
    minWidth: "24px",
    color: "#4CAF50",
    fontWeight: "bold",
    marginRight: "6px"
  },
  buttonGroup: {
    display: "flex",
    gap: "5px",
    marginLeft: "auto"
  },
  editButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    transition: "all 0.3s",
    ":hover": {
      backgroundColor: "#45a049"
    }
  },
  removeButton: {
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.3s",
    ":hover": {
      backgroundColor: "#cc0000"
    }
  },
  selectionSection: {
    borderTop: "2px dashed #e0e0e0",
    paddingTop: "20px"
  },
  select: {
    padding: "10px",
    width: "100%",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px"
  },
  selectedPreview: {
    textAlign: "center"
  },
  selectedImage: {
    display: "block",
    margin: "10px auto",
    border: "2px solid #4CAF50",
    borderRadius: "50%",
    padding: "5px"
  },
  selectedName: {
    fontWeight: "bold",
    color: "#4CAF50"
  },
  warningBox: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#fff3e0",
    border: "1px solid #ff9800",
    borderRadius: "8px",
    color: "#e65100",
    fontSize: "13px",
    textAlign: "left"
  },
  warningList: {
    margin: "6px 0 0 0",
    paddingLeft: "18px"
  },
  infoButton: {
    backgroundColor: "#2196F3",  // Blau
    color: "white",
    border: "none",
    borderRadius: "4px",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    transition: "all 0.3s",
    ":hover": {
      backgroundColor: "#1976D2",
      transform: "scale(1.1)"
    }
  }
};