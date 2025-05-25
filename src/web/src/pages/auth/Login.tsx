import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, LogIn } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  fcmToken: z.string().nullable(),
});

type LoginForm = z.infer<typeof formSchema>;

export default function Login() {
  const { fcmToken } = useAuthContext();
  const form = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      fcmToken: fcmToken,
    },
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginForm) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          placeholder="Enter your username" 
                          className="pl-10 h-11 border-slate-200 focus:border-primary transition-colors" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          className="pl-10 h-11 border-slate-200 focus:border-primary transition-colors" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isPending} 
                className="w-full h-11 bg-primary hover:bg-primary/90 transition-colors font-medium"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                Create one here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};