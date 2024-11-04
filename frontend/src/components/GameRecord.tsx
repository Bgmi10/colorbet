import { useEffect } from "react"

export const GameRecord = ({data}) => {
     console.log(data)

    return (
        <>
        <div className="flex justify-center">
        <div className="flex flex-wrap border w-fit m-3 p-2 gap-3"> 
           {
            data?.message?.map((i) => (
                <div>
                     {i.winner === "A" && <img src="https://colorwiz.cyou/images/luckyhit_red_dot.png" />}
                     {i.winner === "B" && <img src="https://colorwiz.cyou/images/luckyhit_black_dot.png" />}
                </div>
            ))
           }
        </div>
        </div>
        </>
    )
}