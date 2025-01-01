import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ComingSoon from "../ComingSoon";
import { faBook } from "@fortawesome/free-solid-svg-icons";

export default function Blog(){
    return(
        <>
          <div>
            <ComingSoon title="Blog" icon={ <FontAwesomeIcon icon={faBook} className="text-4xl text-yellow-500"/> } />
          </div>
        </>
    )
}