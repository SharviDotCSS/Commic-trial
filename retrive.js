// const express = require('express');
// const mysql = require('mysql2');
// const fs = require('fs');

// const app = express();

// // Create a MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'sharvipw#2003',
//   database: 'storyboard',
// });

// // Define an API endpoint to retrieve images
// app.get('/api/assets/:assetName', (req, res) => {
//   const assetName = req.params.assetName;

//   connection.query(
//     'SELECT asset_data FROM assets WHERE asset_name = ?',
//     [assetName],
//     (err, results) => {
//       if (err) {
//         console.error('Error fetching image:', err);
//         res.status(500).json({ error: 'Error fetching image' });
//         return;
//       }

//       if (results.length === 0) {
//         res.status(404).json({ error: 'Image not found' });
//         return;
//       }

//       // Send the image data as a response
//       const imageBuffer = results[0].asset_data;
//       res.setHeader('character', 'image/png'); // Set the appropriate content type
//       res.send(imageBuffer);
//     }
//   );
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });


// //in html code:
// // {/* <img src="/assets/Image%201" alt="Image 1" class="comic-asset" data-asset-type="image" draggable="true">
// // <img src="/assets/Image%202" alt="Image 2" class="comic-asset" data-asset-type="image" draggable="true">
// // <!-- Add more image elements as needed --> */}

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

const app = express();

// Serve static files from a directory (e.g., 'public')
// app.use(express.static('public'));

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sharvipw#2003',
  database: 'storyboard',
});

// Define an API endpoint to retrieve images by asset name
app.get('/api/assets/:assetName', (req, res) => {
  const assetName = req.params.assetName;

  connection.query(
    'SELECT asset_data FROM assets WHERE asset_name = ?',
    [assetName],
    (err, results) => {
      if (err) {
        console.error('Error fetching asset data:', err);
        res.status(500).json({ error: 'Error fetching asset data' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: 'Asset not found' });
        return;
      }

      const assetData = results[0].asset_data;

      // Set the appropriate content type based on the asset type
      const contentType = 'image/png'; // Adjust as needed

      res.setHeader('Content-Type', contentType);
      res.send(assetData);
    }
  );
});

// Start the Express.js server
const port = 1100; // You can change the port if needed
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

