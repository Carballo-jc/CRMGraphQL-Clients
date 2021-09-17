import Layout from '../components/Layout';
import Pedido from '../components/Pedido';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client'

const OBTENER_PEDIDOS = gql`
  query getOrderBySeller {
      getOrderBySeller {
        id
        order {
          id
          cuantity
          name
        }
        client {
          id
          name
          lastName
          email
          phone
        }
        seller
        total
        status
      }
  }
`

const Pedidos = () => {

  const { data, loading, error} = useQuery(OBTENER_PEDIDOS);
  console.log(data)

  if(loading) return 'Cargando...';

  const {getOrderBySeller } = data;


  return (
    <div>
      <Layout>
          <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
  
          <Link href="/nuevopedido">
            <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Pedido</a>
          </Link>

          { getOrderBySeller.length === 0 ? (
            <p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
          ) : (
            getOrderBySeller.map( pedido => (
                <Pedido 
                  key={pedido.id}
                  pedido={pedido}
                />
            ))  
          )}
      </Layout>
    </div>
  )
}

export default Pedidos
