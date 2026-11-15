package com.soullink.demo.model;

public class Pokemon {
	private int id;
	private String name;
	// Ursprünglich gefangenes Pokémon (bleibt bei Entwicklungen erhalten)
	private Integer originalId;
	private String originalName;

	public Pokemon() {
	}

	public Pokemon(int id, String name) {
		this.id = id;
		this.name = name;
	}

	public int getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setId(int id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getOriginalId() {
		return originalId;
	}

	public void setOriginalId(Integer originalId) {
		this.originalId = originalId;
	}

	public String getOriginalName() {
		return originalName;
	}

	public void setOriginalName(String originalName) {
		this.originalName = originalName;
	}

}
