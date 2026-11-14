import React, { useState } from "react";
import { POKEMON } from "../pokemonList";

export default function EditPokemonModal({ isOpen, onClose, pokemon, onSave }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(pokemon?.id || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen || !pokemon) return null;

  // Gefilterte Pokémon basierend auf Suchbegriff
  const filteredPokemon = POKEMON.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  ).slice(0, 50); // Erste 50 Ergebnisse

  const handleSelect = (p) => {
    setSelectedPokemon(p.id);
    setSearchTerm(`${p.id.toString().padStart(3, '0')} - ${p.name}`);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    const newPokemon = POKEMON.find(p => p.id === parseInt(selectedPokemon));
    if (newPokemon) {
      onSave({
        id: newPokemon.id,
        name: newPokemon.name
      });
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
      
        <h2 style={styles.title}>Pokémon entwickeln</h2>
        
        <div style={styles.content}>
          {/* Aktuelles Pokémon */}
          <div style={styles.currentPokemon}>
            <h3 style={styles.subtitle}>Aktuell:</h3>
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt={pokemon.name}
              width={96}
              style={styles.sprite}
            />
            <div style={styles.name}>
              #{pokemon.id.toString().padStart(3, '0')} - {pokemon.name}
            </div>
          </div>

          <div style={styles.arrow}>→</div>

          {/* Neue Entwicklung mit Suchfeld */}
          <div style={styles.newPokemon}>
            <h3 style={styles.subtitle}>Entwicklung:</h3>
            
            {/* Suchfeld */}
            <input
              type="text"
              placeholder="Nach Name oder ID suchen..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              style={styles.searchInput}
            />
            
            {/* Dropdown mit Ergebnissen */}
            {isDropdownOpen && (
              <div style={styles.dropdown}>
                {filteredPokemon.length > 0 ? (
                  filteredPokemon.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      style={{
                        ...styles.dropdownItem,
                        ...(selectedPokemon === p.id ? styles.selectedItem : {})
                      }}
                    >
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                        alt={p.name}
                        width={30}
                        style={styles.itemSprite}
                      />
                      <span>#{p.id.toString().padStart(3, '0')} - {p.name}</span>
                    </div>
                  ))
                ) : (
                  <div style={styles.noResults}>
                    Keine Pokémon gefunden
                  </div>
                )}
              </div>
            )}

            {/* Ausgewähltes Pokémon anzeigen */}
            {selectedPokemon && !isDropdownOpen && (
              <div style={styles.selectedPreview}>
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon}.png`}
                  alt="Entwicklung"
                  width={80}
                  style={styles.previewSprite}
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonContainer}>
          <button onClick={onClose} style={styles.cancelButton}>
            Abbrechen
          </button>
          <button 
            onClick={handleSave} 
            style={styles.saveButton}
            disabled={!selectedPokemon}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
  },
  title: {
    margin: "0 0 20px 0",
    color: "#333",
    textAlign: "center",
    borderBottom: "2px solid #4CAF50",
    paddingBottom: "10px"
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  currentPokemon: {
    flex: 1,
    textAlign: "center",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px"
  },
  newPokemon: {
    flex: 1,
    textAlign: "center",
    padding: "15px",
    backgroundColor: "#e8f5e8",
    borderRadius: "8px",
    position: "relative"
  },
  subtitle: {
    margin: "0 0 10px 0",
    color: "#666",
    fontSize: "14px"
  },
  sprite: {
    display: "block",
    margin: "10px auto",
    imageRendering: "pixelated"
  },
  name: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
    fontSize: "14px"
  },
  arrow: {
    fontSize: "32px",
    color: "#4CAF50",
    fontWeight: "bold"
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "5px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  dropdown: {
    position: "absolute",
    width: "calc(100% - 30px)",
    maxHeight: "250px",
    overflowY: "auto",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "4px",
    zIndex: 10,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f5f5f5"
    }
  },
  selectedItem: {
    backgroundColor: "#e8f5e8"
  },
  itemSprite: {
    imageRendering: "pixelated"
  },
  noResults: {
    padding: "15px",
    textAlign: "center",
    color: "#999"
  },
  selectedPreview: {
    marginTop: "15px",
    textAlign: "center"
  },
  previewSprite: {
    imageRendering: "pixelated",
    border: "2px solid #4CAF50",
    borderRadius: "8px",
    padding: "5px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    borderTop: "1px solid #eee",
    paddingTop: "20px"
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#f5f5f5",
    color: "#666",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
    ":hover": {
      backgroundColor: "#e0e0e0"
    }
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
    ":hover": {
      backgroundColor: "#45a049"
    },
    ":disabled": {
      backgroundColor: "#cccccc",
      cursor: "not-allowed"
    }
  }
};