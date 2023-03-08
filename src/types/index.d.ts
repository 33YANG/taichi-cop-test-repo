/**
 * All Types in this project
 */
namespace Types {
  /**
   * Github User Info Type
   */
  interface GithubUserInfo {
    [key: string]: any
  }
  /**
   * Text Props Type
   */
  interface TextPropsType {
    position: any
    text: string
    color: string
    isRotate: boolean
    onMouseEnter: (e: any) => void
    onMouseLeave: (e: any) => void
    onPositionChange: (newPosition: any) => void
  }
  /**
   * Controls Props Type
   */
  interface ControlsPropsType {
    text: string
    position: any
    color: string
    isRotate: boolean
    onIsRotateChange: (isRotate: boolean) => void
    onTextChange: (text: string) => void
    onPositionChange: (position: any) => void
    onColorChange: (color: string) => void
    onUndo: () => void
    onRedo: () => void
    canUndo: boolean
    canRedo: boolean
  }
}
