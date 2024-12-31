
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function Header ({ title, link }: { title: string, link: string}){
    return(
        <>
          <header className="dark:bg-gray-800 p-4 flex items-center justify-between">
                  <Link to={link} className="text-yellow-500 hover:text-yellow-600 transition-colors">
                      <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
                  </Link>
                  <h1 className="text-xl font-bold text-yellow-500">{title}</h1>
                  <div className="w-6"></div>
          </header>
        </>
    )
}