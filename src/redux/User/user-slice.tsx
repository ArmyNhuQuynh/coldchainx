import { apiRequest } from "@/lib/http";
import { authStorageKeys } from "@/lib/auth-session";
import { isTokenExpired } from "@/lib/auth-token";
import type { TAuthResponse } from "@/schemas/auth.schema";
import { RoleSchema, type TRole } from "@/schemas/role.schema";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface UserState {
    user: TAuthResponse | null;
    isAuthenticated: boolean;
    role: TRole | null;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    role: null,
};

const setAuthorizationHeaders = (token: string) => {
    const authHeader = `Bearer ${token}`;
    apiRequest.baseApi.defaults.headers.common.Authorization = authHeader;
};

const clearAuthorizationHeaders = () => {
    apiRequest.baseApi.defaults.headers.common.Authorization = null;
};

const clearStoredAuthData = () => {
    localStorage.removeItem(authStorageKeys.accessToken);
    localStorage.removeItem(authStorageKeys.refreshToken);
    localStorage.removeItem(authStorageKeys.user);
    clearAuthorizationHeaders();
};

const normalizeRole = (role: unknown): TRole | null => {
    if (typeof role === "string") {
        const normalized = role.trim();
        const legacyRoleMap: Record<string, TRole> = {
            SystemAdmin: "Admin",
            SystemManager: "Manager",
            Sales: "Sale",
            Dispatcher: "Dispatcher",
        };

        if (legacyRoleMap[normalized]) {
            return legacyRoleMap[normalized];
        }

        if (RoleSchema.safeParse(normalized).success) {
            return normalized as TRole;
        }
    }

    if (typeof role === "number") {
        const roleByValue: Record<number, TRole> = {
            0: "Admin",
            1: "Manager",
            2: "Sale",
            3: "Dispatcher",
        };

        return roleByValue[role] ?? null;
    }

    return null;
};

const getRoleFromToken = (decodedToken: any): TRole | null => {
    const claimRole =
        decodedToken.role ??
        decodedToken.Role ??
        decodedToken.roles ??
        decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

    if (Array.isArray(claimRole)) {
        return claimRole.map(normalizeRole).find(Boolean) ?? null;
    }

    return normalizeRole(claimRole);
};

const getUserRole = (
    userData: TAuthResponse,
    decodedToken: any
): TRole | null => {
    return getRoleFromToken(decodedToken) ?? normalizeRole(userData.role);
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<TAuthResponse | null>) {
            const userData = action.payload;

            if (!userData || !userData.accessToken) {
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                clearStoredAuthData();
                return;
            }

            if (isTokenExpired(userData.accessToken)) {
                console.warn('Attempted to set user with expired token');
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                clearStoredAuthData();
                return;
            }

            try {
                const decodedToken = jwtDecode(userData.accessToken) as any;
                const role = getUserRole(userData, decodedToken);

                if (!role) {
                    console.warn("Unable to resolve user role from login response");
                    state.user = null;
                    state.isAuthenticated = false;
                    state.role = null;
                    clearStoredAuthData();
                    return;
                }

                state.user = userData;
                state.isAuthenticated = true;
                state.role = role;

                localStorage.setItem(authStorageKeys.accessToken, userData.accessToken);
                if (userData.refreshToken) {
                    localStorage.setItem(authStorageKeys.refreshToken, userData.refreshToken);
                } else {
                    localStorage.removeItem(authStorageKeys.refreshToken);
                }
                localStorage.setItem(authStorageKeys.user, JSON.stringify(userData));

                setAuthorizationHeaders(userData.accessToken);
            } catch (error) {
                console.error('Error processing user token:', error);
                // If token processing fails, clear everything for security
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                clearStoredAuthData();
            }
        },

        loadUserFromStorage(state) {
            try {
                const accessToken = localStorage.getItem(authStorageKeys.accessToken);
                const storedUserData = localStorage.getItem(authStorageKeys.user);

                // Check if we have the minimum required data
                if (!accessToken || !storedUserData) {
                    //console.log( 'Missing authentication data in localStorage' );
                    clearStoredAuthData();
                    return;
                }

                if (isTokenExpired(accessToken)) {
                    //console.log( 'Stored access token is expired, clearing authentication data' );
                    clearStoredAuthData();

                    state.user = null;
                    state.isAuthenticated = false;
                    state.role = null;
                    return;
                }

                const userData = JSON.parse(storedUserData);
                const decodedToken = jwtDecode(accessToken) as any;
                const role = getUserRole(userData, decodedToken);

                if (!role) {
                    clearStoredAuthData();
                    state.user = null;
                    state.isAuthenticated = false;
                    state.role = null;
                    return;
                }

                state.user = userData;
                state.isAuthenticated = true;
                state.role = role;

                setAuthorizationHeaders(accessToken);
            } catch (error) {
                clearStoredAuthData();
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
            }
        },

        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.role = null;

            clearStoredAuthData();

            //console.log( 'User logged out successfully' );
        }
    },
});

export const { setUser, loadUserFromStorage, logout } = userSlice.actions;
export default userSlice.reducer;
