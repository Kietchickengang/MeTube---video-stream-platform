import { Play } from "lucide-react"
import React from "react";

export const miniView = (view) => {
    if(view >= 1000){
        return (
            <div className="flex flex-row items-center justify-center gap-x-2">
                <Play size={13} color="white"></Play>
                {`${Math.floor((view / 1000) * 10) / 10} N`}
            </div>
        )
    }
    else if(view >= 1000000){
        return (
            <div className="flex flex-row items-center justify-center gap-x-2">
                <Play size={13} color="white"></Play>
                {`${Math.floor((view / 1000000) * 10) / 10} Tr`}
            </div>
        )
    }
    else{
        return (
            <div className="flex flex-row items-center justify-center gap-x-2">
                <Play size={13} color="white"></Play>
                {`${Math.floor((view / 1000000000) * 10) / 10} T`}
            </div>
        )
    }
}
