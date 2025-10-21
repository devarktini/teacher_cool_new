import React from 'react'

function CareerDiscovery() {
    return (
        <>
            <div className="bg-white rounded-lg shadow-lg lg:p-12 p-6 md:h-[500px] h-auto md:flex md:flex-row-reverse flex-col lg:gap-12 gap-6 mx-4 ">
                <div className="md:w-1/2 w-full md:order-first order-last">
                    <img src="https://img.freepik.com/premium-vector/illustration-people-working-together_23-2148826182.jpg?w=1060" className="w-full md:h-[400px] h-[200px] object-cover rounded-lg" alt="image" />
                </div>
                <div className="md:w-1/2 w-full md:order-last order-first">
                    <h1 className="font-bold text-3xl xl:text-4xl mb-6 md:mb-8 leading-tight text-blue-900">
                        Get your kids ready for occupations that are in demand
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 md:mb-12 leading-relaxed text-gray-700">
                        With professional certificates from top international firms and in-demand skill training, you can prepare your graduates for entry-level employment.
                    </p>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded w-full md:w-auto">
                            Contact Us
                        </button>
                        <button className="bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-bold py-2 px-6 rounded w-full md:w-auto">
                            Compare Plans
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-blue-100 h-[400px] flex items-center mt-5  mb-6 mx-4 md:rounded-lg md:shadow-lg">
                <div className="pl-9 md:pl-12">
                    <h1 className="text-3xl font-bold mb-6">The Playbook for Professional Certifications.</h1>
                    <p className="text-lg mb-12">
                        Find out how colleges are enhancing student employment outcomes by utilizing industry micro-credentials.
                    </p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Read now →
                    </button>
                </div>
            </div>
        </>
    )
}

export default CareerDiscovery
