/**
 * Migra onclick="Menu.*" / Navegar.* a enlaces data-spa-* (ejecutar una vez).
 * node build/spa/migrate-links.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const MENU_ROUTES = {
    pos: 'ventas/pos',
    devoluciones_clientes: 'transacciones/devoluciones',
    devoluciones_proveedores: 'transacciones/devoluciones-proveedores',
    compras: 'compras/compras',
    bodega_surtido: 'bodega/surtido',
    productos: 'compras/productos',
    compras_gestion_precios: 'compras/gestion-precios',
    compras_gestion_minmax: 'compras/gestion-minmax',
    bodega_inv_fisico: 'bodega/inv-fisico',
    bodega_inv_retroactivo: 'bodega/inv-retroactivo',
    bodega_lista_precios: 'bodega/lista-precios',
    objetivos: 'bi/objetivos',
    objetivos_bi: 'bi/objetivos-dashboard',
    objetivos_goles: 'bi/goles',
    objetivos_cobertura: 'bi/cobertura',
    objetivos_logro_procter: 'bi/logro-procter',
    empleados_gps: 'mant/empleados-gps',
    objetivos_visitas_gps: 'bi/visitas-gps',
    objetivos_cobertura_municipios: 'bi/cobertura-municipios',
    report_ventas_vendedor: 'bi/reporte-ventas-vendedor',
    report_ventas_marcas: 'bi/reporte-ventas-marcas',
    documentos: 'archivo/documentos',
    ventas_visitas: 'ventas/visitas',
    reporte_bonificaciones: 'archivo/reporte-bonificaciones',
    mantenimiento_generales: 'mant/generales',
    clientes: 'mant/clientes',
    clientes_rutas: 'mant/clientes-rutas',
    municipios_departamentos: 'mant/municipios',
    empleados: 'mant/empleados',
    proveedores: null,
    medidas: 'mant/marcas',
    config_tipodocumentos: 'config/tipodocumentos',
    ventas_pedidos: 'ventas/pedidos',
    ventas_censo: 'ventas/censo',
    ventas_pedidos_comodin: 'ventas/pedidos-comodin',
    documentos_eliminados: null,
    configuraciones: null,
    usuarios: null,
    empresas: null
};

function hash(route, params) {
    const q = Object.keys(params || {})
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
    return '#/' + route + (q ? '?' + q : '');
}

function linkAttrs(route, params) {
    const p = params || {};
    let s = 'href="' + hash(route, p) + '" data-spa-route="' + route + '"';
    if (Object.keys(p).length) {
        s += " data-spa-params='" + JSON.stringify(p) + "'";
    }
    return s;
}

function migrateContent(text) {
    let out = text;

    out = out.replace(/\s+onclick="Navegar\.inicio\(\);?"/g, ' ' + 'href="#" data-spa-action="inicio"');
    out = out.replace(/\s+onclick="Navegar\.inicio\(\)"/g, ' ' + 'href="#" data-spa-action="inicio"');
    out = out.replace(/\s+onclick="Navegar\.salir\(\)"/g, ' ' + 'href="#" data-spa-action="salir"');
    out = out.replace(/\s+onclick="Menu\.pendiente\(\)"/g, ' ' + 'href="#" data-spa-action="pendiente"');

    out = out.replace(
        /\s+onclick="Menu\.bodega_movinv\('([^']+)'\)"/g,
        (_, tipodoc) => ' ' + linkAttrs('bodega/movinv', { tipodoc })
    );

    Object.keys(MENU_ROUTES).forEach((method) => {
        const route = MENU_ROUTES[method];
        const re = new RegExp('\\s+onclick="Menu\\.' + method + '\\(\\)"', 'g');
        if (route === null) {
            out = out.replace(re, ' href="#" data-spa-action="pendiente"');
        } else {
            out = out.replace(re, ' ' + linkAttrs(route));
        }
    });

    return out;
}

function walk(dir, files = []) {
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (name === 'node_modules' || name === 'vendor') continue;
        const st = fs.statSync(full);
        if (st.isDirectory()) walk(full, files);
        else if (/\.(js|html)$/.test(name) && !name.includes('migrate-links')) files.push(full);
    }
    return files;
}

const targets = [
    path.join(ROOT, 'controllers', 'menu_buttons.js'),
    ...walk(path.join(ROOT, 'views')).filter(
        (f) =>
            !f.includes('BACKUP') &&
            (f.includes('view_') ||
                f.includes('inicio_') ||
                f.includes('menu.js') ||
                f.includes('config_tipodocumentos'))
    )
];

let changed = 0;
targets.forEach((file) => {
    const before = fs.readFileSync(file, 'utf8');
    const after = migrateContent(before);
    if (after !== before) {
        fs.writeFileSync(file, after, 'utf8');
        changed++;
        console.log('Updated:', path.relative(ROOT, file));
    }
});

console.log('Done. Files changed:', changed);
