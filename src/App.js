import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const deployed = false;

const App = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [speciesList, setSpeciesList] = useState({});
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isHome, setIsHome] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await axios.post(deployed ? 'https://earthdex-backend.onrender.com/' : 'http://127.0.0.1:5000/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const species = result.data.label;
      const imageUrl = URL.createObjectURL(file);
      setResponse(result.data);
      setError(null);

      setSpeciesList((prevList) => {
        const newList = { ...prevList };
        if (newList[species]) {
          newList[species].push(imageUrl);
        } else {
          newList[species] = [imageUrl];
        }
        return newList;
      });

      setSelectedSpecies(species);

    } catch (err) {
      setError('An error occurred while uploading the file.');
      setResponse(null);
    }
  };

  const handleSpeciesClick = (species) => {
    setSelectedSpecies(species);
    setIsHome(false);
  };

  const handleStartClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsHome(false);
      setIsTransitioning(false);
    }, 2000); 
  };

  const handleBackToUpload = () => {
    setIsHome(false); 
    setSelectedSpecies(null);
    setIsTransitioning(false); 
  };

  return (
    <div className={`container ${isTransitioning ? 'transitioning' : ''}`}>
      <div className={`globe-container ${isTransitioning && !isHome ? 'visible' : ''}`}>
        <div className="spinning-globe"></div>
      </div>

      {isHome ? (
        <div className={`home-screen ${isTransitioning ? 'hidden' : ''}`}>
          <h1 className="home-title">Earthdex</h1>
          <button className="start-button" onClick={handleStartClick}>Start</button>
        </div>
      ) : (
        <>
          <header className="header">
            <h1 className="header-title">Earthdex</h1>
          </header>
          <div className="content">
            <div className="species-list">
              <h2>Species List</h2>
              <ul>
                {Object.keys(speciesList).map((species, index) => (
                  <li key={index} onClick={() => handleSpeciesClick(species)}>
                    {species}
                  </li>
                ))}
              </ul>
            </div>

            <div className="current-species">
              {selectedSpecies ? (
                <>
                  <h2>{selectedSpecies}</h2>
                  <div className="image-gallery">
                    {speciesList[selectedSpecies].map((imageUrl, index) => (
                      <img key={index} src={imageUrl} alt={selectedSpecies} />
                    ))}
                  </div>
                  <button className="home-button" onClick={handleBackToUpload}>Back to Upload</button>
                </>
              ) : (
                <>
                  <h2>Upload a Species</h2>
                  <div className="upload-section">
                    <form className="upload-form" onSubmit={handleSubmit}>
                      <input type="file" className="file-input" onChange={handleFileChange} />
                      <button type="submit" className="submit-button">Submit</button>
                    </form>
                    {response && (
                      <div className="result">
                        <p>Species: {response.label}</p>
                      </div>
                    )}
                    {error && (
                      <div className="error">
                        <p>{error}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="species-description">
              <h2>Description</h2>
              {selectedSpecies && (
                <p>{speciesList[selectedSpecies].description}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
