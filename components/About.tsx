import Image from 'next/image'
import { RxArrowTopRight } from "react-icons/rx";

const About = () => {
  return (
    <section className='py-20 px-6 font-mulish text-lg'>
        <div className='flex flex-col gap-2 lg:flex-row items-center justify-between'> 
            <div className='flex flex-col gap-4'>
                <h1 className='font-semibold text-6xl'>About</h1>
                <div className='flex flex-col gap-7 w-[600px]  rounded-3xl py-10 px-8 bg-gray-100'> 
                    <h5 className='capitalize text-gray-500 text-xl font-semibold'>Our mission</h5>
                    <h2 className='text-5xl font-semibold'>Help you achieve a <span className='text-green-500'>healthy, confident smile </span> that lasts a lifetime</h2>
                </div>
                <div className='flex flex-row justify-between'>
                    <div className='w-[280px] h-[200px] flex relative flex-col justify-between p-5 bg-gray-100 rounded-3xl'>
                        <div className='w-full relative'>
                            <RxArrowTopRight className='text-7xl absolute right-0'/>
                        </div>
                        <h3 className='font-medium text-3xl'>Skilled Dentists</h3>
                    </div>
                    <div className='w-[280px] h-[200px] flex relative flex-col justify-between p-5 bg-gray-100 rounded-3xl'>
                        <div className='w-full relative'>
                            <RxArrowTopRight className='text-7xl absolute right-0'/>
                        </div>
                        <h3 className='font-medium text-3xl'>Comfortable Environment</h3>
                    </div>
                </div>
            </div>
            <Image src="/lab.jpg" alt="lab" width={600} height={1200} className="rounded-3xl" />
        </div>
    </section>
  )
}

export default About