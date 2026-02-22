import { useForm, type SubmitHandler, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Input from "@components/ui/Input";
import { usePlayers } from "../../hooks/usePlayers";
import { useCreateMatch } from "../../hooks/useMatchs";
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

const CreateMatch = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  const { register, handleSubmit, control } = useForm<Inputs>({ defaultValues });

  const selectedPlayer1 = useWatch({ control, name: "playerA" });
  const selectedPlayer2 = useWatch({ control, name: "playerB" });

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
      <section className="md:m-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white mx-2 md:max-w-3xl md:mx-auto md:p-6 p-2 rounded-xl border border-gray-400">
          <div className="flex mx-auto md:w-fit flex-col">
            <fieldset className="border-0 flex flex-col text-left md:mb-4 max-w-md mr-auto mb-4 p-0">
              <legend className="font-display text-xl mb-4">
                Tournament Informations
              </legend>
              <div className="md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-2 flex flex-col">
                <Input
                  id="tournament"
                  label={t("matches.tournament")}
                  placeholder="Wimbledon"
                  {...register("tournament")}
                />
              </div>
              <div>
                <div role="radiogroup" aria-labelledby="surface-label" className="md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-2 flex flex-col">
                  <span id="surface-label" className="flex items-center gap-2">{t("matches.surface")}</span>
                  <div className="toggle">
                    <input type="radio" id="clay" value="Clay" {...register("surface")} /><label htmlFor="clay" className="basis-20 md:basis-33">{t("matches.clay")}</label>
                    <input type="radio" id="hard" value="Hard" {...register("surface")} /><label htmlFor="hard" className="basis-20 md:basis-33">{t("matches.hard")}</label>
                    <input type="radio" id="grass" value="Grass" {...register("surface")} /><label htmlFor="grass" className="basis-20  md:basis-33">{t("matches.grass")}</label>
                  </div>
                </div>
              </div>
              <div className="md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-2 flex flex-col">
                <Input
                  id="round"
                  label="Round"
                  placeholder="Round 1"
                  {...register("round")}
                />
              </div>
              <div className="md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-2 flex flex-col">
                <label htmlFor="date">Date</label>
                <DatePicker
                  id="date"
                  selected={selectedDate}
                  onChange={handleChange}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </fieldset>
            <fieldset className="flex flex-col border-0 mr-auto max-w-md text-left mb-4 p-0">
              <legend className="font-display text-xl mb-4">Players</legend>
              <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-2">
                <label className="flex items-center gap-2" htmlFor="player1">
                  {t("matches.player")} A
                </label>
                <select
                  id="player1"
                  {...register("playerA")}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">{t("matches.selectPlayer")}</option>
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
              <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-2">
                <label className="flex items-center gap-2" htmlFor="player2">
                  {t("matches.player")} B
                </label>
                <select
                  id="player2"
                  {...register("playerB")}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">{t("matches.selectPlayer")}</option>
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
          </div>
          <Input
            id="createMatch"
            label=""
            type="submit"
            variant="submit"
            value={t("matches.createMatch")}
          />
        </form>
      </section>
    </>
  );
};

export default CreateMatch;
