const fs = require('fs');
const path = require('path');

const command = process.argv[2];

if (command === 'init') {
    const ogit = path.join(process.cwd(), '.ogit'); 
    console.log("Initializing ogit repository...");

    if (fs.existsSync(ogit)) {
        console.log("ogit already initialized.");
    } else {
        console.log("Creating .ogit repository...");

        fs.mkdirSync(ogit);  
        fs.mkdirSync(path.join(ogit, 'objects'));
        fs.mkdirSync(path.join(ogit, 'refs'));
        fs.mkdirSync(path.join(ogit, 'refs', 'heads'));

        console.log("ogit repository initialized successfully!");
    }
} else {
    console.log("Unknown command:", command);
}
