
import type { Player,  } from '../types';

interface MatchSummaryProps {
    playerA: Player;
    playerB: Player;
    winner: "A" | "B";
}

export const MatchSummary = ({ playerA, playerB, winner }: MatchSummaryProps    ) => {
  return (
    <div className="mb-8 max-w-4xl mx-auto grid grid-cols-[1fr_repeat(5,48px)]  bg-white items-center border border-gray-300 rounded-lg">
            <div className="px-4 py-2 h-6" />
            {[1, 2, 3, 4, 5].map((set) => (
            <div key={set} className="text-center text-xs text-muted-foreground font-medium py-2">
                {/* playerA.sets[set - 1] !== undefined ? `S${set}` : "" */} 
                S{set}
            </div>
            ))}
            <div className={`px-4 py-4 flex items-center gap-2 h-6 border-t border-gray-300 ${winner === "A" ? "text-foreground" : "text-muted-foreground"}`}>
                {winner === "A" && <div className="w-1 h-6 rounded-full bg-primary" />}
                <span>{playerA.firstname}</span>
            </div>
            {[0, 1, 2, 3, 4].map((index) => (
            
                <div key={index} className={`text-center py-4 font-medium h-6 border-t border-gray-300 `}>
                    1
                </div>
            ))}
            <div className={`px-4 py-4 flex items-center gap-2 h-6 border-t border-gray-300 ${winner === "B" ? "text-foreground" : "text-muted-foreground"}`}>
                {winner === "B" && <div className="w-1 h-6 rounded-full bg-primary" />}
                <span>{playerB.firstname}</span>
            </div>
            {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className={`text-center py-4 font-medium h-6 border-t border-gray-300 `}>
                    {index}
                </div>
            ))}
        </div>
  );};

  // <div key={index} className={`text-center py-4 font-medium h-6 border-t border-gray-300 ${playerA.sets[index] > playerB.sets[index] ? 'text-green-500' : ''}`}>
    {/* playerA.sets[index] || "" */}
// </div>

// <div key={index} className={`text-center py-4 font-medium h-6 border-t border-gray-300 ${playerB.sets[index] > playerA.sets[index] ? 'text-green-500' : ''}`}>
    {/* playerB.sets[index] || "" */}
// </div>