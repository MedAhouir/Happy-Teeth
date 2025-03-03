import Image from "next/image";
import { SERVICES } from "@/constants";

const Services = () => {
  return (
    <section className='py-20 px-6 text-lg'>
      <h1 className='font-semibold font-mulish text-6xl lg:text-7xl'>Our Services</h1>
      <div className='flex flex-col md:flex-row lg:flex-row gap-3 justify-between pt-8'>
        {SERVICES.slice(0, 2).map((service, index) => (
          <div
            key={index}
            className={`group relative flex flex-col justify-between text-gray-500 hover:text-white hover:bg-green-500 transition-all duration-500 bg-gray-100 p-10 rounded-3xl lg:w-[650px]`}
          >
            <h3 className='z-10 font-medium text-4xl group-hover:text-black'>{service.category}</h3>
            <ul className="z-10 font-medium mt-10">
                {service.services.map((subService, subIndex) => (
                  <li key={subIndex} className='list-disc list-inside pl-6'>
                    {subService}
                  </li>
                ))}
            </ul>
            <Image src={service.path} alt={service.category} width={250} height={250} className="lg:opacity-100 opacity-50 absolute top-10 right-0 group-hover:-translate-y-7 transition-all duration-500 "/>
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-5'>
        {SERVICES.slice(2).map((service, index) => (
          <div
            key={index}
            className={`flex align-center justify-center text-gray-500 hover:text-black transition-all duration-500 bg-gray-100 p-10 rounded-3xl lg:w-[440px]`}
          >
            <h3 className='font-semibold text-center text-4xl'>{service.category}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
