import { HtmlProps } from "next/dist/shared/lib/html-context.shared-runtime";
import cn from "@/utils/cn";

export default function Container(props:React.HTMLProps<HTMLDivElement>){
return(
    <div
    {...props}
    className={cn("w-full bg-white border rounded-xl flex py-4 shadow-sm",props.className)}
    />
)
}