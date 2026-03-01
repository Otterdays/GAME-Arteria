import React, { useEffect, useState, useRef } from 'react';
import { Text, TextProps } from 'react-native';

interface AnimatedNumberProps extends TextProps {
    value: number;
    duration?: number;
    formatValue?: (val: number) => string;
}

// Ease-out exponential
function easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function AnimatedNumber({
    value,
    duration = 400,
    formatValue = (v) => v.toString(),
    ...rest
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(value);
    const startValue = useRef(value);
    const endValue = useRef(value);
    const startTime = useRef<number | null>(null);
    const frameId = useRef<number | null>(null);

    useEffect(() => {
        if (value === endValue.current) return;

        startValue.current = displayValue;
        endValue.current = value;
        startTime.current = performance.now();

        const step = (now: number) => {
            if (!startTime.current) startTime.current = now;
            const elapsed = now - startTime.current;
            const p = Math.min(elapsed / duration, 1);
            const easing = easeOutExpo(p);

            const current = startValue.current + (endValue.current - startValue.current) * easing;
            setDisplayValue(current);

            if (p < 1) {
                frameId.current = requestAnimationFrame(step);
            } else {
                setDisplayValue(endValue.current);
            }
        };

        if (frameId.current !== null) {
            cancelAnimationFrame(frameId.current);
        }
        frameId.current = requestAnimationFrame(step);

        return () => {
            if (frameId.current !== null) {
                cancelAnimationFrame(frameId.current);
            }
        };
    }, [value, duration, displayValue]);

    return (
        <Text {...rest}>
            {formatValue(Math.round(displayValue))}
        </Text>
    );
}
