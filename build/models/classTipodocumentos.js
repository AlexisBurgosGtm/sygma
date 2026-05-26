try {
    //delete window.classTipodocumentos;
    classTipodocumentos = undefined;
} catch (error) {
    console.log('Error en la clase ' + error)
}
let classTipodocumentos = {
    get_tbl_documentos(){
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/tipodocumentos/listado_general',
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
    update_status_documento(coddoc,status){
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/tipodocumentos/update_status',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit,
                    coddoc:coddoc,
                    status:status
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
    get_data_tipos(){
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/tipodocumentos/listado_tipos',
                {
                    token:TOKEN
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
    insert_tipodocumento(tipodoc,coddoc,correlativo,descripcion,contacon,contacre){
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/tipodocumentos/insert_tipodocumento',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit,
                    tipodoc:tipodoc,
                    coddoc:coddoc,
                    correlativo:correlativo,
                    descripcion:descripcion,
                    fcontacon:contacon,
                    fcontacre:contacre
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
    edit_tipodocumento(coddoc,correlativo,descripcion,contacon,contacre){
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/tipodocumentos/edit_tipodocumento',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit,
                    coddoc:coddoc,
                    correlativo:correlativo,
                    descripcion:descripcion,
                    fcontacon:contacon,
                    fcontacre:contacre
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
    delete_tipodocumento(coddoc){
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/tipodocumentos/delete_tipodocumento',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit,
                    coddoc:coddoc
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
    verify_movimientos_tipodocumento(coddoc){
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/tipodocumentos/verify_movimientos',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit,
                    coddoc:coddoc
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
    
    }
}