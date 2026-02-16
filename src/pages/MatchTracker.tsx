import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import Input from "@components/ui/Input";
import { usePlayers } from "../hooks/usePlayers";
import { useCreateMatch } from "../hooks/useMatchs";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import Header from "@components/Header";

const defaultValues = {
  tournament: "",
  surface: "Hard" as const,
  round: "1",
  date: "",
  playerA: "",
  playerB: "",
};

const MatchTracker = () => {
  const navigate = useNavigate();
  const { mutate } = useCreateMatch();

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleChange = (date: Date | null) => {
    console.log(date?.toISOString());
    setSelectedDate(date);
  };

  type Inputs = {
    playerA: string;
    playerB: string;
    tournament: string;
    date: string;
    surface: "Clay" | "Hard" | "Grass";
    round: string;
  };

  const { data: players } = usePlayers();

  const { register, handleSubmit, watch } = useForm<Inputs>({ defaultValues });

  const selectedPlayer1 = watch("playerA");
  const selectedPlayer2 = watch("playerB");

  useEffect(() => {
    register("date");
  }, [register]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(selectedDate);
    console.log(data);
    data.date = selectedDate!.toISOString();
    mutate(data, {
      onSuccess: async () => {
        console.log("MATCH CREATED");
        navigate("/matches");
      },
    });
  };

  return (
    <>
      <Header title="Create Match" />
      <section className="m-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white max-w-3xl mx-auto p-6 m-8 rounded-xl border border-gray-400">
          <fieldset className="border-0 flex flex-col text-left mb-4 max-w-md mx-auto">
            <legend className="font-display text-xl mb-4">
              Tournament Informations
            </legend>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input
                id="tournament"
                label="Tournament's name"
                placeholder="Wimbledon"
                {...register("tournament")}
              />
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <label htmlFor="surface">Surface</label>
              <div role="radiogroup">
                <input type="radio" value="Clay" {...register("surface")} /> Clay
                <input type="radio" value="Hard" {...register("surface")} /> Hard
                <input type="radio" value="Grass" {...register("surface")} />{" "}
                Grass
              </div>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input
                id="round"
                label="Round"
                placeholder="Round 1"
                {...register("round")}
              />
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <label htmlFor="date">Date</label>
              <DatePicker
                id="date"
                selected={selectedDate}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </fieldset>
          <fieldset className="border-0 mx-auto max-w-md text-left">
            <legend className="font-display text-xl mb-4">Players</legend>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <label className="flex items-center gap-2" htmlFor="player1">
                Player A
              </label>
              <select
                id="player1"
                {...register("playerA")}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select an existing player</option>
                {players &&
                  players
                    .filter((player) => player.id.toString() !== selectedPlayer2)
                    .map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.firstname} {player.lastname}
                      </option>
                    ))}
              </select>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <label className="flex items-center gap-2" htmlFor="player2">
                Player B
              </label>
              <select
                id="player2"
                {...register("playerB")}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select an existing player</option>
                {players &&
                  players
                    .filter((player) => player.id.toString() !== selectedPlayer1)
                    .map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.firstname} {player.lastname}
                      </option>
                    ))}
              </select>
            </div>
          </fieldset>
          <Input
            id="createMatch"
            label=""
            type="submit"
            variant="submit"
            value="Create Match"
          />
        </form>
      </section>
    </>
  );
};

export default MatchTracker;
