import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MD5 from 'crypto-js/md5'; // Import MD5 from crypto-js

const PUBLIC_KEY = '0f0c818eb8ec3a84d65ce78a2cbfd897'; // Replace with your Marvel API public key
const PRIVATE_KEY = 'fdacc7ba02bcba2f2f69bf81c841ad203ecf2f1b'; // Replace with your Marvel API private key
const BASE_URL = 'https://gateway.marvel.com/v1/public/characters';

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minComics, setMinComics] = useState(0); // State for minimum comics filter
  const [maxComicsFilter, setMaxComicsFilter] = useState(Infinity); // Initialize max as Infinity


  const getMarvelHash = (ts) => {
    return MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString(); // Generate MD5 hash
  };

  const fetchCharacters = async (query = '') => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const hash = getMarvelHash(timestamp);
      const response = await axios.get(BASE_URL, {
        params: {
          apikey: PUBLIC_KEY,
          hash: hash,
          ts: timestamp,
          nameStartsWith: query || undefined, // Search characters by name
          limit: 50,
        }
      });
      setCharacters(response.data.data.results);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch when component mounts
    fetchCharacters();
  }, []);

  useEffect(() => {
    // Fetch characters whenever the search term changes
    fetchCharacters(searchTerm);
  }, [searchTerm]);

  // Filter characters based on comic appearance and search term
  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComicCount = character.comics.available >= minComics && character.comics.available <= maxComicsFilter;
    return matchesComicCount && matchesSearch;
  });

  const uniqueComics = new Set(characters.flatMap(character => character.comics.items.map(comic => comic.name))).size; // Unique comics count

  // Calculate comics appearances
  const totalCharacters = characters.length; // Total number of characters
  const comicCounts = characters.map(character => character.comics.available);
  const totalComics = comicCounts.length;

  const averageComics = totalCharacters ? (comicCounts.reduce((sum, count) => sum + count, 0) / totalCharacters).toFixed(2) : 0;
  const minComicsCount = totalCharacters ? Math.min(...comicCounts) : 0; // Renamed to avoid conflict
  const maxComics = totalCharacters ? Math.max(...comicCounts) : 0;

  return (
    <div>
      <input
        type="text"
        placeholder="Search Characters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        <label>
          Minimum Comics Appearance:
          <input
            type="number"
            value={minComics}
            onChange={(e) => setMinComics(Number(e.target.value))} // Update state correctly
            min="0" // Optional: Set minimum to 0
          />
        </label>
        <label>
        Maximum Comics Appearance:
        <input
          type="number"
          value={maxComicsFilter === Infinity ? '' : maxComicsFilter} // Show empty string for Infinity
          onChange={(e) => setMaxComicsFilter(Number(e.target.value) || Infinity)} // Allow for Infinity
          min="0"
        />
      </label>
      </div>

      <div>
        {loading ? <p>Loading...</p> : <p>Showing {filteredCharacters.length} characters</p>}
      </div>
      <div>
        <h2>Fun Facts</h2>
        <p>Unique Comics: {uniqueComics}</p>
        <p>Average times a character appears in a comic: {averageComics}</p>
        <p>Min times: {minComicsCount}</p>
        <p>Max times: {maxComics}</p>
      </div>
      <div>
        <h2>Characters:</h2>
        <ul>
          {filteredCharacters.map(character => (
            <li key={character.id}>
              {character.name} - Appears in {character.comics.available} comics
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CharacterList;
