export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Tailwind CSS Test</h1>
        
        {/* Basic Styling Test */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Basic Styles Working</h2>
          <p className="text-gray-700">If you can see this styled properly, basic Tailwind is working.</p>
        </div>

        {/* Glass Effect Test */}
        <div className="bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Glass Effect Test</h2>
          <p className="text-gray-800">This should have a glassmorphism effect with backdrop blur.</p>
        </div>

        {/* Gradient Test */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Gradient Test</h2>
          <p className="text-green-100">This should show a green gradient background.</p>
        </div>

        {/* Button Test */}
        <div className="space-x-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors">
            Primary Button
          </button>
          <button className="bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 text-gray-800 px-6 py-3 rounded-2xl font-medium hover:bg-opacity-30 transition-all">
            Glass Button
          </button>
        </div>
      </div>
    </div>
  )
}