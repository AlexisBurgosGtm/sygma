 //-----------------------------------------------
//personalizacion de marcadores
           
    //clase con opciones del icono
    var LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: './libs/leaflet/images/marker-shadow.png',
            iconSize: [18, 35],
            shadowSize: [0, 0],
            iconAnchor: [20, 92],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        }
    });

     
    var greenIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-icon-green.png'});
    var redIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-icon-red.png'});
    var blueIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-icon.png'});
    var userIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-user.png'});
        
//-----------------------------------------------
//-----------------------------------------------
