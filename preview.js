// preview.js

// const savedArtwork = localStorage.getItem('saved-artwork');
// if (savedArtwork) {
//   const img = document.createElement('img');
//   img.src = savedArtwork;
//   document.body.appendChild(img);
//   // img.style.marginLeft = "50";
// }

const savedArtwork = localStorage.getItem('saved-artwork');
if (savedArtwork) {
  const img = new Image();
  img.src = savedArtwork;
  img.onload = () => {
    // Once the image is loaded, you can apply styles or append it to the DOM
    img.style.backgroundColor = 'white'; // Apply a white background
    document.body.appendChild(img);
  };
}


const downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', () => {
      // Create a download link and trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = savedArtwork;
      downloadLink.download = 'comic_artwork.png';
      downloadLink.click();
    });