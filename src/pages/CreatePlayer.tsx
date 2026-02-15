import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { SelectMenuOption } from "@components/ui/Countryselector/types";
import Input from "@components/ui/Input";
import CountrySelector from "@components/ui/Countryselector/CountrySelector";
import { COUNTRIES } from "@components/ui/Countryselector/countries";

import { useCreatePlayer } from "../hooks/usePlayers";

const defaultValues = {
  firstname: "",
  lastname: "",
  country: "FR" as SelectMenuOption["value"],
  hand: "Right" as const,
  backhand: "Two-handed" as const,
  rank: undefined as number | undefined,
};

type HandOption = "Left" | "Right";

const CreatePlayer = () => {
  const navigate = useNavigate();
  const { mutate } = useCreatePlayer();
  const [country, setCountry] = useState<SelectMenuOption["value"]>("FR");
  const [hand, setHand] = useState<HandOption>("Right");

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
      onSettled: async () => {
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
    <div className="bg-white max-w-lg mx-auto p-6 m-8 rounded-xl">
      <h1>Create a new player</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
          <Input
            id="firstname"
            label="First name"
            placeholder="Rafael"
            {...register("firstname")}
          />
        </div>
        <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
          <Input
            id="lastname"
            label="Last name"
            placeholder="Nadal"
            {...register("lastname")}
          />
        </div>
        <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
          <label htmlFor="hand">Hand</label>
          <div role="radiogroup">
            <input type="radio" value="Left" {...register("hand")} /> Left
            <input type="radio" value="Right" {...register("hand")} /> Right
          </div>
        </div>
        <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
          <label htmlFor="backhand">Backhand</label>
          <div role="radiogroup">
            <input type="radio" value="One-handed" {...register("backhand")} />{" "}
            One-handed
            <input
              type="radio"
              value="Two-handed"
              {...register("backhand")}
            />{" "}
            Two-handed
          </div>
        </div>
        <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
          <Input
            id="rank"
            label="Rank"
            placeholder="1"
            type="number"
            {...register("rank")}
          />
        </div>
        <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
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
        <input
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          value="Create Player"
        />
      </form>
    </div>
  );
};

export default CreatePlayer;
