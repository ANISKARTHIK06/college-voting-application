import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ endTime, onExpire }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            const nextTime = calculateTimeLeft();
            setTimeLeft(nextTime);
            if (Object.keys(nextTime).length === 0 && onExpire) {
                onExpire();
            }
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) return;
        timerComponents.push(
            <span key={interval} className="flex flex-col items-center">
                <span className="font-bold text-lg">{timeLeft[interval]}</span>
                <span className="text-[10px] uppercase opacity-60">{interval[0]}</span>
            </span>
        );
    });

    return (
        <div className="flex items-center gap-3 bg-glass-bg border border-border px-4 py-2 rounded-xl text-primary font-mono">
            <Clock size={16} className="animate-pulse" />
            <div className="flex gap-3">
                {timerComponents.length ? timerComponents : <span>Election Closed</span>}
            </div>
        </div>
    );
};

export default CountdownTimer;
