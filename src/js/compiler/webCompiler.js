import { creaConst } from '../obtenerDataJson/obtenerDataJson.js';
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
    function contentConsole(event) {
        event.preventDefault();
        const consolaContent = inputArea.querySelectorAll('p');
        const lastP = consolaContent[consolaContent.length - 1];
        const lastPId = lastP.id;
        const lastPText = lastP.innerText.trim();
        return { 1: lastPId, 2: lastPText };
    }
}
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
        }
        let comanls = "";
        if (tokens[0] == "ls" || tokens[0] == "dir") {
            comanls = "todos";
        }
        const resultSemantico = comando[tokens[0]](numberTokens > 1 ? tokens[1] : comanls);
        return { "result": resultSemantico.number, "token": resultSemantico.text };

    }

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
    function insertComandHitory(idp, text) {
        const userPrompt = document.getElementById(idp);
        if (!userPrompt) return;
        userPrompt.textContent = 'root@Antonio_Segura:~# ' + text;
        moveCursor(idp);
    }
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

    function cdFuncionamiento(directorio) {
        // crearPrompt(idP)
        //pendiente
        return { "number": 4, "text": "" }
    }
    function insertaNuevoP(idP, token = "") {
        let retIDPromo = crearPrompt(idP);
        if (token !== "") {
            mostrarSalida(retIDPromo, token);
        }
        return;
    }

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
        console.log(scrollContainer.scrollHeight);

        const promptRect = userPrompt.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        console.log(promptRect, containerRect);

        if (
            promptRect.bottom > containerRect.bottom ||
            promptRect.top < containerRect.top
        ) {
            // Scroll manual dentro del contenedor
            scrollContainer.scrollTop = userPrompt.offsetTop - scrollContainer.offsetTop;
        }
    }


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
    function mostrarSalida(idPrompCreado, token) {
        const userPrompt = document.getElementById(idPrompCreado);
        const span = document.createElement('span');
        span.textContent = token;
        userPrompt.insertAdjacentElement('beforebegin', span);
    }
    function limpiaPantalla(event) {
        event.target.innerHTML = '';
        crearPrompt("", event);
    }
    return {
        lexico, insertaNuevoP, limpiaPantalla, comans
    }
})();
window.agregarEventosInput = agregarEventosInput;