import * as THREE from 'three'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

/**
 * RenderScene component
 * @param props text content
 * @returns RenderScene component
 */
export function RenderScene(props: { text: string }) {
  const [text, setText] = useState(props.text) // text content
  const [position, setPosition] = useState({ x: 0, y: 0 }) // text position
  const [color, setColor] = useState('#cccccc') // text color
  const [isRotate, setIsRotate] = useState(false) // text rotate
  const [undoStack, setUndoStack] = useState<any[]>([]) // undo stack
  const [redoStack, setRedoStack] = useState<any[]>([]) // redo stack

  useEffect(() => {
    setText(props.text)
  }, [props.text])

  const handleTextChange = (newText: string) => {
    setUndoStack([...undoStack, { text, position, color, isRotate }])
    setText(newText)
    setRedoStack([])
  }

  const handlePositionChange = (newPosition: any) => {
    setUndoStack([...undoStack, { text, position, color, isRotate }])
    setPosition(newPosition)
    setRedoStack([])
  }

  const handleColorChange = (newColor: any) => {
    setUndoStack([...undoStack, { text, position, color, isRotate }])
    setColor(newColor)
    setRedoStack([])
  }

  const handleIsRotate = (newIsRotate: boolean) => {
    setUndoStack([...undoStack, { text, position, color, isRotate }])
    setIsRotate(newIsRotate)
    setRedoStack([])
  }

  const handleUndo = () => {
    const prev = undoStack[undoStack.length - 1]
    console.log('[ prev ]', undoStack, prev)
    if (!prev) return
    setUndoStack(undoStack.slice(0, -1))
    setRedoStack([...redoStack, { text, position, color, isRotate }])
    setText(prev.text)
    setPosition(prev.position)
    setColor(prev.color)
    setIsRotate(prev.isRotate)
  }

  const handleRedo = () => {
    const prev = redoStack[redoStack.length - 1]
    if (!prev) return
    console.log('[ prev ]', redoStack, prev)
    setRedoStack(redoStack.slice(0, -1))
    setUndoStack([...undoStack, { text, position, color, isRotate }])
    setText(prev.text)
    setPosition(prev.position)
    setColor(prev.color)
    setIsRotate(prev.isRotate)
  }

  const handleUndoRedo = (event: any) => {
    if (event.ctrlKey && event.key === 'z') {
      console.log('[ undoStack ]', undoStack)
      // FIXME: NOT WORK!
      handleUndo()
    } else if (event.ctrlKey && event.key === 'y') {
      console.log('[ redoStack ]', redoStack)
      // FIXME: NOT WORK!
      handleRedo()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleUndoRedo)
    return () => {
      window.removeEventListener('keydown', handleUndoRedo)
    }
  }, [])

  return (
    <>
      <Canvas>
        <Text
          position={position}
          text={text}
          color={color}
          isRotate={isRotate}
          onPositionChange={handlePositionChange}
          onMouseEnter={() => console.log('Mouse enter')}
          onMouseLeave={() => console.log('Mouse leave')}
        />
      </Canvas>
      <Controls
        text={text}
        position={position}
        color={color}
        isRotate={isRotate}
        onIsRotateChange={handleIsRotate}
        onTextChange={handleTextChange}
        onPositionChange={handlePositionChange}
        onColorChange={handleColorChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />
    </>
  )
}

/**
 * Text component
 * @param props Text props
 * @returns Text component
 */
function Text(props: Types.TextPropsType) {
  const meshRef = useRef<any>()
  const [isDragging, setIsDragging] = useState(false)
  const [textGeometry, setTextGeometry] = useState<any>(null)
  const { position, text, color, onMouseEnter, onMouseLeave, isRotate, onPositionChange } = props

  const { camera } = useThree()
  camera.position.set(0, 0, 5)

  const handleFontLoad = useCallback(
    (font: any) => {
      let geometry = new TextGeometry(text, {
        font: font,
        size: 1, // font size
        height: 0.3, // font thickness
      })
      geometry.center()
      setTextGeometry(geometry)
    },
    [text]
  )

  useEffect(() => {
    const fontLoader = new FontLoader()
    fontLoader.load('https://threejs.org/examples/fonts/gentilis_regular.typeface.json', handleFontLoad)
  }, [handleFontLoad])

  const handleDragStart = useCallback((e: any) => {
    e.stopPropagation()
  }, [])

  const handleDrag = useCallback(
    (e: any) => {
      e.stopPropagation()
      if (isDragging) {
        const newPosition = new THREE.Vector3(position.x + e.movementX, position.y - e.movementY, 0)
        meshRef.current.position.copy(newPosition)
        onPositionChange(newPosition)
      }
    },
    [isDragging, position, onPositionChange]
  )

  const handleDragEnd = useCallback((e: any) => {
    e.stopPropagation()
  }, [])

  const handlePointerOver = useCallback(() => {
    // setIsDragging(true)
  }, [onMouseEnter])

  const handlePointerOut = useCallback(() => {
    setIsDragging(false)
  }, [onMouseLeave])

  useFrame((state, delta) => {
    if (isRotate) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh
      position={[position.x, position.y, 0]}
      onPointerDown={e => {
        setIsDragging(true)
        handleDragStart(e)
      }}
      onPointerMove={handleDrag}
      onPointerUp={e => {
        setIsDragging(false)
        handleDragEnd(e)
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      geometry={textGeometry}
      ref={meshRef}
    >
      <meshBasicMaterial attach="material" color={color} />
    </mesh>
  )
}

/**
 * Contorls Component
 * @param props Contorls props
 * @returns Contorls Component
 */
function Controls(props: Types.ControlsPropsType) {
  const { text, position, color, onTextChange, onPositionChange, onColorChange, onUndo, onRedo, canUndo, canRedo, onIsRotateChange, isRotate } = props

  const handleTextChange = (e: any) => {
    onTextChange(e.target.value)
  }

  const handlePositionChange = (e: any, axis: any) => {
    const newPosition = { ...position, [axis]: parseFloat(e.target.value) }
    onPositionChange(newPosition)
  }

  const handleColorChange = (color: any) => {
    onColorChange(color)
  }

  const handleRotateChange = (e: any) => {
    onIsRotateChange(e.target.checked)
  }

  return (
    <div className="control-panel">
      <h3>Control Panel</h3>
      <div className="control-item">
        <label>Text </label>
        <input type="text" value={text} onChange={handleTextChange} />
      </div>
      <div className="control-item">
        <label>Rotate </label>
        <input type="checkbox" checked={isRotate} onChange={handleRotateChange} style={{ marginRight: '15px' }} />
        <label>Color </label>
        <input type="color" value={color} onChange={e => handleColorChange(e.target.value)} style={{ marginRight: '20px' }} />
      </div>
      <div className="control-item">
        <label>X-axis </label>
        <input type="number" step="0.1" value={position.x} onChange={e => handlePositionChange(e, 'x')} style={{ width: '120px', marginRight: '10px' }} />
        <label>Y-axis </label>
        <input type="number" step="0.1" value={position.y} onChange={e => handlePositionChange(e, 'y')} style={{ width: '120px' }} />
      </div>
      <div className="control-item">
        <button onClick={onUndo} disabled={!canUndo} style={{ marginRight: '5px' }}>
          Undo
        </button>
        <button onClick={onRedo} disabled={!canRedo}>
          Redo
        </button>
      </div>
    </div>
  )
}
