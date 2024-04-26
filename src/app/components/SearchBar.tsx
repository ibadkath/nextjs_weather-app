import { IoSearch } from "react-icons/io5";
import cn from "@/utils/cn";

type Props={
    className?:string;
    value:string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement>    | undefined;
};

export default function SearchBar(props:Props){
    return(
    <form 
    onSubmit={props.onSubmit}
    className={cn("flex relative items-center justify-center h-10", props.className)}>
        <input
         type="text"
         placeholder="Search"
         value={props.value}
         onChange={props.onChange}
         className="px-4 py-2 w-56 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full"     
         />
         <button title="search"
          className="px-4 py-2 bg-blue-500
         text-white rounded-r-md focus:outline-none
         hover:bg-blue-700 h-full">
            <IoSearch/>
         </button>         
    </form>
    )
}