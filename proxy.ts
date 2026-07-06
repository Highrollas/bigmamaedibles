import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { verifyToken } from './app/Helper';

export const config = {
      matcher: ['/api/((?!auth|admin/auth|webhook96_14_v1|cron).*)', '/admin/((?!auth).*)', '/account/((?!login|register|username-reminder|reset-password).*)'],
};

const guestRestrictedPaths = ['/api/user', '/api/chats'];

const limiter = new RateLimiterMemory({
      points: 100,
      duration: 60,
});

export function proxy(request: NextRequest) {

      return new Promise((resolve) => {

            const authToken = request.cookies.get('auth_token')?.value;
            const guestToken = request.cookies.get('guest_token')?.value;
            const adminAuthToken = request.cookies.get('admin_auth_token')?.value;

            const { pathname } = request.nextUrl;

            /**         
             * 
             * 
             * 
             *  ADMIN MIDDLEWARE
             * 
             * 
             * 
            */


            // 1. ADMIN ROUTE CHECK
            const adminRoutePath = pathname.startsWith('/admin');
            const adminApiPath = pathname.startsWith('/api/admin');
            const isAdminPath = adminRoutePath || adminApiPath;

            const adminRoutes = [
                  {
                        path: '/admin/dashboard',
                        accessLevels: ['AA', 'A', 'B']
                  },
                  {
                        path: '/admin/dashboard-old',
                        accessLevels: ['AA', 'A', 'B']
                  },
                  {
                        path: '/admin/dashboard2',
                        accessLevels: ['AA', 'A', 'B']
                  },
                  {
                        path: '/admin/products',
                        accessLevels: ['AA', 'A', 'B']
                  },
                  {
                        path: '/admin/categories',
                        accessLevels: ['AA', 'A']
                  },
                  {
                        path: '/admin/orders',
                        accessLevels: ['AA', 'A', 'B', 'D']
                  },
                  {
                        path: '/admin/posts',
                        accessLevels: ['AA', 'A']
                  },
                  {
                        path: '/admin/blogs',
                        accessLevels: ['AA', 'A', 'C']
                  },
                  {
                        path: '/admin/vouchers',
                        accessLevels: ['AA', 'A']
                  },
                  {
                        path: '/admin/users',
                        accessLevels: ['AA', 'A']
                  },
                  //api routes
                  {
                        path: '/api/admin/stats',
                        accessLevels: ['AA', 'A', 'B']
                  },
                  {
                        path: '/api/admin/products',
                        accessLevels: ['AA', 'A', 'B']
                  },
                  {
                        path: '/api/admin/categories',
                        accessLevels: ['AA', 'A']
                  },
                  {
                        path: '/api/admin/orders',
                        accessLevels: ['AA', 'A', 'B', 'D']
                  },
                  {
                        path: '/api/admin/posts',
                        accessLevels: ['AA', 'A']
                  },
                  {
                        path: '/api/admin/blogs',
                        accessLevels: ['AA', 'A', 'C']
                  },
                  {
                        path: '/api/admin/vouchers',
                        accessLevels: ['AA', 'A']
                  },
                  {
                        path: '/api/admin/users',
                        accessLevels: ['AA', 'A']
                  }
            ]

            if (isAdminPath) {

                  if (!adminAuthToken && adminApiPath) {
                        return resolve(
                              NextResponse.json(
                                    { status: 'authFailed', message: 'Unauthorized - Admin token missing' },
                                    { status: 401 }
                              )
                        );
                  }

                  if (!adminAuthToken && adminRoutePath) {
                        return resolve(
                              NextResponse.redirect(new URL('/admin/auth/login', request.url))
                        );
                  }

                  return verifyToken(adminAuthToken!, String(process.env.ADMIN_JWT_SECRET)).then(
                        (adminObj) => {

                              const matchedRoute = adminRoutes.find(r => pathname.startsWith(r.path));

                              const firstAllowedRoute = adminRoutes.find(r => r.accessLevels.includes(adminObj.accessLevel));

                              // console.log('Access Level:', adminObj.accessLevel, "matchedRoute:", matchedRoute?.path, "pathname:", pathname);

                              if (matchedRoute && matchedRoute.accessLevels.includes(adminObj.accessLevel)) {

                                    return resolve(NextResponse.next()); // allowed

                              } else {

                                    if (pathname.startsWith("/api")) {
                                          return resolve(NextResponse.json(
                                                { status: 'authFailed', message: 'Unauthorized to perform this request' },
                                                { status: 403 }
                                          ));
                                    }

                                    if (firstAllowedRoute) {
                                          return resolve(NextResponse.redirect(new URL(firstAllowedRoute.path, request.url)));
                                    } else {
                                          return resolve(NextResponse.redirect(new URL("/admin/auth/login", request.url)));
                                    }

                              }


                        },
                        () => {
                              resolve(NextResponse.redirect(new URL("/admin/auth/login", request.url)));
                        }
                  );
            }




            /**
             * 
             * 
             * 
             *  ADMIN MIDDLEWARE END
             * 
             * 
             * 
            */


            ///////////////////////////   LINE   ///////////////


            /**
             * 
             * 
             * 
             *  USER MIDDLEWARE
             * 
             * 
             * 
            */


            // 2. AUTHENTICATED USER CHECK

            //check if the user access restricted #page# area without token
            // for redirecting direct acccess to dashboard, doesnt apply to /api routes
            //note /login /register routes has been ignored in matcher
            const userRoutePath = pathname.startsWith('/account');

            if (!authToken && userRoutePath) {
                  return resolve(
                        NextResponse.redirect(new URL('/account/login', request.url))
                  );
            }

            //user has auth token then verify
            if (authToken) {

                  return verifyToken(authToken, String(process.env.JWT_SECRET)).then(
                        (tokenObj) => {
                              limiter.consume(tokenObj._gid).then(
                                    () => resolve(NextResponse.next()),
                                    () =>
                                          resolve(NextResponse.json(
                                                { message: 'Too many requests: try again later' },
                                                { status: 429 }
                                          ))
                              );
                        },
                        () => {
                              if (pathname.startsWith('/api')) {
                                    resolve(NextResponse.json(
                                          { status: 'authFailed', message: 'Invalid token' },
                                          { status: 401 }
                                    ));
                              } else {
                                    resolve(NextResponse.redirect(new URL('/account/login', request.url)))
                              }
                        }
                  );
            }




            /**
             * 
             * 
             * 
             *  USER MIDDLEWARE END
             * 
             * 
             * 
             */



            ///////////////////////////   LINE   ///////////////



            /**
            * 
            * 
            * 
            *  GUEST MIDDLEWARE
            * 
            * 
            * 
            */


            // 3. GUEST TOKEN CHECK

            if (guestToken) {
                  return verifyToken(guestToken, String(process.env.JWT_SECRET)).then(
                        (tokenObj) => {
                              limiter.consume(tokenObj._gid).then(
                                    () => {
                                          console.log(pathname);
                                          const isGuestAllowed = !guestRestrictedPaths.some((restricted) =>
                                                pathname.startsWith(restricted)
                                          );

                                          if (isGuestAllowed) {
                                                resolve(NextResponse.next());
                                          } else {
                                                resolve(
                                                      NextResponse.json(
                                                            {
                                                                  status: 'authFailed',
                                                                  message: 'Unauthorized - Guest access restricted',
                                                            },
                                                            { status: 403 }
                                                      )
                                                );
                                          }
                                    },
                                    () =>
                                          resolve(
                                                NextResponse.json(
                                                      { status: 'failed', message: 'Too many requests: try again later' },
                                                      { status: 429 }
                                                )
                                          )
                              );
                        },
                        () => {
                              resolve(
                                    NextResponse.json({ status: 'authFailed', message: 'Invalid token' }, { status: 401 })
                              );
                        }
                  );
            }



            /**
            * 
            * 
            * 
            *  GUEST MIDDLEWARE END
            * 
            * 
            * 
            */

            ///////////////////////////   LINE   ///////////////

            // 4. NO TOKEN FOUND
            resolve(
                  NextResponse.json({ status: 'authFailed', message: 'Could not authorize request: Please be sure you dont have cookies blocked for this site on your browser' }, { status: 401 })
            );
      });
}
