'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function fixFile(file) {
    let s = fs.readFileSync(file, 'utf8');
    const before = s;

    s = s.replace(
        /<a([^>]*)\sdata-spa-action="inicio"([^>]*)>/g,
        (m, a, b) => {
            if (/href=/.test(a + b)) return m;
            return '<a href="#" ' + a.trim() + ' data-spa-action="inicio"' + b + '>';
        }
    );

    s = s.replace(
        /<a([^>]*)\sdata-spa-action="pendiente"([^>]*)>/g,
        (m, a, b) => {
            if (/href=/.test(a + b)) return m;
            return '<a href="#" ' + a.trim() + ' data-spa-action="pendiente"' + b + '>';
        }
    );

    s = s.replace(/<button([^>]*)\shref="#"\s/g, '<button$1 ');
    s = s.replace(/<button([^>]*)\sdata-spa-action="inicio"/g,
        '<button type="button"$1 data-spa-action="inicio"');

    if (s !== before) {
        fs.writeFileSync(file, s);
        return true;
    }
    return false;
}

function walk(dir, files = []) {
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (name === 'node_modules' || name === 'vendor') continue;
        const st = fs.statSync(full);
        if (st.isDirectory()) walk(full, files);
        else if (/\.js$/.test(name) && !name.includes('migrate-links') && !name.includes('fix-')) {
            files.push(full);
        }
    }
    return files;
}

let n = 0;
[path.join(ROOT, 'controllers', 'menu_buttons.js'), ...walk(path.join(ROOT, 'views'))].forEach((f) => {
    if (fixFile(f)) {
        n++;
        console.log(path.relative(ROOT, f));
    }
});
console.log('Fixed', n, 'files');
