# Navegación por perfil de usuario (SYGMA v2)

Documento de referencia para diagnosticar y extender la navegación **sin router SPA**.
Patrón vigente: clic → `Menu.*` / `Navegar.*` → `F.loadScript` → `initView()`.

> **Última revisión:** junio 2026 — perfiles probados: gerente, supervisor, digitador, vendedor, proveedor.

---

## Mapa de niveles (`GlobalNivelUsuario`)

| Nivel | Perfil        | Vista de inicio                                      | Menú lateral `#root_navbar` |
|------:|---------------|------------------------------------------------------|-----------------------------|
| 1     | Gerencia      | `views/menu/inicio_gerencia.js`                      | **Sí** — menú general (`menu_principal`) |
| 2     | Supervisor    | `views/menu/INICIO_SUPERVISOR/inicio_supervisor.js`  | **No** — solo cards (`#supervisorSidebar`) |
| 3     | Vendedor      | `views/menu/INICIO_VENTAS/inicio_ventas.js`          | **No** — solo cards (`#ventasSidebar`) |
| 4     | Repartidor    | `views/menu/inicio_despacho.js`                      | Menú repartidor (vacío por ahora) |
| 5     | Digitador     | `views/menu/INICIO_DIGITADOR/inicio_digitador.js`    | **Sí** — menú general (`menu_principal`) |
| 6     | Compras/Bodega| `views/menu/inicio_compras.js`                       | Pendiente definir |
| 7     | Proveedor     | `views/menu/INICIO_PROVEEDOR/inicio_proveedor.js`    | **No** — solo cards (`#proveedorSidebar`) |
| 8     | Vendedor comodín | Igual que vendedor (nivel 3)                      | **No** — solo cards |

La lógica central está en `build/controllers/classNavegar.js`.

---

## Menú general — CONGELADO (jun 2026)

**No modificar el comportamiento del menú lateral SYGMA** (`#root_navbar`) al trabajar en dashboard digitador u otras vistas. Solo se permite **agregar o quitar ítems** en `menu_buttons.js` (HTML + `onclick="Menu.xxx()"`).

| Archivo | ¿Se puede tocar? |
|---------|------------------|
| `menu_buttons.js` | Solo ítems del menú (HTML). INICIO siempre `onclick="Navegar.inicio();"` |
| `classNavegar.js` | **No** (salvo petición explícita del usuario) |
| `menu_handler.js` | **No** |
| `GlobalFunciones.js` (`fcn_load_navbar`) | **No** |
| `inicio_digitador.js` y cards internas | **Sí** — SPA solo aquí (`digitador_showPanel`) |

---

## Flujo de navegación

```
Login (view_login.js)
  └─ login_submit → GlobalNivelUsuario = NIVEL → Navegar.inicio()

Navegar.inicio()                     ← INICIO del menú lateral #root_navbar
  ├─ Navegar.mostrarMenu()
  └─ Navegar.inicio_<perfil>()       ← F.loadScript (legacy, siempre recarga)

Cards internas del perfil (digitador, supervisor…)
  └─ xxx_showPanel / xxx_showHome    ← SPA solo aquí, sin F.loadScript

Opciones del menú general
  └─ Menu.verify() → Menu.xxx() → F.loadScript (reemplaza #root)
```

---

## Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `controllers/classNavegar.js` | Login, salir, `Navegar.inicio()`, `inicio_*` por nivel, visibilidad del menú lateral |
| `controllers/GlobalFunciones.js` | `GF.fcn_load_navbar(menu, idNavbar, idContainer)` — HTML del sidebar por rol |
| `controllers/menu_buttons.js` | Plantillas HTML: `menu_principal`, `inicio_gerente`, `inicio_digitador`, etc. |
| `controllers/menu_handler.js` | `Menu.verify()` llama `Navegar.mostrarMenu()` antes de cada opción |
| `libs/funciones.js` | `F.loadScript(url, 'root')` — reemplaza `#root` y ejecuta el script |
| `css/custom_theme.css` | `body.login-active` y `body.spa-nav-hidden` ocultan `#root_navbar` |
| `views/general_login/view_login.js` | Login; `login_setPageMode(true/false)` toggles `login-active` |

---

## Funciones importantes en `classNavegar.js`

### `usaMenuSoloCards()`
Perfiles que **no** deben ver el menú lateral general SYGMA:

