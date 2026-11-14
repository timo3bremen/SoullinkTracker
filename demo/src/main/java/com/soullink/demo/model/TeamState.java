package com.soullink.demo.model;

import java.util.ArrayList;
import java.util.List;

public class TeamState {
	private List<Pokemon> player1 = new ArrayList<>();
	private List<Pokemon> player2 = new ArrayList<>();
	private List<Pokemon> player3 = new ArrayList<>();
	private List<Link> links = new ArrayList<>();
	private List<Link> deletedLinks = new ArrayList<>(); // NEU: History für gelöschte Links

	public TeamState() {
	}

	public List<Pokemon> getPlayer1() {
		return player1;
	}

	public void setPlayer1(List<Pokemon> player1) {
		this.player1 = player1 != null ? player1 : new ArrayList<>();
	}

	public List<Pokemon> getPlayer2() {
		return player2;
	}

	public void setPlayer2(List<Pokemon> player2) {
		this.player2 = player2 != null ? player2 : new ArrayList<>();
	}

	public List<Pokemon> getPlayer3() {
		return player3;
	}

	public void setPlayer3(List<Pokemon> player3) {
		this.player3 = player3 != null ? player3 : new ArrayList<>();
	}

	public List<Link> getLinks() {
		return links;
	}

	public void setLinks(List<Link> links) {
		this.links = links != null ? links : new ArrayList<>();
	}

	// NEU: Getter/Setter für deletedLinks
	public List<Link> getDeletedLinks() {
		return deletedLinks;
	}

	public void setDeletedLinks(List<Link> deletedLinks) {
		this.deletedLinks = deletedLinks != null ? deletedLinks : new ArrayList<>();
	}

	public static class Link {
		private String fromPlayer;
		private String toPlayer;
		private String type;
		private Pokemon pokemon1;
		private Pokemon pokemon2;
		private Pokemon pokemon3;
		private String timestamp;
		private String deletedAt; // NEU: Zeitpunkt des Löschens
		private String route;
		private boolean active = false;
		private String lostBy;

		public String getRoute() {
			return route;
		}

		public void setRoute(String route) {
			this.route = route;
		}

		public Link() {
		}

		public String getFromPlayer() {
			return fromPlayer;
		}

		public void setFromPlayer(String fromPlayer) {
			this.fromPlayer = fromPlayer;
		}

		public String getToPlayer() {
			return toPlayer;
		}

		public void setToPlayer(String toPlayer) {
			this.toPlayer = toPlayer;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public Pokemon getPokemon1() {
			return pokemon1;
		}

		public void setPokemon1(Pokemon pokemon1) {
			this.pokemon1 = pokemon1;
		}

		public Pokemon getPokemon2() {
			return pokemon2;
		}

		public void setPokemon2(Pokemon pokemon2) {
			this.pokemon2 = pokemon2;
		}

		public Pokemon getPokemon3() {
			return pokemon3;
		}

		public void setPokemon3(Pokemon pokemon3) {
			this.pokemon3 = pokemon3;
		}

		public String getTimestamp() {
			return timestamp;
		}

		public void setTimestamp(String timestamp) {
			this.timestamp = timestamp;
		}

		public String getDeletedAt() {
			return deletedAt;
		}

		public void setDeletedAt(String deletedAt) {
			this.deletedAt = deletedAt;
		}

		public boolean isActive() {
			return active;
		}

		public void setActive(boolean active) {
			this.active = active;
		}

		public String getLostBy() {
			return lostBy;
		}

		public void setLostBy(String lostBy) {
			this.lostBy = lostBy;
		}
	}
}