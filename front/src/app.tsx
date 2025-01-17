import './app.css'
import { APP_NAME } from '@/const'

export function App() {

  return (
    <>
      Le titre de l'application est: <strong>{APP_NAME}</strong>
      <button className="btn btn-primary">Test</button>
    </>
  )
}
