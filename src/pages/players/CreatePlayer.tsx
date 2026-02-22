import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { SelectMenuOption } from "@components/ui/Countryselector/types";
import Input from "@components/ui/Input";
import CountrySelector from "@components/ui/Countryselector/CountrySelector";
import { COUNTRIES } from "@components/ui/Countryselector/countries";

import { useCreatePlayer } from "../../hooks/usePlayers";
import Header from "@components/Header";

const defaultValues = {
  firstname: "",
  lastname: "",
  country: "FR" as SelectMenuOption["value"],
  hand: "Right" as const,
  backhand: "Two-handed" as const,
  rank: undefined as number | undefined,
};

const CreatePlayer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate } = useCreatePlayer();
  const [country, setCountry] = useState<SelectMenuOption["value"]>("FR");

  type Inputs = {
    country: SelectMenuOption["value"];
    firstname: string;
    lastname: string;
    hand: "Left" | "Right";
    backhand: "One-handed" | "Two-handed";
    rank?: number;
  };

  const { register, handleSubmit, setValue } = useForm<Inputs>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    mutate(data, {
      onSuccess: async () => {
        console.log("SUCESS!!");
        navigate("/players");
      },
    });
  };

  useEffect(() => {
    register("country");
  }, [register]);

  const handleChange = (value: SelectMenuOption["value"]) => {
    setCountry(value);
    setValue("country", value);
  };

  return (
    <>
      <Header title="Create a new player" />
      <section className="bg-white max-w-3xl mx-4 md:mx-auto p-6 m-8 rounded-xl border border-gray-400">

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-4">
            <Input
              id="firstname"
              label="First name"
              placeholder="Rafael"
              {...register("firstname")}
            />
          </div>
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-4">
            <Input
              id="lastname"
              label="Last name"
              placeholder="Nadal"
              {...register("lastname")}
            />
          </div>
          <div role="radiogroup" aria-labelledby="handlabel" className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-4">
            <span id="handlabel" className="flex items-center gap-2">{t('players.hand')}</span>
            <div className="toggle">
              <input id="hand-left" type="radio" value="Left" {...register("hand")} /> <label htmlFor="hand-left">{t('players.left')}</label>
              <input id="hand-right" type="radio" value="Right" {...register("hand")} /> <label htmlFor="hand-right">{t('players.right')}</label>
            </div>
          </div>
          <div role="radiogroup" aria-labelledby="backhandlabel mb-4" className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-4">
            <span id="backhandlabel" className="flex items-center gap-2">{t('players.backhand')}</span>
            <div className="toggle">
              <input id="backhand-one" type="radio" value="One-handed" {...register("backhand")} /> <label htmlFor="backhand-one">{t('players.oneHanded')}</label>
              <input id="backhand-two" type="radio" value="Two-handed" {...register("backhand")} /> <label htmlFor="backhand-two">{t('players.twoHanded')}</label>
            </div>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-4">
            <Input
              id="rank"
              label="Rank"
              placeholder="1"
              type="number"
              {...register("rank")}
            />
          </div>
          <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:gap-4 mb-4">
            {/* use a another select component for */}
            <label htmlFor="player_country">Country</label>
            <CountrySelector
              id="country"
              onChange={handleChange}
              selectedValue={
                COUNTRIES.find((option) => option.value === country) ||
                COUNTRIES[0]
              }
            />
          </div>
          <Input
            id="createPlayer"
            label=""
            type="submit"
            variant="submit"
            value="Create Player"
          />
        </form>
      </section>
    </>
  );
};

export default CreatePlayer;