```javascript
// Niveles: 2 supervisor, 3 vendedor, 7 proveedor, 8 vendedor comodín
return nivel === 2 || nivel === 3 || nivel === 7 || nivel === 8;
```

Cuando aplica:
- Se añade `spa-nav-hidden` al `<body>`
- Se vacía `#js-primary-nav`
- **No** se llama a `GF.fcn_load_navbar`

### `mostrarMenu()`
- Quita `login-active` (sin esto el usuario ve login aunque la sesión sea válida)
- Si `usaMenuSoloCards()` → ocultar sidebar
- Si no → mostrar `#root_navbar` y cargar menú con `GF.fcn_load_navbar(getMenuRole(), ...)`

### `ocultarMenu()`
Usado en login/salir. Añade `login-active` + `spa-nav-hidden`.

### `enVistaPerfil(containerId)`
Comprueba si la vista del perfil ya está montada en el DOM (p. ej. `#supervisorSidebar`).

**Crítico para re-login:** no usar atajos de “volver al home” solo porque la función global existe; las funciones **persisten en memoria** tras cerrar sesión aunque `#root` ya muestre el login.

### Patrón correcto en `inicio_<perfil>()`

```javascript
inicio_supervisor: () => {
    if (Number(GlobalNivelUsuario) === 0) return;
    // Atajo SOLO si la vista ya está en pantalla
    if (Navegar.enVistaPerfil('supervisorSidebar') && typeof supervisor_showHome === 'function') {
        supervisor_teardownEmbed?.();
        supervisor_showHome();
        return;
    }
    // Primer login o re-login tras salir → recargar script
    F.loadScript('../views/menu/INICIO_SUPERVISOR/inicio_supervisor.js', 'root')
        .then(() => initView());
},
```

Misma regla para:
- **Proveedor:** `#proveedorSidebar` + `proveedor_showHome`
- **Vendedor:** `#ventasSidebar` + `ventas_showHome`

---

## `GF.fcn_load_navbar(menu, idNavbar, idContainer)`

Restaurado desde el patrón original (commit `ab76095`). Recibe el **rol**, no solo el contenedor.

| Rol `menu` | Función en `menu_buttons.js` |
|------------|-------------------------------|
| `GERENCIA` | `inicio_gerente()` → alias de `menu_principal()` |
| `DIGITADOR` | `menu_general_digitador()` → alias de `menu_principal()` |
| `VENDEDOR` | `inicio_vendedor()` (menú reducido; perfiles 3/8 no lo usan porque ocultan sidebar) |
| `VENDEDOR_COMODIN` | `inicio_vendedor_comodin()` |
| `SUPERVISOR` | `inicio_supervisor()` (legacy; perfil 2 no muestra sidebar) |
| `REPARTIDOR` | vacío |

---

## Clases CSS del body

| Clase | Efecto |
|-------|--------|
| `login-active` | Oculta header y `#root_navbar`; pantalla completa para login |
| `spa-nav-hidden` | Oculta `#root_navbar`; contenido a ancho completo (vistas con cards) |

Ambas están en `build/css/custom_theme.css`. **No** reintroducir reglas `!important` que oculten el navbar después de un login exitoso sin quitar `login-active`.

---

## Problemas frecuentes y solución

### 1. Usuario queda en login tras reingresar (supervisor, proveedor, vendedor)

**Síntoma:** Login OK pero la pantalla sigue siendo el formulario de login.

**Causa:** `inicio_<perfil>()` detectaba `supervisor_showHome` (u otra función) en memoria y ejecutaba el atajo **sin** recargar la vista; el DOM seguía siendo el del login.

**Solución:** Comprobar siempre el contenedor DOM con `Navegar.enVistaPerfil('...Sidebar')` antes del atajo.

---

### 2. INICIO / SALIR no responden

**Causas posibles:**
- `login-active` no se quitó → revisar `mostrarMenu()`
- Menú general se inyectó sobre vista de cards → revisar `usaMenuSoloCards()`
- `Menu.verify()` vuelve a mostrar menú incorrecto → debe usar `Navegar.mostrarMenu()` (ya centralizado)

---

### 3. Error al pulsar INICIO varias veces (`Identifier already declared`)

**Causa:** `F.loadScript` vuelve a ejecutar el `.js` de la vista. Variables de módulo con `let`/`const` en el nivel superior fallan en la segunda carga.

