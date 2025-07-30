import { creaConst } from './obtenerDataJson/obtenerDataJson.js';
import { agregarEventosInput } from './compiler/webCompiler.js';
import { CargaModuloHTML} from './utils/reloadApi.js';
import { menu } from './components/menu.js';

document.addEventListener('DOMContentLoaded', () => {
    CargaModuloHTML.cargaModulo('inicio'); // carga inicial
    const header = document.getElementById('header');
    header.addEventListener('click', menu.menuActivo);
});