import axios from 'axios';

/**
 * Instancia global de Axios para peticiones HTTP con credenciales y manejo de interceptores.
 */
const axiosInstance = axios.create({
    withCredentials: true,
});

/**
 * Endpoints principales de la API
 */
const BASE_URL = 'http://localhost:8000/api/';
const LOGIN_URL = `${BASE_URL}auth/login/`;
const REFRESH_TOKEN_URL = `${BASE_URL}auth/token/refresh-cookie/`;
const ME_URL = `${BASE_URL}auth/me/`;
const LOGOUT_URL = `${BASE_URL}auth/logout-cookie/`;
const REGISTER_URL = `${BASE_URL}auth/register/`;
const GET_UNITS_PRODUCT_URL = `${BASE_URL}business/products/unidad-medida/`;
const LIST_PRODUCTS_URL = `${BASE_URL}business/products/business/`;
const CREATE_PRODUCT_URL = `${BASE_URL}business/products/register/`;
const LIST_ATTRIBUTES_NAMES_URL = `${BASE_URL}business/products/attribute-names/`;
const CREATE_ATTRIBUTE_NAME_URL = `${BASE_URL}business/products/attribute-names/create/`;
const GET_DETAIL_PRODUCT_URL = `${BASE_URL}business/products/detail/`;

/**
 * Inicia sesión con usuario y contraseña.
 * @param username - Nombre de usuario
 * @param password - Contraseña
 * @returns true si el login fue exitoso
 */
export const login = async (username: string, password: string): Promise<any> => {
    const response = await axiosInstance.post(LOGIN_URL,
        { username: username, password: password }
    );
    return response.data.success;
}

/**
 * Refresca el token de autenticación usando cookies.
 * @returns true si el token fue refrescado correctamente
 */
export const refreshToken = async (): Promise<any> => {
    try {
        await axiosInstance.post(REFRESH_TOKEN_URL, {});
        return true;
    } catch (error) {
        return false;
    }
}

// const call_refresh = async (error: any, func: Function) => {
//     if (error.response && error.response.status === 401) {
//         const tokenRefreshed = await refreshToken();
//         if (tokenRefreshed) {
//             const retryResponse = await func();
//             return retryResponse;
//         }
//     }
//     return false
// }

/**
 * Obtiene los datos del usuario autenticado.
 * @returns Datos del usuario o null si falla
 */
export const getMe = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(ME_URL);
        return response.data;
    } catch (error) {
        return null;
    }
}

/**
 * Cierra la sesión del usuario actual.
 * @returns true si el logout fue exitoso
 */
export const logout = async (): Promise<any> => {
    try {
        await axiosInstance.post(LOGOUT_URL, {});
        return true;
    } catch (error) {
        return false;
    }
}


/**
 * Estructura de datos para registro de usuario
 */
export interface RegisterData {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    cedula: string;
    telefono: string;
    fecha_nacimiento?: string;
}

/**
 * Registra un nuevo usuario en el sistema.
 * @param data - Datos del usuario
 * @returns Respuesta del backend
 */
export const registerAPI = async (data: RegisterData): Promise<any> => {
    // Solo envía los campos requeridos por el backend
    const payload: any = {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        cedula: data.cedula,
        telefono: data.telefono,
    };
    if (data.fecha_nacimiento) {
        payload.fecha_nacimiento = data.fecha_nacimiento;
    }
    const response = await axiosInstance.post(REGISTER_URL, payload);
    return response.data;
}

/**
 * Lista los productos de un negocio específico.
 * @param business_id - ID del negocio
 * @returns Array de productos
 */
export const listProducts = async (business_id: number): Promise<any> => {
    const response = await axiosInstance.get(`${LIST_PRODUCTS_URL}${business_id}`);
    return response.data;
}

/**
 * Estructura de datos para registrar un producto
 */
export interface RegisterProductData {
    name: string;
    price_base: number;
    descripcion?: string;
    tipoProducto: "simple" | "variantes";
    attributes?: {
        name: string;
        value: string;
    }[];
    inventario?: {
        unidad_medida: string;
        cantidad: number;
        stock_minimo: number;
    };
    variants?: {
        attributes: {
            name: string;
            value: string;
        }[];
        cantidad: number;
        stock_minimo: number;
    }[];
}

/**
 * Registra un nuevo producto en el sistema.
 * @param data - Datos del producto
 * @returns Respuesta del backend
 */
export const createProduct = async (data: RegisterProductData): Promise<any> => {
    // Adaptar los nombres de los campos antes de enviar al backend
    const payload: any = {
        name: data.name,
        price_base: data.price_base,
        descripcion: data.descripcion,
        tipoProducto: data.tipoProducto,
        attributes: data.attributes,
        inventario: data.inventario,
        variants: data.variants,
    };
    const response = await axiosInstance.post(CREATE_PRODUCT_URL, payload);
    return response.data;
}

/**
 * Obtiene la lista de nombres de atributos disponibles para productos.
 * @returns Array de nombres de atributos
 */
export const listAttributesNames = async (): Promise<any> => {
    const response = await axiosInstance.get(`${LIST_ATTRIBUTES_NAMES_URL}`);
    return response.data;
}

/**
 * Crea un nuevo nombre de atributo para productos.
 * @param data - Objeto con el nombre del atributo
 * @returns Respuesta del backend
 */
export const createAttributeName = async (data: { name: string }): Promise<any> => {
    const response = await axiosInstance.post(CREATE_ATTRIBUTE_NAME_URL, data);
    return response.data;
}

export const getUnitsProduct = async (): Promise<any> => {
    const response = await axiosInstance.get(GET_UNITS_PRODUCT_URL);
    return response.data;
}

export const getDetailProduct = async (product_id: number): Promise<any> => {
    const response = await axiosInstance.get(`${GET_DETAIL_PRODUCT_URL}${product_id}/`);
    return response.data;
}


/**
 * Interceptor global para refrescar el token automáticamente en cualquier petición que reciba un 401.
 */
// Interceptor global para refrescar el token automáticamente en cualquier petición que reciba un 401
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const tokenRefreshed = await refreshToken();
            if (tokenRefreshed) {
                return axiosInstance(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);
