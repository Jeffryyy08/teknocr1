// src/components/Footer.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Facebook,
    Instagram,
    Twitter,
    Mail,
    Phone,
    MapPin,
    ArrowRight
} from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-slate-900 to-blue-900 border-t border-slate-800">
            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Columna 1: Logo + Quiénes somos */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <h3 className="text-xl font-bold text-white">TeknoCR</h3>
                        </div>
                        <p className="text-slate-300 mb-6">
                            Somos entusiastas de la tecnología en Costa Rica. Ofrecemos soluciones tecnológicas de alta calidad, accesibles y confiables.
                        </p>
                        <Link
                            href="/sobre-nosotros"
                            className="inline-flex items-center text-blue-300 hover:text-blue-200 font-medium group"
                        >
                            Sobre nosotros
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Columna 2: Contacto */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-blue-400" />
                                <a href="mailto:teknocr.contact@gmail.com" className="text-slate-300 hover:text-white">
                                    teknocr.contact@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-blue-400" />
                                <a href="tel:+50671604429" className="text-slate-300 hover:text-white">
                                    +506 7160-4429
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.48 0 1.463 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.707.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-4.733-1.36 9.92 9.92 0 01-3.45-3.446 9.86 9.86 0 01-1.363-4.734c0-.292.21-.57.492-.57h2.066c.298 0 .553.243.57.533a7.44 7.44 0 00.16 1.621 7.49 7.49 0 002.094 4.821 7.44 7.44 0 004.826 2.098 7.4 7.4 0 001.603.166c.292.017.533.276.533.57v2.066c-.002.279-.224.503-.506.499m6.223-11.601H15.33c-.298 0-.554-.243-.57-.533a7.39 7.39 0 00-.162-1.621 7.49 7.49 0 01-5.872-7.431c0-.288.22-.554.502-.554h2.069c.276 0 .5.223.5.5v1.466c0 .288.22.5.5.5h4.833c.288 0 .5-.223.5-.5v-4.833c0-.288.22-.5.5-.5H20c.288 0 .5.223.5.5v7.299c0 .288-.22.5-.5.5z" />
                                </svg>
                                <a href="https://wa.me/50671604429" target="_blank" className="text-slate-300 hover:text-white">
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Columna 3: Redes Sociales */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Síguenos</h4>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/profile.php?id=61581768092699" className="text-slate-400 hover:text-blue-300 transition-colors">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="https://instagram.com/tekno.cr" className="text-slate-400 hover:text-blue-300 transition-colors">
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                        <p className="text-slate-500 mt-4 text-sm">
                            ¡Únete a nuestra comunidad!
                        </p>
                    </div>

                    {/* Columna 4: Envíos y Política */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Políticas y Terminos</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <a href="/politica">
                                    <span className="text-slate-300">Política de Privacidad</span>
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <a href="/terminos">
                                    <span className="text-slate-300">Terminos y Condiciones</span>
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <a href="/cookies">
                                    <span className="text-slate-300">Política de Cookies</span>
                                </a>
                            </div>
                        </div>
                        <div className="mt-4">
                            {/*<Link href="/politica-de-devoluciones" className="text-slate-400 hover:text-blue-300 text-sm">
                                Política de Devoluciones
                            </Link>*/}
                        </div>
                    </div>
                </div>

                {/* Divisor */}
                <div className="border-t border-slate-800 my-8"></div>

                {/* Copyright */}
                <div className="text-center text-slate-500 text-sm">
                    © {new Date().getFullYear()} TeknoCR. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}