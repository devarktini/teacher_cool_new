
import MarkdownViewer from '@/components/Home/PrompLibrary/MarkdownViewer';
import StudentApiService from '@/services/studentApi';
import React from 'react';
import { FiEye, FiLock } from 'react-icons/fi';

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const prompts: any = await StudentApiService.promptLibrariesBySlug(slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">{prompts.title}</h1>
          <p className="text-gray-600">{prompts.description}</p>
        </div>

        {/* Public Content */}
        {prompts.public_content && (
          <div className="bg-white p-8 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-4">
              {/* <FiEye /> */}
              {/* <h2 className="text-xl font-semibold">Public Preview</h2> */}
            </div>
            <MarkdownViewer content={prompts.public_content} />
          </div>
        )}

        {/* Private Content */}
        {prompts.private_content ? (
          <div className="bg-white p-8 rounded-xl shadow mt-8">
            <div className="flex items-center gap-2 mb-4">
              {/* <FiLock /> */}
              {/* <h2 className="text-xl font-semibold">Premium Content</h2> */}
            </div>
            <MarkdownViewer content={prompts.private_content} />
          </div>
        ) : (
          <div className="text-center mt-12 text-gray-500">
            🔒 Premium Content Locked
          </div>
        )}
      </div>
    </div>
  );
}
