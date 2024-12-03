import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  
  // Cria uma nova resposta baseada na original
  const newResponse = NextResponse.next();
  
  // Copia os headers da resposta original
  response.headers.forEach((value, key) => {
    newResponse.headers.set(key, value);
  });
  
  // Adiciona nossos headers personalizados
  newResponse.headers.set('x-url', request.url);
  newResponse.headers.set('x-pathname', request.nextUrl.pathname);
  
  console.log('URL atual (middleware):', request.url);
  console.log('Pathname (middleware):', request.nextUrl.pathname);
  
  return newResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
