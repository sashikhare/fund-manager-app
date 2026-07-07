export const Animation = {
  duration: {
    instant: 120,
    fast: 220,
    normal: 350,
    slow: 550,
  },

  delay: {
    none: 0,
    xs: 80,
    sm: 150,
    md: 250,
    lg: 400,
    xl: 600,
  },

  spring: {
    damping: 16,
    stiffness: 180,
    mass: 0.8,
  },

  scale: {
    button: 0.96,
    card: 0.98,
    fab:0.94,
  },
} as const;