import React from 'react'

const GlobalBuyers = () => {
  return (
    <div className='bg-[#1e1e1e] px-6 pt-6 md:px-10 md:pt-10'>
      <div className='max-w-[1728px] mx-auto flex flex-col gap-16'>
        {/* Top Section */}
        <div className='flex flex-col md:flex-row items-start md:items-center md:justify-between gap-8'>
          {/* Left - Heading */}
          <div className='flex flex-col md:max-w-[696px]'>
            <h2 className='text-2xl md:text-3xl lg:text-[48px] font-semibold text-white leading-tight lg:leading-normal'>
              Register & Unlock Global Buyers
            </h2>
          </div>

          {/* Right - 24x7 Card */}
          <div className='flex flex-col justify-between border-2 border-[#8e8e8e] rounded-[20px] md:rounded-3xl p-4 md:p-5 w-full md:w-sm  h-[120px] md:h-[160px] lg:h-[261px] lg:w-[650px]'>
            <p className='text-[#b4b4b4] text-4xl md:text-6xl lg:text-7xl font-medium'>
              24x7
            </p>
            <p className='text-[#686868] text-2xl md:text-3xl lg:text-5xl font-normal'>
              Online Visibility
            </p>
          </div>
        </div>

        {/* Bottom Section - Large Text */}
        <div className='flex flex-col justify-center w-full'>
          <div className='text-[#393939]'>
            <span className='text-6xl md:text-8xl font-semibold font-outfit'>
              190+
            </span>
            <span className='text-xl md:text-4xl lg:text-[70px] font-medium'>
              Countries Visibility
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalBuyers