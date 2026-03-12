import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import {
  FileText,
  CheckCircle2,
  PenTool,
  Shield,
  AlertCircle,
  ChevronLeft,
  Loader2,
  Building2,
  GraduationCap,
  Euro,
  Calendar,
  Check,
  X
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ContractSign = () => {
  const { enrollmentId } = useParams();
  const { user, token } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchContract();
  }, [user, token, enrollmentId]);

  const fetchContract = async () => {
    try {
      const response = await fetch(`${API}/contract/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setContract(data);
      } else {
        toast.error(lang === "pt" ? "Contrato não encontrado" : "Contract not found");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
      toast.error(lang === "pt" ? "Erro ao carregar contrato" : "Error loading contract");
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!agreed) {
      toast.error(lang === "pt" ? "Você precisa aceitar os termos" : "You must accept the terms");
      return;
    }

    setSigning(true);
    try {
      const response = await fetch(`${API}/contract/${enrollmentId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          signature_type: signatureData ? "drawn" : "checkbox",
          signature_data: signatureData,
          agreed_terms: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(lang === "pt" ? "Contrato assinado com sucesso!" : "Contract signed successfully!");
        
        // Navigate to payment or passport based on next step
        if (data.next_step === "payment") {
          navigate(`/payment/${enrollmentId}`);
        } else {
          navigate("/passport");
        }
      } else {
        const error = await response.json();
        toast.error(error.detail || "Erro ao assinar");
      }
    } catch (error) {
      console.error("Error signing contract:", error);
      toast.error(lang === "pt" ? "Erro ao assinar contrato" : "Error signing contract");
    } finally {
      setSigning(false);
    }
  };

  // Canvas drawing functions for signature
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#1e3a5f";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }
  };

  useEffect(() => {
    if (showSignature && canvasRef.current) {
      initCanvas();
    }
  }, [showSignature]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!contract) {
    return null;
  }

  const isSigned = contract.status === "signed";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-4"
            data-testid="back-btn"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {lang === "pt" ? "Voltar" : "Back"}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-slate-800">
                {lang === "pt" ? "Contrato de Matrícula" : "Enrollment Contract"}
              </h1>
              <p className="text-slate-500">
                {isSigned 
                  ? (lang === "pt" ? "Contrato assinado" : "Contract signed")
                  : (lang === "pt" ? "Leia e assine digitalmente" : "Read and sign digitally")}
              </p>
            </div>
          </div>
        </div>

        {/* Contract Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">{lang === "pt" ? "Escola" : "School"}</p>
                  <p className="font-semibold text-slate-800">{contract.school_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">{lang === "pt" ? "Curso" : "Course"}</p>
                  <p className="font-semibold text-slate-800">{contract.course_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Euro className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">{lang === "pt" ? "Valor Total" : "Total"}</p>
                  <p className="font-semibold text-slate-800">€{contract.course_price?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Split Info */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100 mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800 font-medium">
                  {lang === "pt" ? "Distribuição do Pagamento" : "Payment Distribution"}
                </span>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-xs text-emerald-600">STUFF (20%)</p>
                  <p className="font-bold text-emerald-800">€{contract.platform_fee?.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-emerald-600">{lang === "pt" ? "Escola" : "School"} (80%)</p>
                  <p className="font-bold text-emerald-800">€{contract.school_amount?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Text */}
        <Card className="bg-white border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">
              {lang === "pt" ? "Termos do Contrato" : "Contract Terms"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="bg-slate-50 rounded-xl p-6 max-h-96 overflow-y-auto font-mono text-sm text-slate-700 whitespace-pre-wrap"
              data-testid="contract-text"
            >
              {contract.contract_text}
            </div>
          </CardContent>
        </Card>

        {/* Signature Section */}
        {!isSigned ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                <PenTool className="w-5 h-5 text-emerald-600" />
                {lang === "pt" ? "Assinatura Digital" : "Digital Signature"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Agreement Checkbox */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div 
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      agreed 
                        ? "bg-emerald-600 border-emerald-600" 
                        : "border-slate-300 group-hover:border-emerald-400"
                    }`}
                    onClick={() => setAgreed(!agreed)}
                    data-testid="agree-checkbox"
                  >
                    {agreed && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-slate-700">
                    {lang === "pt" 
                      ? "Li e aceito todos os termos e condições do contrato acima. Entendo que esta assinatura digital tem validade jurídica."
                      : "I have read and accept all terms and conditions of the contract above. I understand that this digital signature is legally binding."}
                  </span>
                </label>
              </div>

              {/* Optional: Draw Signature */}
              <div className="mb-6">
                <button
                  onClick={() => setShowSignature(!showSignature)}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-2"
                >
                  <PenTool className="w-4 h-4" />
                  {showSignature 
                    ? (lang === "pt" ? "Ocultar área de assinatura" : "Hide signature area")
                    : (lang === "pt" ? "Desenhar assinatura (opcional)" : "Draw signature (optional)")}
                </button>
                
                {showSignature && (
                  <div className="mt-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-2 bg-white">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={150}
                        className="w-full cursor-crosshair bg-slate-50 rounded-lg touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        data-testid="signature-canvas"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={clearSignature}
                        className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        {lang === "pt" ? "Limpar" : "Clear"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sign Button */}
              <Button
                onClick={handleSign}
                disabled={!agreed || signing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg rounded-xl"
                data-testid="sign-contract-btn"
              >
                {signing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {lang === "pt" ? "Assinando..." : "Signing..."}
                  </>
                ) : (
                  <>
                    <PenTool className="w-5 h-5 mr-2" />
                    {lang === "pt" ? "Assinar Contrato" : "Sign Contract"}
                  </>
                )}
              </Button>

              {/* Security Note */}
              <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                <Shield className="w-4 h-4 mt-0.5 text-emerald-500" />
                <span>
                  {lang === "pt"
                    ? "Sua assinatura será registrada com data, hora e IP para validade jurídica. Integração com DocuSign/HelloSign disponível para maior segurança."
                    : "Your signature will be recorded with date, time and IP for legal validity. DocuSign/HelloSign integration available for enhanced security."}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Already Signed */
          <Card className="bg-emerald-50 border-emerald-100">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800">
                    {lang === "pt" ? "Contrato Assinado" : "Contract Signed"}
                  </h3>
                  <p className="text-sm text-emerald-600">
                    {lang === "pt" ? "Assinado em" : "Signed on"} {new Date(contract.signed_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="flex-1"
                >
                  {lang === "pt" ? "Ir para Dashboard" : "Go to Dashboard"}
                </Button>
                <Button
                  onClick={() => navigate("/passport")}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {lang === "pt" ? "Ver Passaporte" : "View Passport"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContractSign;
