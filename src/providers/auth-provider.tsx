// import { loadUserFromStorage } from '@/redux/user/user-slice';
import { isTokenExpired } from '@/lib/auth-token';
import {
    authSessionEvents,
    getStoredAccessToken,
    getStoredRefreshToken,
    refreshStoredAuthSession,
} from '@/lib/auth-session';
import { loadUserFromStorage, logout, setUser } from '@/redux/User/user-slice';
import { useEffect, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';


type Props = {
    children: ReactNode,
}

const AuthProvider = ( { children }: Props ) =>
{
    const dispatch = useDispatch();
    useEffect( () =>
    {
        let isMounted = true;

        const restoreSession = async () =>
        {
            const accessToken = getStoredAccessToken();
            const refreshToken = getStoredRefreshToken();

            if ( refreshToken && ( !accessToken || isTokenExpired( accessToken ) ) )
            {
                try
                {
                    const authData = await refreshStoredAuthSession();
                    if ( isMounted )
                    {
                        dispatch( setUser( authData ) );
                    }
                    return;
                } catch
                {
                    if ( isMounted )
                    {
                        dispatch( logout() );
                    }
                    return;
                }
            }

            if ( isMounted )
            {
                dispatch( loadUserFromStorage() );
            }
        };

        const handleAuthRefreshed = ( event: Event ) =>
        {
            const detail = ( event as CustomEvent ).detail;
            if ( detail?.accessToken )
            {
                dispatch( setUser( detail ) );
            }
        };

        const handleAuthCleared = () =>
        {
            dispatch( logout() );
        };

        restoreSession();
        window.addEventListener( authSessionEvents.refreshed, handleAuthRefreshed );
        window.addEventListener( authSessionEvents.cleared, handleAuthCleared );

        return () =>
        {
            isMounted = false;
            window.removeEventListener( authSessionEvents.refreshed, handleAuthRefreshed );
            window.removeEventListener( authSessionEvents.cleared, handleAuthCleared );
        };
    }, [ dispatch ] );
    return children;
}

export default AuthProvider
