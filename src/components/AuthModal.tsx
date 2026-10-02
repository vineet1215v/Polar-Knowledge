import { useState } from "react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (userData?: {
    name: string
    email: string
    mobile: string
    role: string
    points: number
    level: string
  }) => void
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AuthModalProps) {
  const [activeTab, setActiveTab] =
    useState<"otp" | "password" | "meripehchaan">("otp")
  const [mobileOrEmail, setMobileOrEmail] = useState(
    "rajeshwar.sharma@ncpor.res.in",
  )
  const [password, setPassword] = useState("••••••••••••")
  const [otpSent, setOtpSent] = useState(false)
  const [otpDigits, setOtpDigits] = useState(["4", "8", "2", "9", "1", "0"])
  const [captchaInput, setCaptchaInput] = useState("8K9P")
  const [captchaCode] = useState("8K9P")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobileOrEmail.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setOtpSent(true)
    }, 600)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess({
        name: "Dr. Rajeshwar Sharma",
        email: "rajeshwar.sharma@ncpor.res.in",
        mobile: "+91 98765 43210",
        role: "Senior Polar Oceanographer & Active Citizen",
        points: 2450,
        level: "Level 4: Influencer",
      })
      onClose()
    }, 500)
  }

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess({
        name: "Dr. Rajeshwar Sharma",
        email: "rajeshwar.sharma@ncpor.res.in",
        mobile: "+91 98765 43210",
        role: "Senior Polar Oceanographer & Active Citizen",
        points: 2450,
        level: "Level 4: Influencer",
      })
      onClose()
    }, 500)
  }

  const handleInstantDemoLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess({
        name: "Dr. Rajeshwar Sharma",
        email: "rajeshwar.sharma@ncpor.res.in",
        mobile: "+91 98765 43210",
        role: "Senior Polar Oceanographer & Active Citizen",
        points: 2450,
        level: "Level 4: Influencer",
      })
      onClose()
    }, 300)
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Tiranga Strip */}
        <div className="flex h-1.5 w-full">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Ashoka Lion Emblem */}
            <div className="w-9 h-11 flex flex-col items-center justify-center flex-shrink-0 text-[#1E293B]">
              <svg viewBox="0 0 40 48" fill="none" className="w-8 h-10">
                <path
                  d="M12 4C12 2.5 13.5 1 16 1C18.5 1 20 2.5 20 4C20 2.5 21.5 1 24 1C26.5 1 28 2.5 28 4C28 6 26.5 8 25 9C27 10 28.5 12 28.5 14.5C28.5 17 26.8 19 24.5 19.8C25.5 20.8 26 22 26 23.5C26 26 24 28 21.5 28.5V31H18.5V28.5C16 28 14 26 14 23.5C14 22 14.5 20.8 15.5 19.8C13.2 19 11.5 17 11.5 14.5C11.5 12 13 10 15 9C13.5 8 12 6 12 4Z"
                  fill="#1E293B"
                />
                <rect
                  x="8"
                  y="32"
                  width="24"
                  height="4"
                  rx="1"
                  fill="#1E293B"
                />
                <circle cx="20" cy="34" r="1.5" fill="#FFFFFF" />
                <path
                  d="M10 37C14 36.5 26 36.5 30 37C29 40 25 41 20 41C15 41 11 40 10 37Z"
                  fill="#334155"
                />
                <rect
                  x="13"
                  y="42"
                  width="14"
                  height="1.5"
                  rx="0.5"
                  fill="#1E293B"
                />
              </svg>
              <div className="text-[6.5px] font-black tracking-tight text-[#1E293B] -mt-1 uppercase">
                सत्यमेव जयते
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  Log in to NCPOR Portal
                </span>
                <span className="text-[#1D4ED8] text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                  NCPOR Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Citizen Engagement & Polar Scientific Research Gateway
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Auth Method Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("otp")}
            className={`py-3 text-center border-b-2 transition-colors ${
              activeTab === "otp"
                ? "border-[#1D4ED8] text-[#1D4ED8] bg-white font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Log in with OTP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`py-3 text-center border-b-2 transition-colors ${
              activeTab === "password"
                ? "border-[#1D4ED8] text-[#1D4ED8] bg-white font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("meripehchaan")}
            className={`py-3 text-center border-b-2 transition-colors ${
              activeTab === "meripehchaan"
                ? "border-[#1D4ED8] text-[#1D4ED8] bg-white font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            MeriPehchaan (SSO)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Quick Demo Login Pill Banner */}
          <div className="mb-5 p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                GOI
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">
                  Instant Demo Login
                </div>
                <div className="text-slate-600 text-[11px]">
                  Experience citizen & researcher view directly
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#1D4ED8] hover:bg-[#D96016] rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1"
            >
              {isLoading ? "Signing in..." : "Sign In Now"}
            </button>
          </div>

          {/* TAB 1: OTP LOGIN */}
          {activeTab === "otp" && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Mobile Number or Email ID
                    </label>
                    <input
                      type="text"
                      value={mobileOrEmail}
                      onChange={(e) => setMobileOrEmail(e.target.value)}
                      placeholder="Enter mobile number or email"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8]"
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      A 6-digit One Time Password (OTP) will be sent to your
                      registered contact.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#1D4ED8] hover:bg-[#D96016] text-white text-sm font-bold rounded-lg shadow-sm transition-all"
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4 flex-shrink-0 text-green-600"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>
                      OTP sent to <strong>{mobileOrEmail}</strong> (Demo code:
                      482910)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const newDigits = [...otpDigits]
                            newDigits[idx] = e.target.value
                            setOtpDigits(newDigits)
                          }}
                          className="w-full h-11 text-center font-bold text-base border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1D4ED8]/40 focus:border-[#1D4ED8]"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#1D4ED8] hover:underline font-semibold"
                    >
                      Change Contact
                    </button>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      Resend OTP (00:45)
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#1D4ED8] hover:bg-[#D96016] text-white text-sm font-bold rounded-lg shadow-sm transition-all"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP & Log In"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: PASSWORD LOGIN */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email ID or Mobile Number
                </label>
                <input
                  type="text"
                  value={mobileOrEmail}
                  onChange={(e) => setMobileOrEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-[11px] text-[#1D4ED8] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8]"
                  required
                />
              </div>

              {/* Captcha Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Captcha Verification
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold tracking-widest text-slate-800 select-none text-sm line-through">
                    {captchaCode}
                  </div>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg uppercase"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#1D4ED8] hover:bg-[#D96016] text-white text-sm font-bold rounded-lg shadow-sm transition-all"
              >
                {isLoading ? "Signing in..." : "Log In with Password"}
              </button>
            </form>
          )}

          {/* TAB 3: MERIPEHCHAAN / DIGILOCKER SSO */}
          {activeTab === "meripehchaan" && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-7 h-7"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  MeriPehchaan (National SSO)
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Single Sign-On platform for Government of India citizen
                  services powered by DigiLocker and JanParichay.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleInstantDemoLogin}
                  className="w-full py-2.5 px-4 bg-[#1A3C6E] hover:bg-[#132E56] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Authenticate with DigiLocker Credentials</span>
                </button>
                <button
                  type="button"
                  onClick={handleInstantDemoLogin}
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
                >
                  Sign In with JanParichay Government Employee ID
                </button>
              </div>
            </div>
          )}

          {/* Bottom Help and Register links */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Don't have an account?{" "}
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault()
                  handleInstantDemoLogin()
                }}
                className="text-[#1D4ED8] hover:underline font-bold"
              >
                Register Now
              </a>
            </span>
            <a
              href="#help"
              onClick={(e) => e.preventDefault()}
              className="hover:text-slate-800"
            >
              Helpdesk & FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
