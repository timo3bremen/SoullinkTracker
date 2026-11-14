import React from "react";

export default function HistoryList({ deletedLinks, onRestoreLink, onDeleteEntry, onClearHistory, isLoading }) {
  if (!deletedLinks || deletedLinks.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h2>History</h2>
        <p>Noch keine verloren Links vorhanden.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Unbekannt";
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>
          Gelöschte Soullinks ({deletedLinks.length})
        </h2>
      </div>
      
      <div style={styles.grid}>
        {deletedLinks.map((link, index) => (
          <div key={index} style={styles.card}>
            {/* Buttons */}
            <div style={styles.buttonGroup}>
              <button
                onClick={() => onRestoreLink(index)}
                disabled={isLoading}
                style={styles.restoreButton}
                title="Soullink wiederherstellen"
              >
                ↩️ Wiederherstellen
              </button>
              <button
                onClick={() => onDeleteEntry(index)}
                disabled={isLoading}
                style={styles.deleteButton}
                title="Endgültig löschen"
              >
                ×
              </button>
            </div>

            {/* Gelöscht am */}
            <div style={styles.deletedInfo}>
              <span style={styles.deletedLabel}>Gelöscht am:</span>
              <span style={styles.deletedDate}>{formatDate(link.deletedAt)}</span>
            </div>

            {/* Erstellt am */}
            {link.timestamp && (
              <div style={styles.createdInfo}>
                <span style={styles.createdLabel}>Erstellt am:</span>
                <span style={styles.createdDate}>{formatDate(link.timestamp)}</span>
              </div>
            )}

            {/* Pokémon der Spieler */}
            <div style={styles.pokemonList}>
              <div style={styles.pokemonRow}>
                <span style={styles.playerLabel}>Timo</span>
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
                <span style={styles.playerLabel}>Basti</span>
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
                <span style={styles.playerLabel}>Milian</span>
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

            {/* Typ */}
            <div style={styles.footer}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={styles.typeBadge}>{link.type}</span>
                {link.route && (
                  <span style={styles.routeBadge}>📍 {link.route}</span>
                )}
              </div>
            </div>
            <div style={styles.footer}>
              <span style={styles.typeBadge}>
                {link.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  emptyState: {
    textAlign: "center",
    padding: "60px 40px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    color: "#666"
  },
  hint: {
    fontSize: "14px",
    color: "#999",
    marginTop: "10px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  title: {
    color: "#333",
    margin: 0
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px"
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "#fff8f8",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    position: "relative",
    transition: "all 0.3s",
    ":hover": {
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    justifyContent: "flex-end"
  },
  restoreButton: {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.3s",
    ":hover": {
      backgroundColor: "#45a049"
    },
    ":disabled": {
      backgroundColor: "#cccccc",
      cursor: "not-allowed"
    }
  },
  deleteButton: {
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
    },
    ":disabled": {
      backgroundColor: "#cccccc",
      cursor: "not-allowed"
    }
  },
  deletedInfo: {
    backgroundColor: "#ffebee",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "10px",
    fontSize: "13px",
    display: "flex",
    justifyContent: "space-between"
  },
  deletedLabel: {
    color: "#c62828",
    fontWeight: "bold"
  },
  deletedDate: {
    color: "#c62828"
  },
  createdInfo: {
    backgroundColor: "#e3f2fd",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "13px",
    display: "flex",
    justifyContent: "space-between"
  },
  createdLabel: {
    color: "#1565c0",
    fontWeight: "bold"
  },
  createdDate: {
    color: "#1565c0"
  },
  pokemonList: {
    marginBottom: "15px"
  },
  // Diese Styles existieren bereits, aber anpassen:
  pokemonRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    borderRadius: "6px"
  },
  playerLabel: {
    fontWeight: "bold",
    color: "#4CAF50",
    minWidth: "70px",  // Gleiche Breite wie in LinkList
    fontSize: "14px"
  },
  pokemonSprite: {
    imageRendering: "pixelated",
    display: "block"
  },
  pokemonName: {
    color: "#333",
    fontSize: "14px"
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #eee"
  },
  typeBadge: {
    backgroundColor: "#ff4444",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold"
  }
};