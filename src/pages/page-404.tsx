// import HomeIcon from "@/assets/icons/home-icon";
// import PageNotFoundIllustration from "@/assets/illustration/page-not-found-illustration";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleMouseMove = (e: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        });
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative"
            onMouseMove={handleMouseMove}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0">
                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full opacity-20 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                            backgroundColor: 'oklch(0.5705 0.229965 22.2926)',
                        }}
                    />
                ))}

                {/* Floating geometric shapes */}
                <div
                    className="absolute top-20 left-20 w-20 h-20 border-2 opacity-10 animate-spin-slow"
                    style={{ borderColor: 'oklch(0.5705 0.229965 22.2926)' }}
                />
                <div
                    className="absolute bottom-20 right-20 w-16 h-16 opacity-10 rounded-full animate-bounce"
                    style={{
                        background: `linear-gradient(to right, oklch(0.5705 0.229965 22.2926), oklch(0.6705 0.179965 32.2926))`,
                        animationDuration: '3s'
                    }}
                />
                <div
                    className="absolute top-1/3 right-1/4 w-12 h-12 border-2 opacity-10 rotate-45 animate-pulse"
                    style={{ borderColor: 'oklch(0.6705 0.229965 22.2926)' }}
                />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                {/* Main content container with parallax effect */}
                <div
                    className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                    style={{
                        transform: `translateX(${mousePosition.x * 10 - 5}px) translateY(${mousePosition.y * 10 - 5}px)`,
                    }}
                >
                    {/* 404 Number */}
                    <div className="relative mb-8">
                        <h1
                            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text animate-pulse"
                            style={{
                                backgroundImage: `linear-gradient(to right, oklch(0.5705 0.229965 22.2926), oklch(0.6705 0.179965 32.2926), oklch(0.7705 0.129965 42.2926))`
                            }}
                        >
                            404
                        </h1>
                        <div className="absolute inset-0 text-8xl md:text-9xl font-black text-white opacity-5 animate-ping">
                            404
                        </div>
                    </div>

                    {/* Illustration with hover effects */}
                    <div className="mb-8 relative group">
                        <div
                            className="absolute inset-0 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"
                            style={{
                                background: `linear-gradient(to right, oklch(0.5705 0.229965 22.2926), oklch(0.6705 0.179965 32.2926))`
                            }}
                        />
                        <div className="relative transform transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                            {/* <PageNotFoundIllustration
                                className="w-full max-w-md mx-auto drop-shadow-2xl animate-float"
                            /> */}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className={`space-y-4 mb-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Oops! Trang không tồn tại
                        </h2>
                        <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
                            Có vẻ như bạn đã lạc vào một khu vực không tồn tại.
                            Đừng lo lắng, chúng tôi sẽ giúp bạn tìm đường về!
                        </p>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className={ `flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-600 ${ isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }` }>
                        <Button
                            onClick={ handleGoHome }
                            size="lg"
                            className="text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:animate-pulse border-0"
                            style={ {
                                background: `linear-gradient(to right, oklch(0.5705 0.229965 22.2926), oklch(0.6705 0.179965 32.2926))`,
                            } }
                            onMouseEnter={ ( e ) =>
                            {
                                e.currentTarget.style.background = `linear-gradient(to right, oklch(0.4705 0.229965 22.2926), oklch(0.5705 0.179965 32.2926))`;
                            } }
                            onMouseLeave={ ( e ) =>
                            {
                                e.currentTarget.style.background = `linear-gradient(to right, oklch(0.5705 0.229965 22.2926), oklch(0.6705 0.179965 32.2926))`;
                            } }
                        >
                            <HomeIcon className="size-5" />
                            Về trang chủ
                        </Button>
                    </div> */}

                    {/* Fun interactive elements */}
                    <div className="mt-12 text-gray-400 text-sm">
                        <p className="animate-pulse">💡 Tip: Di chuyển chuột để tạo hiệu ứng thú vị!</p>
                    </div>
                </div>

                {/* Glowing orb that follows mouse */}
                <div
                    className="fixed w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none transition-all duration-300 ease-out"
                    style={{
                        left: `${mousePosition.x * 100}%`,
                        top: `${mousePosition.y * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        background: `linear-gradient(to right, oklch(0.5705 0.229965 22.2926), oklch(0.6705 0.179965 32.2926))`,
                    }}
                />
            </div>

            {/* Custom styles */}
            <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default Page404;