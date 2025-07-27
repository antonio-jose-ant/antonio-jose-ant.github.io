export function agregarEventosInput(inputArea) {
    const reponseCompiler = {
        "-1": (idPAnterior, token) => consoleWeb.insertaNuevoP(idPAnterior, token),
        "1": (idPAnterior, token) => consoleWeb.insertaNuevoP(idPAnterior, token),
        "3": (idPAnterior, token) => consoleWeb.insertaNuevoP(idPAnterior, token),
        "4": (idPAnterior, token) => consoleWeb.insertaNuevoP(idPAnterior, token),
    };
    if (inputArea._listenerAgregado) return;
    inputArea._listenerAgregado = true; // bandera
    inputArea.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const consolaContent = inputArea.querySelectorAll('p');
            const lastP = consolaContent[consolaContent.length - 1];
            const lastPId = lastP.id;
            const lastPText = lastP.textContent;
            if (lastPText) {
                const cleanedText = lastPText.replace(/^root@Antonio_Segura:~#\s*/, '');
                if (cleanedText != "") {
                    var reponse = consoleWeb.lexico(cleanedText);
                    if (reponse.result === 2) { consoleWeb.limpiaPantalla(event); return; }
                    reponseCompiler[reponse.result](lastPId, reponse.token);
                } else {
                    reponseCompiler["-1"](lastPId);
                }
            }
        }
    });
}
const consoleWeb = (() => {
    const tokens = [
        'ls',
        'cd',
        'cls',
        'clear',
        'dir',
        'contacto',
        'proyectos',
        'experiencia',
        'habilidades',
        'sobre_mi',
        '--help',
    ];
    const directorios = [
        'contacto',
        'proyectos',
        'experiencia',
        'habilidades',
        'sobre_mi'
    ];
    const sintaxis = {
        'cd': [...directorios, '..'],
        1: ['ls', 'cd', 'cls', 'clear', 'dir', '--help'],
        'dir':'--help',
        'clear':'--help',
        'cls':'--help',
        'ls':'--help',
    };
    function lexico(text) {
        const tokensrecibidos = text.trim().split(/\s+/);
        const tokensLimpios = [];
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
            if (sintaxis[numberTokens].includes(text[0])) return Semantico(text, numberTokens);
        } else if (numberTokens === 2) {
            if (sintaxis.hasOwnProperty(text[0])) {
                if (sintaxis[text[0]].includes(text[1])) return Semantico(text, numberTokens);
            }
        } else {
            return { "result": "-1", "token": "Error de sintaxis" };
        }
    }
    function Semantico(tokens, numberTokens) {
        if (numberTokens === 1 && tokens[0] === "--help") {return help();}
        if(numberTokens==2 && tokens[1]=="--help"){return help(tokens[0])}
        if(numberTokens==1 && tokens[0]=="cls" || tokens[0]=="clear"){return {"result": 2, "token": ""}}
        
        const comando = {
            "ls": (dir = "todos") => listar(dir),
            "cd": (directorio) => cdFuncionamiento(directorio),
            "dir": (dir = "todos") => listar(dir),
        }
        const resultSemantico = comando[tokens[0]](numberTokens > 1 ? tokens[1] : "");
        return { "result": resultSemantico.number, "token": resultSemantico.text };

    }
    function listar(dir) {
        return { "number": 1, "text": "" }
    }
    function help(coman=""){
        return { "number": 3, "text": "" }
    }
    function cdFuncionamiento(directorio) {
        crearPrompt(idP)
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
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(userPrompt);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    function crearPrompt(idP, event = "", cd = "# ") {
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
        nuevoP.textContent = 'root@Antonio_Segura:~' + cd;
        elementoExistente.insertAdjacentElement(lugar, nuevoP);
        moveCursor(idInsertp);
        return idInsertp;
    }
    function mostrarSalida(idPrompCreado, token) {
        const userPrompt = document.getElementById(idPrompCreado);
        const spanError = document.createElement('span');
        spanError.textContent = token;
        userPrompt.insertAdjacentElement('beforebegin', spanError);
    }
    function limpiaPantalla(event) {
        event.target.innerHTML = '';
        crearPrompt("", event);
    }
    return {
        lexico, insertaNuevoP, limpiaPantalla
    }
})();
window.agregarEventosInput = agregarEventosInput;