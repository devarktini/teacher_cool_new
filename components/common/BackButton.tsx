// app/[slug]/BackButton.tsx
'use client';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton() {
  const router = useRouter();
  return (
    <div className="hidden lg:flex items-center justify-end mb-8">
      <button
        onClick={() => router.back()}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base transition duration-200 flex items-center gap-2"
      >
        <FiArrowLeft />
        Go Back
      </button>
    </div>
  );
}
