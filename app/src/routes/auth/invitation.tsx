import { LoadingView } from "@/components/LoadingView";
import { SubmitButton } from "@/components/custom-buttons";
import { useI18n } from "@/hooks/use-i18n";
import { api, get } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/ui/button";
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card.tsx";
import { Link, useNavigate, useParams } from "react-router";

export default function InvitationPage() {
  const t = useI18n({
    joinChurch: {
      es: "Únete a",
      en: "Join",
    },
    alreadyMember: {
      es: "Ya eres miembro de esta iglesia.",
      en: "You are already a member of this church.",
    },
    invitedToJoin: {
      es: "Has sido invitado a unirte a",
      en: "You have been invited to join",
    },
    acceptInvitation: {
      es: "Aceptar invitación",
      en: "Accept invitation",
    },
    goHome: {
      es: "Ir al inicio",
      en: "Go home",
    },
    createAccount: {
      es: "Crear cuenta",
      en: "Create account",
    },
    login: {
      es: "Iniciar sesión",
      en: "Login",
    },
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await get(api.users.invitation.$put({ json: { invitation: id! } }));
      client.resetQueries();
      navigate("/");
    },
  });

  const { data, status } = useQuery({
    queryKey: ["invitations", id],
    queryFn: () => get(api.invitations.$get({ query: { id: id! } })),
  });

  if (status === "pending") return <LoadingView />;
  if (status === "error") return <p>Error</p>;
  if (!data) return <p>No se encontro la invitacion</p>;

  const { organization, logged, alreadyRegistered: isAlreadyMember } = data;

  return (
    <div className="w-full max-w-sm mt-12 sm:mt-32 text-center">
      <CardHeader>
        <CardTitle>
          {t("joinChurch")} {organization}
        </CardTitle>
      </CardHeader>

      <p className="text-sm text-muted-foreground mt-4">
        {isAlreadyMember ? (
          <>{t("alreadyMember")}</>
        ) : (
          <>
            {t("invitedToJoin")} <b>{organization}</b>
          </>
        )}
      </p>

      {logged ? (
        <>
          {isAlreadyMember ? (
            <Button asChild className="mt-6" size="sm">
              <Link to={"/"}>{t("goHome")}</Link>
            </Button>
          ) : (
            <SubmitButton
              className="mt-6"
              size="sm"
              disabled={isPending}
              onClick={() => mutate()}
            >
              {t("acceptInvitation")}
            </SubmitButton>
          )}
        </>
      ) : (
        <div className="flex gap-2 justify-center mt-4">
          <Button size="sm" asChild>
            <Link to={"/signup?redirect=/invitation/" + id}>
              {t("createAccount")}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={"/signin?redirect=/invitation/" + id}>{t("login")}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
