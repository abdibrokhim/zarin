import { Header } from "./header"

export default async function LayoutApp({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="isolate">
      <div className="bg-background @container/mainview relative flex h-full w-full">
        <main className="@container relative h-dvh w-0 flex-shrink flex-grow">
          <Header />
          {children}
        </main>
      </div>
    </div>
  )
}
