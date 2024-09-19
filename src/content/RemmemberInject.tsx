import {
    AnimatePresence,
    useMotionValue,
    useMotionValueEvent,
} from "framer-motion";
import { useState } from "react";
import PopupRemember from "./components/PopupRemember/PopupRemember";
interface RememberInjectProps {
    word: string;
    definition: string;
}
function RememberInject(props: RememberInjectProps) {
    const { word, definition } = props;
    const [show, setShow] = useState(true);
    const x = useMotionValue(0);
    useMotionValueEvent(x, "change", (v) => {
        console.log(v);
        if (v > 200) {
            setShow(false);
        }
        if (v < -200) {
            setShow(false);
        }
    });

    return (
        <AnimatePresence>
            {show && (
                <PopupRemember
                    motionValue={x}
                    word={word}
                    definition={definition}
                />
            )}
        </AnimatePresence>
    );
}

export default RememberInject;
