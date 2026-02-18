'use client';

import React, { useEffect, useState } from 'react';
import StudentApiService from '@/services/studentApi';
import { useRouter } from 'next/navigation';
import { FiEye, FiLock } from 'react-icons/fi';
interface PromptLibrary {
    id: string;
    title: string;
    description: string;
    prompt_count: number;
    slug: string;
}

export default function Page() {
    const router = useRouter();
    const [prompts, setPrompts] = useState<PromptLibrary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        StudentApiService.promptLibraries()
            .then((res: any) => setPrompts(res?.results ?? []))
            .catch((err: any) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handlePush = (slug: any) => {
        // router.push(`prompt-libraries/${slug}`)
        router.push(`/dashboard/student/prompt-libraries/${slug}/`)
    }
    return (
        <section className="py-12 bg-gray-50">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Prompt Libraries
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Explore curated prompt collections to accelerate your work.
                        </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
                        Total: {prompts.length}
                    </span>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-500 text-sm">
                        Loading prompt libraries…
                    </div>
                ) : prompts.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No prompt libraries available yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {prompts.map((item) => (
                            <article
                                key={item.id}
                                className="group flex h-full flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                            >
                                <header className="mb-3">
                                    <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                                        {item.title}
                                    </h3>
                                </header>

                                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                                    {item.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-2">
                                    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Collection
                                    </span>
                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                        onClick={() => handlePush(item.slug)}
                                    >
                                       <FiEye/>
                                    </button>
                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                        // onClick={() => handlePush(item.slug)}
                                    >
                                        {item.prompt_count} prompts
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
