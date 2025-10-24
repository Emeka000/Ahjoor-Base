export function HeroSection() {
  return (
    <section id="home" className="bg-black pt-44 pb-9 px-10 text-center scroll-mt-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-5xl font-normal text-white md:text-6xl lg:text-7xl">
            Earn Together.. Save Together
        </h1>
        <p className="mt-10 text-xl text-white md:text-2xl">All on Your Decentralized Savings Group In One Place</p>
        <div className="mt-10 inline-flex">
        <div
            className="rounded-2xl border px-8 py-3 text-2xl text-white"
            style={{
              background: "linear-gradient(to right, #3C317D, #1A1921)",
              borderWidth: "1px",
              borderColor: "#AF9A9A",
            }}
          >
            Over $200,000 saved
          </div>
        </div>
        <div className="mt-12">
          <img
            src="/assets/easy.png"
            alt="Dashboard showing savings groups, total saved, active pools, and contribution details"
            className="mx-auto w-full max-w-5xl rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
