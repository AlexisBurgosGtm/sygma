'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 3003;
const IS_WIN = process.platform === 'win32';

function run(cmd) {
    try {
        return execSync(cmd, {
            encoding: 'utf8',
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'ignore']
        });
    } catch (e) {
        return e.stdout ? String(e.stdout) : '';
    }
}

function uniqPids(list) {
    return [...new Set(list.map((p) => Number(p)).filter((p) => p > 0 && p !== process.pid))];
}

function pidsListeningOnPort(port) {
    const out = run(IS_WIN ? 'netstat -ano' : `lsof -iTCP:${port} -sTCP:LISTEN -n -P`);
    const pids = [];
    const portRe = new RegExp(`[:\\]]${port}(?!\\d)`);

    String(out).split(/\r?\n/).forEach((line) => {
        if (IS_WIN) {
            if (!/LISTENING/i.test(line) || !portRe.test(line)) return;
            const parts = line.trim().split(/\s+/);
            pids.push(parts[parts.length - 1]);
            return;
        }
        const m = line.match(/\b(\d+)\b\s*$/) || line.match(/\s(\d+)\s+/);
        if (m) pids.push(m[1]);
    });
    return uniqPids(pids);
}

function isThisAppCommand(cmd) {
    const raw = String(cmd || '');
    if (!raw || raw.includes('stop-server.js')) return false;
    const n = raw.replace(/\//g, '\\').toLowerCase();
    const root = ROOT.replace(/\//g, '\\').toLowerCase();
    const serverFile = path.join(ROOT, 'server.js').replace(/\//g, '\\').toLowerCase();
    if (n.includes(serverFile)) return true;
    if (n.includes(root) && (n.includes('server.js') || n.includes('nodemon'))) return true;
    return false;
}

function pidsThisApp() {
    const pids = [];
    if (IS_WIN) {
        const out = run('wmic process where "name=\'node.exe\'" get ProcessId,CommandLine /format:list');
        let cmd = '';
        String(out).split(/\r?\n/).forEach((line) => {
            const t = line.trim();
            if (/^CommandLine=/i.test(t)) {
                cmd = t.slice(t.indexOf('=') + 1);
                return;
            }
            if (/^ProcessId=/i.test(t)) {
                if (isThisAppCommand(cmd)) pids.push(t.split('=')[1]);
                cmd = '';
            }
        });
        return uniqPids(pids);
    }

    const out = run("ps -ax -o pid=,command=");
    String(out).split(/\n/).forEach((line) => {
        const m = line.trim().match(/^(\d+)\s+(.+)$/);
        if (m && isThisAppCommand(m[2])) pids.push(m[1]);
    });
    return uniqPids(pids);
}

function killPid(pid) {
    if (IS_WIN) {
        run(`taskkill /PID ${pid} /T /F`);
        return;
    }
    try {
        process.kill(pid, 'SIGTERM');
    } catch (e) { /* already gone */ }
}

const targets = uniqPids([...pidsListeningOnPort(PORT), ...pidsThisApp()]);

if (!targets.length) {
    console.log(`Servicio SYGMA no está activo (puerto ${PORT}).`);
    process.exit(0);
}

targets.forEach(killPid);
console.log(`Servicio SYGMA detenido (PID ${targets.join(', ')}, puerto ${PORT}).`);
process.exit(0);
