import type { Locale } from '../src/types';

/** Strings for the demo shell. The component ships its own translations. */
export interface DemoMessages {
    nav: { theme: string; light: string; dark: string; system: string; language: string; sample: string; sampleHint: string; snippets: string; snippetsHint: string; docs: string };
    side: { title: string; reset: string; schema: string; appearance: string; behavior: string; output: string; file: string };
    schema: { source: string; immediate: string; fromApi: string; immediateHint: string; apiHint: string; loading: string; loaded: string; simulate: string };
    appearance: { icons: string; messages: string; default: string; custom: string; iconsHint: string; messagesHint: string };
    behavior: {
        matcher: string; builtin: string; positional: string; buggy: string;
        builtinHint: string; positionalHint: string; buggyHint: string;
        autoIgnore: string; autoIgnoreHint: string; autoConfirm: string; autoConfirmHint: string;
        firstRow: string; header: string; data: string; firstRowHint: string;
        previewRows: string; off: string; on: string;
    };
    out: {
        mode: string; rowsHint: string; mappingHint: string;
        transform: string; transformHint: string; transformNA: string;
        validation: string; validationHint: string;
    };
    file: { encoding: string; autoDetect: string; encodingHint: string; maxSize: string; maxRows: string; noLimit: string };
    tabs: { preview: string; code: string; output: string; restart: string };
    code: { template: string; schema: string; handler: string };
    result: {
        empty: string; emptyBody: string; goPreview: string;
        mappingNote: string; isHeader: string; isData: string; columnsMapped: string; mappingCard: string;
        transformNote: string; firstRows: string; rowsNote: string; dataPreview: string;
    };
}

const en: DemoMessages = {
    nav: { theme: 'Color theme', light: 'Light', dark: 'Dark', system: 'System', language: 'Language', sample: 'Download sample', sampleHint: 'Download a 20-row .xlsx to try the mapper', snippets: 'Snippets', snippetsHint: "Show each option's code under the control that turns it on", docs: 'Docs' },
    side: { title: 'Settings', reset: 'Reset all', schema: 'Schema', appearance: 'Appearance', behavior: 'Behavior', output: 'Output', file: 'File' },
    schema: { source: 'Field source', immediate: 'Immediate', fromApi: 'From an API', immediateHint: 'The schema is available from the first render.', apiHint: 'Fields arrive {ms} ms later, the way a schema fetched from your backend does. Pick the file before they land — auto-matching applies itself the moment they do.', loading: 'Loading schema…', loaded: '{n} fields loaded', simulate: 'Simulate the fetch again' },
    appearance: { icons: 'Icons', messages: 'Messages', default: 'Default', custom: 'Custom', iconsHint: 'Partial override: only the keys you pass are replaced, everything else keeps the default icon.', messagesHint: 'Partial override per locale, merged with the base strings of the active language.' },
    behavior: {
        matcher: 'Auto-match', builtin: 'Built-in', positional: 'Positional', buggy: 'Buggy',
        builtinHint: 'Matches the column name against key, label and aliases, accent-insensitive.',
        positionalHint: 'Column 1 → field 1, column 2 → field 2, ignoring the header names.',
        buggyHint: 'A deliberately broken matcher that maps every column to the same field. Confirm to see validate() catch it — without that guard, toRows() would collapse the columns and drop their data silently.',
        autoIgnore: 'Auto-ignore', autoIgnoreHint: 'Unmatched columns are pre-set to “ignore”, so the user only reviews the ones that were recognized.',
        autoConfirm: 'Auto-confirm', autoConfirmHint: 'If everything is valid after auto-matching, the UI is skipped and @mapped fires right away.',
        firstRow: 'First row', header: 'Header', data: 'Data', firstRowHint: 'How row 1 is read on load. The user can flip it from the preview.',
        previewRows: 'Preview rows', off: 'Off', on: 'On',
    },
    out: {
        mode: 'Output mode',
        rowsHint: '@mapped hands you MappedResult[]: the file is read in the browser and the values travel as JSON.',
        mappingHint: '@mapped hands you { file, mapping, hasHeaders }: the raw file and the column dictionary, so your backend does the reading. Nothing is materialized into row objects.',
        transform: 'Transform',
        transformHint: 'Turns columns into row objects: trims whitespace, joins first and last name, normalizes the phone number.',
        transformNA: 'Not available with output="mapping": they are mutually exclusive, since nothing is converted into rows.',
        validation: 'Row validation',
        validationHint: 'Runs a plain function over the mapped rows and lists what it flags. The sample file has a duplicate ID, a blank name and a broken email — turn this on and confirm.',
    },
    file: { encoding: 'Encoding', autoDetect: 'Detect automatically', encodingHint: 'Text files only. Detection already handles UTF-8 with or without a BOM, UTF-16 and Windows-1252 with no configuration. Set it only for an older encoding that detection cannot reach.', maxSize: 'Max file size', maxRows: 'Max rows', noLimit: 'No limit' },
    tabs: { preview: 'Preview', code: 'Code', output: 'Output', restart: 'Restart' },
    code: { template: 'Template', schema: 'Schema', handler: '@mapped handler' },
    result: {
        empty: 'No output yet', emptyBody: 'Upload a file in the preview, map the columns and confirm. Whatever @mapped emits shows up here.', goPreview: 'Go to the preview',
        mappingNote: 'the file was not transformed. This is what you would send to your backend.',
        isHeader: 'row 1 is a header', isData: 'row 1 is data', columnsMapped: 'columns mapped',
        mappingCard: 'mapping — spreadsheet column index → field',
        transformNote: '{n} rows ready to POST to your API.', firstRows: 'First 3 rows',
        rowsNote: '{n} columns mapped.', dataPreview: 'Data preview',
    },
};

