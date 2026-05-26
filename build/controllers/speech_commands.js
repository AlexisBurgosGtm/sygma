// 1. Crear el objeto de reconocimiento
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// 2. Definir el idioma y la función para manejar los resultados
recognition.lang = 'es-ES';
recognition.onresult = function(event) {
    const vozComando = event.results[0][0].transcript;
    console.log('Comando reconocido:', vozComando);

    // 3. Ejecutar una acción según el comando
    if (vozComando.toLowerCase().includes('hola')) {
        alert('¡Hola! ¿Cómo puedo ayudarte?');
    } else if (vozComando.toLowerCase().includes('abrir google')) {
        window.open('https://www.google.com');
    }
};

// 4. Iniciar el reconocimiento (por ejemplo, al hacer clic en un botón)
function iniciarReconocimiento() {
    recognition.start();
};