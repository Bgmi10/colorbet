import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';

export default function ImagePreview ({ previewImage, setPreviewImage }: { previewImage: null | string, setPreviewImage: any }){
    return(
        <>
           <AnimatePresence>
              {previewImage && (
                <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                  >
                    <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] rounded-lg" />
                    <button 
                      className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
                      onClick={() => setPreviewImage(null)}
                    >
                      <CloseIcon />
                    </button>
                  </motion.div>
                </motion.div>
              )}
          </AnimatePresence>
        </>
    )
}