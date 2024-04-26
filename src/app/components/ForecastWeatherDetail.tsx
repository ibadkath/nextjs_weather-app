import { ConvertKToC } from "@/utils/convertKToC";
import Container from "./Container";
import WeatherDetails, { WeatherDetailsProps } from "./WeatherDetails";
import WeatherIcon from "./Weathericon";


export interface ForecastWeatherDetailProps extends WeatherDetailsProps{
    weatherIcon:string;
    date:string;
    day: string;
    temp:number;
    feels_like:number;
    temp_min:number;
    temp_max:number;
    description:string;
}

export function ForecastWeatherDetails(props:ForecastWeatherDetailProps){

    const {
        weatherIcon="02d",
        date="18.04",
        day="Thursday",
        temp,
        feels_like,
        temp_min,
        temp_max,
        description
    } = props;
    return(
        <Container className=" gap-4">
            <section className=" gap-4 flex items-center px-4">
                <div className="flex flex-col gap-1 items-center">
                    <WeatherIcon iconName={props.weatherIcon}></WeatherIcon>
                <p>{date}</p>
                <p className=" text-sm">{day}</p>
                </div>

                {/*  */}
                <div className="flex flex-col px-4">
                 <span className=" text-5xl">{ConvertKToC(temp ?? 0)}°</span>
                 <p className=" text-xs space-x-1 whitespace-nowrap">
                    <span>Feels like</span>
                    <span>{ConvertKToC(feels_like ?? 0)}°</span>
                 </p>
                 <p className="capitaliza">{description}</p>
                </div>
            </section>

            <section className=" overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
                <WeatherDetails {... props }></WeatherDetails>
            </section>
        </Container>
    )
} 