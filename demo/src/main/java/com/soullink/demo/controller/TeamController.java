package com.soullink.demo.controller;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soullink.demo.model.Pokemon;
import com.soullink.demo.model.TeamState;

import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/team")
@CrossOrigin(origins = { "http://localhost:3000", "http://192.168.178.21:3000" })
public class TeamController {

	private TeamState state = new TeamState();
	private final String DATA_FILE = "teamstate.json";
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

	public TeamController() {
		loadState();
	}

	private void loadState() {
		File file = new File(DATA_FILE);
		if (file.exists()) {
			state = objectMapper.readValue(file, TeamState.class);
		} else {
			initializeDefaultState();
		}
	}

	private void initializeDefaultState() {
		state.setPlayer1(new ArrayList<>());
		state.setPlayer2(new ArrayList<>());
		state.setPlayer3(new ArrayList<>());
		state.setLinks(new ArrayList<>());
		state.setDeletedLinks(new ArrayList<>());
	}

	private void saveState() {
		objectMapper.writeValue(new File(DATA_FILE), state);
	}

	@GetMapping
	public TeamState getTeam() {
		return state;
	}

	@PostMapping
	public TeamState updateTeam(@RequestBody TeamState newState) {
		this.state = newState;
		saveState();
		return state;
	}

	// NEU: History abrufen
	@GetMapping("/history")
	public List<TeamState.Link> getDeletedLinks() {
		return state.getDeletedLinks();
	}

	// NEU: History löschen
	@DeleteMapping("/history")
	public TeamState clearHistory() {
		state.setDeletedLinks(new ArrayList<>());
		saveState();
		return state;
	}

	// NEU: Einzelnen History-Eintrag löschen
	@DeleteMapping("/history/{index}")
	public TeamState deleteHistoryEntry(@PathVariable int index) {
		if (index >= 0 && index < state.getDeletedLinks().size()) {
			state.getDeletedLinks().remove(index);
			saveState();
		}
		return state;
	}

	// NEU: History-Eintrag wiederherstellen
	@PostMapping("/history/{index}/restore")
	public TeamState restoreLink(@PathVariable int index) {
		if (index >= 0 && index < state.getDeletedLinks().size()) {
			TeamState.Link linkToRestore = state.getDeletedLinks().get(index);

			// Prüfen ob die Pokémon noch verfügbar sind (nicht in aktuellen Teams)
			boolean canRestore = true;
			if (linkToRestore.getPokemon1() != null) {
				canRestore &= state.getPlayer1().stream()
						.noneMatch(p -> p.getId() == linkToRestore.getPokemon1().getId());
			}
			if (linkToRestore.getPokemon2() != null) {
				canRestore &= state.getPlayer2().stream()
						.noneMatch(p -> p.getId() == linkToRestore.getPokemon2().getId());
			}
			if (linkToRestore.getPokemon3() != null) {
				canRestore &= state.getPlayer3().stream()
						.noneMatch(p -> p.getId() == linkToRestore.getPokemon3().getId());
			}

			if (canRestore) {
				// Pokémon zu Teams hinzufügen
				if (linkToRestore.getPokemon1() != null) {
					state.getPlayer1().add(linkToRestore.getPokemon1());
				}
				if (linkToRestore.getPokemon2() != null) {
					state.getPlayer2().add(linkToRestore.getPokemon2());
				}
				if (linkToRestore.getPokemon3() != null) {
					state.getPlayer3().add(linkToRestore.getPokemon3());
				}

				// Link wiederherstellen (ohne deletedAt)
				linkToRestore.setDeletedAt(null);
				state.getLinks().add(linkToRestore);

				// Aus History entfernen
				state.getDeletedLinks().remove(index);

				saveState();
			}
		}
		return state;
	}

	@DeleteMapping("/links/{index}")
	public TeamState deleteLink(@PathVariable int index) {
		if (index >= 0 && index < state.getLinks().size()) {
			TeamState.Link removedLink = state.getLinks().remove(index);

			// Zeitpunkt des Löschens hinzufügen
			removedLink.setDeletedAt(LocalDateTime.now().format(formatter));

			// Zur History hinzufügen
			state.getDeletedLinks().add(0, removedLink);

			// Pokémon aus Teams entfernen - NUR JEWEILS EINS!
			if (removedLink.getPokemon1() != null) {
				for (int i = 0; i < state.getPlayer1().size(); i++) {
					if (state.getPlayer1().get(i).getId() == removedLink.getPokemon1().getId()) {
						state.getPlayer1().remove(i);
						break;
					}
				}
			}
			if (removedLink.getPokemon2() != null) {
				for (int i = 0; i < state.getPlayer2().size(); i++) {
					if (state.getPlayer2().get(i).getId() == removedLink.getPokemon2().getId()) {
						state.getPlayer2().remove(i);
						break;
					}
				}
			}
			if (removedLink.getPokemon3() != null) {
				for (int i = 0; i < state.getPlayer3().size(); i++) {
					if (state.getPlayer3().get(i).getId() == removedLink.getPokemon3().getId()) {
						state.getPlayer3().remove(i);
						break;
					}
				}
			}

			saveState();
		}
		return state;
	}

	@PutMapping("/pokemon/{playerKey}/{index}")
	public TeamState updatePokemon(@PathVariable String playerKey, @PathVariable int index,
			@RequestBody Pokemon updatedPokemon) {

		List<Pokemon> targetList = getPlayerList(playerKey);

		if (targetList != null && index >= 0 && index < targetList.size()) {
			Pokemon oldPokemon = targetList.get(index);
			targetList.set(index, updatedPokemon);

			for (TeamState.Link link : state.getLinks()) {
				updatePokemonInLink(link, playerKey, oldPokemon, updatedPokemon);
			}

			// Auch in der History aktualisieren
			for (TeamState.Link link : state.getDeletedLinks()) {
				updatePokemonInLink(link, playerKey, oldPokemon, updatedPokemon);
			}

			saveState();
		}

		return state;
	}

	@DeleteMapping("/reset")
	public TeamState resetAllData() {
		// Alle Listen leeren
		state.setPlayer1(new ArrayList<>());
		state.setPlayer2(new ArrayList<>());
		state.setPlayer3(new ArrayList<>());
		state.setLinks(new ArrayList<>());
		state.setDeletedLinks(new ArrayList<>());

		// Speichern
		saveState();

		return state;
	}

	private List<Pokemon> getPlayerList(String playerKey) {
		switch (playerKey) {
		case "player1":
			return state.getPlayer1();
		case "player2":
			return state.getPlayer2();
		case "player3":
			return state.getPlayer3();
		default:
			return null;
		}
	}

	private void updatePokemonInLink(TeamState.Link link, String playerKey, Pokemon oldPokemon, Pokemon newPokemon) {
		switch (playerKey) {
		case "player1":
			if (link.getPokemon1() != null && link.getPokemon1().getId() == oldPokemon.getId()) {
				link.setPokemon1(newPokemon);
			}
			break;
		case "player2":
			if (link.getPokemon2() != null && link.getPokemon2().getId() == oldPokemon.getId()) {
				link.setPokemon2(newPokemon);
			}
			break;
		case "player3":
			if (link.getPokemon3() != null && link.getPokemon3().getId() == oldPokemon.getId()) {
				link.setPokemon3(newPokemon);
			}
			break;
		}
	}

}