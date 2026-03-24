import { useState } from "react";
import { X, Send } from "lucide-react";

export default function EmailModal({ onClose, subject: initSubject = "", body: initBody = "" }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(initSubject);
  const [body, setBody] = useState(initBody);
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!to) return;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">✉️ שליחת מייל</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="אל: כתובת מייל" value={to} onChange={e => setTo(e.target.value)} />
        <input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="נושא" value={subject} onChange={e => setSubject(e.target.value)} />
        <textarea className="border rounded-lg px-3 py-2 text-sm w-full" rows={5} placeholder="תוכן המייל" value={body} onChange={e => setBody(e.target.value)} />
        <button onClick={send} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white w-full justify-center" style={{ background: "#1a3060" }}>
          <Send className="w-4 h-4" />
          {sent ? "נשלח!" : "שלח"}
        </button>
      </div>
    </div>
  );
}