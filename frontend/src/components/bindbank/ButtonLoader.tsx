import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ButtonLoader ( { loader, value }: { loader: boolean, value: any} ){
    return(
        <>
            {loader ? <FontAwesomeIcon icon={faSpinner} spin /> : value }
        </>
    )
}