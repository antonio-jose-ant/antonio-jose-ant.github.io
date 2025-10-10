import { CSSandJSCargador } from '../cargadorJSandCSS/cagadorJS_Css.js';
export const sobre_mi = {
    init() {
        CSSandJSCargador.cargar('sobre_mi.css');
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
