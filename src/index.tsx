import * as esbuild from 'esbuild-wasm'
import ReactDom from 'react-dom'
import {useState, useEffect, useRef} from 'react'
import {unpkgPathPlugin} from './plugins/unpkg-path-plugin'


const App = () => {
    const ref = useRef<any>()
    const [input, setInput]  = useState('')
    const [code, setCode] = useState('')

    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        })
    }

    useEffect(() => {
        startService()
    },[])

    const handleSubmit = async () => {
        if(!ref.current){
            return
        }

        const res = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin()],
            define: {
                'process.env.NODE_ENV': '"production',
                global: 'window'
            }
        })
        console.log(res)
        setCode(res.outputFiles[0].text)
    }

    return <div>
        <textarea value={input}
        onChange={(e) => setInput(e.target.value)}>
        </textarea>
        <div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
        <pre>{code}</pre>
    </div>
}

ReactDom.render(<App />, document.querySelector('#root'))