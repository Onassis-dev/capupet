import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import { Manrope } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "./Header";
import { serverI18n } from "@/lib/i18n-server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Heart,
  MessageCircle,
  ClipboardCheck,
  Gift,
  FileText,
  BarChart3,
} from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== "es" && locale !== "en") {
    redirect("/");
  }

  const t = serverI18n(locale, {
    title: {
      es: "La plataforma #1 para refugios de animales",
      en: "The #1 platform for animal shelters",
    },
    description: {
      es: "Gestiona y publica a todos tus animales sin costo alguno.",
      en: "Manage and publish all your animals without any cost.",
    },
    getStarted: {
      es: "Comienza gratis",
      en: "Get started for free",
    },
    stillHaveQuestions: {
      es: "¿Aún tienes preguntas?",
      en: "Still have questions?",
    },
    cantFindAnswer: {
      es: "¿No encuentras la respuesta que buscas? Habla con nuestro equipo.",
      en: "Can't find the answer you're looking for? Please chat to our friendly team.",
    },
    getInTouch: {
      es: "Contáctanos",
      en: "Get in touch",
    },
    madeInMexico: {
      es: "Hecho en México",
      en: "Made in Mexico",
    },
    signIn: {
      es: "Ingresar",
      en: "Sign in",
    },
    start: {
      es: "Comenzar",
      en: "Get started",
    },
    // Features section
    featuresTitle: {
      es: "Todo lo que necesitas para tu refugio",
      en: "Everything you need for your shelter",
    },
    featuresDescription: {
      es: "Herramientas simples y poderosas para gestionar tu refugio y encontrar hogares para tus animales.",
      en: "Simple yet powerful tools to manage your shelter and find homes for your animals.",
    },
    feature1Title: {
      es: "Gestión de Animales",
      en: "Animal Management",
    },
    feature1Description: {
      es: "Registra y organiza todos tus animales con fotos, historial médico y estado de adopción.",
      en: "Register and organize all your animals with photos, medical history, and adoption status.",
    },
    feature2Title: {
      es: "Solicitudes por WhatsApp",
      en: "WhatsApp Applications",
    },
    feature2Description: {
      es: "Los adoptantes te contactan directo a tu WhatsApp. Sin complicaciones, sin intermediarios.",
      en: "Adopters contact you directly on WhatsApp. No complications, no middlemen.",
    },
    feature3Title: {
      es: "Lista de Tareas",
      en: "Task Management",
    },
    feature3Description: {
      es: "Organiza las actividades diarias de tu refugio con listas de tareas simples y efectivas.",
      en: "Organize your shelter's daily activities with simple and effective task lists.",
    },
    feature4Title: {
      es: "100% Gratis",
      en: "100% Free",
    },
    feature4Description: {
      es: "Sin costos ocultos ni suscripciones. Todas las funciones disponibles sin pagar nada.",
      en: "No hidden costs or subscriptions. All features available without paying anything.",
    },
    feature5Title: {
      es: "Historial Médico",
      en: "Medical Records",
    },
    feature5Description: {
      es: "Lleva un control completo de vacunas, tratamientos y citas veterinarias.",
      en: "Keep complete track of vaccines, treatments, and veterinary appointments.",
    },
    feature6Title: {
      es: "Reportes y Estadísticas",
      en: "Reports & Analytics",
    },
    feature6Description: {
      es: "Visualiza el impacto de tu refugio con métricas y reportes detallados.",
      en: "Visualize your shelter impact with metrics and detailed reports.",
    },
    // How it works section
    howItWorksTitle: {
      es: "Cómo funciona",
      en: "How it works",
    },
    howItWorksDescription: {
      es: "Comienza a gestionar tu refugio en minutos.",
      en: "Start managing your shelter in minutes.",
    },
    step1Title: {
      es: "Crea tu cuenta",
      en: "Create your account",
    },
    step1Description: {
      es: "Regístrate gratis y configura el perfil de tu refugio con tu información básica.",
      en: "Sign up for free and set up your shelter profile with your basic information.",
    },
    step2Title: {
      es: "Agrega tus animales",
      en: "Add your animals",
    },
    step2Description: {
      es: "Sube fotos, información y el estado de cada animal disponible para adopción.",
      en: "Upload photos, information, and the status of each animal available for adoption.",
    },
    step3Title: {
      es: "Recibe solicitudes",
      en: "Receive applications",
    },
    step3Description: {
      es: "Los adoptantes pueden encontrar y solicitar adoptar a tus animales en línea.",
      en: "Adopters can find and apply to adopt your animals online.",
    },
    // FAQ section
    faqTitle: {
      es: "Preguntas frecuentes",
      en: "Frequently asked questions",
    },
    faqDescription: {
      es: "Respuestas a las preguntas más comunes.",
      en: "Answers to the most common questions.",
    },
    faq1Question: {
      es: "¿Capupet es realmente gratis?",
      en: "Is Capupet really free?",
    },
    faq1Answer: {
      es: "Si, capupet es 100% gratis, nuestra mision es ayudar refugios a encontrar hogares para sus animales.",
      en: "Yes, Capupet is 100% free, our mission is to help shelters find homes for their animals.",
    },
    faq2Question: {
      es: "¿Cuántos animales puedo registrar?",
      en: "How many animals can I register?",
    },
    faq2Answer: {
      es: "No hay límite. Puedes registrar todos los animales que tenga tu refugio sin restricciones.",
      en: "There is no limit. You can register all the animals your shelter has without restrictions.",
    },
    faq3Question: {
      es: "¿Cómo me contactan los adoptantes?",
      en: "How do adopters contact me?",
    },
    faq3Answer: {
      es: "Los adoptantes interesados te escriben directamente a tu WhatsApp. Tú decides cuándo y cómo responder.",
      en: "Interested adopters message you directly on WhatsApp. You decide when and how to respond.",
    },
    faq4Question: {
      es: "¿Puedo personalizar el perfil de mi refugio?",
      en: "Can I customize my shelter profile?",
    },
    faq4Answer: {
      es: "Sí, puedes agregar tu logo, fotos, descripción, horarios, ubicación y toda la información relevante de tu refugio.",
      en: "Yes, you can add your logo, photos, description, hours, location, and all relevant information about your shelter.",
    },
    faq5Question: {
      es: "¿Puedo usarlo en mi celular y computadora?",
      en: "Can I use this on my phone and computer?",
    },
    faq5Answer: {
      es: "Sí, Capupet funciona en cualquier dispositivo con navegador. Gestiona tu refugio desde tu celular, tablet o computadora.",
      en: "Yes, Capupet works on any device with a browser. Manage your shelter from your phone, tablet, or computer.",
    },
    // Footer
    footerAbout: {
      es: "Acerca de",
      en: "About",
    },
    footerContact: {
      es: "Contacto",
      en: "Contact",
    },
    footerPrivacy: {
      es: "Privacidad",
      en: "Privacy",
    },
    footerTerms: {
      es: "Términos",
      en: "Terms",
    },
    by: {
      es: "Por",
      en: "By",
    },
  });

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: t("feature1Title"),
      description: t("feature1Description"),
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: t("feature2Title"),
      description: t("feature2Description"),
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: t("feature3Title"),
      description: t("feature3Description"),
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: t("feature4Title"),
      description: t("feature4Description"),
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: t("feature5Title"),
      description: t("feature5Description"),
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t("feature6Title"),
      description: t("feature6Description"),
    },
  ];

  const steps = [
    {
      number: "01",
      title: t("step1Title"),
      description: t("step1Description"),
    },
    {
      number: "02",
      title: t("step2Title"),
      description: t("step2Description"),
    },
    {
      number: "03",
      title: t("step3Title"),
      description: t("step3Description"),
    },
  ];

  const faqs = [
    { question: t("faq1Question"), answer: t("faq1Answer") },
    { question: t("faq2Question"), answer: t("faq2Answer") },
    { question: t("faq3Question"), answer: t("faq3Answer") },
    { question: t("faq4Question"), answer: t("faq4Answer") },
    { question: t("faq5Question"), answer: t("faq5Answer") },
  ];

  return (
    <html>
      <body className={manrope.className}>
        <Header signInText={t("signIn")} startText={t("start")} />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="flex flex-col max-w-5xl mx-auto mt-28 text-center items-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-xl">
              {t("description")}
            </p>
            <Button className="mt-7" size="lg" asChild>
              <Link href="/signup">{t("getStarted")}</Link>
            </Button>

            <img
              src="/hero.png"
              alt="Capupet"
              className="w-full border-8 rounded-3xl mt-16 md:min-h-[500px] object-cover"
            />
          </section>

          {/* Features Section */}
          <section className="flex flex-col max-w-5xl mx-auto mt-28 text-center items-center px-4">
            <h2 className="text-4xl font-bold">{t("featuresTitle")}</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
              {t("featuresDescription")}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-secondary rounded-2xl p-6 text-left"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mt-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="flex flex-col max-w-5xl mx-auto mt-28 text-center items-center px-4">
            <h2 className="text-4xl font-bold">{t("howItWorksTitle")}</h2>
            <p className="text-lg text-muted-foreground mt-3">
              {t("howItWorksDescription")}
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12 w-full">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-6xl font-bold text-primary/20">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold mt-2">{step.title}</h3>
                  <p className="text-muted-foreground mt-2">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="flex flex-col max-w-3xl mx-auto mt-28 text-center items-center px-4">
            <h2 className="text-4xl font-bold">{t("faqTitle")}</h2>
            <p className="text-lg text-muted-foreground mt-3">
              {t("faqDescription")}
            </p>
            <Accordion type="single" collapsible className="mt-12 w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Still Have Questions Section */}
          <section className="flex flex-col max-w-5xl mx-auto mt-28 text-center items-center px-4">
            <div className="bg-secondary rounded-3xl py-16 px-8 w-full flex flex-col items-center">
              <h2 className="text-3xl font-bold">{t("stillHaveQuestions")}</h2>
              <p className="text-muted-foreground mt-2">
                {t("cantFindAnswer")}
              </p>
              <Button className="mt-6" size="lg">
                {t("getInTouch")}
              </Button>
            </div>
          </section>
        </main>

        <footer className="bg-foreground w-full py-10 mt-20 text-background">
          <div className="max-w-5xl w-full mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div>
                <span className="font-semibold text-2xl">Capupet</span>
                <p className="text-background/70 mt-2 max-w-xs">
                  {t("description")}
                </p>
              </div>
              <div className="flex gap-8">
                <Link href="/contact">{t("footerContact")}</Link>
                <Link href="/privacy">{t("footerPrivacy")}</Link>
                <Link href="/terms">{t("footerTerms")}</Link>
              </div>
            </div>
            <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between gap-4">
              <span className="text-background/70">
                {t("by")} <Link href="https://onassis.dev">onassis.dev</Link> @
                2026
              </span>
              <span className="flex items-center gap-2 font-semibold">
                <img src="/icons/mx.svg" className="h-5" alt="Mexico" />
                {t("madeInMexico")}
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
