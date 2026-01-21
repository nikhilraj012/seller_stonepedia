import React from 'react'
import Image from 'next/image'

const Hero = () => {
  return (
    <div className='pt-14 lg:min-h-screen p-6 md:p-10'>
      <div className='max-w-[1728px] mx-auto'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
          {/* Left Content - Text Section */}
          <div className='flex flex-col gap-6 lg:gap-8 xl:gap-12 lg:max-w-[840px] order-1 lg:order-1 pt-5 md:pt-12'>
            {/* Badge */}
            <div className='inline-flex items-center justify-center px-4 py-2 xl:py-4 2xl:px-8 border border-[#871b58] rounded-[73px] w-fit'>
              <p className='text-base xl:text-2xl font-medium'>
                <span className='text-black'>Sell on </span>
                <span className='bg-linear-to-r from-[#871b58] to-[#fbad30] bg-clip-text text-transparent'>
                  Stonepedia. In
                </span>
              </p>
            </div>

            {/* Main Content */}
            <div className='flex flex-col items-start gap-6 lg:gap-7 xl:gap-24 max-sm:max-w-xs max-md:max-w-md max-lg:max-w-xl lg:max-w-xl xl:max-w-3xl'>
              {/* Heading */}
              <div >
                <h1 className='text-xl sm:text-2xl md:text-4xl xl:text-5xl font-semibold text-[#383838] leading-tight lg:leading-12'>
                  <span>Your Global Online Stone </span>
                  <span className='text-[#871b58]'>Sell</span>
                  <span> Partner - </span>
                  <span className='text-[#871b58]'>Boost</span>
                  <span> your business worldwide instantly</span>
                </h1>
              </div>

              {/* CTA Button */}
              <button className='bg-[#1e1e1e] cursor-pointer border border-black text-white xl:w-[200px] xl:h-[60px] rounded-[10px] text-base lg:text-lg xl:text-xl hover:bg-[#2e2e2e] transition-colors'>
                Get in Touch
              </button>
            </div>
          </div>

          {/* Right Content - Image Section */}
          <div className='relative w-full hidden lg:flex-1 order-2 lg:order-2 lg:flex items-center justify-center '>
            <div className='relative w-full md:max-w-[500px] lg:-mt-4 xl:-mt-6 2xl:-mt-8 lg:max-w-[600px] 2xl:max-w-[650px] aspect-718/795'>
              <Image
                src='/images/hero/hero.webp'
                alt='Stone business growth visualization'
                fill
                className='object-contain'
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero