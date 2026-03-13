{/* MAPEO DE PROFESIONALES MEJORADO */}
<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
  {filtrados.map(p => (
    <div key={p.id} className="group bg-white rounded-[2.5rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] hover:-translate-y-2 flex flex-col relative overflow-hidden">
      
      {/* 1. INDICADOR DE NIVEL (PREMIUM/VERIFICADO) */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl">
          {p.categoria} 
        </span>
        
        {p.es_verificado && (
          <div className="flex items-center gap-1.5 bg-sky-500 px-3 py-1.5 rounded-full shadow-lg shadow-sky-100">
            <BadgeCheck size={14} className="text-white" fill="currentColor"/>
            <span className="text-[9px] font-black text-white uppercase tracking-tighter">Verificado</span>
          </div>
        )}
      </div>

      {/* 2. INFORMACIÓN PRINCIPAL */}
      <div className="mb-6">
        <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2 uppercase">
          {p.nombre} 
        </h3>
        <div className="flex items-center gap-1 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
          <MapPin size={14} className="text-rose-500" /> {p.zona} [cite: 32]
        </div>
      </div>

      {/* 3. DESCRIPCIÓN CON ESTILO "QUOTE" */}
      <div className="relative mb-8 flex-grow">
        <p className="text-slate-500 text-[14px] leading-relaxed font-medium italic pl-4 border-l-2 border-slate-100">
          "{p.descripcion || `Profesional destacado en ${p.categoria} en Concepción.`}" [cite: 33, 34]
        </p>
      </div>

      {/* 4. BOTONES DE ACCIÓN (MÁS GRANDES Y LIMPIOS) */}
      <div className="flex gap-3">
        <a 
          href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`¡Hola! Te encontré en Conexión Concepción...`)}`} 
          target="_blank" 
          className="flex-[3] bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-black text-[11px] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-95 tracking-widest uppercase"
        >
          <MessageCircle size={18} fill="currentColor" /> WhatsApp [cite: 35]
        </a>
        
        <a 
          href={p.link_maps || "#"} 
          target="_blank" 
          className="flex-1 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-400 py-4 rounded-2xl transition-all flex items-center justify-center active:scale-95 border border-slate-100"
        >
          <MapPin size={20} />
        </a>
      </div>

      {/* 5. PANEL DE ADMIN (MÁS DISCRETO) */}
      {esAdmin && (
        <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
          <button 
            onClick={() => toggleVerificado(p.id, p.es_verificado)}
            className={`text-[9px] font-black p-2 rounded-lg transition-all ${p.es_verificado ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}
          >
            {p.es_verificado ? "QUITAR VERIFICADO" : "VERIFICAR"} [cite: 40]
          </button>
          <button onClick={() => borrarProfesional(p.id)} className="text-red-300 hover:text-red-600 transition-colors">
            <Trash2 size={18}/>
          </button>
        </div>
      )}
    </div>
  ))}
</div>
