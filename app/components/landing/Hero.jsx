import React from 'react'
import Image from 'next/image'

const Hero = () => {
  return (
    <div className='pt-14 lg:min-h-screen px-6 md:px-10'>
      <div className='max-w-[1728px] mx-auto'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12 xl:gap-16'>
          {/* Left Content - Text Section */}
          <div className='flex flex-col gap-6 lg:gap-8 lg:max-w-[840px] order-1 lg:order-1 pt-5 xl:pl-5 2xl:pl-10'>
            {/* Badge */}
            <div className='inline-flex items-center justify-center px-4 py-2 border border-[#871b58] rounded-[73px] w-fit'>
              <p className='text-lg font-medium'>
                <span className='text-black'>Sell on </span>
                <span className='bg-linear-to-r from-[#871b58] to-[#fbad30] bg-clip-text text-transparent'>
                  Stonepedia. In
                </span>
              </p>
            </div>

            {/* Main Content */}
            <div className='flex flex-col items-start gap-6 lg:gap-7 xl:gap-12 2xl:gap-14 max-sm:max-w-xs max-md:max-w-md max-lg:max-w-xl lg:max-w-xl'>
              {/* Heading */}
              <div >
                <h1 className='text-xl sm:text-2xl md:text-4xl font-semibold text-[#383838] leading-tight lg:leading-12'>
                  <span>Your Global Online Stone </span>
                  <span className='text-[#871b58]'>Sell</span>
                  <span> Partner - </span>
                  <span className='text-[#871b58]'>Boost</span>
                  <span> your business worldwide instantly</span>
                </h1>
              </div>

              {/* CTA Button */}
              <button className='bg-[#1e1e1e] border border-black text-white px-4 py-1.5 lg:px-6 lg:py-2 rounded-[10px] text-base lg:text-lg hover:bg-[#2e2e2e] transition-colors'>
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