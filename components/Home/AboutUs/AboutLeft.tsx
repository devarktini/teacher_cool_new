import Image from 'next/image'
import React from 'react'
import img1 from '@/public/images/Group7.png'

function AboutLeft() {
  return (
      <>
      <div className="About container  ">
      
        
            <div>
              <Image
                className="min-h-[500px] max-h-[500px] max-sm:w-[280px]"
                src={img1}
                
                alt=""
              />
            </div>
         
      </div>
    </>
  )
}

export default AboutLeft
