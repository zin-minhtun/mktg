const fs = require('fs');
const path = require('path');
try {
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    console.log('--- ENV CONTENT START ---');
    console.log(envContent);
    console.log('--- ENV CONTENT END ---');
} catch (e) {
    console.error(e);
}
