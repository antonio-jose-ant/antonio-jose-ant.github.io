import { creaConst } from '../../../src/js/obtenerDataJson/obtenerDataJson.js';
import { agregarEventosInput } from '../../../src/js/compiler/webCompiler.js';
import { CargaModuloHTML } from '../../../src/js/utils/reloadApi.js';
import { menu } from '../../../src/js/components/menu.js';

document.addEventListener('DOMContentLoaded', () => {
    CargaModuloHTML.cargaModulo('inicio'); // carga inicial
    const header = document.getElementById('header');
    header.addEventListener('click', menu.menuActivo);
});