import React from 'react'
import AboutLeft from './AboutLeft'
import AboutRight from './AboutRight'

function Aboutus() {
  return (
        <>
      <div className="container relative px-[7.25rem] max-sm:px-4 mx-auto grid lg:grid-cols-6  sm:grid-cols-1  max-sm:grid-cols-1 gap-10 mt-10 mb-5">
        <div className="col-span-3 sm:order-2 max-sm:order-2 xl:order-1  max-sm:col-span-1 ">
          <AboutLeft />
        </div>

        <div className="col-span-5 max-sm:col-span-1 md:col-span-3 sm:order-1 max-sm:order-1 xl:order-2 ">
          <AboutRight />
        </div>

        
      </div>
    </>
  )
}

export default Aboutus
