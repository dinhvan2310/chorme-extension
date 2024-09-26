import {
    AnimatePresence,
    useMotionValue,
    useMotionValueEvent,
} from "framer-motion";
import { useEffect, useState } from "react";
import PopupRemember from "./components/PopupRemember/PopupRemember";
interface RememberInjectProps {
    word: string;
    definition: string;

    onRemembered?: () => void;
}
function RememberInject(props: RememberInjectProps) {
    const { word, definition, onRemembered } = props;
    const [show, setShow] = useState(true);
    const [remembered, setRemembered] = useState(false);
    useEffect(() => {
        if (remembered && onRemembered) {
            onRemembered();
        }
    }, [remembered]);
    const x = useMotionValue(0);
    useMotionValueEvent(x, "change", (v) => {
        if (v > 100) {
            setShow(false);
        }
        if (v < -200) {
            setShow(false);
            setRemembered(true);
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
