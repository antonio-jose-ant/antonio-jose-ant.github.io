import { CargaModuloHTML } from '../utils/reloadApi.js';
/**
 * Módulo de menú para manejar las interacciones con el menú, resaltar los elementos seleccionados,
 * mostrar menús flotantes y cargar los módulos correspondientes.
 *
 * @namespace menu
 * @property {Function} menuActivo - Maneja los eventos de activación del menú, determina qué menú mostrar y dispara la recarga del módulo.
 *
 */
export const menu = (() => {
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
        try {
            const modulo = clickedItem.dataset.modulo || clickedItem.textContent.trim().toLowerCase();
            CargaModuloHTML.cargaModulo(modulo);
            menuItems.forEach(item => item.classList.remove('selected'));
            clickedItem.classList.add('selected');
            // console.log('Módulo seleccionado:', modulo);
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

        }
        catch (e) {
            alert(e)
        }
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