import { Play } from "lucide-react"
import React from "react";

export const miniView = (view) => {
    if(view < 1000){
        return (
            <div className="flex flex-row items-center justify-center gap-x-1">
                <Play size={13} color="white"></Play>
                {view} lượt xem
            </div>
        )
    }
    else if(view >= 1000){
        return (
            <div className="flex flex-row items-center justify-center gap-x-1">
                <Play size={13} color="white"></Play>
                {`${Math.floor((view / 1000) * 10) / 10} N`}
            </div>
        )
    }
    else if(view >= 1000000){
        return (
            <div className="flex flex-row items-center justify-center gap-x-1">
                <Play size={13} color="white"></Play>
                {`${Math.floor((view / 1000000) * 10) / 10} Tr`}
            </div>
        )
    }
    else{
        return (
            <div className="flex flex-row items-center justify-center gap-x-1">
                <Play size={13} color="white"></Play>
                {`${Math.floor((view / 1000000000) * 10) / 10} T`}
            </div>
        )
    }
}

export const SubscribeBtn = () => {
    return(
    <a href="#"
        className="mt-0 ml-1 no-underline inline-flex items-center p-2 bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white rounded-md transition duration-300">
        <svg class="w-5 h-5 fill-current mr-2" viewBox="0 0 24 24">
            <path
                d="M21.9 5.9c-.2-.7-.7-1.2-1.4-1.4C18.3 4 12 4 12 4s-6.3 0-8.5.5c-.7.2-1.2.7-1.4 1.4C2 8.1 2 12 2 12s0 3.9.5 5.1c.2.7.7 1.2 1.4 1.4 2.2.5 8.5.5 8.5.5s6.3 0 8.5-.5c.7-.2 1.2-.7 1.4-1.4.5-1.2.5-5.1.5-5.1s0-3.9-.5-5.1zM9.5 15.5V8.5l6.5 3z" />
            </svg>
        <span>Subscribe</span>
    </a>
    )
}