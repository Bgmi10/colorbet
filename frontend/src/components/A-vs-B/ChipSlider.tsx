import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { chips } from "../../utils/constants"

export default function ChipSlider({ setAmount, balance }: { setAmount: (value: number) => void, balance: number }) {
  const [showAll, setShowAll] = useState(false)
  const [selectedChip, setSelectedChip] = useState<number | null>(null)

  const visibleChips = showAll ? chips : chips.slice(0, -3)

  const handleChipClick = (value: number) => {
    setSelectedChip(value)
    setAmount(value)
  }
  
  const roundedBalance = Math.round(balance);

  return (
    <motion.div 
      className='relative'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex gap-2 justify-center mt-4 items-center'>
        <AnimatePresence>
          {visibleChips.map((chip) => (
            <motion.div
              key={chip.id}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
             <button  onClick={() => handleChipClick(chip.value)} disabled={roundedBalance < chip.value}>
              <motion.img
                src={chip.url}
                alt={`${chip.value} chips`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1.0 }}
                className={ `w-[44px] ${ roundedBalance < chip.value ? "opacity-30 cursor-not-allowed" : "opacity-100 cursor-pointer"} ${selectedChip === chip.value}`}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button
          onClick={() => setShowAll(!showAll)}
          className="ml-2 p-2 mt-[-7px] dark:bg-gray-700 dark:border-none border border-gray-300 rounded-full dark:hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showAll ? (
            <ChevronLeft className="w-5 h-5 dark:text-white text-gray-700" />
          ) : (
            <ChevronRight className="w-5 h-5  dark:text-white text-gray-700" />
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

