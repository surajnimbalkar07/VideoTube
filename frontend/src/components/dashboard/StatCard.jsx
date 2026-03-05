import { motion } from "framer-motion"

const StatCard = ({ title, value, icon: Icon, color = "bg-indigo-500" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`glass flex items-center p-6 rounded-xl shadow-lg transition cursor-pointer`}
    >
      {/* Icon */}
      <div
        className={`${color} w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl mr-4 shadow-md`}
      >
        <Icon />
      </div>

      {/* Info */}
      <div>
        <p className="text-sm text-gray-400 uppercase">{title}</p>
        <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
      </div>
    </motion.div>
  )
}

export default StatCard