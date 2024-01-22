// Librería de acceso a datos

// Acceso a las funciones de lectura/escritura de ficheros en NodeJS en forma de promesas
// Las funciones a utilizar son:
// fs.readFile(RUTA_FICHERO) - Para leer el contenido de un fichero. Devuelve una promesa.
// fs.writeFile(RUTA_FICHERO, DATOS_EN_FORMATO_TEXTO) - Para escribir el contenido de un fichero. Devuelve una promesa.
import { promises as fs } from 'fs';

// Ruta del fichero de almacenamiento de datos
let ficheroDatos = "./datos.json";

// Para actualizar el fichero de datos en los tests
function cambiarFicheroDatos(nombre) {
    ficheroDatos = nombre;
}

// Debe devolver una promesa que cuando se resuelva devuelva el array de gastos del usuario
function obtenerGastosUsuario(usuario) {
    //^leer el contenido del archivo datos.json mediante la función fs.readFile(NOMBRE_ARCHIVO).
    return fs.readFile(ficheroDatos,'utf-8')
        .then((datosJSON) => {
            //^Una vez resuelta la promesa, se convertirán los datos de JSON a un objeto de JS
            let datosJS = JSON.parse(datosJSON);
                //^Por último, devolverá un array correspondiente a los datos del usuario pasado como parámetro.
                //^Si no existe el usuario, devolverá el array vacío.
            return datosJS[usuario] || []; 
        })
        .catch ((error) => {
            console.error(`Se ha producido el error ${error}`);
        })
}
/*test <SO>:
obtenerGastosUsuario('usuario2')
    .then((gastos) => {
        console.log(`Gastos del usuario2:`, gastos);
    })
    .catch((error) => {
        console.error(`Ha ocurrido un error: ${error}`);
    });
ejecutar: ctrl + ñ, introducir: node accesoDatos.js
*/

// Debe devolver una promesa. Cuando se resuelva se debe haber añadido un nuevo gasto al usuario
// y actualizado el fichero de datos
function anyadirGastoUsuario(usuario, gasto) {
//^leer el contenido del archivo datos.json mediante la función fs.readFile(NOMBRE_ARCHIVO).
    return fs.readFile(ficheroDatos, 'utf-8')
        .then((datosJSON) => {
                //^Una vez resuelta la promesa, se convertirán los datos de JSON a un objeto de JS
                let datosJS = JSON.parse(datosJSON);
                //^Se añadirá un objeto gasto pasado como parámetro a la lista de gastos
                //^del usuario pasado como parámetro. Si el usuario no existe, se creará
                if (datosJS[usuario]) {
                    datosJS[usuario].push(gasto);
                }
                else {
                    datosJS[usuario] = [gasto];
                }
                return datosJS;
            }
        )
        .then((datosJSactualizados) => {
                //^Por último, escribirán los datos actualizados al archivo mediante la función
                //^fs.writeFile(NOMBRE_ARCHIVO, DATOS_EN_FORMATO_TEXTO) y devolvera la promesa
                //^generada `por fs.writeFile
                let datosJSONactualizados = JSON.stringify(datosJSactualizados);
                return fs.writeFile(ficheroDatos, datosJSONactualizados);
            }
        )
}

