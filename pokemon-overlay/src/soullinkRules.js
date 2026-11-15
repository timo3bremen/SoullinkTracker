import { isSameFamily } from "./evolutions";

export const PLAYER_NAMES = {
  player1: "Timo",
  player2: "Basti",
  player3: "Milian"
};

// player1 -> pokemon1 usw.
export const slotOf = (playerKey) => `pokemon${playerKey.slice(-1)}`;

// ID des ursprünglich gefangenen Pokémon (alte Daten ohne originalId -> aktuelle ID)
export const originalIdOf = (p) => (p.originalId != null ? p.originalId : p.id);
export const originalNameOf = (p) => p.originalName || p.name;

/**
 * Liefert alle Warnungen für die Auswahl von `pokemonId` durch `playerKey`.
 *
 * Regeln:
 *  - Hat ein ANDERER Spieler genau dieses Pokémon bereits gefangen (aktiver Link
 *    oder History), ist es verbraucht.
 *  - Hat der EIGENE Spieler bereits ein Pokémon derselben Entwicklungslinie
 *    gefangen, ist es ebenfalls verbraucht.
 *  - Ist das Pokémon im aktuell entstehenden Link schon bei einem anderen
 *    Spieler ausgewählt, wird ebenfalls gewarnt.
 */
export function getPokemonWarnings(team, currentSelection, playerKey, pokemonId) {
  const warnings = [];
  const allLinks = [...(team.links || []), ...(team.deletedLinks || [])];

  for (const link of allLinks) {
    for (const otherKey of Object.keys(PLAYER_NAMES)) {
      const p = link[slotOf(otherKey)];
      if (!p) continue;
      const where = link.route ? ` (Route ${link.route})` : "";

      if (otherKey !== playerKey) {
        if (originalIdOf(p) === pokemonId) {
          warnings.push(
            `${originalNameOf(p)} wurde bereits von ${PLAYER_NAMES[otherKey]} gefangen${where}`
          );
        }
      } else if (isSameFamily(originalIdOf(p), pokemonId) || isSameFamily(p.id, pokemonId)) {
        const name =
          originalIdOf(p) !== p.id ? `${originalNameOf(p)} (jetzt ${p.name})` : p.name;
        warnings.push(`Du hast bereits ${name} aus derselben Entwicklungslinie${where}`);
      }
    }
  }

  for (const otherKey of Object.keys(PLAYER_NAMES)) {
    if (otherKey !== playerKey && currentSelection[otherKey]?.id === pokemonId) {
      warnings.push(`Bereits für ${PLAYER_NAMES[otherKey]} in diesem Link ausgewählt`);
    }
  }

  return [...new Set(warnings)];
}
