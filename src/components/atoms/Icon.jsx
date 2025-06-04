export const Icon = ({ IconComponent, size = 40, color = "text-blue-900" }) => {
  return <IconComponent size={size} className={color} />
};