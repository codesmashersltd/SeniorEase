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

          <div className="space-y-4">
            {/* Primary Direct Download Button */}
            <a 
              href="https://drive.google.com/file/d/1YyhDMbBC0-0nO82zlA-DWHsgf0VVOox-/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <DownloadCloud size={24} />
              Download App
            </a>
          </div>

          {/* Icon Download Section */}
          <div className="mt-12 pt-8 border-t border-gray-100 uppercase tracking-widest text-[10px] text-gray-400 font-bold mb-4">
            Developer Assets
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-6 text-left">
            <h3 className="text-white font-bold mb-2">App Icon (1024x1024)</h3>
            <p className="text-gray-400 text-xs mb-4">Use this for Google Play and App Store submissions.</p>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <HeartHandshake className="text-white" size={32} />
              </div>
              <button 
                onClick={() => {
                  const canvas = document.createElement('canvas');
                  canvas.width = 1024;
                  canvas.height = 1024;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    // Draw Background
                    ctx.fillStyle = '#0d9488';
                    ctx.beginPath();
                    const radius = 200;
                    ctx.roundRect(0, 0, 1024, 1024, [radius]);
                    ctx.fill();
                    
                    // Draw Icon (Hand-drawn-ish heart handshake)
                    ctx.fillStyle = 'white';
                    ctx.font = '600px Lucide'; // Approximation
                    // Since we can't easily draw the lucide icon to canvas without the font
                    // We'll draw a white heart as a fallback
                    ctx.beginPath();
                    ctx.moveTo(512, 800);
                    ctx.bezierCurveTo(512, 800, 100, 550, 100, 350);
                    ctx.arc(306, 350, 206, Math.PI, 0, false);
                    ctx.arc(718, 350, 206, Math.PI, 0, false);
                    ctx.bezierCurveTo(924, 550, 512, 800, 512, 800);
                    ctx.fill();
                    
                    const link = document.createElement('a');
                    link.download = 'seniorease-icon.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  }
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Download Icon PNG
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={16} className="text-teal-600" />
            <span>Secure, private, and ad-free experience</span>
          </div>

        </div>
      </div>
    </div>
  );
}
