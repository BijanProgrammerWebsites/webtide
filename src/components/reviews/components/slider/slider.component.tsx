'use client';

import {ComponentProps, ReactElement, useEffect, useRef, useState} from 'react';

import Image from 'next/image';

import clsx from 'clsx';

import reviewsShadow from '@/assets/shadows/reviews.svg';

import ReviewComponent from '../review/review.component';

import styles from './slider.module.scss';

const wrap = (itemsLength: number, index: number): number => {
    if (index < 0) {
        return index + itemsLength;
    }

    if (index >= itemsLength) {
        return index - itemsLength;
    }

    return index;
};

type Review = Omit<ComponentProps<typeof ReviewComponent>, 'className' | 'onClick'>;

type Props = {
    reviews: Review[];
};

export default function SliderComponent({reviews}: Props): ReactElement {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const timeout = useRef<number | undefined>(undefined);

    const duplicatedReviews: Review[] = [...reviews, ...reviews];

    const resetTimeout = (): void => {
        window.clearTimeout(timeout.current);

        timeout.current = window.setTimeout(() => {
            if (activeIndex >= duplicatedReviews.length - 1) {
                setActiveIndex(0);
            } else {
                setActiveIndex((old) => old + 1);
            }
        }, 5000);
    };

    const bulletClickHandler = async (offset: number): Promise<void> => {
        if (offset === 0) {
            return;
        }

        const alternativeOffset = offset + (offset > 0 ? -reviews.length : reviews.length);

        if (Math.abs(offset) <= Math.abs(alternativeOffset)) {
            setActiveIndex((old) => wrap(duplicatedReviews.length, old + offset));
        } else {
            setActiveIndex((old) => wrap(duplicatedReviews.length, old + alternativeOffset));
        }
    };

    const duplicatedReviewClickHandler = async (index: number): Promise<void> => {
        setActiveIndex(index);
    };

    useEffect(() => {
        resetTimeout();

        return (): void => {
            window.clearTimeout(timeout.current);
        };
    }, [activeIndex]);

    return (
        <div className={styles.slider}>
            <Image className={styles.shadow} src={reviewsShadow} alt="" />
            <ol className={styles.bullets}>
                {reviews.map((_, index) => (
                    <li
                        key={index}
                        className={clsx(styles.bullet, index === activeIndex % reviews.length && styles.active)}
                        onClick={() => bulletClickHandler(index - (activeIndex % reviews.length))}
                    ></li>
                ))}
            </ol>
            <ol className={styles.items}>
                {duplicatedReviews.map((review, index) => (
                    <ReviewComponent
                        key={index}
                        {...review}
                        className={clsx(
                            index === wrap(duplicatedReviews.length, activeIndex - 2) && styles['previous-hidden'],
                            index === wrap(duplicatedReviews.length, activeIndex - 1) && styles['previous-visible'],
                            index === wrap(duplicatedReviews.length, activeIndex) && styles.active,
                            index === wrap(duplicatedReviews.length, activeIndex + 1) && styles['next-visible'],
                            index === wrap(duplicatedReviews.length, activeIndex + 2) && styles['next-hidden']
                        )}
                        onClick={() => duplicatedReviewClickHandler(index)}
                    />
                ))}
            </ol>
        </div>
    );
}
