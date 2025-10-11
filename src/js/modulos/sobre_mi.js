import { CSSandJSCargador } from '../cargadorJSandCSS/cagadorJS_Css.js';
export const sobre_mi = {
    init() {
        const sobre_mi = document.getElementById('sobre_mi');
        if (sobre_mi) {
            if (window.innerWidth >= 900) {
                sobre_mi.style.height = `${window.innerHeight - 54}px`;
            }
        }
        scrollX();
        CSSandJSCargador.cargar('sobre_mi.css');
    }
};
function scrollX() {
    const textoSobreMi = document.getElementById('textoSobreMi');
    const cards = document.querySelector('.cards');
    textoSobreMi.addEventListener('scroll', (e) => {
        const scrollY = window.scrollY;
        const velocidad = 0.5; // Ajusta la intensidad del movimiento
        cards.style.transform = `translateX(-${scrollY * velocidad}px)`;
        // console.log(e)
    });
}
