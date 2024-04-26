 
 export function metreToKilometre(visabilityInMetres: number): string{

    const visabilityInKilometres= visabilityInMetres / 1000;
    return `${visabilityInKilometres.toFixed(0)}km`
 }