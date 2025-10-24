export function SupportedBy() {
  return (
    <section className="bg-[#1B1B1B] py-16 px-4">
      <div className="w-full mx-auto">
        <h2 className="text-white text-center text-lg font-light tracking-[0.3em] mb-14 uppercase">Supported By</h2>
        <div className="flex flex-wrap items-center justify-evenly gap-20 md:gap-16 lg:gap-20">
          <img
            src="/assets/ETH.png"
            alt="Ethereum"
            className="h-8 md:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
          />
          <img
            src="/assets/STRK.png"
            alt="Starknet"
            className="h-8 md:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
          />
          <img
            //src="/assets/XLM.png"
            //alt="Stellar"
            //className="h-8 md:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
          />
          <img
            src="/assets/BASE.png"
            alt="Base"
            className="h-8 md:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </section>
  )
}
