import { CargaModuloHTML } from '../../../src/js/utils/reloadApi.js';
import { menu } from '../../../src/js/components/menu.js';
document.addEventListener('DOMContentLoaded', () => {
    CargaModuloHTML.cargaModulo('inicio'); // carga inicial
    const header = document.getElementById('header');
    header.addEventListener('click', menu.menuActivo);
    const section = document.getElementById('section'); // este ya existe
    section.addEventListener('click', (e) => {
        if (e.target.matches('.btn-dinamico')) {
            console.log('Click en botón dinámico:', e.target);
            // aquí haces lo que necesites
        }
    });
});

