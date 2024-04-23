import React from 'react'

function NameCard() {
  return (
    <div>
<div className="max-w-xs md:max-w-64 ml-4 bg-teal-700 rounded-xl overflow-hidden shadow-lg">
  {/* <img className="w-full" 
  // src={imageUrl} alt={name}
  /> */}
  <div className="px-6 py-5">
    <div className="font-bold text-xl mb-2 text-white">user</div>
  </div>
</div>
    </div>
  )
}

export default NameCard