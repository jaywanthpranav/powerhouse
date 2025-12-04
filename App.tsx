import React, { useState, useRef, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import MainMessage from './components/MainMessage';
import CakeCutting from './components/CakeCutting';

// Falling Petals Component
const Petals: React.FC<{ type: 'sakura' | 'tulip' | 'hibiscus' }> = ({ type }) => {
  const [petals, setPetals] = useState<number[]>([]);

  useEffect(() => {
    // Create a stable set of petals
    const newPetals = Array.from({ length: 30 }, (_, i) => i);
    setPetals(newPetals);
  }, []);

  let emoji = '🌸';
  if (type === 'tulip') emoji = '🌷';
  if (type === 'hibiscus') emoji = '🌺';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((i) => {
        // Randomize animation properties
        const left = Math.random() * 100;
        const duration = 6 + Math.random() * 8; // 6s to 14s
        const delay = Math.random() * 5;
        const size = 1 + Math.random(); // 1rem to 2rem

        return (
          <div
            key={i}
            className="absolute top-0 animate-fall opacity-0"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              fontSize: `${size}rem`,
            }}
          >
            {emoji}
          </div>
        );
      })}
    </div>
  );
};

type AppStage = 'start' | 'intro' | 'message' | 'cake';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('start');
  const [petalType, setPetalType] = useState<'sakura' | 'tulip' | 'hibiscus'>('sakura');
  const [whiteOverlay, setWhiteOverlay] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false); // For fading out start screen
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exact function implementation as requested
  const playMusic = () => {
    const audio = document.getElementById("bgMusic") as HTMLAudioElement;
    if (!audio || musicStarted) return;
    
    audio.volume = 0;
    audio.play().then(() => {
        setMusicStarted(true);
        let v = 0;
        let fade = setInterval(() => {
            v += 0.02;
            audio.volume = Math.min(0.5, v);
            if (v >= 0.5) clearInterval(fade);
        }, 120);
    }).catch(() => {
        console.log("User has not interacted yet.");
    });
  };

  const handleStartClick = () => {
    playMusic();
    setIsStarting(true); // Trigger fade out
    
    // Wait for fade out animation (1s) then switch stage
    setTimeout(() => {
        setStage('intro');
    }, 1000);
  };

  const handleGiftOpened = () => {
    playMusic(); // Backup trigger
    // Trigger white fade IN
    setWhiteOverlay(true);

    // After fade is solid (2s), switch to message
    setTimeout(() => {
      setStage('message');
      
      // Fade white OUT
      setTimeout(() => {
        setWhiteOverlay(false);
      }, 500); 
    }, 2000);
  };

  const handleUnlockCake = () => {
      playMusic(); // Backup trigger
      // Direct smooth transition to cake
      setStage('cake');
  };

  const handleCakeServed = () => {
      // Switch to tulip petals as requested in the finale
      setPetalType('tulip');
  };

  return (
    <div className="relative w-full h-screen bg-romantic-bg text-white overflow-hidden font-poppins">
      
      {/* Background Music - Google Drive Link */}
      <audio id="bgMusic" preload="auto" loop>
        <source src="https://drive.google.com/uc?export=download&id=1RhDBZU79Ay96idMwSK4zsQ0KlTpU0UCI" type="audio/mpeg" />
      </audio>

      {/* Falling Petals Background */}
      <Petals type={petalType} />

      <div className="relative z-10 w-full h-full">
        
        {stage === 'start' && (
          <div className={`flex flex-col items-center justify-center h-full transition-opacity duration-1000 ${isStarting ? 'opacity-0' : 'opacity-100'}`}>
              <h1 className="font-playfair text-4xl md:text-5xl text-white/90 mb-12 animate-introFade drop-shadow-[0_0_10px_rgba(255,192,203,0.3)] tracking-wide">
                  Shall we start?
              </h1>
              <button 
                  onClick={handleStartClick}
                  className="px-10 py-4 bg-gradient-to-r from-pink-500/30 to-rose-500/30 border border-white/20 rounded-2xl text-xl font-poppins text-white hover:shadow-[0_0_30px_rgba(255,154,158,0.4)] hover:scale-105 transition-all duration-500 animate-pulse-slow backdrop-blur-sm shadow-xl"
              >
                  Let’s Begin 💗
              </button>
          </div>
        )}

        {stage === 'intro' && (
          <IntroScreen 
            onMusicStart={playMusic} 
            onGiftOpened={handleGiftOpened} 
          />
        )}
        
        {stage === 'message' && (
          <MainMessage onUnlockCake={handleUnlockCake} />
        )}

        {stage === 'cake' && (
          <CakeCutting onCakeServed={handleCakeServed} />
        )}
      </div>

      {/* White Overlay Transition */}
      <div 
        className={`fixed inset-0 bg-white pointer-events-none transition-opacity duration-[2000ms] ease-in-out z-50 ${
          whiteOverlay ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 z-40"></div>
    </div>
  );
};

export default App;