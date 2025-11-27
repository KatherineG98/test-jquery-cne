$(document).ready(function() {

//Lógica de login y obtención de token
$("#loginBtn").click(function() {
const email = $("#emailInput").val().trim();
const password = $("#passwordInput").val();
const $tokenDisplayArea = $("#tokenResultado");
const $tokenDisplay = $("#tokenDisplay");
const $button = $(this);

// Limpiar y ocultar resultados previos
$tokenDisplayArea.removeClass("alert-success alert-danger").addClass("d-none");
$tokenDisplay.text("");

// 1. Validar campos
if (!email || !password) {
$tokenDisplayArea.removeClass("d-none").addClass("alert-danger");
$tokenDisplay.text("⚠️ Por favor, ingresa tu email y contraseña.");
return;
}

// Deshabilitar botón y mostrar estado de carga
$button.attr("disabled", true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando...');

// Configuración de la solicitud POST
const settings = {
"url": "https://api.cne.cl/api/login",
"method": "POST",
"timeout": 0,
"data": {
"email": email,
"password": password
}
};

// Ejecutar la llamada AJAX
$.ajax(settings)
.done(function (response) {
if (response && response.token) {
const receivedToken = response.token;

// ACCIÓN CRÍTICA: Pasar el token al input de la sección 2
$("#tokenInput").val(receivedToken).prop('readonly', true);
$("#cargarCombustiblesBtn").prop('disabled', false).removeClass('btn-primary').addClass('btn-success');

// Mostrar éxito
$tokenDisplayArea.removeClass("d-none alert-danger").addClass("alert-success");
$tokenDisplay.text(receivedToken);

} else {
// Respuesta inesperada
$tokenDisplayArea.removeClass("d-none alert-success").addClass("alert-danger");
$tokenDisplay.text("Respuesta inesperada del servidor. No se encontró el campo 'token'.");
}
})
.fail(function (jqXHR) {
// Manejo de errores HTTP
let errorMessage = `Error ${jqXHR.status}.`;

if (jqXHR.status === 401) {
errorMessage = "❌ Error 401 (No Autorizado): Credenciales inválidas.";
} else if (jqXHR.status >= 500) {
errorMessage = `❌ Error ${jqXHR.status}: Problema en el servidor.`;
} else if (jqXHR.status === 0) {
errorMessage = "❌ Error de conexión.";
}

$tokenDisplayArea.removeClass("d-none alert-success").addClass("alert-danger");
$tokenDisplay.text(errorMessage);
})
.always(function() {
// Habilitar el botón de nuevo
$button.attr("disabled", false).html("🔒 Obtener Token");
});
});

})