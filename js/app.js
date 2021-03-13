const monedaSelect = document.querySelector('#moneda');
const criptomonedasSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: "",
    criptomoneda: ""
}


document.addEventListener('DOMContentLoaded', () => {
    consultarCripto();
    formulario.addEventListener('submit', validar);
    monedaSelect.addEventListener('change', leerValor);
    criptomonedasSelect.addEventListener('change', leerValor);
});



function consultarCripto() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => {
            return respuesta.json()
        })
        .then(resultado => {
            return obtenerCriptoMonedas(resultado.Data);
        })
        .then(criptomonedas => {
            return SelecionarCriptoMonedas(criptomonedas);
        })
}
const obtenerCriptoMonedas = (arrayCripto) => new Promise((resolve) => {
    resolve(arrayCripto)
});

function SelecionarCriptoMonedas(criptomonedas) {
    criptomonedas.forEach(Cripto => {
        const { Name, FullName } = Cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);

    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function validar(e) {
    e.preventDefault();

    if (objBusqueda.moneda === '' || objBusqueda.criptomoneda === '') {
        mostrarError('no pueden estar los campos vacios');
    }
    consultarAPI();

}

function mostrarError(msj) {
    const existe = document.querySelector('.error');
    if (!existe) {
        const div = document.createElement('div');
        div.textContent = msj;
        div.classList.add('error');
        formulario.appendChild(div);
        setTimeout(() => {
            div.remove();
        }, 3000);
    }

}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    fetch(url)
        .then(respuesta => {

            return respuesta.json();
        })
        .then(datos => {
            mostrarCotizacion(datos.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacion(cotizacion) {
    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;


    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `<p>el precio es <span>${PRICE}</span></p>`;

    const PrecioAlto = document.createElement('p');
    PrecioAlto.innerHTML = `<p>el precio mas alto del dia <span>${HIGHDAY}</span>`

    const PreciomasBajo = document.createElement('p');
    PreciomasBajo.innerHTML = `<p>el precio mas bajo del dia <span>${LOWDAY}</span>`

    const precio24hs = document.createElement('p');
    precio24hs.innerHTML = `<p>ultimas 24 hs <span>${CHANGEPCT24HOUR}%</span>`

    const actualizacion = document.createElement('p');
    actualizacion.innerHTML = `<p>ultima actualizacion <span>${LASTUPDATE}</span>`


    resultado.appendChild(precio);
    resultado.appendChild(PrecioAlto);
    resultado.appendChild(PreciomasBajo);
    resultado.appendChild(precio24hs);
    resultado.appendChild(actualizacion);




}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  `;
    resultado.appendChild(spinner);
}