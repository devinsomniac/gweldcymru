import Image from 'next/image'

const Header = () => {
  return (
    <header className="col-span-full max-md:order-first">
      {/* Top stripe */}
      <div className="grid grid-cols-3 h-1">
        <div className="bg-(--welsh-green)"></div>
        <div className="bg-white"></div>
        <div className="bg-(--welsh-red)"></div>
      </div>

      {/* Navbar */}
      <nav className="bg-(--surface2) px-3 py-3 md:px-6 md:py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        
        {/* Left */}
        <div className="flex items-center gap-3">
          <Image src="/wales.png" alt="wales logo" height={40} width={70} />

          <div>
            <h2 className="text-lg md:text-2xl font-semibold">
              Gweld <span className="text-(--welsh-red)">Cymru</span>
            </h2>
            <p className="text-xs md:text-sm text-(--text-muted)">
              See Wales · Know Your Neighbourhood
            </p>
          </div>
        </div>

        {/* Right badge */}
        <div className="bg-(--surface) px-3 py-2 flex items-center gap-2 rounded-xl w-full md:w-auto">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-xs text-(--text-muted) whitespace-nowrap">
            Live data · DataMapWales
          </p>
        </div>

      </nav>
    </header>
  )
}

export default Header