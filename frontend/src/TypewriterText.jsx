import {useEffect, useState} from "react";

export default function TypewriterText({text}) {
    const [n, setN] = useState(0);


    useEffect(() => {
        setN(0);
        const t = setInterval(() => {
            setN(i => {
                if (i >= text.length) { clearInterval(t); return i; }
                return i + 2;            // characters per tick
            });
        }, 15);                           // ms per tick
        return () => clearInterval(t);
    }, [text]);
    return <>{text.slice(0, n)}</>;
}