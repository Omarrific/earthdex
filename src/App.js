import React, { useState } from 'react';

const API_URL = 'https://earthdex-backend.vercel.app/api/route';

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleIdentifyClick = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (error) {
      setError(error.message);
      setData(null);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Earthdex</h1>
        <form>
          <input type="file" onChange={handleFileChange} />
          <button type="button" onClick={handleIdentifyClick}>Identify Image</button>
        </form>
        {error && <p>Error: {error}</p>}
        {data ? (
          <div>
            <h2>Result:</h2>
            <p>Label: {data.label}</p>
            <p>Score: {data.score}</p>
          </div>
        ) : (
          <p>Upload an image and click "Identify Image" to get predictions...</p>
        )}
      </header>
    </div>
  );
}

export default App;
