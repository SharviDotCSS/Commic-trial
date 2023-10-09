console.log('Current working directory:', process.cwd());

const fs = require('fs');
const mysql = require('mysql2');

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

// Loop through the array and insert each image into the database
for (const fileName of imageFileNames) {
  const imagePath = `asset_character/${fileName}`; // Adjust the path as needed
  const imageBuffer = fs.readFileSync(imagePath);

  const assetData = {
    asset_name: fileName.replace('.png', ''), // Remove the file extension if needed
    asset_type: 'character', // Set the appropriate type
    asset_data: imageBuffer,
  };

  // Insert the asset data into the database
connection.query('INSERT INTO assets SET ?', assetData, (err, results) => {
  if (err) {
    console.error('Error inserting asset data:', err);
  } else {
    console.log(`Asset ${assetData.asset_name} inserted successfully`);
  }
});

}

// Close the database connection
connection.end();
