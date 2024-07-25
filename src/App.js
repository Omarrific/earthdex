import React, { useState, useEffect } from 'react';

const API_URL = 'https://backend.vercel.app/api'; //placeholder until vercel is running

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetch(`${API_URL}/endpoint`) //placeholder until vercel is running
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => setError(error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>My React App</h1>
        {error && <p>Error: {error.message}</p>}
        {data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;
