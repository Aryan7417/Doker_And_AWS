//[48.32]

import { Editor } from "@monaco-editor/react"
import { MonacoBinding } from "y-monaco"
import { useRef, useMemo, useState, useEffect } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"

const App = () => {
  //const providerRef = useRef(null)
 // const bindingRef = useRef(null)

  const editorRef = useRef(null)
  const [username, setUsername] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get("username") || ""
  })

  const [inputValue, setInputValue] = useState("")
  const [user, setUser] = useState([])

  const ydoc = useMemo(() => new Y.Doc(), [])                //use for  doc file thius the conver in ydoc
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc])


// const handeMount = (editor) => {

//   if (providerRef.current) return

//   editorRef.current = editor

//   const provider = new SocketIOProvider(
//     "http://localhost:3000",
//     "monaco",
//     ydoc,
//     {
//       autoConnect: true,
//     }
//   )

//   providerRef.current = provider

//   provider.awareness.setLocalStateField(
//     "user",
//     {
//       name: username,
//     }
//   )

//   provider.awareness.on("change", () => {

//     const states = Array.from(
//       provider.awareness.getStates().values()
//     )

//     setUser(
//       states
//         .map((state) => state.user)
//         .filter(Boolean)
//     )

//     console.log(states)
//   })

//   const binding = new MonacoBinding(
//     yText,
//     editor.getModel(),
//     new Set([editor]),
//     provider.awareness
//   )

//   bindingRef.current = binding
// }



const providerRef = useRef(null)
const bindingRef = useRef(null)

const handeMount = (editor) => {

  if (providerRef.current) return

  editorRef.current = editor

  const provider = new SocketIOProvider(
    "/",
    "monaco",
    ydoc,
    {
      autoConnect: true,
    }
  )

  providerRef.current = provider

  setTimeout(() => {

    provider.awareness.setLocalStateField(
      "user",
      {
        name: username,
      }
    )

  }, 0)

  provider.awareness.on("change", () => {

    const states = Array.from(
      provider.awareness.getStates().values()
    )

    setUser(
      states
        .map((state) => state.user)
        .filter(Boolean)
    )
  })

  const binding = new MonacoBinding(
    yText,
    editor.getModel(),
    new Set([editor]),
    provider.awareness
  )

  bindingRef.current = binding
}


  const handleJoin = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {

      setUsername(inputValue.trim())
      window.history.pushState(
        {},
        "",
        "?username=" + inputValue.trim()
      )
    }
  }



  useEffect(() => {

  return () => {

    bindingRef.current?.destroy()

    providerRef.current?.disconnect()

  }

}, [])
  // useEffect(() => {
  //   console.log("effect running")


  //   if (!username || !editorRef.current) return
  //   const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc, {
  //     autoConnect: true,
  //   })
  //   // }
  //   provider.awareness.setLocalStateField("user", { inputValue: username })

  //   provider.awareness.on("change", () => {
  //     const states = Array.from(provider.awareness.getStates().values())
  //     setUser(
  //       states
  //         .map((state) => state.user)
  //         .filter(Boolean)
  //     )
  //     console.log(states)
  //   })

  //   console.log("provider connected")

  //   const handBeforeUnload = () => {
  //     provider.awareness.setLocalStateField("user", null)
  //   }

  //   window.addEventListener("beforeunload", handBeforeUnload)


  //   const monacoBinding = new MonacoBinding(
  //     yText,
  //     editorRef.current.getModel(),
  //     new Set([editorRef.current]),
  //     provider.awareness

  //   )
  //   console.log("provider created")
  //   return () => {
  //     // monacoBinding.destroy()
  //     // provider.disconnect()
  //      bindingRef.current?.destroy()

  //   providerRef.current?.disconnect()
  //     window.removeEventListener("beforeunload", handBeforeUnload)

  //   }
  //   //}
  // }, [
  //   editorRef.current,
  //   username
  // ])
  


  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center">
        <form className="flex flex-col gap-4" onSubmit={handleJoin}>


          <input
            type="text"
            placeholder="Enter your UserName"
            className="p-2 rotate-lg bg-gray-800 text-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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

        <h2 className="text-2xl font-bold p-4 border-b  border-gray-300"> USER </h2>
        <ul>
          {user.map((user, index) => (
            <li key={index} className="p-2 bg-gray-800 text-white rounded mb-2">{user.name}</li>
          ))}
        </ul>
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