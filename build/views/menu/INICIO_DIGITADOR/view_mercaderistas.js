function initView() {
    MercVisitasCore.init({
        prefix: 'DigMerc',
        getSucursal: () => {
            if (typeof digitador_getSucursal === 'function') return digitador_getSucursal();
            return document.getElementById('cmbSucursalHeader')?.value || '%';
        },
        registerRefresh: (fn) => {
            window.digitador_embedRefresh = fn;
        },
    });
}

function destroyView() {
    MercVisitasCore.destroy();
}
