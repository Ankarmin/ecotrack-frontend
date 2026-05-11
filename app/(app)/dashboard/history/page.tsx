import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const historyData = [
  { 
    id: 1, 
    material: "Plástico PET", 
    weight: "1.2 kg", 
    points: "+120", 
    co2: "2.4 kg", 
    date: "Hoy, 14:30", 
    emoji: "🥤", 
    status: "Pendiente" 
  },
  { 
    id: 2, 
    material: "Cartón", 
    weight: "3.0 kg", 
    points: "+300", 
    co2: "2.7 kg", 
    date: "Ayer, 09:15", 
    emoji: "📦", 
    status: "Verificado" 
  },
  { 
    id: 3, 
    material: "Vidrio", 
    weight: "2.5 kg", 
    points: "+250", 
    co2: "0.8 kg", 
    date: "Hace 2 días", 
    emoji: "🍾", 
    status: "Verificado" 
  },
  { 
    id: 4, 
    material: "Aluminio", 
    weight: "0.4 kg", 
    points: "+40", 
    co2: "3.6 kg", 
    date: "Hace 3 días", 
    emoji: "🥫", 
    status: "Verificado" 
  },
  { 
    id: 5, 
    material: "Papel Mixto", 
    weight: "1.8 kg", 
    points: "+180", 
    co2: "1.5 kg", 
    date: "Hace 5 días", 
    emoji: "📰", 
    status: "Verificado" 
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6 pb-20">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Historial de reciclaje</h1>
        </div>
        
        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Total reciclado</p>
          <p className="text-xl font-bold text-foreground">8.9 kg</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Puntos ganados</p>
          <p className="text-xl font-bold text-primary">890 pts</p>
        </div>
      </div>

      {/* ── History List ── */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <ul className="divide-y divide-border">
          {historyData.map((item) => (
            <li key={item.id} className="p-4 sm:p-5 hover:bg-secondary/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">
                        {item.material}
                      </h3>
                      {item.status === "Pendiente" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          Pendiente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Verificado
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="font-medium text-foreground">{item.weight}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={cn(
                    "font-bold text-sm",
                    item.status === "Pendiente" ? "text-muted-foreground opacity-50" : "text-primary"
                  )}>
                    {item.points}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    −{item.co2} CO₂
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
