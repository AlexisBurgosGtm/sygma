let RPT = {
    data_ventas_vendedor:(empnit,mes,anio)=>{

        return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/reportes/rpt_ventas_vendedor', {
                token:TOKEN,
                sucursal:empnit,
                mes:mes,
                anio:anio
            })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    
    },


}