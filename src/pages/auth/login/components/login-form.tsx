import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { setUser } from "@/redux/User/user-slice";
import {
  LoginRequestSchema,
  type TAuthResponse,
  type TLoginRequest,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LogIn, Snowflake } from "lucide-react";
import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const getAuthResponseData = (responseData: unknown): TAuthResponse | null => {
  const maybeAuthResponse = responseData as TAuthResponse | undefined;

  if (maybeAuthResponse?.accessToken) {
    return maybeAuthResponse;
  }

  const maybeBaseResponse = responseData as
    | { data?: TAuthResponse }
    | undefined;

  return maybeBaseResponse?.data?.accessToken ? maybeBaseResponse.data : null;
};

export function LoginForm({
  className,
  ...props
}: ComponentProps<"section">) {
  const { loginMutation } = useAuth();
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
      const authData = getAuthResponseData(result.data);

      if (!authData) {
        throw new Error("Login response does not include an access token");
      }

      dispatch(setUser(authData));
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <section
      className={cn(
        "rounded-lg border border-white/55 bg-[rgba(237,247,255,0.52)] p-7 shadow-[0_24px_80px_rgba(2,32,71,0.3)] backdrop-blur-2xl sm:p-9",
        className
      )}
      {...props}
    >
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#0d5ca8] text-white shadow-sm">
            <Snowflake className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-[#2878bf]">
              Cold chain operations
            </p>
            <p className="text-sm font-medium text-[#244b70]">
              Management portal
            </p>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#082f57]">Login</h1>
        <p className="mt-3 text-sm leading-6 text-[#496b88]">
          Đăng nhập để truy cập hệ thống quản lý vận hành ColdchainX.
        </p>
      </div>

      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-[#173f64]">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="Nhập email hoặc tên đăng nhập"
                    disabled={loginMutation.isPending}
                    className="h-12 rounded-md border-white/75 bg-[rgba(247,252,255,0.7)] px-4 text-[#0b355b] shadow-sm placeholder:text-[#7898b3] focus-visible:border-[#2476bd] focus-visible:ring-[#2476bd]/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-[#173f64]">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    disabled={loginMutation.isPending}
                    className="h-12 rounded-md border-white/75 bg-[rgba(247,252,255,0.7)] px-4 text-[#0b355b] shadow-sm placeholder:text-[#7898b3] focus-visible:border-[#2476bd] focus-visible:ring-[#2476bd]/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full rounded-md bg-[#0d5ca8] font-semibold text-white shadow-[0_10px_24px_rgba(13,92,168,0.24)] transition-colors hover:bg-[#084a89]"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-7 border-t border-[#d5e5f2] pt-5 text-center text-xs leading-5 text-[#68839a]">
        Bằng cách đăng nhập, bạn đồng ý với điều khoản sử dụng của chúng tôi.
      </p>
    </section>
  );
}
