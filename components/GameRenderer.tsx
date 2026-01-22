"use client"
import React from 'react'
import SpeedSwipeMatch from './games/SpeedSwipeMatch'
import EmojiMemoryBattle from './games/EmojiMemoryBattle'
import AestheticPuzzleDrops from './games/AestheticPuzzleDrops'
import SoundMemoryBeat from './games/SoundMemoryBeat'
import MemeLogicChallenge from './games/MemeLogicChallenge'
import FlashVisualBomb from './games/FlashVisualBomb'
import ChaosRoomChallenge from './games/ChaosRoomChallenge'
import StorySplitChallenge from './games/StorySplitChallenge'
import ColorSwitchReflex from './games/ColorSwitchReflex'
import CategorySprint from './games/CategorySprint'

type GameId = 
  | 'speed-swipe-match'
  | 'emoji-memory-battle'
  | 'aesthetic-puzzle-drops'
  | 'sound-memory-beat'
  | 'meme-logic-challenge'
  | 'flash-visual-bomb'
  | 'chaos-room-challenge'
  | 'story-split-challenge'
  | 'color-switch-reflex'
  | 'category-sprint'

export default function GameRenderer({ gameId }: { gameId: GameId }) {
  switch (gameId) {
    case 'speed-swipe-match':
      return <SpeedSwipeMatch />
    case 'emoji-memory-battle':
      return <EmojiMemoryBattle />
    case 'aesthetic-puzzle-drops':
      return <AestheticPuzzleDrops />
    case 'sound-memory-beat':
      return <SoundMemoryBeat />
    case 'meme-logic-challenge':
      return <MemeLogicChallenge />
    case 'flash-visual-bomb':
      return <FlashVisualBomb />
    case 'chaos-room-challenge':
      return <ChaosRoomChallenge />
    case 'story-split-challenge':
      return <StorySplitChallenge />
    case 'color-switch-reflex':
      return <ColorSwitchReflex />
    case 'category-sprint':
      return <CategorySprint />
    default:
      return <div style={{textAlign: 'center', color: '#9ca3af', padding: '2rem'}}>Game component not found</div>
  }
}
