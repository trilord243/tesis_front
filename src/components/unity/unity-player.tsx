"use client";

import { Unity, useUnityContext } from "react-unity-webgl";

interface UnityPlayerProps {
  width?: number;
  height?: number;
}

export function UnityPlayer({
  width = 960,
  height = 600,
}: UnityPlayerProps) {
  // CDN URLs for faster loading (DigitalOcean Spaces CDN - NYC3)
  const CDN_BASE_URL = "https://curriculoms.nyc3.cdn.digitaloceanspaces.com";

  const { unityProvider, loadingProgression, isLoaded, requestFullscreen } = useUnityContext({
    loaderUrl: `${CDN_BASE_URL}/metaverse.loader.js`,
    dataUrl: `${CDN_BASE_URL}/metaverse.data.br`,
    frameworkUrl: `${CDN_BASE_URL}/metaverse.framework.js.br`,
    codeUrl: `${CDN_BASE_URL}/metaverse.wasm.br`,
    streamingAssetsUrl: "/metaverse-assets",
    companyName: "DefaultCompany",
    productName: "CampuUnimetWebLimpio",
    productVersion: "0.1.0",
  });

  const loadingPercentage = Math.round(loadingProgression * 100);

  return (
    <div className="unity-container">
      <div className="relative" style={{ width, height }}>
        <Unity
          unityProvider={unityProvider}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            background: "#231F20",
          }}
          className="block mx-auto"
        />

        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90">
            <div className="text-white text-center">
              <div className="mb-4">
                <svg
                  className="animate-spin h-12 w-12 mx-auto text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-lg font-semibold mb-2">Cargando Unity...</p>
              <div className="w-64 bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${loadingPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2">{loadingPercentage}%</p>
            </div>
          </div>
        )}
      </div>

      {isLoaded && (
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => requestFullscreen(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Pantalla Completa
          </button>
        </div>
      )}
    </div>
  );
}
