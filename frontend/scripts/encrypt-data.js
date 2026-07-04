const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

const SECRET_KEY = 'Rahas!aSuperKuat12345!@#$%';

const dataPath = path.join(__dirname, '../public/assets/data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');

const encrypted = CryptoJS.AES.encrypt(rawData, SECRET_KEY).toString();

const outputPath = path.join(__dirname, '../public/assets/data.encrypted.json');
fs.writeFileSync(outputPath, JSON.stringify({ data: encrypted }, null, 2));

console.log('✅ Data berhasil dienkripsi!');