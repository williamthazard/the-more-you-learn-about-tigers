import 'react'
import type { IonIconNames } from 'ionicons'

// Type declarations for Ionicons web components with proper type checking
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { name: IonIconNames },
        HTMLElement
      >
    }
  }
}
