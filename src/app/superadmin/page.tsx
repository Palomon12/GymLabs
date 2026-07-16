"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Users, Calendar, Activity, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/context/AuthContext";

export default function SuperAdminPage() {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<any>(null);

  // Admin Details states
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nombreGimnasio: "",
    direccion: "",
    adminNombre: "",
    adminApellido: "",
    adminDni: "",
    adminTelefono: "",
    adminCorreo: "",
    adminPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEmpresas = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/empresas`, { credentials: "include",
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEmpresas(data);
      }
    } catch (error) {
      console.error("Error fetching empresas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, [user]);

  useEffect(() => {
    if (selectedEmpresa && user) {
      setIsAdminLoading(true);
      fetch(`${API_BASE_URL}/personal`, { credentials: "include",
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Encontrar al admin de esta empresa (rol 1)
        const admin = data.find((p: any) => 
          p.sede?.empresa?.idEmpresa === selectedEmpresa.idEmpresa && p.rol?.idRol === 1
        );
        if (admin) {
          setAdminInfo({ ...admin, password: "" }); // Reset password field
        } else {
          setAdminInfo(null);
        }
      })
      .catch(err => console.error("Error cargando admin:", err))
      .finally(() => setIsAdminLoading(false));
    } else {
      setAdminInfo(null);
    }
  }, [selectedEmpresa, user]);

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !adminInfo) return;
    setIsUpdatingAdmin(true);
    try {
      if (adminInfo.idPersonal) {
        // Update existing admin
        const res = await fetch(`${API_BASE_URL}/personal/${adminInfo.idPersonal}`, { credentials: "include",
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(adminInfo)
        });
        if (res.ok) {
          alert("Datos del administrador actualizados correctamente");
        } else {
          alert("Error al actualizar administrador");
        }
      } else {
        // Create new admin
        // 1. Fetch sedes to find the sede for this empresa
        const sedesRes = await fetch(`${API_BASE_URL}/sedes`, { credentials: "include",
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const sedes = await sedesRes.json();
        const sede = sedes.find((s: any) => s.empresa?.idEmpresa === selectedEmpresa.idEmpresa);
        
        if (!sede) {
          alert("No se encontró una sede para esta empresa. No se puede crear el admin.");
          setIsUpdatingAdmin(false);
          return;
        }

        const nuevoAdmin = {
          ...adminInfo,
          fechaContratacion: new Date().toISOString().split('T')[0],
          activo: true,
          rol: { idRol: 1 },
          sede: { idSede: sede.idSede }
        };

        const res = await fetch(`${API_BASE_URL}/personal`, { credentials: "include",
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(nuevoAdmin)
        });

        if (res.ok) {
          alert("Administrador asignado correctamente");
          const createdAdmin = await res.json();
          setAdminInfo({ ...createdAdmin, password: "" });
        } else {
          alert("Error al crear el administrador");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setIsUpdatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminInfo || !adminInfo.idPersonal || !user) return;
    
    if (!window.confirm("¿Estás seguro de que deseas eliminar este administrador?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/personal/${adminInfo.idPersonal}`, { credentials: "include",
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      if (res.ok) {
        alert("Administrador eliminado");
        setAdminInfo(null);
      } else {
        alert("Error al eliminar administrador");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al intentar eliminar");
    }
  };

  const handleDeleteEmpresa = async () => {
    if (!selectedEmpresa || !user) return;
    
    if (!window.confirm("¿Estás seguro de que deseas eliminar a esta empresa y todo su historial de datos? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/empresas/${selectedEmpresa.idEmpresa}`, { credentials: "include",
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (res.ok) {
        alert("Empresa eliminada exitosamente");
        setSelectedEmpresa(null);
        fetchEmpresas();
      } else {
        alert("Error al eliminar la empresa. Es posible que tenga registros dependientes.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al intentar eliminar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      // 1. Crear Empresa
      const empresaRes = await fetch(`${API_BASE_URL}/empresas`, { credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          nombre: formData.nombreGimnasio,
          direccion: formData.direccion
        })
      });
      
      if (!empresaRes.ok) throw new Error("Error creando empresa");
      const nuevaEmpresa = await empresaRes.json();

      // 2. Crear Sede por defecto
      const sedeRes = await fetch(`${API_BASE_URL}/sedes`, { credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          nombre: "Sede Principal",
          direccion: formData.direccion,
          empresa: { idEmpresa: nuevaEmpresa.idEmpresa }
        })
      });

      if (!sedeRes.ok) throw new Error("Error creando sede");
      const nuevaSede = await sedeRes.json();

      // 3. Crear Personal Admin
      const personalRes = await fetch(`${API_BASE_URL}/personal`, { credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          nombre: formData.adminNombre,
          apellido: formData.adminApellido,
          dni: formData.adminDni,
          telefono: formData.adminTelefono,
          correo: formData.adminCorreo,
          password: formData.adminPassword,
          fechaContratacion: new Date().toISOString().split('T')[0],
          activo: true,
          rol: { idRol: 1 }, // Asumiendo que 1 es ADMIN
          sede: { idSede: nuevaSede.idSede }
        })
      });

      if (!personalRes.ok) throw new Error("Error creando admin");

      setShowModal(false);
      fetchEmpresas();
      setFormData({
        nombreGimnasio: "", direccion: "", adminNombre: "", adminApellido: "",
        adminDni: "", adminTelefono: "", adminCorreo: "", adminPassword: ""
      });

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al crear la empresa y su administrador.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            Gestión de Gimnasios (SaaS)
          </h1>
          <p className="text-text-muted mt-2 font-mono text-sm">
            Panel exclusivo para creadores. Monitorea y administra todos los clientes.
          </p>
        </div>
        
        <Button onClick={() => setShowModal(true)} className="gap-2 bg-primary text-black hover:bg-primary/90 font-bold px-6">
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-border p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-text-muted text-sm font-mono uppercase tracking-wider">Total Gimnasios</p>
              <h3 className="text-3xl font-bold text-white mt-1">{empresas.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-surface-light/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">ID</th>
                <th className="px-6 py-4 font-bold tracking-wider">Empresa (Gimnasio)</th>
                <th className="px-6 py-4 font-bold tracking-wider">Dirección</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-text-muted">Cargando...</td></tr>
              ) : empresas.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-text-muted">No hay empresas registradas</td></tr>
              ) : (
                empresas.map((emp) => (
                  <tr key={emp.idEmpresa} className="border-b border-border/10 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-text-muted">#{emp.idEmpresa}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {emp.nombre.charAt(0)}
                        </div>
                        <span className="font-medium text-white">{emp.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{emp.direccion}</td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedEmpresa(emp)}
                        className="border-border hover:bg-white/5"
                      >
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border/50 sticky top-0 bg-surface z-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                Registrar Nuevo Gimnasio
              </h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Sección Empresa */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary tracking-widest uppercase font-mono flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 1. Datos del Negocio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted uppercase">Nombre del Gimnasio</label>
                    <input 
                      required
                      type="text" 
                      value={formData.nombreGimnasio}
                      onChange={e => setFormData({...formData, nombreGimnasio: e.target.value})}
                      className="w-full bg-[#0A0F0D] border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted uppercase">Dirección Principal</label>
                    <input 
                      required
                      type="text" 
                      value={formData.direccion}
                      onChange={e => setFormData({...formData, direccion: e.target.value})}
                      className="w-full bg-[#0A0F0D] border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Sección Admin */}
              <div className="space-y-4 pt-4 border-t border-border/30">
                <h3 className="text-sm font-bold text-primary tracking-widest uppercase font-mono flex items-center gap-2">
                  <Key className="w-4 h-4" /> 2. Cuenta de Administrador
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted uppercase">Nombre</label>
                    <input 
                      required
                      type="text" 
                      value={formData.adminNombre}
                      onChange={e => setFormData({...formData, adminNombre: e.target.value})}
                      className="w-full bg-[#0A0F0D] border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted uppercase">Apellido</label>
                    <input 
                      required
                      type="text" 
                      value={formData.adminApellido}
                      onChange={e => setFormData({...formData, adminApellido: e.target.value})}
                      className="w-full bg-[#0A0F0D] border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted uppercase">DNI</label>
                    <input 
                      required
                      type="text" 
                      value={formData.adminDni}
                      onChange={e => setFormData({...formData, adminDni: e.target.value})}
                      className="w-full bg-[#0A0F0D] border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted uppercase">Teléfono</label>
                    <input 
                      required
                      type="text" 
                      value={formData.adminTelefono}
                      onChange={e => setFormData({...formData, adminTelefono: e.target.value})}
                      className="w-full bg-[#0A0F0D] border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted uppercase">Correo Electrónico (Login)</label>
                    <input 
                      required
                      type="email" 
                      value={formData.adminCorreo}
                      onChange={e => setFormData({...formData, adminCorreo: e.target.value})}
                      className="w-full bg-[#0A0F0D] border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted uppercase">Contraseña Temporal</label>
                    <input 
                      required
                      type="text" 
                      value={formData.adminPassword}
                      onChange={e => setFormData({...formData, adminPassword: e.target.value})}
                      className="w-full bg-[#0A0F0D] border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="border-border text-text-muted">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary text-black font-bold">
                  {isSubmitting ? "Procesando..." : "Crear Gimnasio y Admin"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEmpresa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border/50 sticky top-0 bg-surface z-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                Información del Cliente
              </h2>
              <button onClick={() => setSelectedEmpresa(null)} className="text-text-muted hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-4xl font-bold uppercase shrink-0">
                  {selectedEmpresa.nombre.charAt(0)}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-3xl font-bold text-white tracking-tight">{selectedEmpresa.nombre}</h3>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    SaaS Activo
                  </div>
                  <p className="text-text-muted font-mono text-sm pt-2">
                    ID Interno: #{selectedEmpresa.idEmpresa}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary tracking-widest uppercase font-mono">
                  Datos de Contacto
                </h4>
                <div className="bg-[#0A0F0D] border border-border/50 rounded-lg p-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-xs text-text-muted uppercase tracking-wider block mb-1">Dirección Registrada</label>
                      <p className="text-white font-medium text-lg">{selectedEmpresa.direccion}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Credentials */}
              <div className="space-y-4 pt-4 border-t border-border/30">
                <h4 className="text-sm font-bold text-primary tracking-widest uppercase font-mono flex items-center justify-between">
                  <span>Credenciales del Administrador</span>
                  {isAdminLoading && <span className="text-xs text-text-muted normal-case tracking-normal animate-pulse">Cargando...</span>}
                </h4>
                
                {adminInfo ? (
                  <form onSubmit={handleUpdateAdmin} className="bg-[#0A0F0D] border border-border/50 rounded-lg p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-text-muted uppercase tracking-wider block mb-2">Nombre</label>
                        <input 
                          type="text" required value={adminInfo.nombre || ""}
                          onChange={(e) => setAdminInfo({...adminInfo, nombre: e.target.value})}
                          className="w-full bg-[#111111] border border-border rounded px-4 py-2 text-white focus:border-primary outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted uppercase tracking-wider block mb-2">Apellido</label>
                        <input 
                          type="text" required value={adminInfo.apellido || ""}
                          onChange={(e) => setAdminInfo({...adminInfo, apellido: e.target.value})}
                          className="w-full bg-[#111111] border border-border rounded px-4 py-2 text-white focus:border-primary outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted uppercase tracking-wider block mb-2">DNI</label>
                        <input 
                          type="text" required value={adminInfo.dni || ""}
                          onChange={(e) => setAdminInfo({...adminInfo, dni: e.target.value})}
                          className="w-full bg-[#111111] border border-border rounded px-4 py-2 text-white focus:border-primary outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted uppercase tracking-wider block mb-2">Teléfono</label>
                        <input 
                          type="text" required value={adminInfo.telefono || ""}
                          onChange={(e) => setAdminInfo({...adminInfo, telefono: e.target.value})}
                          className="w-full bg-[#111111] border border-border rounded px-4 py-2 text-white focus:border-primary outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted uppercase tracking-wider block mb-2">Correo (Usuario)</label>
                        <input 
                          type="email" required value={adminInfo.correo || ""}
                          onChange={(e) => setAdminInfo({...adminInfo, correo: e.target.value})}
                          className="w-full bg-[#111111] border border-border rounded px-4 py-2 text-white focus:border-primary outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted uppercase tracking-wider block mb-2">Nueva Contraseña</label>
                        <input 
                          type="text" placeholder="Dejar en blanco para no cambiar" value={adminInfo.password || ""}
                          onChange={(e) => setAdminInfo({...adminInfo, password: e.target.value})}
                          className="w-full bg-[#111111] border border-border rounded px-4 py-2 text-white focus:border-primary outline-none" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border/30">
                      {adminInfo.idPersonal ? (
                        <Button type="button" onClick={handleDeleteAdmin} variant="outline" size="sm" className="border-alert text-alert hover:bg-alert/10">
                          Eliminar Administrador
                        </Button>
                      ) : (
                        <div></div> // Spacer para alinear a la derecha
                      )}
                      <Button type="submit" disabled={isUpdatingAdmin} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                        {isUpdatingAdmin ? "Guardando..." : (adminInfo.idPersonal ? "Actualizar Datos" : "Crear Administrador")}
                      </Button>
                    </div>
                  </form>
                ) : (
                  !isAdminLoading && (
                    <div className="text-sm text-alert bg-alert/10 p-4 rounded-md flex justify-between items-center border border-alert/20">
                      <span>No se encontró cuenta de administrador para esta empresa.</span>
                      <Button onClick={() => setAdminInfo({})} size="sm" variant="outline" className="border-alert hover:bg-alert/20 text-alert font-bold">
                        Asignar Administrador
                      </Button>
                    </div>
                  )
                )}
              </div>

              <div className="pt-6 border-t border-border/50 flex justify-between items-center">
                <Button onClick={handleDeleteEmpresa} variant="outline" className="border-alert text-alert hover:bg-alert/10 font-bold px-6">
                  Eliminar Empresa
                </Button>
                <Button onClick={() => setSelectedEmpresa(null)} className="bg-primary text-black font-bold px-8">
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
