// src/app/politica-de-privacidad/page.tsx
export default function PrivacyPolicy() {
    return (
        <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-3 bg-blue-900/30 text-blue-300 px-4 py-2 rounded-full mb-6">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm font-medium">Política de Privacidad</span>
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
                            En <strong className="text-white">TeknoCR</strong> valoramos la privacidad de nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos la información personal que obtenemos a través de nuestro sitio web y nuestros servicios.
                        </p>
                        <p className="text-slate-300 mb-8">
                            Al utilizar nuestra página web, aceptas los términos descritos a continuación.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Información que Recopilamos
                        </h2>

                        <h3 className="text-xl font-semibold text-blue-200 mt-6 mb-3">1.1 Datos proporcionados por el usuario</h3>
                        <p className="text-slate-300 mb-4">
                            Podemos recopilar la siguiente información cuando el usuario la ingresa voluntariamente:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Nombre completo</li>
                            <li>Correo electrónico</li>
                            <li>Número de teléfono</li>
                            <li>Dirección</li>
                            <li>Información enviada por formularios de contacto</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-blue-200 mt-6 mb-3">1.2 Datos recopilados automáticamente</h3>
                        <p className="text-slate-300 mb-4">
                            Cuando visitas nuestro sitio, podemos recopilar:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Dirección IP</li>
                            <li>Tipo de dispositivo y navegador</li>
                            <li>Páginas visitadas</li>
                            <li>Tiempos de visita</li>
                            <li>Cookies y tecnologías similares</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-blue-200 mt-6 mb-3">1.3 Información de compras</h3>
                        <p className="text-slate-300">
                            Si realizas una compra:
                        </p><br />
                        <ul className="list-disc pl-6 mb-8 space-y-2 text-slate-300">
                            <li>Productos adquiridos</li>
                            <li>Historial de transacciones</li>
                            <li>Método de pago (no almacenamos números de tarjetas)</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Cómo Usamos tu Información
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Utilizamos tus datos para:
                        </p>
                        <ul className="list-disc pl-6 mb-8 space-y-2 text-slate-300">
                            <li>Procesar compras y pedidos</li>
                            <li>Brindar soporte y atención al cliente</li>
                            <li>Mejorar nuestra web y su funcionamiento</li>
                            <li>Garantizar seguridad y prevención de fraude</li>
                            <li>Enviar actualizaciones sobre tu compra</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            Compartición de Información
                        </h2>
                        <p className="text-slate-300 mb-4">
                            <strong className="text-white">TeknoCr no vende ni alquila</strong> la información del usuario.
                        </p>
                        <p className="text-slate-300 mb-4">
                            Podemos compartir datos únicamente con:
                        </p>
                        <ul className="list-disc pl-6 mb-8 space-y-2 text-slate-300">
                            <li>Plataformas de pago seguras</li>
                            <li>Proveedores/logística para procesar envíos</li>
                            <li>Servicios de análisis web (Google Analytics)</li>
                            <li>Autoridades legales cuando la ley lo exija</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            Seguridad de la Información
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Implementamos medidas técnicas y administrativas para proteger los datos:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Conexiones cifradas (HTTPS)</li>
                            <li>Servidores seguros</li>
                            <li>Restricción de acceso interno</li>
                            <li>Controles para evitar alteración o pérdida de información</li>
                        </ul>
                        <p className="text-slate-300 italic">
                            Aun así, ningún sistema es 100% infalible.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                            Derechos del Usuario
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Puedes solicitar en cualquier momento:
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                            <li>Acceso a tus datos</li>
                            <li>Corrección de información</li>
                            <li>Eliminación de tu información</li>
                            <li>Cese de comunicaciones</li>
                        </ul>
                        <p className="text-slate-300">
                            Para ejercer estos derechos, contáctanos a:
                            <a href="mailto:teknocr.contact@gmail.com" className="text-blue-300 hover:text-blue-200 font-medium ml-1">
                                📩 teknocr.contact@gmail.com
                            </a>
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                            Cookies
                        </h2>
                        <p className="text-slate-300 mb-4">
                            Usamos cookies para mejorar tu experiencia.
                        </p>
                        <p className="text-slate-300">
                            Para más información, revisa nuestra <a href="/politica-de-cookies" className="text-blue-300 hover:text-blue-200">Política de Cookies</a>.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                            Cambios a la Política
                        </h2>
                        <p className="text-slate-300 mb-4">
                            <strong className="text-white">TeknoCR</strong> puede actualizar esta política en cualquier momento.
                        </p>
                        <p className="text-slate-300">
                            La fecha de modificación aparecerá en la parte superior.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center">
                            <span className="mr-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                            Contacto
                        </h2>
                        <p className="text-slate-300">
                            Para consultas sobre esta política:
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