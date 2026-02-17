const StatCard = ({ title, value }) => {
  return (
    <div className="glass p-6 rounded-xl hover:scale-[1.02] transition">
      <h4 className="text-gray-400 text-sm mb-2">{title}</h4>
      <p className="text-3xl font-bold text-indigo-400">
        {value}
      </p>
    </div>
  )
}

export default StatCard
