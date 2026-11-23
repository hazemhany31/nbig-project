const fs = require('fs');
const path = '/Users/hazemhany/Desktop/sky-hills/images/ski hills44.jpg';
if (fs.existsSync(path)) {
    console.log('Found it!');
} else {
    console.log('Not found or no access');
}
