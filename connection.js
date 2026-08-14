

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
    			trustServerCertificate: true, // change to true for local dev / self-signed certs
				requestTimeout: 120000
  			}
		};
	
		return config;		

}



const sql = require('mssql');

const sqlPools = new Map();

function poolKey(config) {
	return `${config.server}|${config.database}|${config.user}`;
}

function getSharedPool(config) {
	const key = poolKey(config);
	const existing = sqlPools.get(key);
	if (existing) return existing;

	const pool = new sql.ConnectionPool(config);
	const ready = pool.connect()
		.then(() => pool)
		.catch((err) => {
			sqlPools.delete(key);
			try { pool.close(); } catch (e) { /* ignore */ }
			throw err;
		});
	pool.on('error', (err) => {
		console.log('error sql pool = ' + err);
		sqlPools.delete(key);
		try { pool.close(); } catch (e) { /* ignore */ }
	});
	sqlPools.set(key, ready);
	return ready;
}

function sendQuery(res, sqlqry, config) {
	getSharedPool(config)
		.then((pool) => pool.request().query(sqlqry))
		.then((result) => res.send(result))
		.catch((err) => {
			console.log(err && err.message ? err.message : err);
			res.send('error');
		});
}

let execute = {
	QueryLogin : (res,sqlqry)=>{	
		sendQuery(res, sqlqry, get_conf_token());
	},
	QueryToken : (res,sqlqry,token)=>{	
		sendQuery(res, sqlqry, get_conf_token(token));
	},
	/**
	 * Ejecuta trabajo dentro de una transacción mssql con request parametrizable.
	 * workFn(transaction, sql) debe retornar Promise.
	 */
	TransactionToken : (token, workFn) => {
		return new Promise(async (resolve, reject) => {
			try {
				const pool = await getSharedPool(get_conf_token(token));
				const transaction = new sql.Transaction(pool);
				await transaction.begin();
				try {
					const result = await workFn(transaction, sql);
					await transaction.commit();
					resolve(result);
				} catch (err) {
					try { await transaction.rollback(); } catch (e) { /* ignore */ }
					reject(err);
				}
			} catch (err) {
				reject(err);
			}
		});
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

			
				getSharedPool(config)
				.then((pool) => pool.request().query(sqlqry))
				.then((result) => {
					resolve(result.recordset[0].JSONDOCPRODUCTOS);
				})
				.catch((err) => {
					console.log(err && err.message ? err.message : err);
					reject('error');
				});

		})

		
	},
	Query_system : (sqlqry,token)=>{	
		
		let config = get_conf_token(token);

		getSharedPool(config)
			.then((pool) => pool.request().query(sqlqry))
			.catch((err) => {
				console.log(err && err.message ? err.message : err);
			});
	},
	get_data_qry : (sqlqry,token)=>{	
				
		return new Promise((resolve,reject)=>{

			let config = get_conf_token(token);

			
			getSharedPool(config)
				.then((pool) => pool.request().query(sqlqry))
				.then((result) => resolve(result))
				.catch((err) => {
					console.log(err && err.message ? err.message : err);
					reject();
				});

		})

	}
}



module.exports = execute;

