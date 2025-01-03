import { appName } from "../../utils/constants";

export default function PoweredBy (){

    return(
        <>
          <div className='justify-center flex text-gray-400 mt-4'>  
          <span className={`font-serif text-sm`}>powered by {appName}</span>
         </div> 
        </>
    )
}