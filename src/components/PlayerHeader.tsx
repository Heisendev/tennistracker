interface player {
  name: string;
  country: string;
  seed?: number;
}

interface PlayerHeaderProps {
  player: player;
  winner?: boolean;
}

const PlayerHeader = ({ player, winner }: PlayerHeaderProps) => {
  return (
    <div className="text-center mb-8">
        <div className="flex align-middle place-items-center gap-3">
            <div className={`w-14 h-14 flex justify-center items-center rounded-full border ${winner ? 'border-green-500' : 'border-gray-200'}`}>{player.country}</div>
            <h2 className="text-2xl md:text-3xl">
                {player.name}
            </h2>
            <div className="border border-gray-200 pt-0.5 pb-0.5 pl-3 pr-3 text-xs text-muted-foreground rounded-sm">{player.seed ? "[" + player.seed + "]" : "N/Add"}</div>
        </div>
    </div>
  )
  };

export default PlayerHeader;