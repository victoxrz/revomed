// speechManager.ts
type ResultCallback = (text: string, isFinal: boolean) => void;

class SpeechManager {
  private recognition: SpeechRecognition | null = null;

  isSupported() {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  private ensure() {
    if (this.recognition) return this.recognition;
    if (typeof window === "undefined") return null;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    const r: SpeechRecognition = new SR();
    r.continuous = true;
    r.interimResults = true;

    this.recognition = r;
    return r;
  }

  start(cb: ResultCallback, lang?: string) {
    const r = this.ensure();
    if (!r) throw new Error("SpeechRecognition not supported");
    this.recognition?.stop();

    r.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const transcript = res[0].transcript;
        console.log(transcript);
        if (cb) cb(transcript, res.isFinal);
      }
    };

    if (lang) r.lang = lang;
    try {
      r.start();
    } catch (e) {
      /* browsers may throw if called too quickly */ throw e;
    }
  }

  stop() {
    this.recognition?.stop();
  }
}

const manager = new SpeechManager();
export default manager;