// Debe devolver una promesa. Cuando se resuelva se debe haber modificado el gasto del usuario
// y actualizado el fichero de datos
function actualizarGastoUsuario(usuario, gastoId, nuevosDatos) {
    //^leer el contenido del archivo datos.json mediante la función fs.readFile(NOMBRE_ARCHIVO).
    return fs.readFile(ficheroDatos, 'utf-8')
        .then((datosJSON) => {
                //^Una vez resuelta la promesa, se convertirán los datos de JSON a un objeto de JS
                let datosJS = JSON.parse(datosJSON);
                //console.log('Datos antes de la actualización:', datosJS);
                //^se actualizará el gasto cuyo Id sea el gastoId pasado como parámetro a la lista
                //^de gastos del usuario pasado también como parámetro. Los nuevos datos estarán
                //^disponibles en el parámetro nuevosDatos
                if (datosJS[usuario]) {
                    let indice = datosJS[usuario].findIndex(
                        gasto => gasto.id == gastoId);
                    //console.log('Índice del gasto a actualizar:', indice);
                    if (indice != -1) {
                        datosJS[usuario].splice(indice, 1);
                        datosJS[usuario].push(nuevosDatos);
                      //console.log('Datos después de la actualización:', datosJS);
                        return datosJS;
                    }
                    //^En el caso de que el usuario o el gastoId indicados no existan, se generará
                    //^un error
                    else {
                        throw new Error(`El gasto de ID ${gastoId} del usuario ${usuario} no existe`);
                    } 
                }
                //^En el caso de que el usuario o el gastoId indicados no existan, se generará
                //^un error
                else {
                    throw new Error(`El usuario ${usuario} no existe`);
                } 
            }
        )
        .then((datosJSactualizados) => {
                //^Por último, escribirán los datos actualizados al archivo mediante la función
                //^fs.writeFile(NOMBRE_ARCHIVO, DATOS_EN_FORMATO_TEXTO) y devolvera la promesa
                //^generada `por fs.writeFile
                let datosJSONactualizados = JSON.stringify(datosJSactualizados);
                return fs.writeFile(ficheroDatos, datosJSONactualizados, 'utf-8');
            }
        )
        .catch((error) => {
                return Promise.reject(`Se ha producido el error: ${error}`);
            }
        );
}

// Debe devolver una promesa. Cuando se resuelva se debe haber eliminado el gasto del usuario
// y actualizado el fichero de datos
function borrarGastoUsuario(usuario, gastoId) {
//^leer el contenido del archivo datos.json mediante la función fs.readFile(NOMBRE_ARCHIVO).
return fs.readFile(ficheroDatos, 'utf-8')
    .then((datosJSON) => {
            //^Una vez resuelta la promesa, se convertirán los datos de JSON a un objeto de JS
            let datosJS = JSON.parse(datosJSON);
            //^se eliminará el gasto cuyo Id sea el gastoId pasado como parámetro de la lista
            //^de gastos del usuario pasado también como parámetro.
            if(datosJS[usuario]){
                let indice = datosJS[usuario].findIndex(
                    gasto => gasto.id == gastoId);
                if (indice != -1) {
                    datosJS[usuario].splice(indice, 1);
                    console.log(`El gasto con id ${gastoId} del usuario ${usuario}
                     ha sido eliminado con éxito`);
                    return datosJS;
                }
                //^En el caso de que el usuario o el gastoId indicados no existan, se generará
                //^un error
                else {
                    throw new Error(`El gasto con id ${gastoId} del usuario ${usuario}
                     no existe.`);
                }
            }
            //^En el caso de que el usuario o el gastoId indicados no existan, se generará
            //^un error
            else {
                throw new Error(`El usuario ${usuario} no existe.`);
            }
            
        }
    )
    .then((datosJSactualizados) => {
            //^Por último, escribirán los datos actualizados al archivo mediante la función
            //^fs.writeFile(NOMBRE_ARCHIVO, DATOS_EN_FORMATO_TEXTO) y devolvera la promesa
            //^generada `por fs.writeFile
            let datosJSONactualizados = JSON.stringify(datosJSactualizados);
            return fs.writeFile(ficheroDatos, datosJSONactualizados, 'utf-8');
        }
   ).catch((error) => {
            return Promise.reject(`Se ha producido el error: ${error}`);
        }
   )
}

// Exportación de funciones
// Normalmente en NodeJS se utiliza el sistema CommonJS,
// pero se ha configurado el proyecto para que utilice módulos indicando
// 'type = module' en el archivo 'package.json'
export {
    obtenerGastosUsuario,
    anyadirGastoUsuario,
    actualizarGastoUsuario,
    borrarGastoUsuario,
    // Para poder utilizar uno distinto en los tests y no interferir con los datos reales
    cambiarFicheroDatos
}
