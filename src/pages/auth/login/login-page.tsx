import { LoginForm } from "./components/login-form";

const LoginPage = () => {
  return (
    <main
      className="relative min-h-[100svh] overflow-hidden bg-[#0b3c73] bg-cover bg-[38%_center] bg-no-repeat md:bg-center"
      style={{
        backgroundImage: "url('/images/coldchain-login-background.png')",
      }}
    >
      <div className="absolute inset-0 bg-[#061d38]/10" />

      <div className="absolute left-[5vw] top-[13vh] z-10 hidden max-w-[520px] lg:block">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_3px_12px_rgba(2,30,62,0.5)] xl:text-5xl">
          ColdchainX Management
        </h1>
        <p className="mt-4 max-w-[500px] text-base leading-7 text-[#eaf6ff] drop-shadow-[0_2px_8px_rgba(2,30,62,0.65)] xl:text-lg">
          Hệ thống quản lý hiện đại, dễ sử dụng và hiệu quả cho doanh nghiệp
          của bạn
        </p>
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center gap-6 px-5 py-8 md:px-12 lg:items-end lg:px-[7vw]">
        <div className="max-w-[440px] text-center text-white lg:hidden">
          <h1 className="text-3xl font-bold drop-shadow-[0_3px_12px_rgba(2,30,62,0.55)]">
            ColdchainX Management
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#eaf6ff] drop-shadow-[0_2px_8px_rgba(2,30,62,0.65)]">
            Hệ thống quản lý hiện đại, dễ sử dụng và hiệu quả cho doanh nghiệp
            của bạn
          </p>
        </div>

        <LoginForm className="w-full max-w-[440px]" />
      </div>

      <p className="absolute bottom-5 left-6 z-10 hidden text-xs text-white/80 drop-shadow-sm md:block">
        © 2026 ColdchainX Management
      </p>
    </main>
  );
};

export default LoginPage;
