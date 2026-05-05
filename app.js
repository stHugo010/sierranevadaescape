// Clase para manejar el formulario de postal
class PostalFormHandler {
    constructor(formId, modalId) {
        this.form = document.getElementById(formId);
        this.modal = document.getElementById(modalId);
        this.closeModalBtn = document.getElementById('close-modal');
        if (this.form) {
            this.init();
        }
    }
    init() {
        // Event listener para el submit del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        // Event listeners para validación en tiempo real
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
        // Contador de caracteres para el textarea
        const messageField = document.getElementById('message');
        const charCounter = document.getElementById('message-counter');
        if (messageField && charCounter) {
            messageField.addEventListener('input', () => {
                const currentLength = messageField.value.length;
                const maxLength = messageField.maxLength;
                charCounter.textContent = `${currentLength}/${maxLength}`;
                // Cambiar color si se acerca al límite
                if (currentLength > maxLength * 0.9) {
                    charCounter.style.color = 'var(--color-error)';
                }
                else {
                    charCounter.style.color = 'var(--color-text-gray)';
                }
            });
        }
        // Event listener para cerrar el modal
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeModal());
        }
        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.getAttribute('aria-hidden') === 'false') {
                this.closeModal();
            }
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        // Limpiar errores previos
        this.clearAllErrors();
        // Validar todos los campos
        const errors = this.validateForm();
        if (errors.length > 0) {
            // Mostrar errores
            errors.forEach(error => this.showError(error.field, error.message));
            // Focus en el primer campo con error
            const firstErrorField = document.querySelector(`[aria-describedby="${errors[0].field}-error"]`);
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }
        // Obtener datos del formulario
        const formData = this.getFormData();
        // Simular envío de postal
        this.sendPostal(formData);
    }
    validateForm() {
        const errors = [];
        // Validar imagen seleccionada
        const imageSelected = this.form.querySelector('input[name="postal-image"]:checked');
        if (!imageSelected) {
            errors.push({
                field: 'image',
                message: 'Por favor, selecciona una imagen para la postal.'
            });
        }
        // Validar nombre del remitente
        const senderName = document.getElementById('sender-name');
        if (!senderName.value.trim()) {
            errors.push({
                field: 'sender-name',
                message: 'Por favor, introduce tu nombre.'
            });
        }
        else if (senderName.value.trim().length < 2) {
            errors.push({
                field: 'sender-name',
                message: 'El nombre debe tener al menos 2 caracteres.'
            });
        }
        // Validar nombre del destinatario
        const recipientName = document.getElementById('recipient-name');
        if (recipientName && !recipientName.value.trim()) {
            errors.push({
                field: 'recipient-name',
                message: 'Por favor, introduce el nombre del destinatario.'
            });
        }
        else if (recipientName && recipientName.value.trim().length < 2) {
            errors.push({
                field: 'recipient-name',
                message: 'El nombre debe tener al menos 2 caracteres.'
            });
        }
        // Validar email del destinatario
        const recipientEmail = document.getElementById('recipient-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!recipientEmail.value.trim()) {
            errors.push({
                field: 'recipient-email',
                message: 'Por favor, introduce el email del destinatario.'
            });
        }
        else if (!emailRegex.test(recipientEmail.value.trim())) {
            errors.push({
                field: 'recipient-email',
                message: 'Por favor, introduce un email válido.'
            });
        }
        // Validar mensaje
        const message = document.getElementById('message');
        if (!message.value.trim()) {
            errors.push({
                field: 'message',
                message: 'Por favor, escribe un mensaje.'
            });
        }
        else if (message.value.trim().length < 10) {
            errors.push({
                field: 'message',
                message: 'El mensaje debe tener al menos 10 caracteres.'
            });
        }
        return errors;
    }
    validateField(field) {
        const fieldName = field.id;
        let error = null;
        switch (fieldName) {
            case 'sender-name':
                if (!field.value.trim()) {
                    error = { field: fieldName, message: 'Por favor, introduce tu nombre.' };
                }
                else if (field.value.trim().length < 2) {
                    error = { field: fieldName, message: 'El nombre debe tener al menos 2 caracteres.' };
                }
                break;
            case 'recipient-name':
                if (!field.value.trim()) {
                    error = { field: fieldName, message: 'Por favor, introduce el nombre del destinatario.' };
                }
                else if (field.value.trim().length < 2) {
                    error = { field: fieldName, message: 'El nombre debe tener al menos 2 caracteres.' };
                }
                break;
            case 'recipient-email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!field.value.trim()) {
                    error = { field: fieldName, message: 'Por favor, introduce el email del destinatario.' };
                }
                else if (!emailRegex.test(field.value.trim())) {
                    error = { field: fieldName, message: 'Por favor, introduce un email válido.' };
                }
                break;
            case 'message':
                if (!field.value.trim()) {
                    error = { field: fieldName, message: 'Por favor, escribe un mensaje.' };
                }
                else if (field.value.trim().length < 10) {
                    error = { field: fieldName, message: 'El mensaje debe tener al menos 10 caracteres.' };
                }
                break;
        }
        if (error) {
            this.showError(error.field, error.message);
        }
        else {
            this.clearError(field);
        }
    }
    showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        // Añadir atributo aria-invalid al campo
        const field = document.getElementById(fieldId);
        if (field) {
            field.setAttribute('aria-invalid', 'true');
        }
    }
    clearError(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        field.removeAttribute('aria-invalid');
    }
    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
        const fields = this.form.querySelectorAll('[aria-invalid]');
        fields.forEach(field => {
            field.removeAttribute('aria-invalid');
        });
    }
    getFormData() {
        const imageSelected = this.form.querySelector('input[name="postal-image"]:checked');
        const senderName = document.getElementById('sender-name');
        const recipientName = document.getElementById('recipient-name');
        const recipientEmail = document.getElementById('recipient-email');
        const message = document.getElementById('message');
        return {
            image: imageSelected ? imageSelected.value : '',
            senderName: senderName.value.trim(),
            recipientName: recipientName ? recipientName.value.trim() : '',
            recipientEmail: recipientEmail.value.trim(),
            message: message.value.trim()
        };
    }
    sendPostal(data) {
        // Simular envío (en producción, aquí iría una llamada a la API)
        console.log('Postal enviada:', data);
        // Guardar datos en localStorage para mostrarlos en la página de confirmación
        localStorage.setItem('postalData', JSON.stringify(data));
        // Redirigir a la página de confirmación
        window.location.href = 'confirmacion.html';
    }
    showModal() {
        this.modal.removeAttribute('hidden');
        this.modal.setAttribute('aria-hidden', 'false');
        // Focus en el botón de cerrar
        setTimeout(() => {
            this.closeModalBtn.focus();
        }, 100);
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }
    closeModal() {
        this.modal.setAttribute('hidden', '');
        this.modal.setAttribute('aria-hidden', 'true');
        // Restaurar scroll del body
        document.body.style.overflow = '';
        // Devolver focus al botón de submit
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.focus();
        }
    }
}
// Clase para manejar la galería
class GalleryHandler {
    constructor() {
        this.images = document.querySelectorAll('.gallery-image');
        this.init();
    }
    init() {
        this.images.forEach((image, index) => {
            // Hacer las imágenes clickeables y accesibles por teclado
            image.setAttribute('tabindex', '0');
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', `Ver imagen ampliada: ${image.alt}`);
            image.addEventListener('click', () => this.viewImage(index));
            image.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.viewImage(index);
                }
            });
        });
    }
    viewImage(index) {
        const image = this.images[index];
        // En una implementación real, aquí se abriría un lightbox
        // Por ahora, simplemente anunciar la acción
        console.log(`Viendo imagen: ${image.alt}`);
        // Podrías implementar un lightbox accesible aquí
        // Para esta versión simple, dejamos que el navegador maneje el zoom
    }
}
// Clase para el smooth scroll accesible
class SmoothScrollHandler {
    constructor() {
        this.init();
    }
    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        this.scrollToElement(target);
                    }
                }
            });
        });
    }
    scrollToElement(element) {
        const headerOffset = 80; // Altura del header sticky
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        // Focus en el elemento destino para accesibilidad
        setTimeout(() => {
            element.focus({ preventScroll: true });
            // Si el elemento no es naturalmente focusable, hacerlo temporalmente focusable
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '-1');
            }
        }, 500);
    }
}
// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar manejador del formulario
    new PostalFormHandler('postal-form', 'success-modal');
    // Inicializar manejador de galería
    new GalleryHandler();
    // Inicializar smooth scroll
    new SmoothScrollHandler();
    // Anunciar la carga de la página para lectores de pantalla
    const loadAnnouncement = document.createElement('div');
    loadAnnouncement.setAttribute('role', 'status');
    loadAnnouncement.setAttribute('aria-live', 'polite');
    loadAnnouncement.className = 'sr-only';
    loadAnnouncement.textContent = 'Página cargada correctamente';
    document.body.appendChild(loadAnnouncement);
});
// Exportar para uso en otros módulos si es necesario
export { PostalFormHandler, GalleryHandler, SmoothScrollHandler };