const es: DemoMessages = {
    nav: { theme: 'Tema de color', light: 'Claro', dark: 'Oscuro', system: 'Sistema', language: 'Idioma', sample: 'Descargar ejemplo', sampleHint: 'Descarga un .xlsx de 20 filas para probar el mapeador', snippets: 'Fragmentos', snippetsHint: 'Muestra el código de cada opción debajo del control que la activa', docs: 'Docs' },
    side: { title: 'Ajustes', reset: 'Restablecer', schema: 'Esquema', appearance: 'Apariencia', behavior: 'Comportamiento', output: 'Salida', file: 'Archivo' },
    schema: { source: 'Origen de los campos', immediate: 'Inmediato', fromApi: 'Desde una API', immediateHint: 'El esquema está disponible desde el primer render.', apiHint: 'Los campos llegan {ms} ms después, como cuando el esquema viene de tu backend. Sube el archivo antes de que lleguen: el auto-match se aplica solo al aterrizar.', loading: 'Cargando esquema…', loaded: '{n} campos cargados', simulate: 'Volver a simular la carga' },
    appearance: { icons: 'Iconos', messages: 'Textos', default: 'Por defecto', custom: 'Personalizados', iconsHint: 'Override parcial: solo se reemplazan las claves que envías, el resto usa el icono por defecto.', messagesHint: 'Override parcial por idioma, fusionado con las cadenas base del idioma activo.' },
    behavior: {
        matcher: 'Auto-match', builtin: 'Integrado', positional: 'Posicional', buggy: 'Con bug',
        builtinHint: 'Compara el nombre de la columna contra key, label y aliases, sin acentos.',
        positionalHint: 'Columna 1 → campo 1, columna 2 → campo 2, sin mirar los encabezados.',
        buggyHint: 'Un matcher roto a propósito que asigna todas las columnas al mismo campo. Confirma para ver cómo validate() lo detecta — sin ese guard, toRows() colapsaría las columnas y perdería sus datos en silencio.',
        autoIgnore: 'Auto-ignorar', autoIgnoreHint: 'Las columnas sin coincidencia quedan en «ignorar», así el usuario solo revisa las reconocidas.',
        autoConfirm: 'Auto-confirmar', autoConfirmHint: 'Si tras el auto-match todo es válido, se salta la UI y emite @mapped de inmediato.',
        firstRow: 'Primera fila', header: 'Encabezado', data: 'Datos', firstRowHint: 'Cómo se interpreta la fila 1 al cargar. El usuario puede cambiarlo desde la vista previa.',
        previewRows: 'Filas de vista previa', off: 'Off', on: 'On',
    },
    out: {
        mode: 'Modo de salida',
        rowsHint: '@mapped entrega MappedResult[]: el archivo se lee en el navegador y los valores viajan como JSON.',
        mappingHint: '@mapped entrega { file, mapping, hasHeaders }: el archivo crudo y el diccionario de columnas, para que sea tu backend el que lea el archivo. Nada se materializa en objetos de fila.',
        transform: 'Transform',
        transformHint: 'Convierte las columnas en objetos de fila: limpia espacios, une nombre y apellido y normaliza el teléfono.',
        transformNA: 'No aplica con output="mapping": son mutuamente excluyentes, porque nada se convierte en filas.',
        validation: 'Validación de filas',
        validationHint: 'Ejecuta una función sobre las filas mapeadas y lista lo que marca. El archivo de ejemplo trae un ID duplicado, un nombre vacío y un email roto: actívalo y confirma.',
    },
    file: { encoding: 'Codificación', autoDetect: 'Detectar automáticamente', encodingHint: 'Solo aplica a archivos de texto. La detección ya resuelve UTF-8 con o sin BOM, UTF-16 y Windows-1252 sin configurar nada. Fíjala solo para una codificación heredada que la detección no alcanza.', maxSize: 'Tamaño máximo', maxRows: 'Filas máximas', noLimit: 'Sin límite' },
    tabs: { preview: 'Vista previa', code: 'Código', output: 'Salida', restart: 'Reiniciar' },
    code: { template: 'Plantilla', schema: 'Esquema', handler: 'Manejador de @mapped' },
    result: {
        empty: 'Todavía no hay salida', emptyBody: 'Sube un archivo en la vista previa, asigna las columnas y confirma. Lo que emita @mapped aparece aquí.', goPreview: 'Ir a la vista previa',
        mappingNote: 'el archivo no se transformó. Esto es lo que enviarías a tu backend.',
        isHeader: 'la fila 1 es encabezado', isData: 'la fila 1 son datos', columnsMapped: 'columnas asignadas',
        mappingCard: 'mapping — índice de columna en la hoja → campo',
        transformNote: '{n} filas listas para enviar a tu API.', firstRows: 'Primeras 3 filas',
        rowsNote: '{n} columnas asignadas.', dataPreview: 'Vista previa de los datos',
    },
};

