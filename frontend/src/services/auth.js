const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';
const STORAGE_KEY = 'soundbook_auth';

const readJson = async (response) => {
    try {
        return await response.json();
    } catch {
        return {};
    }
};

const buildHeaders = (includeAuth = false) => {
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    if (includeAuth) {
        const token = getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    return headers;
};

export const isAdminRole = (role) => ['ADMIN', 'MODERATOR'].includes((role || '').toUpperCase());

export const resolveHomePath = (role) => (isAdminRole(role) ? '/admin' : '/feed');

export const getStoredAuth = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const saveAuth = (auth) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    if (auth?.token) {
        localStorage.setItem('token', auth.token);
    }
};

export const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
};

export const getToken = () => getStoredAuth()?.token || localStorage.getItem('token');

export const request = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...buildHeaders(Boolean(options.auth)),
            ...(options.headers || {}),
        },
    });

    const payload = await readJson(response);

    if (!response.ok) {
        throw new Error(payload?.message || 'Request failed');
    }

    return payload;
};

const persistAuthFromResponse = (payload) => {
    const auth = {
        token: payload?.data?.token,
        user: {
            id: payload?.data?.userId,
            email: payload?.data?.email,
            displayName: payload?.data?.displayName,
            role: payload?.data?.role,
        },
    };

    saveAuth(auth);
    return payload;
};

export const login = async ({ email, password, loginType }) => {
    const payload = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, loginType }),
    });

    return persistAuthFromResponse(payload);
};

export const register = async ({ email, password, displayName }) => {
    const payload = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName }),
    });

    return persistAuthFromResponse(payload);
};

export const loginWithGoogle = async (idToken) => {
    const payload = await request('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
    });

    return persistAuthFromResponse(payload);
};

export const fetchCurrentUser = async () => {
    const payload = await request('/auth/me', {
        method: 'GET',
        auth: true,
    });

    const current = getStoredAuth();
    saveAuth({
        token: current?.token,
        user: payload?.data,
    });

    return payload;
};

export const logout = async () => {
    try {
        await request('/auth/logout', {
            method: 'POST',
            auth: true,
        });
    } finally {
        clearAuth();
    }
};

export { API_BASE_URL };