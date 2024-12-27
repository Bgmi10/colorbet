import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loader (){
    return(
        <>
           <div className="text-yellow-500 text-2xl h-screen items-center flex">
              <FontAwesomeIcon icon={faSpinner} spin /> Loading...
          </div>
        </>
    )
}