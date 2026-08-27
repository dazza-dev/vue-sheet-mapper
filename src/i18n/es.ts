import type { Messages } from '../types';

const es: Messages = {
    dropzone: {
        title: 'Sube un archivo para importar',
        subtitle: 'Arrastra y suelta un archivo CSV, XLS o XLSX aquí',
        button: 'Escoge un archivo',
        changeFile: 'Escoge otro archivo',
    },
    columns: {
        toggleHasHeaders: 'Este archivo no incluye encabezados',
        toggleNoHeaders: 'Este archivo incluye encabezados',
        unassigned: 'Escoge una columna',
        ignored: 'Ignorar',
        changeColumn: 'Cambiar esta columna',
        ignoreColumn: 'No usar esta columna',
        columnLabel: 'Datos de la columna',
        selectPlaceholder: 'Selecciona un campo...',
        ignoreOption: 'Ignorar',
        columnFallback: 'Columna {n}',
    },
    confirm: 'Validar Datos',
    issues: {
        title: '{n} filas necesitan atención antes de importar',
        row: 'Fila {n}',
        more: 'Mostrando {n} de {total} problemas',
        checking: 'Revisando filas…',
        retry: 'Revisar de nuevo',
    },
    loading: 'Cargando…',
    errors: {
        title: 'Error',
        noFile: 'Por favor selecciona un archivo primero.',
        invalidFileType: 'Archivo inválido. Usa un archivo CSV, XLS o XLSX.',
        fileReadError: 'No se pudo leer el archivo. Puede estar dañado o abierto en otro programa.',
        noWorksheet: 'El archivo debe tener por lo menos una hoja.',
        emptyWorksheet: 'La hoja está vacía.',
        unassignedColumns: 'Por favor asigna o ignora todas las columnas:',
        missingRequiredFields: 'Los siguientes campos requeridos no están asignados:',
        duplicateAssignments: 'El mismo campo está asignado a más de una columna:',
        fileTooLarge: 'El archivo es demasiado grande. Tamaño máximo: {size}.',
        tooManyRows: 'El archivo tiene demasiadas filas. Máximo permitido: {max}.',
        dismiss: 'Cerrar error',
    },
};

export default es;
