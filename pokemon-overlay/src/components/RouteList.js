import React from 'react';

const RouteList = ({ links, deletedLinks = [] }) => {
  // Alle Routen aus aktiven und gelöschten Links sammeln
  const allRoutes = [
    ...links.map(link => ({
      route: link.route,
      pokemon: [link.pokemon1, link.pokemon2, link.pokemon3],
      timestamp: link.timestamp,
      status: 'aktiv'
    })),
    ...deletedLinks.map(link => ({
      route: link.route,
      pokemon: [link.pokemon1, link.pokemon2, link.pokemon3],
      timestamp: link.deletedAt || link.timestamp,
      status: 'gelöscht'
    }))
  ].filter(entry => entry.route); // Nur Einträge mit Route

  // Gruppiere nach Routen
  const routesByRoute = allRoutes.reduce((acc, entry) => {
    const route = entry.route;
    if (!acc[route]) {
      acc[route] = [];
    }
    acc[route].push(entry);
    return acc;
  }, {});

  // Sortiere Routen alphabetisch
  const sortedRoutes = Object.keys(routesByRoute).sort();

  if (sortedRoutes.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h2>Routen 🗺️</h2>
        <p>Noch keine Routen erfasst.</p>
        <p style={styles.hint}>
          Bei jedem Soullink wird automatisch die Route gespeichert.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={styles.title}>Routen-Übersicht</h2>

          {/* NEU: Kompakte Zusammenfassung aller Routen */}
        <div style={styles.summaryContainer}>
          <h3 style={styles.summaryTitle}>📋 Routen im Überblick</h3>
          <div style={styles.summaryGrid}>
            {sortedRoutes.map(routeName => {
              const count = routesByRoute[routeName].length;
              const activeCount = routesByRoute[routeName].filter(r => r.status === 'aktiv').length;
              const deletedCount = count - activeCount;
              
              return (
                <div key={routeName} style={styles.summaryCard}>
                  <div style={styles.summaryRouteName}>{routeName}</div>
                  <div style={styles.summaryStats}>
                    <span style={styles.summaryTotal}>{count} Funde</span>
                    <div style={styles.summaryDetail}>
                      <span style={styles.summaryActive}>⚡ {activeCount}</span>
                      <span style={styles.summaryDeleted}>💀 {deletedCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      {sortedRoutes.map(routeName => (
        <div key={routeName} style={styles.routeSection}>
          <h3 style={styles.routeTitle}>
            📍 {routeName}
            <span style={styles.routeCount}>
              {routesByRoute[routeName].length} Funde
            </span>
          </h3>
          
          <div style={styles.routeGrid}>
            {routesByRoute[routeName].map((entry, index) => (
              <div key={index} style={styles.routeCard}>
                <div style={styles.cardHeader}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(entry.status === 'aktiv' ? styles.statusAktiv : styles.statusGelöscht)
                  }}>
                    {entry.status === 'aktiv' ? '⚡ Aktiv' : '💀 Gelöscht'}
                  </span>
                  <span style={styles.cardDate}>
                    {new Date(entry.timestamp).toLocaleDateString('de-DE')}
                  </span>
                </div>
                
                <div style={styles.pokemonList}>
                  {entry.pokemon.map((p, i) => p && (
                    <div key={i} style={styles.pokemonItem}>
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                        alt={p.name}
                        width={30}
                        style={styles.pokemonSprite}
                      />
                      <span style={styles.pokemonName}>
                        {p.name} (Lv.{p.level || 1})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Statistik */}
      <div style={styles.statsContainer}>
        <h4 style={styles.statsTitle}>Statistik</h4>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Verschiedene Routen:</span>
            <span style={styles.statValue}>{sortedRoutes.length}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Insgesamt gefunden:</span>
            <span style={styles.statValue}>{allRoutes.length}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Aktive Funde:</span>
            <span style={styles.statValue}>
              {allRoutes.filter(r => r.status === 'aktiv').length}
            </span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Gelöschte Funde:</span>
            <span style={styles.statValue}>
              {allRoutes.filter(r => r.status === 'gelöscht').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  title: {
    color: "#333",
    marginBottom: "30px",
    borderBottom: "2px solid #4CAF50",
    paddingBottom: "10px"
  },
  routeSection: {
    marginBottom: "40px"
  },
  routeTitle: {
    color: "#4CAF50",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    fontSize: "20px"
  },
  routeCount: {
    backgroundColor: "#e8f5e8",
    color: "#4CAF50",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "normal"
  },
  routeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "15px"
  },
  routeCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #eee"
  },
  statusBadge: {
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "bold"
  },
  statusAktiv: {
    backgroundColor: "#e8f5e8",
    color: "#4CAF50"
  },
  statusGelöscht: {
    backgroundColor: "#ffebee",
    color: "#ff4444"
  },
  cardDate: {
    fontSize: "11px",
    color: "#999"
  },
  pokemonList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  pokemonItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "5px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px"
  },
  pokemonSprite: {
    imageRendering: "pixelated"
  },
  pokemonName: {
    fontSize: "13px",
    color: "#333"
  },
  statsContainer: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px"
  },
  statsTitle: {
    margin: "0 0 15px 0",
    color: "#333",
    fontSize: "16px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px"
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  statLabel: {
    fontSize: "12px",
    color: "#666"
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#4CAF50"
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    border: "1px solid #e0e0e0"
  },
  summaryTitle: {
    margin: "0 0 15px 0",
    color: "#333",
    fontSize: "16px",
    borderBottom: "2px solid #4CAF50",
    paddingBottom: "8px"
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px"
  },
  summaryCard: {
    backgroundColor: "white",
    padding: "12px",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    borderLeft: "4px solid #4CAF50"
  },
  summaryRouteName: {
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: "8px",
    fontSize: "15px"
  },
  summaryStats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  summaryTotal: {
    fontSize: "13px",
    color: "#666"
  },
  summaryDetail: {
    display: "flex",
    gap: "8px"
  },
  summaryActive: {
    fontSize: "12px",
    color: "#4CAF50",
    fontWeight: "bold"
  },
  summaryDeleted: {
    fontSize: "12px",
    color: "#ff4444",
    fontWeight: "bold"
  }
};

export default RouteList;