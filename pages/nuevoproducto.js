import React from 'react';
import Layout from '../components/Layout'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import {gql, useMutation} from '@apollo/client' 
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const NUEVO_PRODUCTO = gql`
  mutation newProduct($input: ProductInput){
  newProduct(input:$input){
      id
    name
    price
    stock
    create
  }
}
`;

const OBTENER_PRODUCTOS = gql`
  query getProducts {
      getProducts {
          id
          name
          price
          stock
      }
  }
`;

const NuevoProducto = () => {

    // routing
    const router = useRouter();

    // Mutation de apollo
    const [newProduct] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { newProduct } }) {
            // obtener el objeto de cache
            const { getProducts} = cache.readQuery({ query: OBTENER_PRODUCTOS });
            
            // reescribir ese objeto
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    getProducts: [...getProducts, newProduct]
                }
            });
        }
    });

    // Formulario para nuevos productos
    const formik = useFormik({
        initialValues: {
            name: '',
            stock: '',
            price: ''
        },
        validationSchema: Yup.object({
            name: Yup.string() 
                        .required('El nombre del producto es obligatorio'), 
            stock: Yup.number()
                        .required('Agrega la cantidad disponible')
                        .positive('No se aceptan números negativos')
                        .integer('La existencia deben ser números enteros'),
            price: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('No se aceptan números negativos')
        }), 
        onSubmit: async valores => {

            const { name, stock, price} = valores;

            try {
                const { data } = await newProduct({
                    variables: {
                        input: {
                            name,
                            stock,
                            price
                        }
                    }
                });

                console.log(data);

                // Mostrar una alerta
                Swal.fire(
                    'Creado',
                    'Se creó el producto correctamente',
                    'success'
                )

                // Redireccionar hacia los productos
                router.push('/productos'); 
            } catch (error) {
                console.log(error);
            }
        }
    })


    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Producto</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Nombre
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    placeholder="Nombre Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                />
                            </div>

                            { formik.touched.name && formik.errors.name ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.name}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                                    Cantidad Disponible
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="stock"
                                    type="number"
                                    placeholder="Cantidad Disponible"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.stock}
                                />
                            </div>

                            { formik.touched.stock && formik.errors.stock ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.stock}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                   Precio
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="price"
                                    type="number"
                                    placeholder="Precio del Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price}
                                />
                            </div>

                            { formik.touched.price && formik.errors.price ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.price}</p>
                                </div>
                            ) : null  }

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Agregar Nuevo Producto"
                            />
                    </form>
                </div>
            </div>
        </Layout>
     );
}
 
export default NuevoProducto;