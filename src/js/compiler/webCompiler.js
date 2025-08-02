import { creaConst } from '../obtenerDataJson/obtenerDataJson.js';
/**
 * @function agregarEventosInput
 * esta función agrega eventos de teclado al área de entrada de la consola.
 * Permite navegar por el historial de comandos con las flechas arriba y abajo,
 * y enviar comandos con la tecla Enter.
 * @param {HTMLElement} inputArea - El área de entrada donde se agregarán los eventos
 * @returns 
 */
export function agregarEventosInput(inputArea) {
    inputArea.addEventListener('scroll', function (e) {
        console.log(e);
    })
    const hitoricheck = {
        "ArrowUp": "up",
        "ArrowDown": "down",
    };
    if (inputArea._listenerAgregado) return;
    inputArea._listenerAgregado = true; // bandera
    inputArea.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            let pConsole = contentConsole(event);
            consoleWeb.comans(hitoricheck[event.key], pConsole[1]);
        }
        if (event.key === 'Enter') {
            let pConsole = contentConsole(event);
            if (pConsole[2]) {
                const cleanedText = pConsole[2].replace(/^root@Antonio_Segura:~#\s*/, '');
                if (cleanedText != "") {
                    consoleWeb.lexico(cleanedText)
                        .then(reponse => {
                            if (reponse.result === 2) { consoleWeb.limpiaPantalla(event); return; }
                            consoleWeb.insertaNuevoP(pConsole[1], reponse.token)
                        });

                } else {
                    consoleWeb.insertaNuevoP(pConsole[1])
                }
            }
        }
    });
    /**
     * @function contentConsole
     * Esta función maneja el evento de teclado en el área de entrada, captura el último párrafo de la consola y devuelve su ID y texto.
     * @param {event} event 
     * @returns 
     */
    function contentConsole(event) {
        event.preventDefault();
        const consolaContent = inputArea.querySelectorAll('p');
        const lastP = consolaContent[consolaContent.length - 1];
        const lastPId = lastP.id;
        const lastPText = lastP.innerText.trim();
        return { 1: lastPId, 2: lastPText };
    }
}

/**
 * consoleWeb es un módulo basado en IIFE que simula una interfaz de línea de comandos web.
 * Gestiona el análisis léxico, sintáctico y semántico de los comandos del usuario, el historial de comandos,
 * y la interacción con el DOM para mostrar prompts y resultados.
 *
 * @namespace consoleWeb
 * @property {function(string): Promise<Object>} lexico - Realiza el análisis léxico, sintáctico y semántico de un comando.
 * @property {function(string, string=): void} insertaNuevoP - Inserta un nuevo elemento prompt en el DOM y muestra la salida opcionalmente.
 * @property {function(Event): void} limpiaPantalla - Limpia la consola y crea un nuevo prompt.
 * @property {function(string, string=): void} comans - Navega por el historial de comandos y actualiza el prompt.
 */
