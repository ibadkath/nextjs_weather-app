
export function windSpeed(metrePerSecond:number):string{
    const kilometrePerHour= metrePerSecond * 3.6;
    return `${kilometrePerHour.toFixed(0)}km/hr`
}