const fr: DemoMessages = {
    nav: { theme: 'Thème de couleur', light: 'Clair', dark: 'Sombre', system: 'Système', language: 'Langue', sample: 'Télécharger l’exemple', sampleHint: 'Téléchargez un .xlsx de 20 lignes pour essayer', snippets: 'Extraits', snippetsHint: 'Affiche le code de chaque option sous le contrôle qui l’active', docs: 'Docs' },
    side: { title: 'Réglages', reset: 'Réinitialiser', schema: 'Schéma', appearance: 'Apparence', behavior: 'Comportement', output: 'Sortie', file: 'Fichier' },
    schema: { source: 'Source des champs', immediate: 'Immédiate', fromApi: 'Depuis une API', immediateHint: 'Le schéma est disponible dès le premier rendu.', apiHint: 'Les champs arrivent {ms} ms plus tard, comme un schéma récupéré depuis votre backend. Choisissez le fichier avant : l’association automatique s’applique dès leur arrivée.', loading: 'Chargement du schéma…', loaded: '{n} champs chargés', simulate: 'Simuler à nouveau' },
    appearance: { icons: 'Icônes', messages: 'Textes', default: 'Par défaut', custom: 'Personnalisés', iconsHint: 'Remplacement partiel : seules les clés fournies sont remplacées, le reste garde l’icône par défaut.', messagesHint: 'Remplacement partiel par langue, fusionné avec les chaînes de base de la langue active.' },
    behavior: {
        matcher: 'Association auto', builtin: 'Intégrée', positional: 'Positionnelle', buggy: 'Défectueuse',
        builtinHint: 'Compare le nom de la colonne à key, label et aliases, sans tenir compte des accents.',
        positionalHint: 'Colonne 1 → champ 1, colonne 2 → champ 2, sans regarder les en-têtes.',
        buggyHint: 'Une fonction volontairement cassée qui associe toutes les colonnes au même champ. Confirmez pour voir validate() l’intercepter — sans ce garde-fou, toRows() fusionnerait les colonnes et perdrait leurs données en silence.',
        autoIgnore: 'Ignorer auto.', autoIgnoreHint: 'Les colonnes sans correspondance passent en « ignorer », l’utilisateur ne traite que celles reconnues.',
        autoConfirm: 'Confirmer auto.', autoConfirmHint: 'Si tout est valide après l’association, l’interface est passée et @mapped se déclenche aussitôt.',
        firstRow: 'Première ligne', header: 'En-tête', data: 'Données', firstRowHint: 'Comment la ligne 1 est lue au chargement. L’utilisateur peut le changer depuis l’aperçu.',
        previewRows: 'Lignes d’aperçu', off: 'Off', on: 'On',
    },
    out: {
        mode: 'Mode de sortie',
        rowsHint: '@mapped fournit MappedResult[] : le fichier est lu dans le navigateur et les valeurs circulent en JSON.',
        mappingHint: '@mapped fournit { file, mapping, hasHeaders } : le fichier brut et le dictionnaire de colonnes, pour que votre backend fasse la lecture. Rien n’est matérialisé en objets de ligne.',
        transform: 'Transform',
        transformHint: 'Transforme les colonnes en objets de ligne : nettoie les espaces, réunit prénom et nom, normalise le téléphone.',
        transformNA: 'Indisponible avec output="mapping" : les deux s’excluent, puisque rien n’est converti en lignes.',
        validation: 'Validation des lignes',
        validationHint: 'Exécute une fonction sur les lignes mappées et liste ce qu’elle signale. Le fichier d’exemple contient un ID en double, un nom vide et un email cassé.',
    },
    file: { encoding: 'Encodage', autoDetect: 'Détecter automatiquement', encodingHint: 'Fichiers texte uniquement. La détection gère déjà UTF-8 avec ou sans BOM, UTF-16 et Windows-1252 sans configuration. Ne le fixez que pour un encodage ancien hors de portée de la détection.', maxSize: 'Taille maximale', maxRows: 'Lignes maximales', noLimit: 'Sans limite' },
    tabs: { preview: 'Aperçu', code: 'Code', output: 'Sortie', restart: 'Redémarrer' },
    code: { template: 'Template', schema: 'Schéma', handler: 'Gestionnaire de @mapped' },
    result: {
        empty: 'Pas encore de sortie', emptyBody: 'Chargez un fichier dans l’aperçu, associez les colonnes et confirmez. Ce que @mapped émet apparaît ici.', goPreview: 'Aller à l’aperçu',
        mappingNote: 'le fichier n’a pas été transformé. Voici ce que vous enverriez à votre backend.',
        isHeader: 'la ligne 1 est un en-tête', isData: 'la ligne 1 contient des données', columnsMapped: 'colonnes associées',
        mappingCard: 'mapping — index de colonne dans la feuille → champ',
        transformNote: '{n} lignes prêtes à être envoyées à votre API.', firstRows: '3 premières lignes',
        rowsNote: '{n} colonnes associées.', dataPreview: 'Aperçu des données',
    },
};

