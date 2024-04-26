import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ClassValue } from "clsx";
export default function cn(...inputs: ClassValue[]){
    return twMerge(clsx(...inputs))
}