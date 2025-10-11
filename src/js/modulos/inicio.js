import { CSSandJSCargador } from '../cargadorJSandCSS/cagadorJS_Css.js';
import { cargaConsola } from '../modulos/consola.js';
export const inicio = {
    init() {
        const iamElement = document.getElementById('I_AM');
        if (iamElement) {
            if (window.innerWidth >= 900) {
                iamElement.style.height = `${window.innerHeight - 54}px`;
            }
        }
        CSSandJSCargador.cargar('inicio.css');
        cargaConsola();
    }
};


