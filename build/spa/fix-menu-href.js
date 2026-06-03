'use strict';
const fs = require('fs');
const p = require('path').join(__dirname, '../controllers/menu_buttons.js');
let s = fs.readFileSync(p, 'utf8');
s = s.replace(/href="#"\s+/g, '');
fs.writeFileSync(p, s);
console.log('Fixed menu_buttons.js');
