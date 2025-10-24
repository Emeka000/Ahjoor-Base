"use client"

import type React from "react"

import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto ml-64 pt-20">
        <Header />
        {children}
      </main>
    </div>
  )
}
