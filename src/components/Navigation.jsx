import React from 'react'

const Navigation = () => {
  return (
    <div>
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="public/Logo.svg" alt="Logo" className='h-9 w-15' />
              <h3 className="text-xl font-bold text-white">RANSOM-GUARD</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-7 w-px bg-slate-500"></div>
              <button className="text-slate-400 hover:text-blue-400 transition">
                <img src="public/up2.svg" alt="Logo" className='h-7 w-7' />
              </button>
              <button className="text-slate-400 hover:text-blue-400 transition">
                <img src="public/not.svg" alt="Logo" className='h-5 w-5' />
              </button>
              <button className="text-slate-400 hover:text-blue-400 transition">
                <img src="public/search.svg" alt="Logo" className='h-5 w-5' />
              </button>
              <button className="text-slate-400 hover:text-blue-400 transition">
                <img src="public/Light.svg" alt="Logo" className='h-5 w-5 hover:text-blue-400-500 text-blue-50 font-thin' />
              </button>
              <div className="h-7 w-px bg-slate-500"></div>
              <button className="px-4 py-2 hover:text-blue-500 text-white  transition text-sm font-medium">
                Sign in
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl transition text-sm font-medium">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Navigation
