# Nuevo Pedido — tabla de clientes (estructura original)

Respaldo de la tabla de búsqueda de clientes en `build/views/menu/INICIO_VENTAS/view_pedidos.js`  
antes del rediseño a una sola fila + botón **Opciones** (22-08-2026).

Para restaurar: copiar el HTML del thead en `lista_clientes()` y el template de fila de `tbl_clientes()`.

---

## Thead (`lista_clientes`)

```html
<table class="col-12 table table-bordered h-full">
    <thead class="bg-base text-white">
        <tr>
            <td>NIT / CÓDIGO</td>
            <td>CLIENTE / TELÉFONO</td>
            <td></td>
        </tr>
    </thead>
    <tbody id="tblDataClientes"></tbody>
</table>
```

## Fila (`tbl_clientes`) — 3 columnas

| Columna | Contenido |
|---------|-----------|
| 1 | `NIT / CODCLIENTE`, día `VISITA`, botones: Maps (`F.gotoGoogleMaps`), QR (`create_qr_code`), Goles (`get_status_goles`) |
| 2 | `TIPONEGOCIO-NEGOCIO`, `NOMBRE`, `DIRECCION`, `REFERENCIA`, `TELEFONO` |
| 3 | Pedido (`get_datos_cliente`), Visita (`get_visita`), Historial (`get_historial_cliente`) |

### Template JS original

```javascript
str += `
<tr class="hand border-secondary ${strClassVisitado}">    
    <td>
        ${r.NIT} / ${r.CODCLIENTE}
        <br>
        
        <small class="text-danger negrita">${r.VISITA}</small>
        <br>

        <button class="btn btn-md btn-circle btn-info hand shadow" onclick="F.gotoGoogleMaps('${r.LATITUD}','${r.LONGITUD}')">
            <i class="fal fa-globe"></i>
        </button>

        <br><br>

        <button class="btn btn-md btn-circle btn-warning hand shadow" onclick="create_qr_code('${r.CODCLIENTE}','${r.NOMBRE}')">
            <i class="fal fa-barcode"></i>
        </button>

        <br><br>

        <button class="btn btn-circle btn-md btn-primary hand shadow" 
        onclick="get_status_goles('${r.CODCLIENTE}','${r.NOMBRE}','${r.TIPONEGOCIO}','${r.NEGOCIO}')">
            <i class="fal fa-futbol"></i>
        </button>


    </td>
    <td>
        <small class="text-base negrita">${r.TIPONEGOCIO}-${r.NEGOCIO}</small>
        <br>
        ${r.NOMBRE}
        <br>
        <small>${r.DIRECCION}</small>
        <br>
        <small>Ref: ${r.REFERENCIA}</small>
        <br>
        <small>Tel: ${r.TELEFONO}</small>
    </td>
     
    <td>
        <button class="btn btn-circle btn-md btn-success hand shadow" 
        onclick="get_datos_cliente('${r.CODCLIENTE}','${r.NIT}','${r.NOMBRE}','${r.DIRECCION}','${r.TELEFONO}')">
            <i class="fal fa-shopping-cart"></i>
        </button>

        <br><br><br><br>

        <button class="btn btn-circle btn-md btn-outline-danger hand shadow" 
        onclick="get_visita('${r.CODCLIENTE}','${r.NOMBRE}','${r.TIPONEGOCIO}','${r.NEGOCIO}')">
            <i class="fal fa-history"></i>
        </button>

         <br><br>

        <button class="btn btn-circle btn-md btn-secondary hand shadow" 
        onclick="get_historial_cliente('${r.CODCLIENTE}','${r.NOMBRE}','${r.TIPONEGOCIO}','${r.NEGOCIO}')">
            <i class="fal fa-book"></i>
        </button>

        
    </td>
</tr>
`;
```

## Clases de estado

- Visitado (mes curso = mes último): `bg-visitado`
- No visitado: `bg-novisitado`
