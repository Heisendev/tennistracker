import { Link } from "react-router";

import { useMatches } from "../hooks/useMatchs";

const Home = () => {
const { data: matches, isLoading, error } = useMatches();
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to Tennis Tracker!</h1>

      <Link to="/newmatch" className="mt-4 px-6 py-3 hover:bg-primary-dark transition-colors border border-primary rounded-lg bg-amber-500 text-gray-900 font-semibold">
        Add a Match
      </Link>
      <h2 className="mt-4 text-xl font-semibold">Recent Matches</h2>
      {isLoading && <p>Loading...</p>}
      {matches && matches.length > 0 && matches.map(match => ( 
      (<Link key={match.id} to={`/matches/${match.id}`} className="mt-4 px-6 py-3 hover:bg-primary-dark transition-colors">{match.playerA.name} vs {match.playerB.name} - {match.tournament} {match.round} </Link> ) ))}
    </div>
  );
};

export default Home;