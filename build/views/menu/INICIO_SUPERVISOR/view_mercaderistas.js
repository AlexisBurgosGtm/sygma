function initView() {
    MercVisitasCore.init({
        prefix: 'SupMerc',
        getSucursal: () => {
            if (typeof supervisor_getSucursal === 'function') return supervisor_getSucursal();
            return GlobalEmpnit || document.getElementById('cmbSucursalHeader')?.value || '%';
        },
        registerRefresh: (fn) => {
            window.supervisor_mercaderistas_refresh = fn;
        },
    });
}

function destroyView() {
    window.supervisor_mercaderistas_refresh = null;
    MercVisitasCore.destroy();
}
