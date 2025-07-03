#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cjsDir = join(__dirname, '../dist/cjs');

/**
 * Konvertiert ES Module Dateien zu CommonJS-kompatiblen Dateien
 */
function fixCjsFiles(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      fixCjsFiles(filePath);
    } else if (file.endsWith('.js')) {
      let content = readFileSync(filePath, 'utf-8');
      
      // Ersetze .js Imports mit .cjs für CommonJS
      content = content.replace(/from ['"]([^'"]+)\.js['"]/g, "from '$1.cjs'");
      content = content.replace(/import\(['"]([^'"]+)\.js['"]\)/g, "import('$1.cjs')");
      
      // Schreibe die Datei mit .cjs Endung
      const cjsPath = filePath.replace(/\.js$/, '.cjs');
      writeFileSync(cjsPath, content);
      
      console.log(`Konvertiert: ${file} -> ${file.replace('.js', '.cjs')}`);
    }
  }
}

try {
  console.log('🔧 Konvertiere ES Module zu CommonJS...');
  fixCjsFiles(cjsDir);
  console.log('✅ CommonJS-Konvertierung abgeschlossen');
} catch (error) {
  console.error('❌ Fehler bei der CommonJS-Konvertierung:', error);
  process.exit(1);
}
