import {CargaModuloHTML} from '../utils/reloadApi.js';
import { CSSandJSCargador } from '../cargadorJSandCSS/cagadorJS_Css.js';
export function cargaConsola(idCargaConsole = 'muestra_consola') {
    CSSandJSCargador.cargar('consola.css');
    CargaModuloHTML.cargaModulo('consola', idCargaConsole);
    const container = document.getElementById(idCargaConsole);
    container.addEventListener('moduloCargado', function (e) {
        if (e.detail.modulo === 'consola') {
            const consolaContent = container.querySelector('.consola_content');
            if (!consolaContent) { console.log("consola no cargada "); return; }
        }
    }, { once: true });
}