import React, { useState, useEffect } from 'react';
const WarningImage = () => {
  const [images, setImages] = useState([]);

//   useEffect(() => {
//     // Fetch the captured images from your API
//     const fetchImages = async () => {
//       try {
//         const response = await getCapturedImages(); // Replace with the correct API call
//         setImages(response.data);
//       } catch (error) {
//         console.error('Failed to fetch images:', error);
//       }
//     };

//     fetchImages();
//   }, []);

  return (
    <div className="warning-image-container">
      <h2>Captured Images of Abnormal Logins</h2>
      <div className="image-gallery">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image.url} alt={`Captured login image ${index + 1}`} />
              <p>{image.timestamp}</p>
            </div>
          ))
        ) : (
          <p>No abnormal login images found.</p>
        )}
      </div>
    </div>
  );
};

export default WarningImage;
