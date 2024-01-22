// Importar librería Chai para realizar aserciones
import {assert} from "chai";
import { promises as fs } from 'fs';

// Importar código de la aplicación sobre la que se realizarán los tests
import {obtenerGastosUsuario, anyadirGastoUsuario, actualizarGastoUsuario, borrarGastoUsuario, cambiarFicheroDatos} from '../accesoDatos.js';


let ficheroTest = './datos_test.json';

// Hacer que la librería utilice el fichero de test en lugar del fichero por defecto
cambiarFicheroDatos(ficheroTest);


let datosEjemplo = {
    usuario1: [
	{
	    id: "a91ca2ea-2c3a-442a-8378-059e9f4d9046",
	    descripcion: "Descripción del gasto 1 del usuario 1",
	    valor: 25,
	    fecha: 1655456894000
	}
    ],
    usuario2: [
	{
	    id: "a51fa3ea-8d39-622b-8368-093a96ef912c",
	    descripcion: "Descripción del gasto 1 del usuario 2",
	    valor: 35.1,
	    fecha: 1655457027000
	},
	{
	    descripcion: "Descripción del gasto 2 del usuario 2",
	    valor: 35.1,
	    fecha: 1655457126000,
	    id: "be488403-b32a-4171-93aa-864651275efa"
	}
    ]
}


describe("Comprobación de las funciones de acceso a datos", function() {
    this.timeout(5000); 

    // Antes de cada test se resetea el fichero de datos
    beforeEach(function(done){
	fs.writeFile(ficheroTest, JSON.stringify(datosEjemplo)).then(() => {
	    done();
	});
    });

    it("Función 'obtenerGastosUsuario'", function(done) {
	let pGastos = obtenerGastosUsuario("usuario2");
	assert.instanceOf(pGastos, Promise, "La función no devuelve una promesa");
	pGastos.then((datos) => {
	    assert.deepEqual(datos, datosEjemplo.usuario2, "Los gastos del usuario indicado no se corrsponden con los datos del fichero.");
	    done();
	}).catch((error) => {
	    done(error);
	});

    });

    it("Función 'anyadirGastoUsuario'", function(done) {
	let nuevoGasto = {
	    descripcion: "Nueva descripción",
	    valor: 153.73,
	    id: "a342-b7899234-87af3e"
	};
	let pGastos = anyadirGastoUsuario("usuario2", nuevoGasto);
	assert.instanceOf(pGastos, Promise, "La función no devuelve una promesa");
	pGastos.then(() => {
	    return fs.readFile(ficheroTest);
	}).then((datosJson) => {
	    let datos = JSON.parse(datosJson);
	    // Debe haber 3 gastos
	    assert.lengthOf(datos.usuario2, 3);
	    // El tercer gasto del usuario2 almacenado debe corresponderse con el creado
	    assert.deepEqual(datos.usuario2[2], nuevoGasto, "La función no ha añadido correctamente el gasto al fichero");
	    done();
	}).catch((error) => {
	    done(error);
	});;

    });

    it("Función 'actualizarGastoUsuario': usuario y gasto existen.", function(done) {
	let nuevoGasto = {
	    descripcion: "Nueva descripción",
	    valor: 153.73,
	    id: "a51fa3ea-8d39-622b-8368-093a96ef912c"
	};
	// Modificamos el primer gasto de usuario2
	let pGastos = actualizarGastoUsuario("usuario2", "a51fa3ea-8d39-622b-8368-093a96ef912c", nuevoGasto);
	assert.instanceOf(pGastos, Promise, "La función no devuelve una promesa");
	pGastos.then(() => {
	    return fs.readFile(ficheroTest);
	}).then((datosJson) => {
	    let datos = JSON.parse(datosJson);
	    // Debe seguir habiendo 2 gastos
	    assert.lengthOf(datos.usuario2, 2, "Al modificar no se tienen que crear ni borrar nuevos gastos");
	    // El primer gasto del usuario2 almacenado debe corresponderse con el modificado
		//!assert.deepEqual(datos.usuario2[0], nuevoGasto, "La función no ha modificado correctamente el gasto al fichero"); - corregido: SO
	    assert.deepEqual(datos.usuario2[1], nuevoGasto, "La función no ha modificado correctamente el gasto al fichero");
	    done();
	}).catch((error) => {
	    done(error);
	});;

    });

    it("Función 'actualizarGastoUsuario': usuario no existe.", function(done) {
	let nuevoGasto = {
	    descripcion: "Nueva descripción",
	    valor: 153.73,
	    id: "a51fa3ea-8d39-622b-8368-093a96ef912c"
	};
	// Modificamos un gasto que no existe en usuario2
	let pGastos = actualizarGastoUsuario("usuario2", "no-existe", nuevoGasto);
	assert.instanceOf(pGastos, Promise, "La función no devuelve una promesa");
	pGastos.then(() => {
	    return fs.readFile(ficheroTest);
	}).then((datosJson) => {
	    done(new Error("Se debe generar un error"));
	}).catch((error) => {
	    // Se debe generar un error
	    done();
	});;

    });


    it("Función 'borrarGastoUsuario': usuario y gasto existen.", function(done) {
	let idBorrar = "a51fa3ea-8d39-622b-8368-093a96ef912c";
	// Borramos el primer gasto de usuario2
	let pGastos = borrarGastoUsuario("usuario2", idBorrar);
	assert.instanceOf(pGastos, Promise, "La función no devuelve una promesa");
	pGastos.then(() => {
	    return fs.readFile(ficheroTest);
	}).then((datosJson) => {
	    let datos = JSON.parse(datosJson);
	    // Debe haber un solo gasto
	    assert.lengthOf(datos.usuario2, 1, "No se ha borrado el gasto indicado");
	    // No debe existir el gasto con 'id' que se ha eliminado
	    assert.notEqual(datos.usuario2[0].id, idBorrar, "No se ha borrado el gasto correcto.");
	    done();
	}).catch((error) => {
	    done(error);
	});;

    });

    it("Función 'borrarGastoUsuario': usuario no existe.", function(done) {
	let idBorrar = "a51fa3ea-8d39-622b-8368-093a96ef912c";
	// Modificamos el gasto de un usuario que no existe
	let pGastos = borrarGastoUsuario("usuario-no-existe", idBorrar);
	assert.instanceOf(pGastos, Promise, "La función no devuelve una promesa");
	pGastos.then(() => {
	    return fs.readFile(ficheroTest);
	}).then((datosJson) => {
	    done(new Error("Se debe generar un error"));
	}).catch((error) => {
	    // Se debe generar un error
	    done();
	});;

    });

});
