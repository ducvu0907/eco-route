import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, Phone, UserPlus, Users } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";
import { Role } from "@/types/types";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/hooks/useAuthContext";

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  phone: z.string().min(1, "Phone is required"),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Role is required" }),
  }),
  fcmToken: z.string().nullable(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { fcmToken } = useAuthContext();
  const navigate = useNavigate();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
      role: undefined,
      fcmToken: fcmToken,
    },
  });

  const { mutate: registerUser, isPending } = useRegister();

  const onSubmit = (data: RegisterForm) => {
    registerUser(data);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Create account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your information to get started
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

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          placeholder="Enter your phone number" 
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Role</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value?.toString()}
                        >
                          <SelectTrigger className="pl-10 h-11 border-slate-200 focus:border-primary transition-colors">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Role.CUSTOMER}>Customer</SelectItem>
                            <SelectItem value={Role.DRIVER}>Driver</SelectItem>
                            <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 transition-colors font-medium" 
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Create account
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                Sign in here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};