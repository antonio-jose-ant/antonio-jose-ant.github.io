document.addEventListener('DOMContentLoaded', function () {
    CargaModuloHTML.cargaModulo('inicio');
    var header = document.getElementById('header');
    header.addEventListener('click', menuAcctivo);
});
const CargaModuloHTML = (() => {
    const idDOMPermitidos = ['inicio', 'section', 'footer', 'muestra_consola'];
    const rutasPermitidas = {
        'inicio': './pages/inicio.html',
        'header': './pages/header.html',
        'consola': './pages/consola.html',
        'contacto': './pages/contacto.html',
        'proyectos': './pages/proyectos.html',
        'sobre_mi': './pages/sobre_mi.html',
        'experiencia': './pages/experiencia.html',
    }
    return {
        cargaModulo: (modulo, idperm = 'section') => {
            if (!idDOMPermitidos.includes(idperm)) {
                console.error(`El ID '${idperm}' no está permitido.`);
                return;
            }
            if (!rutasPermitidas[modulo]) {
                console.error(`El módulo '${modulo}' no está permitido.`);
                return;
            }
            fetch(rutasPermitidas[modulo])
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.text();
                })
                .then(htmlString => {
                    const container = document.getElementById(idperm);
                    container.innerHTML = htmlString;
                    const event = new CustomEvent('moduloCargado', { detail: { modulo, idperm } });
                    container.dispatchEvent(event);
                    if (modulo === 'inicio') {
                        const iamElement = document.getElementById('I_AM');
                        if (iamElement) {
                            if (window.innerWidth >= 900) {
                                iamElement.style.height = `${window.innerHeight - 54}px`;
                                cargaConsola();
                            }
                        }
                    }

                })
                .catch(error => {
                    console.error('Error al cargar el módulo:', error);
                });
        }
    }
})();
function menuAcctivo(event) {
    const menuItems = document.querySelectorAll('.menu ul li');
    menuItems.forEach(item => {
        item.classList.remove('selected');
    });
    const clickedItem = event.target.closest('li');
    if (clickedItem) {
        clickedItem.classList.add('selected');
        const modulo = clickedItem.textContent.trim().toLowerCase();
        console.log('Módulo seleccionado:', modulo);
        CargaModuloHTML.cargaModulo(modulo);
    }
}

function cargaConsola(idCargaConsole = 'muestra_consola') {
    CargaModuloHTML.cargaModulo('consola', idCargaConsole);
    const container = document.getElementById(idCargaConsole);
    container.addEventListener('moduloCargado', function (e) {
        if (e.detail.modulo === 'consola') {
            const consolaContent = container.querySelector('.consola_content');
            if (!consolaContent) { console.log("consola no cargada "); return; }
            // const promptSpan = consolaContent.querySelector('.prompt');
            // const inputAreaSpan = consolaContent.querySelector('.input_area');
            // inputAreaSpan.textContent = ' '; // Asegura que esté vacío al inicio
        }
    }, { once: true }); // Solo una vez por carga
}
function agregarEventosInput(inputArea) {
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
                consoleWeb.procesarComando(cleanedText, lastPId);
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
    return {
        procesarComando: (text, idP = "comand-0") => {
            const tokensrecibidos = text.trim().split(/\s+/);
            consoleWeb.lexico(tokensrecibidos, idP);
        },
        insertaNuevoP: (idP, token = "") => {
            const elementoExistente = document.getElementById(idP);
            if (!elementoExistente) return;

            elementoExistente.classList.remove('prompt');

            const [baseId, numStr] = idP.split("-");
            const nuevoID = parseInt(numStr) + 1;
            const nuevoP = document.createElement('p');
            nuevoP.className = "prompt";
            nuevoP.id = `${baseId}-${nuevoID}`;
            nuevoP.textContent = 'root@Antonio_Segura:~# ';
            elementoExistente.insertAdjacentElement('afterend', nuevoP);
            const userPrompt = document.getElementById(baseId + "-" + nuevoID);
            if (token !== "") {
                const spanError = document.createElement('span');
                spanError.textContent = `${token} no es un comando válido`;
                userPrompt.insertAdjacentElement('beforebegin', spanError);
            }
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(userPrompt);
            range.collapse(false); 
            sel.removeAllRanges();
            sel.addRange(range);

        },

        lexico: (token, idP) => {
            for (let i = 0; i < token.length; i++) {
                if (!tokens.includes(token[i])) {
                    consoleWeb.insertaNuevoP(idP, token[i]);
                    return;
                }
            }
            //llama a Sintáctico con var token
            // insertaNuevoP para pruebas en consola
            consoleWeb.insertaNuevoP(idP);
        },
        Sintáctico: () => {
            //pendiente
            //si el proseso es valido llama Semántico 
        },
        Semántico: () => {
            //pendiente
            //si el proseso es valido llama insertaNuevoP sin mensaje de error
        },
    }
})();