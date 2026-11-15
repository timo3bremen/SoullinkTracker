import React, { useState, useEffect, useCallback } from "react";
import PlayerBox from "./components/PlayerBox";
import LinkList from "./components/LinkList";
import HistoryList from "./components/HistoryList";
import EditPokemonModal from "./components/EditPokemonModal";
import LevelCapDisplay from './components/LevelCapDisplay';
import RouteList from "./components/RouteList";
import TypeChart from "./components/TypeChart";
import TeamHeader from './components/TeamHeader';
import { POKEMON } from "./pokemonList";
import { getPokemonWarnings, PLAYER_NAMES, slotOf } from "./soullinkRules";

function App() {
  
const SERVER_URL = "http://192.168.178.21:8084";

const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [linkToDelete, setLinkToDelete] = useState(null);
const [lostByPlayer, setLostByPlayer] = useState("");

const [showResetDialog, setShowResetDialog] = useState(false);
const [resetConfirmText, setResetConfirmText] = useState("");

  const [team, setTeam] = useState({ 
    player1: [], 
    player2: [], 
    player3: [], 
    links: [],
    deletedLinks: [] 
  });
  
  const [currentSelection, setCurrentSelection] = useState({
    player1: null,
    player2: null,
    player3: null
  });

  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [editingPokemon, setEditingPokemon] = useState({
    isOpen: false,
    playerKey: null,
    index: null,
    pokemon: null
  });

  const [currentRoute, setCurrentRoute] = useState("");

  // fetchTeam mit useCallback
  const fetchTeam = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/team`);
      const data = await response.json();
      setTeam(data);
      setError(null);
    } catch (error) {
      console.error("Fehler beim Laden:", error);
      setError("Verbindung zum Server fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  }, [SERVER_URL]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  // saveTeam mit useCallback
  const saveTeam = useCallback(async (updatedTeam) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTeam)
      });
      const data = await response.json();
      setTeam(data);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      setError("Fehler beim Speichern");
    }
  }, [SERVER_URL]);

  // hasPlayerReachedLimit mit useCallback
  const hasPlayerReachedLimit = useCallback((playerKey) => {
    if (!team.links) return false;
    
    const activeCount = team.links.reduce((count, link) => {
      if (link.active !== false) {
        if (playerKey === 'player1' && link.pokemon1) count++;
        else if (playerKey === 'player2' && link.pokemon2) count++;
        else if (playerKey === 'player3' && link.pokemon3) count++;
      }
      return count;
    }, 0);
    
    return activeCount >= 6;
  }, [team.links]);

  // updatePokemon mit useCallback - HIER WAR DER FEHLER!
  const updatePokemon = useCallback(async (playerKey, index, updatedPokemon) => {
  setIsLoading(true);
  try {
    // Wichtig: originalName beibehalten!
    // Der updatedPokemon kommt aus dem Modal, dort muss originalName mitgeschickt werden
    const response = await fetch(
      `${SERVER_URL}/api/team/pokemon/${playerKey}/${index}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPokemon) // updatedPokemon muss originalName enthalten
      }
    );
    
    if (response.ok) {
      const updatedTeam = await response.json();
      setTeam(updatedTeam);
      setEditingPokemon({ isOpen: false, playerKey: null, index: null, pokemon: null });
      setError(null);
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    setError("Fehler beim Aktualisieren des Pokémon");
  } finally {
    setIsLoading(false);
  }
}, [SERVER_URL]);

  // toggleLinkActive mit useCallback
  const toggleLinkActive = useCallback(async (linkToToggle) => {
    setIsLoading(true);
    try {
      if (!linkToToggle.active) {
        const wouldExceedLimit = [
          { player: 'player1', pokemon: linkToToggle.pokemon1 },
          { player: 'player2', pokemon: linkToToggle.pokemon2 },
          { player: 'player3', pokemon: linkToToggle.pokemon3 }
        ].some(({ player, pokemon }) => {
          if (!pokemon) return false;
          return hasPlayerReachedLimit(player);
        });
        
        if (wouldExceedLimit) {
          alert('Ein Spieler hat bereits 6 aktive Pokémon! Bitte zuerst einen anderen Link deaktivieren oder löschen.');
          setIsLoading(false);
          return;
        }
      }
      
      const updatedLinks = team.links.map(link => {
        if (link.timestamp === linkToToggle.timestamp) {
          return { ...link, active: !link.active };
        }
        return link;
      });
      
      const updatedTeam = { ...team, links: updatedLinks };
      
      await fetch(`${SERVER_URL}/api/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTeam)
      });
      
      setTeam(updatedTeam);
    } catch (error) {
      console.error("Fehler beim Togglen:", error);
      setError("Fehler beim Aktualisieren");
    } finally {
      setIsLoading(false);
    }
  }, [SERVER_URL, team, hasPlayerReachedLimit]);

  // deleteLink mit useCallback
  const deleteLink = useCallback(async () => {
    if (!linkToDelete || !lostByPlayer) {
      alert("Bitte auswählen, welcher Spieler das Pokémon verloren hat!");
      return;
    }

    setIsLoading(true);
    try {
      const updatedLinks = team.links.map(link => {
        if (link.timestamp === linkToDelete.timestamp) {
          return { ...link, lostBy: lostByPlayer };
        }
        return link;
      });
      
      const updatedTeam = { ...team, links: updatedLinks };
      
      await fetch(`${SERVER_URL}/api/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTeam)
      });
      
      const linkIndex = team.links.findIndex(l => l.timestamp === linkToDelete.timestamp);
      const response = await fetch(`${SERVER_URL}/api/team/links/${linkIndex}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        const finalTeam = await response.json();
        setTeam(finalTeam);
        setShowDeleteDialog(false);
        setLinkToDelete(null);
        setLostByPlayer("");
        setError(null);
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      setError("Fehler beim Löschen");
    } finally {
      setIsLoading(false);
    }
  }, [SERVER_URL, team, linkToDelete, lostByPlayer]);

  // resetAllData mit useCallback
  const resetAllData = useCallback(async () => {
    if (resetConfirmText !== "RESET") {
        alert('Bitte "RESET" eingeben, um zu bestätigen');
        return;
    }
    
    setIsLoading(true);
    try {
        const response = await fetch(`${SERVER_URL}/api/team/reset`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        
        if (response.ok) {
            const emptyTeam = await response.json();
            setTeam(emptyTeam);
            setShowResetDialog(false);
            setResetConfirmText("");
            setError(null);
        }
    } catch (error) {
        console.error("Fehler beim Reset:", error);
        setError("Fehler beim Zurücksetzen der Daten");
    } finally {
        setIsLoading(false);
    }
}, [SERVER_URL, resetConfirmText]);

  // restoreLink mit useCallback
  const restoreLink = useCallback(async (historyIndex) => {
    if (!window.confirm("Möchtest du diesen Soullink wiederherstellen?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${SERVER_URL}/api/team/history/${historyIndex}/restore`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }
      );
      
      if (response.ok) {
        const updatedTeam = await response.json();
        setTeam(updatedTeam);
        setError(null);
      }
    } catch (error) {
      console.error("Fehler beim Wiederherstellen:", error);
      setError("Fehler beim Wiederherstellen des Soullinks");
    } finally {
      setIsLoading(false);
    }
  }, [SERVER_URL]);

  // deleteHistoryEntry mit useCallback
  const deleteHistoryEntry = useCallback(async (historyIndex) => {
    if (!window.confirm("Möchtest du diesen Eintrag endgültig aus der History löschen?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${SERVER_URL}/api/team/history/${historyIndex}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        }
      );
      
      if (response.ok) {
        const updatedTeam = await response.json();
        setTeam(updatedTeam);
        setError(null);
      }
    } catch (error) {
      console.error("Fehler beim Löschen des History-Eintrags:", error);
      setError("Fehler beim Löschen des History-Eintrags");
    } finally {
      setIsLoading(false);
    }
  }, [SERVER_URL]);

  // addLink mit useCallback
  const addLink = useCallback(async () => {
  if (!currentSelection.player1 || !currentSelection.player2 || !currentSelection.player3) {
    alert("Bitte für alle drei Spieler ein Pokémon auswählen!");
    return;
  }
  
  if (!currentRoute || currentRoute.trim() === "") {
    alert("Bitte eine Route eingeben (z.B. Route 1, Safari Zone, ...)!");
    return;
  }

  // Regelverstöße prüfen und ggf. bestätigen lassen
  const allWarnings = Object.keys(PLAYER_NAMES).flatMap((key) =>
    getPokemonWarnings(team, currentSelection, key, currentSelection[key].id)
      .map((w) => `${PLAYER_NAMES[key]} – ${currentSelection[key].name}: ${w}`)
  );
  if (allWarnings.length > 0 &&
      !window.confirm(`⚠️ Achtung:\n\n${allWarnings.join("\n")}\n\nTrotzdem hinzufügen?`)) {
    return;
  }

  // Original (gefangenes) Pokémon merken – bleibt bei Entwicklungen erhalten
  const withOriginal = (p) => ({ id: p.id, name: p.name, originalId: p.id, originalName: p.name });

  const newLink = {
    fromPlayer: "player1",
    toPlayer: "player2",
    type: "Soullink",
    pokemon1: withOriginal(currentSelection.player1),
    pokemon2: withOriginal(currentSelection.player2),
    pokemon3: withOriginal(currentSelection.player3),
    timestamp: new Date().toISOString(),
    route: currentRoute,
    active: false
  };

  const updatedTeam = {
    ...team,
    player1: [...team.player1, withOriginal(currentSelection.player1)],
    player2: [...team.player2, withOriginal(currentSelection.player2)],
    player3: [...team.player3, withOriginal(currentSelection.player3)],
    links: [...team.links, newLink]
  };

  await saveTeam(updatedTeam);
  setCurrentSelection({ player1: null, player2: null, player3: null });
  setCurrentRoute("");
}, [team, currentSelection, currentRoute, saveTeam]);

  // Warnungen für die Auswahl-Selects
  const getWarnings = useCallback(
    (playerKey, pokemonId) => getPokemonWarnings(team, currentSelection, playerKey, pokemonId),
    [team, currentSelection]
  );

  // Pokémon in einem Link (und im Team des Spielers) eine Stufe weiterentwickeln
  const evolvePokemon = useCallback(async (linkToEvolve, playerKey, newId) => {
    const slot = slotOf(playerKey);
    const oldPokemon = linkToEvolve[slot];
    const target = POKEMON.find((p) => p.id === newId);
    if (!oldPokemon || !target) return;

    const evolved = {
      ...oldPokemon,
      id: target.id,
      name: target.name,
      originalId: oldPokemon.originalId ?? oldPokemon.id,
      originalName: oldPokemon.originalName || oldPokemon.name
    };

    const updatedLinks = team.links.map((link) =>
      link.timestamp === linkToEvolve.timestamp ? { ...link, [slot]: evolved } : link
    );

    const playerList = [...(team[playerKey] || [])];
    const teamIndex = playerList.findIndex((p) => p.id === oldPokemon.id);
    if (teamIndex !== -1) playerList[teamIndex] = evolved;

    setIsLoading(true);
    await saveTeam({ ...team, links: updatedLinks, [playerKey]: playerList });
    setIsLoading(false);
  }, [team, saveTeam]);

  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
    setLostByPlayer("");
    setShowDeleteDialog(true);
  };

  const handleSelectPokemon = (playerKey, pokemon) => {
    setCurrentSelection({ ...currentSelection, [playerKey]: pokemon });
  };

  const handleEditPokemon = (playerKey, index, pokemon) => {
    setEditingPokemon({
      isOpen: true,
      playerKey,
      index,
      pokemon: { ...pokemon }
    });
  };

  if (isLoading && !team.links.length && !team.deletedLinks?.length) {
    return <div style={styles.loading}>Lade Daten...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Soullink Challenge Tracker</h1>
        <button 
          onClick={() => setShowResetDialog(true)}
          style={styles.headerResetButton}
          disabled={isLoading}
          title="Alle Daten zurücksetzen"
        >
          🗑️
        </button>
      </div>
      <TeamHeader team={team} />
      <LevelCapDisplay />
      
      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={fetchTeam} style={styles.retryButton}>
            Erneut versuchen
          </button>
        </div>
      )}
      
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "active" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("active")}
        >
          Aktive Soullinks ({team.links?.length || 0})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "history" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("history")}
        >
          History ({team.deletedLinks?.length || 0})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "routes" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("routes")}
        >
          Routen 🗺️
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "typechart" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("typechart")}
        >
          Typentabelle 📊
        </button>
      </div>

      {activeTab === "active" ? (
        <>
          <div style={styles.playerContainer}>
            <PlayerBox 
              playerKey="Timo"
              teamPokemon={team.player1}
              selected={currentSelection.player1}
              onSelect={(p) => handleSelectPokemon("player1", p)}
              getWarnings={(id) => getWarnings("player1", id)}
              onEdit={(index, pokemon) => handleEditPokemon("player1", index, pokemon)}
            />
            <PlayerBox 
              playerKey="Basti"
              teamPokemon={team.player2}
              selected={currentSelection.player2}
              onSelect={(p) => handleSelectPokemon("player2", p)}
              getWarnings={(id) => getWarnings("player2", id)}
              onEdit={(index, pokemon) => handleEditPokemon("player2", index, pokemon)}
            />
            <PlayerBox 
              playerKey="Milian"
              teamPokemon={team.player3}
              selected={currentSelection.player3}
              onSelect={(p) => handleSelectPokemon("player3", p)}
              getWarnings={(id) => getWarnings("player3", id)}
              onEdit={(index, pokemon) => handleEditPokemon("player3", index, pokemon)}
            />
          </div>

          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Route (z.B. Route 1, Safari Zone, ...)"
              value={currentRoute}
              onChange={(e) => setCurrentRoute(e.target.value)}
              style={{
                padding: "10px",
                width: "300px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={styles.buttonContainer}>
            <button 
              onClick={addLink} 
              style={styles.addButton}
              disabled={isLoading}
            >
              {isLoading ? "Wird gespeichert..." : "➕ Soullink hinzufügen"}
            </button>
          </div>

          {showResetDialog && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>Alle Daten zurücksetzen?</h3>
                <p style={styles.modalText}>
                  Diese Aktion kann nicht rückgängig gemacht werden!<br />
                  Alle Soullinks, Teams und die komplette History werden gelöscht.
                </p>
                <p style={styles.modalText}>
                  Zum Bestätigen bitte <strong>"RESET"</strong> eingeben:
                </p>
                <input
                  type="text"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value)}
                  placeholder="RESET"
                  style={styles.modalInput}
                  autoFocus
                />
                <div style={styles.modalButtons}>
                  <button 
                    onClick={() => {
                      setShowResetDialog(false);
                      setResetConfirmText("");
                    }}
                    style={styles.modalCancelButton}
                  >
                    Abbrechen
                  </button>
                  <button 
                    onClick={resetAllData}
                    style={styles.modalConfirmButton}
                    disabled={resetConfirmText !== "RESET" || isLoading}
                  >
                    {isLoading ? "Wird gelöscht..." : "Ja, alles löschen"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <LinkList 
            links={team.links} 
            onDeleteClick={handleDeleteClick}
            onToggleActive={toggleLinkActive}
            onEvolve={evolvePokemon}
            isLoading={isLoading}
          />
        </>
      ) : activeTab === "history" ? (
        <HistoryList 
          deletedLinks={team.deletedLinks || []}
          onRestoreLink={restoreLink}
          onDeleteEntry={deleteHistoryEntry}
          isLoading={isLoading}
        />
      ) : activeTab === "routes" ? (
        <RouteList 
          links={team.links || []}
          deletedLinks={team.deletedLinks || []}
        />
      ) : (
        <TypeChart />
      )}

      <EditPokemonModal
        isOpen={editingPokemon.isOpen}
        onClose={() => setEditingPokemon({ isOpen: false, playerKey: null, index: null, pokemon: null })}
        pokemon={editingPokemon.pokemon}
        onSave={(updatedPokemon) => 
          updatePokemon(editingPokemon.playerKey, editingPokemon.index, updatedPokemon)
        }
      />

      {showDeleteDialog && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Soullink verloren?</h3>
            <p style={styles.modalText}>
              Welcher Spieler hat diesen Soullink verloren?
            </p>
            
            <div style={styles.playerButtons}>
              <button
                onClick={() => setLostByPlayer("player1")}
                style={{
                  ...styles.playerButton,
                  ...(lostByPlayer === "player1" ? styles.selectedPlayer : {})
                }}
              >
                Timo
              </button>
              <button
                onClick={() => setLostByPlayer("player2")}
                style={{
                  ...styles.playerButton,
                  ...(lostByPlayer === "player2" ? styles.selectedPlayer : {})
                }}
              >
                Basti
              </button>
              <button
                onClick={() => setLostByPlayer("player3")}
                style={{
                  ...styles.playerButton,
                  ...(lostByPlayer === "player3" ? styles.selectedPlayer : {})
                }}
              >
                Milian
              </button>
              <button
                onClick={() => setLostByPlayer("none")}
                style={{
                  ...styles.playerButton,
                  ...(lostByPlayer === "none" ? styles.selectedNone : {}),
                  gridColumn: "span 3",
                  marginTop: "10px"
                }}
              >
                🤝 Keiner
              </button>
            </div>

            <div style={styles.modalButtons}>
              <button 
                onClick={() => {
                  setShowDeleteDialog(false);
                  setLinkToDelete(null);
                  setLostByPlayer("");
                }}
                style={styles.modalCancelButton}
              >
                Abbrechen
              </button>
              <button 
                onClick={deleteLink}
                style={styles.modalConfirmButton}
                disabled={!lostByPlayer || isLoading}
              >
                {isLoading ? "Wird gelöscht..." : "Löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    color: "#333",
    borderBottom: "3px solid #4CAF50",
    paddingBottom: "10px",
    marginBottom: "20px"
  },
  tabContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "10px"
  },
  tab: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    color: "#666",
    transition: "all 0.3s",
    fontWeight: "bold"
  },
  activeTab: {
    color: "#4CAF50",
    borderBottom: "3px solid #4CAF50"
  },
  playerContainer: {
    display: "flex",
    gap: "30px",
    marginBottom: "30px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  buttonContainer: {
    textAlign: "center",
    marginBottom: "40px"
  },
  addButton: {
    padding: "15px 40px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
    ":hover": {
      backgroundColor: "#45a049",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 8px rgba(0,0,0,0.15)"
    },
    ":disabled": {
      backgroundColor: "#cccccc",
      cursor: "not-allowed"
    }
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#666"
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    alignItems: "center"
  },
  retryButton: {
    padding: "5px 15px",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  resetButton: {
  padding: "15px 40px",
  marginLeft: "20px",
  fontSize: "18px",
  fontWeight: "bold",
  backgroundColor: "#ff4444",
  color: "white",
  border: "none",
  borderRadius: "50px",
  cursor: "pointer",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  transition: "all 0.3s",
  ":hover": {
    backgroundColor: "#cc0000",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 8px rgba(0,0,0,0.15)"
  },
  ":disabled": {
    backgroundColor: "#cccccc",
    cursor: "not-allowed"
  }
},
modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
},
modalContent: {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "12px",
  maxWidth: "400px",
  width: "90%",
  textAlign: "center"
},
modalTitle: {
  color: "#ff4444",
  marginTop: 0,
  marginBottom: "15px"
},
modalText: {
  color: "#666",
  marginBottom: "15px",
  lineHeight: "1.5"
},
modalInput: {
  width: "100%",
  padding: "10px",
  marginBottom: "20px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "16px",
  textAlign: "center",
  boxSizing: "border-box"
},
header: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  paddingBottom: "10px",
  borderBottom: "3px solid #4CAF50"
},
headerTitle: {
  color: "#333",
  margin: 0,
  borderBottom: "none"
},
headerResetButton: {
  backgroundColor: "#ff4444",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "44px",
  height: "44px",
  fontSize: "22px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  ":hover": {
    backgroundColor: "#cc0000",
    transform: "scale(1.1) rotate(15deg)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
  },
  ":active": {
    transform: "scale(0.95)"
  },
  ":disabled": {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none"
  }
},
  inactiveHint: {
    fontSize: '10px',
    color: '#999',
    marginTop: '5px',
    fontStyle: 'italic'
  },
  playerButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "20px"
  },
  playerButton: {
    padding: "12px",
    backgroundColor: "#f5f5f5",
    color: "#333",
    border: "2px solid transparent",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.3s",
    ":hover": {
      backgroundColor: "#e0e0e0"
    }
  },
  selectedPlayer: {
    backgroundColor: "#4CAF50",
    color: "white",
    borderColor: "#45a049"
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "center"
  },
  modalCancelButton: {
    padding: "10px 20px",
    backgroundColor: "#f5f5f5",
    color: "#666",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  },
  modalConfirmButton: {
    padding: "10px 20px",
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    ":disabled": {
      backgroundColor: "#cccccc",
      cursor: "not-allowed"
    }
  },
  selectedNone: {
    backgroundColor: "#9C27B0",
    color: "white",
    borderColor: "#7B1FA2"
  }
};

export default App;