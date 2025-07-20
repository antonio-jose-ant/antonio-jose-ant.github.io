document.addEventListener('DOMContentLoaded', function () {
    CargaModuloHTML.cargaModulo('inicio');
    var header = document.getElementById('header');
    header.addEventListener('click', menuAcctivo);
});
const CargaModuloHTML = (() => {
    const idDOMPermitidos = ['inicio', 'section', 'footer', 'muestra_consola'];
    const rutasPermitidas = {
        'inicio': './pages/inicio.html',
        'header': './pages/header.html',
        'consola': './pages/consola.html',
        'contacto': './pages/contacto.html',
        'proyectos': './pages/proyectos.html',
        'sobre_mi': './pages/sobre_mi.html',
        'experiencia': './pages/experiencia.html',
    }
    return {
        cargaModulo: (modulo, idperm = 'section') => {
            if (!idDOMPermitidos.includes(idperm)) {
                console.error(`El ID '${idperm}' no está permitido.`);
                return;
            }
            if (!rutasPermitidas[modulo]) {
                console.error(`El módulo '${modulo}' no está permitido.`);
                return;
            }
            fetch(rutasPermitidas[modulo])
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.text();
                })
                .then(htmlString => {
                    const container = document.getElementById(idperm);
                    container.innerHTML = htmlString;
                    // Aquí puedes saber que el módulo ya se cargó en el DOM
                    // Por ejemplo, puedes disparar un evento personalizado:
                    const event = new CustomEvent('moduloCargado', { detail: { modulo, idperm } });
                    container.dispatchEvent(event);
                    if (modulo === 'inicio') {
                        const iamElement = document.getElementById('I_AM');
                        if (iamElement) {
                            if (window.innerWidth >= 900) {
                                iamElement.style.height = `${window.innerHeight - 54}px`;
                            }
                            CargaModuloHTML.cargaModulo('consola', 'muestra_consola');
                        }
                    }

                })
                .catch(error => {
                    console.error('Error al cargar el módulo:', error);
                });
        }
    }
})();
function menuAcctivo(event) {
    const menuItems = document.querySelectorAll('.menu ul li');
    menuItems.forEach(item => {
        item.classList.remove('selected');
    });
    const clickedItem = event.target.closest('li');
    if (clickedItem) {
        clickedItem.classList.add('selected');
        const modulo = clickedItem.textContent.trim().toLowerCase();
        console.log('Módulo seleccionado:', modulo);
        CargaModuloHTML.cargaModulo(modulo);
    }

}