// preview.js
// document.addEventListener('DOMContentLoaded', () => {
//     // Get the comic artwork data URL from the query parameter
//     const urlParams = new URLSearchParams(window.location.search);
//     const comicImageDataUrl = urlParams.get('comicImageDataUrl');
  
//     // Set the comic artwork as the source of the <img> element
//     const comicPreview = document.getElementById('comic-preview');
//     comicPreview.src = comicImageDataUrl;
//     console.log(comicImageDataUrl);
  
    // Add event listener for the "Download" button
    // const downloadButton = document.getElementById('download-button');
    // downloadButton.addEventListener('click', () => {
    //   // Create a download link and trigger the download
    //   const downloadLink = document.createElement('a');
    //   downloadLink.href = comicImageDataUrl;
    //   downloadLink.download = 'comic_artwork.png';
    //   downloadLink.click();
    // });
  
//     // Add event listener for the "Share" button (customize as needed)
//     const shareButton = document.getElementById('share-button');
//     shareButton.addEventListener('click', () => {
//       // Implement sharing functionality, e.g., share on social media
//       // You can use third-party sharing libraries or APIs for this.
//     });
//   });
  

const savedArtwork = localStorage.getItem('saved-artwork');
if (savedArtwork) {
  const img = document.createElement('img');
  img.src = savedArtwork;
  document.body.appendChild(img);
  // img.style.marginLeft = "50";
}

const downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', () => {
      // Create a download link and trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = savedArtwork;
      downloadLink.download = 'comic_artwork.png';
      downloadLink.click();
    });