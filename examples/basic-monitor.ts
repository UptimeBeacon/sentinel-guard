import { SentinelGuard } from '../src/index.js';

/**
 * Einfaches Beispiel für die Verwendung der SentinelGuard Library
 */
async function basicExample() {
  // Konfiguration
  const sentinel = new SentinelGuard({
    baseUrl: 'https://api.monitoring.example.com',
    apiKey: 'your-api-key-here',
    timeout: 10000,
  });

  try {
    // Monitor erstellen
    console.log('📊 Erstelle Monitor...');
    const monitorResponse = await sentinel.createMonitor({
      name: 'Example Website',
      url: 'https://example.com',
      interval: 300, // 5 Minuten
      timeout: 30,
      metadata: {
        environment: 'production',
        team: 'platform',
      },
    });

    if (monitorResponse.success && monitorResponse.data) {
      console.log('✅ Monitor erstellt:', {
        id: monitorResponse.data.id,
        name: monitorResponse.data.name,
        url: monitorResponse.data.url,
      });

      // Alle Monitore abrufen
      console.log('\n📋 Lade alle Monitore...');
      const monitorsResponse = await sentinel.getMonitors();
      
      if (monitorsResponse.success && monitorsResponse.data) {
        console.log(`✅ ${monitorsResponse.data.length} Monitore gefunden`);
        monitorsResponse.data.forEach(monitor => {
          console.log(`  - ${monitor.name} (${monitor.status})`);
        });
      }

      // Monitor-Details abrufen
      console.log('\n🔍 Monitor-Details abrufen...');
      const monitorDetails = await sentinel.getMonitor(monitorResponse.data.id);
      
      if (monitorDetails.success && monitorDetails.data) {
        console.log('✅ Monitor-Details:', {
          name: monitorDetails.data.name,
          status: monitorDetails.data.status,
          lastCheck: monitorDetails.data.lastCheck,
        });
      }

      // Monitor pausieren
      console.log('\n⏸️  Monitor pausieren...');
      await sentinel.pauseMonitor(monitorResponse.data.id);
      console.log('✅ Monitor pausiert');

      // Monitor wieder aktivieren
      console.log('\n▶️  Monitor wieder aktivieren...');
      await sentinel.resumeMonitor(monitorResponse.data.id);
      console.log('✅ Monitor aktiviert');

      // Monitor löschen (optional - auskommentiert für Sicherheit)
      // console.log('\n🗑️  Monitor löschen...');
      // await sentinel.deleteMonitor(monitorResponse.data.id);
      // console.log('✅ Monitor gelöscht');
    }

  } catch (error) {
    console.error('❌ Fehler:', error);
  } finally {
    // Ressourcen bereinigen
    sentinel.destroy();
  }
}

// Ausführen falls direkt aufgerufen
if (import.meta.main) {
  basicExample();
}
