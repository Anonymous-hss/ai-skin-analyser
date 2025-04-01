function SkinAnalysis({ analysisData }) {
  if (!analysisData) {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <p className="text-center">No analysis data available</p>
      </div>
    )
  }

  const { overallScore = 75, skinType = "Combination", concerns = [], recommendations = [] } = analysisData

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Detailed Skin Analysis</h3>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-medium">Overall Skin Health</h4>
          <div className="text-2xl font-bold">{overallScore}%</div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${overallScore}%` }}></div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2">Skin Type</h4>
        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{skinType}</div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">Skin Concerns</h4>

        <div className="space-y-4">
          {concerns.map((concern, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h5 className="text-md font-medium">{concern.name}</h5>
                </div>
                <div className="text-md font-semibold">{Math.round(concern.severity * 100)}%</div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.round(concern.severity * 100)}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-600">{concern.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-3">Recommendations</h4>

        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div>
                <h5 className="text-md font-medium">{rec.type}</h5>
                <p className="text-blue-600 font-semibold">{rec.product}</p>
                <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkinAnalysis

