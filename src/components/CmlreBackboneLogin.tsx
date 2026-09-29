import { useState } from "react"

interface CmlreBackboneLoginProps {
  onBackToHome: () => void
  onLoginSuccess: (role?: string, email?: string) => void
  onOpenAI?: () => void
}

export default function CmlreBackboneLogin({
  onBackToHome,
  onLoginSuccess,
  onOpenAI,
}: CmlreBackboneLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess("Researcher", "researcher@gmail.com")
    }, 450)
  }

  const handleMicrosoftSignIn = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess("Researcher", "scientist@microsoft.com")
    }, 450)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess("Researcher", email || "user@ncpor.gov.in")
    }, 400)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A] font-sans antialiased selection:bg-[#E0F2FE]">
      {/* ── TOP NAV BAR (#003366 DEEP NAVY INSTITUTIONAL HEADER) ────────────── */}
      <header className="w-full bg-[#003366] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md z-30 flex-shrink-0">
        {/* Left: Ashoka Lion Emblem + NCPOR / MyGov Institutional Branding */}
        <div
          onClick={onBackToHome}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
          title="Return to Home"
        >
          {/* Official Ashoka Lion Capital of India Vector */}
          <div className="w-8 sm:w-10 h-10 sm:h-12 flex flex-col items-center justify-center flex-shrink-0 text-white">
            <svg
              viewBox="0 0 40 48"
              fill="none"
              className="w-7 sm:w-9 h-9 sm:h-11"
            >
              <path
                d="M12 4C12 2.5 13.5 1 16 1C18.5 1 20 2.5 20 4C20 2.5 21.5 1 24 1C26.5 1 28 2.5 28 4C28 6 26.5 8 25 9C27 10 28.5 12 28.5 14.5C28.5 17 26.8 19 24.5 19.8C25.5 20.8 26 22 26 23.5C26 26 24 28 21.5 28.5V31H18.5V28.5C16 28 14 26 14 23.5C14 22 14.5 20.8 15.5 19.8C13.2 19 11.5 17 11.5 14.5C11.5 12 13 10 15 9C13.5 8 12 6 12 4Z"
                fill="#FFFFFF"
              />
              <rect x="8" y="32" width="24" height="4" rx="1" fill="#FFFFFF" />
              <circle cx="20" cy="34" r="1.5" fill="#003366" />
              <path
                d="M10 37C14 36.5 26 36.5 30 37C29 40 25 41 20 41C15 41 11 40 10 37Z"
                fill="#CBD5E1"
              />
              <rect
                x="13"
                y="42"
                width="14"
                height="1.5"
                rx="0.5"
                fill="#FFFFFF"
              />
            </svg>
            <div className="text-[6px] sm:text-[7.5px] font-black tracking-tight text-white/90 -mt-1 uppercase">
              सत्यमेव जयते
            </div>
          </div>

          {/* MyGov Official Bilingual Logo & Institutional NCPOR Identity */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="leading-none border-r border-white/25 pr-2 sm:pr-3">
              <div className="flex items-baseline gap-0.5">
                <span className="font-extrabold text-xl sm:text-2xl text-emerald-400 tracking-tight font-sans">
                  my
                </span>
                <span className="font-black text-xl sm:text-2xl text-white tracking-tight font-sans">
                  GOV
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-sky-200 tracking-tight -mt-0.5 font-sans">
                मेरी सरकार
              </div>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-black text-base sm:text-xl tracking-tight text-white font-sans">
                  ncpor
                </span>
                <span className="text-sky-300 font-black text-base sm:text-xl font-sans">
                  .gov<span className="text-xs text-sky-100">.in</span>
                </span>
              </div>
              <div className="text-[8.5px] sm:text-[10.5px] font-bold text-white leading-none mt-0.5">
                National Centre for Polar and Ocean Research
              </div>
              <div className="text-[7.5px] sm:text-[9px] text-sky-200/90 leading-tight hidden sm:block">
                Ministry of Earth Sciences · Government of India
              </div>
            </div>
          </div>
        </div>

        {/* Right: Back to Home Button */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/95 hover:text-white hover:bg-white/10 px-3.5 py-1.5 rounded-lg transition-all"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            className="w-4 h-4"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Home</span>
        </button>
      </header>

      {/* ── SPLIT MAIN CONTENT ────────────────────────────────────────────── */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden">
        {/* ── LEFT HERO PANEL: UNDERWATER MARINE BIODIVERSITY (PUFFERFISH) ───── */}
        <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-full bg-slate-900 overflow-hidden flex flex-col justify-end p-6 sm:p-12">
          {/* Authentic Marine Life Photo (Pufferfish / Ocean Reef) */}
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=85"
            alt="Marine biodiversity - NCPOR"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
          />

          {/* Deep Ocean Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001D3D]/95 via-[#002855]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001D3D]/50 to-transparent hidden lg:block" />

          {/* Text Overlay at Bottom Left */}
          <div className="relative z-10 max-w-lg space-y-3 animate-in fade-in duration-300">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Welcome to NCPOR Portal
            </h2>
            <p className="text-sm sm:text-base text-slate-100/90 font-normal leading-relaxed drop-shadow-sm">
              Secure access to India&apos;s marine and polar data infrastructure
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-black/40 text-white/95 border border-white/30 backdrop-blur-md shadow-xs">
                Government Platform
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: AUTHENTICATION FORM (THEMED TO PORTAL) ─────────────── */}
        <div className="lg:col-span-6 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-white overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Form Title */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                Sign in to NCPOR Portal
              </h3>
            </div>

            {/* Social Authentication: Google & Microsoft */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Microsoft Button */}
              <button
                type="button"
                onClick={handleMicrosoftSignIn}
                className="flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                <span>Sign in with Microsoft</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative">
                <span className="bg-white px-3 text-xs text-slate-500 font-normal">
                  Or continue with NCPOR Account
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Email (Outlined with floating notch label) */}
              <div className="relative pt-2">
                <label
                  htmlFor="login-email"
                  className="absolute top-0 left-3 bg-white px-1.5 text-xs font-medium text-slate-600 pointer-events-none z-10"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-colors"
                />
              </div>

              {/* Field 2: Password (Outlined with floating notch label) */}
              <div className="relative pt-2">
                <label
                  htmlFor="login-password"
                  className="absolute top-0 left-3 bg-white px-1.5 text-xs font-medium text-slate-600 pointer-events-none z-10"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 px-3.5 pr-10 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between -mt-1">
                {forgotSent ? (
                  <span className="text-xs text-emerald-600 font-medium">
                    Reset instructions sent to your email!
                  </span>
                ) : (
                  <span />
                )}
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    setForgotSent(true)
                  }}
                  className="text-xs text-[#1D4ED8] hover:text-[#1E40AF] font-medium hover:underline transition-colors ml-auto"
                >
                  Forgot your password?
                </a>
              </div>

              {/* Cloudflare Turnstile Verification Box */}
              <div className="border border-slate-300 bg-[#FAFAFA] rounded-xl p-3 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#16A34A] flex items-center justify-center text-white shadow-2xs flex-shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      className="w-3.5 h-3.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Success!
                  </span>
                </div>

                <div className="flex flex-col items-end leading-none">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-6 text-[#F6821F]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                    </svg>
                    <span className="font-extrabold text-[11px] tracking-wider text-slate-900">
                      CLOUDFLARE
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-normal mt-1 space-x-1.5">
                    <a
                      href="#privacy"
                      onClick={(e) => e.preventDefault()}
                      className="hover:underline"
                    >
                      Privacy
                    </a>
                    <span>·</span>
                    <a
                      href="#help"
                      onClick={(e) => e.preventDefault()}
                      className="hover:underline"
                    >
                      Help
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Cancel and Sign In */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1D4ED8] hover:bg-blue-50/80 active:scale-[0.99] text-[#1D4ED8] text-xs sm:text-sm font-bold transition-all text-center cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#003366] hover:bg-[#002244] active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition-all text-center cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>

              {/* Sign Up Footer */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-600">
                  Need an NCPOR account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true)
                      setTimeout(() => {
                        setIsLoading(false)
                        onLoginSuccess(
                          "Citizen",
                          email || "citizen@ncpor.gov.in",
                        )
                      }, 350)
                    }}
                    className="text-[#1D4ED8] hover:text-[#1E40AF] font-bold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ── FLOATING MARINE AI ASSISTANT BADGE (BOTTOM RIGHT) ───────────────── */}
      <aside className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenAI}
          className="group flex flex-col items-center gap-1 focus:outline-hidden"
          title="Open Marine AI Assistant"
          aria-label="Open Marine AI Assistant"
        >
          <div className="w-14 h-14 rounded-full bg-[#001D3D] border-2 border-sky-400/80 shadow-2xl flex items-center justify-center text-white relative transition-transform duration-200 group-hover:scale-110">
            {/* Glowing Ring Animation */}
            <div className="absolute inset-0 rounded-full border border-sky-400 animate-ping opacity-25 pointer-events-none" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-7 h-7 text-sky-300"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="bg-[#002855] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-sky-300/40 tracking-wide">
            Marine AI
          </span>
        </button>
      </aside>
    </div>
  )
}
