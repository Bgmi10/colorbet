import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ComingSoon from "../ComingSoon";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

export default function Aviator(){
    return(
        <>
          <div>
            <ComingSoon title="Aviator" icon={ <FontAwesomeIcon icon={faRocket} className="text-4xl text-yellow-500" /> } />
          </div>
        </>
    )
}