import React from 'react';
import { Head } from '@inertiajs/react';

export default function Welcome() {
  return (
    <>
      <Head title="Welcome" />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LaraCore</h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern Laravel 12 + Inertia React + TypeScript starter
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Get Started
            </button>
            <button className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
