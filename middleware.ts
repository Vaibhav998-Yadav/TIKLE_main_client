// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are public
const isPublicRoute = createRouteMatcher([
  "/", 
  "/about", 
  "/contact", 
  "/authentication/sign-in(.*)", 
  "/authentication/sign-up(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is not public, protect it
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|splinecode)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};


// import { clerkMiddleware } from "@clerk/nextjs/server";

// // This middleware does nothing— all routes are public.
// export default clerkMiddleware((auth, req) => {
//   // Don't call auth.protect() for any route.
// });
