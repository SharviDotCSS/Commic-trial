console.log('Current working directory:', process.cwd());

const fs = require('fs');
const mysql = require('mysql2');
const characterPromises = [];
const stickerPromises = [];

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sharvipw#2003',
  database: 'storyboard',
});

// An array of image file names
const imageFileNames = [
  'character1.png', 'character2.png', 'character3.png', 'character4.png', 'character5.png', 'character6.png', 'character7.png', 'character8.png', 'character9.png', 'character10.png', 'character11.png', 'character12.png', 'character13.png', 'character14.png', 'character15.png', 'character16.png', 'character17.png', 'character18.png', 'character19.png', 'character20.png',  'character21.png',  'character22.png',  'character23.png',  'character24.png',  'character25.png',  'character26.png',  'character27.png',  'character28.png',  'character29.png',  'character30.png',  'character31.png',  'character32.png'
  // Add the file names of your 32 characters here
];

// Loop through the character assets and insert each into the database
for (const fileName of imageFileNames) {
  const assetName = fileName.replace('.png', '');

  const promise = new Promise((resolve, reject) => {
    connection.query(
      'SELECT COUNT(*) AS count FROM assets WHERE asset_name = ?',
      [assetName],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          const count = results[0].count;

          if (count === 0) {
            const imagePath = `asset_character/${fileName}`;
            const imageBuffer = fs.readFileSync(imagePath);

            const assetData = {
              asset_name: assetName,
              asset_type: 'character',
              asset_data: imageBuffer,
            };

            connection.query('INSERT INTO assets SET ?', assetData, (err, results) => {
              if (err) {
                reject(err);
              } else {
                console.log(`Character asset ${assetData.asset_name} inserted successfully`);
                resolve(results);
              }
            });
          } else {
            console.log(`Character asset ${assetName} already exists, skipping insertion.`);
            resolve(results);
          }
        }
      }
    );
  });

  characterPromises.push(promise);
}

// Repeat a similar process for the icon assets, checking and inserting only if they don't already exist.


// Loop through the array and insert each image into the database (worked for first time asset storing)
// for (const fileName of imageFileNames) {
//   const imagePath = `asset_character/${fileName}`; // Adjust the path as needed
//   const imageBuffer = fs.readFileSync(imagePath);

//   const assetData = {
//     asset_name: fileName.replace('.png', ''), // Remove the file extension if needed
//     asset_type: 'character', // Set the appropriate type
//     asset_data: imageBuffer,
//   };

//   // Insert the asset data into the database
// connection.query('INSERT INTO assets SET ?', assetData, (err, results) => {
//   if (err) {
//     console.error('Error inserting asset data:', err);
//   } else {
//     console.log(`Asset ${assetData.asset_name} inserted successfully`);
//   }
// });

// }

// An array of icon file names
const iconFileNames = [
  'bam.png', 'chat-bubble.png', 'comic (1).png', 'comic (2).png', 'comic (3).png',
  'comic (4).png', 'comic (5).png', 'comic (6).png', 'comic (7).png', 'comic (8).png',
  'hi.png', 'speech-bubble (1).png', 'speech-bubble (2).png', 'speech-bubble.png', 'thinking.png',
  // Add the file names of your icons here
];

// Loop through the sticker assets and insert each into the database
for (const fileName of iconFileNames) {
  const assetName = fileName.replace('.png', '');

  const promise = new Promise((resolve, reject) => {
    connection.query(
      'SELECT COUNT(*) AS count FROM assets WHERE asset_name = ?',
      [assetName],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          const count = results[0].count;

          if (count === 0) {
            const imagePath = `asset_icons/${fileName}`;
            const imageBuffer = fs.readFileSync(imagePath);

            const assetData = {
              asset_name: assetName,
              asset_type: 'sticker',
              asset_data: imageBuffer,
            };

            connection.query('INSERT INTO assets SET ?', assetData, (err, results) => {
              if (err) {
                reject(err);
              } else {
                console.log(`Sticker asset ${assetData.asset_name} inserted successfully`);
                resolve(results);
              }
            });
          } else {
            console.log(`Sticker asset ${assetName} already exists, skipping insertion.`);
            resolve(results);
          }
        }
      }
    );
  });

  stickerPromises.push(promise);
}


// Close the database connection
// connection.end();

Promise.all(characterPromises)
  .then(() => {
    // Now, insert sticker assets
    return Promise.all(stickerPromises);
  })
  .then(() => {
    console.log('All queries completed.');
    // Close the database connection after all queries have completed
    connection.end();
  })
  .catch((err) => {
    console.error('Error executing queries:', err);
    // Close the database connection even in case of an error
    connection.end();
  });







