import Lottie from "react-lottie";
import spin from "./spinwheel.json"
import { Player } from '@lottiefiles/react-lottie-player';

export default function Looti (){

    const de = {
        animationData: spin,
    }

    return(
          <>
            <Lottie options={de} />
          </>
    )
}