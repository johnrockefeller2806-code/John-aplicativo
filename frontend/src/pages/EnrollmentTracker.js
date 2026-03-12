import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import {
  FileText,
  CreditCard,
  Stamp,
  Mail,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronRight,
  Building2,
  GraduationCap,
  Calendar,
  Euro,
  Clock,
  ExternalLink,
  ChevronLeft,
  RefreshCw
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const EnrollmentTracker = () => {
  const { enrollmentId } = useParams();
  const { user, token, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [contract, setContract] = useState(null);
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, token, enrollmentId, authLoading]);

  const fetchData = async () => {
    try {
      // Fetch enrollment
      const enrollmentRes = await fetch(`${API}/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (enrollmentRes.ok) {
        const enrollmentData = await enrollmentRes.json();
        setEnrollment(enrollmentData);
      }

      // Fetch contract
      const contractRes = await fetch(`${API}/contract/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (contractRes.ok) {
        const contractData = await contractRes.json();
        setContract(contractData);
      }

      // Fetch passport
      const passportRes = await fetch(`${API}/passport/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (passportRes.ok) {
        const passportData = await passportRes.json();
        if (passportData.enrollment_id === enrollmentId) {
          setPassport(passportData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success(lang === "pt" ? "Atualizado!" : "Updated!");
  };

  const steps = [
    {
      id: "contract",
      icon: FileText,
      title: { pt: "Contrato", en: "Contract" },
      description: { 
        pt: "Assinar contrato digital", 
        en: "Sign digital contract" 
      },
      status: contract?.status === "signed" ? "completed" : "pending",
      action: contract?.status !== "signed" ? () => navigate(`/contract/${enrollmentId}`) : null,
      actionLabel: { pt: "Assinar Contrato", en: "Sign Contract" },
      completedAt: contract?.signed_at,
      detail: contract?.status === "signed" 
        ? { pt: `Assinado em ${new Date(contract.signed_at).toLocaleDateString('pt-BR')}`, en: `Signed on ${new Date(contract.signed_at).toLocaleDateString('en-US')}` }
        : { pt: "Aguardando assinatura", en: "Awaiting signature" }
    },
    {
      id: "payment",
      icon: CreditCard,
      title: { pt: "Pagamento", en: "Payment" },
      description: { 
        pt: "Realizar pagamento do curso", 
        en: "Complete course payment" 
      },
      status: enrollment?.status === "paid" ? "completed" : (contract?.status === "signed" ? "current" : "locked"),
      action: enrollment?.status !== "paid" && contract?.status === "signed" ? () => navigate(`/payment/${enrollmentId}`) : null,
      actionLabel: { pt: "Pagar Agora", en: "Pay Now" },
      completedAt: enrollment?.paid_at,
      detail: enrollment?.status === "paid"
        ? { pt: `Pago em ${new Date(enrollment.paid_at).toLocaleDateString('pt-BR')}`, en: `Paid on ${new Date(enrollment.paid_at).toLocaleDateString('en-US')}` }
        : { pt: `€${contract?.course_price?.toLocaleString() || '---'}`, en: `€${contract?.course_price?.toLocaleString() || '---'}` }
    },
    {
      id: "passport",
      icon: Stamp,
      title: { pt: "Passaporte Digital", en: "Digital Passport" },
      description: { 
        pt: "Documento de identificação do estudante", 
        en: "Student identification document" 
      },
      status: passport ? "completed" : (enrollment?.status === "paid" ? "processing" : "locked"),
      action: passport ? () => window.open(`/passport/view/${passport.qr_code_token}`, '_blank') : null,
      actionLabel: { pt: "Ver Passaporte", en: "View Passport" },
      completedAt: passport?.issued_at,
      detail: passport
        ? { pt: `Nº ${passport.enrollment_number}`, en: `Nº ${passport.enrollment_number}` }
        : { pt: "Gerado após pagamento", en: "Generated after payment" }
    },
    {
      id: "letter",
      icon: Mail,
      title: { pt: "Carta da Escola", en: "School Letter" },
      description: { 
        pt: "Carta oficial para solicitação de visto", 
        en: "Official letter for visa application" 
      },
      status: enrollment?.letter_sent ? "completed" : (passport ? "processing" : "locked"),
      action: enrollment?.letter_url ? () => window.open(enrollment.letter_url, '_blank') : null,
      actionLabel: { pt: "Baixar Carta", en: "Download Letter" },
      completedAt: enrollment?.letter_sent_at,
      detail: enrollment?.letter_sent
        ? { pt: "Carta disponível", en: "Letter available" }
        : passport 
          ? { pt: "Em processamento (até 5 dias úteis)", en: "Processing (up to 5 business days)" }
          : { pt: "Disponível após passaporte", en: "Available after passport" }
    }
  ];

  const getStepStyle = (status) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-emerald-500",
          border: "border-emerald-500",
          text: "text-emerald-600",
          line: "bg-emerald-500"
        };
      case "current":
        return {
          bg: "bg-amber-500",
          border: "border-amber-500",
          text: "text-amber-600",
          line: "bg-slate-200"
        };
      case "processing":
        return {
          bg: "bg-blue-500",
          border: "border-blue-500",
          text: "text-blue-600",
          line: "bg-slate-200"
        };
      default:
        return {
          bg: "bg-slate-200",
          border: "border-slate-300",
          text: "text-slate-400",
          line: "bg-slate-200"
        };
    }
  };

  const completedSteps = steps.filter(s => s.status === "completed").length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-4"
            data-testid="back-btn"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {lang === "pt" ? "Voltar ao Dashboard" : "Back to Dashboard"}
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-slate-800 mb-2">
                {lang === "pt" ? "Acompanhamento da Matrícula" : "Enrollment Tracking"}
              </h1>
              <p className="text-slate-500">
                {lang === "pt" ? "Acompanhe o progresso do seu processo" : "Track your enrollment progress"}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="rounded-full"
              data-testid="refresh-btn"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {lang === "pt" ? "Atualizar" : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Course Info Card */}
        <Card className="bg-white border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="font-semibold text-lg text-slate-800">{enrollment?.course_name || contract?.course_name}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {enrollment?.school_name || contract?.school_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {enrollment?.start_date?.substring(0, 10) || contract?.start_date?.substring(0, 10)}
                  </span>
                </div>
              </div>
              {contract && (
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase">{lang === "pt" ? "Valor Total" : "Total"}</p>
                  <p className="text-2xl font-bold text-emerald-600">€{contract.course_price?.toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              {lang === "pt" ? "Progresso" : "Progress"}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {completedSteps}/{steps.length} {lang === "pt" ? "etapas concluídas" : "steps completed"}
            </span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const style = getStepStyle(step.status);
            const isLast = index === steps.length - 1;
            const StepIcon = step.icon;
            
            return (
              <div key={step.id} className="relative" data-testid={`step-${step.id}`}>
                {/* Connector Line */}
                {!isLast && (
                  <div className={`absolute left-7 top-16 w-0.5 h-8 ${
                    step.status === "completed" ? "bg-emerald-500" : "bg-slate-200"
                  }`} />
                )}
                
                <Card className={`border-0 shadow-sm transition-all ${
                  step.status === "current" ? "ring-2 ring-amber-400 ring-offset-2" : ""
                } ${step.status === "locked" ? "opacity-60" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        step.status === "completed" ? "bg-emerald-100" :
                        step.status === "current" ? "bg-amber-100" :
                        step.status === "processing" ? "bg-blue-100" :
                        "bg-slate-100"
                      }`}>
                        {step.status === "completed" ? (
                          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                        ) : step.status === "processing" ? (
                          <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
                        ) : (
                          <StepIcon className={`w-7 h-7 ${
                            step.status === "current" ? "text-amber-600" : "text-slate-400"
                          }`} />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-lg ${
                            step.status === "locked" ? "text-slate-400" : "text-slate-800"
                          }`}>
                            {step.title[lang]}
                          </h3>
                          {step.status === "completed" && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                              {lang === "pt" ? "Concluído" : "Completed"}
                            </span>
                          )}
                          {step.status === "current" && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full animate-pulse">
                              {lang === "pt" ? "Ação Necessária" : "Action Required"}
                            </span>
                          )}
                          {step.status === "processing" && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {lang === "pt" ? "Processando" : "Processing"}
                            </span>
                          )}
                        </div>
                        
                        <p className={`text-sm mb-2 ${
                          step.status === "locked" ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {step.description[lang]}
                        </p>
                        
                        <p className={`text-sm font-medium ${style.text}`}>
                          {step.status === "processing" && <Clock className="w-4 h-4 inline mr-1" />}
                          {step.detail[lang]}
                        </p>
                      </div>
                      
                      {/* Action Button */}
                      {step.action && (
                        <Button
                          onClick={step.action}
                          className={`rounded-full ${
                            step.status === "completed" 
                              ? "bg-emerald-600 hover:bg-emerald-700" 
                              : step.status === "current"
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-blue-600 hover:bg-blue-700"
                          }`}
                          data-testid={`action-${step.id}`}
                        >
                          {step.actionLabel[lang]}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Payment Split Info */}
        {contract && (
          <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-0 mt-8">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Euro className="w-5 h-5" />
                {lang === "pt" ? "Distribuição do Pagamento" : "Payment Distribution"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-slate-300 text-sm mb-1">STUFF Intercâmbio (20%)</p>
                  <p className="text-white text-2xl font-bold">€{contract.platform_fee?.toLocaleString()}</p>
                  <p className="text-slate-400 text-xs mt-1">{lang === "pt" ? "Taxa de serviço" : "Service fee"}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-slate-300 text-sm mb-1">{contract.school_name} (80%)</p>
                  <p className="text-white text-2xl font-bold">€{contract.school_amount?.toLocaleString()}</p>
                  <p className="text-slate-400 text-xs mt-1">{lang === "pt" ? "Valor da escola" : "School amount"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Card */}
        <Card className="bg-emerald-50 border-emerald-100 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-emerald-800">
                  {lang === "pt" ? "Precisa de ajuda?" : "Need help?"}
                </p>
                <p className="text-sm text-emerald-600">
                  {lang === "pt" 
                    ? "Entre em contato conosco pelo chat ou email" 
                    : "Contact us via chat or email"}
                </p>
              </div>
              <Button
                onClick={() => navigate("/duvidas")}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 rounded-full"
              >
                {lang === "pt" ? "Ajuda" : "Help"}
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnrollmentTracker;
