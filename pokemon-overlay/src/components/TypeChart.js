import React from 'react';

const TypeChart = () => {
  // Lokales Bild (empfohlen) - du musst das Bild vorher in den public-Ordner kopieren
  const imageUrl = `${process.env.PUBLIC_URL}/images/typechart-gen2345.png`;
  
  // Falls du das Bild noch nicht heruntergeladen hast, erstmal mit dem externen Link:
  // const imageUrl = "https://img.pokemondb.net/images/typechart-gen2345.png";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Typentabelle (Generation 2-5)</h2>
      <p style={styles.subtitle}>
        Effektivität von Angriffstypen gegen Verteidigungstypen
      </p>
      
      <div style={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt="Pokémon Typentabelle Generation 2-5"
          style={styles.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.alt = "Bild konnte nicht geladen werden. Bitte überprüfe den Bild-Link.";
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Legende */}
      <div style={styles.legend}>
        <h3 style={styles.legendTitle}>Legende:</h3>
        <div style={styles.legendGrid}>
          <div style={styles.legendItem}>
            <span style={{...styles.legendColor, backgroundColor: '#4CAF50'}}></span>
            <span>2x Schaden</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{...styles.legendColor, backgroundColor: '#ff4444'}}></span>
            <span>0.5x Schaden</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{...styles.legendColor, backgroundColor: '#666'}}></span>
            <span>0x Schaden (immun)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  title: {
    color: '#333',
    margin: '0 0 10px 0',
    borderBottom: '2px solid #4CAF50',
    paddingBottom: '10px'
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '20px'
  },
  imageWrapper: {
    maxWidth: '100%',
    overflowX: 'auto',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  legend: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  legendTitle: {
    color: '#333',
    margin: '0 0 15px 0',
    fontSize: '16px'
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#666'
  },
  legendColor: {
    width: '20px',
    height: '20px',
    borderRadius: '4px'
  }
};

export default TypeChart;