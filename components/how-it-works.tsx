import { ArrowDown } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      title: "Join or Create a Circle",
      description: "Pick your savings group, set the rules.",
    },
    {
      title: "Contribute in Crypto",
      description: "Everyone contributes on schedule.",
    },
    {
      title: "Payout in Turns",
      description: "Each member receives the pooled funds when it's their turn.",
    },
  ]

  return (
    <section id="how-it-works" className="bg-black py-16 px-4 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border bg-gradient-to-br from-black to-gray-900/50 p-8 sm:p-12 lg:py-16 lg:px-56">
          <h2 className="mb-12 text-center font-serif text-4xl font-bold text-white sm:text-5xl">How it Works</h2>

          <div className="flex flex-col items-center gap-3">
            {steps.map((step, index) => (
              <div key={index} className="w-full max-w-md">
                <div className="rounded-[12px] bg-[#3C3C3C] px-9 py-11 text-center backdrop-blur-sm">
                  <div className="mb-4 inline-block rounded-2xl border border-white/30 px-6 py-2 text-white">
                    {step.title}
                  </div>
                  <p className="text-white/90">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex justify-center py-4">
                    <ArrowDown className="h-8 w-8 text-white/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
