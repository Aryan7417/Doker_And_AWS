import { Editor } from "@monaco-editor/react"
import { MonacoBinding} from "y-monaco" 
import { useRef,useMemo } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"

const App = () => {

  const editorRef= useRef(null)

  const ydoc = useMemo(()=>new Y.Doc(),[])                //use for  doc file thius the conver in ydoc
  const yText = useMemo(()=>ydoc.getText("monaco"),[ydoc])

  const handeMount = (editor) =>{
    editorRef.current = editor

    const provder = new SocketIOProvider("http://localhost:3000/" , "monaco" ,ydoc,{
      autoConnect:true,
    })
    const monacoBinding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set ([editorRef.current]),
      provder.awareness

    )

  }

  return (
    <main
    className="h-screen w-full bg-gray-950 flex gap-4 p-4"
    >

      <aside
      className="h-full w-1/4 bg-amber-50 rounded-lg ">
      </aside>
      <section
      className="w-3/4 bg-gray-800 rounded-lg">
        <Editor 
        height="100%"
        defaultLanguage="javascript"
        defaultValue="// soem comment"
        theme="vs-dark"
        onMount={handeMount}
        />


      </section>

    </main>
  )
}

export default App