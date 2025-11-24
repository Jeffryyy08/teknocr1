// src/app/terminos-y-condiciones/page.tsx
export default function TermsAndConditions() {
    return (
        <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-3 bg-blue-900/30 text-blue-300 px-4 py-2 rounded-full mb-6">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm font-medium">Términos y Condiciones</span>
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
                            Bienvenido a <strong className="text-white">TeknoCR</strong>. Al utilizar nuestro sitio web aceptás los siguientes Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, te recomendamos no utilizar nuestro sitio.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Uso del Sitio
                        </h2>
                        <p className="text-slate-300 mb-4">
                            El usuario se compromete a:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Usar el sitio de forma legal y respetuosa</li>
                            <li>No realizar actividades que afecten el funcionamiento del sitio</li>
                            <li>No intentar acceder a información privada de terceros</li>
                            <li>No usar el sitio para actividades fraudulentas</li>
                        </ul>
                        <p className="text-slate-300">
                            <strong className="text-white">TeknoCR</strong> puede restringir el acceso al sitio a cualquier usuario que viole estas reglas.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Registro y Cuentas de Usuario
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Este sitio web no requiere la creación de cuentas ni perfiles de usuario.<br />
                            Todas las compras, solicitudes o consultas se realizan sin necesidad de registrarse.
                        </p>
                        <p className="text-slate-300">
                            Sin embargo, el usuario debe proporcionar información verídica en los formularios o al momento de completar un pedido.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            Productos y Disponibilidad
                        </h2>
                        <p className="text-slate-300 mb-4">
                            TeknoCR ofrece productos tecnológicos, accesorios y artículos relacionados.<br />
                            La disponibilidad puede variar dependiendo de nuestros proveedores y socios logísticos.
                        </p>
                        <p className="text-slate-300 mb-4">
                            Nos reservamos el derecho de:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Actualizar o corregir información</li>
                            <li>Modificar precios</li>
                            <li>Cambiar productos</li>
                            <li>Suspender artículos en cualquier momento</li>
                        </ul>
                        <p className="text-slate-300">
                            Aunque intentamos mantener la información actualizada, pueden existir errores puntuales.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            Compras y Pagos
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Al realizar una compra en TeknoCR, el usuario confirma que:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Está autorizado para utilizar el método de pago seleccionado</li>
                            <li>Acepta los precios, condiciones y tiempos estimados mostrados en la página</li>
                        </ul>
                        <p className="text-slate-300">
                            TeknoCR utiliza métodos de pago de terceros seguros.<br />
                            No almacenamos información financiera del usuario.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                            Envíos
                        </h2>
                        <p className="text-slate-300 mb-4">
                            TeknoCR trabaja bajo modalidad <strong className="text-blue-200">dropshipping</strong>, lo que significa que los productos son enviados directamente por los proveedores o almacenes externos.
                        </p>
                        <p className="text-slate-300 mb-4">
                            Por esta razón:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Los tiempos de entrega pueden variar</li>
                            <li>El seguimiento depende del proveedor</li>
                            <li>No controlamos directamente la logística del envío</li>
                            <li>No garantizamos tiempos exactos de entrega</li>
                            <li>Cualquier retraso ocasionado por aduanas, transportistas o el proveedor no es responsabilidad directa de <strong className="text-white">TeknoCR</strong></li>
                        </ul>
                        <p className="text-slate-300">
                            Proporcionaremos toda la información de seguimiento disponible al cliente.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                            Cancelaciones y Devoluciones
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Debido al modelo de dropshipping, las políticas de devoluciones están sujetas a las reglas del proveedor.
                        </p>
                        <p className="text-slate-300 mb-4">
                            Generalmente:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>No se aceptan devoluciones por cambio de opinión</li>
                            <li>Se pueden evaluar casos específicos de productos defectuosos o incorrectos, siempre y cuando se presente evidencia (fotos/video) dentro del plazo establecido por el proveedor</li>
                        </ul>
                        <p className="text-slate-300 mb-4">
                            TeknoCR actuará como intermediario entre el cliente y el proveedor para gestionar reclamos.
                        </p>
                        <p className="text-slate-300">
                            Para consultas sobre devoluciones:
                            <a href="mailto:teknocr.contact@gmail.com" className="text-blue-300 hover:text-blue-200 font-medium ml-1">
                                📩 teknocr.contact@gmail.com
                            </a>
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                            Propiedad Intelectual
                        </h2>
                        <p className="text-slate-300">
                            Todo el contenido del sitio (diseños, textos, imágenes, logo, código) es propiedad de TeknoCR o de sus respectivos dueños.<br />
                            Está prohibido copiar, distribuir o reproducir cualquier parte del contenido sin autorización.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                            Limitación de Responsabilidad
                        </h2>
                        <p className="text-slate-300">
                            TeknoCR no se responsabiliza por:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Daños derivados del uso inadecuado de los productos</li>
                            <li>Retrasos o errores logísticos externos</li>
                            <li>Información incorrecta proporcionada por el usuario</li>
                            <li>Interrupciones en el servicio del sitio web</li>
                            <li>Errores tipográficos o de disponibilidad</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                            Modificaciones
                        </h2>
                        <p className="text-slate-300 mb-4">
                            TeknoCR puede actualizar estos Términos en cualquier momento.
                        </p>
                        <p className="text-slate-300">
                            La fecha de la última actualización aparecerá al inicio del documento.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
                            Contacto
                        </h2>
                        <p className="text-slate-300">
                            Para dudas o consultas sobre los Términos:
                            <a href="mailto:teknocr.contact@gmail.com" className="text-cyan-300 hover:text-cyan-200 font-semibold">
                                📧 teknocr.contact@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}