'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 relative overflow-x-hidden">

      {/* Textura suave en el fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.12)_0%,rgba(0,0,0,0)_70%)] opacity-40"></div>

      <div className="container mx-auto px-5 py-14 relative z-10">

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Conoce Nuestra Historia
            </h1>

            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              TeknoCR nació con un propósito claro: hacer que la tecnología en Costa Rica sea accesible, honesta y confiable.
              No solo vendemos, te acompañamos, te explicamos y te cuidamos en cada compra.
            </p>

            <Link
              href="/tienda"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Explorar Productos
            </Link>
          </div>

          {/* Misión */}
          <div className="md:w-1/2">
            <div className="bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-4">Nuestra Misión</h2>
              <p className="text-slate-300 leading-relaxed">
                Ofrecer productos y servicios tecnológicos accesibles, confiables y totalmente transparentes.
                Acompañamos cada compra con asesoría honesta, explicando qué necesitas y por qué, sin venderte de más.
              </p>
            </div>
          </div>
        </div>


        {/* Imagen + Historia */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-28">

          {/* Imagen */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-blue-500/20 rounded-3xl blur-2xl"></div>

              <div className="relative p-3 bg-slate-900/40 border border-slate-700 rounded-3xl shadow-2xl backdrop-blur-md">
                <img
                  src="https://img.pccomponentes.com/pcblog/6590/componentes-pc-gaming.jpg"
                  alt="PC Gamer TeknoCR"
                  className="rounded-2xl shadow-xl max-w-md"
                />
              </div>
            </div>
          </div>

          {/* Historia */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-white mb-6">Más que una Tienda, una Comunidad</h2>

            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                <span className="text-blue-300 font-semibold">Octubre 2025:</span> TeknoCR comienza como un pequeño proyecto desde casa, ensamblando PCs por pedido y atendiendo clientes por WhatsApp. 
                Cada venta se hacía con detalle, explicando todo paso a paso.
              </p>

              <p>
                <span className="text-blue-300 font-semibold">Noviembre 2025:</span> La recomendación boca a boca hace crecer el proyecto.
                Creamos promociones, videos de contenido y empezamos a trabajar en la página web oficial para brindar más confianza.
              </p>

              <p className="italic text-blue-200 mt-4">
                "Nuestra meta no es solo vender. Es ayudarte a construir la herramienta que llevará tus sueños más lejos."
              </p>
            </div>
          </div>
        </div>


        {/* Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          {[
            {
              title: "Calidad",
              description: "Solo trabajamos con marcas confiables y componentes probados.",
              icon: "⚙️"
            },
            {
              title: "Confianza",
              description: "Cada entrega se hace con pruebas, diagnósticos y transparencia total.",
              icon: "🔒"
            },
            {
              title: "Servicio Personalizado",
              description: "Te acompañamos según tu presupuesto, objetivo y experiencia.",
              icon: "💬"
            }
          ].map((value, i) => (
            <div
              key={i}
              className="bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-slate-300 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>


        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para llevar tu setup al siguiente nivel?
          </h2>

          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            Contáctanos y recibe asesoría gratuita antes de comprar.  
            Queremos que inviertas bien, no más.
          </p>

          <Link
            href="/contacto"
            className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Contáctanos Ahora
          </Link>
        </div>

      </div>
    </div>
  )
}
