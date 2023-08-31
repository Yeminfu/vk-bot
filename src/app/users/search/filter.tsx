"use client"
import { useForm } from "react-hook-form";
import { SearchUsersInterface } from "./page";

type Inputs = {
    city: number,
    sex: number,
    online: number,
    age_from: string,
    age_to: string,
};

export default function Filter(props: {
    cities: { id: number, title: string }[]
    searchParams: SearchUsersInterface
}) {

    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            city: Number(props.searchParams.city),
            sex: 1,
            age_from: props.searchParams.age_from,
            age_to: props.searchParams.age_to,
        }
    });

    const onSubmit = (data: any) => {
        const qs = Object.entries(data).map(v => `${v[0]}=${v[1]}`).join("&");
        const { origin, pathname } = window.location;
        const newLink = `${origin}/${pathname}?${qs}`;
        window.open(newLink, "_self");
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <select {...register("city")}>
                    <option >Город</option>
                    {props.cities.map(citie => <option key={citie.id} value={citie.id}>{citie.title}</option>)}
                </select>
            </div>
            <div>
                <select {...register("sex")}>
                    <option value="">{"Пол"}</option>
                    <option value={0}>не указан</option>
                    <option value={1}>женский</option>
                    <option value={2}>мужской</option>
                </select>
            </div>
            <div>
                <input type="number" {...register("age_from")} />
                <input type="number" {...register("age_to")} />
            </div>
            <input type="submit" />
        </form>
    );
}