const pt: DemoMessages = {
    nav: { theme: 'Tema de cor', light: 'Claro', dark: 'Escuro', system: 'Sistema', language: 'Idioma', sample: 'Baixar exemplo', sampleHint: 'Baixe um .xlsx de 20 linhas para testar', snippets: 'Trechos', snippetsHint: 'Mostra o código de cada opção abaixo do controle que a ativa', docs: 'Docs' },
    side: { title: 'Configurações', reset: 'Redefinir', schema: 'Esquema', appearance: 'Aparência', behavior: 'Comportamento', output: 'Saída', file: 'Arquivo' },
    schema: { source: 'Origem dos campos', immediate: 'Imediata', fromApi: 'De uma API', immediateHint: 'O esquema está disponível desde a primeira renderização.', apiHint: 'Os campos chegam {ms} ms depois, como um esquema vindo do seu backend. Escolha o arquivo antes: o auto-match se aplica assim que eles chegam.', loading: 'Carregando esquema…', loaded: '{n} campos carregados', simulate: 'Simular o carregamento de novo' },
    appearance: { icons: 'Ícones', messages: 'Textos', default: 'Padrão', custom: 'Personalizados', iconsHint: 'Substituição parcial: só as chaves enviadas são trocadas, o resto mantém o ícone padrão.', messagesHint: 'Substituição parcial por idioma, mesclada com as cadeias base do idioma ativo.' },
    behavior: {
        matcher: 'Auto-match', builtin: 'Integrado', positional: 'Posicional', buggy: 'Com bug',
        builtinHint: 'Compara o nome da coluna com key, label e aliases, ignorando acentos.',
        positionalHint: 'Coluna 1 → campo 1, coluna 2 → campo 2, sem olhar os cabeçalhos.',
        buggyHint: 'Um matcher quebrado de propósito que mapeia todas as colunas para o mesmo campo. Confirme para ver o validate() detectá-lo — sem essa proteção, toRows() juntaria as colunas e perderia os dados em silêncio.',
        autoIgnore: 'Auto-ignorar', autoIgnoreHint: 'Colunas sem correspondência ficam em “ignorar”, então o usuário só revisa as reconhecidas.',
        autoConfirm: 'Auto-confirmar', autoConfirmHint: 'Se tudo estiver válido após o auto-match, a interface é pulada e @mapped dispara na hora.',
        firstRow: 'Primeira linha', header: 'Cabeçalho', data: 'Dados', firstRowHint: 'Como a linha 1 é lida ao carregar. O usuário pode alterar pela pré-visualização.',
        previewRows: 'Linhas de pré-visualização', off: 'Off', on: 'On',
    },
    out: {
        mode: 'Modo de saída',
        rowsHint: '@mapped entrega MappedResult[]: o arquivo é lido no navegador e os valores viajam como JSON.',
        mappingHint: '@mapped entrega { file, mapping, hasHeaders }: o arquivo bruto e o dicionário de colunas, para o seu backend fazer a leitura. Nada é materializado em objetos de linha.',
        transform: 'Transform',
        transformHint: 'Converte as colunas em objetos de linha: limpa espaços, junta nome e sobrenome e normaliza o telefone.',
        transformNA: 'Indisponível com output="mapping": são mutuamente exclusivos, pois nada é convertido em linhas.',
        validation: 'Validação de linhas',
        validationHint: 'Executa uma função sobre as linhas mapeadas e lista o que ela marca. O arquivo de exemplo tem um ID duplicado, um nome vazio e um email quebrado.',
    },
    file: { encoding: 'Codificação', autoDetect: 'Detectar automaticamente', encodingHint: 'Apenas arquivos de texto. A detecção já resolve UTF-8 com ou sem BOM, UTF-16 e Windows-1252 sem configuração. Defina apenas para uma codificação antiga fora do alcance da detecção.', maxSize: 'Tamanho máximo', maxRows: 'Linhas máximas', noLimit: 'Sem limite' },
    tabs: { preview: 'Pré-visualização', code: 'Código', output: 'Saída', restart: 'Reiniciar' },
    code: { template: 'Template', schema: 'Esquema', handler: 'Tratador de @mapped' },
    result: {
        empty: 'Ainda não há saída', emptyBody: 'Envie um arquivo na pré-visualização, mapeie as colunas e confirme. O que @mapped emitir aparece aqui.', goPreview: 'Ir para a pré-visualização',
        mappingNote: 'o arquivo não foi transformado. É isto que você enviaria ao seu backend.',
        isHeader: 'a linha 1 é cabeçalho', isData: 'a linha 1 são dados', columnsMapped: 'colunas mapeadas',
        mappingCard: 'mapping — índice da coluna na planilha → campo',
        transformNote: '{n} linhas prontas para enviar à sua API.', firstRows: 'Primeiras 3 linhas',
        rowsNote: '{n} colunas mapeadas.', dataPreview: 'Pré-visualização dos dados',
    },
};

