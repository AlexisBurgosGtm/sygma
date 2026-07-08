function initView() {
    MercVisitasCore.init({
        prefix: 'ProvMerc',
        getSucursal: () => {
            if (typeof proveedor_getSucursal === 'function') return proveedor_getSucursal();
            return document.getElementById('cmbSucursalHeader')?.value || '%';
        },
        registerRefresh: (fn) => {
            window.proveedor_embedRefresh = fn;
        },
    });
}

function destroyView() {
    MercVisitasCore.destroy();
}
