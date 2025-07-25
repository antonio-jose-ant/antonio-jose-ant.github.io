document.addEventListener('DOMContentLoaded', function () {
    CargaModuloHTML.cargaModulo('inicio');
    var header = document.getElementById('header');
    header.addEventListener('click', menu.menuActivo);

});
/**
 * CargaModuloHTML es un objeto singleton que administra la carga dinámica de fragmentos HTML
 * dentro de elementos específicos del DOM. Su propósito es modularizar el contenido del sitio 
 * y permitir una navegación más dinámica sin recargar toda la página.
 *
 * Utiliza `fetch` para obtener el contenido HTML y lo inyecta en un contenedor permitido,
 * validando tanto el nombre del módulo como el destino en el DOM. También lanza un evento 
 * personalizado `moduloCargado` tras completar la carga.
 *
 * @namespace CargaModuloHTML
 *
 * @property {string[]} idDOMPermitidos - Lista de IDs de elementos del DOM en los que se permite insertar contenido.
 * @property {Object.<string, string>} rutasPermitidas - Objeto que relaciona nombres de módulos con rutas HTML.
 *
 * 
 * @method cargaModulo - Carga un fragmento HTML en un contenedor específico del DOM.
 * @param {string} modulo - Nombre del módulo a cargar (clave de `rutasPermitidas`).
 * @param {string} [idperm='section'] - ID del contenedor DOM donde se insertará el HTML.
 * @fires CustomEvent#moduloCargado - Evento disparado después de insertar el HTML con detalles del módulo e ID destino.
 * 
 * @requires cargaConsola
 * 
 */
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
        /**
         * Carga un archivo HTML asociado a un módulo y lo inserta dentro de un contenedor válido del DOM.
         *
         * @function cargaModulo
         * @memberof CargaModuloHTML
         * @param {string} modulo - Nombre del módulo a cargar (clave existente en `rutasPermitidas`).
         * @param {string} [idperm='section'] - ID del contenedor DOM donde se inyectará el contenido (debe estar en `idDOMPermitidos`).
         * @returns {void}
         *
         * @fires CustomEvent#moduloCargado
         * @throws {Error} - Si ocurre un problema durante la carga con fetch.
         */
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
                            }
                            cargaConsola();
                        }
                    }

                })
                .catch(error => {
                    console.error('Error al cargar el módulo:', error);
                });
        }
    }
})();
/**
 * Módulo de menú para manejar las interacciones con el menú, resaltar los elementos seleccionados,
 * mostrar menús flotantes y cargar los módulos correspondientes.
 *
 * @namespace menu
 * @property {Function} menuActivo - Maneja los eventos de activación del menú, determina qué menú mostrar y dispara la recarga del módulo.
 *
 */
const menu = (() => {
    /**
     * 
     * @function menuActivo
     * @param {Event} event - El objeto de evento de la interacción con el menú.
     * 
     */
    function menuActivo(event) {
        const cantidadUlsAnidadas = event.currentTarget.querySelectorAll("ul")
        const menuTp = ['.menu ul.menu-Principal', '.menu ul.menu-flotante'];
        const selectorMenuElegido = menuTp[cantidadUlsAnidadas.length - 1];
        console.log(selectorMenuElegido);
        const ul = event.currentTarget.querySelector(selectorMenuElegido);
        if (!ul) return;
        reloadModulo(event, ul, cantidadUlsAnidadas.length - 1 == 1);
    }
    /**
     * 
     * @private
     * @function reloadModulo
     * @param {Event} event - El objeto de evento de la interacción con el menú.
     * @param {HTMLUListElement} ul - El elemento UL que representa el menú.
     * @param {boolean} [flotante=false] - Indica si el menú flotante está activo.
     *  
     */
    function reloadModulo(event, ul, flotante = false) {
        const menuItems = ul.querySelectorAll('li');
        const clickedItem = event.target.closest('li');
        if (clickedItem && ul.contains(clickedItem)) {
            resaltarElementoMenu(menuItems, clickedItem, flotante);
        } else {
            mostrarMenuDesplegable(event, ul);
        }
    }
    /**
     * 
     * @private
     * @function resaltarElementoMenu
     * @param {NodeListOf<HTMLLIElement>} menuItems - Lista de elementos del menú.
     * @param {HTMLLIElement} clickedItem - El elemento del menú que fue clicado.
     * @param {boolean} flotante - Indica si el menú flotante está activo.
     * 
     */
    function resaltarElementoMenu(menuItems, clickedItem, flotante) {
        menuItems.forEach(item => item.classList.remove('selected'));
        clickedItem.classList.add('selected');
        const modulo = clickedItem.dataset.modulo || clickedItem.textContent.trim().toLowerCase();
        console.log('Módulo seleccionado:', modulo);
        if (flotante) {
            const menuPrincipal = document.querySelector('.menu ul.menu-Principal');
            if (menuPrincipal) {
                const itemsPrincipales = menuPrincipal.querySelectorAll('li');
                itemsPrincipales.forEach(item => {
                    item.classList.remove('selected');
                    if ((item.dataset.modulo || item.textContent.trim().toLowerCase()) === modulo) {
                        item.classList.add('selected');
                    }
                });
            }
            cierraMenuflotante();
        }
        CargaModuloHTML.cargaModulo(modulo);
    }
    /**
     * 
     * @private
     * @function mostrarMenuDesplegable
     * @param {Event} event - El objeto de evento de la interacción con el menú.
     * @param {HTMLUListElement} originalUl - El elemento UL original desde el cual clonar los elementos del menú.
     *
     */
    function mostrarMenuDesplegable(event, originalUl) {
        if (cierraMenuflotante() === "cerrado") return;
        const menuCreate = document.createElement('ul');
        menuCreate.className = "menu-flotante fadeInDown";
        const menuItems = originalUl.querySelectorAll('li');
        menuItems.forEach(li => {
            menuCreate.appendChild(li.cloneNode(true));
        });
        event.target.insertAdjacentElement('afterend', menuCreate);
    }
    /**
     * 
     * @private
     * @function cierraMenuflotante
     * @returns {string} - Devuelve "cerrado" si un menú flotante fue cerrado, de lo contrario "continua".
     * 
     */
    function cierraMenuflotante() {
        const menuExistente = document.querySelector('.menu-flotante');
        if (menuExistente) {
            menuExistente.classList.remove('fadeInDown');
            menuExistente.classList.add('fadeInUp-Menu');
            setTimeout(() => {
                menuExistente.remove();
            }, 750);
            return "cerrado";
        }
        return "continua";

    }
    /**
     * 
     * @param {*} event 
     * @returns 
     */
    return {
        menuActivo
    }
})();


function cargaConsola(idCargaConsole = 'muestra_consola') {
    CargaModuloHTML.cargaModulo('consola', idCargaConsole);
    const container = document.getElementById(idCargaConsole);
    container.addEventListener('moduloCargado', function (e) {
        if (e.detail.modulo === 'consola') {
            const consolaContent = container.querySelector('.consola_content');
            if (!consolaContent) { console.log("consola no cargada "); return; }
        }
    }, { once: true });
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