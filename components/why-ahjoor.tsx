import { Globe, Shield, Network, GitBranch, Coins, RefreshCw } from "lucide-react"

export function WhyAhjoor() {
  const features = [
    {
      icon: Globe,
      title: "Borderless Contributions",
      description:
        "Join a savings circle from anywhere in the world. Whether your group members are in Lagos, London, or New York, Ahjoor removes location barriers.",
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description:
        "Your money is protected by smart contracts and enterprise-level security systems. Funds are automatically managed on-chain.",
    },
    {
      icon: Network,
      title: "On-Chain Transparency",
      description:
        "Every contribution, payout, and transaction is recorded on the blockchain for all group members to see.",
    },
    {
      icon: GitBranch,
      title: "No Middleman",
      description:
        "Say goodbye to relying on a treasurer or group admin to manage your funds. Ahjoor eliminates the need for a central authority.",
    },
    {
      icon: Coins,
      title: "Stablecoin Option",
      description:
        "Protect your group savings from crypto market volatility by contributing with stable coins. With this option, your contributions hold their stable value.",
    },
    {
      icon: RefreshCw,
      title: "Automated Payouts",
      description:
        "No delays, no manual reminders. When it's your turn to receive the group savings, Ahjoor's smart contracts automatically release your payout.",
    },
  ]

  return (
    <section id="features" className="bg-black py-16 px-4 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center font-serif text-4xl text-white sm:mb-16 sm:text-5xl">Why Ahjoor?</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-3xl p-[1px]"
              style={{
                background: "linear-gradient(135deg, #FFFDFD 0%, #999898 100%)",
              }}
            >
              <div className="flex h-full flex-col items-center rounded-3xl bg-[#3a3a3a] px-6 py-10 lg:py-24 text-center sm:px-8 sm:py-12">
                <div className="mb-6 rounded-2xl bg-[#6b6b6b] p-4">
                  <feature.icon className="h-8 w-8 text-[#2a2a2a]" strokeWidth={1.5} />
                </div>

                <h3 className="mb-4 text-xl font-medium text-white sm:text-2xl">{feature.title}</h3>

                <p className="text-sm leading-relaxed text-gray-300 sm:text-base">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
