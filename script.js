const html = document.querySelector('html');
const botonEnfoque = document.querySelector('.app__card-button--enfoque');
const botonCorto = document.querySelector('.app__card-button--corto');
const botonLargo = document.querySelector('.app__card-button--largo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botones = document.querySelectorAll('.app__card-button');
const botonIniciarPausar = document.querySelector('#start-pause');
const inputMusicaEnfoque = document.querySelector('#alternar-musica');
const textoIniciarPausar = document.querySelector('#start-pause span');
const iconoIniciarPausar = document.querySelector(".app__card-primary-butto-icon");
const tiempoEnPantalla = document.querySelector('#timer');

const musica = new Audio('./sonidos/luna-rise-part-one.mp3');
const audioPlay = new Audio('./sonidos/play.wav');
const audioPausa = new Audio('./sonidos/pause.mp3');
const audioTiempoFinalizado = new Audio('./sonidos/beep.mp3');

let tiempoTranscurridoEnSegundos = 1500;
let idIntervalo = null;

musica.loop = true;

inputMusicaEnfoque.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

botonEnfoque.addEventListener('click', () => {
    tiempoTranscurridoEnSegundos = 1500;
    cambiarContexto('enfoque');
    botonEnfoque.classList.add('active');
});

botonCorto.addEventListener('click', () => {
    tiempoTranscurridoEnSegundos = 300;
    cambiarContexto('descanso-corto');
    botonCorto.classList.add('active');
});

botonLargo.addEventListener('click', () => {
    tiempoTranscurridoEnSegundos = 900;
    cambiarContexto('descanso-largo');
    botonLargo.classList.add('active');
});

function cambiarContexto(contexto) {
    mostrarTiempo();
    botones.forEach(function (botonContexto){
        botonContexto.classList.remove('active');
    });
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagenes/${contexto}.png`);
    switch (contexto) {
        case "enfoque":
            titulo.innerHTML = `
            Optimiza tu productividad,<br>
                <strong class="app__title-strong">sumérgete en lo que importa.</strong>
            `;
            break;
        case "descanso-corto":
            titulo.innerHTML = `
            ¿Qué tal tomar un respiro? <strong class="app__title-strong">¡Haz una pausa corta!</strong>
            `;
            break;
        case "descanso-largo":
            titulo.innerHTML = `
            Hora de volver a la superficie.<strong class="app__title-strong"> Haz una pausa larga.</strong>
            `;
            break;
        default:
            break;
    }
}

const cuentaRegresiva = () => {
    if(tiempoTranscurridoEnSegundos <= 0){
        audioTiempoFinalizado.play();
        alert('¡Tiempo finalizado!');
        reiniciar(); // Reiniciar después de que el tiempo se acabe
        return;
    }
    tiempoTranscurridoEnSegundos -= 1;
    mostrarTiempo();
};

botonIniciarPausar.addEventListener('click', iniciarOpausar);

function iniciarOpausar() {
    if(idIntervalo) {
        // Si el temporizador está en marcha, pausamos
        audioPausa.play();
        clearInterval(idIntervalo);
        idIntervalo = null;
        textoIniciarPausar.textContent = "Comenzar";
        iconoIniciarPausar.setAttribute('src', `/imagenes/play_arrow.png`);
    } else {
        // Si el temporizador está pausado o no ha comenzado, iniciamos
        audioPlay.play();
        idIntervalo = setInterval(cuentaRegresiva, 1000);
        textoIniciarPausar.textContent = "Pausar";
        iconoIniciarPausar.setAttribute('src', `/imagenes/pause.png`);
    }
}

const botonReiniciar = document.querySelector('#reset');

botonReiniciar.addEventListener('click', () => {
    reiniciar();
});

function reiniciar() {
    clearInterval(idIntervalo); 
    tiempoTranscurridoEnSegundos = 1500; // Ajusta esto a tu tiempo inicial deseado
    mostrarTiempo();
    textoIniciarPausar.textContent = "Comenzar";
    iconoIniciarPausar.setAttribute('src', `/imagenes/play_arrow.png`);
    idIntervalo = null;
    audioPausa.play(); // Reproduce el sonido de pausa al reiniciar
    cambiarContexto('enfoque'); // O el contexto que prefieras como predeterminado
}

function mostrarTiempo() {
    const tiempo = new Date(tiempoTranscurridoEnSegundos * 1000);
    const tiempoFormateado = tiempo.toLocaleTimeString('es-ES', {minute: '2-digit', second: '2-digit'});
    tiempoEnPantalla.innerHTML = `${tiempoFormateado}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleThemeButton = document.getElementById('toggle-theme');
    
    // Set the theme from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update button text based on current theme
    toggleThemeButton.textContent = currentTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';

    toggleThemeButton.addEventListener('click', () => {
        // Get the current theme from the data attribute
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update button text based on new theme
        toggleThemeButton.textContent = newTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
    });
});

mostrarTiempo();
