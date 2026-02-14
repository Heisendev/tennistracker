import { useEffect, useState } from "react";
import { Watch, useForm, type SubmitHandler } from "react-hook-form";
import type { SelectMenuOption } from "@components/ui/Countryselector/types";
import Input from "@components/ui/Input";
import CountrySelector from "@components/ui/Countryselector/CountrySelector";
import { COUNTRIES } from "@components/ui/Countryselector/countries";
import { usePlayers } from "../hooks/usePlayers";

const defaultValues = {
  playerA_country: "FR" as SelectMenuOption["value"],
  playerB_country: "FR" as SelectMenuOption["value"],
  tournament_name: "",
  surface: "Clay" as const,
  round: 1,
  playerA_name: "",
  playerA_surname: "",
  playerA_seed: 0,
  playerB_name: "",
  playerB_surname: "",
  playerB_seed: 0,
};

const MatchTracker = () => {
  const [countryA, setCountryA] = useState<SelectMenuOption["value"]>("FR");
  const [countryB, setCountryB] = useState<SelectMenuOption["value"]>("FR");

  type Inputs = {
    existing_player1: string
    existing_player2: string
    tournament_name: string
    surface: "Clay" | "Hard" | "Grass"
    round: number
    playerA_country: SelectMenuOption["value"]
    playerA_name: string
    playerA_surname: string
    playerA_seed: number
    playerB_name: string
    playerB_surname: string
    playerB_seed: number
    playerB_country: SelectMenuOption["value"]
  }

const {data: players, isLoading: playerLoading, isError} = usePlayers();

  const {
    register,
    handleSubmit,
    getFieldState,
    setValue,
    formState: {  },
  } = useForm<Inputs>({ defaultValues });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  useEffect(() => {
    register("playerA_country");
    register("playerB_country");
  }, [register]);

  const handleChangeA = (value: SelectMenuOption["value"]) => { 
    setCountryA(value);
    setValue("playerA_country", value);
  }

  const handleChangeB = (value: SelectMenuOption["value"]) => { 
    setCountryB(value);
    setValue("playerB_country", value);
  }

  return (
    <div className="bg-white p-6 rounded-xl">
      <h1 className="text-4xl font-bold">Match Tracker</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <fieldset className="border-0 flex flex-col text-left mb-4 max-w-md mx-auto">
          <legend className="font-display text-xl mb-4">Tournament Informations</legend>
          <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
            <Input id="tournament_name" label="Tournament's name" placeholder="Wimbledon" {...register("tournament_name")}/>
          </div>
          <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
            <label htmlFor="surface">Surface</label>
            <div role="radiogroup">
              <input type="radio" value="Clay"  {...register("surface")}/> Clay
              <input type="radio" value="Hard"  {...register("surface")}/> Hard
              <input type="radio" value="Grass" {...register("surface")}/> Grass
            </div>
          </div>
          <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
            <Input id="round" label="Round" placeholder="Round 1" {...register("round", { valueAsNumber: true })}/>
          </div>
        </fieldset>
        <fieldset className="border-0 flex flex-col mx-auto md:flex-row text-left">
          <legend className="font-display text-xl mb-4">Players</legend>
          <fieldset className="w-1/2">
            <legend className="font-display">Player 1</legend>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <label htmlFor="existing_player1">Use an Existing Player</label>
              {/* register select input for existing players */}
              <select id="existing_player1" {...register("existing_player1")} className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Select an existing player</option>
                {players && players.map(player => (
                  <option key={player.id} value={player.id}>{player.firstname} {player.lastname}</option>
                ))}
              </select>
            </div>
            <div className="text-center my-2 text-gray-900">or create a player</div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input id="playerA_name" label="First name" placeholder="Rafael" {...register("playerA_name")}/>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input id="playerA_surname" label="Last name" placeholder="Nadal" {...register("playerA_surname")}/>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input id="playerA_seed" label="Seed number" placeholder="12" {...register("playerA_seed", { valueAsNumber: true })} />
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <label htmlFor="playerA_country">Country</label>
              <CountrySelector 
                id="playerA_country" 
                onChange={handleChangeA}
                selectedValue={COUNTRIES.find((option) => option.value === countryA) || COUNTRIES[0]} />
              
            </div>
          </fieldset>
          <fieldset className="w-1/2">
            <legend className="font-display">player 2</legend>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <label htmlFor="existing_player2">Use an Existing Player</label>
              {/* register select input for existing players */}
              <select id="existing_player2" {...register("existing_player2")} className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Select an existing player</option>
                {players && players.map(player => (
                  <option key={player.id} value={player.id}>{player.firstname} {player.lastname}</option>
                ))}
              </select>
            </div>
            <div className="text-center my-2 text-gray-900">or create a player</div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input id="playerB_name" label="First name" placeholder="Carlos" {...register("playerB_name")}/>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input id="playerB_surname" label="Last name" placeholder="Nadal" {...register("playerB_surname")}/>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input id="playerB_seed" label="Seed number" placeholder="12" {...register("playerB_seed", { valueAsNumber: true })}/>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <label htmlFor="playerB_country">Country</label>
              <CountrySelector 
                id="playerB_country" 
                onChange={handleChangeB}
                selectedValue={COUNTRIES.find((option) => option.value === countryB) || COUNTRIES[0]} />
            </div>
          </fieldset>
        </fieldset>
        <input type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="Create Match" />
      </form>
    </div>
  );
};

export default MatchTracker;