import { Message } from "ai"
import { promises as fs } from 'fs'
import path from 'path'
import Chat from "./components/chat/chat"
import LayoutApp from "./components/layout/layout-app"

async function getInitialMessage() {
  const msgPath = path.join(process.cwd(), 'app/msg.md')
  const content = await fs.readFile(msgPath, 'utf8')
  
  const message: Message = {
    id: '1',
    role: 'assistant',
    content,
    createdAt: new Date()
  }

  return [message]
}

export default async function Home() {
  const initialMessages = await getInitialMessage()
  
  return (
    <LayoutApp>
      <Chat />
    </LayoutApp>
  )
}
