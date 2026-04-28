const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';
const STORAGE_KEY = 'soundbook_auth';

const readJson = async (response) => {
    try {
        return await response.json();
    } catch {
        return {};
    }
};

const normalizeRole = (role) => String(role || '').trim().toUpperCase().replace(/^ROLE_/, '');

const safeParse = (value) => {
    try {
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
};

export const isAdminRole = (role) => ['ADMIN', 'MODERATOR'].includes(normalizeRole(role));

export const resolveHomePath = (role) => (isAdminRole(role) ? '/admin' : '/feed');

export const getStoredAuth = () => safeParse(localStorage.getItem(STORAGE_KEY));

export const getToken = () => getStoredAuth()?.token || localStorage.getItem('token');

export const getCurrentUser = () => getStoredAuth()?.user || null;

export const isLoggedIn = () => Boolean(getToken());

export const canSwitchAccount = () => !isLoggedIn();

export const saveAuth = (auth) => {
    const normalizedAuth = {
        token: auth?.token || null,
        user: auth?.user
            ? {
                id: auth.user.id ?? null,
                email: auth.user.email ?? '',
                displayName: auth.user.displayName ?? '',
                username: auth.user.username ?? '',
                avatarUrl: auth.user.avatarUrl ?? '',
                role: normalizeRole(auth.user.role),
            }
            : null,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedAuth));

    if (normalizedAuth.token) {
        localStorage.setItem('token', normalizedAuth.token);
    } else {
        localStorage.removeItem('token');
    }
};

export const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
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
        throw new Error(payload?.message || payload?.error || 'Request failed');
    }

    return payload;
};

const persistAuthFromResponse = (payload) => {
    const auth = {
        token: payload?.data?.token || null,
        user: {
            id: payload?.data?.userId ?? null,
            email: payload?.data?.email ?? '',
            displayName: payload?.data?.displayName ?? '',
            role: payload?.data?.role ?? '',
        },
    };

    saveAuth(auth);
    return payload;
};

const assertSessionIsAvailable = () => {
    if (!canSwitchAccount()) {
        const currentUser = getCurrentUser();
        const displayName = currentUser?.displayName || currentUser?.email || 'tài khoản hiện tại';
        throw new Error(`Bạn đang đăng nhập bằng ${displayName}. Hãy logout trước khi đăng nhập tài khoản khác.`);
    }
};

export const login = async ({ email, password }) => {
    assertSessionIsAvailable();

    const payload = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    return persistAuthFromResponse(payload);
};

export const register = async ({ email, password, displayName }) => {
    assertSessionIsAvailable();

    const payload = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName }),
    });

    return persistAuthFromResponse(payload);
};

export const loginWithGoogle = async (idToken) => {
    assertSessionIsAvailable();

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
        if (getToken()) {
            await request('/auth/logout', {
                method: 'POST',
                auth: true,
            });
        }
    } finally {
        clearAuth();
    }
};

export { API_BASE_URL, normalizeRole };