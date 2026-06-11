import { Editor } from "@monaco-editor/react"
import { MonacoBinding} from "y-monaco" 
import { useRef,useMemo,useState,useEffect } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"

const App = () => {

  const editorRef= useRef(null)
  const [username, setUsername] = useState(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get("username") || ""
})

  const [inputValue ,setInputValue] = useState("")
  const [user ,setUser] =useEffect([])

  const ydoc = useMemo(()=>new Y.Doc(),[])                //use for  doc file thius the conver in ydoc
  const yText = useMemo(()=>ydoc.getText("monaco"),[ydoc])



  const handeMount = (editor) =>{
    editorRef.current = editor
    // const provder = new SocketIOProvider("http://localhost:3000" , "monaco" ,ydoc,{
    //   autoConnect:true,
    // })
    // const monacoBinding = new MonacoBinding(
    //   yText,
    //   editorRef.current.getModel(),
    //   new Set ([editorRef.current]),
    //   provder.awareness

    // )
  }

  const handleJoin =(e)=>{
    e.preventDefault()
    if(inputValue.trim()){

      setUsername(inputValue.trim())
      window.history.pushState(
        {},
        "",
        "?username=" + inputValue.trim()
      )
    }
  }


  useEffect(()=>{
    if(username && editorRef.current){
      const provder = new SocketIOProvider("http://localhost:3000" , "monaco" ,ydoc,{
      autoConnect:true,
    })
    provider.awareness.setLocalStateField("user",{ inputValue })

    provder.awareness.on("change",()=>{
      const states = Array.from(provder.awareness.getStates().values())
      setUser(states.map(states=> states.user).filter(user =>Boolean(user.inputValue)))
    })

    const handBeforeUnload(){
      provder.awareness.setLocalStateField("user",null)
    }

    window.addEventListener("beforeunload",handBeforeUnload)


    const monacoBinding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set ([editorRef.current]),
      provder.awareness

    )
    return()=>{
      monacoBinding.destroy()
      provider.disconnect()
      window.removeEventListener("beforeunload",handBeforeUnload)
      
    }
    }
  },[
    editorRef.current,
    username
  ])





  if(!username){
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center">
        <form className="flex flex-col gap-4" onSubmit={handleJoin}> 
          
          
          <input  
          type="text"
          placeholder="Enter your UserName"
          className="p-2 rotate-lg bg-gray-800 text-white"
          value={inputValue}
          onChange={(e)=>setInputValue(e.target.value)}
          />


          <button
          type="submit"
          className="p-2 rounded-lg bg-amber-50 text-gray-950 font-bold"
          // onClick={()=>{
          //   if(inputValue.trim()){
          //     setUsername(inputValue.trim())
          //   }
          // }}
          >
          join
          </button>

        </form>
      </main>
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