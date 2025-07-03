import { SentinelGuard } from '../src/index.js';

/**
 * Beispiel für korrektes Heartbeat-Setup mit Standard-Daten
 */
async function fixedHeartbeatExample() {
  const sentinel = new SentinelGuard({
    baseUrl: 'http://localhost:3001',
    apiKey: 'sen_live_faq0QIho10DfuQjTUnRq0arUEZXNVY0X',
    timeout: 10000,
  });

  try {
    console.log('🚀 Initialisiere SentinelGuard mit Standard-Heartbeat-Daten...');

    // Heartbeat-Manager initialisieren
    sentinel.initializeHeartbeat({
      interval: 5000, // 5 Sekunden
      autoStart: false, // Manuell starten für bessere Kontrolle
      maxConsecutiveErrors: 3,
    });

    // ✅ Standard-Heartbeat-Daten setzen (diese werden für automatische Heartbeats verwendet)
    sentinel.setDefaultHeartbeatData({
      type: 'CUSTOM',
      status: 'ONLINE',
      latencyMs: 150,
      metadata: {
        version: '1.0.0',
        region: 'eu-west',
        service: 'bot-service',
        environment: 'production',
      },
    });

    console.log('📋 Standard-Heartbeat-Daten gesetzt:', sentinel.getDefaultHeartbeatData());

    // Erster manueller Heartbeat
    console.log('\n📡 Sende ersten manuellen Heartbeat...');
    const firstHeartbeat = await sentinel.sendHeartbeat({
      type: 'CUSTOM',
      status: 'ONLINE',
      latencyMs: 120,
      metadata: {
        message: 'Bot is online and running smoothly.',
        region: 'eu-west',
        version: '1.0.0',
        startup: true,
      },
    });

    if (firstHeartbeat.success) {
      console.log('✅ Erster Heartbeat erfolgreich:', firstHeartbeat.data);
    }

    // Jetzt automatische Heartbeats starten
    console.log('\n🔄 Starte automatische Heartbeats mit Standard-Daten...');
    sentinel.startHeartbeat();

    // Warten und beobachten
    console.log('⏳ Warte 15 Sekunden um automatische Heartbeats zu beobachten...');
    console.log('   (Alle 5 Sekunden sollte ein Heartbeat mit Standard-Daten gesendet werden)');
    
    let counter = 0;
    const watchInterval = setInterval(() => {
      counter++;
      console.log(`   📊 Sekunde ${counter * 3} - Heartbeat aktiv: ${sentinel.isHeartbeatActive()}, Fehler: ${sentinel.getHeartbeatErrorCount()}`);
      
      if (counter >= 5) { // Nach 15 Sekunden stoppen
        clearInterval(watchInterval);
      }
    }, 3000);

    await new Promise(resolve => setTimeout(resolve, 15000));

    // Standard-Daten während Laufzeit aktualisieren
    console.log('\n🔧 Aktualisiere Standard-Heartbeat-Daten während Laufzeit...');
    sentinel.updateDefaultHeartbeatData({
      latencyMs: 200, // Erhöhte Latenz simulieren
      metadata: {
        version: '1.0.1', // Version-Update
        status_change: 'latency_increased',
      },
    });

    console.log('📋 Neue Standard-Daten:', sentinel.getDefaultHeartbeatData());

    // Weitere 10 Sekunden warten
    console.log('\n⏳ Weitere 10 Sekunden mit aktualisierten Standard-Daten...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Manueller Heartbeat mit spezifischen Daten
    console.log('\n📡 Sende manuellen Heartbeat mit spezifischen Daten...');
    const specificHeartbeat = await sentinel.sendHeartbeat({
      type: 'CUSTOM',
      status: 'HIGH_LATENCY',
      latencyMs: 500,
      metadata: {
        message: 'Temporary high latency detected',
        region: 'eu-west',
        version: '1.0.1',
        specific_event: true,
      },
    });

    if (specificHeartbeat.success) {
      console.log('✅ Spezifischer Heartbeat gesendet:', specificHeartbeat.data);
    }

    // Status zurück auf normal setzen
    await new Promise(resolve => setTimeout(resolve, 2000));
    sentinel.setDefaultHeartbeatData({
      type: 'CUSTOM',
      status: 'ONLINE',
      latencyMs: 150,
      metadata: {
        version: '1.0.1',
        region: 'eu-west',
        service: 'bot-service',
        status_restored: true,
      },
    });

    console.log('\n✅ Status zurück auf normal gesetzt');
    console.log('📊 Finale Standard-Daten:', sentinel.getDefaultHeartbeatData());

    // Automatische Heartbeats stoppen
    console.log('\n⏹️  Stoppe automatische Heartbeats...');
    sentinel.stopHeartbeat();

    // Finaler manueller Heartbeat
    const finalHeartbeat = await sentinel.sendHeartbeat({
      type: 'CUSTOM',
      status: 'ONLINE',
      metadata: {
        message: 'Service shutdown gracefully',
        region: 'eu-west',
        version: '1.0.1',
        shutdown: true,
      },
    });

    if (finalHeartbeat.success) {
      console.log('✅ Finaler Heartbeat gesendet:', finalHeartbeat.data);
    }

  } catch (error) {
    console.error('❌ Fehler:', error);
  } finally {
    // Ressourcen bereinigen
    console.log('\n🧹 Bereinige Ressourcen...');
    sentinel.destroy();
    console.log('✅ Demo beendet');
  }
}

// Ausführen falls direkt aufgerufen
if (import.meta.main) {
  fixedHeartbeatExample();
}
