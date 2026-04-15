try {
    //delete window.classTipodocumentos;
    classConta = undefined;
} catch (error) {
    console.log('Error en la clase ' + error)
}
var classConta = {
    get_data_formatos(){
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/conta/listado_formatos',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit
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