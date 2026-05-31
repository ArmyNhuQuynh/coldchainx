import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input, PasswordInput } from "@/components/ui/input"
// import { useSignalRContext } from "@/context/signalr-provider"
import { handleApiError } from "@/lib/error"
import { cn } from "@/lib/utils"
import { setUser } from "@/redux/User/user-slice"
import { jwtDecode } from "jwt-decode"
import { useMemo, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleSchema } from "@/schemas/role.schema"
import { useAuth } from "@/hooks/use-auth"
import { LoginRequestSchema, type TLoginRequest } from "@/schemas/auth.schema"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { loginMutation } = useAuth();
  // const { connect } = useSignalRContext();
  const dispatch = useDispatch();

  const form = useForm<TLoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: TLoginRequest) => {
    if (loginMutation.isPending) return;
    try {
      const result = await loginMutation.mutateAsync(data);
      console.log(result);
    } catch (error) {

    }
    // try {
    //   const result = await loginMutation.mutateAsync(data);
    //   const accessToken = result.data.data.accessToken;
    //   const role = (jwtDecode(accessToken) as any).role;
    //   //console.log( "Decoded role:", role );
    //   if (RoleSchema.safeParse(role).error) {
    //     throw {
    //       response: {
    //         status: 403,
    //         data: {
    //           status: 403,
    //           message: "Tài khoản không có quyền truy cập.",
    //           data: "Bạn không có quyền truy cập vào tài nguyên này.",
    //         },
    //       },
    //     };
    //   }
    //   // await connect( accessToken );
    //   dispatch(setUser(result.data.data));
    // } catch (error) {
    //   handleApiError(error);
    // }
  };

  const RandomIllustration = useMemo(() => {
    // const illustrations = [
    //   LoginFormIllustration1,
    //   LoginFormIllustration2,
    //   LoginFormIllustration3,
    //   LoginFormIllustration4,
    // ];
    // const randomIndex = Math.floor( Math.random() * illustrations.length );
    // return illustrations[ randomIndex ];
  }, []);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to center the login form when component mounts
    const scrollToCenter = () => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    };

    // Small delay to ensure the component is fully rendered
    const timer = setTimeout(scrollToCenter, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full" ref={formRef}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="overflow-hidden rounded-2xl bg-card shadow-2xl border border-border">
          <div className="grid p-0 md:grid-cols-2">
            {/* Left side - Form */}
            <div className="relative">
              {/* Background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />

              {/* Form content */}
              <div className="relative z-10">
                <Form {...form}>
                  <form className="p-8 md:p-12 space-y-8" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    {/* Header section with improved styling */}
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/30 via-primary/60 to-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h1 className="text-3xl font-bold text-foreground">
                        Chào mừng trở lại
                      </h1>
                      <p className="text-muted-foreground text-sm">
                        Đăng nhập để truy cập hệ thống quản lý Cold Chain của bạn
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Username/Email field with enhanced styling */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-semibold text-foreground">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Nhập email hoặc tên đăng nhập"
                                disabled={loginMutation.isPending}
                                className="h-12 px-4 border-2 rounded-xl transition-all duration-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* Password field with enhanced styling */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-semibold text-foreground">
                              Mật khẩu
                            </FormLabel>
                            <FormControl>
                              <PasswordInput
                                placeholder="Nhập mật khẩu"
                                disabled={loginMutation.isPending}
                                className="h-12 px-4 border-2 rounded-xl transition-all duration-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* Enhanced submit button */}
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-primary/40 via-primary/80 to-primary hover:from-primary/40 hover:via-primary/80 hover:to-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                        disabled={loginMutation.isPending}
                        size="lg"
                      >
                        <div className="flex items-center justify-center gap-2">
                          {loginMutation.isPending && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                        </div>
                      </Button>
                    </div>

                    {/* Additional info section */}
                    <div className="text-center pt-4">
                      <p className="text-xs text-muted-foreground">
                        Bằng cách đăng nhập, bạn đồng ý với{" "}
                        <span className="text-primary hover:text-primary/80 cursor-pointer">
                          điều khoản sử dụng
                        </span>{" "}
                        của chúng tôi
                      </p>
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            {/* Right side - Illustration with enhanced styling */}
            <div className="relative bg-gradient-to-br from-primary/30 via-primary/60 to-primary hidden md:flex items-center justify-center p-8 md:p-12">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />

              {/* Main illustration */}
              <div className="relative z-10 text-center">
                {/* <RandomIllustration className="w-80 h-80 mx-auto drop-shadow-2xl" /> */}
                <div className="mt-8 text-primary-foreground">
                  <h2 className="text-2xl font-bold mb-2">ColdchainX Management</h2>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">
                    Hệ thống quản lý hiện đại, dễ sử dụng và hiệu quả cho doanh nghiệp của bạn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}