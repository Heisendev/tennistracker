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
};

const CreatePlayer = () => {
    const navigate = useNavigate();
    const { mutate } = useCreatePlayer();
    const [country, setCountry] = useState<SelectMenuOption["value"]>("FR");
    
    type Inputs = {
        country: SelectMenuOption["value"]
        firstname: string
        lastname: string
    }

    const {
        register,
        handleSubmit,
        setValue,
    } = useForm<Inputs>({ defaultValues });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
        mutate( data, {
            onSettled: async () => {
                console.log('SUCESS!!');
                navigate("/players");
            }
        });
    };

    useEffect(() => {
        register("country");
    }, [register]);

    const handleChange = (value: SelectMenuOption["value"]) => { 
        setCountry(value);
        setValue("country", value);
    }

    return (
    <div className="bg-white p-6 rounded-xl">
        <h1>Create a new player</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input id="playerA_name" label="First name" placeholder="Rafael" {...register("firstname")}/>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <Input id="playerA_surname" label="Last name" placeholder="Nadal" {...register("lastname")}/>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
              <label htmlFor="player_country">Country</label>
              <CountrySelector 
                id="country" 
                onChange={handleChange}
                selectedValue={COUNTRIES.find((option) => option.value === country) || COUNTRIES[0]} />
            </div>
            <input type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="Create Match" />
        </form>
    </div>
  )

}

export default CreatePlayer