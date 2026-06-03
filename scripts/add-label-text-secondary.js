'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TARGET_DIRS = [
    path.join(ROOT, 'build', 'views'),
    path.join(ROOT, 'build', 'controllers'),
    path.join(ROOT, 'build', 'design')
];
const TARGET_FILES = [
    path.join(ROOT, 'build', 'index.html'),
    path.join(ROOT, 'build', 'print_ticket_factura.html')
];

const LABEL_RE = /<label(\s[^>]*)?>/gi;

function shouldSkipFile(filePath) {
    const base = path.basename(filePath);
    if (base.startsWith('BACKUP')) return true;
    return false;
}

function processLabelTag(full, attrs) {
    if (!attrs || !attrs.trim()) {
        return '<label class="text-secondary">';
    }

    const classMatch = attrs.match(/\bclass\s*=\s*("([^"]*)"|'([^']*)')/i);
    if (!classMatch) {
        return `<label${attrs} class="text-secondary">`;
    }

    const classValue = (classMatch[2] || classMatch[3] || '').trim();
    const classes = classValue.split(/\s+/).filter(Boolean);

    if (classes.length === 1 && classes[0] === 'negrita') {
        const quote = classMatch[1].startsWith('"') ? '"' : "'";
        const newClass = `class=${quote}negrita text-secondary${quote}`;
        return `<label${attrs.replace(classMatch[0], newClass)}>`;
    }

    return full;
}

function processContent(content) {
    return content.replace(LABEL_RE, (match, attrs) => processLabelTag(match, attrs));
}

function walk(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const st = fs.statSync(full);
        if (st.isDirectory()) walk(full, files);
        else if (/\.(js|html)$/.test(name)) files.push(full);
    }
    return files;
}

let changed = 0;
const files = [
    ...TARGET_DIRS.flatMap((d) => walk(d)),
    ...TARGET_FILES.filter((f) => fs.existsSync(f))
].filter((f) => !shouldSkipFile(f));

files.forEach((file) => {
    const before = fs.readFileSync(file, 'utf8');
    const after = processContent(before);
    if (after !== before) {
        fs.writeFileSync(file, after, 'utf8');
        changed++;
        console.log(path.relative(ROOT, file));
    }
});

console.log('Archivos actualizados:', changed);
