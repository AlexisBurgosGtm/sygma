let SEGURIDAD = {
    guatex : ()=>{
        

        return new Promise((resolve,reject)=>{

            let data = {
                usuario:"APIGUATEX",
                password:"GTXADMINGT",
                codigoCobro:"CON1289"
            }

            axios.post('/guatex', data)
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject('error');
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject('error');
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject(error);
            });
        }) 


    },
    get_permiso : (permiso)=>{

        switch (permiso) {
            case '':
                
                break;
            case '':
                
                break;
            case '':
                
                break;
            case '':
                
                break;
            case '':
                
                break;
            case '':
                
                break;
            case '':
                
                break;
        }
    
    },
    
}



