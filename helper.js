
let helpers = {
    getFecha(){
        let fecha
        let f = new Date(); 
        let d = f.getDate(); 
        let m = f.getUTCMonth()+1; 

        switch (d.toString()) {
          case '30':
            m = f.getMonth()+1; 
            break;
          case '31':
            m = f.getMonth()+1; 
              break;
        
          default:

            break;
        }

        
        let y = f.getFullYear();
      
        di = d;
        var D = '0' + di;
        let DDI 
        if(D.length==3){DDI=di}else{DDI=D}
        
        ma = m;
        var MA = '0' + ma;
        let DDM 
        if(MA.length==3){DDM=ma}else{DDM=MA}


        fecha = y + '-' + DDM + '-' + DDI;
        return fecha;
      },
};


module.exports = helpers;

