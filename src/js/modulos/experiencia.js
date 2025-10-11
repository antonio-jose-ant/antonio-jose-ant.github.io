import { CSSandJSCargador } from '../cargadorJSandCSS/cagadorJS_Css.js';
export const experiencia = {
    init() {
        const iamElement = document.getElementById('experiencia');
        if (iamElement) {
            if (window.innerWidth >= 900) {
                iamElement.style.height = `${window.innerHeight - 54}px`;
            }
        }
        CSSandJSCargador.cargar('inicio.css');
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
