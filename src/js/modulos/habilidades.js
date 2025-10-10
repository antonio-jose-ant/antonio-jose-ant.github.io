import { CSSandJSCargador } from '../cargadorJSandCSS/cagadorJS_Css.js';
import { cargaConsola } from './consola.js';
export const habilidades = {
    init() {
        CSSandJSCargador.cargar('inicio.css');
        cargaConsola();
        tamañoelement();
    }
};

function tamañoelement(atrib = '[dev-antonio-titulo]') {
    const el = document.querySelector(atrib);
    if (el) {
        console.log('Ancho:', el.offsetWidth);
        console.log('Alto:', el.offsetHeight);
    } else {
        console.warn('No se encontró el elemento');
    }
}
