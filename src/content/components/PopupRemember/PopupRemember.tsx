import {
    motion,
    MotionValue,
    useAnimate,
    useAnimationControls,
    useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface PopupRememberProps {
    motionValue: MotionValue<number>;
    word: string;
    definition: string;
}
function PopupRemember(props: PopupRememberProps) {
    const { motionValue: x, word, definition } = props;
    const [scope, animate] = useAnimate();
    const backgroundRef = useRef(null);

    const inputRange = [-150, 0, 150];
    const background = useTransform(x, inputRange, [
        "#399918",
        "#fff",
        "#E64848",
    ]);
    useEffect(() => {
        const makeAnimation = async () => {
            await animate(
                scope.current,
                {
                    height: 100,
                },
                { duration: 0.4 }
            );

            await Promise.all([
                animate(
                    backgroundRef.current,
                    {
                        width: 300,
                        opacity: 1,
                    },
                    {
                        duration: 0.2,
                    }
                ),
                animate(
                    scope.current,
                    {
                        x: -300,
                    },
                    {
                        duration: 0.2,
                    }
                ),
            ]);
        };
        makeAnimation();
    }, []);

    const controls = useAnimationControls();
    const backgroundControls = useAnimationControls();
    const definitionControls = useAnimationControls();

    return (
        <motion.div
            drag="x"
            style={{
                x,
                position: "fixed",
                right: 32,
                bottom: 32,
            }}
            dragConstraints={{
                left: -0,
                right: 0,
            }}
            exit={{
                opacity: 0,
            }}
        >
            <motion.div
                ref={scope}
                initial={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    height: 0,
                    width: 16,
                }}
                animate={controls}
                style={{
                    background: background,
                }}
                exit={{
                    x: 0,
                }}
            />
            <motion.div
                ref={backgroundRef}
                animate={controls}
                style={{
                    background: "#F4F9F4",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                initial={{
                    opacity: 0,
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    height: 100,
                    width: 0,
                }}
                exit={{
                    width: 0,
                }}
            >
                <motion.div
                    animate={backgroundControls}
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 0,
                        opacity: 0,
                        background: "#242424",
                    }}
                />
                <motion.div
                    animate={definitionControls}
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 0,
                        opacity: 0,

                        padding: 16,
                        background: "#F4F9F4",

                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <motion.p
                        style={{
                            color: "#000",
                            fontSize: 20,
                            fontWeight: 600,
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                    >
                        {word}
                    </motion.p>
                    <motion.p
                        style={{
                            color: "#000",
                            fontSize: 16,
                            fontWeight: 400,
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                    >
                        {definition}
                    </motion.p>
                </motion.div>
                <motion.p
                    onClick={async () => {
                        await controls.start({
                            height: 200,
                        });
                        await backgroundControls.start({
                            width: 300,
                            opacity: 1,
                        });
                        definitionControls.start({
                            width: 300,
                            opacity: 1,
                        });
                    }}
                    style={{
                        color: "#000",
                        fontSize: 20,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    {word}
                </motion.p>
            </motion.div>
        </motion.div>
    );
}

export default PopupRemember;
