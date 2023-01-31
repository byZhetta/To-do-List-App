import colors from 'colors';
import { guardarDB, leerDB } from './helpers/guardarArchivo.js';
import { 
        inquirerMenu, 
        pausa, 
        leerInput, 
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
    } from './helpers/inquirer.js';
// import { Tarea } from './models/tarea.js';
import { Tareas } from './models/tareas.js';

const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB) { // cargar tareas
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
            break;

            case '2':
                tareas.listadoCompleto();
            break;

            case '3':
                tareas.listarPendientesCompletadas(true);
            break;

            case '4':
                tareas.listarPendientesCompletadas(false);
            break;

            case '5':
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;

            case '6':
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ) {
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada correctamente');
                    }
                }
            break;
        }

        guardarDB( tareas.listadoArr );    

        await pausa();
    } while( opt !== '0' );

}

main();