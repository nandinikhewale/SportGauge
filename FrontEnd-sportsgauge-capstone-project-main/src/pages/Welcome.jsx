import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <Logo size="lg" className="mb-6" />
      </div>
      
      <div className="bg-sg-yellow rounded-t-[40px] px-8 pt-12 pb-10">
        <h2 className="text-black text-2xl font-bold mb-2 leading-tight">
          Upload you test videos for examination from anywhere
        </h2>
        <p className="text-black/70 text-sm mb-8">Get evaluated by certified professionals</p>
        <button 
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-sg-green text-black font-semibold rounded-full text-lg"
        >
          Continue
        </button>
      </div>
    </div>
  )
}