**Solución:** En vistas que se recargan con `F.loadScript`, usar `var` en el top-level **o** el atajo con `enVistaPerfil()` para evitar recargas innecesarias.

Archivos ya ajustados:
- `INICIO_SUPERVISOR/inicio_supervisor.js`
- `INICIO_PROVEEDOR/inicio_proveedor.js`
- `INICIO_DIGITADOR/inicio_digitador.js` (ya usaba `var`)
- `INICIO_VENTAS/inicio_ventas.js` (ya usaba `var`)

---

### 4. Perfil ve el menú general cuando no debe

**Solución:** Añadir su `GlobalNivelUsuario` a `usaMenuSoloCards()` **o** mapearlo en `getMenuRole()` si debe ver menú reducido en `#root_navbar`.

---

## Checklist: agregar o corregir un perfil nuevo

1. **Definir tipo de menú**
   - [ ] ¿Menú lateral general (`#root_navbar`)? → mapear en `getMenuRole()` + `menu_buttons.js`
   - [ ] ¿Solo cards/sidebar interno? → añadir nivel a `usaMenuSoloCards()`

2. **Vista de inicio**
   - [ ] Crear `inicio_<perfil>.js` con `getView()`, `initView()`, `addListeners()`
   - [ ] ID estable del sidebar en el HTML (p. ej. `#miPerfilSidebar`) para `enVistaPerfil()`
   - [ ] Función `miPerfil_showHome()` para atajo de INICIO
   - [ ] Top-level con `var`, no `let`/`const`, si la vista se recarga con `F.loadScript`

3. **`classNavegar.js`**
   - [ ] Caso en `Navegar.inicio()` switch
   - [ ] `Navegar.inicio_<perfil>()` con patrón DOM + `F.loadScript`
   - [ ] Actualizar `usaMenuSoloCards()` o `getMenuRole()` según corresponda

4. **Probar ciclo completo**
   - [ ] Login → inicio carga bien
   - [ ] INICIO desde cards o menú lateral
   - [ ] Salir → login visible
   - [ ] **Re-login** → entra al dashboard (no queda en login)
   - [ ] Navegar a un módulo (`Menu.xxx`) y volver

5. **CSS**
   - [ ] Si la vista usa layout tipo proveedor, clase `proveedor-page` en `#js-page-content` (ver vistas existentes)

---

## Referencia rápida: IDs de sidebar por perfil

| Perfil     | ID DOM para `enVistaPerfil()` | Función home        |
|------------|-------------------------------|---------------------|
| Supervisor | `supervisorSidebar`           | `supervisor_showHome` |
| Proveedor  | `proveedorSidebar`            | `proveedor_showHome` |
| Vendedor   | `ventasSidebar`               | `ventas_showHome` |
| Digitador  | `digitadorSidebar` (interno)  | `digitador_showHome` |

Digitador y gerente **sí** usan además `#root_navbar` con menú general.

---

## Lo que NO reintroducir

- `menuGeneral.js` / `MenuGeneral.volverInicioPerfil()` — eliminado a propósito
- Router SPA en `index.html` (`spaRouter.js`, hashes) salvo decisión explícita de migrar de nuevo
- `__spaViewHooks` para navegación del menú general SYGMA
- `data-mp-action="home"` en el menú lateral — usar `onclick="Navegar.inicio();"`
- `mostrarMenu()` que siempre cargue `menu_principal()` sin mirar el nivel
- Atajos `if (typeof xxx_showHome === 'function')` **sin** comprobar el DOM (excepto digitador: menú general siempre recarga)
- `let`/`const` a nivel de archivo en vistas recargables por `F.loadScript`

---

## Historial del arreglo (jun 2026)

1. Restaurado `GF.fcn_load_navbar` por rol (gerente/digitador con `menu_principal`).
2. Perfiles con cards: ocultar `#root_navbar` vía `usaMenuSoloCards()` + `spa-nav-hidden`.
3. `mostrarMenu()` / `ocultarMenu()` gestionan `login-active` para login y post-login.
4. Atajo INICIO con comprobación DOM (`enVistaPerfil`) — fix re-login supervisor/proveedor/vendedor.
5. `let`/`const` → `var` en vistas supervisor/proveedor para recargas seguras.
