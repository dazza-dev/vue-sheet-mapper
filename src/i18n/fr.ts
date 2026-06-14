import type { Messages } from '../types';

const fr: Messages = {
    dropzone: {
        title: 'Téléverser un fichier',
        subtitle: 'Glissez-déposez un fichier CSV, XLS ou XLSX ici',
        button: 'Choisir un fichier',
        changeFile: 'Choisir un autre fichier',
    },
    columns: {
        toggleHasHeaders: "Ce fichier ne contient pas d'en-têtes",
        toggleNoHeaders: "Ce fichier contient des en-têtes",
        unassigned: 'Choisir une colonne',
        ignored: 'Ignoré',
        changeColumn: 'Modifier cette colonne',
        ignoreColumn: 'Ignorer cette colonne',
        columnLabel: 'Données de la colonne',
        selectPlaceholder: 'Sélectionner un champ...',
        ignoreOption: 'Ignorer',
        columnFallback: 'Colonne {n}',
    },
    confirm: 'Confirmer',
    loading: 'Chargement…',
    errors: {
        title: 'Erreur',
        noFile: 'Veuillez sélectionner un fichier.',
        invalidFileType: 'Fichier invalide. Utilisez un fichier CSV, XLS ou XLSX.',
        fileReadError: 'Impossible de lire le fichier. Il est peut-être corrompu ou ouvert dans un autre programme.',
        noWorksheet: 'Le fichier doit contenir au moins une feuille.',
        emptyWorksheet: 'La feuille est vide.',
        unassignedColumns: 'Veuillez assigner ou ignorer toutes les colonnes:',
        missingRequiredFields: 'Les champs obligatoires suivants ne sont pas assignés:',
        fileTooLarge: 'Le fichier est trop volumineux. Taille maximale : {size}.',
        tooManyRows: 'Le fichier contient trop de lignes. Maximum autorisé : {max}.',
        dismiss: "Fermer l'erreur",
    },
};

export default fr;
