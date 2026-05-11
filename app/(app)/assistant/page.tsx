"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  id: "1",
  role: "assistant",
  content: "¡Hola! Soy EcoBot, tu asistente de reciclaje e ideas sostenibles. 🌱\n\nPuedes preguntarme cómo reciclar materiales específicos, pedirme ideas de manualidades con cosas que tienes en casa, o consultar dudas sobre qué va en cada contenedor. ¿En qué te puedo ayudar hoy?",
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "¡Qué interesante! Si tienes alguna otra duda sobre reciclaje o ideas para reutilizar materiales, no dudes en preguntarme.";
      
      const lowerInput = userMessage.content.toLowerCase();
      if (lowerInput.includes("cartón") || lowerInput.includes("papel higiénico") || lowerInput.includes("papel higienico") || lowerInput.includes("tubo")) {
        botResponse = "¡Excelente idea querer reutilizar esos tubos de cartón! ♻️\n\nAquí tienes un par de ideas geniales:\n\n1. **Organizadores de cables:** Puedes doblar tus cables y meterlos dentro de los tubitos para que no se enreden en los cajones.\n2. **Macetas para semilleros:** Si quieres plantar semillas, los tubos son perfectos porque cuando la planta crezca, puedes enterrar el tubo directamente en la tierra (¡es biodegradable!).\n3. **Adornos y manualidades:** Cortando los tubos en aros puedes hacer hermosas flores decorativas, coronas navideñas o lapiceros.\n\n¿Te gustaría que te explique cómo hacer alguna de estas opciones paso a paso?";
      } else if (lowerInput.includes("hola") || lowerInput.includes("saludos")) {
        botResponse = "¡Hola nuevamente! ¿Qué material tienes hoy para reciclar o reutilizar?";
      } else if (lowerInput.includes("plástico") || lowerInput.includes("botella")) {
        botResponse = "Las botellas de plástico PET son muy versátiles. Puedes convertirlas en macetas autorregables, comederos para aves, o simplemente asegurarte de aplastarlas bien y llevarlas a tu centro de acopio más cercano para ganar EcoPuntos.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: botResponse,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Eco Asistente <Sparkles className="w-4 h-4 text-amber-500" />
            </h1>
            <p className="text-sm text-muted-foreground">Tu guía de sostenibilidad con IA</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
          title="Limpiar chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-start gap-4 max-w-[85%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.role === "assistant"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              )}
            >
              {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={cn(
                "rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "assistant"
                  ? "bg-card border border-border text-foreground"
                  : "bg-primary text-primary-foreground"
              )}
              style={msg.role === "user" ? { background: "var(--gradient-primary)" } : {}}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl bg-card border border-border px-5 py-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 pb-2 border-t border-border">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 bg-card border border-border rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Escribe tu mensaje o pregunta..."
            className="flex-1 max-h-32 min-h-[44px] bg-transparent border-0 resize-none py-3 px-3 text-sm focus:ring-0 text-foreground placeholder:text-muted-foreground scrollbar-hide"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed mb-0.5"
            style={input.trim() && !isTyping ? { background: "var(--gradient-primary)" } : {}}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-3">
          El asistente puede cometer errores. Considera verificar la información importante.
        </p>
      </div>
    </div>
  );
}
