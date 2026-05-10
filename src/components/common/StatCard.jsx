import { motion } from "framer-motion";

const StatCard = ({
  name,
  icon: Icon,
  value,
  color,
  onClick,
}) => {
  return (
    <motion.div
      onClick={onClick}
      className="
        bg-[#8499DF]/50
        overflow-hidden
        rounded-xl
        shadow-inner
        cursor-pointer
        transition-all
      "
      style={{
        boxShadow:
          "inset 4px 4px 10px rgba(0, 0, 0, 0.3), inset -6px -6px 10px rgba(255, 255, 255, 0.3)",
      }}
      whileHover={{
        y: -5,
        scale: 1.02,
        boxShadow:
          "0 25px 50px -12px rgba(132, 153, 223, 0.5)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="flex items-center text-sm font-bold text-black">
          <Icon
            size={22}
            className="mr-2"
            style={{ color }}
          />
          {name}
        </span>

        <p className="mt-2 text-5xl font-semibold text-black">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;