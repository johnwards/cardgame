/**
 * AttackNotification Component - Shows when a CPU attacks the human player
 * Styled in the amusing Exploding Kittens/Oatmeal format with fun messaging
 */

import { useState, useEffect } from 'react';

const AttackNotification = ({
  isVisible,
  attackerName,
  remainingTurns,
  onDismiss
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // No auto-dismiss - user must manually close
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  // Array of amusing attack messages in Exploding Kittens/Oatmeal style
  const attackMessages = [
    `${attackerName} just served you a steaming hot plate of NOPE! 🍽️💥`,
    `SURPRISE! ${attackerName} just slapped you with the ol' double-whammy! 👋💫`,
    `${attackerName} decided you needed more practice... at taking turns! 🎯`,
    `Congratulations! ${attackerName} just gifted you an extra helping of chaos! 🎁💀`,
    `${attackerName} said "Why take one turn when you can take TWO?" 🤷‍♂️⚡`,
    `PLOT TWIST! ${attackerName} just made your life twice as interesting! 📚🌪️`,
    `${attackerName} just uno-reversed your peaceful existence! 🔄😈`,
    `Breaking news: ${attackerName} has bestowed upon you the gift of SUFFERING! 📺💥`
  ];

  const randomMessage = attackMessages[Math.floor(Math.random() * attackMessages.length)];

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm
      transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className={`
        bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 
        rounded-2xl p-8 max-w-md mx-auto text-white shadow-2xl
        border-4 border-white/30 transform transition-all duration-500
        ${isAnimating ? 'scale-100 rotate-0' : 'scale-75 rotate-12'}
      `}>
        {/* Explosive Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 animate-bounce">⚔️💥</div>
          <h2 className="text-3xl font-black mb-2 text-shadow-lg">
            YOU'VE BEEN ATTACKED!
          </h2>
          <div className="text-lg font-bold opacity-90">
            (But like, in a fun card game way)
          </div>
        </div>

        {/* Fun Message */}
        <div className="bg-white/20 rounded-xl p-4 mb-6 border-2 border-white/30">
          <p className="text-lg font-semibold text-center leading-relaxed">
            {randomMessage}
          </p>
        </div>

        {/* Turn Information */}
        <div className="bg-black/30 rounded-xl p-4 mb-6 text-center">
          <div className="text-sm opacity-80 mb-2">THE DAMAGE:</div>
          <div className="text-2xl font-black text-yellow-300">
            🎯 {remainingTurns} TURNS TO TAKE 🎯
          </div>
          <div className="text-sm opacity-80 mt-2">
            (That's {remainingTurns - 1} more than usual, genius!)
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-white/10 rounded-xl p-3 mb-6">
          <div className="text-xs font-bold text-center opacity-90">
            💡 FUN FACT: This means you get to draw more cards and potentially explode more!
            Isn't that EXCITING?! 💀✨
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="
              flex-1 bg-white/90 text-red-600 font-black py-3 px-4 rounded-xl
              hover:bg-white hover:scale-105 transition-all duration-200
              border-2 border-white/50 shadow-lg
            "
          >
            😤 FINE, I'LL TAKE IT!
          </button>
          <button
            onClick={onDismiss}
            className="
              flex-1 bg-black/50 text-white font-black py-3 px-4 rounded-xl
              hover:bg-black/70 hover:scale-105 transition-all duration-200
              border-2 border-white/30 shadow-lg
            "
          >
            😭 THIS IS UNFAIR!
          </button>
        </div>

        {/* Tiny disclaimer */}
        <div className="text-center mt-4">
          <div className="text-xs opacity-60">
            * No actual kittens were harmed in the making of this attack
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackNotification;