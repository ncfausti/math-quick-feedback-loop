import { useCallback, useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, TransformControls, useCursor } from '@react-three/drei'
import { useControls } from 'leva'
import create from 'zustand'

const useStore = create((set) => ({ target: null, setTarget: (target) => set({ target }) }))

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const setTarget = useStore((state) => state.setTarget)
  const [hovered, setHovered] = useState(false)
  const ref = useRef()
  useCursor(hovered)

  const frameUpdate = (s) => {
    // console.log(ref.current.position.x)
    // ref.current.rotation.x += 0.01
    // props.updateCallback()
    // console.log(s)
    // props.handler(ref.current.position)
  }
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => frameUpdate(state))
  // instead of on frameUpdate, should only run
  // onBoxDrag, onBoxResize, etc.
  // I can implememnt my own onMove handler by implementing an
  // observable, how else?

  return (
    <mesh
      ref={ref}
      {...props}
      onClick={(e) => {
        console.log('clicked')
        setTarget(e.object)
      }}
      onPointer
      onPointerMove={() => console.log('pointer move')}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}>
      <boxGeometry />
      <meshNormalMaterial />
    </mesh>
  )
}

export default function App() {
  const { target, setTarget } = useStore()
  const { mode } = useControls({ mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } })

  const [state, setState] = useState({ vecs: 'xyz' })
  const handler = useCallback(
    (event) => {
      console.log('You moved ', event)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )
  const stateHandler = () => {
    setState({ vecs: 'abc' })
  }

  return (
    <>
      <div id="info" style={{ color: 'white' }}>
        {state.vecs}
      </div>
      <Canvas dpr={[1, 2]} onPointerMissed={() => setTarget(null)}>
        <Box position={[2, 2, 0]} handler={handler} />
        <Box handler={handler} />
        {target && <TransformControls object={target} mode={mode} />}
        <OrbitControls makeDefault />
      </Canvas>
    </>
  )
}
