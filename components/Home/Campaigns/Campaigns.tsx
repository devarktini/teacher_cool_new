'use client'
import HomeApiService from '@/services/homeApi';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

function Campaigns() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState([])

    const getCampaign = async () => {
        try {
            const res = await HomeApiService.fetchCampaignsHom();
            // console.log("df", res?.data)
            setCampaigns(res?.data)
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        getCampaign();
    }, [])

    const handleClick = (route: string) => {

        // navigate(`/programs/${route}/${slug}`);
        router.push(`/programs/${route}`);
    };

    return (
        <>
            <div className="bg-gray-100 py-12 px-2 lg:px-16">
                <div

                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-gray-800">
                        Learn at your own pace, anytime, anywhere!
                    </h2>
                    <p className="text-gray-600 mt-2 text-lg">
                        Once you enroll, the course is yours forever.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer px-1 py-10 bg-gray-50 ">
                    {campaigns?.map((offer: any, index: number) => (

                        <div
                            key={index}
                            className="bg-white p-5 rounded-2xl shadow-md border border-transparent hover:border-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-300 hover:shadow-2xl"

                            onClick={() => handleClick(offer.route)}
                        >
                            <div className="overflow-hidden rounded-xl mb-4">
                                <img
                                    src={offer.banner}
                                    alt={offer.title}
                                    className="w-full h-48 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            <h3 className={`text-xl font-bold mb-1 line-clamp-2 ${offer.color}`}>
                                {offer.title}
                            </h3>

                            <p className="text-sm text-gray-500 font-medium mb-1 line-clamp-2">
                                {offer.supporting_headline}
                            </p>

                            <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                                {offer.description}
                            </p>

                            <p className="text-xs text-right text-gray-400 italic">
                                Last updated: {new Date(offer.updated_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>


            </div>


            {/* <button className='border-2 border-blue-500' onClick={handleTestPopup}>test global popup</button> */}

        </>
    )
}

export default Campaigns
