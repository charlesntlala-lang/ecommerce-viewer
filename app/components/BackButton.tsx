'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="
        mb-4 px-4 py-2 
        bg-gray-200 text-gray-800
        rounded-lg shadow-sm
        transition-all duration-200
        hover:bg-gray-300 hover:scale-105 hover:shadow-md
        active:scale-95
        flex items-center gap-2
      "
    >
      <span className="transition-transform group-hover:-translate-x-1">
        ←
      </span>
      Back
    </button>
  );
}