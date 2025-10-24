import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "What if someone doesn't pay their turn?",
      answer:
        "Ahjoor uses smart contracts with built-in penalties and collateral requirements to ensure all members contribute on time. If someone misses a payment, the smart contract can automatically enforce consequences like losing their collateral or being removed from the circle.",
    },
    {
      question: "How is this different from a local savings group?",
      answer:
        "Unlike traditional savings groups that require physical meetings and trust in a central organizer, Ahjoor operates entirely on the blockchain. This means no middleman, complete transparency, automated payouts, and the ability to join circles from anywhere in the world.",
    },
    {
      question: "Can I use stablecoins instead of volatile crypto?",
      answer:
        "Yes! Ahjoor supports stablecoin contributions to protect your savings from crypto market volatility. You can choose to contribute with stablecoins like USDC or USDT, ensuring your contributions maintain their value throughout the savings cycle.",
    },
  ]

  return (
    <section id="faqs" className="py-16 px-4 bg-black scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        {/* CTA Button */}
        <div className="flex justify-center mb-12">
          <button
            className="px-8 py-3 text-white rounded-lg font-medium"
            style={{
              background: "linear-gradient(to right, #3C317D, #1A1921)",
              border: "1px solid #AF9A9A",
            }}
          >
            Join a Circle Today
          </button>
        </div>

        <h2 className="text-4xl md:text-5xl font-serif text-white text-center mb-12">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-none bg-[#2A2A2A] rounded-2xl px-6">
              <AccordionTrigger className="text-white text-lg hover:no-underline py-6">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-300 text-base pb-6">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
