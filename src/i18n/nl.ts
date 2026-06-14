import type { Messages } from '../types';

const nl: Messages = {
    dropzone: {
        title: 'Upload een bestand om te importeren',
        subtitle: 'Sleep een CSV, XLS of XLSX bestand hiernaartoe',
        button: 'Kies een bestand',
        changeFile: 'Kies een ander bestand',
    },
    columns: {
        toggleHasHeaders: 'Dit bestand bevat geen headers',
        toggleNoHeaders: 'Dit bestand bevat headers',
        unassigned: 'Kies een kolom',
        ignored: 'Genegeerd',
        changeColumn: 'Wijzig deze kolom',
        ignoreColumn: 'Negeer deze kolom',
        columnLabel: 'Gegevens van kolom',
        selectPlaceholder: 'Selecteer een veld...',
        ignoreOption: 'Negeren',
        columnFallback: 'Kolom {n}',
    },
    confirm: 'Bevestigen',
    loading: 'Laden…',
    errors: {
        title: 'Fout',
        noFile: 'Selecteer eerst een bestand.',
        invalidFileType: 'Ongeldig bestand. Gebruik een CSV, XLS of XLSX bestand.',
        fileReadError: 'Het bestand kon niet worden gelezen. Het is mogelijk beschadigd of geopend in een ander programma.',
        noWorksheet: 'Het bestand moet minstens één werkblad bevatten.',
        emptyWorksheet: 'Het werkblad is leeg.',
        unassignedColumns: 'Wijs alle kolommen toe of negeer ze:',
        missingRequiredFields: 'De volgende vereiste velden zijn niet toegewezen:',
        fileTooLarge: 'Het bestand is te groot. Maximale grootte: {size}.',
        tooManyRows: 'Het bestand heeft te veel rijen. Maximum toegestaan: {max}.',
        dismiss: 'Foutmelding sluiten',
    },
};

export default nl;
