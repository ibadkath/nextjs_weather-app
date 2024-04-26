'use client'

import React from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "./components/Container";
import { ConvertKToC } from "@/utils/convertKToC";
import { WiDegrees } from "react-icons/wi";
import WeatherIcon from "./components/Weathericon";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import WeatherDetails from "./components/WeatherDetails";
import { metreToKilometre } from "@/utils/metersToKms";
import { windSpeed } from "@/utils/windSpeed";
import { ForecastWeatherDetails } from "./components/ForecastWeatherDetail";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";


//'http://api.openweathermap.org/data/2.5/forecast?q=lahore&appid=209bbfa378de58d57e18caa32a71d0c4&cnt=56'

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherListItem[];
  city: CityInfo;
}

interface WeatherListItem {
  dt: number;
  main: MainWeatherInfo;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

interface MainWeatherInfo {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Sys {
  pod: string;
}

interface CityInfo {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Coord {
  lat: number;
  lon: number;
}
//http://api.openweathermap.org/data/2.5/forecast?q=lahore&appid=209bbfa378de58d57e18caa32a71d0c4&cnt=56`
export default function Home() {
  const [place, setPlace]= useAtom(placeAtom);
  const[loadingCity,]= useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>('repoData', async () =>{
    const {data} = await axios.get(
     `http://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
    );
    return data;
  }
      // fetch('chttp://localhost:3000'
      // ).then((res) =>
      //   res.json(),
      // ),
  );

  useEffect(()=>{
    refetch();
  }, [place,refetch]);

  const firstData=data?.list[0];
  console.log('data', data);

const uniquedates= [
  ...new Set(
    data?.list.map(
      (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
    )
  )
];
// Check if d or d.dt_txt is null or undefined
const dateString = data?.list[0].dt_txt ?? "";

// Parse the date string only if it's not empty
const parsedDate = dateString ? parseISO(dateString) : null;

// Format the date if it's parsed successfully
const formattedDate = parsedDate ? format(parsedDate, "dd.MM") : "";
const formatDate = parsedDate ? format(parsedDate, "dd.MM.yyyy") : "";

// Check if d or d.dt_txt is null or undefined

let formattedDay = "";
try {
    // Parse the date string only if it's not empty
    const parsedDate = dateString ? parseISO(dateString) : null;

    // Format the day of the week if the date is parsed successfully
    if (parsedDate) {
        formattedDay = format(parsedDate, "EEEE");
    }
} 
catch (error) {
    // Handle parsing errors
    console.error("Error parsing date:", error);
    // Optionally provide a default value or handle the error differently
}

//let parseDate;
 // try{
  //parseDate = parseISO(firstData?.dt_txt ?? "");
  // Use parsedDate
//} catch (error) {
 // console.error("Error parsing date:", error);
  // Handle the error, such as providing a default value or informing the user
//}


const firstDataForEachDate= uniquedates.map((date)=>{
  return data?.list.find((entry)=>{
    const entryDate= new Date(entry.dt * 1000).toISOString().split("T")[0];
    const entryTime= new Date(entry.dt * 1000).getHours();
    return entryDate === date && entryTime >= 6;
  })
})

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className=" animate-bounce">Loading...</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
     <Navbar location={data?.city.name}/>
     <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
    {/* today data */}
     
     {loadingCity ? (<WeatherSkeleton/>):
  (
    <> 
      <section className=" space-y-4">
        <div className=" space-y-2">
          <h2 className="flex gap-2 text-2xl items-end">
            <p>{formattedDay}</p>
            <p className=" text-lg">{formatDate}</p>
          </h2>
          <Container className="gap-10 px-6 items-center">
            {/* temperature */}
            <div className=" flex flex-col px-4">
              <span className="text-4xl">
               {ConvertKToC(firstData?.main.temp ?? 0)}°
            </span>
            <p className="text-xs space-x-1 whitespace-nowrap">
              <span>Feels like</span>
              <span>{ConvertKToC(firstData?.main.feels_like ?? 0)}°</span>
            </p>
            <p className=" text-xs space-x-2 ">
              <span>{ConvertKToC(firstData?.main.temp_min ?? 0)}°↓ {" "}</span>
              <span>{" "}{ConvertKToC(firstData?.main.temp_max ?? 0)}°↑ </span>
            </p>
            </div>
            {/* time and weather icon */}
            <div className="flex gap-10 sm:gap-16 overflow-auto justify-between w-full">
              {data?.list.map((d,i)=>
            <div key={i} className="flex flex-col items-center gap-2 justify-between text-xs font-semibold">
              <p className=" whitespace-nowrap">{format(parseISO(d.dt_txt), "h:mm a")}</p>
              {/* <WeatherIcon iconName={d.weather[0].icon}></WeatherIcon> */}
              <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}></WeatherIcon>
              <p>{ConvertKToC(d?.main.temp ?? 0)}°</p>
            </div>
            )}
            </div>
            </Container>
           </div>

           <div className="flex gap-4">

            {/* left */}
             <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className=" capitalize text-center">{firstData?.weather[0].description}{""}</p>
              <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? "", firstData?.dt_txt ?? "")}></WeatherIcon>
             </Container>
            {/* right */}

            <Container className="bg-blue-300 px-6 gap-4 justify-between oveerflow-x-auto">
            <WeatherDetails
            visability={metreToKilometre(firstData?.visibility ?? 10000)}
            airPressure={`${firstData?.main.pressure}Hpa`}
            humidity={`${firstData?.main.humidity}%`}
            sunrise={format(fromUnixTime(data?.city.sunrise ?? 171331390),"H:mm")}
            sunset={format(fromUnixTime(data?.city.sunset ?? 1713360733 ),"H:mm")}
            windSpeed={windSpeed(firstData?.wind.speed ?? 1.67)}></WeatherDetails>
            </Container>
           </div>
        </section>

        {/* 7 days forecast data */}
      <section className="flex w-full flex-col gap-4">
         <p className="text-2xl">Forecast (7 days)</p>
         {firstDataForEachDate.map((d,i)=> (
         <ForecastWeatherDetails
         key={i}
         description={d?.weather[0].description ?? ""}
         weatherIcon={d?.weather[0].icon ?? "01d"}
         date={formattedDate}
         day= {formattedDay}
         feels_like={d?.main.feels_like ?? 0}
         temp={d?.main.temp ?? 0}
         temp_max={d?.main.temp_max ?? 0}
         temp_min={d?.main.temp_min ?? 0}
         airPressure={`${d?.main.pressure} hPa`}
         humidity={`${d?.main.humidity ?? 61} %`}
         sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702517657), "H:mm")}
         sunset={format(fromUnixTime(data?.city.sunset ?? 1702517657), "H:mm")}
         visability={`${metreToKilometre(d?.visibility ?? 10000)}`}
         windSpeed={`${windSpeed(d?.wind.speed ?? 1.64)}`}
         />
        ))}
      </section>
      </>
    )}

     </main>
     </div>
  );
};

function WeatherSkeleton(){
  return(
    <section className="space-y-8">
      {/* Today's date skeleton */}
      <div className=" space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className=" flex gap-1 text-2xl items-end">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className=" grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map((index)=>(
            <div key={index} className=" flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

       {/* 7 days forecast skeleton */}
       <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1,2,3,4,5,6,7].map((index)=>(
          <div key={index} className=" grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
       </div>
    </section>
  );
}