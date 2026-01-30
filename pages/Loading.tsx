import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Loading: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [fetchedData, setFetchedData] = useState<any>(null);

  // Derived Status Text based on progress (User Requested Split: ~35% / ~65%)
  let statusText = "Calculando Efemérides...";
  if (progress >= 35 && progress < 100) {
    statusText = "Triangulando Posição Natal...";
  } else if (progress >= 100) {
    statusText = "Sincronia Completa...";
  }

  // 1. Animation Timer (Visual Progress)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        // If data is ready, accelerate!
        let increment = 0.5; // Base speed: slow
        if (fetchedData) increment = 5; // Boost speed if data is ready

        // If we are waiting for data at 80%, hold or crawl very slowly
        if (prev >= 80 && !fetchedData) {
          return Math.min(prev + 0.1, 85); // Crawl to 85 max
        }

        const next = prev + increment;

        if (next >= 100) {
          // Check if we already finished to avoid double-clear
          if (prev < 100) {
            clearInterval(timer);
            // small delay to show 100%
            setTimeout(() => {
              navigate('/dashboard', { state: { preloadedData: fetchedData } });
            }, 1500);
            return 100;
          }
          return 100;
        }
        return next;
      });
    }, 50); // 5s total approx

    return () => clearInterval(timer);
  }, [navigate, fetchedData]);

  // 2. Data Pre-fetch (Real Logic)
  useEffect(() => {
    const userId = localStorage.getItem('celest_user_id') || 'demo';

    async function loadData() {
      try {
        // Extended delay for better perception of "calculation"
        await new Promise(r => setTimeout(r, 2600));

        // Start fetch
        const res = await fetch(`http://localhost:8000/agent/dashboard?user_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setFetchedData(data);
        } else {
          console.error("Fetch failed");
          setFetchedData({});
        }
      } catch (e) {
        console.error(e);
        setFetchedData({});
      }
    }

    loadData();
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#010409] overflow-hidden font-display perspective-1000">
      {/* Background Ambient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full animate-pulse-slow will-change-transform"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg">

        {/* 3D ORBITAL GYROSCOPE */}
        <div className="relative w-80 h-80 mb-12 flex items-center justify-center transform-style-3d will-change-transform">
          {/* Core */}
          <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse z-20"></div>

          {/* Ring 1 - Cyan - Horizontalish */}
          {/* Grandparent: Precession (Slow Orbit Rotation) */}
          <div className="absolute w-full h-full animate-precession-12s">
            {/* Parent: 3D Tilt */}
            <div className="w-full h-full transform-style-3d will-change-transform" style={{ transform: 'rotateX(75deg)' }}>
              {/* Child: Texture Spin (Fast) */}
              <div className="w-full h-full rounded-full border-2 border-cyan-400 border-t-cyan-200 border-b-cyan-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-spin-3s"></div>
            </div>
          </div>

          {/* Ring 2 - Purple - Verticalish 1 */}
          <div className="absolute w-[90%] h-[90%] animate-precession-15s-rev">
            <div className="w-full h-full transform-style-3d will-change-transform" style={{ transform: 'rotateY(60deg) rotateX(45deg)' }}>
              <div className="w-full h-full rounded-full border-2 border-purple-500 border-l-purple-300 border-r-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-spin-4s"></div>
            </div>
          </div>

          {/* Ring 3 - Amber - Verticalish 2 */}
          <div className="absolute w-[110%] h-[110%] animate-precession-18s">
            <div className="w-full h-full transform-style-3d will-change-transform" style={{ transform: 'rotateY(-60deg) rotateX(45deg)' }}>
              <div className="w-full h-full rounded-full border-2 border-amber-400 border-r-amber-200 border-l-amber-600 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-spin-5s"></div>
            </div>
          </div>

          {/* Ring 4 - Outer Slow (Fixed Plane, spinning texture) */}
          <div className="absolute w-[140%] h-[140%] animate-precession-20s">
            <div className="w-full h-full transform-style-3d will-change-transform" style={{ transform: 'rotateZ(45deg)' }}>
              <div className="w-full h-full rounded-[40%] border-[1px] border-white/20 border-t-white/40 animate-spin-15s"></div>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="flex flex-col items-center gap-4 z-20 text-center w-full px-4">
          <h2 className="text-white text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-center whitespace-nowrap min-w-full transition-all duration-300">
            {statusText}
          </h2>

          <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-blue-400 to-purple-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {progress >= 99 ? (
            <span className="text-[10px] text-green-400 font-bold font-sans tracking-[0.2em] uppercase mt-8 border border-green-500/30 px-4 py-2 rounded bg-green-500/10 shadow-[0_0_15px_rgba(74,222,128,0.2)] animate-pulse">
              [ Sincronia Completa ]
            </span>
          ) : (
            <span className="text-[9px] text-white/30 font-mono tracking-widest uppercase">
              CONECTADO: SWISS EPHEMERIS / NASA JPL DATA // {Math.floor(progress)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loading;