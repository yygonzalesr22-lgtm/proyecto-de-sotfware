#!/usr/bin/env node

/**
 * 🔐 Script para generar secretos seguros para Café Bar
 * 
 * Este script genera valores seguros para:
 * - JWT_SECRET: Para tokens de autenticación
 * - STRIPE_TEST_SECRET y STRIPE_TEST_PUBLIC: Para pruebas de Stripe
 * 
 * Uso:
 *   node scripts/generate-secrets.js
 * 
 * Los valores generados deben ser copiados al archivo .env
 */

const crypto = require('crypto');

console.log('\n🔐 GENERADOR DE SECRETOS SEGUROS - Café Bar API\n');
console.log('═'.repeat(60));

// Generar JWT_SECRET (256 bits = 32 bytes en hex)
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('\n1️⃣  JWT_SECRET (para tokens de autenticación)');
console.log('───────────────────────────────────────────────────────');
console.log(`Copiar este valor en .env:\n`);
console.log(`JWT_SECRET=${jwtSecret}\n`);
console.log(`Longitud: ${jwtSecret.length} caracteres`);
console.log(`Tipo: Hexadecimal (256-bit entropy)\n`);

// Información sobre Stripe
console.log('2️⃣  STRIPE KEYS (Para pruebas)');
console.log('───────────────────────────────────────────────────────');
console.log('⚠️  Los valores de Stripe NO se pueden generar automáticamente.');
console.log('   Debes obtenerlos de tu dashboard de Stripe:\n');
console.log('   🔗 https://dashboard.stripe.com/apikeys\n');
console.log('   Pasos:');
console.log('   1. Inicia sesión en tu cuenta Stripe');
console.log('   2. Ve a "Developers" → "API keys"');
console.log('   3. Copia tu "Secret key" (comenzará con sk_test_)');
console.log('   4. Copia tu "Publishable key" (comenzará con pk_test_)\n');
console.log('   Luego copiar en .env:\n');
console.log('   STRIPE_SECRET_KEY=sk_test_xxxxx');
console.log('   STRIPE_PUBLIC_KEY=pk_test_xxxxx\n');

// Información de base de datos
console.log('3️⃣  DATABASE CONFIGURATION');
console.log('───────────────────────────────────────────────────────');
console.log('Valores por defecto (verificar según tu setup):\n');
console.log('   DB_HOST=localhost');
console.log('   DB_USER=root');
console.log('   DB_PASSWORD=<tu_contraseña>');
console.log('   DB_NAME=cafe-bar-bd');
console.log('   DB_PORT=3306\n');

// Instrucciones finales
console.log('═'.repeat(60));
console.log('\n✅ PRÓXIMOS PASOS:\n');
console.log('1. Abre el archivo .env en la raíz del proyecto');
console.log('2. Abre el archivo cafe-bar-backend/.env en el backend');
console.log('3. Copia los valores generados en ambos archivos');
console.log('4. Obtén las claves de Stripe del dashboard');
console.log('5. Completa DB_HOST, DB_USER, DB_PASSWORD según tu config');
console.log('6. Guarda los archivos .env (¡NO los comitees a git!)');
console.log('7. Verifica con: npm test o node server.js\n');

console.log('⚠️  IMPORTANTE:');
console.log('   - NUNCA comitees los archivos .env a git');
console.log('   - Los archivos .env están en .gitignore');
console.log('   - Usa .env.example como template para tu equipo');
console.log('   - Cada ambiente (dev, staging, prod) debe tener sus secretos\n');

console.log('═'.repeat(60));
console.log('\n✨ Secretos generados exitosamente!\n');
