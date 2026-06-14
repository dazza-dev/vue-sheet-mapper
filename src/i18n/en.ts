import type { Messages } from '../types';

const en: Messages = {
    dropzone: {
        title: 'Upload a file to import',
        subtitle: 'Drag and drop a CSV, XLS or XLSX file here',
        button: 'Choose a file',
        changeFile: 'Choose another file',
    },
    columns: {
        toggleHasHeaders: 'This file does not include headers',
        toggleNoHeaders: 'This file includes headers',
        unassigned: 'Choose a column',
        ignored: 'Ignored',
        changeColumn: 'Change this column',
        ignoreColumn: 'Ignore this column',
        columnLabel: 'Data in column',
        selectPlaceholder: 'Select a field...',
        ignoreOption: 'Ignore',
        columnFallback: 'Column {n}',
    },
    confirm: 'Confirm',
    loading: 'Loading…',
    errors: {
        title: 'Error',
        noFile: 'Please select a file first.',
        invalidFileType: 'Invalid file. Please use a CSV, XLS or XLSX file.',
        fileReadError: 'The file could not be read. It may be corrupted or in use by another program.',
        noWorksheet: 'The file must contain at least one worksheet.',
        emptyWorksheet: 'The worksheet is empty.',
        unassignedColumns: 'Please assign or ignore all columns:',
        missingRequiredFields: 'The following required fields are not mapped:',
        fileTooLarge: 'File is too large. Maximum size: {size}.',
        tooManyRows: 'File has too many rows. Maximum allowed: {max}.',
        dismiss: 'Dismiss error',
    },
};

export default en;
