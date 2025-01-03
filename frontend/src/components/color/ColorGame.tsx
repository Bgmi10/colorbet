import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ComingSoon from "../ComingSoon";
import { faGlassCheers } from "@fortawesome/free-solid-svg-icons";

export default function ColorGame (){
    return(
        <>
          <div>
              <ComingSoon title="Color" icon={ <FontAwesomeIcon icon={faGlassCheers} className="text-4xl text-yellow-500"/> } />
          </div>
        </>
    )
}