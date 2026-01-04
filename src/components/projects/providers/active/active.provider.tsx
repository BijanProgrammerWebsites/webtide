'use client';

import {
    createContext,
    Dispatch,
    PropsWithChildren,
    ReactElement,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';

type ContextValue = {
    activeIndex: number;
    setActiveIndex: Dispatch<SetStateAction<number>>;
    goBack: () => void;
    goNext: () => void;
};

export const ActiveContext = createContext<ContextValue>({
    activeIndex: 0,
    setActiveIndex: (): void => {},
    goBack: (): void => {},
    goNext: (): void => {},
});

type Props = PropsWithChildren & {
    itemsCount: number;
};

export default function ActiveProvider({itemsCount, children}: Props): ReactElement {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const timeout = useRef<number | undefined>(undefined);

    const resetTimeout = (): void => {
        window.clearTimeout(timeout.current);

        timeout.current = window.setTimeout(() => {
            goNext();
        }, 5000);
    };

    const goBack = (): void => {
        if (activeIndex <= 0) {
            setActiveIndex(itemsCount - 1);
        } else {
            setActiveIndex((old) => old - 1);
        }
    };

    const goNext = (): void => {
        if (activeIndex >= itemsCount - 1) {
            setActiveIndex(0);
        } else {
            setActiveIndex((old) => old + 1);
        }
    };

    useEffect(() => {
        resetTimeout();

        return (): void => {
            window.clearTimeout(timeout.current);
        };
    }, [activeIndex]);

    return (
        <ActiveContext.Provider value={{activeIndex: activeIndex, setActiveIndex: setActiveIndex, goBack, goNext}}>
            {children}
        </ActiveContext.Provider>
    );
}
