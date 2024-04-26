
export function ConvertKToC(tempInKelvin:number):number{
  const tempInCelsius= tempInKelvin - 273;
  return Math.floor(tempInCelsius);
}