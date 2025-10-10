import { agregarEventosInput } from './compiler/agregarEventosInput.js';
import { CargaModuloHTML } from './utils/reloadApi.js';
import { menu } from './components/menu.js';
document.addEventListener('DOMContentLoaded', () => {
    CargaModuloHTML.cargaModulo('inicio'); // carga inicial
    const header = document.getElementById('header');
    header.addEventListener('click', menu.menuActivo);
    const section = document.getElementById('section'); // este ya existe
    section.addEventListener('keydown', (e) => {
        if (e.target.matches('.consola_content')) {
            agregarEventosInput(e.target);
        }
    });
});