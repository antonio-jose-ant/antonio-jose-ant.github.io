export function agregarEventosInput(inputArea) {
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
                consoleWeb.lexico(cleanedText, lastPId, event);
            }
        }
    });
}
const consoleWeb = (() => {
    const tokens = [
        'ls', 'cd', 'cls', 'clear', 'dir', 'contacto', 'proyectos', 'experiencia', '--help',
    ]
    const tokensignificado = {
        'ls': 'Lista los archivos y directorios en el directorio actual.',
        'cd': 'Cambia el directorio actual a otro especificado.',
        'cls': 'Limpia la pantalla de la consola.',
        'clear': 'Limpia la pantalla de la consola.',
        'dir': 'Muestra una lista de archivos y directorios en el directorio actual.',
        'contacto': 'Muestra información de contacto.',
        'proyectos': 'Muestra una lista de proyectos.',
        'experiencia': 'Muestra la experiencia laboral.',
    }
    function insertaNuevoP(idP, token = "") {
        let retIDPromo = crearPrompt(idP);
        if (token !== "") {
            insertarMensajeError(retIDPromo, token);
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
    function crearPrompt(idP, event = "") {
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
        nuevoP.textContent = 'root@Antonio_Segura:~# ';
        elementoExistente.insertAdjacentElement(lugar, nuevoP);
        moveCursor(idInsertp);
        return idInsertp;
    }
    function insertarMensajeError(idPrompCreado, token) {
        const userPrompt = document.getElementById(idPrompCreado);
        const spanError = document.createElement('span');
        spanError.textContent = `'${token}' no es un comando válido`;
        userPrompt.insertAdjacentElement('beforebegin', spanError);
    }
    function lexico(text, idP, event) {
        const tokensrecibidos = text.trim().split(/\s+/);
        for (let i = 0; i < tokensrecibidos.length; i++) {
            if (!tokens.includes(tokensrecibidos[i])) {
                insertaNuevoP(idP, tokensrecibidos[i]);
                return;
            }
        }
        //llama a Sintáctico con var token
        // insertaNuevoP para pruebas en consola
        insertaNuevoP(idP);
    }
    function limpiaPantalla(event) {
        event.target.innerHTML = '';
        crearPrompt("", event);
    }
    function Sintáctico() {
        //pendiente
        //si el proseso es valido llama Semántico 
    }
    function Semántico() {
        //pendiente
        //si el proseso es valido llama insertaNuevoP sin mensaje de error
    }
    return {
        lexico
    }
})();
window.agregarEventosInput = agregarEventosInput;