import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/ui/radio-group-card";
import { useSession } from "@/hooks/use-session";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { Input } from "@workspace/ui/components/ui/input";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, get } from "@/lib/api";
import { Button } from "@workspace/ui/components/ui/button";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/ui/card";
import { LoadingView } from "@/components/LoadingView";
import { useI18n } from "@/hooks/use-i18n";
import { useNavigate } from "react-router";
import { createOrgSchema } from "@workspace/api/src/routes/organizations/organizations.schema";

const defaultValues: z.infer<typeof createOrgSchema> = {
  name: "",
};

export default function OnboardingPage() {
  const t = useI18n({
    welcome: {
      es: "Bienvenido",
      en: "Welcome",
    },
    welcomeDescription: {
      es: "Registra tu organización para comenzar",
      en: "Register your organization to start",
    },
    registerOrg: {
      es: "Registrar",
      en: "Register",
    },
    selectOrg: {
      es: "Seleccionar",
      en: "Select",
    },
    selectOrgDescription: {
      es: "O selecciona una organización de la que ya eres miembro",
      en: "Or select an organization you are already a member of",
    },
    joinExistingOrg: {
      es: "¿Quieres unirte a una organización existente? Pide a tu administrador que te mande una invitación",
      en: "Do you want to join an existing organization? Ask your administrator to send you an invitation.",
    },
  });
  const { session } = useSession();
  const [orgId, setOrgId] = useState<number | null>(null);
  const navigate = useNavigate();
  const client = useQueryClient();

  const orgForm = useForm<z.infer<typeof createOrgSchema>>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: defaultValues,
  });

  const { mutate: createOrg, isPending } = useMutation({
    mutationFn: async function sendData(
      values: z.infer<typeof createOrgSchema>
    ) {
      await get(api.organizations.$post({ json: values }));
      client.resetQueries();
      navigate("/");
    },
  });

  const submitCreateOrg = orgForm.handleSubmit((values) => createOrg(values));

  const { mutate: selectOrg, isPending: isSelectingPending } = useMutation({
    mutationFn: async (orgId: number) => {
      await get(api.users.org.$put({ json: { orgId } }));
      client.resetQueries();
      navigate("/");
    },
  });

  if (isPending || !session) return <LoadingView />;

  if (session?.user?.orgName) {
    navigate("/");
    return null;
  }

  return (
    <main className="w-full flex flex-col items-center px-4">
      <div className="text-center max-w-sm">
        <CardTitle className="">{t("welcome")}</CardTitle>
        <p className=" text-muted-foreground mb-6">{t("welcomeDescription")}</p>

        <Card>
          <CardContent>
            <Form {...orgForm}>
              <form className="text-start" onSubmit={submitCreateOrg}>
                <FormField
                  control={orgForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isPending} className="w-full">
                  {t("registerOrg")}
                </Button>
              </form>
            </Form>

            {session?.orgs?.length > 0 && (
              <>
                <div className="">
                  <h2 className="text-sm text-muted-foreground">
                    {t("selectOrgDescription")}
                  </h2>
                  <RadioGroup
                    onValueChange={(value) => setOrgId(Number(value))}
                    className="my-4"
                  >
                    {session?.orgs?.map((org) => (
                      <RadioGroupItem
                        key={org.id}
                        value={org.id.toString()}
                        className="w-full rounded-lg border overflow-hidden aspect-auto grid grid-cols-[2rem_1fr] items-center gap-2 p-2"
                      >
                        <Avatar className="rounded-lg h-8 w-8">
                          <AvatarImage src={org.logo || ""} />
                          <AvatarFallback>
                            {org.name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-start">
                          <span>{org.name}</span>
                        </div>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                </div>

                <Button
                  disabled={isSelectingPending || !orgId}
                  className="w-full"
                  variant="secondary"
                  onClick={() => selectOrg(orgId!)}
                >
                  {t("selectOrg")}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-4">{t("joinExistingOrg")}</p>
      </div>
    </main>
  );
}
