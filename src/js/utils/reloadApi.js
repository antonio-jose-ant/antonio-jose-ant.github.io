import { creaConst } from '../obtenerDataJson/obtenerDataJson.js';
import { inicio } from '../modulos/inicio.js';
import { sobre_mi } from '../modulos/sobre_mi.js';
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
export const CargaModuloHTML = (() => {
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

    const functionsModulos = {
        'inicio': () => { inicio.init() },
        'consola': () => { },
        'contacto': () => { contacto.init() },
        'proyectos': () => { proyectos.init() },
        'habilidades': () => { habilidades.init() },
        'sobre_mi': () => { sobre_mi.init() },
        'experiencia': () => { experiencia.init() },
    }

    function cargaModulo(modulo, idperm = 'section') {
        creaConst.obtenerDataJson('allowed_pages')
            .then(requerimientos => {
                const idDOMPermitidos = requerimientos.idDOMPermitidos;
                const rutasPermitidas = requerimientos.rutasPermitidas;

                if (!idDOMPermitidos.includes(idperm)) {
                    console.error(`El ID '${idperm}' no está permitido.`);
                    throw new Error(`El ID '${idperm}' no está permitido.`);
                }
                if (!rutasPermitidas[modulo]) {
                    console.error(`El módulo '${modulo}' no está permitido.`);
                    throw new Error(`El módulo '${modulo}' no está permitido.`);
                }

                return fetch(rutasPermitidas[modulo]);
            })
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
                functionsModulos[modulo]();
            })
            .catch(error => {
                console.error('Error al cargar el módulo:', error);
                throw error;
            });
    }
    return {
        cargaModulo
    }
})();
/**
 * cargaConsola es una función que carga el módulo de consola en un contenedor específico del DOM.
 * @param {string} idCargaConsole 
 */


