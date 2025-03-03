import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
    
const Hero = () => {
    
  return (
    <section className='relative py-8 px-6 flex flex-col gap-16 overflow-hidden'>
        
        <h1 className='font-semibold font-mulish text-6xl lg:text-9xl md:text-8xl'>
            Exceptional <br /> <span className='text-green-400'>Dental </span>Care
        </h1>
        
        <div className="lg:w-[500px] text-lg flex flex-col justify-center font-medium lg:items-center gap-6">
            <p className="w-[350px]">
                With our team of experienced dentists and state-of-the-art technology,
                we deliver comprehensive treatments in a comfortable and welcoming environment.
            </p>
            <button
                type="button"
                className="flex items-center justify-center gap-2 text-lg font-semibold rounded-full py-5 px-8 transition-all duration-500 bg-gray-200 text-black hover:bg-black hover:text-white"
            >
                Book Now <FaArrowRight />
            </button>
            <Image src="/hero.jpg" alt="Hero" width={1000} height={1000} className="absolute -z-10 -right-[200px] -top-[40px] lg:-right-48 lg:top-[-140px] md:-right-[200px] md:top-[-240px]" />
        </div>
        <div className="flex flex-col gap-3 lg:flex-row justify-between">
            <div className="flex flex-row items-center gap-2 text-lg">
                <h2 className="font-bold text-5xl">13</h2>
                <p className="capitalize w-[300px] leading-tight">Achieve your dream smile with our range of services</p>
            </div>
            <div className="flex flex-row items-center gap-2 text-lg">
                <h2 className="font-bold text-5xl">852<span className="text text-green-400">+</span></h2>
                <p className="capitalize w-[350px] leading-tight">Transforming Healthcare with Telemedicine Connect, Cosult And Care Remotely</p>
            </div>
        </div>
    </section>
  )
}

export default Hero