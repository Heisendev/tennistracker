import { usePlayers } from "../hooks/usePlayers";

const Players = () => {
    const {data: players, isLoading} = usePlayers()

    if(isLoading) return <div>Loading</div>
    
    return (
        <div>
            <h1>Players</h1>
            <ul>
                {players?.map(player => {
                    return (<li key={player.id}>{player.firstname} {player.lastname} - {player.country}</li>)
                })}
            </ul>
        </div>
    );
};

export default Players;