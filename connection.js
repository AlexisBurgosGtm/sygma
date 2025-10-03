

function get_conf_token(token){

		//token = empresa que manda la solicitud (puede cambiarse entre empresas)
		//let config = [];

		let config = {
			user: process.env.DB_USER,
			password: process.env.DB_PWD,
			server: process.env.DB_HOST, 
			database: process.env.DB_DB,
			pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000},
			options: {
    			encrypt: false, // for azure
    			trustServerCertificate: true // change to true for local dev / self-signed certs
  			}
		};
	

		return config;		

}



const sql = require('mssql');

let execute = {
	QueryLogin : (res,sqlqry)=>{	
		
		
		try {
		  const pool1 = new sql.ConnectionPool(configHost, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				if(err){
					console.log(err.message);
					res.send('error')
				}else{
					res.send(result);
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
			  res.send('error');
		  })
		} catch (error) {
			console.log(error);
		  res.send('error')   
		  sql.close();
		}
	},
	QueryToken : (res,sqlqry,token)=>{	
		
		let config = get_conf_token(token);

		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				if(err){
					console.log(err.message);
					res.send('error')
				}else{
					res.send(result);
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
			  res.send('error');
		  })
		} catch (error) {
			console.log(error);
		  res.send('error')   
		  sql.close();
		}
	},
	QueryJsonDocproductos : (token,sucursal,coddoc,correlativo)=>{	

		return new Promise((resolve,reject)=>{

				let config = get_conf_token(token);


				let sqlqry = `
				SELECT JSONDOCPRODUCTOS 
					FROM DOCUMENTOS_TEMPORALES
					WHERE EMPNIT='${sucursal}' 
						AND CODDOC='${coddoc}' 
						AND CORRELATIVO=${correlativo};
				`

			
				try {
				const pool1 = new sql.ConnectionPool(config, err => {
					new sql.Request(pool1)
					.query(sqlqry, (err, result) => {
						if(err){
							console.log(err.message);
							reject('error');
						}else{
							//console.log('pedido')
							//console.log(result.recordset[0].JSONDOCPRODUCTOS);

							resolve(result.recordset[0].JSONDOCPRODUCTOS);
						}					
					})
					sql.close();  
				})
				pool1.on('error', err => {
					console.log('error sql = ' + err);
					sql.close();
					reject('error');
				})
				} catch (error) {
					console.log(error);
					reject('error');   
				sql.close();
				}

		})

		
	},
	Query_system : (sqlqry,token)=>{	
		
		let config = get_conf_token(token);

		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				if(err){
					console.log(err.message);
					
				}else{
					//res.send(result);
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
			  res.send('error');
		  })
		} catch (error) {
			console.log(error);
		  res.send('error')   
		  sql.close();
		}
	},
	get_data_qry : (sqlqry,token)=>{	
				
		return new Promise((resolve,reject)=>{

			let config = get_conf_token(token);

			
			try {
				const pool1 = new sql.ConnectionPool(config, err => {
				  new sql.Request(pool1)
				  .query(sqlqry, (err, result) => {
					  if(err){
						  	console.log(err.message);
						  	reject();
					  }else{
							resolve(result);
					  }					
				  })
				  sql.close();  
				})
				pool1.on('error', err => {
					console.log('error sql = ' + err);
					reject();
					sql.close();
				})
			  } catch (error) {
				  	console.log(error);
					reject();   
					sql.close();
			  }

		})

	}
}



module.exports = execute;

