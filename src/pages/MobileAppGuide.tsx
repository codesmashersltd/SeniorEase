import { DownloadCloud, Smartphone, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function MobileAppGuide() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Banner Section */}
        <div className="bg-teal-600 px-8 pt-10 pb-16 flex flex-col items-center text-center relative overflow-hidden">
          {/* Background Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <div className="bg-white p-4 rounded-full shadow-lg mb-6 relative z-10">
            <HeartHandshake className="text-teal-600" size={56} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 relative z-10">Senior Ease App</h1>
          <p className="text-teal-100 font-medium relative z-10">Your digital companion</p>
        </div>

        {/* Content Section */}
        <div className="px-8 py-8 -mt-8 relative z-20 bg-white rounded-t-3xl text-center">
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Install on your Android Device</h2>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left space-y-4">
              <div className="flex gap-4">
                <div className="bg-teal-100 text-teal-700 h-8 w-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Download the App</h4>
                  <p className="text-sm text-gray-600 mt-1">Tap the button below to download the .apk file.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-teal-100 text-teal-700 h-8 w-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Install it</h4>
                  <p className="text-sm text-gray-600 mt-1">Open the downloaded file and install. Allow "unknown sources" if prompted.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-teal-100 text-teal-700 h-8 w-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Log in</h4>
                  <p className="text-sm text-gray-600 mt-1">Open the app and log in using your <strong className="text-teal-700">Unique ID</strong> and password provided to you.</p>
                </div>
              </div>
            </div>
          </div>

          <a 
            href="https://drive.google.com/file/d/1bjd4Vko01LVx0JWrIqAszY1C0JS3mT2Y/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <DownloadCloud size={24} />
            Download App (.apk)
          </a>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={16} className="text-teal-600" />
            <span>Secure, private, and ad-free experience</span>
          </div>

        </div>
      </div>
    </div>
  );
}
