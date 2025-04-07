// utils/validation.js

/**
 * Vérifie si une chaîne est un email valide
 * @param {string} input - L'email à valider
 * @returns {boolean} - `true` si l'email est valide, `false` sinon
 */
function validateEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}

/**
 * Vérifie si une chaîne est un numéro de téléphone valide pour Madagascar en E.164
 * @param {string} input - Le numéro de téléphone à valider
 * @returns {boolean} - `true` si le numéro est valide, `false` sinon
 */
function validatePhone(input) {
  const phoneRegex = /^\+261(32|33|34|38)\d{7}$/; // Format E.164
  return phoneRegex.test(input);
}

/**
 * Formate un numéro en E.164 pour Madagascar
 * @param {string} input - Le numéro de téléphone brut
 * @returns {string} - Le numéro formaté en E.164
 */
function formatPhoneToE164(input) {
  let formattedPhone = input.trim();

  // Ajoute "+261" si ce n'est pas présent
  if (!formattedPhone.startsWith('+261')) {
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+261' + formattedPhone.slice(1); // Remplace le "0" par "+261"
    } else {
      formattedPhone = '+261' + formattedPhone; // Si pas de "0", ajoute "+261" directement
    }
  }

  return formattedPhone;
}

module.exports = {
  validateEmail,
  validatePhone,
  formatPhoneToE164,
};
