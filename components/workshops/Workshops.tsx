'use client';

import HomeApiService from '@/services/homeApi';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Workshops() {
    const router = useRouter();
    const [workshops, setWorkshops] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const fetchWorkshops = async () => {
        setLoading(true);
        try {
            const res = await HomeApiService.getWorkshop();
            const list = res?.results ?? res?.data ?? (Array.isArray(res) ? res : []);
            setWorkshops(list);
        } catch (err) {
            console.error("Failed to fetch workshops:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const slugify = (name: string) =>
        name.toLowerCase().replace(/\s+/g, "-");


    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-12 px-6">

            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    🚀 Learn. Build. Grow.
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                    Join our exciting <span className="text-cyan-400 font-semibold">workshops</span> designed
                    to help students explore new skills, connect with mentors, and
                    gain real-world experience. Don’t just study—<span className="text-pink-400 font-semibold">create something amazing!</span>
                </p>
            </div>

            {/* Workshop Cards */}
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {workshops.map((card:any, i:number) => (
                        <div
                            key={i}
                            className="relative bg-[#1b0f2a] rounded-2xl p-6 shadow-2xl overflow-hidden 
                                       transform transition hover:-translate-y-2 hover:shadow-cyan-500/20"
                        >
                            {/* Date Badge */}
                            <div className="flex items-center justify-between mb-3">
                            
                                {card?.to_date ? (
                                    <div className='grid lg:grid-cols-2 gap-2'>
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                          Starts From:  <span className="uppercase">{card?.date}</span>
                                        </div>
                                         <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                           To: <span className="uppercase">{card?.to_date}</span>
                                        </div>
                                    </div>
                                ) : (<div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                     Started At: <span className="uppercase">{card?.date}</span>
                                </div>)}
                                <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center">
                                    🎓
                                </div>
                            </div>

                            {/* Title */}
                            <h4 className="text-2xl font-bold mb-2 leading-tight">{card?.name}</h4>

                            {/* Description */}
                            <p className="text-sm text-gray-300 mb-4">
                                {card?.description || "An engaging session filled with knowledge, fun, and hands-on learning."}
                            </p>

                            {/* Button */}
                            <button className="inline-block mt-auto px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium shadow hover:shadow-lg transition"
                                onClick={() => router.push(`/workshops/${slugify(card?.name)}?id=${card?.id}`)}
                            >
                                View Workshop
                            </button>

                            {/* Glow Effect */}
                            <div className="absolute left-4 bottom-4 w-20 h-10 rounded-full bg-white/10 blur-[12px] opacity-20 pointer-events-none" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Workshops;