const nl: DemoMessages = {
    nav: { theme: 'Kleurthema', light: 'Licht', dark: 'Donker', system: 'Systeem', language: 'Taal', sample: 'Voorbeeld downloaden', sampleHint: 'Download een .xlsx met 20 rijen om te proberen', snippets: 'Fragmenten', snippetsHint: 'Toont de code van elke optie onder de knop die deze inschakelt', docs: 'Docs' },
    side: { title: 'Instellingen', reset: 'Alles herstellen', schema: 'Schema', appearance: 'Weergave', behavior: 'Gedrag', output: 'Uitvoer', file: 'Bestand' },
    schema: { source: 'Bron van de velden', immediate: 'Direct', fromApi: 'Via een API', immediateHint: 'Het schema is beschikbaar vanaf de eerste render.', apiHint: 'De velden komen {ms} ms later binnen, zoals een schema dat je backend levert. Kies het bestand alvast: de automatische koppeling wordt toegepast zodra ze binnen zijn.', loading: 'Schema laden…', loaded: '{n} velden geladen', simulate: 'Opnieuw simuleren' },
    appearance: { icons: 'Pictogrammen', messages: 'Teksten', default: 'Standaard', custom: 'Aangepast', iconsHint: 'Gedeeltelijke overschrijving: alleen de sleutels die je meegeeft worden vervangen, de rest houdt het standaardpictogram.', messagesHint: 'Gedeeltelijke overschrijving per taal, samengevoegd met de basisteksten van de actieve taal.' },
    behavior: {
        matcher: 'Automatisch koppelen', builtin: 'Ingebouwd', positional: 'Op positie', buggy: 'Met fout',
        builtinHint: 'Vergelijkt de kolomnaam met key, label en aliases, ongeacht accenten.',
        positionalHint: 'Kolom 1 → veld 1, kolom 2 → veld 2, zonder naar de koppen te kijken.',
        buggyHint: 'Een opzettelijk kapotte matcher die elke kolom aan hetzelfde veld koppelt. Bevestig om te zien hoe validate() dit tegenhoudt — zonder die controle zou toRows() de kolommen samenvoegen en hun gegevens stilzwijgend weggooien.',
        autoIgnore: 'Automatisch negeren', autoIgnoreHint: 'Kolommen zonder match komen op “negeren” te staan, zodat de gebruiker alleen de herkende kolommen nakijkt.',
        autoConfirm: 'Automatisch bevestigen', autoConfirmHint: 'Als alles klopt na het koppelen, wordt de interface overgeslagen en vuurt @mapped meteen.',
        firstRow: 'Eerste rij', header: 'Kop', data: 'Gegevens', firstRowHint: 'Hoe rij 1 bij het laden wordt gelezen. De gebruiker kan dit in het voorbeeld omzetten.',
        previewRows: 'Voorbeeldrijen', off: 'Uit', on: 'Aan',
    },
    out: {
        mode: 'Uitvoermodus',
        rowsHint: '@mapped geeft MappedResult[]: het bestand wordt in de browser gelezen en de waarden reizen als JSON.',
        mappingHint: '@mapped geeft { file, mapping, hasHeaders }: het ruwe bestand en het kolomwoordenboek, zodat je backend het leest. Er wordt niets omgezet naar rij-objecten.',
        transform: 'Transform',
        transformHint: 'Zet kolommen om naar rij-objecten: haalt spaties weg, voegt voor- en achternaam samen en normaliseert het telefoonnummer.',
        transformNA: 'Niet beschikbaar met output="mapping": ze sluiten elkaar uit, want er wordt niets naar rijen omgezet.',
        validation: 'Rijvalidatie',
        validationHint: 'Voert een functie uit over de gekoppelde rijen en toont wat die markeert. Het voorbeeldbestand bevat een dubbele ID, een lege naam en een kapot e-mailadres.',
    },
    file: { encoding: 'Tekencodering', autoDetect: 'Automatisch detecteren', encodingHint: 'Alleen tekstbestanden. De detectie regelt UTF-8 met of zonder BOM, UTF-16 en Windows-1252 zonder instellingen. Stel dit alleen in voor een oude codering die de detectie niet bereikt.', maxSize: 'Maximale bestandsgrootte', maxRows: 'Maximaal aantal rijen', noLimit: 'Geen limiet' },
    tabs: { preview: 'Voorbeeld', code: 'Code', output: 'Uitvoer', restart: 'Opnieuw' },
    code: { template: 'Template', schema: 'Schema', handler: 'Afhandeling van @mapped' },
    result: {
        empty: 'Nog geen uitvoer', emptyBody: 'Upload een bestand in het voorbeeld, koppel de kolommen en bevestig. Wat @mapped uitstuurt verschijnt hier.', goPreview: 'Naar het voorbeeld',
        mappingNote: 'het bestand is niet omgezet. Dit is wat je naar je backend zou sturen.',
        isHeader: 'rij 1 is een kop', isData: 'rij 1 zijn gegevens', columnsMapped: 'kolommen gekoppeld',
        mappingCard: 'mapping — kolomindex in het werkblad → veld',
        transformNote: '{n} rijen klaar om naar je API te sturen.', firstRows: 'Eerste 3 rijen',
        rowsNote: '{n} kolommen gekoppeld.', dataPreview: 'Voorbeeld van de gegevens',
    },
};

export const demoMessages: Record<Locale, DemoMessages> = { en, es, fr, pt, nl };
