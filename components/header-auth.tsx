'use client'

import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function HeaderAuth() {
  const [user, setUser] = useState<any>(null)
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()
        
        if (profileData?.username) {
          setUsername(profileData.username)
        }
      }
    }

    getUser()
  }, [])

  return user ? (
    <div className="flex items-center gap-4">
      <span>Olá, {username || 'usuário'}!</span>
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/profile">Perfil</Link>
      </Button>
      <form action={signOutAction}>
        <Button type="submit" size="sm" variant={"outline"}>
          Sair da conta
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Entrar</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Criar conta</Link>
      </Button>
    </div>
  );
}
