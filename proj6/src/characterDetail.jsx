import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MD5 from 'crypto-js/md5'; // Import MD5 from crypto-js
import { useNavigate } from 'react-router-dom';
import './characterDetail.css'; // Import the CSS file

const PUBLIC_KEY = '0f0c818eb8ec3a84d65ce78a2cbfd897'; // Replace with your Marvel API public key
const PRIVATE_KEY = 'fdacc7ba02bcba2f2f69bf81c841ad203ecf2f1b'; // Replace with your Marvel API private key
const BASE_URL = 'https://gateway.marvel.com/v1/public/characters';

function CharacterDetail() {
  const { id } = useParams(); // Get the character ID from the URL
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getMarvelHash = (ts) => {
    return MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString(); // Generate MD5 hash
  };

  const fetchCharacterDetails = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const hash = getMarvelHash(timestamp);
      const response = await axios.get(`${BASE_URL}/${id}`, {
        params: {
          apikey: PUBLIC_KEY,
          hash: hash,
          ts: timestamp,
        }
      });
      setCharacter(response.data.data.results[0]); // Get the character data from response
    } catch (error) {
      console.error('Error fetching character details:', error);
      setError('Failed to fetch character details.'); // Set error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterDetails();
  }, [id]); // Fetch details whenever ID changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>; // Show error message

  return (
    <div className='character-detail'>
        <button onClick={() => navigate("/")}>Home Page</button>
      {character && (
        <>
          <h2>{character.name}</h2>
          <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} />
          <p>{character.description || 'No description available.'}</p>
          <h3>Comics:</h3>
          <ul>
            {character.comics.items.map(comic => (
              <li key={comic.resourceURI}>{comic.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default CharacterDetail;
