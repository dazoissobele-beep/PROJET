/**
 * Speech Handler - Gestion de la prononciation avec Web Speech API
 * Fonctionne hors ligne avec les voix du système
 */

let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

/**
 * Obtient les voix disponibles (français prioritaire)
 */
function getAvailableVoices() {
    const voices = speechSynthesis.getVoices();
    
    // Chercher d'abord une voix française
    let frenchVoice = voices.find(voice => voice.lang.startsWith('fr'));
    
    // Sinon utiliser la voix par défaut
    if (!frenchVoice) {
        frenchVoice = voices[0];
    }
    
    return { frenchVoice, allVoices: voices };
}

/**
 * Prononce un texte (avec gestion améliorée des erreurs)
 */
function speakText(text, callback = null) {
    try {
        // Valider le texte
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            console.warn('Texte vide ou invalide pour la prononciation');
            return false;
        }
        
        // Arrêter la prononciation en cours
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        // Obtenir la voix française
        const { frenchVoice } = getAvailableVoices();
        
        // Créer une nouvelle énonciation
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = 'fr-FR';
        currentUtterance.rate = 0.9; // Vitesse légèrement réduite pour clarté
        currentUtterance.pitch = 1;
        currentUtterance.volume = 1;
        
        if (frenchVoice) {
            currentUtterance.voice = frenchVoice;
        }
        
        // Callback quand la parole se termine
        if (callback) {
            currentUtterance.onend = callback;
        }
        
        // Gestionnaire d'erreurs
        currentUtterance.onerror = (event) => {
            console.error('Erreur de prononciation:', event.error);
        };
        
        // Prononcer
        speechSynthesis.speak(currentUtterance);
        return true;
    } catch (error) {
        console.error('Erreur lors de la prononciation:', error);
        return false;
    }
}

/**
 * Arrête la prononciation en cours
 */
function stopSpeech() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
}

/**
 * Fonction utilitaire pour échapper le texte JS de manière sécurisée
 */
function escapeTextForJS(text) {
    if (!text) return '';
    return text
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}

/**
 * Crée un bouton de prononciation pour le contenu
 */
function createSpeakButton(text, size = 'text-lg') {
    const escapedText = escapeTextForJS(text);
    return `
        <button 
            onclick="speakText('${escapedText}')"
            class="inline-flex items-center justify-center ${size} text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-2 transition-all ml-2"
            title="Écouter la prononciation"
            style="cursor: pointer; border: none; background: transparent;"
        >
            <i class="fas fa-microphone"></i>
        </button>
    `;
}

/**
 * Crée un bouton de prononciation intégré (inline)
 */
function createInlineSpeakButton(text) {
    return createSpeakButton(text, 'text-base');
}

/**
 * Crée un bouton de prononciation large (pour les sections)
 */
function createLargeSpeakButton(text) {
    return createSpeakButton(text, 'text-2xl');
}

/**
 * Obtient le statut de disponibilité de Web Speech API
 */
function isSpeechAvailable() {
    return 'speechSynthesis' in window && window.speechSynthesis !== null;
}

/**
 * Initialise le gestionnaire de parole
 */
function initSpeechHandler() {
    if (!isSpeechAvailable()) {
        console.warn('⚠️ Web Speech API non disponible dans ce navigateur');
        return false;
    }
    
    // Charger les voix quand elles sont disponibles
    speechSynthesis.onvoiceschanged = () => {
        getAvailableVoices();
    };
    
    console.log('✅ Speech Handler initialisé');
    return true;
}

// Initialiser automatiquement au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpeechHandler);
} else {
    initSpeechHandler();
}
