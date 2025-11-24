// src/components/AnimatedSection.tsx
'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export function AnimatedSection({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="transition-opacity"
    >
      {children}
    </motion.div>
  )
}