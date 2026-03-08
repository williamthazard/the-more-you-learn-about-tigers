// Icon setup for the application
// Uses Ionicons - https://ionic.io/ionicons
import { addIcons } from 'ionicons'
import { chevronBackOutline, chevronForwardOutline, play, pause } from 'ionicons/icons'

export const setupIcons = () => {
  addIcons({
    'chevron-back-outline': chevronBackOutline,
    'chevron-forward-outline': chevronForwardOutline,
    'play': play,
    'pause': pause,
  })
}
