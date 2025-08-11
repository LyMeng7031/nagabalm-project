import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "./i18n";
import jwt from "jsonwebtoken";

const protectedApiRoutes = [
  "/api/products",
  "/api/users",
  "/api/upload",
  "/api/categories",
];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the route is a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedApiRoute) {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1]; // Expecting 'Bearer TOKEN'

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authorization token required" },
        { status: 401 }
      );
    }

    try {
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET as string);
      // If token is valid, proceed to the API route (by doing nothing here)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  // Handle internationalization for all other routes
  const handleIntlRouting = createIntlMiddleware({
    locales,
    defaultLocale: "en",
    // The `publicRoutes` are not internationalized
    // and will be ignored by the intl middleware.
    localePrefix: "always",
  });

  return handleIntlRouting(req);
}

export const config = {
  // Matcher qui correspond à tous les chemins sauf ceux qui ne doivent pas être internationalisés
  matcher: [
    // Inclut tous les chemins sauf api, _next, _vercel, fichiers statiques
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Inclut aussi la racine
    "/",
  ],
};
