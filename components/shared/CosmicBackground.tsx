import React, { useEffect, useRef } from 'react';

const CosmicBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let stars: { x: number; y: number; radius: number; alpha: number; speed: number }[] = [];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };

        const initStars = () => {
            stars = [];
            const starCount = Math.floor((width * height) / 2500); // Responsive density
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random(),
                    speed: Math.random() * 0.05 + 0.01,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(1, '#0f0f12');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();

                // twinkle
                star.alpha += (Math.random() - 0.5) * 0.02;
                if (star.alpha < 0.1) star.alpha = 0.1;
                if (star.alpha > 0.8) star.alpha = 0.8;

                // subtle movement
                star.y -= star.speed;
                if (star.y < 0) star.y = height;
            });

            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none w-full h-full"
        />
    );
};

export default CosmicBackground;
