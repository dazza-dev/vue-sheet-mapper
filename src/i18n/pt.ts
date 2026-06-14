import type { Messages } from '../types';

const pt: Messages = {
    dropzone: {
        title: 'Envie um arquivo para importar',
        subtitle: 'Arraste e solte um arquivo CSV, XLS ou XLSX aqui',
        button: 'Escolher arquivo',
        changeFile: 'Escolher outro arquivo',
    },
    columns: {
        toggleHasHeaders: 'Este arquivo não inclui cabeçalhos',
        toggleNoHeaders: 'Este arquivo inclui cabeçalhos',
        unassigned: 'Escolha uma coluna',
        ignored: 'Ignorado',
        changeColumn: 'Mudar esta coluna',
        ignoreColumn: 'Ignorar esta coluna',
        columnLabel: 'Dados da coluna',
        selectPlaceholder: 'Selecione um campo...',
        ignoreOption: 'Ignorar',
        columnFallback: 'Coluna {n}',
    },
    confirm: 'Confirmar',
    loading: 'Carregando…',
    errors: {
        title: 'Erro',
        noFile: 'Por favor selecione um arquivo.',
        invalidFileType: 'Arquivo inválido. Use um arquivo CSV, XLS ou XLSX.',
        fileReadError: 'Não foi possível ler o arquivo. Ele pode estar corrompido ou aberto em outro programa.',
        noWorksheet: 'O arquivo deve ter pelo menos uma planilha.',
        emptyWorksheet: 'A planilha está vazia.',
        unassignedColumns: 'Por favor atribua ou ignore todas as colunas:',
        missingRequiredFields: 'Os seguintes campos obrigatórios não estão mapeados:',
        fileTooLarge: 'O arquivo é muito grande. Tamanho máximo: {size}.',
        tooManyRows: 'O arquivo tem linhas demais. Máximo permitido: {max}.',
        dismiss: 'Fechar erro',
    },
};

export default pt;
