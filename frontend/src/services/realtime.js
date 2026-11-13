import api, { API_BASE_URL } from './api.js';

export function playOrderChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // First note (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second cheerful note (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.65);
  } catch (e) {
    // Audio autoplay policy fallback
  }
}

class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.eventSource = null;
    this.pollTimer = null;
    this.lastTimestamp = Math.floor(Date.now() / 1000);
    this.lastId = 0;
    this.isConnected = false;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    this.connectStream();
    this.startSyncPolling();
  }

  connectStream() {
    try {
      if (typeof EventSource !== 'undefined') {
        const streamUrl = `${API_BASE_URL}/realtime/stream`;
        this.eventSource = new EventSource(streamUrl);

        this.eventSource.onopen = () => {
          this.isConnected = true;
          this.emit('connected', { status: 'online' });
        };

        this.eventSource.addEventListener('snapshot', (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.last_order?.id) {
              this.lastId = parseInt(data.last_order.id, 10);
            }
            this.emit('snapshot', data);
          } catch (err) {}
        });

        this.eventSource.addEventListener('store_updated', (e) => {
          api.clearCache?.();
          this.emit('store_updated', { time: Date.now() });
        });

        this.eventSource.onerror = () => {
          this.isConnected = false;
          if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
          }
        };
      }
    } catch (err) {
      // Stream fallback handled by sync polling
    }
  }

  startSyncPolling() {
    if (this.pollTimer) return;
    // 5-second ultra-responsive sync polling
    this.pollTimer = setInterval(async () => {
      try {
        const res = await api.get(`/realtime/sync?since=${this.lastTimestamp}&last_id=${this.lastId}`);
        if (res.data?.success) {
          this.lastTimestamp = res.data.timestamp;
          if (res.data.lastId) {
            this.lastId = Math.max(this.lastId, res.data.lastId);
          }
          if (res.data.hasUpdate) {
            api.clearCache?.();
            this.emit('store_updated', res.data);
            if (res.data.lastOrder) {
              this.emit('new_order', res.data.lastOrder);
            }
          }
        }
      } catch (e) {}
    }, 5000);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error('Realtime handler error:', err);
        }
      });
    }
  }
}

export const realtime = new RealtimeService();
export default realtime;
