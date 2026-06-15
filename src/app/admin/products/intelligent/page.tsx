// src/app/admin/products/intelligent/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Link as LinkIcon,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Package,
  BarChart3
} from 'lucide-react'

// ===== PARSERS DE NOMBRES =====

function parseRAM(name: string): { brand: string; model: string; technology: string; capacity: string; speed: string; color: string } {
  // Limpiar palabras redundantes del nombre original
  let cleanName = name
    .replace(/^(MEMORIA\s+RAM|RAM\s+MEMORIA|RAM|MEMORIA)\s*/i, '')
    .replace(/\bPC\b/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const upper = cleanName.toUpperCase();

  // Extraer velocidad (MHz)
  let speed = '';
  const speedMatch = upper.match(/(\d{4})\s*MHZ/i);
  if (speedMatch) {
    speed = speedMatch[1];
    cleanName = cleanName.replace(new RegExp(speedMatch[0], 'i'), '').trim();
  }

  // Extraer tecnología
  let technology = 'DDR4';
  const techMatch = upper.match(/(DDR3|DDR4|DDR5)/i);
  if (techMatch) {
    technology = techMatch[0];
    cleanName = cleanName.replace(new RegExp(techMatch[0], 'i'), '').trim();
  }

  // Extraer capacidad
  let capacity = '';
  const capMatch = upper.match(/(\d+GB)/i);
  if (capMatch) {
    capacity = capMatch[1];
    cleanName = cleanName.replace(new RegExp(capMatch[0], 'i'), '').trim();
  }

  // Detectar color
  let color = 'Negro';
  if (upper.includes('BLANCO') || upper.includes('WHITE')) color = 'Blanco';
  else if (upper.includes('ROJO') || upper.includes('RED')) color = 'Rojo';
  else if (upper.includes('AZUL') || upper.includes('BLUE')) color = 'Azul';

  // Eliminar parámetros técnicos y códigos de producto
  let brandModel = cleanName
    .replace(/\bCL\d+\b/gi, '')                           // CL30, CL36, etc.
    .replace(/\b\d+(\.\d+)?\s*\/?\s*\d*(\.\d+)?\s*V\b/gi, '') // 1.35V, 1.35/1.4V, etc.
    .replace(/\b[A-Z]{2,}\d+[A-Z0-9\-]*\b/gi, '')        // Códigos como AX5U6000C3016G-CCARGY, CMH8GX5M1B5200C40
    .replace(/\s+/g, ' ')                                 // Espacios dobles
    .trim();

  // Separar marca y modelo
  const parts = brandModel.split(' ').filter(part => part.length > 0);
  const brand = parts.length > 0 ? parts[0] : '';

  // El modelo es todo lo demás, pero evitamos que termine en "NEGRO" u otros colores
  let model = parts.length > 1 ? parts.slice(1).join(' ') : '';
  if (model) {
    // Eliminar color del final del modelo si existe
    model = model.replace(/\b(Negro|Blanco|Rojo|Azul|Black|White|Red|Blue)\b$/i, '').trim();
  }

  return { brand, model, technology, capacity, speed, color };
}

function parseCPU(name: string): { brand: string; series: string; model: string } {
  const original = name.trim();
  const upper = original.toUpperCase();

  // Limpiar términos técnicos redundantes
  let cleanName = original
    .replace(/^(PROCESADOR\s+)?/i, '')
    .replace(/\b\d+(\.\d+)?\s*GHZ\b/i, '')     // 3.90GHZ
    .replace(/\b\d+\s*MB\b/i, '')              // 30MB
    .replace(/\bDDR\d+\b/i, '')                // DDR5
    .replace(/\bFC?LGA\s*\d+\b/i, '')          // FCLGA1851, LGA1700
    .replace(/\bAM\d+\b/i, '')                 // AM4, AM5
    .replace(/\bBX\d+\b/i, '')                 // BX80768265KF
    .replace(/\b\d+\s*VA\b/i, '')              // 12VA
    .replace(/\bGEN\b/i, '')                   // GEN
    .replace(/\s+/g, ' ')
    .trim();

  if (upper.includes('AMD')) {
    // Athlon
    if (upper.includes('ATHLON')) {
      const match = cleanName.match(/AMD\s+Athlon\s+([\d\w]+)/i);
      return {
        brand: 'AMD',
        series: 'Athlon',
        model: match ? match[1] : cleanName.replace(/AMD\s+Athlon\s+/i, '').trim()
      };
    }
    
    // Ryzen
    const ryzenMatch = cleanName.match(/AMD\s+Ryzen\s+(\w+)\s+([\d\w]+)/i);
    if (ryzenMatch) {
      return {
        brand: 'AMD',
        series: `Ryzen ${ryzenMatch[1]}`,
        model: ryzenMatch[2]
      };
    }
    
    // Fallback AMD
    return {
      brand: 'AMD',
      series: cleanName.split(' ')[1] || 'Ryzen',
      model: cleanName.split(' ').slice(2).join(' ') || cleanName.replace(/AMD\s+/i, '')
    };
  }

  if (upper.includes('INTEL')) {
    // Intel Core Ultra (nuevo formato)
    if (upper.includes('ULTRA')) {
      const ultraMatch = cleanName.match(/Intel\s+Core\s+Ultra\s+(\w+)\s+([\d\w]+)/i);
      if (ultraMatch) {
        return {
          brand: 'Intel',
          series: `Core Ultra ${ultraMatch[1]}`,
          model: ultraMatch[2]
        };
      }
      // Fallback para Ultra
      return {
        brand: 'Intel',
        series: 'Core Ultra',
        model: cleanName.replace(/Intel\s+Core\s+Ultra\s+/i, '').trim()
      };
    }
    
    // Intel Core iX (formato clásico)
    const coreMatch = cleanName.match(/Intel\s+Core\s+(i\d+-?\d+\w*)/i);
    if (coreMatch) {
      return {
        brand: 'Intel',
        series: 'Core',
        model: coreMatch[1]
      };
    }
    
    // Intel Core iX sin guión
    const coreSimple = cleanName.match(/Intel\s+Core\s+(i\d+)\s+(\d+\w*)/i);
    if (coreSimple) {
      return {
        brand: 'Intel',
        series: 'Core',
        model: `${coreSimple[1]}-${coreSimple[2]}`
      };
    }
    
    // Fallback Intel
    return {
      brand: 'Intel',
      series: 'Core',
      model: cleanName.replace(/Intel\s+Core\s+/i, '').trim()
    };
  }

  return { brand: '', series: '', model: cleanName };
}

function parseGPU(name: string): { brand: string; model: string; chipset: string; isOC: boolean; vram: string } {
  const original = name.trim();
  const upper = original.toUpperCase();

  // 1. Marca
  let brand = '';
  const brandMap: Record<string, string> = {
    'ASUS': 'ASUS',
    'MSI': 'MSI',
    'GIGABYTE': 'Gigabyte',
    'POWERCOLOR': 'PowerColor',
    'ZOTAC': 'Zotac',
    'PALIT': 'Palit',
    'PNY': 'PNY',
    'INNO3D': 'Inno3D'
  };
  
  for (const [key, value] of Object.entries(brandMap)) {
    if (upper.includes(key)) {
      brand = value;
      break;
    }
  }
  if (!brand) brand = 'NVIDIA/AMD';

  // 2. VRAM
  let vram = '8GB';
  const vramMatch = upper.match(/(\d+)\s*G(B|DDR)/i);
  if (vramMatch) {
    vram = `${vramMatch[1]}GB`;
  }

  // 3. OC
  const isOC = upper.includes('OC') || upper.includes('OVERCLOCKED');

  // 4. Chipset
  let chipset = '';
  const chipsetPatterns = [
    /RTX\s+\d+\s+TI/i,
    /RTX\s+\d+\s+[A-Z]+/i, // RTX 4070 SUPER
    /RTX\s+\d+/i,
    /RX\s+\d+\s+XTX/i,
    /RX\s+\d+\s+XT/i,
    /RX\s+\d+/i,
    /GTX\s+\d+/i
  ];
  
  for (const pattern of chipsetPatterns) {
    const match = original.match(pattern);
    if (match) {
      chipset = match[0].replace(/\s+/g, ' ').trim();
      break;
    }
  }

  // 5. Serie/Modelo - Palabras clave comunes
  const seriesKeywords = [
    'GAMING', 'VENTUS', 'SUPRIM', 'TRIO', 'DUKE', 'EAGLE', 'AERO', 
    'STRIX', 'TUF', 'ROG', 'PHANTOM', 'HELLHOUND', 'PULSE', 'MECH'
  ];
  
  let seriesParts: string[] = [];
  for (const keyword of seriesKeywords) {
    if (upper.includes(keyword)) {
      seriesParts.push(keyword);
    }
  }

  // 6. Color
  let color = '';
  if (upper.includes('BLANCO') || upper.includes('WHITE')) color = 'WHITE';
  else if (upper.includes('NEGRO') || upper.includes('BLACK')) color = 'BLACK';
  else if (upper.includes('ROJO') || upper.includes('RED')) color = 'RED';

  // 7. Construir modelo final
  let model = seriesParts.join(' ');
  if (color) {
    model = model ? `${model} ${color}` : color;
  }

  return { brand, model: model.trim(), chipset, isOC, vram };
}

function parseStorage(name: string): { type: string; brand: string; model: string; capacity: string; formFactor: string; interface: string; protocol: string } {
  const upper = name.toUpperCase();

  // Tipo
  let type = 'SSD';
  if (upper.includes('HDD') || upper.includes('DISCO DURO')) type = 'HDD';

  // Capacidad
  const capMatch = upper.match(/(\d+TB|\d+GB)/);
  const capacity = capMatch ? capMatch[1] : '1TB';

  // Factor de forma
  let formFactor = '2.5"';
  if (upper.includes('M.2')) formFactor = 'M.2';
  else if (upper.includes('M2')) formFactor = 'M.2';

  // Interfaz/Protocolo
  let interfaceType = 'SATA';
  let protocol = 'SATA III';
  if (upper.includes('NVME') || upper.includes('GEN4') || upper.includes('GEN5')) {
    interfaceType = 'M.2';
    protocol = upper.includes('GEN5') ? 'Gen5 NVMe' : upper.includes('GEN4') ? 'Gen4 NVMe' : 'NVMe';
  }

  // Marca y modelo
  const brandList = ['ADATA', 'SAMSUNG', 'WD', 'WESTERN DIGITAL', 'KINGSTON', 'CRUCIAL', 'SEAGATE'];
  let brand = '';
  let model = name;

  for (const b of brandList) {
    if (upper.includes(b)) {
      brand = b;
      model = name.replace(new RegExp(`.*?${b}\\s*`, 'i'), '');
      break;
    }
  }

  // Limpiar capacidad y tec del modelo
  model = model.replace(/(\d+TB|\d+GB|M\.2|NVME|GEN\d|SATA).*$/i, '').trim();

  return { type, brand, model, capacity, formFactor, interface: interfaceType, protocol };
}

function parseMotherboard(name: string): { brand: string; model: string; socket: string; ramSupport: string; size: string } {
  const upper = name.toUpperCase();

  // Marca
  const brands = ['ASUS', 'MSI', 'GIGABYTE', 'ASROCK'];
  let brand = '';
  for (const b of brands) {
    if (upper.includes(b)) {
      brand = b;
      break;
    }
  }

  // Socket
  let socket = 'AM5/LGA1700';
  if (upper.includes('AM5')) socket = 'AM5';
  else if (upper.includes('AM4')) socket = 'AM4';
  else if (upper.includes('LGA1700')) socket = 'LGA1700';
  else if (upper.includes('LGA1200')) socket = 'LGA1200';

  // RAM
  const ramSupport = upper.includes('DDR5') ? 'DDR5' : 'DDR4';

  // Tamaño
  let size = 'ATX';
  if (upper.includes('MICRO') || upper.includes('M-ATX')) size = 'Micro-ATX';
  else if (upper.includes('MINI')) size = 'Mini-ITX';

  // Modelo
  let model = name;
  if (brand) model = model.replace(new RegExp(`^.*?${brand}\\s*`, 'i'), '');
  model = model.replace(/(AM\d|LGA\d+|DDR\d|MICRO|ATX|ITX).*$/i, '').trim();

  return { brand, model, socket, ramSupport, size };
}

function parsePSU(name: string): { brand: string; model: string; wattage: string; certification: string } {
  const upper = name.toUpperCase();

  // Marca
  const brands = ['CORSAIR', 'EVGA', 'SEASONIC', 'THERMALTAKE', 'COOLER MASTER', 'GIGABYTE', 'MSI'];
  let brand = '';
  for (const b of brands) {
    if (upper.includes(b)) {
      brand = b;
      break;
    }
  }

  // Potencia
  const wattMatch = upper.match(/(\d+)W/);
  const wattage = wattMatch ? wattMatch[1] : '650';

  // Certificación
  let certification = '';
  if (upper.includes('80+ GOLD') || upper.includes('80 PLUS GOLD')) certification = '80+ Gold';
  else if (upper.includes('80+ PLATINUM')) certification = '80+ Platinum';
  else if (upper.includes('80+ BRONZE')) certification = '80+ Bronze';
  else if (upper.includes('80+')) certification = '80+';

  // Modelo
  let model = name;
  if (brand) model = model.replace(new RegExp(`^.*?${brand}\\s*`, 'i'), '');
  model = model.replace(/(\d+W|80\+.*).*$/i, '').trim();

  return { brand, model, wattage, certification };
}

function parseCase(name: string): { size: string; brand: string; model: string; color: string } {
  const upper = name.toUpperCase();

  // Tamaño
  let size = 'Mid Tower';
  if (upper.includes('FULL')) size = 'Full Tower';
  else if (upper.includes('MINI')) size = 'Mini Tower';

  // Marca
  const brands = ['NZXT', 'COOLER MASTER', 'LIAN LI', 'MSI', 'ASUS', 'THERMALTAKE', 'CORSAIR'];
  let brand = '';
  for (const b of brands) {
    if (upper.includes(b)) {
      brand = b;
      break;
    }
  }

  // Color
  let color = 'Negro';
  if (upper.includes('BLANCO') || upper.includes('WHITE')) color = 'Blanco';
  else if (upper.includes('ROJO') || upper.includes('RED')) color = 'Rojo';

  // Modelo
  let model = name;
  if (brand) model = model.replace(new RegExp(`^.*?${brand}\\s*`, 'i'), '');
  model = model.replace(/(BLACK|WHITE|ROJO|NEGRO|AIRFLOW|RGB).*$/i, '').trim();

  return { size, brand, model, color };
}

const categories = [
  { value: 'pc-completa', label: 'PC Completa' },
  { value: 'componentes', label: 'Componentes' },
  { value: 'accesorios', label: 'Accesorios' }
]

const subcategories = {
  'pc-completa': ['gaming', 'oficina', 'streaming', 'hogar'],
  'componentes': ['procesadores', 'tarjetas-graficas', 'almacenamiento', 'ram', 'motherboards', 'fuentes-poder', 'gabinetes', 'refrigeracion'],
  'accesorios': ['monitores', 'teclados', 'mouse', 'audifonos', 'sillas']
}

// Tipo para un producto
type ProductForm = {
  name: string;
  description: string;
  price: string;
  cost_price_usd: string;
  margin_percent: number;
  category: string;
  subcategory: string;
  is_featured: boolean;
  is_active: boolean;
  image_url: string;
  provider_url: string;
  extracting: boolean;
  profit?: number;
  locked: boolean;
  specifications: {
    procesador: string;
    tarjeta_grafica: string;
    ram: string;
    almacenamiento: string;
    fuente_poder: string;
    gabinete: string;
    motherboard: string;
    sistema_operativo: string;
  };
};

export default function IntelligentProductCreator() {
  const { authorized, loading: authLoading } = useAdminAuth()
  const router = useRouter()

  // ✅ Estados para modos especiales
  const [accessoriesMode, setAccessoriesMode] = useState(false);
  const [selectedAccessoriesSubcategory, setSelectedAccessoriesSubcategory] = useState('monitores');
  const [fixedMarginMode, setFixedMarginMode] = useState(false);
  const [fixedMarginValue, setFixedMarginValue] = useState(7);

  // ✅ Estado para múltiples productos
  const [products, setProducts] = useState<ProductForm[]>([{
    name: '',
    description: '',
    price: '',
    cost_price_usd: '',
    margin_percent: fixedMarginMode ? fixedMarginValue : 5,
    category: accessoriesMode ? 'accesorios' : '',
    subcategory: accessoriesMode ? selectedAccessoriesSubcategory : '',
    is_featured: false,
    is_active: true,
    image_url: '',
    provider_url: '',
    extracting: false,
    locked: false,
    specifications: {
      procesador: '',
      tarjeta_grafica: '',
      ram: '',
      almacenamiento: '',
      fuente_poder: '',
      gabinete: '',
      motherboard: '',
      sistema_operativo: ''
    }
  }]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Formateadores por subcategoría
  const FORMATTERS = {
    'ram': (name: string) => {
      const parsed = parseRAM(name);
      return `RAM ${parsed.brand} ${parsed.model} ${parsed.technology} ${parsed.capacity} ${parsed.speed}MHz - ${parsed.color}`;
    },
    'procesadores': (name: string) => {
      const parsed = parseCPU(name);
      return `${parsed.brand} ${parsed.series} ${parsed.model}`;
    },
    'tarjetas-graficas': (name: string) => {
      const parsed = parseGPU(name);
      const ocPart = parsed.isOC ? ' OC' : '';
      return `${parsed.brand} ${parsed.chipset} ${parsed.model}${ocPart} ${parsed.vram}`;
    },
    'almacenamiento': (name: string) => {
      const parsed = parseStorage(name);
      return `${parsed.type} ${parsed.brand} ${parsed.model} ${parsed.capacity} ${parsed.formFactor} ${parsed.interface} ${parsed.protocol}`;
    },
    'motherboards': (name: string) => {
      const parsed = parseMotherboard(name);
      return `Placa Madre ${parsed.brand} ${parsed.model} ${parsed.socket} ${parsed.ramSupport} ${parsed.size}`;
    },
    'fuentes-poder': (name: string) => {
      const parsed = parsePSU(name);
      const certPart = parsed.certification ? ` ${parsed.certification}` : '';
      return `Fuente ${parsed.brand} ${parsed.model} ${parsed.wattage}W${certPart}`;
    },
    'gabinetes': (name: string) => {
      const parsed = parseCase(name);
      return `Case ${parsed.size} ${parsed.brand} ${parsed.model} - ${parsed.color}`;
    }
  };

  // Aplicar formato automático SOLO a productos NO bloqueados y NO accesorios
  useEffect(() => {
    setProducts(prev => prev.map(product => {
      if (product.locked || !product.name || product.category === 'accesorios') return product;
      
      const key = product.subcategory;
      if (key && FORMATTERS[key as keyof typeof FORMATTERS]) {
        try {
          const formatter = FORMATTERS[key as keyof typeof FORMATTERS];
          const formattedName = formatter(product.name);
          return { ...product, name: formattedName };
        } catch (error) {
          console.warn('Error formateando nombre:', error);
        }
      }
      return product;
    }));
  }, [products.map(p => `${p.category}-${p.subcategory}`).join(',')]);

  // Calcular precios y ganancias
  useEffect(() => {
    setProducts(prev => prev.map(product => {
      if (product.cost_price_usd) {
        const usdNum = parseFloat(product.cost_price_usd);
        if (!isNaN(usdNum) && usdNum > 0) {
          const costWithIva = usdNum * 1.13 * 505;
          const margin = product.margin_percent / 100;
          const priceWithMargin = costWithIva * (1 + margin);
          const price = Math.ceil(priceWithMargin / 500) * 500;
          const profit = price - costWithIva;
          
          return { 
            ...product, 
            price: price.toString(),
            profit: Math.round(profit)
          };
        }
      }
      return product;
    }));
  }, [products.map(p => `${p.cost_price_usd}-${p.margin_percent}`).join(',')]);

  // Protección de ruta
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-200">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (authorized === false) {
    router.push('/admin/login')
    return null
  }

  // ✅ EXTRAER datos para un producto específico
  const extractFromURL = async (index: number) => {
    const url = products[index].provider_url;
    if (!url) return;

    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = { ...newProducts[index], extracting: true };
      return newProducts;
    });

    try {
const response = await fetch('/api/extract-eurocomp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('El servidor no devolvió JSON');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al extraer datos');
      }

      const data = await response.json();

      setProducts(prev => {
        const newProducts = [...prev];
        newProducts[index] = {
          ...newProducts[index],
          name: data.name || newProducts[index].name,
          description: data.description || newProducts[index].description,
          image_url: data.image || newProducts[index].image_url,
          extracting: false
        };
        return newProducts;
      });
      
    } catch (error: any) {
      alert('❌ Error al extraer datos del proveedor: ' + error.message);
      setProducts(prev => {
        const newProducts = [...prev];
        newProducts[index] = { ...newProducts[index], extracting: false };
        return newProducts;
      });
    }
  };

  // Funciones para manejar múltiples productos
  const updateProduct = (index: number, field: keyof ProductForm, value: any) => {
    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = { ...newProducts[index], [field]: value };
      return newProducts;
    });
  };

  const updateProductSpec = (index: number, key: string, value: string) => {
    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = {
        ...newProducts[index],
        specifications: {
          ...newProducts[index].specifications,
          [key]: value
        }
      };
      return newProducts;
    });
  };

  const toggleLock = (index: number) => {
    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = { 
        ...newProducts[index], 
        locked: !newProducts[index].locked 
      };
      return newProducts;
    });
  };

  const addProduct = () => {
    const newProduct: ProductForm = {
      name: '',
      description: '',
      price: '',
      cost_price_usd: '',
      margin_percent: fixedMarginMode ? fixedMarginValue : 5,
      category: accessoriesMode ? 'accesorios' : '',
      subcategory: accessoriesMode ? selectedAccessoriesSubcategory : '',
      is_featured: false,
      is_active: true,
      image_url: '',
      provider_url: '',
      extracting: false,
      locked: false,
      specifications: {
        procesador: '',
        tarjeta_grafica: '',
        ram: '',
        almacenamiento: '',
        fuente_poder: '',
        gabinete: '',
        motherboard: '',
        sistema_operativo: ''
      }
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const removeProduct = (index: number) => {
    if (products.length <= 1) return;
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      for (const product of products) {
        if (product.name && product.price) {
          const { error } = await supabase
            .from('products')
            .insert({
              name: product.name,
              description: product.description,
              price: parseFloat(product.price),
              category: product.category,
              subcategory: product.subcategory,
              is_featured: product.is_featured,
              is_active: product.is_active,
              specifications: product.specifications,
              image_url: product.image_url || null
            });

          if (error) throw error;
        }
      }

      router.push('/admin/products');
    } catch (error: any) {
      alert('Error al crear los productos: ' + (error.message || 'Verifica los datos'));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fakeUrl = URL.createObjectURL(file);
      updateProduct(index, 'image_url', fakeUrl);
    } catch (error) {
      alert('❌ Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/products"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Crear Productos Inteligentes</h1>
              <p className="text-blue-200">Agrega múltiples productos con extracción individual</p>
            </div>
          </div>
        </div>

        {/* Modo Accesorios */}
        <div className="mb-6 bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Modo Accesorios</span>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={accessoriesMode}
                  onChange={(e) => setAccessoriesMode(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-slate-300">Activar</span>
              </label>
              
              {accessoriesMode && (
                <select
                  value={selectedAccessoriesSubcategory}
                  onChange={(e) => setSelectedAccessoriesSubcategory(e.target.value)}
                  className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  {subcategories['accesorios'].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Cuando está activo, todos los nuevos productos se crearán como accesorios sin formateo automático.
          </p>
        </div>

        {/* Modo Margen Fijo */}
        <div className="mb-8 bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Margen Fijo</span>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={fixedMarginMode}
                  onChange={(e) => setFixedMarginMode(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-slate-300">Activar</span>
              </label>
              
              {fixedMarginMode && (
                <select
                  value={fixedMarginValue}
                  onChange={(e) => setFixedMarginValue(parseInt(e.target.value))}
                  className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  {[5, 7, 10].map(percent => (
                    <option key={percent} value={percent}>{percent}%</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Cuando está activo, todos los nuevos productos usarán este margen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Lista de productos */}
          {products.map((product, index) => (
            <div key={index} className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Producto {index + 1}</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLock(index)}
                    className={`p-2 rounded-lg transition-colors ${
                      product.locked 
                        ? 'text-green-400 hover:text-green-300 hover:bg-green-900/30' 
                        : 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30'
                    }`}
                    title={product.locked ? 'Desbloquear producto' : 'Bloquear producto'}
                  >
                    {product.locked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                  </button>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* URL del proveedor individual */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  URL del producto del proveedor *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={product.provider_url}
                    onChange={(e) => updateProduct(index, 'provider_url', e.target.value)}
                    placeholder="https://proveedor.com/producto/12345"
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                    disabled={product.locked}
                  />
                  <button
                    type="button"
                    onClick={() => extractFromURL(index)}
                    disabled={!product.provider_url || product.extracting || product.locked}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50"
                  >
                    {product.extracting ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      'Extraer'
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(index, 'name', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                    disabled={product.locked}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Precio de compra (USD) *</label>
                  <input
                    type="number"
                    value={product.cost_price_usd}
                    onChange={(e) => updateProduct(index, 'cost_price_usd', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="185.00"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                    disabled={product.locked}
                  />
                </div>
                
                {/* Categoría y subcategoría */}
                {!accessoriesMode && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Categoría *</label>
                      <select
                        value={product.category}
                        onChange={(e) => updateProduct(index, 'category', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        disabled={product.locked}
                      >
                        <option value="">Seleccionar</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Subcategoría</label>
                      <select
                        value={product.subcategory}
                        onChange={(e) => updateProduct(index, 'subcategory', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        disabled={!product.category || product.locked}
                      >
                        <option value="">Seleccionar</option>
                        {product.category && subcategories[product.category as keyof typeof subcategories]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Margen de ganancia */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-blue-200 mb-2">Margen de Ganancia</h4>
                <div className="flex flex-wrap gap-4">
                  {[5, 7, 10].map(percent => (
                    <label key={percent} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`margin-${index}`}
                        checked={product.margin_percent === percent}
                        onChange={() => updateProduct(index, 'margin_percent', percent)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        disabled={product.locked || fixedMarginMode}
                      />
                      <span className="text-white">{percent}%</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resumen de precios y ganancia */}
              {product.cost_price_usd && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-green-300">Costo con IVA:</span>
                      <span className="text-white ml-2">
                        ₡{Math.round(parseFloat(product.cost_price_usd) * 1.13 * 505).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-300">Precio venta:</span>
                      <span className="text-white ml-2">₡{parseInt(product.price || '0').toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-green-300">Ganancia:</span>
                      <span className="text-white ml-2">
                        ₡{(product.profit || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Imagen */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-2">URL de imagen (opcional)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={product.image_url}
                    onChange={(e) => updateProduct(index, 'image_url', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                    disabled={product.locked}
                  />
                  <label className={`px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white cursor-pointer transition ${
                    product.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600'
                  }`}>
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                      disabled={product.locked}
                    />
                  </label>
                </div>
                {product.image_url && (
                  <div className="mt-2">
                    <img
                      src={product.image_url}
                      alt="Vista previa"
                      className="w-24 h-24 object-contain rounded-lg border border-slate-600"
                    />
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-2">Descripción *</label>
                <textarea
                  rows={3}
                  value={product.description}
                  onChange={(e) => updateProduct(index, 'description', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={product.locked}
                />
              </div>

              {/* Especificaciones Técnicas */}
              {product.category === 'pc-completa' && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-blue-200 mb-3">Especificaciones Técnicas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-blue-200 mb-1">Procesador</label>
                      <input
                        type="text"
                        value={product.specifications.procesador}
                        onChange={(e) => updateProductSpec(index, 'procesador', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={product.locked}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-200 mb-1">Tarjeta Gráfica</label>
                      <input
                        type="text"
                        value={product.specifications.tarjeta_grafica}
                        onChange={(e) => updateProductSpec(index, 'tarjeta_grafica', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={product.locked}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-200 mb-1">RAM</label>
                      <input
                        type="text"
                        value={product.specifications.ram}
                        onChange={(e) => updateProductSpec(index, 'ram', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={product.locked}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-200 mb-1">Almacenamiento</label>
                      <input
                        type="text"
                        value={product.specifications.almacenamiento}
                        onChange={(e) => updateProductSpec(index, 'almacenamiento', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={product.locked}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-200 mb-1">Fuente de Poder</label>
                      <input
                        type="text"
                        value={product.specifications.fuente_poder}
                        onChange={(e) => updateProductSpec(index, 'fuente_poder', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={product.locked}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-200 mb-1">Gabinete</label>
                      <input
                        type="text"
                        value={product.specifications.gabinete}
                        onChange={(e) => updateProductSpec(index, 'gabinete', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={product.locked}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-200 mb-1">Motherboard</label>
                      <input
                        type="text"
                        value={product.specifications.motherboard}
                        onChange={(e) => updateProductSpec(index, 'motherboard', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={product.locked}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-200 mb-1">Sistema Operativo</label>
                      <input
                        type="text"
                        value={product.specifications.sistema_operativo}
                        onChange={(e) => updateProductSpec(index, 'sistema_operativo', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={product.locked}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Opciones */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={product.is_featured}
                    onChange={(e) => updateProduct(index, 'is_featured', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={product.locked}
                  />
                  <span className="text-sm text-blue-200">Destacado</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={product.is_active}
                    onChange={(e) => updateProduct(index, 'is_active', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={product.locked}
                  />
                  <span className="text-sm text-blue-200">Activo</span>
                </label>
              </div>
            </div>
          ))}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              Agregar Producto
            </button>
            
            <div className="flex gap-4 ml-auto">
              <Link
                href="/admin/products"
                className="px-6 py-3 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Guardar Todos</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}