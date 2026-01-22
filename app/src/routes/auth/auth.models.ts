import z from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(50),
});

export const RegisterSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(8).max(50),
});

export const DataSchema = z.object({
  username: z.string().min(3).max(30),
  churchName: z.string().min(4).max(40),
});

export const resetPasswordSchema = z.object({
  email: z.email(),
});

export const newPasswordSchema = z
  .object({
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const useResetPasswordSchema = () =>
  useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema as any),
    defaultValues: {
      email: "",
    },
  });

export const useNewPasswordSchema = () =>
  useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema as any),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

export const useLoginSchema = () =>
  useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

export const useRegisterSchema = () =>
  useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema as any),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

export const useDataSchema = () =>
  useForm<z.infer<typeof DataSchema>>({
    resolver: zodResolver(DataSchema as any),
    defaultValues: {
      username: "",
      churchName: "",
    },
  });
