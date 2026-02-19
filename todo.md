* actualizar correlativo automatico
* recargar correlativo antes de guardar pedido
* 

let combo = document.getElementById("miSelect");
let textoSeleccionado = combo.options[combo.selectedIndex].text;


SELECT convert(varchar, getdate(), 103) -- dd/mm/yyyy
SELECT convert(varchar, getdate(), 105) -- dd-mm-yyyy
