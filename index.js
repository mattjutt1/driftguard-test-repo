/**
 * Main application entry point
 * DriftGuard Test Repository
 */

const SecureAPI = require('./src/secure-code');
const ProblematicAPI = require('./src/problematic-code');

console.log('🛡️  DriftGuard Test Repository');
console.log('Testing both secure and problematic code patterns');

// Start both APIs for testing
const secureAPI = new SecureAPI();
const problematicAPI = new ProblematicAPI();

secureAPI.start(3000);
problematicAPI.start(3001);

console.log('✅ Secure API running on port 3000');
console.log('⚠️  Problematic API running on port 3001');
console.log('Ready for DriftGuard security analysis!');