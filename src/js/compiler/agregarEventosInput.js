import {consoleWeb} from './webCompiler.js';
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