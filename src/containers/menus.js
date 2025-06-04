const menus = [
    {
        _tag: 'CSidebarNavItem', name: '', to: '', icon: '',
    },
    {
        _tag: 'CSidebarNavDropdown', name: 'Transacciones', to: '/Despacho', icon: 'cil-description', _children: [
            { _tag: 'CSidebarNavItem', name: 'Dispensacion', to: '/DespachoInter' },
            { _tag: 'CSidebarNavItem', name: 'Dispensacion Manual', to: '/DespachoManual' },
            { _tag: 'CSidebarNavItem', name: 'Operaciones con Entregas', to: '/Entregas' },
            { _tag: 'CSidebarNavItem', name: 'Operaciones con Pendientes', to: '/Pendientes' },
            {
                _tag: 'CSidebarNavDropdown', name: 'Domicilios', icon: 'cil-cloud-upload', _children: [
                    {
                        _tag: 'CSidebarNavItem', name: 'Cargar Archivos Excel', to: '/Domiciliario/CargarArchivo'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Dispensar', to: '/Despacho'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Armar Cajas', to: '/Domiciliario/Despachar'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Corte', to: '/Domiciliario/Corte'
                    }
                ],
            },
        ]
    },
    {
        _tag: 'CSidebarNavDropdown', name: 'Catalogos', icon: 'cil-loop', _children: [
            {
                _tag: 'CSidebarNavDropdown', name: 'Medicamentos', route: '/Maestros/BusquedaMed', _children: [
                    {
                        _tag: 'CSidebarNavItem', name: 'Medicamentos', to: '/Maestros/BusquedaMed'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Formas Farmaceúticas', to: '/Maestros/BusquedaFormFtica'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Vías Administración', to: '/Maestros/BusquedaViasAdmin'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Unidades Medida', to: '/Maestros/BusquedaUni'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Ubicaciones', to: '/Maestros/BusquedaUbi'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Modalidades', to: '/Maestros/BusquedaMod'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'ATC', to: '/Maestros/BusquedaATC'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Estados Registro Invima', to: '/Maestros/BusquedaEstadoRInv'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Grupos Registro Invima', to: '/Maestros/BusquedaGrupoRInv'
                    },
                ],
            },
            {
                _tag: 'CSidebarNavDropdown', name: 'Pacientes', to: '/Maestros/BusquedaPas', _children: [
                    {
                        _tag: 'CSidebarNavItem', name: 'Pacientes', to: '/Maestros/BusquedaPas'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Tipos Identificación', to: '/Maestros/BusquedatiposId'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Géneros', to: '/Maestros/BusquedaGen'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Niveles Escolaridad', to: '/Maestros/BusquedaNivelEsc'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Regímenes', to: '/Maestros/BusquedaReg'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Planes', to: '/Maestros/BusquedaPlanes'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Afiliaciones', to: '/Maestros/BusquedaAfil'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Ciudades', to: '/Maestros/BusquedaCiudades'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Departamentos', to: '/Maestros/BusquedaDepartamentos'
                    },
                    {
                        _tag: 'CSidebarNavItem', name: 'Paises', to: '/Maestros/BusquedaPaises'
                    },
                ],
            },
            {
                _tag: 'CSidebarNavItem', name: 'Convenios', to: '/Maestros/BusquedaConv',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Tipos Entrega', to: '/Maestros/BusquedaTiposEnt',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Parentescos', to: '/Maestros/BusquedaParen',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Medios Pago', to: '/Maestros/BusquedaMediosPago',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Vademecum', to: '/Sales/FacturacionElectronica/ConsultaElectronicBilling',
            },
        ],
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Configuración',
        route: '/Maestros/BusquedaUser',
        icon: 'cil-description',
        _children: [
            {
                _tag: 'CSidebarNavItem', name: 'Sedes', to: '/Maestros/BusquedaSedes',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Roles', to: '/Maestros/BusquedaRoles',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Roles x Sedes', to: '/Maestros/BusquedaRolesSedes',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Consecutivos', to: '/Maestros/BusquedaConsecutivos',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Usuarios', to: '/Maestros/BusquedaUser',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Perfiles', to: '/Maestros/BusquedaPerf',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Menu', to: '/Maestros/BusquedaMenus',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Medios de Pago', to: '/Maestros/BusquedaMediosPago',
            },
            {
                _tag: 'CSidebarNavItem', name: 'Test', to: '/Test',
            },
        ],
    },
]
export default menus