// src/app/politica-de-cookies/page.tsx
export default function CookiesPolicy() {
    return (
        <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-3 bg-blue-900/30 text-blue-300 px-4 py-2 rounded-full mb-6">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm font-medium">Política de Cookies</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">TeknoCR</span>
                    </h1>
                    <p className="text-blue-200 max-w-2xl mx-auto">
                        Última actualización: <span className="font-semibold">17-11-2025</span>
                    </p>
                </div>

                {/* Contenido */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-xl">
                        <p className="text-lg text-slate-300 mb-8">
                            En <strong className="text-white">TeknoCR</strong> utilizamos cookies y tecnologías similares para mejorar la experiencia del usuario, analizar el uso del sitio y mostrar contenido y productos relevantes. Esta Política de Cookies explica qué son las cookies, qué tipos utilizamos, para qué sirven y cómo puedes gestionarlas.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            ¿Qué son las cookies?
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Las cookies son pequeños archivos de texto que los sitios web envían al navegador que utilizas. Permiten que la página recuerde tus acciones o preferencias durante un tiempo (por ejemplo, idioma, productos vistos, carrito, etc.).
                        </p>
                        <p className="text-slate-300">
                            También usamos tecnologías similares como <code>localStorage</code>, <code>sessionStorage</code> y scripts externos que funcionan de forma parecida.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            ¿Qué tipos de cookies utilizamos?
                        </h2>

                        <h3 className="text-xl font-semibold text-blue-200 mt-6 mb-3">a) Cookies necesarias</h3>
                        <p className="text-slate-300 mb-4">
                            Son esenciales para que el sitio funcione correctamente. Sin ellas no podrías navegar bien.
                        </p>
                        <p className="text-slate-300 mb-4">
                            Ejemplos:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Control del estado del sitio</li>
                            <li>Seguridad</li>
                            <li>Preferencias mínimas de navegación</li>
                        </ul>
                        <p className="text-slate-300 italic">
                            Estas cookies no requieren tu consentimiento.
                        </p>

                        <h3 className="text-xl font-semibold text-blue-200 mt-6 mb-3">b) Cookies de rendimiento y analítica (Google Analytics)</h3>
                        <p className="text-slate-300 mb-4">
                            Estas cookies recopilan información sobre cómo usas el sitio, como:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                            <li>Páginas más visitadas</li>
                            <li>Tiempo en la web</li>
                            <li>Rutas de navegación</li>
                        </ul>
                        <p className="text-slate-300">
                            Utilizamos <strong className="text-white">Google Analytics</strong>, que puede recopilar datos anónimos sobre el uso del sitio.<br />
                            Google puede usar esta información de forma agregada para mejorar sus propios servicios.<br />
                            Para más información, consulta la <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Política de Cookies de Google</a>.
                        </p>

                        <h3 className="text-xl font-semibold text-blue-200 mt-6 mb-3">c) Cookies de terceros (librerías y servicios externos)</h3>
                        <p className="text-slate-300 mb-4">
                            Nuestro sitio utiliza recursos externos como:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>CDN de librerías (Tailwind, React, etc.)</li>
                            <li>Integraciones de pago (WhatsApp, enlaces seguros)</li>
                            <li>Servicios de hosting y almacenamiento de imágenes</li>
                        </ul>
                        <p className="text-slate-300">
                            Estos servicios pueden instalar cookies propias para su funcionamiento.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            ¿Para qué usamos las cookies?
                        </h2>
                        <p className="text-slate-300">
                            En <strong className="text-white">TeknoCR</strong> usamos cookies para:
                        </p>
                        <ul className="list-disc pl-6 mb-8 space-y-2 text-slate-300">
                            <li>Mejorar la velocidad y rendimiento del sitio</li>
                            <li>Analizar estadísticas de uso</li>
                            <li>Recordar preferencias (carrito, idioma, etc.)</li>
                            <li>Garantizar la seguridad</li>
                            <li>Mostrar contenido más relevante</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            ¿Puedes desactivar las cookies?
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Sí. Puedes configurar tu navegador para rechazar o eliminar cookies.<br />
                            Esto puede afectar el funcionamiento del sitio.
                        </p>
                        <p className="text-slate-300 mb-4">
                            Guías oficiales:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>
                                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Chrome</a>
                            </li>
                            <li>
                                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Firefox</a>
                            </li>
                            <li>
                                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Edge</a>
                            </li>
                            <li>
                                <a href="https://support.apple.com/es-es/HT201265" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Safari</a>
                            </li>
                        </ul>
                        <p className="text-slate-300">
                            También puedes desactivar Google Analytics con la <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">extensión oficial de opt-out</a>.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                            Actualizaciones a esta política
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Podemos actualizar esta Política de Cookies en cualquier momento.
                        </p>
                        <p className="text-slate-300">
                            La versión vigente siempre estará disponible en esta misma página.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                            Contacto
                        </h2>
                        <p className="text-slate-300">
                            Si tienes preguntas sobre esta Política de Cookies o deseas ejercer algún derecho relacionado con tus datos, puedes escribirnos a:
                            <a href="mailto:teknocr.contact@gmail.com" className="text-cyan-300 hover:text-cyan-200 font-semibold ml-1">
                                📩 teknocr.contact@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
