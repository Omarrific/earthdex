import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

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
      const result = await axios.post('https://earthdex-backend.vercel.app/api/route', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(result.data);
      setError(null);
    } catch (err) {
      setError('An error occurred while uploading the file.');
      setResponse(null);
    }
  };

  return (
    <div>
      <h1>Upload Image for Classification</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {response && (
        <div>
          <h2>Result:</h2>
          <p>Label: {response.label}</p>
          <p>Score: {response.score}</p>
        </div>
      )}
      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
