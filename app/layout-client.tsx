"use client"

import { API_ROUTE_CSRF } from "@/lib/routes"
import { useEffect } from "react"

export function LayoutClient() {
  useEffect(() => {
    fetch(API_ROUTE_CSRF)
  }, [])
  return null
}
