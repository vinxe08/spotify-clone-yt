import { getProviders, signIn } from 'next-auth/react'


function Login({ providers }) {
  return (
    <div className='flex flex-col items-center justify-center bg-black min-h-screen w-full'>
      <img src="https://links.papareact.com/9xl" alt="" className='w-[100px] mb-5' />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button 
            className='bg-[#18D860] text-white p-5 rounded-xl'
            onClick={() => signIn(provider.id, { callbackUrl: "/" }) }
          >
            Login with {provider.name}
          </button>
        </div>
      ))  }
    </div>
  )
}

export default Login

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers
    }
  }
}

// http://localhost:3000/api/auth/callback/
