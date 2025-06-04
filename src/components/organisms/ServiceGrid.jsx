import { ServiceCard } from "../molecules/ServiceCard";

export const ServiceGrid = ({ services }) => {
  return (
    <div className="flex flex-wrap gap-5 p-4 bg-white rounded-md shadow-md">
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          title={service.title}
          route={service.route}
          IconComponent={service.Icon}
        />
      ))}
    </div>
  );
};