const consoleWeb = (() => {
    let tokens = [];
    let directorios = [];
    let sintaxis = {};
    let datosCargados = false;
    let cargando = false;
    let esperando = [];
    let significado = {}
    const historyComands = [];
    let historyIndex = -1;

    /**
     * Carga los datos de manera asíncrona si aún no se han cargado.
     * Asegura que múltiples llamadas concurrentes esperen a que los datos estén listos.
     * Obtiene 'tokens', 'directorios', 'sintaxis' y 'significado' desde una fuente JSON.
     * Resuelve todas las promesas pendientes una vez que los datos han sido cargados.
     *
     * @returns {Promise<void>} Se resuelve cuando los datos han sido cargados.
     */
    async function cargarDatos() {
        if (datosCargados) return;
        if (cargando) {
            // Si ya está cargando, espera a que termine
            return new Promise(resolve => esperando.push(resolve));
        }
        cargando = true;
        const recibido = await creaConst.obtenerDataJson('tokens');
        tokens = recibido.tokens;
        directorios = recibido.directorios;
        sintaxis = recibido.sintaxis;
        significado = recibido.significado;
        datosCargados = true;
        cargando = false;
        esperando.forEach(res => res()); // resolver a los que estaban esperando
        esperando = [];
    }

    /**
     * Realiza el análisis léxico del texto proporcionado, validando los tokens contra una lista predefinida.
     * Divide el texto de entrada en tokens, los limpia y verifica si cada uno es válido.
     * Si todos los tokens son válidos, procede al análisis sintáctico.
     *
     * @async
     * @param {string} text - El texto de entrada a analizar.
     * @returns {Promise<Object>} Retorna un objeto de resultado indicando éxito o fallo.
     */
    async function lexico(text) {
        await cargarDatos();  // solo espera si aún no están cargados
        const tokensrecibidos = text.trim().split(/\s+/);
        const tokensLimpios = [];
        historyComands.push(text);
        historyIndex = historyComands.length;
        for (let i = 0; i < tokensrecibidos.length; i++) {
            const tokenLimpio = tokensrecibidos[i].replace(/^\.(\/|\\)/, '');
            tokensLimpios.push(tokenLimpio);
            if (!tokens.includes(tokenLimpio)) {
                return { "result": "-1", "token": `'${tokensrecibidos[i]}' no es un comando válido` };
            }
        }
        return Sintáctico(tokensLimpios, tokensLimpios.length);
    }

    /**
     * Realiza el análisis sintáctico de los tokens proporcionados y delega al análisis semántico si son válidos.
     *
     * @param {string[]} text - Array de tokens a analizar.
     * @param {number} numberTokens - El número de tokens en la entrada.
     * @returns {{result: string, token: string}|any} Retorna un objeto con información de error si es inválido, o el resultado del análisis semántico si es válido.
     */
    function Sintáctico(text, numberTokens) {
        if (numberTokens === 1) {
            if (Array.isArray(sintaxis["1"]) && sintaxis["1"].includes(text[0])) {
                return Semantico(text, numberTokens);
            } else {
                return { "result": "-1", "token": `Comando inválido: '${text[0]}'` };
            }
        } else if (numberTokens === 2) {
            if (!sintaxis.hasOwnProperty(text[0])) {
                return { "result": "-1", "token": `Comando no reconocido: '${text[0]}'` };
            }
            const validArgs = sintaxis[text[0]];
            if (!Array.isArray(validArgs)) {
                return { "result": "-1", "token": `Configuración inválida para el comando: '${text[0]}'` };
            }
            if (!validArgs.includes(text[1])) {
                return { "result": "-1", "token": `Argumento inválido para '${text[0]}': '${text[1]}'` };
            }
            return Semantico(text, numberTokens);
        }
        return { "result": "-1", "token": "Error de sintaxis general" };
    }

    /**
     * Procesa una lista de tokens de comando y ejecuta la acción semántica correspondiente.
     *
     * @param {string[]} tokens - Array de tokens del comando a procesar.
     * @param {number} numberTokens - Número de tokens en el comando.
     * @returns {{ result: number, token: string }} Un objeto con el código de resultado y el texto de salida.
     *
     * @description
     * - Si el comando es una solicitud de ayuda ("--help" o "/?"), retorna la información de ayuda.
     * - Si el comando es "cls" o "clear", retorna la señal para limpiar la pantalla.
     * - Si el comando es "ls", "dir" o "cd", ejecuta la operación de directorio correspondiente.
     * - En otros casos, ejecuta el comando mapeado con los argumentos proporcionados.
     */
    function Semantico(tokens, numberTokens) {
        if (numberTokens === 1 && (tokens[0] === "--help" || tokens[0] === "/?")) {
            const resultSemantico = help();
            return { "result": resultSemantico.number, "token": resultSemantico.text };
        }
        if (numberTokens == 2 && (tokens[1] === "--help" || tokens[1] === "/?")) {
            const resultSemantico = help(tokens[0])
            return { "result": resultSemantico.number, "token": resultSemantico.text };
        }
        if (numberTokens == 1 && (tokens[0] == "cls" || tokens[0] == "clear")) {
            return { "result": 2, "token": "" }
        }
        const comando = {
            "ls": (dir) => listar(dir),
            "cd": (directorio) => cdFuncionamiento(directorio),
            "dir": (dir) => listar(dir),
            "wget":(file)=> wget(file),
        }
        let comanls = "";
        if (tokens[0] == "ls" || tokens[0] == "dir") {
            comanls = "todos";
        }
        const resultSemantico = comando[tokens[0]](numberTokens > 1 ? tokens[1] : comanls);
        return { "result": resultSemantico.number, "token": resultSemantico.text };

    }

    function wget(file) {
        if (file === "cv") {
            const filePath = `./document/Jose_Antonio_Rodriguez_Segura.pdf`;
            const link = document.createElement("a");
            link.href = filePath; // Ruta relativa desde /public
            link.download = "Jose_Antonio_Rodriguez_Segura.pdf"; // Nombre con el que se descargará
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return { "number": 1, "text": "Descargando curriculum vitae..." };
        }
    }

    /**
     * Navega por el historial de comandos según la dirección dada ("up" o "down").
     * Actualiza el campo de entrada con el comando seleccionado del historial.
     *
     * @param {"up"|"down"} arrow - Dirección para navegar en el historial de comandos.
     * @param {string} [idp="comand-0"] - ID del elemento de entrada a actualizar.
     * @returns {string|undefined} Retorna una cadena vacía si se llega al final del historial al navegar hacia abajo, de lo contrario undefined.
     */
    function comans(arrow, idp = "comand-0") {
        let resta = { "up": -1, "down": 1 }[arrow];
        historyIndex += resta;
        if (historyIndex < 0) {
            historyIndex = 0;
        } else if (historyIndex >= historyComands.length) {
            historyIndex = historyComands.length;
            return "";
        }
        insertComandHitory(idp, historyComands[historyIndex]);
    }

    /**
     * Inserta una entrada del historial de comandos en el elemento especificado por ID,
     * anteponiendo el texto con el prompt de la consola y moviendo el cursor.
     *
     * @param {string} idp - El ID del elemento DOM a actualizar.
     * @param {string} text - El texto del comando a insertar.
     */
    function insertComandHitory(idp, text) {
        const userPrompt = document.getElementById(idp);
        if (!userPrompt) return;
        userPrompt.textContent = 'root@Antonio_Segura:~# ' + text;
        moveCursor(idp);
    }

    /**
     * Lista los nombres de directorios o verifica la existencia de un directorio específico.
     *
     * @param {string} [dir="todos"] - El nombre del directorio a verificar, o "todos" para listar todos.
     * @returns {{number: number, text: string}} Un objeto con un número de estado y un mensaje de texto:
     *   - Si `dir` es "todos", retorna todos los nombres de directorios separados por saltos de línea.
     *   - Si `dir` existe, retorna el nombre del directorio.
     *   - Si `dir` no existe, retorna un mensaje de error.
     */
    function listar(dir = "todos") {
        if (dir === "todos") {
            // Unir todos los nombres de directorios separados por salto de línea
            const contenido = directorios.join('\n');
            return { "number": 1, "text": contenido };
        } else {
            // Buscar si existe el directorio solicitado
            if (directorios.includes(dir)) {
                return { "number": 1, "text": dir };
            } else {
                return { "number": -1, "text": `El directorio '${dir}' no existe.` };
            }
        }
    }

    /**
     * Genera el texto de ayuda para los comandos disponibles o para un comando específico.
     *
     * @param {string} [coman=""] - El comando para el que se desea obtener ayuda. Si está vacío, retorna ayuda para todos los comandos.
     * @returns {{number: number, text: string}} Un objeto que contiene un número de estado y el texto de ayuda.
     *   - Si `coman` no se encuentra, retorna `{ number: -1, text: "No hay información de ayuda para 'coman'" }`.
     *   - De lo contrario, retorna `{ number: 3, text: textoAyuda }` con el texto de ayuda formateado.
     */
    function help(coman = "") {
        let textoAyuda = "";
        if (coman === "") {
            for (const comando in significado) {
                const ayuda = significado[comando];
                textoAyuda += `> ${comando}\n`;

                if (Array.isArray(ayuda)) {
                    textoAyuda += ayuda.map(linea => `  ${linea}`).join('\n') + '\n\n';
                } else {
                    textoAyuda += `  ${ayuda}\n\n`;
                }
            }
        } else {
            if (!significado.hasOwnProperty(coman)) {
                return { number: -1, text: `No hay información de ayuda para '${coman}'` };
            }
            const ayuda = significado[coman];
            textoAyuda += `> ${coman}\n`;

            if (Array.isArray(ayuda)) {
                textoAyuda += ayuda.map(linea => `  ${linea}`).join('\n');
            } else {
                textoAyuda += `  ${ayuda}`;
            }
        }
        return { "number": 3, "text": textoAyuda };
    }

    /**
     * Representa la funcionalidad para cambiar el directorio de trabajo.
     * 
     * @param {string} directorio - El directorio al que se desea cambiar.
     * @returns {{number: number, text: string}} Un objeto que contiene un número y un texto descriptivo.
     */
    function cdFuncionamiento(directorio) {
        // crearPrompt(idP)
        //pendiente
        return { "number": 4, "text": "" }
    }

    /**
     * Inserta un nuevo prompt usando el ID proporcionado y opcionalmente muestra la salida con un token.
     *
     * @param {string} idP - El identificador para el prompt a crear.
     * @param {string} [token=""] - Token opcional para mostrar con la salida.
     * @returns {void}
     */
    function insertaNuevoP(idP, token = "") {
        let retIDPromo = crearPrompt(idP);
        if (token !== "") {
            mostrarSalida(retIDPromo, token);
        }
        return;
    }

    /**
     * Mueve el cursor al final del contenido del elemento especificado,
     * lo enfoca y asegura que sea visible dentro de su contenedor desplazable.
     *
     * @param {string} idP - El ID del elemento al que mover el cursor.
     */
    function moveCursor(idP) {
        const userPrompt = document.getElementById(idP);
        if (!userPrompt) return;

        if (userPrompt.focus) userPrompt.focus();

        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(userPrompt);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        const scrollContainer = userPrompt.closest('.consola_content');
        if (!scrollContainer) return;

        const promptRect = userPrompt.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();

        if (
            promptRect.bottom > containerRect.bottom ||
            promptRect.top < containerRect.top
        ) {
            // Scroll manual dentro del contenedor
            scrollContainer.scrollTop = userPrompt.offsetTop - scrollContainer.offsetTop;
        }
    }

    /**
     * Crea e inserta un nuevo elemento de prompt (<p>) en el DOM, simulando un prompt de línea de comandos.
     *
     * @param {string} idP - El ID del elemento prompt existente que se usará como referencia para la inserción.
     * @param {Event|string} [event=""] - Objeto de evento opcional; si se proporciona, determina el comportamiento de inserción.
     * @param {string} [cd="~"] - El directorio actual que se mostrará en el prompt.
     * @returns {string|undefined} El ID del nuevo elemento prompt creado, o undefined si la inserción falla.
     */
    function crearPrompt(idP, event = "", cd = "~") {
        let idInsertp = "";
        var elementoExistente = "";
        let lugar = "afterend";
        if (event === "") {
            elementoExistente = document.getElementById(idP);
            if (!elementoExistente) return;
            elementoExistente.classList.remove('prompt');
            const [baseId, numStr] = idP.split("-");
            const nuevoID = parseInt(numStr) + 1;
            idInsertp = `${baseId}-${nuevoID}`;
        } else {
            elementoExistente = event.target;
            idInsertp = "comand-0";
            lugar = "afterbegin";
        }
        const nuevoP = document.createElement('p');
        nuevoP.className = "prompt";
        nuevoP.id = idInsertp;
        nuevoP.textContent = 'root@Antonio_Segura:' + cd + "# ";
        elementoExistente.insertAdjacentElement(lugar, nuevoP);
        moveCursor(idInsertp);
        return idInsertp;
    }

    /**
     * Muestra el token de salida insertando un elemento <span> antes del elemento prompt especificado.
     *
     * @param {string} idPrompCreado - El ID del elemento prompt en el DOM.
     * @param {string} token - El texto que se mostrará dentro del <span> creado.
     */
    function mostrarSalida(idPrompCreado, token) {
        const userPrompt = document.getElementById(idPrompCreado);
        const span = document.createElement('span');
        span.textContent = token;
        userPrompt.insertAdjacentElement('beforebegin', span);
    }

    /**
     * Limpia el contenido del área de la consola y crea un nuevo prompt.
     *
     * @param {Event} event - El objeto de evento disparado por la acción del usuario.
     */
    function limpiaPantalla(event) {
        event.target.innerHTML = '';
        crearPrompt("", event);
    }
    return {
        lexico, insertaNuevoP, limpiaPantalla, comans
    }
})();
window.agregarEventosInput = agregarEventosInput;