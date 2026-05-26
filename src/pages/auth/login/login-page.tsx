import { LoginForm } from "./components/login-form"

const LoginPage = () =>
{
    return (
        <>
            {/* Custom CSS for animations */ }
            <style dangerouslySetInnerHTML={ {
                __html: `
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .animate-fadeInUp {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }

                    .animation-delay-200 {
                        animation-delay: 0.2s;
                        opacity: 0;
                    }

                    .animation-delay-400 {
                        animation-delay: 0.4s;
                        opacity: 0;
                    }
                `
            } } />

            <div className="min-h-screen relative overflow-hidden">
                {/* Animated background gradient using primary colors */ }
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20" />

                {/* Floating geometric shapes for visual interest using primary colors */ }
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/15 to-primary/25 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full blur-3xl animate-pulse delay-500" />
                </div>

                {/* Subtle grid pattern overlay */ }
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={ {
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    } }
                />

                {/* Main content */ }
                <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-6xl">
                        {/* Welcome header */ }
                        <div className="text-center mb-12 animate-fadeInUp">
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/30 via-primary/60 to-primary rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h1 className="text-4xl font-bold text-foreground">
                                    Cold Chain Management System
                                </h1>
                            </div>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                                Hệ thống quản lý vận chuyển hiện đại và thông minh cho doanh nghiệp
                            </p>
                        </div>

                        {/* Login form with animation */ }
                        <div className="animate-fadeInUp animation-delay-200">
                            <LoginForm />
                        </div>

                        {/* Footer info */ }
                        <div className="text-center mt-12 animate-fadeInUp animation-delay-400">
                            <p className="text-sm text-muted-foreground">
                                © 2025 Cold Chain Management System. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage