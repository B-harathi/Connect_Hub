 
// // // import React from 'react';
// // // import { Routes, Route, Navigate } from 'react-router-dom';
// // // import { useAuth } from './contexts/AuthContext';
// // // import LoadingScreen from './components/common/Loading';

// // // // Layout
// // // import Layout from './components/layout/Layout';

// // // // Pages
// // // import Login from './components/auth/Login';
// // // import Register from './components/auth/Register';
// // // import ChatContainer from './components/chat/ChatContainer';

// // // // Route constants
// // // export const ROUTES = {
// // //   HOME: '/',
// // //   LOGIN: '/login',
// // //   REGISTER: '/register',
// // //   CHAT: '/chat',
// // //   CHAT_WITH_ID: '/chat/:chatId',
// // //   PROFILE: '/profile',
// // //   SETTINGS: '/settings',
// // //   AUTH_CALLBACK: '/auth/callback',
// // // };

// // // // Protected Route Component
// // // const ProtectedRoute = ({ children }) => {
// // //   const { isAuthenticated, loading } = useAuth();
  
// // //   if (loading === 'loading') {
// // //     return <LoadingScreen />;
// // //   }
  
// // //   if (!isAuthenticated) {
// // //     return <Navigate to={ROUTES.LOGIN} replace />;
// // //   }
  
// // //   return children;
// // // };

// // // // Public Route Component (redirect if authenticated)
// // // const PublicRoute = ({ children }) => {
// // //   const { isAuthenticated, loading } = useAuth();
  
// // //   if (loading === 'loading') {
// // //     return <LoadingScreen />;
// // //   }
  
// // //   if (isAuthenticated) {
// // //     return <Navigate to={ROUTES.CHAT} replace />;
// // //   }
  
// // //   return children;
// // // };

// // // // Auth Callback Component
// // // const AuthCallback = () => {
// // //   const { login } = useAuth();
  
// // //   React.useEffect(() => {
// // //     // Get token from URL params
// // //     const urlParams = new URLSearchParams(window.location.search);
// // //     const token = urlParams.get('token');
    
// // //     if (token) {
// // //       // Store token and redirect
// // //       localStorage.setItem('connecthub_token', token);
// // //       window.location.href = '/chat';
// // //     } else {
// // //       // Redirect to login if no token
// // //       window.location.href = '/login?error=auth_failed';
// // //     }
// // //   }, []);
  
// // //   return <LoadingScreen message="Completing authentication..." />;
// // // };

// // // // Main Routes Component
// // // const AppRoutes = () => {
// // //   return (
// // //     <Routes>
// // //       {/* Public routes */}
// // //       <Route 
// // //         path={ROUTES.LOGIN} 
// // //         element={
// // //           <PublicRoute>
// // //             <Login />
// // //           </PublicRoute>
// // //         } 
// // //       />
// // //       <Route 
// // //         path={ROUTES.REGISTER} 
// // //         element={
// // //           <PublicRoute>
// // //             <Register />
// // //           </PublicRoute>
// // //         } 
// // //       />
      
// // //       {/* Auth callback */}
// // //       <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
      
// // //       {/* Protected routes */}
// // //       <Route 
// // //         path={ROUTES.CHAT} 
// // //         element={
// // //           <ProtectedRoute>
// // //             <Layout>
// // //               <ChatContainer />
// // //             </Layout>
// // //           </ProtectedRoute>
// // //         } 
// // //       />
// // //       <Route 
// // //         path={ROUTES.CHAT_WITH_ID} 
// // //         element={
// // //           <ProtectedRoute>
// // //             <Layout>
// // //               <ChatContainer />
// // //             </Layout>
// // //           </ProtectedRoute>
// // //         } 
// // //       />
      
// // //       {/* Default redirect */}
// // //       <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.CHAT} replace />} />
      
// // //       {/* Catch all route */}
// // //       <Route path="*" element={<Navigate to={ROUTES.CHAT} replace />} />
// // //     </Routes>
// // //   );
// // // };

// // // export default AppRoutes;



// // import React from 'react';
// // import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
// // import { useAuth } from './contexts/AuthContext';
// // import LoadingScreen from './components/common/Loading';
// // import { setStoredToken, setStoredUser } from './utils/helpers'; // MISSING IMPORT - FIXED

// // // Layout
// // import Layout from './components/layout/Layout';

// // // Pages
// // import Login from './components/auth/Login';
// // import Register from './components/auth/Register';
// // import ChatContainer from './components/chat/ChatContainer';

// // // Route constants
// // export const ROUTES = {
// //   HOME: '/',
// //   LOGIN: '/login',
// //   REGISTER: '/register',
// //   CHAT: '/chat',
// //   CHAT_WITH_ID: '/chat/:chatId',
// //   PROFILE: '/profile',
// //   SETTINGS: '/settings',
// //   AUTH_CALLBACK: '/auth/callback',
// // };

// // // Protected Route Component
// // const ProtectedRoute = ({ children }) => {
// //   const { isAuthenticated, loading } = useAuth();
  
// //   if (loading === 'loading') {
// //     return <LoadingScreen />;
// //   }
  
// //   if (!isAuthenticated) {
// //     return <Navigate to={ROUTES.LOGIN} replace />;
// //   }
  
// //   return children;
// // };

// // // Public Route Component (redirect if authenticated)
// // const PublicRoute = ({ children }) => {
// //   const { isAuthenticated, loading } = useAuth();
  
// //   if (loading === 'loading') {
// //     return <LoadingScreen />;
// //   }
  
// //   if (isAuthenticated) {
// //     return <Navigate to={ROUTES.CHAT} replace />;
// //   }
  
// //   return children;
// // };

// // // Auth Callback Component - FIXED WITH PROPER IMPORTS AND LOGIC
// // const AuthCallback = () => {
// //   const navigate = useNavigate();
// //   const [searchParams] = useSearchParams();
// //   const [status, setStatus] = React.useState('processing');
// //   const [message, setMessage] = React.useState('Completing authentication...');

// //   React.useEffect(() => {
// //     const handleCallback = async () => {
// //       try {
// //         console.log('🔍 AuthCallback: Starting OAuth callback process');
        
// //         const token = searchParams.get('token');
// //         const error = searchParams.get('error');

// //         console.log('🔍 Token received:', !!token);
// //         console.log('🔍 Error received:', error);

// //         if (error) {
// //           console.error('❌ OAuth error:', error);
// //           setStatus('error');
// //           setMessage('Authentication failed. Redirecting to login...');
// //           setTimeout(() => navigate(`${ROUTES.LOGIN}?error=${error}`, { replace: true }), 2000);
// //           return;
// //         }

// //         if (!token) {
// //           console.error('❌ No token received');
// //           setStatus('error');
// //           setMessage('No authentication token received. Redirecting to login...');
// //           setTimeout(() => navigate(`${ROUTES.LOGIN}?error=no_token`, { replace: true }), 2000);
// //           return;
// //         }

// //         console.log('✅ Token received, storing and verifying...');
        
// //         // Store token first - THIS WAS MISSING THE IMPORT
// //         setStoredToken(token);
// //         console.log('✅ Token stored in localStorage');

// //         // Verify token and get user data
// //         const response = await fetch('http://localhost:5000/api/auth/verify', {
// //           method: 'GET',
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         });

// //         console.log('🔍 Verification response status:', response.status);

// //         if (response.ok) {
// //           const data = await response.json();
// //           console.log('✅ Token verified successfully');
// //           console.log('🔍 User data received:', !!data.data);
          
// //           if (data && data.data) {
// //             // Store user data - THIS WAS MISSING THE IMPORT
// //             setStoredUser(data.data);
// //             console.log('✅ User data stored in localStorage');
// //           }
          
// //           setStatus('success');
// //           setMessage('Authentication successful! Redirecting to chat...');
          
// //           console.log('🔄 Redirecting to chat in 1.5 seconds...');
          
// //           setTimeout(() => {
// //             console.log('🔄 Executing redirect to chat');
// //             // Use window.location for a full page refresh to ensure AuthContext updates
// //             window.location.href = '/chat';
// //           }, 1500);
          
// //         } else {
// //           const errorText = await response.text();
// //           console.error('❌ Token verification failed:', response.status, errorText);
// //           throw new Error(`Token verification failed: ${response.status}`);
// //         }

// //       } catch (error) {
// //         console.error('❌ Auth callback error:', error);
// //         setStatus('error');
// //         setMessage('Authentication verification failed. Redirecting to login...');
        
// //         // Clear any stored data
// //         localStorage.removeItem('connecthub_token');
// //         localStorage.removeItem('connecthub_user');
        
// //         setTimeout(() => {
// //           navigate(`${ROUTES.LOGIN}?error=verification_failed`, { replace: true });
// //         }, 2000);
// //       }
// //     };

// //     handleCallback();
// //   }, [searchParams, navigate]);

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
// //       <div className="max-w-md w-full space-y-8 p-8">
// //         <div className="text-center">
// //           {status === 'processing' && (
// //             <div className="space-y-4">
// //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
// //               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
// //                 Completing Sign In
// //               </h2>
// //               <p className="text-gray-600 dark:text-gray-400">{message}</p>
// //               <div className="text-xs text-gray-500 mt-4">
// //                 Check console for debug logs
// //               </div>
// //             </div>
// //           )}

// //           {status === 'success' && (
// //             <div className="space-y-4">
// //               <div className="h-12 w-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
// //                 <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
// //                 </svg>
// //               </div>
// //               <h2 className="text-xl font-semibold text-green-600">Success!</h2>
// //               <p className="text-gray-600 dark:text-gray-400">{message}</p>
// //             </div>
// //           )}

// //           {status === 'error' && (
// //             <div className="space-y-4">
// //               <div className="h-12 w-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
// //                 <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
// //                 </svg>
// //               </div>
// //               <h2 className="text-xl font-semibold text-red-600">Authentication Failed</h2>
// //               <p className="text-gray-600 dark:text-gray-400">{message}</p>
// //               <button 
// //                 onClick={() => navigate(ROUTES.LOGIN)}
// //                 className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
// //               >
// //                 Back to Login
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Main Routes Component
// // const AppRoutes = () => {
// //   return (
// //     <Routes>
// //       {/* Public routes */}
// //       <Route 
// //         path={ROUTES.LOGIN} 
// //         element={
// //           <PublicRoute>
// //             <Login />
// //           </PublicRoute>
// //         } 
// //       />
// //       <Route 
// //         path={ROUTES.REGISTER} 
// //         element={
// //           <PublicRoute>
// //             <Register />
// //           </PublicRoute>
// //         } 
// //       />
      
// //       {/* Auth callback */}
// //       <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
      
// //       {/* Protected routes */}
// //       <Route 
// //         path={ROUTES.CHAT} 
// //         element={
// //           <ProtectedRoute>
// //             <Layout>
// //               <ChatContainer />
// //             </Layout>
// //           </ProtectedRoute>
// //         } 
// //       />
// //       <Route 
// //         path={ROUTES.CHAT_WITH_ID} 
// //         element={
// //           <ProtectedRoute>
// //             <Layout>
// //               <ChatContainer />
// //             </Layout>
// //           </ProtectedRoute>
// //         } 
// //       />
      
// //       {/* Default redirect */}
// //       <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.CHAT} replace />} />
      
// //       {/* Catch all route */}
// //       <Route path="*" element={<Navigate to={ROUTES.CHAT} replace />} />
// //     </Routes>
// //   );
// // };

// // export default AppRoutes;



// import React from 'react';
// import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';
// import LoadingScreen from './components/common/Loading';
// import { setStoredToken, setStoredUser } from './utils/helpers'; // MISSING IMPORT - FIXED

// // Layout
// import Layout from './components/layout/Layout';

// // Pages
// import Login from './components/auth/Login';
// import Register from './components/auth/Register';
// import ChatContainer from './components/chat/ChatContainer';

// // Route constants
// export const ROUTES = {
//   HOME: '/',
//   LOGIN: '/login',
//   REGISTER: '/register',
//   CHAT: '/chat',
//   CHAT_WITH_ID: '/chat/:chatId',
//   PROFILE: '/profile',
//   SETTINGS: '/settings',
//   AUTH_CALLBACK: '/auth/callback',
// };

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
  
//   if (loading === 'loading') {
//     return <LoadingScreen />;
//   }
  
//   if (!isAuthenticated) {
//     return <Navigate to={ROUTES.LOGIN} replace />;
//   }
  
//   return children;
// };

// // Public Route Component (redirect if authenticated)
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
  
//   if (loading === 'loading') {
//     return <LoadingScreen />;
//   }
  
//   if (isAuthenticated) {
//     return <Navigate to={ROUTES.CHAT} replace />;
//   }
  
//   return children;
// };

// // Auth Callback Component - FIXED WITH PROPER IMPORTS AND LOGIC
// const AuthCallback = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [status, setStatus] = React.useState('processing');
//   const [message, setMessage] = React.useState('Completing authentication...');

//   React.useEffect(() => {
//     const handleCallback = async () => {
//       try {
//         console.log('🔍 AuthCallback: Starting OAuth callback process');
        
//         const token = searchParams.get('token');
//         const error = searchParams.get('error');

//         console.log('🔍 Token received:', !!token);
//         console.log('🔍 Error received:', error);

//         if (error) {
//           console.error('❌ OAuth error:', error);
//           setStatus('error');
//           setMessage('Authentication failed. Redirecting to login...');
//           setTimeout(() => navigate(`${ROUTES.LOGIN}?error=${error}`, { replace: true }), 2000);
//           return;
//         }

//         if (!token) {
//           console.error('❌ No token received');
//           setStatus('error');
//           setMessage('No authentication token received. Redirecting to login...');
//           setTimeout(() => navigate(`${ROUTES.LOGIN}?error=no_token`, { replace: true }), 2000);
//           return;
//         }

//         console.log('✅ Token received, storing and verifying...');
        
//         // Store token first - THIS WAS MISSING THE IMPORT
//         setStoredToken(token);
//         console.log('✅ Token stored in localStorage');

//         // Verify token and get user data
//         const response = await fetch('http://localhost:5000/api/auth/verify', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         console.log('🔍 Verification response status:', response.status);

//         if (response.ok) {
//           const data = await response.json();
//           console.log('✅ Token verified successfully');
//           console.log('🔍 User data received:', !!data.data);
          
//           if (data && data.data) {
//             // Store user data - THIS WAS MISSING THE IMPORT
//             setStoredUser(data.data);
//             console.log('✅ User data stored in localStorage');
//           }
          
//           setStatus('success');
//           setMessage('Authentication successful! Redirecting to chat...');
          
//           console.log('🔄 Redirecting to chat in 1.5 seconds...');
          
//           setTimeout(() => {
//             console.log('🔄 Executing redirect to chat');
            
//             // Trigger custom event to update AuthContext
//             window.dispatchEvent(new CustomEvent('auth-updated'));
            
//             // Small delay to let auth context update, then navigate
//             setTimeout(() => {
//               navigate(ROUTES.CHAT, { replace: true });
//             }, 100);
//           }, 1500);
          
//         } else {
//           const errorText = await response.text();
//           console.error('❌ Token verification failed:', response.status, errorText);
//           throw new Error(`Token verification failed: ${response.status}`);
//         }

//       } catch (error) {
//         console.error('❌ Auth callback error:', error);
//         setStatus('error');
//         setMessage('Authentication verification failed. Redirecting to login...');
        
//         // Clear any stored data
//         localStorage.removeItem('connecthub_token');
//         localStorage.removeItem('connecthub_user');
        
//         setTimeout(() => {
//           navigate(`${ROUTES.LOGIN}?error=verification_failed`, { replace: true });
//         }, 2000);
//       }
//     };

//     handleCallback();
//   }, [searchParams, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-md w-full space-y-8 p-8">
//         <div className="text-center">
//           {status === 'processing' && (
//             <div className="space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                 Completing Sign In
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400">{message}</p>
//               <div className="text-xs text-gray-500 mt-4">
//                 Check console for debug logs
//               </div>
//             </div>
//           )}

//           {status === 'success' && (
//             <div className="space-y-4">
//               <div className="h-12 w-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
//                 <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                 </svg>
//               </div>
//               <h2 className="text-xl font-semibold text-green-600">Success!</h2>
//               <p className="text-gray-600 dark:text-gray-400">{message}</p>
//             </div>
//           )}

//           {status === 'error' && (
//             <div className="space-y-4">
//               <div className="h-12 w-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
//                 <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                 </svg>
//               </div>
//               <h2 className="text-xl font-semibold text-red-600">Authentication Failed</h2>
//               <p className="text-gray-600 dark:text-gray-400">{message}</p>
//               <button 
//                 onClick={() => navigate(ROUTES.LOGIN)}
//                 className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//               >
//                 Back to Login
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Routes Component
// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route 
//         path={ROUTES.LOGIN} 
//         element={
//           <PublicRoute>
//             <Login />
//           </PublicRoute>
//         } 
//       />
//       <Route 
//         path={ROUTES.REGISTER} 
//         element={
//           <PublicRoute>
//             <Register />
//           </PublicRoute>
//         } 
//       />
      
//       {/* Auth callback */}
//       <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
      
//       {/* Protected routes */}
//       <Route 
//         path={ROUTES.CHAT} 
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <ChatContainer />
//             </Layout>
//           </ProtectedRoute>
//         } 
//       />
//       <Route 
//         path={ROUTES.CHAT_WITH_ID} 
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <ChatContainer />
//             </Layout>
//           </ProtectedRoute>
//         } 
//       />
      
//       {/* Default redirect */}
//       <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.CHAT} replace />} />
      
//       {/* Catch all route */}
//       <Route path="*" element={<Navigate to={ROUTES.CHAT} replace />} />
//     </Routes>
//   );
// };

// export default AppRoutes;


import React from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingScreen from './components/common/Loading';
import { setStoredToken, setStoredUser } from './utils/helpers'; // MISSING IMPORT - FIXED

// Layout
import Layout from './components/layout/Layout';

// Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChatContainer from './components/chat/ChatContainer';
import Settings from './components/settings/Settings';

// Route constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHAT: '/chat',
  CHAT_WITH_ID: '/chat/:chatId',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  AUTH_CALLBACK: '/auth/callback',
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading === 'loading') {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading === 'loading') {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated) {
    return <Navigate to={ROUTES.CHAT} replace />;
  }
  
  return children;
};

// Auth Callback Component - FIXED WITH PROPER IMPORTS AND LOGIC
const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = React.useState('processing');
  const [message, setMessage] = React.useState('Completing authentication...');

  React.useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔍 AuthCallback: Starting OAuth callback process');
        
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        console.log('🔍 Token received:', !!token);
        console.log('🔍 Error received:', error);

        if (error) {
          console.error('❌ OAuth error:', error);
          setStatus('error');
          setMessage('Authentication failed. Redirecting to login...');
          setTimeout(() => navigate(`${ROUTES.LOGIN}?error=${error}`, { replace: true }), 2000);
          return;
        }

        if (!token) {
          console.error('❌ No token received');
          setStatus('error');
          setMessage('No authentication token received. Redirecting to login...');
          setTimeout(() => navigate(`${ROUTES.LOGIN}?error=no_token`, { replace: true }), 2000);
          return;
        }

        console.log('✅ Token received, storing and verifying...');
        
        // Store token first - THIS WAS MISSING THE IMPORT
        setStoredToken(token);
        console.log('✅ Token stored in localStorage');

        // Verify token and get user data
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('🔍 Verification response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Token verified successfully');
          console.log('🔍 User data received:', !!data.data);
          
          if (data && data.data) {
            // Store user data - THIS WAS MISSING THE IMPORT
            setStoredUser(data.data);
            console.log('✅ User data stored in localStorage');
          }
          
          setStatus('success');
          setMessage('Authentication successful! Redirecting to chat...');
          
          console.log('🔄 Redirecting to chat in 1.5 seconds...');
          
          setTimeout(() => {
            console.log('🔄 Executing redirect to chat');
            
            // Trigger custom event to update AuthContext
            window.dispatchEvent(new CustomEvent('auth-updated'));
            
            // Navigate to chat directly
            navigate(ROUTES.CHAT, { replace: true });
          }, 1500);
          
        } else {
          const errorText = await response.text();
          console.error('❌ Token verification failed:', response.status, errorText);
          throw new Error(`Token verification failed: ${response.status}`);
        }

      } catch (error) {
        console.error('❌ Auth callback error:', error);
        setStatus('error');
        setMessage('Authentication verification failed. Redirecting to login...');
        
        // Clear any stored data
        localStorage.removeItem('connecthub_token');
        localStorage.removeItem('connecthub_user');
        
        setTimeout(() => {
          navigate(`${ROUTES.LOGIN}?error=verification_failed`, { replace: true });
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {status === 'processing' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Completing Sign In
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{message}</p>
              <div className="text-xs text-gray-500 mt-4">
                Check console for debug logs
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="h-12 w-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-600">Success!</h2>
              <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="h-12 w-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-600">Authentication Failed</h2>
              <p className="text-gray-600 dark:text-gray-400">{message}</p>
              <button 
                onClick={() => navigate(ROUTES.LOGIN)}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path={ROUTES.LOGIN} 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path={ROUTES.REGISTER} 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Auth callback */}
      <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
      
      {/* Protected routes */}
      <Route 
        path={ROUTES.CHAT} 
        element={
          <ProtectedRoute>
            <Layout>
              <ChatContainer />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.CHAT_WITH_ID} 
        element={
          <ProtectedRoute>
            <Layout>
              <ChatContainer />
            </Layout>
          </ProtectedRoute>
        } 
      />
      {/* Settings route */}
      <Route
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Default redirect */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.CHAT} replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to={ROUTES.CHAT} replace />} />
    </Routes>
  );
};

export default AppRoutes;